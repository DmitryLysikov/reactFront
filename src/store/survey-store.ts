import { create } from 'zustand'
import { persist } from 'zustand/middleware'  // ← для сохранения в localStorage

type QuestionType = 'single' | 'multiple' | 'short' | 'long' | 'scale'

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
}

interface Question {
  id: string
  text: string
  type: QuestionType
  options: string[]
  scaleStart: string
  scaleEnd: string
  scaleLabelStart: string
  scaleLabelEnd: string
  attachments: AttachedFile[]
}

// Настройки опроса
interface SurveySettings {
  title: string
  description: string
  isAnonymous: boolean
  shuffleQuestions: boolean
  showProgress: boolean
}

interface SurveyStore {
  // Настройки
  settings: SurveySettings
  updateSettings: (data: Partial<SurveySettings>) => void
  
  // Вопросы
  questions: Question[]
  addQuestion: () => void
  removeQuestion: (id: string) => void
  updateQuestion: (id: string, data: Partial<Question>) => void
  addOption: (questionId: string) => void
  removeOption: (questionId: string, optionIndex: number) => void
  updateOption: (questionId: string, optionIndex: number, value: string) => void
  
  // Сброс
  resetSurvey: () => void
}

const createEmptyQuestion = (): Question => ({
  id: Date.now().toString(),
  text: '',
  type: 'single',
  options: [''],
  scaleStart: '1',
  scaleEnd: '5',
  scaleLabelStart: '',
  scaleLabelEnd: '',
  attachments: [],
})

const initialSettings: SurveySettings = {
  title: '',
  description: '',
  isAnonymous: false,
  shuffleQuestions: false,
  showProgress: true,
}

export const useSurveyStore = create<SurveyStore>()(
  persist(
    (set) => ({
      // Настройки
      settings: initialSettings,
      
      updateSettings: (data) => set((state) => ({
        settings: { ...state.settings, ...data }
      })),

      // Вопросы
      questions: [createEmptyQuestion()],

      addQuestion: () => set((state) => ({
        questions: [...state.questions, createEmptyQuestion()]
      })),

      removeQuestion: (id) => set((state) => ({
        questions: state.questions.length > 1
          ? state.questions.filter((q) => q.id !== id)
          : state.questions
      })),

      updateQuestion: (id, data) => set((state) => ({
        questions: state.questions.map((q) =>
          q.id === id ? { ...q, ...data } : q
        )
      })),

      addOption: (questionId) => set((state) => ({
        questions: state.questions.map((q) =>
          q.id === questionId
            ? { ...q, options: [...q.options, ''] }
            : q
        )
      })),

      removeOption: (questionId, optionIndex) => set((state) => ({
        questions: state.questions.map((q) =>
          q.id === questionId && q.options.length > 1
            ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
            : q
        )
      })),

      updateOption: (questionId, optionIndex, value) => set((state) => ({
        questions: state.questions.map((q) =>
          q.id === questionId
            ? { ...q, options: q.options.map((opt, i) => i === optionIndex ? value : opt) }
            : q
        )
      })),

      // Сброс всего опроса
      resetSurvey: () => set({
        settings: initialSettings,
        questions: [createEmptyQuestion()],
      }),
    }),
    {
      name: 'survey-storage', // ключ в localStorage
    }
  )
)