# 🎵 Музинотки

A music note-reading practice app for kids, built with React. Children learn to identify notes on the staff using solfège (До · Ре · Ми · Фа · Сол · Ла · Си).

**Live demo:** https://musinotki.kalo.casa

---

## Features

- 🎻 **Violin** — open strings (level 1), Сол/Ре/Ла/Ми everywhere in first position, open or fingered (level 2), and all first-position natural notes up to the 4th finger on E, G3–B5 (level 3)
- 🪉 **Harp** — right hand / left hand / both hands
- 🎹 **Piano** — same grand staff as harp, with piano sounds
- Treble and bass clef rendered with the [Bravura](https://github.com/steinbergmedia/bravura) SMuFL font
- Note sounds via [smplr](https://github.com/danigb/smplr) (Web Audio API sampler)
- Auto-advances on correct answer; shows "Next" button on wrong answer for review
- Keyboard shortcuts: number keys 1–7 pick an answer, Enter continues after a wrong answer, Esc closes the cheat sheet
- Browser Back button works between screens (e.g. `#/violin/v2` links straight to a level)
- Fully responsive — works on mobile and desktop
- Bulgarian UI (solfège notation)

---

## Getting started

```bash
npm install
npm run dev    # dev server at http://localhost:5173
npm run build  # production build
npm test       # unit tests (vitest)
npm run lint   # eslint
```

Requires Node.js 20.19+.

---

## Project structure

```
src/
  data/
    instruments.js  # Instrument metadata (name, emoji, colours, soundfont)
    notes.js        # Note definitions and staff position math
    levels.js       # Level configs per instrument (notes, answers, labels)
  hooks/
    useGame.js      # Game state (current note, score, streak)
    useSound.js     # Soundfont loading and playback
    useRoute.js     # Hash-based navigation (browser Back support)
  components/
    instrument-select/   # Home screen
    level-select/        # Level picker
    game/                # Main game screen
    staff/               # SVG staff and note renderer (+ shared geometry/primitives)
    answer-buttons/      # Solfège answer buttons
    celebration/         # Correct/wrong feedback
    cheat-sheet/         # Reference chart overlay
    score-badge/         # Score, streak, accuracy display
public/
  fonts/Bravura.woff2    # SMuFL music font (SIL OFL), subset to the two clef glyphs
design/
  favicon-source.png     # 2048px source for the favicons
```

To add more Bravura glyphs, re-subset from the full font, e.g.
`pyftsubset Bravura.woff2 --unicodes=U+E050,U+E062,... --flavor=woff2 --output-file=public/fonts/Bravura.woff2`.

---

## Deployment

Static Vite build served by nginx in Docker, deployed to Google Cloud Run.

```bash
just deploy   # requires Docker + gcloud CLI configured
```

See `Justfile` and `Dockerfile` for details.

---

## Adding instruments or levels

Edit `src/data/notes.js` to define note sets, then add levels in `src/data/levels.js`:

```js
export const LEVELS = {
  myInstrument: [
    {
      id: 'mi1',
      stars: 1,
      label: 'Level name',
      desc: 'Description',
      notes: MY_NOTES,
      answers: ['До', 'Ре'],
    },
  ],
}
```

Add the instrument to `INSTRUMENTS` in `src/data/instruments.js` (name, emoji, colours and General MIDI `soundfont` name).

Notes can be generated with `noteRange('G3', 'A5', 'treble')` or `makeNote('E', 5, 'treble')`.

---

## License

MIT — see [LICENSE](LICENSE).

The Bravura music font is licensed under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL).
