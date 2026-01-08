// src/controls/survey-builder/survey-builder.tsx
import React, { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/question-card/question-card"
import { useSurveyStore } from "@/store/survey-store"
import { useCreateSurvey } from "@/api/hooks/use-surveys"
import { SurveyCreateDto, PollCreateDto, PollOptionCreateDto, OptionType } from "@/api/survey-api"

export function SurveyBuilder() {
  const settings = useSurveyStore((state) => state.settings)
  const questions = useSurveyStore((state) => state.questions)
  const addQuestion = useSurveyStore((state) => state.addQuestion)
  
  const createSurvey = useCreateSurvey()
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Маппинг из Zustand в формат бэкенда
  const mapToApiFormat = (): SurveyCreateDto => {
    const polls: PollCreateDto[] = questions.map((q) => {
      let options: PollOptionCreateDto[] = []

      if (q.type === 'scale') {
        // Для шкалы - один вариант с Type=1
        options = [{
          Text: q.text,
          Type: OptionType.Scale,
          ScaleMin: parseInt(q.scaleStart) || 1,
          ScaleMax: parseInt(q.scaleEnd) || 5,
          ScaleMinText: q.scaleLabelStart || '',
          ScaleMaxText: q.scaleLabelEnd || '',
        }]
      } else {
        // Для single/multiple - обычные варианты
        options = q.options
          .filter(opt => opt.trim() !== '')
          .map(opt => ({
            Text: opt,
            Type: OptionType.Standard,
            ScaleMin: 0,
            ScaleMax: 0,
            ScaleMinText: '',
            ScaleMaxText: '',
          }))

        // Если разрешён свой вариант - добавляем Type=2
        if (q.allowCustomAnswer) {
          options.push({
            Text: q.customAnswerText || 'Свой вариант',
            Type: OptionType.Detailed,
            ScaleMin: 0,
            ScaleMax: 0,
            ScaleMinText: '',
            ScaleMaxText: '',
          })
        }
      }

      return {
        QuestionText: q.text,
        IsMultipleChoice: q.type === 'multiple',
        Options: options,
      }
    })

           return {
      SurveyName: settings.title,
      Description: settings.description || '',
      IsAnonymous: settings.isAnonymous,
      IsShowProgress: settings.showProgress,
      PollCreateDto: polls,
    }
  }

  // Комплексная валидация опроса
  const validateSurvey = (): string[] => {
    const errors: string[] = []

    // 1. Проверка названия опроса
    if (!settings.title.trim()) {
      errors.push('Заполните название опроса в разделе "Настройки"')
    }

    // 2. Проверка наличия вопросов
    if (questions.length === 0) {
      errors.push('Добавьте хотя бы один вопрос')
    }

    // 3. Проверка каждого вопроса
    questions.forEach((question, index) => {
      const questionNum = index + 1

      // Проверка текста вопроса
      if (!question.text.trim()) {
        errors.push(`Вопрос ${questionNum}: заполните текст вопроса`)
      }

      // Проверка вариантов ответа для single/multiple
      if (question.type === 'single' || question.type === 'multiple') {
        const validOptions = question.options.filter(opt => opt.trim() !== '')
        
        if (validOptions.length === 0 && !question.allowCustomAnswer) {
          errors.push(`Вопрос ${questionNum}: добавьте хотя бы один вариант ответа`)
        }

        // Проверка на пустые варианты (если есть непустые)
        const hasEmptyOptions = question.options.some((opt, i) => 
          opt.trim() === '' && i < question.options.length - 1
        )
        if (hasEmptyOptions && validOptions.length > 0) {
          errors.push(`Вопрос ${questionNum}: удалите или заполните пустые варианты ответов`)
        }
      }

      // Проверка для шкалы
      if (question.type === 'scale') {
        const scaleMin = parseInt(question.scaleStart)
        const scaleMax = parseInt(question.scaleEnd)
        
        if (isNaN(scaleMin) || isNaN(scaleMax)) {
          errors.push(`Вопрос ${questionNum}: некорректные значения шкалы`)
        } else if (scaleMin >= scaleMax) {
          errors.push(`Вопрос ${questionNum}: минимальное значение шкалы должно быть меньше максимального`)
        }
      }
    })

    return errors
  }

  const handleSave = () => {
    // Запускаем валидацию
    const errors = validateSurvey()
    setValidationErrors(errors)

    // Если есть ошибки - показываем и не сохраняем
    if (errors.length > 0) {
      return
    }

    // Всё ок - сохраняем
    const surveyData = mapToApiFormat()
    console.log('Отправляем на бэкенд:', surveyData)
    createSurvey.mutate(surveyData, {
      onSuccess: () => {
        setValidationErrors([])
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gray-200 p-6 rounded-3xl space-y-6">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            questionId={question.id}
            questionNumber={index + 1}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={addQuestion}
          variant="outline"
          className="rounded-xl px-8 h-12"
        >
          <Plus className="size-5 mr-2" />
          Добавить вопрос
        </Button>
      </div>

      <div className="flex flex-col items-center pt-4 space-y-3">
        <Button
          onClick={handleSave}
          disabled={createSurvey.isPending}
          className="bg-violet-600 hover:bg-violet-700 text-white px-8 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createSurvey.isPending ? 'Сохранение...' : 'Сохранить опрос'}
        </Button>
        
        {/* Список ошибок валидации */}
        {validationErrors.length > 0 && !createSurvey.isPending && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <p className="font-semibold text-red-800 mb-2">
              ⚠️ Исправьте ошибки перед сохранением:
            </p>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}