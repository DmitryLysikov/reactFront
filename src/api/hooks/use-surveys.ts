import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { surveyApi, Survey, CreateSurveyDto } from '../survey-api'

// Ключи для кеша
export const surveyKeys = {
  all: ['surveys'] as const,
  detail: (id: string) => ['surveys', id] as const,
}

// Получить все опросы
export function useSurveys() {
  return useQuery({
    queryKey: surveyKeys.all,
    queryFn: surveyApi.getAll,
  })
}

// Получить один опрос
export function useSurvey(id: string) {
  return useQuery({
    queryKey: surveyKeys.detail(id),
    queryFn: () => surveyApi.getById(id),
    enabled: !!id,
  })
}

// Создать опрос
export function useCreateSurvey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSurveyDto) => surveyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
    },
  })
}

// Обновить опрос
export function useUpdateSurvey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSurveyDto> }) =>
      surveyApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(variables.id) })
    },
  })
}

// Удалить опрос
export function useDeleteSurvey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => surveyApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
    },
  })
}