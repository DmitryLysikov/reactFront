import React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/question-card/question-card"
import { useSurveyStore } from "@/store/survey-store"

export function SurveyBuilder() {
  const questions = useSurveyStore((state) => state.questions)
  const addQuestion = useSurveyStore((state) => state.addQuestion)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12"
          >
            <Plus className="size-5 mr-2" />
            Добавить вопрос
          </Button>
        </div>
      </div>
    </div>
  )
}