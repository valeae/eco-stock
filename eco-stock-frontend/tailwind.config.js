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
        primary: {
          ecoLight: '#e3e4d3', // Color de fondo principal claro verdoso
          DEFAULT: '#6a8275', // Color verde principal (usado en botones y tarjetas)
          dark: '#4a635a', // Versión más oscura del verde principal
        },
        accent: {
          light: '#8a9a90', // Color acento claro para estados hover
          DEFAULT: '#708871', // Color acento para enlaces y botones secundarios
          dark: '#3e5247', // Color acento oscuro
        },
        heading: {
          light: '#4d5d54', // Color más claro para textos de encabezados
          DEFAULT: '#334139', // Color para encabezados principales
          dark: '#243029', // Color muy oscuro para enfatizar textos
        },
        muted: {
          light: '#f0f0e8', // Color muy claro para fondos sutiles
          DEFAULT: '#d0d1c2', // Color para bordes y separadores
          dark: '#a7a99e', // Color para textos secundarios
        },
        danger: {
          DEFAULT: '#c55a57', // Rojo usado en las tarjetas de salidas (el "0")
          light: '#e07573', // Versión más clara para estados hover
          dark: '#a24340', // Versión más oscura
        },
        success: {
          DEFAULT: '#5fa67c', // Verde para notificaciones de éxito
          light: '#7bbf95', // Versión más clara
          dark: '#488a63', // Versión más oscura
        },
        warning: {
          DEFAULT: '#e2c868', // Amarillo para advertencias
          light: '#edd78c', // Versión más clara
          dark: '#c9ac47', // Versión más oscura
        },
        info: {
          DEFAULT: '#6a96a8', // Azul para información
          light: '#8cb0be', // Versión más clara
          dark: '#4d7a8c', // Versión más oscura
        }
      },
      opacity: {
        '85': '0.85', // Para elementos semi-transparentes
        '95': '0.95', // Para elementos levemente transparentes
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    scrollBehavior: 'smooth',
  },
  plugins: [],
}
