import React from "react"
import { FileText } from "lucide-react"
import { PollOptionDto } from "@/api/poll-api"

interface QuestionResponseCardProps {
  questionText: string
  questionNumber: number
  options: PollOptionDto[]
  isMultiple: boolean
  selectedValue: number | number[] | null
  onChange: (value: number | number[]) => void
  attachmentUrl?: string
  attachmentName?: string
}

export function QuestionResponseCard({
  questionText,
  questionNumber,
  options,
  isMultiple,
  selectedValue,
  onChange,
  attachmentUrl,
  attachmentName,
}: QuestionResponseCardProps) {
  
  const handleSingleChange = (optionId: number) => {
    onChange(optionId)
  }

  const handleMultipleChange = (optionId: number, checked: boolean) => {
    const current = (selectedValue as number[]) || []
    if (checked) {
      onChange([...current, optionId])
    } else {
      onChange(current.filter(id => id !== optionId))
    }
  }

  const isOptionSelected = (optionId: number) => {
    if (isMultiple) {
      return ((selectedValue as number[]) || []).includes(optionId)
    }
    return selectedValue === optionId
  }

  return (
    <div className="bg-orange-500 rounded-3xl p-6">
      
      {/* Вложение */}
      {attachmentUrl && (
        <div className="mb-4">
          <p className="text-white/80 text-sm mb-2">Вложение</p>
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
          >
            <FileText className="size-5 text-gray-500" />
            <span>{attachmentName || 'Документ'}</span>
          </a>
        </div>
      )}

      {/* Текст вопроса */}
      {questionText && (
        <h3 className="text-white text-lg font-medium mb-4">
          {questionNumber}. {questionText}
        </h3>
      )}

      {/* Варианты ответа */}
      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = isOptionSelected(option.Id)

          return (
            <label
              key={option.Id}
              className={`
                flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer
                transition border-2
                ${isSelected ? 'border-orange-700' : 'border-transparent'}
              `}
            >
              {/* Checkbox или Radio */}
              {isMultiple ? (
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center shrink-0
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
                  w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                  ${isSelected ? 'border-orange-600' : 'border-gray-300'}
                `}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                  )}
                </div>
              )}

              <span className="text-gray-700">{option.Text}</span>

              <input
                type={isMultiple ? "checkbox" : "radio"}
                name={`question-${questionNumber}`}
                checked={isSelected}
                onChange={(e) => {
                  if (isMultiple) {
                    handleMultipleChange(option.Id, e.target.checked)
                  } else {
                    handleSingleChange(option.Id)
                  }
                }}
                className="hidden"
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}