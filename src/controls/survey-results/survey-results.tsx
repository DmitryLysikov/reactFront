import React from "react"

export function SurveyResults() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Результаты опроса
        </h2>
        <p className="text-gray-500">
          Здесь будут отображаться ответы респондентов
        </p>
        
        {/* TODO: Статистика, графики, таблица ответов */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">0</div>
            <div className="text-sm text-gray-600">Всего ответов</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600">0%</div>
            <div className="text-sm text-gray-600">Завершили</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">0:00</div>
            <div className="text-sm text-gray-600">Среднее время</div>
          </div>
        </div>
      </div>
    </div>
  )
}