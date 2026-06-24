'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Question } from '@/lib/types'
import { saveAnswer } from '@/lib/store'

interface Props {
  examId: string
  examName: string
  examColor: string
  sessionLabel: string
  sessionId: string
  questions: Question[]
  isRandom?: boolean
}

type AnswerMap = Record<string, { selected: number; correct: boolean }>

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function QuizClient({ examId, examName, sessionLabel, questions }: Props) {
  const [queue, setQueue] = useState<Question[]>(questions)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [showResult, setShowResult] = useState(false)

  const current = queue[currentIdx]
  const isAnswered = selected !== null
  const isLast = currentIdx === queue.length - 1

  const handleSelect = useCallback(
    (option: number) => {
      if (isAnswered) return
      const correct = option === current.answer
      setSelected(option)

      const userAnswer = { selected: option, correct, answeredAt: Date.now() }
      saveAnswer(examId, current.id, userAnswer)
      setAnswers((prev) => ({ ...prev, [current.id]: { selected: option, correct } }))
    },
    [isAnswered, current, examId]
  )

  const handleNext = useCallback(() => {
    if (isLast) {
      setShowResult(true)
    } else {
      setCurrentIdx((i) => i + 1)
      setSelected(null)
    }
  }, [isLast])

  const correctCount = Object.values(answers).filter((a) => a.correct).length

  // ---------- Result screen ----------
  if (showResult) {
    const accuracy = Math.round((correctCount / queue.length) * 100)
    const message =
      accuracy >= 80 ? '완벽해요! 🎉' : accuracy >= 50 ? '잘하고 있어요 💪' : '다시 도전해봐요 🔥'

    return (
      <div className="max-w-lg mx-auto px-5 pt-8 pb-12">
        {/* Score hero */}
        <div className="bg-white rounded-3xl px-6 py-8 mb-5 text-center shadow-[0_6px_24px_rgba(37,99,235,0.08)]">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-black">{accuracy}%</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">{message}</h2>
          <p className="text-sm text-slate-400 mt-1">{sessionLabel}</p>
          <p className="text-base text-slate-600 mt-3">
            {queue.length}문제 중{' '}
            <span className="font-extrabold text-blue-600">{correctCount}문제</span> 정답
          </p>
        </div>

        {/* Per-question review */}
        <h3 className="text-sm font-extrabold text-slate-500 px-1 mb-3">📝 정답 확인</h3>
        <div className="space-y-3 mb-6">
          {queue.map((q, idx) => {
            const a = answers[q.id]
            if (!a) return null
            return (
              <div key={q.id} className="bg-white rounded-2xl px-5 py-4 shadow-[0_4px_14px_rgba(37,99,235,0.05)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-black text-blue-600">Q{idx + 1}</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      a.correct ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-500'
                    }`}
                  >
                    {a.correct ? '정답' : '오답'}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-800 leading-relaxed mb-2.5">{q.text}</p>
                <p className="text-sm text-slate-500 mb-1">
                  <span className="font-bold text-blue-600">정답 {q.answer}번 · </span>
                  {q.options[q.answer - 1]}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 rounded-xl px-3 py-2.5 mt-2">
                  {q.explanation}
                </p>
              </div>
            )
          })}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              setQueue(shuffle(questions))
              setCurrentIdx(0)
              setSelected(null)
              setAnswers({})
              setShowResult(false)
            }}
            className="w-full py-4 rounded-2xl bg-blue-500 text-white font-extrabold shadow-[0_8px_24px_rgba(37,99,235,0.25)] active:scale-[0.99] transition-transform"
          >
            🔄 다시 풀기
          </button>
          <Link
            href={`/${examId}/wrong`}
            className="block w-full py-4 rounded-2xl bg-white text-slate-600 font-bold text-center shadow-[0_4px_14px_rgba(37,99,235,0.05)]"
          >
            ✏️ 틀린 문제 보기
          </Link>
          <Link
            href={`/${examId}`}
            className="block w-full py-3.5 text-slate-400 font-bold text-center text-sm"
          >
            목록으로
          </Link>
        </div>
      </div>
    )
  }

  // ---------- Quiz screen ----------
  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/${examId}`} className="text-slate-400 font-black text-lg">
          ‹
        </Link>
        <div className="flex-1 bg-blue-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / queue.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-extrabold text-slate-500 tabular-nums shrink-0">
          {currentIdx + 1}/{queue.length}
        </span>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-3xl px-6 py-6 mb-5 shadow-[0_6px_24px_rgba(37,99,235,0.07)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-black text-blue-600">Q{currentIdx + 1}</span>
          <span className="text-[11px] font-bold text-slate-300">{examName}</span>
        </div>
        <p className="text-[17px] font-bold text-slate-900 leading-relaxed">{current.text}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-5">
        {current.options.map((opt, i) => {
          const optNum = i + 1
          const isCorrect = optNum === current.answer
          const isSelected = selected === optNum

          let style = 'bg-white text-slate-700 shadow-[0_4px_14px_rgba(37,99,235,0.05)]'
          let badge = 'bg-blue-50 text-blue-500'
          if (isAnswered) {
            if (isCorrect) {
              style = 'bg-blue-50 ring-2 ring-blue-500 text-blue-700'
              badge = 'bg-blue-500 text-white'
            } else if (isSelected) {
              style = 'bg-rose-50 ring-2 ring-rose-400 text-rose-600'
              badge = 'bg-rose-400 text-white'
            } else {
              style = 'bg-white text-slate-300'
              badge = 'bg-slate-100 text-slate-300'
            }
          }

          return (
            <button
              key={optNum}
              onClick={() => handleSelect(optNum)}
              disabled={isAnswered}
              className={`w-full flex items-center gap-3 text-left px-4 py-4 rounded-2xl transition-all ${style} ${
                !isAnswered ? 'active:scale-[0.99]' : ''
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${badge}`}>
                {optNum}
              </span>
              <span className="text-sm font-semibold leading-snug">{opt}</span>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className="bg-white rounded-2xl px-5 py-4 mb-5 shadow-[0_4px_14px_rgba(37,99,235,0.05)]">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                selected === current.answer ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-500'
              }`}
            >
              {selected === current.answer ? '정답' : '오답'}
            </span>
            {selected !== current.answer && (
              <span className="text-sm font-bold text-slate-500">정답은 {current.answer}번</span>
            )}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{current.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-blue-500 text-white font-extrabold text-base shadow-[0_8px_24px_rgba(37,99,235,0.25)] active:scale-[0.99] transition-transform"
        >
          {isLast ? '결과 보기 →' : '다음 문제 →'}
        </button>
      )}
    </div>
  )
}
