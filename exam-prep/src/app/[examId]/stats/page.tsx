import { notFound } from 'next/navigation'
import { getExam } from '@/lib/data'
import { StatsClient } from './StatsClient'

export default async function StatsPage({
  params,
}: {
  params: Promise<{ examId: string }>
}) {
  const { examId } = await params
  const exam = getExam(examId)
  if (!exam) notFound()

  const sessions = exam.sessions.map((s) => ({
    id: s.id,
    label: s.label,
    questionIds: s.subjects.flatMap((sub) => sub.questions.map((q) => q.id)),
  }))

  return (
    <StatsClient
      examId={examId}
      examName={exam.name}
      examColor={exam.color}
      sessions={sessions}
    />
  )
}
