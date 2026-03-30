// Diatonic index: C=0, D=1, E=2, F=3, G=4, A=5, B=6
const NOTE_INDEX = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 }

const SOLFEGE = {
  C: 'До', D: 'Ре', E: 'Ми', F: 'Фа', G: 'Сол', A: 'Ла', B: 'Си',
}

// Absolute diatonic step (for position math)
function diatonicStep(letter, octave) {
  return octave * 7 + NOTE_INDEX[letter]
}

// Treble clef: E4 = bottom line = position 0
const TREBLE_REF = diatonicStep('E', 4) // 30

// Bass clef: G2 = bottom line = position 0
const BASS_REF = diatonicStep('G', 2) // 18

// How many diatonic steps above the clef's bottom reference line
export function treblePos(letter, octave) {
  return diatonicStep(letter, octave) - TREBLE_REF
}

export function bassPos(letter, octave) {
  return diatonicStep(letter, octave) - BASS_REF
}

// Violin level 1: 4 open strings (G3, D4, A4, E5), treble clef
export const VIOLIN_NOTES = [
  { id: 'G3', letter: 'G', octave: 3, solfege: 'Сол', sfNote: 'G3', clef: 'treble', pos: treblePos('G', 3) },
  { id: 'D4', letter: 'D', octave: 4, solfege: 'Ре',  sfNote: 'D4', clef: 'treble', pos: treblePos('D', 4) },
  { id: 'A4', letter: 'A', octave: 4, solfege: 'Ла',  sfNote: 'A4', clef: 'treble', pos: treblePos('A', 4) },
  { id: 'E5', letter: 'E', octave: 5, solfege: 'Ми',  sfNote: 'E5', clef: 'treble', pos: treblePos('E', 5) },
]

// Violin level 2: first position, natural notes only (G3–A5), treble clef
export const VIOLIN_L2_NOTES = [
  { id: 'G3', letter: 'G', octave: 3, solfege: 'Сол', sfNote: 'G3', clef: 'treble', pos: treblePos('G', 3) },
  { id: 'A3', letter: 'A', octave: 3, solfege: 'Ла',  sfNote: 'A3', clef: 'treble', pos: treblePos('A', 3) },
  { id: 'B3', letter: 'B', octave: 3, solfege: 'Си',  sfNote: 'B3', clef: 'treble', pos: treblePos('B', 3) },
  { id: 'C4', letter: 'C', octave: 4, solfege: 'До',  sfNote: 'C4', clef: 'treble', pos: treblePos('C', 4) },
  { id: 'D4', letter: 'D', octave: 4, solfege: 'Ре',  sfNote: 'D4', clef: 'treble', pos: treblePos('D', 4) },
  { id: 'E4', letter: 'E', octave: 4, solfege: 'Ми',  sfNote: 'E4', clef: 'treble', pos: treblePos('E', 4) },
  { id: 'F4', letter: 'F', octave: 4, solfege: 'Фа',  sfNote: 'F4', clef: 'treble', pos: treblePos('F', 4) },
  { id: 'G4', letter: 'G', octave: 4, solfege: 'Сол', sfNote: 'G4', clef: 'treble', pos: treblePos('G', 4) },
  { id: 'A4', letter: 'A', octave: 4, solfege: 'Ла',  sfNote: 'A4', clef: 'treble', pos: treblePos('A', 4) },
  { id: 'B4', letter: 'B', octave: 4, solfege: 'Си',  sfNote: 'B4', clef: 'treble', pos: treblePos('B', 4) },
  { id: 'C5', letter: 'C', octave: 5, solfege: 'До',  sfNote: 'C5', clef: 'treble', pos: treblePos('C', 5) },
  { id: 'D5', letter: 'D', octave: 5, solfege: 'Ре',  sfNote: 'D5', clef: 'treble', pos: treblePos('D', 5) },
  { id: 'E5', letter: 'E', octave: 5, solfege: 'Ми',  sfNote: 'E5', clef: 'treble', pos: treblePos('E', 5) },
  { id: 'F5', letter: 'F', octave: 5, solfege: 'Фа',  sfNote: 'F5', clef: 'treble', pos: treblePos('F', 5) },
  { id: 'G5', letter: 'G', octave: 5, solfege: 'Сол', sfNote: 'G5', clef: 'treble', pos: treblePos('G', 5) },
  { id: 'A5', letter: 'A', octave: 5, solfege: 'Ла',  sfNote: 'A5', clef: 'treble', pos: treblePos('A', 5) },
]

// Harp: До–До on each clef
//   Bass clef:   C3–C4  (C4 shown on bass as first ledger line above)
//   Treble clef: C4–C5  (C4 shown on treble as first ledger line below)
// Middle C appears on both clefs — an important thing to learn!
const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

export const HARP_NOTES = (() => {
  const notes = []
  // Bass: C3 to C4 (inclusive), all on bass clef
  for (const letter of NOTE_LETTERS) {
    notes.push({ id: `${letter}3_bass`, letter, octave: 3, solfege: SOLFEGE[letter], sfNote: `${letter}3`, clef: 'bass', pos: bassPos(letter, 3) })
  }
  notes.push({ id: 'C4_bass', letter: 'C', octave: 4, solfege: 'До', sfNote: 'C4', clef: 'bass', pos: bassPos('C', 4) })

  // Treble: C4 to C5 (inclusive), all on treble clef
  for (const letter of NOTE_LETTERS) {
    notes.push({ id: `${letter}4_treble`, letter, octave: 4, solfege: SOLFEGE[letter], sfNote: `${letter}4`, clef: 'treble', pos: treblePos(letter, 4) })
  }
  notes.push({ id: 'C5_treble', letter: 'C', octave: 5, solfege: 'До', sfNote: 'C5', clef: 'treble', pos: treblePos('C', 5) })

  return notes
})()

// Named harp subsets used by levels
export const HARP_TREBLE_NOTES = HARP_NOTES.filter(n => n.clef === 'treble')
export const HARP_BASS_NOTES   = HARP_NOTES.filter(n => n.clef === 'bass')

// Ledger lines needed to display a note at a given staff position
// Staff lines are at even positions 0,2,4,6,8. Ledger lines extend: -2,-4,... and 10,12,...
export function getLedgerLines(pos) {
  const lines = []
  if (pos < 0) {
    const lowestEven = pos % 2 === 0 ? pos : pos + 1 // nearest even >= pos (toward 0)
    for (let p = -2; p >= lowestEven; p -= 2) lines.push(p)
  }
  if (pos > 8) {
    const highestEven = pos % 2 === 0 ? pos : pos - 1 // nearest even <= pos (toward 8)
    for (let p = 10; p <= highestEven; p += 2) lines.push(p)
  }
  return lines
}
