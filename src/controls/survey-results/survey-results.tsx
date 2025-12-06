// src/controls/survey-results/survey-results.tsx
import React from "react"
import { useSurveys, useDeleteSurvey } from "@/api"  // ← импорт хуков

export function SurveyResults() {
  // Загрузка списка опросов
  const { data: surveys, isLoading, error } = useSurveys()
  
  // Мутация для удаления
  const deleteSurvey = useDeleteSurvey()

  // Загрузка
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-500">Загрузка опросов...</div>
      </div>
    )
  }

  // Ошибка
  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-red-50 text-red-600 p-4 rounded-lg">
        Ошибка загрузки: {error.message}
      </div>
    )
  }

  // Пустой список
  if (!surveys?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        Пока нет сохранённых опросов
      </div>
    )
  }

  // Список опросов
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Сохранённые опросы
      </h2>
      
      {surveys.map((survey) => (
        <div
          key={survey.id}
          className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold text-gray-800">{survey.title}</h3>
            <p className="text-sm text-gray-500">
              {survey.questions.length} вопросов
            </p>
          </div>
          
          <button
            onClick={() => deleteSurvey.mutate(survey.id)}
            disabled={deleteSurvey.isPending}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            {deleteSurvey.isPending ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      ))}
    </div>
  )
}