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
// Формат URL: Vote.{MethodName}(param=value)

export const pollApi = {
  // GET Vote.GetPoll(pollId=6)
  getById: async (pollId: number): Promise<PollDto> => {
    const response = await api.get(`GetPoll(pollId=${pollId})`)
    return response.data
  },

  // GET Vote.GetPolls() - если есть такой метод
  getAll: async (): Promise<PollDto[]> => {
    const response = await api.get('GetPolls()')
    return response.data.value || response.data
  },

  // POST Vote.PollCreate
  create: async (data: PollCreateDto): Promise<PollDto> => {
    const response = await api.post('PollCreate', {
      pollDto: data  // оборачиваем в pollDto
    })
    return response.data
  },

  // POST Vote.SubmitVote
  vote: async (pollId: number, optionId: number): Promise<void> => {
    await api.post('SubmitVote', {
      pollId,
      optionId
    })
  },

  // POST Vote.SubmitVote для нескольких вариантов
  voteMultiple: async (pollId: number, optionIds: number[]): Promise<void> => {
    await api.post('SubmitVote', {
      pollId,
      optionIds
    })
  },

  // GET Vote.GetPollStatistics(pollId=6)
  getStatistics: async (pollId: number): Promise<PollStatisticDto> => {
    const response = await api.get(`GetPollStatistics(pollId=${pollId})`)
    return response.data
  },

  // POST Vote.ClosePoll
  close: async (pollId: number): Promise<void> => {
    await api.post('ClosePoll', { pollId })
  },

  // DELETE/POST Vote.DeletePoll
  delete: async (pollId: number): Promise<void> => {
    await api.post('DeletePoll', { pollId })
  },
}