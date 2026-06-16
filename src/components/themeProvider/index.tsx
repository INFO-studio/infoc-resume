import { type FC, type PropsWithChildren, useLayoutEffect } from 'react';
import { useResumeConfig } from '@/contexts/resumeConfigContext';

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { config } = useResumeConfig();
  const colors = config.theme.colors;

  useLayoutEffect(() => {
    Object.entries(colors).forEach(([name, value]) => {
      document.body.style.setProperty(`--color-${name}`, value);
    });
  }, [colors]);

  return children;
};

export default ThemeProvider;
