'use client'

import { useEffect, useState } from 'react'
import { getStats } from '@/lib/store'

export function ExamStatsBar({ examId }: { examId: string }) {
  const [stats, setStats] = useState({ total: 0, correct: 0, accuracy: 0 })

  useEffect(() => {
    setStats(getStats(examId))
  }, [examId])

  if (stats.total === 0) return null

  return (
    <div className="bg-white rounded-2xl px-5 py-4 mb-3 shadow-[0_4px_14px_rgba(37,99,235,0.05)]">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-bold text-slate-500">🔥 나의 풀이 현황</span>
        <span className="text-sm font-extrabold text-blue-600">
          {stats.correct}/{stats.total} · {stats.accuracy}%
        </span>
      </div>
      <div className="bg-blue-50 rounded-full h-2.5">
        <div
          className="bg-blue-500 h-2.5 rounded-full transition-all"
          style={{ width: `${stats.accuracy}%` }}
        />
      </div>
    </div>
  )
}
