import { useRef, useState, useCallback } from 'react'
import Soundfont from 'soundfont-player'

const INSTRUMENT_MAP = {
  violin: 'violin',
  harp:   'orchestral_harp',
  piano:  'acoustic_grand_piano',
}

export function useSound() {
  const acRef          = useRef(null)
  const instrumentRef  = useRef(null)
  const currentNameRef = useRef(null)
  const activeNodeRef  = useRef(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady]     = useState(false)

  const load = useCallback(async (instrumentKey) => {
    const name = INSTRUMENT_MAP[instrumentKey]
    if (currentNameRef.current === name && ready) return

    setLoading(true)
    setReady(false)

    try {
      if (!acRef.current) {
        acRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      // Resume context in case it was suspended (browser policy)
      if (acRef.current.state === 'suspended') {
        await acRef.current.resume()
      }

      instrumentRef.current = await Soundfont.instrument(acRef.current, name, {
        gain: 3,
      })
      currentNameRef.current = name
      setReady(true)
    } catch (err) {
      console.error('Soundfont load error:', err)
    } finally {
      setLoading(false)
    }
  }, [ready])

  const stop = useCallback(() => {
    try { activeNodeRef.current?.stop() } catch (_) {}
    activeNodeRef.current = null
  }, [])

  const play = useCallback((note) => {
    if (!instrumentRef.current) return
    stop()
    const doPlay = () => {
      activeNodeRef.current = instrumentRef.current.play(note, 0, { duration: 0.85 })
    }
    if (acRef.current?.state === 'suspended') {
      acRef.current.resume().then(doPlay)
    } else {
      doPlay()
    }
  }, [stop])

  return { load, play, stop, loading, ready }
}
