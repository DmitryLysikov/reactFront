import api from './axios'

// ============ ТИПЫ ДЛЯ ПОЛУЧЕНИЯ ============

export interface PollOptionGetDto {
  Text: string
  Type: number  // 0=Standard, 1=Scale, 2=Detailed
  ScaleMinText: string
  ScaleMaxText: string
  ScaleMin: number
  ScaleMax: number
}

export interface PollGetDto {
  QuestionText: string
  IsMultipleChoice: boolean
  Options: PollOptionGetDto[]
}

export interface SurveyGetDto {
  SurveyName: string
  Description: string
  PollGetDto: PollGetDto[]
}

// ============ ТИПЫ ДЛЯ СОЗДАНИЯ ============

export interface PollOptionCreateDto {
  Text: string
  Type: number  // 0=Standard, 1=Scale, 2=Detailed
  ScaleMinText: string
  ScaleMaxText: string
  ScaleMin: number
  ScaleMax: number
}

export interface PollCreateDto {
  QuestionText: string
  IsMultipleChoice: boolean
  Options: PollOptionCreateDto[]
}

export interface SurveyCreateDto {
  SurveyName: string
  Description: string
  IsAnonymous: boolean
  IsMix: boolean
  IsShowProgress: boolean
  PollCreateDto: PollCreateDto[]
}

// ============ КОНСТАНТЫ ============

export const OptionType = {
  Standard: 0,   // Обычный вариант
  Scale: 1,      // Шкала
  Detailed: 2,   // Свой вариант (детализированный)
} as const

// ============ API МЕТОДЫ ============

export const surveyApi = {
  getAll: async (): Promise<SurveyGetDto[]> => {
    const response = await api.get('GetSurveys()')
    return response.data.value || response.data
  },

  getById: async (id: number): Promise<SurveyGetDto> => {
    const response = await api.get(`GetSurvey(surveyId=${id})`)
    return response.data
  },

  create: async (data: SurveyCreateDto): Promise<SurveyGetDto> => {
    const response = await api.post('SurveyCreate', {
      surveyCreateDto: data
    })
    return response.data
  },

  update: async (id: number, data: SurveyCreateDto): Promise<SurveyGetDto> => {
    const response = await api.post('SurveyUpdate', {
      surveyId: id,
      surveyCreateDto: data
    })
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.post('SurveyDelete', { surveyId: id })
  },
}