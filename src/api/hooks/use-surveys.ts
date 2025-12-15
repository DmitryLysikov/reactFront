import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { surveyApi, SurveyCreateDto, SurveyGetDto } from '../survey-api'

const surveyKeys = {
  all: ['surveys'] as const,
  detail: (id: number) => ['surveys', id] as const,
}

export function useSurveys() {
  return useQuery({
    queryKey: surveyKeys.all,
    queryFn: surveyApi.getAll,
  })
}

export function useSurvey(id: number) {
  return useQuery({
    queryKey: surveyKeys.detail(id),
    queryFn: () => surveyApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateSurvey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SurveyCreateDto) => surveyApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
    },
  })
}

export function useUpdateSurvey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SurveyCreateDto }) => 
      surveyApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(id) })
    },
  })
}

export function useDeleteSurvey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: surveyApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.all })
    },
  })
}