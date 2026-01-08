import api from './axios'

// ============ ТИПЫ ============

export interface PollOptionDto {
  Id: number
  Text: string
  VotesCount: number | null
}

export interface PollDto {
  Id: number
  Subject: string
  Description: string
  IsMultipleChoice: boolean
  StatusVote: 'Draft' | 'Active' | 'Closed'
  Options: PollOptionDto[]
  MyVoteOptionId: number | null
  MyVoteOptionIds?: number[] | null  // Для множественного выбора
  Author?: number | null  // ID создателя опроса
}

export interface PollCreateDto {
  Subject: string
  Description?: string
  IsMultipleChoice: boolean
  Options: string[]
}

export interface PollOptionStatisticDto {
  Id: number
  Text: string
  VotesCount: number | null
  EmployesIds: number[]
}

export interface PollStatisticDto {
  PollVoteId: number
  PollVoteCount: number
  Options: PollOptionStatisticDto[]
}

// ============ API МЕТОДЫ ============

export const pollApi = {
  getById: async (pollId: number): Promise<PollDto> => {
    const response = await api.get(`GetPoll(pollId=${pollId})`)
    return response.data
  },

  getAll: async (): Promise<PollDto[]> => {
    const response = await api.get('GetPolls()')
    return response.data.value || response.data
  },

  create: async (data: PollCreateDto): Promise<PollDto> => {
    const response = await api.post('PollCreate', {
      pollDto: data
    })
    return response.data
  },

  vote: async (pollId: number, optionId: number): Promise<void> => {
    await api.post('SubmitVote', {
      pollId,
      optionId
    })
  },

  voteMultiple: async (pollId: number, optionIds: number[]): Promise<void> => {
    await api.post('SubmitVote', {
      pollId,
      optionIds
    })
  },

  getStatistics: async (pollId: number): Promise<PollStatisticDto> => {
    const response = await api.get(`GetPollStatistics(pollId=${pollId})`)
    return response.data
  },

  close: async (pollId: number): Promise<void> => {
    await api.post('ClosePoll', { pollId })
  },

  delete: async (pollId: number): Promise<void> => {
    await api.post('DeletePoll', { pollId })
  },
}