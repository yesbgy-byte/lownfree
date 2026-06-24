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
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 mb-4 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">풀이 현황</span>
        <span className="font-semibold text-gray-800">
          {stats.correct}/{stats.total}문제 정답 ({stats.accuracy}%)
        </span>
      </div>
      <div className="mt-2 bg-gray-100 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${stats.accuracy}%` }}
        />
      </div>
    </div>
  )
}
