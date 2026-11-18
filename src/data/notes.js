// Diatonic index: C=0, D=1, E=2, F=3, G=4, A=5, B=6
const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const NOTE_INDEX   = Object.fromEntries(NOTE_LETTERS.map((l, i) => [l, i]))

export const SOLFEGE = {
  C: 'До', D: 'Ре', E: 'Ми', F: 'Фа', G: 'Сол', A: 'Ла', B: 'Си',
}

// Absolute diatonic step (for position math)
function diatonicStep(letter, octave) {
  return octave * 7 + NOTE_INDEX[letter]
}

// Treble clef: E4 = bottom line = position 0
const TREBLE_REF = diatonicStep('E', 4)
// Bass clef: G2 = bottom line = position 0
const BASS_REF   = diatonicStep('G', 2)

// How many diatonic steps above the clef's bottom reference line
export function treblePos(letter, octave) {
  return diatonicStep(letter, octave) - TREBLE_REF
}

export function bassPos(letter, octave) {
  return diatonicStep(letter, octave) - BASS_REF
}

// Build a note object, e.g. makeNote('G', 3, 'treble')
export function makeNote(letter, octave, clef) {
  return {
    id:      `${letter}${octave}_${clef}`,
    letter,
    octave,
    solfege: SOLFEGE[letter],
    sfNote:  `${letter}${octave}`,
    clef,
    pos:     clef === 'treble' ? treblePos(letter, octave) : bassPos(letter, octave),
  }
}

// All natural notes from `from` to `to` inclusive, e.g. noteRange('G3', 'A5', 'treble')
export function noteRange(from, to, clef) {
  const parse = s => diatonicStep(s[0], Number(s.slice(1)))
  const notes = []
  for (let step = parse(from); step <= parse(to); step++) {
    notes.push(makeNote(NOTE_LETTERS[step % 7], Math.floor(step / 7), clef))
  }
  return notes
}

// Violin level 1: 4 open strings (G3, D4, A4, E5), treble clef
export const VIOLIN_NOTES = ['G3', 'D4', 'A4', 'E5'].map(n => makeNote(n[0], Number(n[1]), 'treble'))

// Violin first position, natural notes only: G3 (open Сол string) up to
// B5 (4th finger on Ми string), treble clef.
export const VIOLIN_FIRST_POSITION_NOTES = noteRange('G3', 'B5', 'treble')

// Violin level 2: every first-position place of the open-string names
// Сол · Ре · Ла · Ми — open strings plus fingered notes, e.g. Сол below the
// staff (G3, open) and on the 2nd line (G4, 3rd finger on Ре).
// 4th-finger notes (D4, A4, E5) sound and look the same as the open strings.
export const VIOLIN_STRING_NAME_NOTES = VIOLIN_FIRST_POSITION_NOTES
  .filter(n => ['G', 'D', 'A', 'E'].includes(n.letter))

// Harp: До–До on each clef
//   Bass clef:   C3–C4  (C4 shown on bass as first ledger line above)
//   Treble clef: C4–C5  (C4 shown on treble as first ledger line below)
// Middle C appears on both clefs — an important thing to learn!
export const HARP_BASS_NOTES   = noteRange('C3', 'C4', 'bass')
export const HARP_TREBLE_NOTES = noteRange('C4', 'C5', 'treble')
export const HARP_NOTES        = [...HARP_BASS_NOTES, ...HARP_TREBLE_NOTES]

// Ledger lines needed to display a note at a given staff position
// Staff lines are at even positions 0,2,4,6,8. Ledger lines extend: -2,-4,... and 10,12,...
export function getLedgerLines(pos) {
  const lines = []
  for (let p = -2; p >= pos; p -= 2) lines.push(p)
  for (let p = 10; p <= pos; p += 2) lines.push(p)
  return lines
}
