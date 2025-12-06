import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSurveyStore } from "@/store/survey-store"

export function SurveyPreview() {
  const settings = useSurveyStore((state) => state.settings)
  const questions = useSurveyStore((state) => state.questions)
  
  // Локальные ответы для превью
  const [answers, setAnswers] = useState<Record<string, any>>({})

  const updateAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleMultipleChange = (questionId: string, optionIndex: number, checked: boolean) => {
    const current = answers[questionId] || []
    if (checked) {
      setAnswers(prev => ({ ...prev, [questionId]: [...current, optionIndex] }))
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: current.filter((i: number) => i !== optionIndex) }))
    }
  }

  if (questions.length === 0 || !questions[0].text) {
    return (
      <div className="text-center py-12 text-gray-500">
        Сначала добавьте вопросы на вкладке "Вопросы"
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {settings.title || 'Без названия'}
          </h1>
          {settings.description && (
            <p className="text-gray-600 mt-1">{settings.description}</p>
          )}
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-xl">
          Отправить
        </Button>
      </div>

      {/* Вопросы */}
      <div className="space-y-4">
        {questions.map((question, qIndex) => {
          if (!question.text) return null
          
          const isChoiceType = question.type === 'single' || question.type === 'multiple'
          const isTextType = question.type === 'short' || question.type === 'long'
          const isScaleType = question.type === 'scale'

          return (
            <div key={question.id} className="bg-orange-500 rounded-3xl p-6">
              <h3 className="text-white text-lg font-medium mb-4">
                {qIndex + 1}. {question.text}
              </h3>

              {/* Single / Multiple choice */}
              {isChoiceType && (
                <div className="space-y-2">
                  {question.options.filter(o => o).map((option, oIndex) => {
                    const isSelected = question.type === 'multiple'
                      ? (answers[question.id] || []).includes(oIndex)
                      : answers[question.id] === oIndex

                    return (
                      <label
                        key={oIndex}
                        className={`
                          flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer
                          border-2 transition
                          ${isSelected ? 'border-orange-700' : 'border-transparent'}
                        `}
                      >
                        {question.type === 'multiple' ? (
                          <div className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center
                            ${isSelected ? 'border-orange-600 bg-orange-600' : 'border-gray-300'}
                          `}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        ) : (
                          <div className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center
                            ${isSelected ? 'border-orange-600' : 'border-gray-300'}
                          `}>
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                            )}
                          </div>
                        )}
                        <span className="text-gray-700">{option}</span>
                        <input
                          type={question.type === 'multiple' ? 'checkbox' : 'radio'}
                          className="hidden"
                          checked={isSelected}
                          onChange={(e) => {
                            if (question.type === 'multiple') {
                              handleMultipleChange(question.id, oIndex, e.target.checked)
                            } else {
                              updateAnswer(question.id, oIndex)
                            }
                          }}
                        />
                      </label>
                    )
                  })}
                </div>
              )}

              {/* Short text */}
              {question.type === 'short' && (
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  placeholder="Ваш ответ"
                  className="w-full bg-white rounded-xl px-4 py-3 outline-none"
                />
              )}

              {/* Long text */}
              {question.type === 'long' && (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  placeholder="Ваш ответ"
                  rows={4}
                  className="w-full bg-white rounded-xl px-4 py-3 outline-none resize-none"
                />
              )}

              {/* Scale */}
              {isScaleType && (
                <div>
                  <div className="flex justify-between mb-2 text-white/80 text-sm">
                    <span>{question.scaleLabelStart}</span>
                    <span>{question.scaleLabelEnd}</span>
                  </div>
                  <div className="flex gap-2">
                    {Array.from(
                      { length: parseInt(question.scaleEnd) - parseInt(question.scaleStart) + 1 },
                      (_, i) => parseInt(question.scaleStart) + i
                    ).map((num) => (
                      <button
                        key={num}
                        onClick={() => updateAnswer(question.id, num)}
                        className={`
                          flex-1 py-3 rounded-xl font-medium transition
                          ${answers[question.id] === num
                            ? 'bg-orange-700 text-white'
                            : 'bg-white text-gray-700 hover:bg-orange-100'}
                        `}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}