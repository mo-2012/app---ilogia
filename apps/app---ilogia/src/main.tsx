import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AuthProvider, createIlogiaClient } from '@ilogia/auth';
import { readEnv } from '@ilogia/configuration';
import { LocaleProvider, ToastProvider } from '@ilogia/ui';
import { App } from './App';
import { ar, en } from './i18n';
import './index.css';

const env = readEnv(import.meta.env as Record<string, string | undefined>);
const client = createIlogiaClient(env);
const redirectTo = typeof location !== 'undefined' ? location.origin + location.pathname : undefined;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider dicts={{ ar, en }}>
      <ToastProvider>
        <AuthProvider client={client} redirectTo={redirectTo}>
          <HashRouter>
            <App />
          </HashRouter>
        </AuthProvider>
      </ToastProvider>
    </LocaleProvider>
  </StrictMode>,
);
