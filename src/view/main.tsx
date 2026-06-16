import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'virtual:uno.css';
import '@/assets/css/index.css';
import { OnlineEditorPanel, PrintButton, ThemeProvider } from '@/components';
import { ResumeConfigProvider } from '@/contexts/resumeConfigContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResumeConfigProvider>
      <ThemeProvider>
        <div className="resume-viewport resume-viewport--editor">
          <div className="w-full max-w-[1920px] mx-auto flex justify-end items-center gap-2 px-4 pt-4 print:hidden">
            <PrintButton />
          </div>
          <div className="w-full max-w-[1920px] mx-auto flex flex-col items-stretch">
            <OnlineEditorPanel
              preview={
                <article className="resume-page">
                  <div className="resume-body">
                    <App />
                  </div>
                </article>
              }
            />
          </div>
        </div>
      </ThemeProvider>
    </ResumeConfigProvider>
  </StrictMode>,
);
