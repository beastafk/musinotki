import { useEffect } from 'react'
import {
  LINE_SPACING, STEP, VIEW_X,
  bottomYFor, noteY,
} from '../staff/geometry.js'
import { StaffLines, Clef, LedgerLines, Note } from '../staff/notation.jsx'
import styles from './CheatSheet.module.css'

const STAFF_LEFT   = 80
const NOTE_RX      = 10
const NOTE_RY      = 7
const NOTE_SPACING = 54
const FIRST_NOTE_X = 155
const PAD          = LINE_SPACING * 2

function MultiStaff({ notes, clef }) {
  const bottomY    = bottomYFor(clef)
  const firstNoteX = clef === 'treble' ? FIRST_NOTE_X : FIRST_NOTE_X + 20
  const noteXs     = notes.map((_, i) => firstNoteX + i * NOTE_SPACING)
  const staffRight = noteXs[noteXs.length - 1] + 60
  const viewW      = staffRight + 20
  const ys         = notes.map(n => noteY(n.pos, bottomY))

  const visTop     = Math.min(bottomY - 8 * STEP, ...ys) - PAD
  const contentBot = Math.max(bottomY, ...ys) + PAD
  const labelY     = contentBot + 16
  const viewH      = labelY + 14 - visTop

  return (
    <svg
      viewBox={`${VIEW_X} ${visTop} ${viewW - VIEW_X} ${viewH}`}
      style={{ width: '100%', maxWidth: viewW - VIEW_X, display: 'block' }}
      role="img"
      aria-label={`Ноти: ${notes.map(n => n.solfege).join(', ')}`}
    >
      <StaffLines bottomY={bottomY} x1={STAFF_LEFT} x2={staffRight} />
      <Clef clef={clef} staffLeft={STAFF_LEFT} bottomY={bottomY} />
      {notes.map((note, i) => (
        <g key={note.id}>
          <LedgerLines pos={note.pos} x={noteXs[i]} bottomY={bottomY} halfWidth={NOTE_RX + 6} />
          <Note pos={note.pos} x={noteXs[i]} bottomY={bottomY} rx={NOTE_RX} ry={NOTE_RY} stemLength={LINE_SPACING * 3} stemWidth={1.8} />
          <text
            x={noteXs[i]} y={labelY}
            textAnchor="middle"
            fontSize="18" fontWeight="800"
            fontFamily="inherit"
            fill="#5b21b6"
          >
            {note.solfege}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function CheatSheet({ notes, onClose }) {
  const trebleNotes = notes.filter(n => n.clef === 'treble')
  const bassNotes   = notes.filter(n => n.clef === 'bass')

  // Close with Escape
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.card}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cheatsheet-title"
      >
        <div className={styles.header}>
          <h2 className={styles.title} id="cheatsheet-title">📖 Помощ</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Затвори" autoFocus>✕</button>
        </div>

        {trebleNotes.length > 0 && (
          <div className={styles.section}>
            <span className={styles.clefLabel}>Ключ Сол</span>
            <MultiStaff notes={trebleNotes} clef="treble" />
          </div>
        )}

        {bassNotes.length > 0 && (
          <div className={styles.section}>
            <span className={styles.clefLabel}>Ключ Фа</span>
            <MultiStaff notes={bassNotes} clef="bass" />
          </div>
        )}
      </div>
    </div>
  )
}
