import React from 'react'
import { getLedgerLines } from '../../data/notes.js'
import styles from './CheatSheet.module.css'

// ── SVG constants (mirror Staff.jsx) ─────────────────────────────────────────
const LINE_SPACING   = 22
const STEP           = 11
const STAFF_LEFT     = 80
const VIEW_X         = 52   // crop dead space left of clef
const NOTE_RX        = 10
const NOTE_RY        = 7
const NOTE_SPACING   = 54
const FIRST_NOTE_X   = 155
const PAD            = LINE_SPACING * 2
const LABEL_PAD      = 38   // extra space below content for solfège labels
const TREBLE_BOTTOM  = 222
const BASS_BOTTOM    = 172

function nY(pos, bottomY) { return bottomY - pos * STEP }

function MultiStaff({ notes, clef }) {
  const bottomY   = clef === 'treble' ? TREBLE_BOTTOM : BASS_BOTTOM
  const staffTopY = bottomY - 8 * STEP

  const firstNoteX  = clef === 'treble' ? FIRST_NOTE_X : FIRST_NOTE_X + 20
  const noteXs      = notes.map((_, i) => firstNoteX + i * NOTE_SPACING)
  const staffRight  = noteXs[noteXs.length - 1] + 60
  const VIEW_W      = staffRight + 20
  const noteYValues = notes.map(n => nY(n.pos, bottomY))

  const visTop       = Math.min(staffTopY, ...noteYValues) - PAD
  const contentBot   = Math.max(bottomY,   ...noteYValues) + PAD
  const labelY       = contentBot + 16
  const viewH        = labelY + 14 - visTop

  return (
    <svg
      viewBox={`${VIEW_X} ${visTop} ${VIEW_W - VIEW_X} ${viewH}`}
      style={{ width: '100%', maxWidth: VIEW_W - VIEW_X, display: 'block' }}
    >
      {/* Staff lines */}
      {[0, 2, 4, 6, 8].map(pos => (
        <line
          key={pos}
          x1={STAFF_LEFT} x2={staffRight}
          y1={nY(pos, bottomY)} y2={nY(pos, bottomY)}
          stroke="#4b5563" strokeWidth="1.5"
        />
      ))}

      {/* Clef — Bravura SMuFL: origin on G line for treble (U+E050), F line for bass (U+E062) */}
      {clef === 'treble'
        ? <text x={STAFF_LEFT - 8} y={bottomY - 2 * STEP} fontSize={4 * LINE_SPACING}
            fontFamily="'Bravura','Segoe UI Symbol',serif" fill="#1e1b4b">{'\uE050'}</text>
        : <text x={STAFF_LEFT - 4} y={bottomY - 6 * STEP} fontSize={4 * LINE_SPACING}
            fontFamily="'Bravura','Segoe UI Symbol',serif" fill="#1e1b4b">{'\uE062'}</text>
      }

      {/* Notes */}
      {notes.map((note, i) => {
        const nx      = noteXs[i]
        const ny      = nY(note.pos, bottomY)
        const stemUp  = note.pos < 4
        const stemX   = stemUp ? nx + NOTE_RX - 1 : nx - NOTE_RX + 1
        const stemY2  = stemUp ? ny - LINE_SPACING * 3 : ny + LINE_SPACING * 3
        const ledgers = getLedgerLines(note.pos)

        return (
          <g key={note.id}>
            {ledgers.map(lp => (
              <line
                key={lp}
                x1={nx - NOTE_RX - 6} x2={nx + NOTE_RX + 6}
                y1={nY(lp, bottomY)}  y2={nY(lp, bottomY)}
                stroke="#4b5563" strokeWidth="1.5"
              />
            ))}
            <line x1={stemX} y1={ny} x2={stemX} y2={stemY2} stroke="#1e1b4b" strokeWidth="1.8" />
            <ellipse
              cx={nx} cy={ny} rx={NOTE_RX} ry={NOTE_RY}
              fill="#1e1b4b"
              transform={`rotate(-15, ${nx}, ${ny})`}
            />
            <text
              x={nx} y={labelY}
              textAnchor="middle"
              fontSize="18" fontWeight="800"
              fontFamily="'Nunito',sans-serif"
              fill="#5b21b6"
            >
              {note.solfege}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function CheatSheet({ notes, onClose }) {
  const trebleNotes = notes.filter(n => n.clef === 'treble')
  const bassNotes   = notes.filter(n => n.clef === 'bass')

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>📖 Помощ</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
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
