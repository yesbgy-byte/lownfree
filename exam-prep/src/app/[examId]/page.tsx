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
        <p className="text-white/80 text-sm mt-1">총 {totalQuestions}문제 수록</p>
      </div>

      <ExamStatsBar examId={examId} />

      <Link
        href={`/${examId}/quiz?mode=random`}
        className={`block w-full text-center py-4 rounded-xl ${exam.color} text-white font-bold text-base mb-4`}
      >
        랜덤 문제 풀기
      </Link>

      <div className="flex gap-3">
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
    </div>
  )
}
