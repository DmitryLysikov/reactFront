import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type QuestionType = 'single' | 'multiple' | 'scale'

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  dataUrl: string  // ← base64 URL для изображений
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
  allowCustomAnswer: boolean
  customAnswerText: string
}

interface SurveySettings {
  title: string
  description: string
  isAnonymous: boolean
  shuffleQuestions: boolean
  showProgress: boolean
}

interface SurveyStore {
  settings: SurveySettings
  updateSettings: (data: Partial<SurveySettings>) => void
  
  questions: Question[]
  addQuestion: () => void
  removeQuestion: (id: string) => void
  updateQuestion: (id: string, data: Partial<Question>) => void
  addOption: (questionId: string) => void
  removeOption: (questionId: string, optionIndex: number) => void
  updateOption: (questionId: string, optionIndex: number, value: string) => void
  addAttachment: (questionId: string, file: File) => void
  removeAttachment: (questionId: string, fileId: string) => void
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
  allowCustomAnswer: false,
  customAnswerText: '',
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
      settings: initialSettings,
      
      updateSettings: (data) => set((state) => ({
        settings: { ...state.settings, ...data }
      })),

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

      // Добавить вложение с base64
      addAttachment: (questionId, file) => {
        const reader = new FileReader()
        
        reader.onloadend = () => {
          const dataUrl = reader.result as string
          
          set((state) => ({
            questions: state.questions.map((q) =>
              q.id === questionId
                ? {
                    ...q,
                    attachments: [
                      ...q.attachments,
                      {
                        id: `${Date.now()}-${Math.random()}`,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        dataUrl: dataUrl,
                      },
                    ]
                  }
                : q
            )
          }))
        }
        
        reader.onerror = () => {
          console.error('Ошибка чтения файла')
          alert('Не удалось загрузить файл')
        }
        
        reader.readAsDataURL(file)
      },

      // Удалить вложение
      removeAttachment: (questionId, fileId) => set((state) => ({
        questions: state.questions.map((q) =>
          q.id === questionId
            ? { ...q, attachments: q.attachments.filter((a) => a.id !== fileId) }
            : q
        )
      })),

      resetSurvey: () => set({
        settings: initialSettings,
        questions: [createEmptyQuestion()],
      }),
    }),
    {
      name: 'survey-storage',
    }
  )
)