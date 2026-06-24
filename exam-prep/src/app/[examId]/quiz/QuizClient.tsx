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
}

type AnswerMap = Record<string, { selected: number; correct: boolean }>

export function QuizClient({ examId, examName, examColor, sessionLabel, sessionId, questions }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [showResult, setShowResult] = useState(false)

  const current = questions[currentIdx]
  const isAnswered = selected !== null
  const isLast = currentIdx === questions.length - 1
  const totalAnswered = Object.keys(answers).length

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

  if (showResult) {
    const accuracy = Math.round((correctCount / questions.length) * 100)
    return (
      <div className="max-w-lg mx-auto px-4 py-12 flex flex-col items-center text-center">
        <div className={`${examColor} w-20 h-20 rounded-full flex items-center justify-center mb-4`}>
          <span className="text-white text-3xl font-bold">{accuracy}%</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">풀이 완료!</h2>
        <p className="text-gray-500 mb-1">{sessionLabel}</p>
        <p className="text-lg text-gray-700 mb-8">
          {questions.length}문제 중{' '}
          <span className="font-bold text-gray-900">{correctCount}문제</span> 정답
        </p>

        <div className="w-full space-y-3">
          <button
            onClick={() => {
              setCurrentIdx(0)
              setSelected(null)
              setAnswers({})
              setShowResult(false)
            }}
            className={`w-full py-3.5 rounded-xl ${examColor} text-white font-semibold`}
          >
            다시 풀기
          </button>
          <Link
            href={`/${examId}/wrong`}
            className="block w-full py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-center"
          >
            틀린 문제 보기
          </Link>
          <Link
            href={`/${examId}`}
            className="block w-full py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-center"
          >
            목록으로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link href={`/${examId}`} className="text-sm text-gray-500">
          ← 나가기
        </Link>
        <span className="text-sm font-medium text-gray-500">
          {currentIdx + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-200 rounded-full h-1.5 mb-6">
        <div
          className={`${examColor} h-1.5 rounded-full transition-all duration-300`}
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6 flex-1">
        <p className="text-xs text-gray-400 mb-2 font-medium">
          {examName} · {sessionLabel}
        </p>
        <p className="text-base font-semibold text-gray-900 leading-relaxed">
          {current.number}. {current.text}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {current.options.map((opt, i) => {
          const optNum = i + 1
          const isCorrect = optNum === current.answer
          const isSelected = selected === optNum

          let style =
            'border border-gray-200 bg-white text-gray-800'
          if (isAnswered) {
            if (isCorrect) style = 'border-2 border-green-500 bg-green-50 text-green-800'
            else if (isSelected) style = 'border-2 border-red-400 bg-red-50 text-red-800'
            else style = 'border border-gray-100 bg-gray-50 text-gray-400'
          }

          return (
            <button
              key={optNum}
              onClick={() => handleSelect(optNum)}
              disabled={isAnswered}
              className={`w-full text-left px-4 py-3.5 rounded-xl transition-all text-sm ${style} ${
                !isAnswered ? 'hover:border-gray-400 active:scale-[0.98]' : ''
              }`}
            >
              <span className="font-semibold mr-2">{optNum}.</span>
              {opt}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div
          className={`rounded-xl px-4 py-3 mb-4 text-sm leading-relaxed ${
            selected === current.answer
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-amber-50 border border-amber-200 text-amber-800'
          }`}
        >
          <p className="font-semibold mb-1">
            {selected === current.answer ? '정답입니다!' : `오답 (정답: ${current.answer}번)`}
          </p>
          <p>{current.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className={`w-full py-4 rounded-xl ${examColor} text-white font-semibold text-base`}
        >
          {isLast ? '결과 보기' : '다음 문제'}
        </button>
      )}

      {/* Bottom spacing */}
      <div className="h-4" />
    </div>
  )
}
