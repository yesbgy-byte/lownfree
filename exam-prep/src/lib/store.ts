'use client'

import { AllProgress, ExamProgress, UserAnswer } from './types'

const STORAGE_KEY = 'exam_progress'

function load(): AllProgress {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function save(data: AllProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function saveAnswer(examId: string, questionId: string, answer: UserAnswer) {
  const data = load()
  if (!data[examId]) data[examId] = {}
  data[examId][questionId] = answer
  save(data)
}

export function getExamProgress(examId: string): ExamProgress {
  return load()[examId] ?? {}
}

export function getWrongAnswers(examId: string): ExamProgress {
  const progress = getExamProgress(examId)
  return Object.fromEntries(
    Object.entries(progress).filter(([, v]) => !v.correct)
  )
}

export function getStats(examId: string) {
  const progress = getExamProgress(examId)
  const entries = Object.values(progress)
  const total = entries.length
  const correct = entries.filter((e) => e.correct).length
  return { total, correct, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 }
}

export function clearExamProgress(examId: string) {
  const data = load()
  delete data[examId]
  save(data)
}
