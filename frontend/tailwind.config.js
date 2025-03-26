/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          // Base backgrounds
          bg: {
            primary: '#0F0F0F',
            secondary: '#1A1A1A',
            tertiary: '#222222',
          },
          // Text colors
          text: {
            primary: '#CFCFCF',
            secondary: '#FFFFFF',
          },
          // Brand colors
          brand: {
            primary: '#E67E22',
            hover: '#d35400',
          },
          // Status colors
          status: {
            success: '#3BB273',
            error: '#FF4C4C',
            warning: '#E6A700',
            info: '#5DADE2',
          },
          // Border colors
          border: {
            primary: '#222222',
            highlight: '#E67E22',
          },
        },
      },
      // Custom transition durations
      transitionDuration: {
        DEFAULT: '200ms',
      },
      // Custom transition properties
      transitionProperty: {
        'colors': 'color, background-color, border-color',
      },
    },
  },
  plugins: [],
}

