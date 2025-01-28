/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lexend', 'system-ui', 'sans-serif'],
      },
      lineClamp: {
        2: '2',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'float-1': 'float1 20s ease-in-out infinite',
        'float-2': 'float2 25s ease-in-out infinite',
        'float-3': 'float3 30s ease-in-out infinite',
      },
      keyframes: {
        float1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(100px, 50px) scale(1.1) rotate(5deg)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.1)' },
          '50%': { transform: 'translate(-100px, 100px) scale(1) rotate(-5deg)' },
        },
        float3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(50px, -50px) scale(1.2) rotate(3deg)' },
        },
      },
    },
  },
};
