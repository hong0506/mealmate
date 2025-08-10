/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// import type { Config } from 'tailwindcss'

// const config: Config = {
//   content: [
//     './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// export default config
