import Link from 'next/link'
import { exams } from '@/lib/data'

const examEmoji: Record<string, string> = {
  'origin-manager': '🌏',
  'bonded-area': '📦',
  'real-estate': '🏠',
}

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-5 pt-10 pb-12">
      {/* Hero */}
      <header className="mb-7">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
          🔥 틈틈이 기출 한 입
        </div>
        <h1 className="text-[26px] leading-tight font-black text-slate-900">
          오늘도 기출 간식<br />한 입 어때요?
        </h1>
        <p className="text-sm text-slate-500 mt-2">자격증을 골라 랜덤 문제를 풀어보세요</p>
      </header>

      {/* Exam cards */}
      <div className="space-y-3.5">
        {exams.map((exam) => {
          const totalQ = exam.sessions.reduce(
            (sum, s) => sum + s.subjects.reduce((ss, sub) => ss + sub.questions.length, 0),
            0
          )
          return (
            <Link
              key={exam.id}
              href={`/${exam.id}`}
              className="flex items-center gap-4 bg-white rounded-3xl px-4 py-4 shadow-[0_6px_20px_rgba(37,99,235,0.06)] hover:shadow-[0_8px_28px_rgba(37,99,235,0.12)] transition-shadow active:scale-[0.99]"
            >
              <div
                className={`${exam.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0`}
              >
                {examEmoji[exam.id] ?? '📘'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-400">{exam.organization}</p>
                <h2 className="text-lg font-extrabold text-slate-900 leading-tight truncate">
                  {exam.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {exam.subtitle} · 총 {totalQ}문제
                </p>
              </div>
              <span className={`text-xl font-black ${exam.textColor} shrink-0`}>›</span>
            </Link>
          )
        })}
      </div>

      <p className="text-center text-xs text-slate-400 mt-10">
        공공데이터 기반 · 학습용 샘플 문제
      </p>
    </div>
  )
}
