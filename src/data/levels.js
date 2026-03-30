import {
  VIOLIN_NOTES, VIOLIN_L2_NOTES,
  HARP_NOTES, HARP_TREBLE_NOTES, HARP_BASS_NOTES,
} from './notes.js'

const ALL_SOLFEGE = ['До', 'Ре', 'Ми', 'Фа', 'Сол', 'Ла', 'Си']

export const LEVELS = {
  violin: [
    {
      id: 'v1',
      stars: 1,
      label: 'Отворени струни',
      desc: 'Сол · Ре · Ла · Ми',
      notes: VIOLIN_NOTES,
      answers: ['Сол', 'Ре', 'Ла', 'Ми'],
    },
    {
      id: 'v2',
      stars: 2,
      label: 'Първа позиция',
      desc: 'Всички ноти · Сол³ – Ла⁵',
      notes: VIOLIN_L2_NOTES,
      answers: ALL_SOLFEGE,
    },
  ],
  harp: [
    {
      id: 'h1',
      stars: 1,
      label: 'Дясна ръка',
      desc: 'Ключ Сол · До⁴ – До⁵',
      notes: HARP_TREBLE_NOTES,
      answers: ALL_SOLFEGE,
    },
    {
      id: 'h2',
      stars: 2,
      label: 'Лява ръка',
      desc: 'Ключ Фа · До³ – До⁴',
      notes: HARP_BASS_NOTES,
      answers: ALL_SOLFEGE,
    },
    {
      id: 'h3',
      stars: 3,
      label: 'Двете ръце',
      desc: 'Ключ Сол + Ключ Фа',
      notes: HARP_NOTES,
      answers: ALL_SOLFEGE,
    },
  ],
}

// Piano uses the same notes as harp — same grand staff, same beginner range
LEVELS.piano = LEVELS.harp.map(l => ({ ...l, id: l.id.replace('h', 'p') }))
