import { useRef, useState, useCallback } from 'react'
import { INSTRUMENT_BY_KEY } from '../data/instruments.js'

// smplr is loaded on demand so it doesn't weigh down the first page load.
let smplrPromise = null
function loadSmplr() {
  smplrPromise ??= import('smplr').then(({ Soundfont, CacheStorage }) => ({
    Soundfont,
    storage: new CacheStorage(),
  }))
  return smplrPromise
}

// One AudioContext for the whole app, created on first use.
let audioContext = null
function getAudioContext() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)()
  return audioContext
}

// iOS/iPadOS mutes Web Audio when the ring/silent switch is on. Asking for a
// "playback" audio session (Safari 17+) or playing a silent <audio> element
// (older Safari) routes Web Audio like media playback, so it is not muted.
let iosUnlocked = false
function unlockIOSAudio() {
  if (iosUnlocked) return
  iosUnlocked = true
  try {
    if (navigator.audioSession) {
      navigator.audioSession.type = 'playback'
      return
    }
    const el = document.createElement('audio')
    el.setAttribute('x-webkit-airplay', 'deny')
    el.preload = 'auto'
    el.loop = true
    el.src = silentWavDataUri()
    el.play().catch(() => {})
  } catch {
    // best effort only
  }
}

function silentWavDataUri() {
  // 0.1 s of 8 kHz mono 8-bit silence
  const samples = 800
  const bytes = new Uint8Array(44 + samples)
  const view = new DataView(bytes.buffer)
  const ascii = (off, s) => [...s].forEach((c, i) => bytes[off + i] = c.charCodeAt(0))
  ascii(0, 'RIFF'); view.setUint32(4, 36 + samples, true); ascii(8, 'WAVE')
  ascii(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true)
  view.setUint16(22, 1, true); view.setUint32(24, 8000, true); view.setUint32(28, 8000, true)
  view.setUint16(32, 1, true); view.setUint16(34, 8, true)
  ascii(36, 'data'); view.setUint32(40, samples, true)
  bytes.fill(128, 44)
  let bin = ''
  bytes.forEach(b => bin += String.fromCharCode(b))
  return `data:audio/wav;base64,${btoa(bin)}`
}

// Loaded (or loading) instruments, keyed by instrument key. Failed loads are
// evicted so the next attempt retries instead of reusing a broken instance.
const instruments = new Map()
function getInstrument(key) {
  let entry = instruments.get(key)
  if (!entry) {
    entry = { sf: null }
    entry.promise = loadSmplr()
      .then(({ Soundfont, storage }) => {
        entry.sf = Soundfont(getAudioContext(), { instrument: INSTRUMENT_BY_KEY[key].soundfont, storage })
        return entry.sf.load
      })
      .then(() => entry.sf)
      .catch(err => {
        if (smplrPromise && !entry.sf) smplrPromise = null // let a failed chunk download retry
        instruments.delete(key)
        throw err
      })
    instruments.set(key, entry)
  }
  return entry
}

export function useSound() {
  const [unlocked,   setUnlocked]   = useState(false)
  const [loadedKey,  setLoadedKey]  = useState(null)
  const [loadingKey, setLoadingKey] = useState(null)
  const [error,      setError]      = useState(false)
  const stopRef = useRef(null)

  // Start downloading samples in the background (no user gesture needed).
  const prefetch = useCallback((key) => {
    if (!INSTRUMENT_BY_KEY[key]) return
    getInstrument(key).promise.catch(() => {})
  }, [])

  // Must be called from a user gesture: resumes audio and loads the instrument.
  const unlock = useCallback(async (key) => {
    const ctx = getAudioContext()
    unlockIOSAudio()
    setUnlocked(true)
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})

    if (instruments.has(key) && loadedKey === key) return
    setLoadingKey(key)
    setError(false)
    try {
      await getInstrument(key).promise
      setLoadedKey(key)
    } catch (err) {
      console.error('Soundfont load error:', err)
      setError(true)
    } finally {
      setLoadingKey(k => (k === key ? null : k))
    }
  }, [loadedKey])

  const stop = useCallback(() => {
    try { stopRef.current?.() } catch { /* already stopped */ }
    stopRef.current = null
  }, [])

  const play = useCallback((key, note) => {
    const entry = instruments.get(key)
    if (!entry?.sf || loadedKey !== key) return
    stop()
    const ctx = getAudioContext()
    const doPlay = () => { stopRef.current = entry.sf.start({ note, duration: 0.85 }) }
    if (ctx.state === 'suspended') ctx.resume().then(doPlay, () => {})
    else doPlay()
  }, [loadedKey, stop])

  return {
    prefetch, unlock, play, stop,
    unlocked,
    isReady:   (key) => loadedKey === key,
    isLoading: (key) => loadingKey === key,
    error,
  }
}
