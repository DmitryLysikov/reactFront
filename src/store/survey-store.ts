import { create } from 'zustand'

type QuestionType = 'single' | 'multiple' | 'short' | 'long' | 'scale'

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  file: File
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
  attachments: AttachedFile[]  // ← NEW
}

interface SurveyStore {
  questions: Question[]
  
  addQuestion: () => void
  removeQuestion: (id: string) => void
  updateQuestion: (id: string, data: Partial<Question>) => void
  addOption: (questionId: string) => void
  removeOption: (questionId: string, optionIndex: number) => void
  updateOption: (questionId: string, optionIndex: number, value: string) => void
  addAttachment: (questionId: string, file: File) => void      // ← NEW
  removeAttachment: (questionId: string, fileId: string) => void // ← NEW
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
  attachments: [],  // ← NEW
})

export const useSurveyStore = create<SurveyStore>((set) => ({
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

  // ← NEW: Добавить файл
  addAttachment: (questionId, file) => set((state) => ({
    questions: state.questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            attachments: [
              ...q.attachments,
              {
                id: Date.now().toString(),
                name: file.name,
                size: file.size,
                type: file.type,
                file: file,
              }
            ]
          }
        : q
    )
  })),

  // ← NEW: Удалить файл
  removeAttachment: (questionId, fileId) => set((state) => ({
    questions: state.questions.map((q) =>
      q.id === questionId
        ? { ...q, attachments: q.attachments.filter((a) => a.id !== fileId) }
        : q
    )
  })),
}))