import React, { useState } from 'react'
import InstrumentSelect from './components/instrument-select/InstrumentSelect.jsx'
import LevelSelect      from './components/level-select/LevelSelect.jsx'
import Game             from './components/game/Game.jsx'
import { LEVELS }       from './data/levels.js'

export default function App() {
  const [instrument, setInstrument] = useState(null)
  const [level,      setLevel]      = useState(null)

  if (!instrument) {
    return <InstrumentSelect onSelect={setInstrument} />
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
      onBack={() => setLevel(null)}
    />
  )
}
