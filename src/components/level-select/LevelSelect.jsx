import React from 'react'
import styles from './LevelSelect.module.css'

const INSTRUMENT_META = {
  violin: { emoji: '🎻', name: 'Цигулка' },
  harp:   { emoji: '🪉', name: 'Арфа' },
  piano:  { emoji: '🎹', name: 'Пиано' },
}

const STAR_COLORS = [
  { bg: '#dcfce7', border: '#16a34a' }, // ⭐   green
  { bg: '#fef9c3', border: '#ca8a04' }, // ⭐⭐  yellow
  { bg: '#ede9fe', border: '#7c3aed' }, // ⭐⭐⭐ purple
]

function Stars({ count }) {
  return <span className={styles.stars}>{'⭐'.repeat(count)}</span>
}

export default function LevelSelect({ instrument, levels, onSelect, onBack }) {
  const meta = INSTRUMENT_META[instrument]

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <button className={styles.backBtn} onClick={onBack}>← Назад</button>
      </div>

      <div className={styles.heading}>
        <span className={styles.instrEmoji}>{meta.emoji}</span>
        <h1 className={styles.title}>{meta.name}</h1>
        <p className={styles.sub}>Избери ниво</p>
      </div>

      <div className={styles.cards}>
        {levels.map((level, i) => {
          const colors = STAR_COLORS[Math.min(i, STAR_COLORS.length - 1)]
          return (
            <button
              key={level.id}
              className={styles.card}
              style={{ '--card-bg': colors.bg, '--card-border': colors.border }}
              onClick={() => onSelect(level)}
            >
              <Stars count={level.stars} />
              <span className={styles.label}>{level.label}</span>
              <span className={styles.desc}>{level.desc}</span>
              <span className={styles.play}>Играй →</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
