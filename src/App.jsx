import React, { useState } from 'react'
import InstrumentSelect from './components/instrument-select/InstrumentSelect.jsx'
import LevelSelect      from './components/level-select/LevelSelect.jsx'
import Game             from './components/game/Game.jsx'
import { LEVELS }       from './data/levels.js'
import { useSound }     from './hooks/useSound.js'

export default function App() {
  const [instrument, setInstrument] = useState(null)
  const [level,      setLevel]      = useState(null)
  const sound = useSound()

  function handleSelectInstrument(key) {
    setInstrument(key)
    sound.prefetch(key)
  }

  if (!instrument) {
    return <InstrumentSelect onSelect={handleSelectInstrument} />
  }

  if (!level) {
    return (
      <LevelSelect
        instrument={instrument}
        levels={LEVELS[instrument]}
        onSelect={setLevel}
        onBack={() => setInstrument(null)}
      />
    )
  }

  return (
    <Game
      instrument={instrument}
      level={level}
      sound={sound}
      onBack={() => setLevel(null)}
    />
  )
}
