/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'background': 'var(--background)',
        'surface': 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        'border-subtle': 'var(--border-subtle)',
        'primary': 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'secondary': 'var(--secondary)',
        'accent': 'var(--accent)',
      },
    },
  },
  plugins: [],
}
