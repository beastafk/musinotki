import { useEffect } from 'react'
import InstrumentSelect      from './components/instrument-select/InstrumentSelect.jsx'
import LevelSelect           from './components/level-select/LevelSelect.jsx'
import Game                  from './components/game/Game.jsx'
import { LEVELS }            from './data/levels.js'
import { INSTRUMENT_BY_KEY } from './data/instruments.js'
import { useSound }          from './hooks/useSound.js'
import { useRoute }          from './hooks/useRoute.js'

export default function App() {
  const { parts, navigate, up } = useRoute()
  const sound = useSound()
  const { prefetch } = sound

  // Ignore unknown instruments/levels in the URL
  const instrument = INSTRUMENT_BY_KEY[parts[0]] ? parts[0] : null
  const level      = instrument ? LEVELS[instrument].find(l => l.id === parts[1]) ?? null : null

  useEffect(() => {
    if (instrument) prefetch(instrument)
  }, [instrument, prefetch])

  if (!instrument) {
    return <InstrumentSelect onSelect={key => navigate([key])} />
  }

  if (!level) {
    return (
      <LevelSelect
        instrument={instrument}
        levels={LEVELS[instrument]}
        onSelect={l => navigate([instrument, l.id])}
        onBack={() => up([])}
      />
    )
  }

  return (
    <Game
      key={level.id}
      instrument={instrument}
      level={level}
      sound={sound}
      onBack={() => up([instrument])}
    />
  )
}
