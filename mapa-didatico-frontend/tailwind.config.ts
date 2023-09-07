

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'sans': ['Montserrat', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      colors: {
        'astronaut': {
          '50': '#f1f6fd',
          '100': '#dfecfa',
          '200': '#c6def7',
          '300': '#9fc9f1',
          '400': '#71abe9',
          '500': '#508ce1',
          '600': '#3b70d5',
          '700': '#325dc3',
          '800': '#2e4d9f',
          '900': '#2b4480',
          '950': '#1e2b4d',
      },
      }
    },

  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
export default config
