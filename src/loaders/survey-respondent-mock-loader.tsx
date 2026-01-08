import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ControlCleanupCallback, ILoaderArgs } from '@directum/sungero-remote-component-types'
import { queryClient } from '@/lib/query-client'
import { SurveyRespondent } from '@/components/survey-respondent/survey-respondent'
import { PollDto } from '@/api/poll-api'

// // MOCK данные для тестирования без бэкенда
const mockPoll: PollDto = {
  Id: 1,
  Subject: 'Удовлетворенность работой отдела',
  Description: 'Пожалуйста, оцените качество работы нашего отдела',
  IsMultipleChoice: false,
  StatusVote: 'Active',
  Options: [
    { Id: 1, Text: 'Очень доволен', VotesCount: 5 },
    { Id: 2, Text: 'Доволен', VotesCount: 12 },
    { Id: 3, Text: 'Нейтрально', VotesCount: 3 },
    { Id: 4, Text: 'Недоволен', VotesCount: 1 },
    { Id: 5, Text: 'Очень недоволен', VotesCount: 0 },
  ],
  MyVoteOptionId: 1, // null = еще не голосовал, можно изменить на любой Id из Options
  Author: 999, // ID автора (не совпадает с userId из контекста, поэтому будет обычный пользователь)
}

// Вариант 3: Множественный выбор
// const mockPoll: PollDto = {
//   Id: 2,
//   Subject: 'Какие технологии вы используете?',
//   Description: 'Выберите все подходящие варианты',
//   IsMultipleChoice: true,
//   StatusVote: 'Active',
//   Options: [
//     { Id: 10, Text: 'React', VotesCount: 15 },
//     { Id: 11, Text: 'Vue.js', VotesCount: 8 },
//     { Id: 12, Text: 'Angular', VotesCount: 5 },
//     { Id: 13, Text: 'Svelte', VotesCount: 3 },
//   ],
//   MyVoteOptionId: null,
//   MyVoteOptionIds: [11,12],
//   Author: 999,
// }

export default (args: ILoaderArgs): Promise<ControlCleanupCallback> => {
  const root = createRoot(args.container)
  
  // Mock функция голосования (просто логирует в консоль)
  const handleVote = (optionId: number | number[]) => {
    console.log('🗳️ Голосование (MOCK):', optionId)
    alert(`Голосование отправлено! ID варианта(ов): ${JSON.stringify(optionId)}\n\nДля просмотра результатов измените MyVoteOptionId в survey-respondent-mock-loader.tsx`)
  }
  
  root.render(
    <QueryClientProvider client={queryClient}>
      <SurveyRespondent 
        poll={mockPoll}
        onVote={handleVote}
        isVoting={false}
      />
    </QueryClientProvider>
  )
  
  return Promise.resolve(() => root.unmount())
}
