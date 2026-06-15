import { defineConfig, presetMini } from 'unocss';

export default defineConfig({
  presets: [presetMini()],
  rules: [['list-disc', { 'list-style': 'disc inside' }]],
  theme: {
    colors: {
      prfg: '#302E81',
      prbg: '#DBE9FE',
      n1: '#000000',
      n2: '#1F2937',
      n3: '#9CA3AF',
      n4: '#E5E7EB',
      n5: '#FFFFFF',
      codebg: '#F3F3F3'
    },
  },
});
