/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'gradient-shift': 'gradient-shift 20s ease infinite',
        'gradient-pulse': 'gradient-pulse 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out infinite 2s',
        'float-delay-2': 'float 6s ease-in-out infinite 4s',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'slide-in-up': 'slideInUp 0.8s ease-out',
        'fade-in': 'fadeIn 1s ease-out',
        'fade-in-delay': 'fadeIn 1s ease-out 0.3s both',
        'loading-shimmer': 'loading-shimmer 1.5s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-shift': {
          '0%, 100%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          }
        },
        'gradient-pulse': {
          '0%, 100%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          }
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px)' 
          },
          '50%': { 
            transform: 'translateY(-20px)' 
          }
        },
        'pulse-glow': {
          'from': {
            'box-shadow': '0 0 20px rgba(102, 126, 234, 0.4)'
          },
          'to': {
            'box-shadow': '0 0 40px rgba(102, 126, 234, 0.8)'
          }
        },
        slideInLeft: {
          'from': {
            opacity: '0',
            transform: 'translateX(-100px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        slideInRight: {
          'from': {
            opacity: '0',
            transform: 'translateX(100px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        },
        slideInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(50px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeIn: {
          'from': {
            opacity: '0'
          },
          'to': {
            opacity: '1'
          }
        },
        'loading-shimmer': {
          '0%': {
            'background-position': '-200% 0'
          },
          '100%': {
            'background-position': '200% 0'
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(102, 126, 234, 0.4)',
        'glow-lg': '0 0 40px rgba(102, 126, 234, 0.6)',
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      }
    },
  },
  plugins: [],
}