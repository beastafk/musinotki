import { useState, useCallback } from 'react'

function pickRandom(arr, exclude = null) {
  const pool = exclude ? arr.filter(x => x !== exclude) : arr
  return pool[Math.floor(Math.random() * pool.length)]
}

export function useGame(notes, answers) {
  const [currentNote,    setCurrentNote]    = useState(() => pickRandom(notes))
  const [selected,       setSelected]       = useState(null)
  const [isCorrect,      setIsCorrect]      = useState(null)
  const [score,          setScore]          = useState(0)
  const [streak,         setStreak]         = useState(0)
  const [totalAnswered,  setTotalAnswered]  = useState(0)

  const answer = useCallback((choice) => {
    if (selected !== null) return

    const correct = choice === currentNote.solfege
    setSelected(choice)
    setIsCorrect(correct)
    setTotalAnswered(n => n + 1)

    if (correct) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }
  }, [selected, currentNote])

  const next = useCallback(() => {
    setCurrentNote(prev => pickRandom(notes, prev))
    setSelected(null)
    setIsCorrect(null)
  }, [notes])

  return { currentNote, answers, selected, isCorrect, score, streak, totalAnswered, answer, next }
}
