/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Additional colors for AI Todo Genius theme
        electric: {
          cyan: '#00F5D4',
          'cyan-light': '#6BFFB8',
          blue: '#00D4F5',
          green: '#00F5A7',
        },
        peach: {
          soft: '#FFB7B2',
        },
        navy: {
          dark: '#0a192f',
          light: '#112240',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // New animations for futuristic theme
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow-pulse": {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 245, 212, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 245, 212, 0.6)' },
        },
        "gradient-shift": {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        "shimmer": {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "shimmer": "shimmer 2s infinite",
      },
      // Custom gradients for buttons and backgrounds
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(90deg, #00F5D4, #6BFFB8)',
        'futuristic-gradient': 'linear-gradient(90deg, #00F5D4, #00D4F5, #00F5A7)',
        'navy-gradient': 'linear-gradient(to bottom right, #0a192f, #112240)',
      },
      // Custom box shadows for glow effects
      boxShadow: {
        'glow-primary': '0 0 15px rgba(0, 245, 212, 0.4)',
        'glow-secondary': '0 0 10px rgba(107, 255, 184, 0.3)',
        'glow-strong': '0 0 25px rgba(0, 245, 212, 0.5)',
      },
      // Custom transition properties
      transitionProperty: {
        'glow': 'box-shadow',
        'border-glow': 'border-color, box-shadow',
      },
    },
  },
  plugins: [],
}