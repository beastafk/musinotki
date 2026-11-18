// Shared SVG notation primitives for Staff and CheatSheet.
import { getLedgerLines } from '../../data/notes.js'
import { LINE_SPACING, INK, LINE_INK, noteY } from './geometry.js'

// SMuFL font size: 4 × staff space — calibrated for Bravura
const CLEF_FONT  = 4 * LINE_SPACING
const MUSIC_FONT = "'Bravura', 'Segoe UI Symbol', serif"

export function StaffLines({ bottomY, x1, x2 }) {
  return [0, 2, 4, 6, 8].map(pos => (
    <line
      key={pos}
      x1={x1} x2={x2}
      y1={noteY(pos, bottomY)} y2={noteY(pos, bottomY)}
      stroke={LINE_INK} strokeWidth="1.5"
    />
  ))
}

export function Clef({ clef, staffLeft, bottomY }) {
  return clef === 'treble'
    ? <text x={staffLeft - 8} y={noteY(2, bottomY)} fontSize={CLEF_FONT} fontFamily={MUSIC_FONT} fill={INK}>{''}</text>
    : <text x={staffLeft - 4} y={noteY(6, bottomY)} fontSize={CLEF_FONT} fontFamily={MUSIC_FONT} fill={INK}>{''}</text>
}

export function LedgerLines({ pos, x, bottomY, halfWidth }) {
  return getLedgerLines(pos).map(lp => (
    <line
      key={lp}
      x1={x - halfWidth} x2={x + halfWidth}
      y1={noteY(lp, bottomY)} y2={noteY(lp, bottomY)}
      stroke={LINE_INK} strokeWidth="1.5"
    />
  ))
}

// Quarter note: tilted head + stem (up below the middle line, down from it)
export function Note({ pos, x, bottomY, rx, ry, stemLength, stemWidth = 2 }) {
  const y      = noteY(pos, bottomY)
  const stemUp = pos < 4
  const stemX  = stemUp ? x + rx - 1 : x - rx + 1
  return (
    <>
      <line x1={stemX} y1={y} x2={stemX} y2={stemUp ? y - stemLength : y + stemLength} stroke={INK} strokeWidth={stemWidth} />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={INK} transform={`rotate(-15, ${x}, ${y})`} />
    </>
  )
}
