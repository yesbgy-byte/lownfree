'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Question } from '@/lib/types'
import { getWrongAnswers } from '@/lib/store'

interface Props {
  examId: string
  examName: string
  examColor: string
  allQuestions: Question[]
}

export function WrongClient({ examId, examName, examColor, allQuestions }: Props) {
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const wrongIds = Object.keys(getWrongAnswers(examId))
    setWrongQuestions(allQuestions.filter((q) => wrongIds.includes(q.id)))
  }, [examId, allQuestions])

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <Link href={`/${examId}`} className="text-sm text-gray-500 flex items-center gap-1 mb-4">
        ← {examName}
      </Link>

      <h1 className="text-xl font-bold text-gray-900 mb-1">틀린 문제</h1>
      <p className="text-sm text-gray-500 mb-6">{wrongQuestions.length}문제</p>

      {wrongQuestions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🎉</p>
          <p className="font-medium">틀린 문제가 없습니다!</p>
          <p className="text-sm mt-1">문제를 풀면 오답이 여기에 표시됩니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wrongQuestions.map((q, idx) => {
            const isOpen = expanded[q.id]
            return (
              <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpanded((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                  className="w-full text-left px-4 py-3.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800 flex-1 leading-relaxed">
                      <span className="text-gray-400 mr-1">Q{idx + 1}.</span>
                      {q.text}
                    </p>
                    <span className="text-gray-400 text-lg leading-none mt-0.5">{isOpen ? '↑' : '↓'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, i) => {
                        const optNum = i + 1
                        const isCorrect = optNum === q.answer
                        return (
                          <div
                            key={optNum}
                            className={`px-3 py-2.5 rounded-lg text-sm ${
                              isCorrect
                                ? 'bg-green-50 border border-green-200 text-green-800 font-medium'
                                : 'text-gray-500'
                            }`}
                          >
                            <span className="font-semibold mr-1">{optNum}.</span>
                            {opt}
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-sm text-amber-800">
                      <span className="font-semibold">해설 </span>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
