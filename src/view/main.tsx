import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'virtual:uno.css';
import '@/assets/css/index.css';
import { OnlineEditorButton, PrintButton, ThemeProvider } from '@/components';
import { ResumeConfigProvider } from '@/contexts/resumeConfigContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResumeConfigProvider>
      <ThemeProvider>
        <div className="resume-viewport">
          <div className="print-button flex gap-2 items-center">
            <PrintButton />
            <OnlineEditorButton />
          </div>
          <article className="resume-page">
            <div className="resume-body">
              <App />
            </div>
          </article>
        </div>
      </ThemeProvider>
    </ResumeConfigProvider>
  </StrictMode>,
);
