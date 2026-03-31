# 🎵 Музинотки

A music note-reading practice app for kids, built with React. Children learn to identify notes on the staff using solfège (До · Ре · Ми · Фа · Сол · Ла · Си).

**Live demo:** https://musinotki.kalo.casa

---

## Features

- 🎻 **Violin** — open strings (level 1) and first position natural notes (level 2)
- 🪉 **Harp** — right hand / left hand / both hands
- 🎹 **Piano** — same grand staff as harp, with piano sounds
- Treble and bass clef rendered with the [Bravura](https://github.com/steinbergmedia/bravura) SMuFL font
- Note sounds via [smplr](https://github.com/danigb/smplr) (Web Audio API sampler)
- Auto-advances on correct answer; shows "Next" button on wrong answer for review
- Fully responsive — works on mobile and desktop
- Bulgarian UI (solfège notation)

---

## Getting started

```bash
npm install
npm run dev    # dev server at http://localhost:5173
npm run build  # production build
```

Requires Node.js 18+.

---

## Project structure

```
src/
  data/
    notes.js        # Note definitions and staff position math
    levels.js       # Level configs per instrument (notes, answers, labels)
  hooks/
    useGame.js      # Game state (current note, score, streak)
    useSound.js     # Soundfont loading and playback
  components/
    instrument-select/   # Home screen
    level-select/        # Level picker
    game/                # Main game screen
    staff/               # SVG staff and note renderer
    answer-buttons/      # Solfège answer buttons
    celebration/         # Correct/wrong feedback
    cheat-sheet/         # Reference chart overlay
    score-badge/         # Score, streak, accuracy display
public/
  fonts/Bravura.woff2    # SMuFL music font (SIL OFL)
```

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

Add the instrument to `INSTRUMENT_MAP` in `src/hooks/useSound.js` (General MIDI name) and to `INSTRUMENTS` in `src/components/instrument-select/InstrumentSelect.jsx`.

---

## License

MIT — see [LICENSE](LICENSE).

The Bravura music font is licensed under the [SIL Open Font License 1.1](https://scripts.sil.org/OFL).
