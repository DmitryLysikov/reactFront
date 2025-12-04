// Точка входа для отладки контролов в режиме standalone
import api from './host-api-stub';
import context from './host-context-stub';
import loadApp from './src/loaders/question-card-loader';
import './index.css';

// Передаём объект вместо отдельных аргументов
loadApp({
  container: document.getElementById('app'),
  initialContext: context,
  api: api,
});