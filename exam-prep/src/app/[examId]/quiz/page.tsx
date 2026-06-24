import { notFound, redirect } from 'next/navigation'
import { getExam, getAllQuestions } from '@/lib/data'
import { QuizClient } from './QuizClient'

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ examId: string }>
  searchParams: Promise<{ session?: string }>
}) {
  const { examId } = await params
  const { session: sessionId } = await searchParams

  if (!sessionId) redirect(`/${examId}`)

  const exam = getExam(examId)
  if (!exam) notFound()

  const session = exam.sessions.find((s) => s.id === sessionId)
  if (!session) redirect(`/${examId}`)

  const questions = getAllQuestions(examId, sessionId)

  return (
    <QuizClient
      examId={examId}
      examName={exam.name}
      examColor={exam.color}
      sessionLabel={session.label}
      sessionId={sessionId}
      questions={questions}
    />
  )
}
