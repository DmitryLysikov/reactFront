import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SurveyBuilder } from "@/controls/survey-builder/survey-builder"
import { SurveyResults } from "@/controls/survey-results/survey-results"
import { SurveySettings } from "@/controls/survey-settings/survey-settings"

export function SurveyApp() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Tabs defaultValue="builder" className="w-full">
        {/* Заголовок и вкладки */}
        <div className="bg-white border-b px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Редактор опроса
          </h1>
          <TabsList>
            <TabsTrigger value="builder">Создание опроса</TabsTrigger>
            <TabsTrigger value="results">Результаты</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>
        </div>

        {/* Контент вкладок */}
        <TabsContent value="builder" className="p-8">
          <SurveyBuilder />
        </TabsContent>

        <TabsContent value="results" className="p-8">
          <SurveyResults />
        </TabsContent>

        <TabsContent value="settings" className="p-8">
          <SurveySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}