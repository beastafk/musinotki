import {
  LINE_SPACING, STEP, VIEW_X,
  bottomYFor, noteY, clefExtent,
} from './geometry.js'
import { StaffLines, Clef, LedgerLines, Note } from './notation.jsx'

const STAFF_LEFT  = 95
const STAFF_RIGHT = 460
const VIEW_W      = STAFF_RIGHT + 20
const NOTE_X      = 290
const NOTE_RX     = 12
const NOTE_RY     = 8
const PAD         = LINE_SPACING * 1.2

export default function Staff({ note, animate = true }) {
  if (!note) return null

  const bottomY = bottomYFor(note.clef)
  const clef    = clefExtent(note.clef, bottomY)
  const nY      = noteY(note.pos, bottomY)

  // Crop viewBox to tightly fit note + staff + clef with consistent padding
  const visTop = Math.min(bottomY - 8 * STEP, nY, clef.top) - PAD
  const visBot = Math.max(bottomY, nY, clef.bottom) + PAD

  return (
    <svg
      viewBox={`${VIEW_X} ${visTop} ${VIEW_W - VIEW_X} ${visBot - visTop}`}
      style={{ width: '100%', maxWidth: 680, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="Нотен стан с една нота"
    >
      <StaffLines bottomY={bottomY} x1={STAFF_LEFT} x2={STAFF_RIGHT} />
      <Clef clef={note.clef} staffLeft={STAFF_LEFT} bottomY={bottomY} />
      <LedgerLines pos={note.pos} x={NOTE_X} bottomY={bottomY} halfWidth={NOTE_RX + 8} />
      <g style={animate ? { animation: 'pulse-note 1.8s ease-in-out infinite' } : undefined}>
        <Note pos={note.pos} x={NOTE_X} bottomY={bottomY} rx={NOTE_RX} ry={NOTE_RY} stemLength={LINE_SPACING * 3.2} />
      </g>
    </svg>
  )
}
