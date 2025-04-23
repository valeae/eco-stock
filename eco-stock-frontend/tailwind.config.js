/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: '#BEC6A0',
        accent: '#708871',
        heading: '#2F3645',
        muted: '#D9D9D9',
      },
      scrollBehavior: {
        smooth: "smooth",
      },
    },
  },
  plugins: [],
}
