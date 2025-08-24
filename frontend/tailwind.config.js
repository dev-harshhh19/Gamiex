/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'var(--destructive-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        // Neon Theme Colors
        'charcoal-base': 'var(--charcoal-base)',
        'charcoal-purple': 'var(--charcoal-purple)',
        'charcoal-card': 'var(--charcoal-card)',
        'charcoal-light': 'var(--charcoal-light)',
        'neon-blue': 'var(--neon-blue)',
        'neon-blue-glow': 'var(--neon-blue-glow)',
        'neon-blue-soft': 'var(--neon-blue-soft)',
        'neon-blue-border': 'var(--neon-blue-border)',
        'white-text': 'var(--white-text)',
        'gray-text': 'var(--gray-text)',
        'success-green': 'var(--success-green)',
        'warning-orange': 'var(--warning-orange)',
        'error-red': 'var(--error-red)',
        'subtle': 'rgba(255, 255, 255, 0.12)',
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: `calc(var(--radius) - 4px)`,
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 224, 255, 0.3), 0 0 40px rgba(0, 224, 255, 0.1)',
        'neon-lg': '0 0 30px rgba(0, 224, 255, 0.4), 0 0 60px rgba(0, 224, 255, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'grid-pulse': 'gridPulse 4s ease-in-out infinite',
        'float-gentle': 'floatGentle 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gridPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}