import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ControlCleanupCallback, ILoaderArgs } from '@directum/sungero-remote-component-types';
import { SurveyApp } from '../controls/survey-app/survey-app';  // ← Поменяли на SurveyApp

export default (args: ILoaderArgs): Promise<ControlCleanupCallback> => {
  const root = createRoot(args.container);
  root.render(<SurveyApp />);  // ← Рендерим SurveyApp
  return Promise.resolve(() => root.unmount());
};