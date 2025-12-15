import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSurveyStore } from "@/store/survey-store"

export function SurveySettings() {
  const settings = useSurveyStore((state) => state.settings)
  const updateSettings = useSurveyStore((state) => state.updateSettings)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Настройки опроса
        </h2>

        {/* Название */}
        <div className="space-y-2">
          <Label htmlFor="title">Название опроса</Label>
          <Input
            id="title"
            value={settings.title}
            onChange={(e) => updateSettings({ title: e.target.value })}
            placeholder="Введите название опроса"
            className="h-12"
          />
        </div>

        {/* Описание */}
        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <textarea
            id="description"
            value={settings.description}
            onChange={(e) => updateSettings({ description: e.target.value })}
            placeholder="Описание опроса (необязательно)"
            className="w-full h-24 px-3 py-2 rounded-md border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Чекбоксы */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium text-gray-700">Дополнительно</h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.isAnonymous}
              onChange={(e) => updateSettings({ isAnonymous: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-600">Анонимные ответы</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showProgress}
              onChange={(e) => updateSettings({ showProgress: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-600">Показывать прогресс</span>
          </label>
        </div>

        {/* Решающий голос */}
        <div className="space-y-4 pt-4 border-t">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.hasDecisiveVote}
              onChange={(e) => updateSettings({ hasDecisiveVote: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="font-medium text-gray-700">Решающий голос</span>
          </label>

          {settings.hasDecisiveVote && (
            <div className="ml-7 space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="decisiveUser">Пользователь с решающим голосом</Label>
                <Input
                  id="decisiveUser"
                  value={settings.decisiveVoteUserName}
                  onChange={(e) => updateSettings({ 
                    decisiveVoteUserName: e.target.value,
                    // TODO: здесь нужен поиск пользователя и установка decisiveVoteUserId
                  })}
                  placeholder="Введите имя пользователя"
                  className="h-10"
                />
                <p className="text-xs text-gray-500">
                  Голос этого пользователя будет весить больше обычного
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="voteWeight">Вес голоса</Label>
                <Input
                  id="voteWeight"
                  type="number"
                  min={2}
                  max={100}
                  value={settings.decisiveVoteWeight}
                  onChange={(e) => updateSettings({ 
                    decisiveVoteWeight: parseInt(e.target.value) || 2 
                  })}
                  className="h-10 w-24"
                />
                <p className="text-xs text-gray-500">
                  Голос будет равен {settings.decisiveVoteWeight} обычным голосам
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-green-600">
          ✓ Настройки сохраняются автоматически
        </p>
      </div>
    </div>
  )
}