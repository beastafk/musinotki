import React from 'react'
import styles from './ScoreBadge.module.css'

export default function ScoreBadge({ score, streak, totalAnswered }) {
  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0

  return (
    <div className={styles.row}>
      <div className={styles.badge}>
        <span className={styles.icon}>⭐</span>
        <span className={styles.value}>{score}</span>
        <span className={styles.label}>точки</span>
      </div>
      {streak >= 3 && (
        <div className={`${styles.badge} ${styles.fire}`}>
          <span className={styles.icon}>🔥</span>
          <span className={styles.value}>{streak}</span>
          <span className={styles.label}>поредица</span>
        </div>
      )}
      {totalAnswered > 0 && (
        <div className={styles.badge}>
          <span className={styles.icon}>🎯</span>
          <span className={styles.value}>{accuracy}%</span>
          <span className={styles.label}>точност</span>
        </div>
      )}
    </div>
  )
}
