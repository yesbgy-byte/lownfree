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

export function WrongClient({ examId, examName, allQuestions }: Props) {
  const [wrongQuestions, setWrongQuestions] = useState<Question[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const wrongIds = Object.keys(getWrongAnswers(examId))
    setWrongQuestions(allQuestions.filter((q) => wrongIds.includes(q.id)))
  }, [examId, allQuestions])

  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-12">
      <Link href={`/${examId}`} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 mb-4">
        ‹ {examName}
      </Link>

      <h1 className="text-2xl font-black text-slate-900 mb-1">✏️ 틀린 문제</h1>
      <p className="text-sm text-slate-400 mb-6">{wrongQuestions.length}문제</p>

      {wrongQuestions.length === 0 ? (
        <div className="bg-white rounded-3xl py-16 text-center shadow-[0_4px_14px_rgba(37,99,235,0.05)]">
          <p className="text-5xl mb-3">🎉</p>
          <p className="font-extrabold text-slate-700">틀린 문제가 없어요!</p>
          <p className="text-sm text-slate-400 mt-1.5">문제를 풀면 오답이 여기에 모여요</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wrongQuestions.map((q, idx) => {
            const isOpen = expanded[q.id]
            return (
              <div key={q.id} className="bg-white rounded-2xl shadow-[0_4px_14px_rgba(37,99,235,0.05)] overflow-hidden">
                <button
                  onClick={() => setExpanded((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                  className="w-full text-left px-5 py-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-black text-rose-500">Q{idx + 1}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-500">
                      오답
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800 flex-1 leading-relaxed">{q.text}</p>
                    <span className="text-slate-300 text-sm leading-none mt-1">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="space-y-2">
                      {q.options.map((opt, i) => {
                        const optNum = i + 1
                        const isCorrect = optNum === q.answer
                        return (
                          <div
                            key={optNum}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm ${
                              isCorrect
                                ? 'bg-blue-50 ring-1 ring-blue-200 text-blue-700 font-bold'
                                : 'text-slate-400'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                                isCorrect ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              {optNum}
                            </span>
                            {opt}
                          </div>
                        )
                      })}
                    </div>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-3.5 py-3">
                      <span className="font-extrabold text-slate-700">해설 · </span>
                      {q.explanation}
                    </p>
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
