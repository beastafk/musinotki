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
      <a
        className={styles.githubLink}
        href="https://github.com/beastafk/musinotki"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg className={styles.githubIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
        GitHub · beastafk/musinotki
      </a>
    </div>
  )
}
