import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pollApi, PollCreateDto } from '../poll-api'

export const pollKeys = {
  all: ['polls'] as const,
  detail: (id: number) => ['polls', id] as const,
  statistics: (id: number) => ['polls', id, 'statistics'] as const,
}

// Получить все опросы
export function usePolls() {
  return useQuery({
    queryKey: pollKeys.all,
    queryFn: pollApi.getAll,
  })
}

// Получить один опрос
export function usePoll(id: number) {
  return useQuery({
    queryKey: pollKeys.detail(id),
    queryFn: () => pollApi.getById(id),
    enabled: id > 0,
  })
}

// Получить статистику опроса
export function usePollStatistics(id: number) {
  return useQuery({
    queryKey: pollKeys.statistics(id),
    queryFn: () => pollApi.getStatistics(id),
    enabled: id > 0,
  })
}

// Создать опрос
export function useCreatePoll() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PollCreateDto) => pollApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pollKeys.all })
    },
  })
}

// Проголосовать (один вариант)
export function useVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pollId, optionId }: { pollId: number; optionId: number }) =>
      pollApi.vote(pollId, optionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(variables.pollId) })
      queryClient.invalidateQueries({ queryKey: pollKeys.statistics(variables.pollId) })
    },
  })
}

// Проголосовать (несколько вариантов)
export function useVoteMultiple() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ pollId, optionIds }: { pollId: number; optionIds: number[] }) =>
      pollApi.voteMultiple(pollId, optionIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(variables.pollId) })
      queryClient.invalidateQueries({ queryKey: pollKeys.statistics(variables.pollId) })
    },
  })
}

// Закрыть опрос
export function useClosePoll() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pollId: number) => pollApi.close(pollId),
    onSuccess: (_, pollId) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
      queryClient.invalidateQueries({ queryKey: pollKeys.all })
    },
  })
}

// Удалить опрос
export function useDeletePoll() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pollId: number) => pollApi.delete(pollId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pollKeys.all })
    },
  })
}