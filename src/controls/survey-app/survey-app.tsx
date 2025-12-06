// src/controls/survey-app/survey-app.tsx
import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SurveyBuilder } from "@/controls/survey-builder/survey-builder"
import { SurveyResults } from "@/controls/survey-results/survey-results"
import { SurveySettings } from "@/controls/survey-settings/survey-settings"
import { SurveyPreview } from "@/controls/survey-preview/survey-preview"  // NEW

export function SurveyApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-3 px-6">Редактор опроса</h1>
      <Tabs defaultValue="questions" className="w-full">
        <div className="bg-white px-6">
          <TabsList>
            <TabsTrigger value="questions">Вопросы</TabsTrigger>
            <TabsTrigger value="preview">Предпросмотр</TabsTrigger>  {/* NEW */}
            <TabsTrigger value="answers">Ответы</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="questions" className="p-6">
          <SurveyBuilder />
        </TabsContent>

        <TabsContent value="preview" className="p-6">  {/* NEW */}
          <SurveyPreview />
        </TabsContent>

        <TabsContent value="answers" className="p-6">
          <SurveyResults />
        </TabsContent>

        <TabsContent value="settings" className="p-6">
          <SurveySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}