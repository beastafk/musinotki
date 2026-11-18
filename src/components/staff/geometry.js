// Staff geometry shared by Staff and CheatSheet.
export const LINE_SPACING  = 22               // px between adjacent staff lines
export const STEP          = LINE_SPACING / 2 // px per diatonic step
export const VIEW_X        = 52               // left edge of viewBox — crops dead space left of clef
export const TREBLE_BOTTOM = 222              // y of the bottom treble line (E4)
export const BASS_BOTTOM   = 172              // y of the bottom bass line (G2)

export const INK      = '#1e1b4b'
export const LINE_INK = '#4b5563'

export function bottomYFor(clef) {
  return clef === 'treble' ? TREBLE_BOTTOM : BASS_BOTTOM
}

export function noteY(pos, bottomY) {
  return bottomY - pos * STEP
}

// Vertical extent of each clef glyph (Bravura), used to size the viewBox.
//   gClef (U+E050): origin on G line, ascends ~5 spaces, descends ~2
//   fClef (U+E062): origin on F line, ~1 space above and below
export function clefExtent(clef, bottomY) {
  if (clef === 'treble') {
    const origin = noteY(2, bottomY)
    return { top: origin - 5 * LINE_SPACING, bottom: origin + 2 * LINE_SPACING }
  }
  const origin = noteY(6, bottomY)
  return { top: origin - LINE_SPACING, bottom: origin + LINE_SPACING }
}
