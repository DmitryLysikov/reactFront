import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function SurveySettings() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Настройки опроса
        </h2>

        {/* Название опроса */}
        <div className="space-y-2">
          <Label htmlFor="title">Название опроса</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название опроса"
            className="h-12"
          />
        </div>

        {/* Описание */}
        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание опроса (необязательно)"
            className="w-full h-24 px-3 py-2 rounded-md border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Дополнительные настройки */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium text-gray-700">Дополнительно</h3>
          
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-600">Анонимные ответы</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-600">Перемешивать вопросы</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-600">Показывать прогресс</span>
          </label>
        </div>

        {/* Кнопка сохранить */}
        <div className="pt-4">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12">
            Сохранить настройки
          </Button>
        </div>
      </div>
    </div>
  )
}