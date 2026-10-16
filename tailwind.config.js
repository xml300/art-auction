/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        catalog: '0.22em',
        subtle: '0.05em',
      },
      borderRadius: {
        gallery: '2px',
        card: '6px',
        input: '6px',
      },
      colors: {
        'text': 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'background': 'var(--background)',
        'surface': 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        'border-subtle': 'var(--border-subtle)',
        'border-strong': 'var(--border-strong)',
        'primary': 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'primary-foreground': 'var(--primary-foreground)',
        'secondary': 'var(--secondary)',
        'accent': 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'destructive': 'var(--destructive)',
        'destructive-hover': 'var(--destructive-hover)',
        'success': 'var(--success)',
        'warning': 'var(--warning)',
      },
      boxShadow: {
        gallery: '0 4px 24px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'gallery-elevated': '0 16px 40px -4px rgba(0, 0, 0, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
