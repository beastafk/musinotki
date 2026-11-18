import { describe, it, expect } from 'vitest'
import {
  treblePos, bassPos, getLedgerLines, noteRange,
  VIOLIN_NOTES, VIOLIN_STRING_NAME_NOTES, VIOLIN_FIRST_POSITION_NOTES, HARP_NOTES, HARP_TREBLE_NOTES, HARP_BASS_NOTES,
} from './notes.js'
import { LEVELS } from './levels.js'

describe('staff positions', () => {
  it('places treble clef lines on E4 G4 B4 D5 F5', () => {
    expect(['E4', 'G4', 'B4', 'D5', 'F5'].map(n => treblePos(n[0], +n[1]))).toEqual([0, 2, 4, 6, 8])
  })

  it('places bass clef lines on G2 B2 D3 F3 A3', () => {
    expect(['G2', 'B2', 'D3', 'F3', 'A3'].map(n => bassPos(n[0], +n[1]))).toEqual([0, 2, 4, 6, 8])
  })

  it('puts middle C one ledger line below treble and above bass', () => {
    expect(treblePos('C', 4)).toBe(-2)
    expect(bassPos('C', 4)).toBe(10)
  })
})

describe('getLedgerLines', () => {
  it('returns no ledger lines inside the staff', () => {
    for (let p = -1; p <= 9; p++) expect(getLedgerLines(p)).toEqual([])
  })

  it('adds lines below the staff', () => {
    expect(getLedgerLines(-2)).toEqual([-2])
    expect(getLedgerLines(-3)).toEqual([-2])
    expect(getLedgerLines(-5)).toEqual([-2, -4]) // G3 on treble
  })

  it('adds lines above the staff', () => {
    expect(getLedgerLines(10)).toEqual([10])
    expect(getLedgerLines(11)).toEqual([10]) // A5 on treble
    expect(getLedgerLines(12)).toEqual([10, 12])
  })
})

describe('note sets', () => {
  it('builds natural-note ranges', () => {
    expect(noteRange('C4', 'C5', 'treble').map(n => n.sfNote))
      .toEqual(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'])
  })

  it('has the expected violin notes', () => {
    expect(VIOLIN_NOTES.map(n => n.sfNote)).toEqual(['G3', 'D4', 'A4', 'E5'])
    expect(VIOLIN_STRING_NAME_NOTES.map(n => n.sfNote))
      .toEqual(['G3', 'A3', 'D4', 'E4', 'G4', 'A4', 'D5', 'E5', 'G5', 'A5'])
    expect(VIOLIN_FIRST_POSITION_NOTES).toHaveLength(17)
    expect(VIOLIN_FIRST_POSITION_NOTES[0].sfNote).toBe('G3')
    expect(VIOLIN_FIRST_POSITION_NOTES.at(-1).sfNote).toBe('B5') // 4th finger on Ми
  })

  it('has harp notes C3–C4 on bass and C4–C5 on treble', () => {
    expect(HARP_BASS_NOTES.map(n => n.sfNote)).toEqual(['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'])
    expect(HARP_TREBLE_NOTES.map(n => n.sfNote)).toEqual(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'])
    expect(new Set(HARP_NOTES.map(n => n.id)).size).toBe(HARP_NOTES.length)
  })
})

describe('levels', () => {
  it('only asks for answers that are offered', () => {
    for (const levels of Object.values(LEVELS)) {
      for (const level of levels) {
        for (const note of level.notes) expect(level.answers).toContain(note.solfege)
      }
    }
  })

  it('has unique level ids', () => {
    const ids = Object.values(LEVELS).flat().map(l => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
