import { useEffect, useState, useCallback, useRef } from 'react'
import { useGame }           from '../../hooks/useGame.js'
import { INSTRUMENT_BY_KEY } from '../../data/instruments.js'
import Staff                 from '../staff/Staff.jsx'
import AnswerButtons         from '../answer-buttons/AnswerButtons.jsx'
import ScoreBadge            from '../score-badge/ScoreBadge.jsx'
import Celebration           from '../celebration/Celebration.jsx'
import CheatSheet            from '../cheat-sheet/CheatSheet.jsx'
import styles                from './Game.module.css'

const CLEF_LABELS = { treble: 'Ключ Сол', bass: 'Ключ Фа' }

export default function Game({ instrument, level, sound, onBack }) {
  const { currentNote, answers, selected, isCorrect, score, streak, totalAnswered, answer, next } =
    useGame(level.notes, level.answers)
  const { unlock, play, stop, unlocked, isReady, isLoading, error } = sound
  const ready   = isReady(instrument)
  const loading = isLoading(instrument)
  const meta    = INSTRUMENT_BY_KEY[instrument]

  const [showCheatSheet, setShowCheatSheet] = useState(false)
  const nextBtnRef = useRef(null)
  const answered   = selected !== null

  const enableSound = useCallback(() => { unlock(instrument) }, [unlock, instrument])

  // Audio was already unlocked on an earlier screen — just load this instrument.
  useEffect(() => {
    if (unlocked) enableSound()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const playNote = useCallback(() => {
    play(instrument, currentNote.sfNote)
  }, [play, instrument, currentNote])

  // Play the note when it appears (after a short pause) and again when answered.
  useEffect(() => {
    if (!ready || !unlocked) return
    if (answered) { playNote(); return }
    const t = setTimeout(playNote, 300)
    return () => clearTimeout(t)
  }, [currentNote, ready, answered]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stop(), [stop])

  // After a wrong answer, move focus to "Next" so Enter/Space continues.
  useEffect(() => {
    if (!answered || isCorrect) return
    const btn = nextBtnRef.current
    if (!btn) return
    btn.focus({ preventScroll: true })
    // iOS doesn't scroll to programmatically focused buttons — do it explicitly
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [answered, isCorrect])

  // Keyboard: number keys 1–7 pick the matching answer button.
  useEffect(() => {
    if (showCheatSheet) return
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const idx = Number(e.key) - 1
      if (!answered && Number.isInteger(idx) && idx >= 0 && idx < answers.length) {
        enableSound()
        answer(answers[idx])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answered, answers, answer, enableSound, showCheatSheet])

  return (
    <div className={styles.page} onClick={unlocked ? undefined : enableSound}>
      {/* Header */}
      <div className={styles.header}>
        <button
          className={styles.backBtn}
          onClick={e => { e.stopPropagation(); onBack() }}
        >
          ← Назад
        </button>
        <span className={styles.instrLabel}>
          {meta.name} {meta.emoji}
          <span className={styles.levelStars} aria-label={`Ниво ${level.stars}`}>
            {'⭐'.repeat(level.stars)}
          </span>
        </span>
        <div className={styles.helpSlot}>
          <button
            className={styles.helpBtn}
            onClick={() => setShowCheatSheet(true)}
            title="Помощ"
            aria-label="Помощ: всички ноти"
          >
            🎼
          </button>
        </div>
      </div>

      {/* Score */}
      <ScoreBadge score={score} streak={streak} totalAnswered={totalAnswered} />

      {/* Staff card */}
      <div className={styles.card}>
        <div className={styles.clefLabel}>{CLEF_LABELS[currentNote.clef]}</div>

        <div className={styles.staffWrap}>
          <Staff note={currentNote} animate={!answered} />
        </div>

        <button
          className={styles.listenBtn}
          onClick={(e) => { e.stopPropagation(); enableSound(); playNote() }}
          aria-label="Чуй нотата"
          disabled={loading}
        >
          <span aria-hidden="true">{loading ? '⏳' : '🔊'}</span> Чуй
        </button>

        {!unlocked && (
          <p className={styles.tapHint}>Натисни някъде, за да включиш звука 🔉</p>
        )}
        {error && (
          <p className={styles.tapHint} role="alert">
            Звукът не се зареди. Провери интернета и натисни „Чуй“ отново.
          </p>
        )}
      </div>

      {/* Question */}
      <p className={styles.question}>Коя нота е това?</p>

      {/* Answer buttons */}
      <AnswerButtons
        answers={answers}
        selected={selected}
        correctAnswer={currentNote.solfege}
        onAnswer={(choice) => { enableSound(); answer(choice) }}
      />

      {answered && (
        <Celebration key={totalAnswered} isCorrect={isCorrect} onNext={next}>
          {!isCorrect && (
            <button ref={nextBtnRef} className={styles.nextBtn} onClick={next}>
              Следваща →
            </button>
          )}
        </Celebration>
      )}

      {showCheatSheet && (
        <CheatSheet notes={level.notes} onClose={() => setShowCheatSheet(false)} />
      )}
    </div>
  )
}
