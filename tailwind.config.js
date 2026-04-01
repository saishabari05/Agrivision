/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        moss: {
          DEFAULT: '#3d6b45',
          light: '#5a8f64',
          pale: '#e8f0e9',
        },
        olive: {
          DEFAULT: '#6b7c3a',
          pale: '#f0f2e4',
        },
        beige: '#f5f0e8',
        cream: '#faf8f4',
        warmwhite: '#fffef9',
        brown: {
          DEFAULT: '#7a5c3a',
          light: '#c4a882',
          pale: '#f5ede1',
        },
        text: {
          dark: '#1e2d1f',
          mid: '#4a5c4b',
          muted: '#8a9b8b',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 60px -30px rgba(61, 107, 69, 0.28)',
        glass: '0 24px 80px -36px rgba(42, 68, 45, 0.28)',
      },
      backgroundImage: {
        grain:
          'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27 viewBox=%270 0 160 160%27%3E%3Cg fill=%27%231e2d1f%27 fill-opacity=%270.035%27%3E%3Ccircle cx=%2712%27 cy=%2714%27 r=%271%27/%3E%3Ccircle cx=%2754%27 cy=%2744%27 r=%271%27/%3E%3Ccircle cx=%2796%27 cy=%2724%27 r=%271%27/%3E%3Ccircle cx=%27124%27 cy=%2778%27 r=%271%27/%3E%3Ccircle cx=%2736%27 cy=%2796%27 r=%271%27/%3E%3Ccircle cx=%2788%27 cy=%27130%27 r=%271%27/%3E%3Ccircle cx=%27144%27 cy=%27120%27 r=%271%27/%3E%3C/g%3E%3C/svg%3E")',
        heroGlow:
          'radial-gradient(circle at top right, rgba(90,143,100,0.2), transparent 32%), radial-gradient(circle at bottom left, rgba(196,168,130,0.18), transparent 30%)',
      },
    },
  },
  plugins: [],
};
