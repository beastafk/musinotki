import React from 'react'
import styles from './InstrumentSelect.module.css'

const INSTRUMENTS = [
  {
    key:   'violin',
    emoji: '🎻',
    name:  'Цигулка',
    desc:  'Отворени струни и първа позиция',
    color: '#fef3c7',
    border:'#f59e0b',
  },
  {
    key:   'harp',
    emoji: '🪉',
    name:  'Арфа',
    desc:  'До³ – До⁵ · двете ръце',
    color: '#e0f2fe',
    border:'#0891b2',
  },
  {
    key:   'piano',
    emoji: '🎹',
    name:  'Пиано',
    desc:  'До³ – До⁵ · двете ръце',
    color: '#f3e8ff',
    border:'#9333ea',
  },
]

export default function InstrumentSelect({ onSelect }) {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🎶 Музинотки 🎶</h1>
      <p className={styles.sub}>Избери своя инструмент и се упражнявай с нотите!</p>
      <div className={styles.cards}>
        {INSTRUMENTS.map(inst => (
          <button
            key={inst.key}
            className={styles.card}
            style={{ '--card-bg': inst.color, '--card-border': inst.border }}
            onClick={() => onSelect(inst.key)}
          >
            <span className={styles.emoji}>{inst.emoji}</span>
            <span className={styles.name}>{inst.name}</span>
            <span className={styles.desc}>{inst.desc}</span>
            <span className={styles.play}>Играй →</span>
          </button>
        ))}
      </div>
      <p className={styles.hint}>
        Научи имената на нотите <br />
        в <strong>солфеж</strong>: До · Ре · Ми · Фа · Сол · Ла · Си
      </p>
    </div>
  )
}
