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
    <div className={gridClass} role="group" aria-label="Отговори">
      {answers.map((label, i) => (
        <button
          key={label}
          className={`${styles.btn} ${stateClass(label)}`}
          onClick={() => onAnswer(label)}
          disabled={answered}
          aria-keyshortcuts={String(i + 1)}
        >
          {label}
          <span className={styles.key} aria-hidden="true">{i + 1}</span>
          {answered && label === correctAnswer && <span className={styles.tick} aria-label="верен отговор">✓</span>}
          {answered && label === selected && label !== correctAnswer && <span className={styles.cross} aria-label="грешен отговор">✗</span>}
        </button>
      ))}
    </div>
  )
}
