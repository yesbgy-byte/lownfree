import { notFound, redirect } from 'next/navigation'
import { getExam, getSubject, getAllQuestionsForExam } from '@/lib/data'
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
  searchParams: Promise<{ subject?: string; mode?: string }>
}) {
  const { examId } = await params
  const { subject: subjectId, mode } = await searchParams

  const exam = getExam(examId)
  if (!exam) notFound()

  let questions: Question[]
  let label: string

  if (subjectId) {
    const subject = getSubject(examId, subjectId)
    if (!subject) redirect(`/${examId}`)
    questions = shuffle(subject.questions)
    label = subject.name
  } else if (mode === 'random') {
    questions = shuffle(getAllQuestionsForExam(examId))
    label = '전체 랜덤'
  } else {
    redirect(`/${examId}`)
  }

  return (
    <QuizClient examId={examId} examName={exam.name} label={label} questions={questions} />
  )
}
