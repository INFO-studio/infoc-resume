import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import 'virtual:uno.css';
import '@/assets/css/index.css';
import { PrintButton, ThemeProvider } from '@/components';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <div className="resume-viewport">
        <div className="print-button">
          <PrintButton />
        </div>
        <article className="resume-page">
          <div className="resume-body">
            <App />
          </div>
        </article>
      </div>
    </ThemeProvider>
  </StrictMode>,
);
