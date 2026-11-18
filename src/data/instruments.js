// Single source of truth for instrument metadata used across screens.
export const INSTRUMENTS = [
  {
    key:       'violin',
    emoji:     '🎻',
    name:      'Цигулка',
    desc:      'Отворени струни и първа позиция',
    color:     '#fef3c7',
    border:    '#f59e0b',
    soundfont: 'violin',
  },
  {
    key:       'harp',
    emoji:     '🪉',
    name:      'Арфа',
    desc:      'До³ – До⁵ · двете ръце',
    color:     '#e0f2fe',
    border:    '#0891b2',
    soundfont: 'orchestral_harp',
  },
  {
    key:       'piano',
    emoji:     '🎹',
    name:      'Пиано',
    desc:      'До³ – До⁵ · двете ръце',
    color:     '#f3e8ff',
    border:    '#9333ea',
    soundfont: 'acoustic_grand_piano',
  },
]

export const INSTRUMENT_BY_KEY = Object.fromEntries(INSTRUMENTS.map(i => [i.key, i]))
