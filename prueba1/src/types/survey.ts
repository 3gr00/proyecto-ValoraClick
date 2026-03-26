export interface Survey {
  id: string
  title: string
  description: string
  questions: Question[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  responses: number
}

export interface Question {
  id: string
  type: 'text' | 'multiple-choice' | 'rating' | 'checkbox'
  question: string
  options?: string[]
  required: boolean
  order: number
}

export interface SurveyResponse {
  id: string
  surveyId: string
  answers: Answer[]
  submittedAt: Date
}

export interface Answer {
  questionId: string
  value: string | string[] | number
}
