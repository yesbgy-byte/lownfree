import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getExam } from '@/lib/data'
import { ExamStatsBar } from './ExamStatsBar'

const examEmoji: Record<string, string> = {
  'origin-manager': '🌏',
  'bonded-area': '📦',
  'real-estate': '🏠',
}

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
    <div className="max-w-lg mx-auto px-5 pt-6 pb-12">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-400 mb-4">
        ‹ 목록으로
      </Link>

      {/* Hero card */}
      <div className={`${exam.color} rounded-3xl px-6 py-7 mb-5 relative overflow-hidden`}>
        <div className="absolute -right-4 -top-3 text-7xl opacity-20 select-none">
          {examEmoji[examId] ?? '📘'}
        </div>
        <p className="text-white/70 text-xs font-bold relative">{exam.organization}</p>
        <h1 className="text-white text-2xl font-black mt-1 relative">{exam.name}</h1>
        <p className="text-white/80 text-sm mt-1.5 relative">{exam.subtitle}</p>
        <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mt-4 relative">
          📚 총 {totalQuestions}문제 수록
        </div>
      </div>

      <ExamStatsBar examId={examId} />

      {/* Primary action */}
      <Link
        href={`/${examId}/quiz?mode=random`}
        className={`flex items-center justify-center gap-2 w-full py-4 rounded-2xl ${exam.color} text-white font-extrabold text-base shadow-[0_8px_24px_rgba(37,99,235,0.25)] active:scale-[0.99] transition-transform mb-3`}
      >
        🎲 랜덤 문제 풀기
      </Link>

      <div className="flex gap-3">
        <Link
          href={`/${examId}/wrong`}
          className="flex-1 text-center py-3.5 rounded-2xl bg-white text-sm font-bold text-slate-600 shadow-[0_4px_14px_rgba(37,99,235,0.05)] active:scale-[0.98] transition-transform"
        >
          ✏️ 틀린 문제
        </Link>
        <Link
          href={`/${examId}/stats`}
          className="flex-1 text-center py-3.5 rounded-2xl bg-white text-sm font-bold text-slate-600 shadow-[0_4px_14px_rgba(37,99,235,0.05)] active:scale-[0.98] transition-transform"
        >
          📊 학습 통계
        </Link>
      </div>
    </div>
  )
}
