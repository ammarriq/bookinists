import defaultTheme from 'tailwindcss/defaultTheme'
import { addDynamicIconSelectors } from '@iconify/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['InterVariable', 'Inter', ...defaultTheme.fontFamily.sans],
      },
    },
    fontSize: {
      ...defaultTheme.fontSize,
      xxs: '0.6rem',
      sm: '0.8rem',
    },
  },
  plugins: [addDynamicIconSelectors()],
}
