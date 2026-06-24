import Link from 'next/link'
import { exams } from '@/lib/data'

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">자격증 기출문제</h1>
        <p className="text-sm text-gray-500 mt-1">언제 어디서나 CBT 모의고사</p>
      </header>

      <div className="space-y-4">
        {exams.map((exam) => (
          <Link
            key={exam.id}
            href={`/${exam.id}`}
            className="block rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white hover:shadow-md transition-shadow"
          >
            <div className={`${exam.color} px-5 py-4`}>
              <p className="text-white/80 text-xs font-medium">{exam.organization}</p>
              <h2 className="text-white text-xl font-bold mt-0.5">{exam.name}</h2>
              <p className="text-white/70 text-sm mt-1">{exam.subtitle}</p>
            </div>
            <div className="px-5 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {exam.sessions.length}개 회차 수록
              </span>
              <span className={`text-sm font-semibold ${exam.textColor}`}>
                시작하기 →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        공공데이터 기반 · 학습용 샘플 문제
      </p>
    </div>
  )
}
