import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getExam } from '@/lib/data'
import { ExamStatsBar } from './ExamStatsBar'

export default async function ExamPage({
  params,
}: {
  params: Promise<{ examId: string }>
}) {
  const { examId } = await params
  const exam = getExam(examId)
  if (!exam) notFound()

  const totalQuestions = exam.sessions.reduce(
    (sum, s) => sum + s.subjects.reduce((ss, sub) => ss + sub.questions.length, 0),
    0
  )

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <Link href="/" className="text-sm text-gray-500 flex items-center gap-1 mb-4">
        ← 목록으로
      </Link>

      <div className={`${exam.color} rounded-2xl px-5 py-5 mb-6`}>
        <p className="text-white/70 text-xs">{exam.organization}</p>
        <h1 className="text-white text-2xl font-bold mt-0.5">{exam.name}</h1>
        <p className="text-white/80 text-sm mt-1">{totalQuestions}문제 수록</p>
      </div>

      <ExamStatsBar examId={examId} />

      <div className="flex gap-3 mb-6">
        <Link
          href={`/${examId}/wrong`}
          className="flex-1 text-center py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          틀린 문제 보기
        </Link>
        <Link
          href={`/${examId}/stats`}
          className="flex-1 text-center py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          학습 통계
        </Link>
      </div>

      <h2 className="text-base font-semibold text-gray-800 mb-3">회차 선택</h2>
      <div className="space-y-3">
        {exam.sessions.map((session) => {
          const total = session.subjects.reduce((s, sub) => s + sub.questions.length, 0)
          return (
            <Link
              key={session.id}
              href={`/${examId}/quiz?session=${session.id}`}
              className="block bg-white rounded-xl border border-gray-100 px-4 py-4 hover:border-gray-300 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{session.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">총 {total}문제</p>
                </div>
                <span className={`text-lg font-bold ${exam.textColor}`}>→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
