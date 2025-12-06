import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ControlCleanupCallback, ILoaderArgs } from '@directum/sungero-remote-component-types'
import { queryClient } from '@/lib/query-client'
import { SurveyRespondent } from '@/components/survey-respondent/survey-respondent'
import { PollDto } from '@/api/poll-api'

// Тестовые данные
const mockPoll: PollDto = {
  Id: 1,
  Subject: "Куда идём на корпоратив?",
  Description: "Выберите место для празднования",
  IsMultipleChoice: false,
  StatusVote: 'Active',
  MyVoteOptionId: null,
  Options: [
    { Id: 1, Text: "Ресторан", VotesCount: null },
    { Id: 2, Text: "Боулинг", VotesCount: null },
    { Id: 3, Text: "Караоке", VotesCount: null },
    { Id: 4, Text: "Пикник", VotesCount: null },
  ],
}

export default (args: ILoaderArgs): Promise<ControlCleanupCallback> => {
  const root = createRoot(args.container)
  
  root.render(
    <QueryClientProvider client={queryClient}>
      <SurveyRespondent
        poll={mockPoll}
        onVote={(optionId) => {
          console.log('Голос:', optionId)
          alert('Голос отправлен!')
        }}
      />
    </QueryClientProvider>
  )
  
  return Promise.resolve(() => root.unmount())
}