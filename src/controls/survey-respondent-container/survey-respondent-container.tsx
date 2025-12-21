import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SurveyRespondent } from '@/components/survey-respondent/survey-respondent'
import { pollApi } from '@/api/poll-api'
import { SurveyApp } from '@/controls/survey-app/survey-app'

interface Props {
  surveyId?: number
  currentUserId?: number
}

export function SurveyRespondentContainer({ surveyId, currentUserId }: Props) {
  const [mode, setMode] = useState<'choose' | 'vote' | 'edit' | null>(null)
  const queryClient = useQueryClient()

  const { data: poll, isLoading, error } = useQuery({
    queryKey: ['poll', surveyId],
    queryFn: () => pollApi.getById(surveyId!),
    enabled: !!surveyId,
  })

  const voteMutation = useMutation({
    mutationFn: (optionId: number | number[]) => {
      if (Array.isArray(optionId)) {
        return pollApi.voteMultiple(surveyId!, optionId)
      } else {
        return pollApi.vote(surveyId!, optionId)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['poll', surveyId] })
    },
  })

  if (!surveyId) {
    return (
      <div className="p-8 text-center text-gray-500">
        ID опроса не указан
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Загрузка опроса...</div>
      </div>
    )
  }

  if (error || !poll) {
    return (
      <div className="p-8 text-center text-red-500">
        Ошибка загрузки опроса
      </div>
    )
  }

  // Проверяем, является ли текущий пользователь создателем
  const isCreator = currentUserId && poll.Author && currentUserId === poll.Author

  // Если создатель и ещё не выбрал режим — показываем выбор
  if (isCreator && mode === null) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {poll.Subject}
            </h2>
            <p className="text-gray-500 mb-6">Вы создатель этого опроса</p>
            
            <div className="space-y-3">
              <button
                onClick={() => setMode('vote')}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
              >
                Пройти опрос
              </button>
              <button
                onClick={() => setMode('edit')}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
              >
                Редактировать опрос
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Режим редактирования — показываем SurveyApp
  if (mode === 'edit') {
    return <SurveyApp />
  }

  // Режим голосования (или обычный пользователь)
  return (
    <SurveyRespondent
      poll={poll}
      onVote={(optionId) => voteMutation.mutate(optionId)}
      isVoting={voteMutation.isPending}
    />
  )
}