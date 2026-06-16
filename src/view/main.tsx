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
          <div className="resume-shell w-full max-w-[1920px] mx-auto flex flex-col flex-1 min-h-0">
            <OnlineEditorPanel
              actions={<PrintButton />}
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
