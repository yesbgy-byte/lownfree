import { notFound } from 'next/navigation'
import { getExam } from '@/lib/data'
import { WrongClient } from './WrongClient'

export default async function WrongPage({
  params,
}: {
  params: Promise<{ examId: string }>
}) {
  const { examId } = await params
  const exam = getExam(examId)
  if (!exam) notFound()

  const allQuestions = exam.subjects.flatMap((s) => s.questions)

  return (
    <WrongClient
      examId={examId}
      examName={exam.name}
      examColor={exam.color}
      allQuestions={allQuestions}
    />
  )
}
