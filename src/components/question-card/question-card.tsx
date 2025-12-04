import React, { useRef } from "react"
import { X, Plus, Paperclip, FileText, Image, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSurveyStore } from "@/store/survey-store"

type QuestionType = 'single' | 'multiple' | 'short' | 'long' | 'scale'

interface QuestionCardProps {
  questionId: string
  questionNumber: number
}

// Форматирование размера файла
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Иконка по типу файла
function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) return <Image className="size-4" />
  if (type.includes('pdf') || type.includes('document')) return <FileText className="size-4" />
  return <File className="size-4" />
}

export function QuestionCard({ questionId, questionNumber }: QuestionCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const question = useSurveyStore((state) => 
    state.questions.find((q) => q.id === questionId)
  )
  const updateQuestion = useSurveyStore((state) => state.updateQuestion)
  const removeQuestion = useSurveyStore((state) => state.removeQuestion)
  const addOption = useSurveyStore((state) => state.addOption)
  const removeOption = useSurveyStore((state) => state.removeOption)
  const updateOption = useSurveyStore((state) => state.updateOption)
  const addAttachment = useSurveyStore((state) => state.addAttachment)
  const removeAttachment = useSurveyStore((state) => state.removeAttachment)

  if (!question) return null

  const isChoiceType = question.type === "single" || question.type === "multiple"
  const isTextType = question.type === "short" || question.type === "long"
  const isScaleType = question.type === "scale"

  // Обработка выбора файлов
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      // Исключаем видео файлы
      if (file.type.startsWith('video/')) {
        alert('Видео файлы не поддерживаются')
        return
      }
      addAttachment(questionId, file)
    })

    // Сбрасываем input чтобы можно было выбрать тот же файл снова
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="relative bg-orange-500 rounded-3xl p-6 w-full max-w-2xl">
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeQuestion(questionId)}
        className="absolute top-4 right-4 bg-black text-amber-400 hover:bg-black/80 rounded-md"
      >
        <X className="size-5" />
      </Button>

      {/* Question section */}
      <div className="mb-5">
        <Label className="text-white text-xl font-semibold mb-2">
          Вопрос {questionNumber}
        </Label>
        <div className="flex gap-4 mt-2">
          <Input
            value={question.text}
            onChange={(e) => updateQuestion(questionId, { text: e.target.value })}
            placeholder="Введите вопрос"
            className="flex-1 bg-amber-600/60 border-none text-white placeholder:text-white/70 h-12"
          />
          
          {/* Скрытый input для файлов */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-black hover:bg-gray-100 rounded-xl px-6 h-12"
          >
            <Paperclip className="size-4 mr-2" />
            Вложить файл
          </Button>
        </div>

        {/* Список вложенных файлов */}
        {question.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {question.attachments.map((attachment) => (
              <div 
                key={attachment.id}
                className="flex items-center gap-2 bg-amber-600/40 rounded-lg px-3 py-2"
              >
                <FileIcon type={attachment.type} />
                <span className="flex-1 text-white text-sm truncate">
                  {attachment.name}
                </span>
                <span className="text-white/60 text-xs">
                  {formatFileSize(attachment.size)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAttachment(questionId, attachment.id)}
                  className="size-6 text-white/70 hover:text-white hover:bg-amber-900/50"
                >
                  <X className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Question type selector */}
      <div className="mb-5">
        <Select 
          value={question.type} 
          onValueChange={(v) => updateQuestion(questionId, { type: v as QuestionType })}
        >
          <SelectTrigger className="w-64 bg-amber-600/60 border-none text-white h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Один из списка</SelectItem>
            <SelectItem value="multiple">Несколько из списка</SelectItem>
            <SelectItem value="short">Краткий ответ</SelectItem>
            <SelectItem value="long">Развёрнутый ответ</SelectItem>
            <SelectItem value="scale">Шкала</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ===== Остальной код без изменений ===== */}
      
      {/* Тип: Один из списка / Несколько из списка */}
      {isChoiceType && (
        <div>
          <Label className="text-white text-xl font-semibold mb-3">
            Варианты ответа
          </Label>

          <div className="space-y-3 mt-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex gap-3 items-center">
                <Input
                  value={option}
                  onChange={(e) => updateOption(questionId, index, e.target.value)}
                  placeholder="Введите вариант ответа"
                  className="flex-1 bg-amber-600/60 border-none text-white placeholder:text-white/70 h-12"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(questionId, index)}
                  className="bg-amber-900/50 text-amber-300 hover:bg-amber-900/70 rounded-md shrink-0"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => addOption(questionId)}
              className="bg-amber-900/50 text-amber-300 hover:bg-amber-900/70 rounded-md"
            >
              <Plus className="size-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Тип: Краткий ответ / Развёрнутый ответ */}
      {isTextType && (
        <div>
          <Label className="text-white text-xl font-semibold mb-3">
            Ответ
          </Label>
          <Input
            disabled
            placeholder={question.type === "short" ? "Краткий ответ" : "Развёрнутый ответ"}
            className="bg-amber-600/60 border-none text-white placeholder:text-white/50 h-12"
          />
          <p className="text-white/60 text-sm mt-2">
            Пользователь введёт {question.type === "short" ? "краткий" : "развёрнутый"} ответ
          </p>
        </div>
      )}

      {/* Тип: Шкала */}
      {isScaleType && (
        <div>
          <Label className="text-white text-xl font-semibold mb-3">
            Настройки шкалы
          </Label>

          <div className="flex items-center gap-4 mb-4">
            <Select 
              value={question.scaleStart} 
              onValueChange={(v) => updateQuestion(questionId, { scaleStart: v })}
            >
              <SelectTrigger className="w-24 bg-amber-600/60 border-none text-white h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-white text-lg">до</span>

            <Select 
              value={question.scaleEnd} 
              onValueChange={(v) => updateQuestion(questionId, { scaleEnd: v })}
            >
              <SelectTrigger className="w-24 bg-amber-600/60 border-none text-white h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-white/80 text-sm mb-1">Подпись ({question.scaleStart})</Label>
              <Input
                value={question.scaleLabelStart}
                onChange={(e) => updateQuestion(questionId, { scaleLabelStart: e.target.value })}
                placeholder="Например: Плохо"
                className="bg-amber-600/60 border-none text-white placeholder:text-white/50 h-12"
              />
            </div>
            <div className="flex-1">
              <Label className="text-white/80 text-sm mb-1">Подпись ({question.scaleEnd})</Label>
              <Input
                value={question.scaleLabelEnd}
                onChange={(e) => updateQuestion(questionId, { scaleLabelEnd: e.target.value })}
                placeholder="Например: Отлично"
                className="bg-amber-600/60 border-none text-white placeholder:text-white/50 h-12"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}