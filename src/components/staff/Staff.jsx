import React from 'react'
import { getLedgerLines } from '../../data/notes.js'

// ── SVG layout constants ─────────────────────────────────────────────────────
const LINE_SPACING    = 22   // px between adjacent staff lines
const STEP            = 11   // px per diatonic step  (LINE_SPACING / 2)
const STAFF_LEFT      = 95
const STAFF_RIGHT     = 460
const VIEW_X          = 52   // left edge of viewBox — crops dead space left of clef
const VIEW_W          = STAFF_RIGHT + 20  // right edge
const NOTE_RX         = 12   // note-head horizontal radius
const NOTE_RY         = 8    // note-head vertical radius
const STEM_LENGTH     = LINE_SPACING * 3.2
const NOTE_X          = 290  // horizontal centre of the note

// Treble clef: E4 = bottom line
const TREBLE_VIEW_H  = 290
const TREBLE_BOTTOM  = 222  // y of E4

// Bass clef: G2 = bottom line
const BASS_VIEW_H    = 230
const BASS_BOTTOM    = 172  // y of G2

// ── helpers ──────────────────────────────────────────────────────────────────

function noteY(pos, bottomY) {
  return bottomY - pos * STEP
}

function lineY(linePos, bottomY) {
  // Staff lines are at even positions 0,2,4,6,8
  return noteY(linePos, bottomY)
}

// ── sub-components ───────────────────────────────────────────────────────────

function StaffLines({ bottomY }) {
  return (
    <>
      {[0, 2, 4, 6, 8].map(pos => (
        <line
          key={pos}
          x1={STAFF_LEFT}
          y1={lineY(pos, bottomY)}
          x2={STAFF_RIGHT}
          y2={lineY(pos, bottomY)}
          stroke="#4b5563"
          strokeWidth="1.5"
        />
      ))}
    </>
  )
}

function LedgerLines({ pos, bottomY }) {
  const ledgers = getLedgerLines(pos)
  if (!ledgers.length) return null
  return (
    <>
      {ledgers.map(lp => (
        <line
          key={lp}
          x1={NOTE_X - NOTE_RX - 8}
          y1={lineY(lp, bottomY)}
          x2={NOTE_X + NOTE_RX + 8}
          y2={lineY(lp, bottomY)}
          stroke="#4b5563"
          strokeWidth="1.5"
        />
      ))}
    </>
  )
}

function NoteHead({ pos, bottomY, animate }) {
  const y         = noteY(pos, bottomY)
  const stemUp    = pos < 4
  const stemX     = stemUp ? NOTE_X + NOTE_RX - 1 : NOTE_X - NOTE_RX + 1
  const stemY1    = y
  const stemY2    = stemUp ? y - STEM_LENGTH : y + STEM_LENGTH

  return (
    <g style={animate ? { animation: 'pulse-note 1.8s ease-in-out infinite' } : {}}>
      {/* Stem */}
      <line
        x1={stemX} y1={stemY1}
        x2={stemX} y2={stemY2}
        stroke="#1e1b4b"
        strokeWidth="2"
      />
      {/* Note head */}
      <ellipse
        cx={NOTE_X}
        cy={y}
        rx={NOTE_RX}
        ry={NOTE_RY}
        fill="#1e1b4b"
        transform={`rotate(-15, ${NOTE_X}, ${y})`}
      />
    </g>
  )
}

// SMuFL font size: 4 × staff space (LINE_SPACING) — calibrated for Bravura
const CLEF_FONT = 4 * LINE_SPACING
const MUSIC_FONT = "'Bravura', 'Segoe UI Symbol', serif"

function TrebleClef({ bottomY }) {
  // SMuFL gClef (U+E050): origin sits on the G line (2nd from bottom, pos=2)
  return (
    <text x={STAFF_LEFT - 8} y={bottomY - 2 * STEP}
      fontSize={CLEF_FONT} fontFamily={MUSIC_FONT} fill="#1e1b4b">
      {'\uE050'}
    </text>
  )
}

function BassClef({ bottomY }) {
  // SMuFL fClef (U+E062): origin sits on the F line (4th from bottom, pos=6)
  return (
    <text x={STAFF_LEFT - 4} y={bottomY - 6 * STEP}
      fontSize={CLEF_FONT} fontFamily={MUSIC_FONT} fill="#1e1b4b">
      {'\uE062'}
    </text>
  )
}

// ── main component ────────────────────────────────────────────────────────────

const PAD = LINE_SPACING * 1.2

// Bravura gClef (U+E050) extents relative to G line (origin):
//   ascends ~5 staff spaces above, descends ~2 staff spaces below
const trebleClefTop = (bY) => (bY - 2 * STEP) - 5 * LINE_SPACING
const trebleClefBot = (bY) => (bY - 2 * STEP) + 2 * LINE_SPACING

// Bravura fClef (U+E062) extents relative to F line (origin):
//   ascends ~1 staff space above, descends ~1 staff space below
const bassClefTop = (bY) => (bY - 6 * STEP) - 1 * LINE_SPACING
const bassClefBot = (bY) => (bY - 6 * STEP) + 1 * LINE_SPACING

export default function Staff({ note, animate = true }) {
  if (!note) return null

  const isTreble = note.clef === 'treble'
  const bottomY  = isTreble ? TREBLE_BOTTOM : BASS_BOTTOM
  const staffTopY = bottomY - 8 * STEP  // y of top staff line

  // Crop viewBox to tightly fit note + staff + clef with consistent padding
  const nY      = noteY(note.pos, bottomY)
  const clefTop = isTreble ? trebleClefTop(bottomY) : bassClefTop(bottomY)
  const clefBot = isTreble ? trebleClefBot(bottomY) : bassClefBot(bottomY)
  const visTop  = Math.min(staffTopY, nY, clefTop) - PAD
  const visBot  = Math.max(bottomY,   nY, clefBot) + PAD

  return (
    <svg
      viewBox={`${VIEW_X} ${visTop} ${VIEW_W - VIEW_X} ${visBot - visTop}`}
      style={{ width: '100%', maxWidth: 680, display: 'block', margin: '0 auto' }}
      aria-label="Нотен стан"
    >
      <StaffLines bottomY={bottomY} />
      {isTreble ? <TrebleClef bottomY={bottomY} /> : <BassClef bottomY={bottomY} />}
      <LedgerLines pos={note.pos} bottomY={bottomY} />
      <NoteHead    pos={note.pos} bottomY={bottomY} animate={animate} />
    </svg>
  )
}
