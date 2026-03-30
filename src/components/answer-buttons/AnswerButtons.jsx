import React from 'react'
import styles from './AnswerButtons.module.css'

export default function AnswerButtons({ answers, selected, correctAnswer, onAnswer }) {
  const answered = selected !== null

  function stateClass(label) {
    if (!answered) return ''
    if (label === correctAnswer) return styles.correct
    if (label === selected)      return styles.wrong
    return styles.dimmed
  }

  const gridClass = answers.length <= 4
    ? `${styles.grid} ${styles.gridSingle}`
    : styles.grid

  return (
    <div className={gridClass}>
      {answers.map(label => (
        <button
          key={label}
          className={`${styles.btn} ${stateClass(label)}`}
          onClick={() => !answered && onAnswer(label)}
          disabled={answered}
        >
          {label}
          {answered && label === correctAnswer && <span className={styles.tick}>✓</span>}
          {answered && label === selected && label !== correctAnswer && <span className={styles.cross}>✗</span>}
        </button>
      ))}
    </div>
  )
}
