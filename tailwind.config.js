/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
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
        'primary-foreground': 'var(--primary-foreground)',
        'secondary': 'var(--secondary)',
        'accent': 'var(--accent)',
        'destructive': 'var(--destructive)',
        'destructive-hover': 'var(--destructive-hover)',
        'success': 'var(--success)',
        'warning': 'var(--warning)',
      },
    },
  },
  plugins: [],
}
