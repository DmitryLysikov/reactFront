// src/controls/survey-builder/survey-builder.tsx
import React from "react"
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
      SurveyName: settings.title || 'Без названия',
      Description: settings.description || '',
      IsAnonymous: settings.isAnonymous,
      IsMix: false,
      IsShowProgress: settings.showProgress,
      PollCreateDto: polls,
    }
  }

  const handleSave = () => {
    const surveyData = mapToApiFormat()
    console.log('Отправляем на бэкенд:', surveyData)
    createSurvey.mutate(surveyData)
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

      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSave}
          disabled={createSurvey.isPending}
          className="bg-violet-600 hover:bg-violet-700 text-white px-8 h-12"
        >
          {createSurvey.isPending ? 'Сохранение...' : 'Сохранить опрос'}
        </Button>
      </div>
    </div>
  )
}