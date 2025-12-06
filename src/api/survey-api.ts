import api from './axios'

// Типы
export interface Question {
  id?: string
  text: string
  type: 'single' | 'multiple' | 'short' | 'long' | 'scale'
  options: string[]
  scaleStart?: string
  scaleEnd?: string
  scaleLabelStart?: string
  scaleLabelEnd?: string
}

export interface Survey {
  id: string
  title: string
  description?: string
  questions: Question[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateSurveyDto {
  title: string
  description?: string
  questions: Question[]
}

// API методы
export const surveyApi = {
  getAll: async (): Promise<Survey[]> => {
    const response = await api.get('/surveys')
    return response.data
  },

  getById: async (id: string): Promise<Survey> => {
    const response = await api.get(`/surveys/${id}`)
    return response.data
  },

  create: async (data: CreateSurveyDto): Promise<Survey> => {
    const response = await api.post('/surveys', data)
    return response.data
  },

  update: async (id: string, data: Partial<CreateSurveyDto>): Promise<Survey> => {
    const response = await api.put(`/surveys/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/surveys/${id}`)
  },
}