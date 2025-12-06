// src/controls/survey-builder/survey-builder.tsx
import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/question-card/question-card"
import { useSurveyStore } from "@/store/survey-store"
import { useCreateSurvey } from "@/api"  // ← импорт хука

export function SurveyBuilder() {
  const settings = useSurveyStore((state) => state.settings)
  const questions = useSurveyStore((state) => state.questions)
  const addQuestion = useSurveyStore((state) => state.addQuestion)
  
  // React Query мутация для сохранения
  const createSurvey = useCreateSurvey()

  // Обработчик сохранения
  const handleSave = () => {
  createSurvey.mutate({
    title: settings.title || 'Без названия',
    description: settings.description,
    questions: questions.map(({ id, attachments, ...rest }) => rest),
  })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          questionId={question.id}
          questionNumber={index + 1}
        />
      ))}

      {/* Кнопка добавить вопрос */}
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

      {/* Кнопка сохранить */}
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