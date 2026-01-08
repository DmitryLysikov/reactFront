import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { PollDto } from "@/api/poll-api"

interface SurveyRespondentProps {
  poll: PollDto & {
    attachments?: Array<{
      id: string
      name: string
      url: string
      type: string
    }>
  }
  onVote: (optionId: number | number[]) => void
  isVoting?: boolean
}

export function SurveyRespondent({ poll, onVote, isVoting }: SurveyRespondentProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])

  // Для множественного выбора используем MyVoteOptionIds, для одиночного - MyVoteOptionId
  const hasVoted = poll.IsMultipleChoice 
    ? (poll.MyVoteOptionIds && poll.MyVoteOptionIds.length > 0)
    : poll.MyVoteOptionId !== null
  const totalVotes = poll.Options.reduce((sum, opt) => sum + (opt.VotesCount || 0), 0)

  const handleSubmit = () => {
    if (poll.IsMultipleChoice) {
      if (selectedOptions.length > 0) {
        onVote(selectedOptions)
      }
    } else {
      if (selectedOption !== null) {
        onVote(selectedOption)
      }
    }
  }

  const handleMultipleChange = (optionId: number, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId])
    } else {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId))
    }
  }

  const canSubmit = poll.IsMultipleChoice 
    ? selectedOptions.length > 0 
    : selectedOption !== null

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Заголовок + кнопка */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {poll.Subject}
            </h1>
            {poll.Description && (
              <p className="text-gray-600 mt-1">{poll.Description}</p>
            )}
          </div>
          
          {!hasVoted && (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isVoting}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 h-10 rounded-xl shrink-0"
            >
              {isVoting ? 'Отправка...' : 'Отправить'}
            </Button>
          )}
        </div>

        {/* Карточка опроса */}
        <div className="bg-orange-500 rounded-3xl p-6">
          
          {/* Вложения с превью (если есть) */}
          {poll.attachments && poll.attachments.length > 0 && (
            <div className="mb-4 space-y-2">
              {poll.attachments.map((attachment) => {
                const isImage = attachment.type?.startsWith('image/')

                return (
                  <div key={attachment.id} className="bg-white/20 rounded-lg p-2">
                    {isImage ? (
                      <div>
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="w-full max-h-48 object-contain rounded-lg cursor-pointer hover:opacity-90 transition"
                          onClick={() => window.open(attachment.url, '_blank')}
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
                          href={attachment.url}
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

          {/* Если НЕ голосовал — форма */}
          {!hasVoted && (
            <div className="space-y-2">
              {poll.Options.map((option) => {
                const isSelected = poll.IsMultipleChoice
                  ? selectedOptions.includes(option.Id)
                  : selectedOption === option.Id

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
                    {poll.IsMultipleChoice ? (
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

                    <span className="text-gray-700">{option.Text}</span>

                    <input
                      type={poll.IsMultipleChoice ? "checkbox" : "radio"}
                      name="poll-option"
                      checked={isSelected}
                      onChange={(e) => {
                        if (poll.IsMultipleChoice) {
                          handleMultipleChange(option.Id, e.target.checked)
                        } else {
                          setSelectedOption(option.Id)
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )
              })}
            </div>
          )}

          {/* Если УЖЕ голосовал — результаты */}
          {hasVoted && (
            <div className="space-y-2">
              {poll.Options.map((option) => {
                const percent = totalVotes > 0
                  ? Math.round(((option.VotesCount || 0) / totalVotes) * 100)
                  : 0
                // Для множественного выбора проверяем массив, для одиночного - одно значение
                const isMyVote = poll.IsMultipleChoice
                  ? poll.MyVoteOptionIds?.includes(option.Id)
                  : option.Id === poll.MyVoteOptionId

                return (
                  <div key={option.Id} className="relative overflow-hidden rounded-xl bg-white">
                    {/* Прогресс-бар (фон) */}
                    <div
                      className={`absolute inset-0 transition-all ${isMyVote ? 'bg-orange-200' : 'bg-gray-100'}`}
                      style={{ width: `${percent}%` }}
                    />
                    
                    {/* Контент */}
                    <div className="relative flex justify-between items-center px-4 py-3">
                      <span className={`text-gray-700 ${isMyVote ? 'font-semibold' : ''}`}>
                        {option.Text}
                        {isMyVote && <span className="ml-2 text-orange-600">✓</span>}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {option.VotesCount || 0} ({percent}%)
                      </span>
                    </div>
                  </div>
                )
              })}

              <p className="text-white/80 text-sm text-center pt-2">
                Всего голосов: {totalVotes}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}