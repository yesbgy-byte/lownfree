'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getExamProgress } from '@/lib/store'

interface SessionMeta {
  id: string
  label: string
  questionIds: string[]
}

interface Props {
  examId: string
  examName: string
  examColor: string
  sessions: SessionMeta[]
}

export function StatsClient({ examId, examName, sessions }: Props) {
  const [sessionStats, setSessionStats] = useState<
    { label: string; total: number; correct: number; answered: number }[]
  >([])
  const [overall, setOverall] = useState({ total: 0, correct: 0, answered: 0 })

  useEffect(() => {
    const progress = getExamProgress(examId)
    const stats = sessions.map((s) => {
      const total = s.questionIds.length
      const answered = s.questionIds.filter((id) => id in progress).length
      const correct = s.questionIds.filter((id) => progress[id]?.correct).length
      return { label: s.label, total, correct, answered }
    })
    setSessionStats(stats)

    const totalQ = stats.reduce((sum, s) => sum + s.total, 0)
    const totalAnswered = stats.reduce((sum, s) => sum + s.answered, 0)
    const totalCorrect = stats.reduce((sum, s) => sum + s.correct, 0)
    setOverall({ total: totalQ, correct: totalCorrect, answered: totalAnswered })
  }, [examId, sessions])

  const accuracy = overall.answered > 0 ? Math.round((overall.correct / overall.answered) * 100) : 0

  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-12">
      <Link href={`/${examId}`} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 mb-4">
        ‹ {examName}
      </Link>

      <h1 className="text-2xl font-black text-slate-900 mb-5">📊 학습 통계</h1>

      {/* Overall card */}
      <div className="bg-blue-500 rounded-3xl px-6 py-7 mb-6 text-white shadow-[0_8px_24px_rgba(37,99,235,0.2)]">
        <p className="text-white/70 text-sm font-bold">전체 정답률</p>
        <p className="text-5xl font-black mt-1">{accuracy}%</p>
        <p className="text-white/80 text-sm mt-2.5">
          풀이 {overall.answered}/{overall.total}문제 · 정답 {overall.correct}문제
        </p>
        {overall.answered > 0 && (
          <div className="mt-4 bg-white/25 rounded-full h-2.5">
            <div className="bg-white h-2.5 rounded-full" style={{ width: `${accuracy}%` }} />
          </div>
        )}
      </div>

      {/* Per session */}
      <h2 className="text-sm font-extrabold text-slate-500 px-1 mb-3">회차별 현황</h2>
      <div className="space-y-3">
        {sessionStats.map((s) => {
          const sessionAccuracy = s.answered > 0 ? Math.round((s.correct / s.answered) * 100) : 0
          return (
            <div key={s.label} className="bg-white rounded-2xl px-5 py-4 shadow-[0_4px_14px_rgba(37,99,235,0.05)]">
              <div className="flex items-center justify-between mb-2.5">
                <p className="font-bold text-slate-800">{s.label}</p>
                <p className="text-sm font-extrabold text-blue-600">
                  {s.answered === 0 ? '미풀이' : `${sessionAccuracy}%`}
                </p>
              </div>
              <div className="bg-blue-50 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: s.answered === 0 ? '0%' : `${sessionAccuracy}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                {s.answered}/{s.total}문제 풀이 · 정답 {s.correct}문제
              </p>
            </div>
          )
        })}
      </div>

      {overall.answered === 0 && (
        <p className="text-center text-sm text-slate-400 mt-8">
          아직 풀이한 문제가 없어요.<br />랜덤 문제로 시작해 보세요!
        </p>
      )}
    </div>
  )
}
