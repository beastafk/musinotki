import { useRef, useState, useCallback } from 'react'
import { Soundfont, CacheStorage } from 'smplr'

const INSTRUMENT_MAP = {
  violin: 'violin',
  harp:   'orchestral_harp',
  piano:  'acoustic_grand_piano',
}

const cache = new CacheStorage()

export function useSound() {
  const acRef          = useRef(new (window.AudioContext || window.webkitAudioContext)())
  const instrumentRef  = useRef(null)
  const prefetchRef    = useRef(null)  // { name, sf, promise }
  const currentNameRef = useRef(null)
  const stopCurrentRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady]     = useState(false)

  // Called on instrument select — downloads samples into cache in the background
  const prefetch = useCallback((instrumentKey) => {
    const name = INSTRUMENT_MAP[instrumentKey]
    if (!name) return
    const sf = new Soundfont(acRef.current, { instrument: name, storage: cache })
    prefetchRef.current = { name, sf, promise: sf.load.catch(() => {}) }
  }, [])

  const load = useCallback(async (instrumentKey) => {
    const name = INSTRUMENT_MAP[instrumentKey]
    if (currentNameRef.current === name && ready) return

    setLoading(true)
    setReady(false)
    instrumentRef.current = null

    try {
      if (acRef.current.state === 'suspended') {
        await acRef.current.resume()
      }

      // Reuse the prefetched instance if it matches — avoids duplicate schedulers
      let sf
      if (prefetchRef.current?.name === name) {
        await prefetchRef.current.promise
        sf = prefetchRef.current.sf
      } else {
        sf = new Soundfont(acRef.current, { instrument: name, storage: cache })
        await sf.load
      }

      instrumentRef.current = sf
      currentNameRef.current = name
      setReady(true)
    } catch (err) {
      console.error('Soundfont load error:', err)
    } finally {
      setLoading(false)
    }
  }, [ready])

  const stop = useCallback(() => {
    try { stopCurrentRef.current?.() } catch (_) {}
    stopCurrentRef.current = null
  }, [])

  const play = useCallback((note) => {
    if (!instrumentRef.current) return
    stop()
    const doPlay = () => {
      stopCurrentRef.current = instrumentRef.current.start({ note, duration: 0.85 })
    }
    if (acRef.current.state === 'suspended') {
      acRef.current.resume().then(doPlay)
    } else {
      doPlay()
    }
  }, [stop])

  return { prefetch, load, play, stop, loading, ready }
}
