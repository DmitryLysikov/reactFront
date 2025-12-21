import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ControlCleanupCallback, ILoaderArgs, IRemoteComponentContext } from '@directum/sungero-remote-component-types'
import { queryClient } from '@/lib/query-client'
import { SurveyRespondentContainer } from '@/controls/survey-respondent-container/survey-respondent-container'

// Расширяем стандартный контекст своими полями
interface ISurveyContext extends IRemoteComponentContext {
  surveyId?: number
  SurveyId?: number
}

export default (args: ILoaderArgs): Promise<ControlCleanupCallback> => {
  const root = createRoot(args.container)
  
  const context = args.initialContext as ISurveyContext
  const surveyId = context?.surveyId || context?.SurveyId
  const currentUserId = context?.userId
  
  root.render(
    <QueryClientProvider client={queryClient}>
      <SurveyRespondentContainer 
        surveyId={surveyId} 
        currentUserId={currentUserId ?? undefined}
      />
    </QueryClientProvider>
  )
  
  return Promise.resolve(() => root.unmount())
}