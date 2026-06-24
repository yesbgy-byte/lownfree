import { notFound, redirect } from 'next/navigation'
import { getExam, getAllQuestions, getAllQuestionsForExam } from '@/lib/data'
import { QuizClient } from './QuizClient'
import { Question } from '@/lib/types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ examId: string }>
  searchParams: Promise<{ session?: string; mode?: string }>
}) {
  const { examId } = await params
  const { session: sessionId, mode } = await searchParams

  const exam = getExam(examId)
  if (!exam) notFound()

  let questions: Question[]
  let sessionLabel: string

  if (mode === 'random') {
    questions = shuffle(getAllQuestionsForExam(examId))
    sessionLabel = '랜덤 모드'
  } else {
    if (!sessionId) redirect(`/${examId}`)
    const session = exam.sessions.find((s) => s.id === sessionId)
    if (!session) redirect(`/${examId}`)
    questions = getAllQuestions(examId, sessionId)
    sessionLabel = session.label
  }

  return (
    <QuizClient
      examId={examId}
      examName={exam.name}
      examColor={exam.color}
      sessionLabel={sessionLabel}
      sessionId={sessionId ?? 'random'}
      questions={questions}
    />
  )
}
