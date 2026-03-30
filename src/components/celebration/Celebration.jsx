import React, { useEffect, useState } from 'react'
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

function Particle({ x, y, color }) {
  const angle  = Math.random() * 360
  const dist   = 60 + Math.random() * 80
  const tx     = Math.cos((angle * Math.PI) / 180) * dist
  const ty     = Math.sin((angle * Math.PI) / 180) * dist
  const size   = 6 + Math.random() * 8
  const delay  = Math.random() * 0.15

  return (
    <div
      className={styles.particle}
      style={{
        left: x, top: y,
        width: size, height: size,
        background: color,
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}

export default function Celebration({ show, isCorrect, onNext }) {
  const [particles, setParticles] = useState([])
  const [message,   setMessage]   = useState('')

  useEffect(() => {
    if (show && isCorrect) {
      const cx = window.innerWidth  / 2
      const cy = window.innerHeight / 2
      const list = Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x:  cx + (Math.random() - 0.5) * 120,
        y:  cy + (Math.random() - 0.5) * 80,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      }))
      setParticles(list)
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
      const tParticles = setTimeout(() => setParticles([]), 900)
      const tNext      = setTimeout(() => onNext(), 1400)
      return () => { clearTimeout(tParticles); clearTimeout(tNext) }
    }
  }, [show, isCorrect])

  if (!show) return null

  return (
    <>
      {/* Confetti particles — fixed overlay */}
      {particles.map(p => (
        <Particle key={p.id} x={p.x} y={p.y} color={p.color} />
      ))}
      {/* Toast — rendered inline by the parent, not fixed */}
      <div className={`${styles.toast} ${isCorrect ? styles.correct : styles.wrong}`}>
        <span>{isCorrect ? message : 'Опитай пак! 💪'}</span>
      </div>
    </>
  )
}
