import { useEffect, useState } from 'react'
import styles from './Celebration.module.css'

const CONFETTI_COLORS = ['#7c3aed','#f59e0b','#16a34a','#0891b2','#ec4899','#f97316']
const MESSAGES = [
  'Браво! 🎉',
  'Точно! ⭐',
  'Чудесно! 🌟',
  'Невероятно! 🚀',
  'Страхотно! 🎵',
  'Перфектно! 💫',
]

// All randomness is computed once per burst, so re-renders don't move particles.
function makeParticles() {
  const cx = window.innerWidth  / 2
  const cy = window.innerHeight / 2
  return Array.from({ length: 28 }, (_, i) => {
    const angle = Math.random() * 2 * Math.PI
    const dist  = 60 + Math.random() * 80
    return {
      id:    i,
      x:     cx + (Math.random() - 0.5) * 120,
      y:     cy + (Math.random() - 0.5) * 80,
      tx:    Math.cos(angle) * dist,
      ty:    Math.sin(angle) * dist,
      size:  6 + Math.random() * 8,
      delay: Math.random() * 0.15,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    }
  })
}

// Mount with a fresh `key` per answer: confetti and message are picked once.
export default function Celebration({ isCorrect, onNext }) {
  const [particles, setParticles] = useState(() => (isCorrect ? makeParticles() : []))
  const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)])

  useEffect(() => {
    if (!isCorrect) return
    const tParticles = setTimeout(() => setParticles([]), 900)
    const tNext      = setTimeout(onNext, 1400)
    return () => { clearTimeout(tParticles); clearTimeout(tNext) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className={styles.particle}
          aria-hidden="true"
          style={{
            left: p.x, top: p.y,
            width: p.size, height: p.size,
            background: p.color,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <div
        className={`${styles.toast} ${isCorrect ? styles.correct : styles.wrong}`}
        role="status"
      >
        <span>{isCorrect ? message : 'Опитай пак! 💪'}</span>
      </div>
    </>
  )
}
