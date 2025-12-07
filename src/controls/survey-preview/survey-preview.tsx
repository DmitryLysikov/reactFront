import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useSurveyStore } from "@/store/survey-store"

export function SurveyPreview() {
  const settings = useSurveyStore((state) => state.settings)
  const questions = useSurveyStore((state) => state.questions)
  
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)

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

  const handleCustomSingleChange = (questionId: string, checked: boolean) => {
    if (checked) {
      setAnswers(prev => ({ ...prev, [questionId]: 'custom' }))
    } else {
      setAnswers(prev => {
        const newAnswers = { ...prev }
        delete newAnswers[questionId]
        delete newAnswers[`${questionId}-custom`]
        return newAnswers
      })
    }
  }

  const handleCustomMultipleChange = (questionId: string, checked: boolean) => {
    const current = answers[questionId] || []
    if (checked) {
      setAnswers(prev => ({ ...prev, [questionId]: [...current, 'custom'] }))
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: current.filter((item: any) => item !== 'custom'),
        [`${questionId}-custom`]: undefined
      }))
    }
  }

  const handleSubmit = () => {
    console.log('Ответы:', answers)
    setSubmitted(true)
    alert('Голос отправлен! (тест)')
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
        {!submitted && (
          <Button 
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-xl"
          >
            Отправить
          </Button>
        )}
      </div>

      {submitted && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6">
          ✓ Спасибо! Ваш ответ записан.
        </div>
      )}

      {/* Вопросы */}
      <div className="space-y-4">
        {questions.map((question, qIndex) => {
          if (!question.text) return null
          
          const isChoiceType = question.type === 'single' || question.type === 'multiple'
          const isScaleType = question.type === 'scale'

          return (
            <div key={question.id} className="bg-orange-500 rounded-3xl p-6">
              <h3 className="text-white text-lg font-medium mb-4">
                {qIndex + 1}. {question.text}
              </h3>

              {/* Вложения с превью */}
              {question.attachments.length > 0 && (
                <div className="mb-4 space-y-2">
                  {question.attachments.map((attachment) => {
                    const isImage = attachment.type.startsWith('image/')

                    return (
                      <div key={attachment.id} className="bg-white/20 rounded-lg p-2">
                        {isImage ? (
                          <div>
                            <img
                              src={attachment.dataUrl}
                              alt={attachment.name}
                              className="w-full max-h-48 object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
                              onClick={() => window.open(attachment.dataUrl, '_blank')}
                              title="Нажмите чтобы открыть в полном размере"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                console.error('Ошибка загрузки изображения')
                                target.style.display = 'none'
                              }}
                            />
                            <p className="text-white text-xs mt-1 text-center">
                              {attachment.name}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-white text-sm">
                            <FileText className="size-4" />
                            <a
                              href={attachment.dataUrl}
                              download={attachment.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate hover:underline cursor-pointer"
                            >
                              {attachment.name}
                            </a>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Single choice */}
              {question.type === 'single' && (
                <div className="space-y-2">
                  {question.options.filter(o => o).map((option, oIndex) => {
                    const isSelected = answers[question.id] === oIndex

                    return (
                      <label
                        key={oIndex}
                        className={`
                          flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer
                          border-2 transition
                          ${isSelected ? 'border-orange-700' : 'border-transparent'}
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${isSelected ? 'border-orange-600' : 'border-gray-300'}
                        `}>
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                          )}
                        </div>
                        <span className="text-gray-700">{option}</span>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          className="hidden"
                          checked={isSelected}
                          onChange={() => updateAnswer(question.id, oIndex)}
                          disabled={submitted}
                        />
                      </label>
                    )
                  })}

                  {/* Свой вариант для single */}
                  {question.allowCustomAnswer && (
                    <div className="mt-3 p-3 bg-white rounded-xl">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${answers[question.id] === 'custom' ? 'border-orange-600' : 'border-gray-300'}
                        `}>
                          {answers[question.id] === 'custom' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                          )}
                        </div>
                        <span className="text-gray-700 font-medium">
                          {question.customAnswerText || 'Свой вариант:'}
                        </span>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={answers[question.id] === 'custom'}
                          onChange={(e) => handleCustomSingleChange(question.id, e.target.checked)}
                          disabled={submitted}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={answers[`${question.id}-custom`] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [`${question.id}-custom`]: e.target.value }))}
                        placeholder="Введите свой вариант"
                        disabled={submitted || answers[question.id] !== 'custom'}
                        className="mt-2 w-full bg-gray-50 rounded-lg px-4 py-2 outline-none disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Multiple choice */}
              {question.type === 'multiple' && (
                <div className="space-y-2">
                  {question.options.filter(o => o).map((option, oIndex) => {
                    const selected = (answers[question.id] || []).includes(oIndex)

                    return (
                      <label
                        key={oIndex}
                        className={`
                          flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer
                          border-2 transition
                          ${selected ? 'border-orange-700' : 'border-transparent'}
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center
                          ${selected ? 'border-orange-600 bg-orange-600' : 'border-gray-300'}
                        `}>
                          {selected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700">{option}</span>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={selected}
                          disabled={submitted}
                          onChange={(e) => handleMultipleChange(question.id, oIndex, e.target.checked)}
                        />
                      </label>
                    )
                  })}

                  {/* Свой вариант для multiple */}
                  {question.allowCustomAnswer && (
                    <div className="mt-3 p-3 bg-white rounded-xl">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center
                          ${(answers[question.id] || []).includes('custom') ? 'border-orange-600 bg-orange-600' : 'border-gray-300'}
                        `}>
                          {(answers[question.id] || []).includes('custom') && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700 font-medium">
                          {question.customAnswerText || 'Свой вариант:'}
                        </span>
                        <input
                          type="checkbox"
                          checked={(answers[question.id] || []).includes('custom')}
                          onChange={(e) => handleCustomMultipleChange(question.id, e.target.checked)}
                          disabled={submitted}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={answers[`${question.id}-custom`] || ''}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [`${question.id}-custom`]: e.target.value }))}
                        placeholder="Введите свой вариант"
                        disabled={submitted || !(answers[question.id] || []).includes('custom')}
                        className="mt-2 w-full bg-gray-50 rounded-lg px-4 py-2 outline-none disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>
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
                        onClick={() => !submitted && updateAnswer(question.id, num)}
                        disabled={submitted}
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