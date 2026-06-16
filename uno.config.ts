import { defineConfig, presetMini } from 'unocss';

export default defineConfig({
  presets: [presetMini()],
  rules: [['list-disc', { 'list-style': 'disc inside' }]],
  theme: {
    colors: {
      'primary-fg': 'var(--color-primary-fg)',
      'primary-bg': 'var(--color-primary-bg)',
      'code-bg': 'var(--color-code-bg)',
      'neutral-1': 'var(--color-neutral-1)',
      'neutral-2': 'var(--color-neutral-2)',
      'neutral-3': 'var(--color-neutral-3)',
      'neutral-4': 'var(--color-neutral-4)',
      'neutral-5': 'var(--color-neutral-5)',
    },
  },
});
