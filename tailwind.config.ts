import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
			},
			colors: {
				// 🔥 Phoenix Theme Colors
				'phoenix': {
					black: 'hsl(240 12% 4%)',
					purple: 'hsl(261 88% 57%)',
					royal: 'hsl(268 80% 18%)',
					glow: 'hsl(261 80% 57%)',
				},
				// System Colors
				border: 'hsl(var(--border))',
				input: {
					DEFAULT: 'hsl(var(--input))',
					border: 'hsl(var(--input-border))'
				},
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))',
					dark: 'hsl(var(--primary-dark))',
					glow: 'hsl(var(--primary-glow))'
				},
				neon: {
					purple: 'hsl(var(--neon-purple))'
				},
				gold: {
					DEFAULT: 'hsl(var(--gold))',
					foreground: 'hsl(var(--gold-foreground))',
					light: 'hsl(var(--gold-light))',
					dark: 'hsl(var(--gold-dark))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				'service-button': {
					DEFAULT: 'hsl(var(--service-button))',
					foreground: 'hsl(var(--service-button-foreground))',
					light: 'hsl(var(--service-button-light))',
					dark: 'hsl(var(--service-button-dark))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Legacy support
				'luxury-black': 'hsl(240 12% 4%)',
				'luxury-gold': 'hsl(var(--gold))',
				'luxury-purple': 'hsl(var(--primary))',
				'luxury-glow': 'hsl(var(--primary-glow))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'calc(var(--radius) + 4px)',
				'2xl': 'calc(var(--radius) + 8px)',
				'3xl': 'calc(var(--radius) + 16px)'
			},
			boxShadow: {
				'neon': '0 0 25px hsl(261 100% 60% / 0.35)',
				'neon-lg': '0 0 50px hsl(261 100% 60% / 0.45)',
				'glow': '0 6px 25px 0 hsl(261 100% 60% / 0.45)',
				'card': '0 12px 50px -12px hsl(261 100% 60% / 0.18)',
				'phoenix': '0 0 60px hsl(261 100% 60% / 0.25), 0 0 120px hsl(268 80% 50% / 0.1)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'slide': {
					'0%, 20%': { transform: 'translateX(0%)' },
					'25%, 45%': { transform: 'translateX(-100%)' },
					'50%, 70%': { transform: 'translateX(-200%)' },
					'75%, 95%': { transform: 'translateX(-300%)' },
					'100%': { transform: 'translateX(0%)' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(25px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(261 100% 60% / 0.3)' },
					'50%': { boxShadow: '0 0 40px hsl(261 100% 60% / 0.55)' }
				},
				'phoenix-flame': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'25%': { backgroundPosition: '100% 25%' },
					'50%': { backgroundPosition: '100% 75%' },
					'75%': { backgroundPosition: '0% 75%' }
				},
				'float': {
					'0%, 100%': { transform: 'translate(0, 0) scale(1)' },
					'33%': { transform: 'translate(25px, -25px) scale(1.05)' },
					'66%': { transform: 'translate(-15px, 15px) scale(0.95)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide': 'slide 15s infinite',
				'fade-up': 'fade-up 0.5s ease-out forwards',
				'fade-in': 'fade-in 0.4s ease-out forwards',
				'scale-in': 'scale-in 0.3s ease-out forwards',
				'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
				'phoenix-flame': 'phoenix-flame 20s ease infinite',
				'float': 'float 10s ease-in-out infinite',
				'shimmer': 'shimmer 2.5s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
