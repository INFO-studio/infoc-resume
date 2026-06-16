import type { FC, PropsWithChildren } from 'react';
import config from '@/config';

const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const colors = config.theme.colors;
  Object.entries(colors).forEach(([name, value]) => {
    document.body.style.setProperty(`--color-${name}`, value);
  });

  return children;
};

export default ThemeProvider;
