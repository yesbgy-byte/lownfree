export type ExamId = 'origin-manager' | 'bonded-area' | 'real-estate'

export interface Exam {
  id: ExamId
  name: string
  subtitle: string
  organization: string
  color: string      // tailwind bg color class
  textColor: string  // tailwind text color class
  sessions: Session[]
}

export interface Session {
  id: string
  year: number
  round: number
  label: string
  subjects: Subject[]
}

export interface Subject {
  id: string
  name: string
  questions: Question[]
}

export interface Question {
  id: string
  number: number
  text: string
  options: string[]
  answer: number // 1-indexed
  explanation: string
}

export interface UserAnswer {
  selected: number
  correct: boolean
  answeredAt: number
}

export type ExamProgress = Record<string, UserAnswer>
export type AllProgress = Record<string, ExamProgress>

export interface QuizResult {
  sessionId: string
  examId: ExamId
  total: number
  correct: number
  completedAt: number
}
