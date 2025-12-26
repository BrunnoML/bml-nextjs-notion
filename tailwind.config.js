/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Dark Blue - Background
        dark: {
          950: '#0a0d14',  // Background principal
          900: '#0f1419',  // Background escuro
          800: '#151c28',  // Cards
          700: '#1e2836',  // Superficies elevadas
          600: '#2a3a4d',  // Bordas
          500: '#3d5066',  // Texto muted
          400: '#5a7080',  // Texto secundario
        },
        // Cores de Destaque
        accent: {
          primary: '#3b82f6',     // Azul
          secondary: '#06b6d4',   // Ciano
          tertiary: '#8b5cf6',    // Roxo
          success: '#10b981',     // Verde
          warning: '#f59e0b',     // Ambar
          error: '#ef4444',       // Vermelho
        },
        // Cores Tech (Python/Dados/IA)
        tech: {
          python: '#3776ab',      // Python Blue
          data: '#00d4aa',        // Data Green
          ai: '#7c3aed',          // AI Purple
        },
        // Cores de Texto
        text: {
          primary: '#f8fafc',     // Branco
          secondary: '#94a3b8',   // Slate
          muted: '#64748b',       // Muted
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-tech': 'linear-gradient(135deg, #0f1419 0%, #1e2836 50%, #151c28 100%)',
        'gradient-accent': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
