import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ControlCleanupCallback, ILoaderArgs } from '@directum/sungero-remote-component-types'
import { queryClient } from '@/lib/query-client'
import { SurveyApp } from '@/controls/survey-app/survey-app'

export default (args: ILoaderArgs): Promise<ControlCleanupCallback> => {
  const root = createRoot(args.container)
  root.render(
    <QueryClientProvider client={queryClient}>
      <SurveyApp />
    </QueryClientProvider>
  )
  return Promise.resolve(() => root.unmount())
}