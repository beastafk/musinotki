import React, { useEffect, useState, useCallback } from 'react'
import { useGame }       from '../../hooks/useGame.js'
import Staff             from '../staff/Staff.jsx'
import AnswerButtons     from '../answer-buttons/AnswerButtons.jsx'
import ScoreBadge        from '../score-badge/ScoreBadge.jsx'
import Celebration       from '../celebration/Celebration.jsx'
import CheatSheet        from '../cheat-sheet/CheatSheet.jsx'
import styles            from './Game.module.css'

const INSTRUMENT_LABELS = { violin: 'Цигулка 🎻', harp: 'Арфа 🪉', piano: 'Пиано 🎹' }
const CLEF_LABELS       = { treble: 'Ключ Сол', bass: 'Ключ Фа' }

export default function Game({ instrument, level, sound, onBack }) {
  const { currentNote, answers, selected, isCorrect, score, streak, totalAnswered, answer, next } =
    useGame(level.notes, level.answers)
  const { load, play, stop, loading, ready } = sound

  const [showCelebration, setShowCelebration] = useState(false)
  const [showCheatSheet,  setShowCheatSheet]  = useState(false)
  const [audioUnlocked,   setAudioUnlocked]   = useState(false)

  const handleNext = useCallback(() => {
    setShowCelebration(false)
    next()
  }, [next])

  const unlockAndLoad = useCallback(() => {
    if (!audioUnlocked) {
      setAudioUnlocked(true)
      load(instrument)
    }
  }, [audioUnlocked, instrument, load])

  const playNote = useCallback(() => {
    if (ready) play(currentNote.sfNote)
  }, [ready, play, currentNote])

  useEffect(() => {
    if (selected !== null) {
      setShowCelebration(true)
      if (ready) { stop(); play(currentNote.sfNote) }
    }
  }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (ready && audioUnlocked) {
      const t = setTimeout(() => play(currentNote.sfNote), 300)
      return () => clearTimeout(t)
    }
  }, [currentNote, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  const starsLabel = '⭐'.repeat(level.stars)

  return (
    <div className={styles.page} onClick={unlockAndLoad}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>← Назад</button>
        <span className={styles.instrLabel}>
          {INSTRUMENT_LABELS[instrument]}
          <span className={styles.levelStars}>{starsLabel}</span>
        </span>
        {selected !== null && !isCorrect
          ? <button className={styles.nextBtn} onClick={handleNext}>Следваща →</button>
          : <div className={styles.nextPlaceholder} />
        }
      </div>

      {/* Help button on its own row */}
      <div className={styles.helpRow}>
        <button className={styles.helpBtn} onClick={() => setShowCheatSheet(true)} title="Помощ">🎼</button>
      </div>

      {/* Score */}
      <ScoreBadge score={score} streak={streak} totalAnswered={totalAnswered} />

      {/* Staff card */}
      <div className={styles.card}>
        <div className={styles.clefLabel}>{CLEF_LABELS[currentNote.clef]}</div>

        <div className={styles.staffWrap}>
          <Staff note={currentNote} animate={selected === null} />
        </div>

        <button
          className={styles.listenBtn}
          onClick={(e) => { e.stopPropagation(); unlockAndLoad(); playNote() }}
          title="Чуй нотата"
        >
          {loading ? '⏳' : '🔊'} Чуй
        </button>

        {!audioUnlocked && (
          <p className={styles.tapHint}>Натисни някъде, за да включиш звука 🔉</p>
        )}
      </div>

      {/* Question */}
      <p className={styles.question}>Коя нота е това?</p>

      {/* Answer buttons */}
      <AnswerButtons
        answers={answers}
        selected={selected}
        correctAnswer={currentNote.solfege}
        onAnswer={(choice) => { unlockAndLoad(); answer(choice) }}
      />

      <Celebration show={showCelebration} isCorrect={isCorrect} onNext={handleNext} />

      {showCheatSheet && (
        <CheatSheet notes={level.notes} onClose={() => setShowCheatSheet(false)} />
      )}
    </div>
  )
}
