
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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
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
				// Custom colors for our driver dashboard
				'blue': {
					50: '#f0f7ff',
					100: '#e0eefe',
					200: '#bbdbfd',
					300: '#8ac1fc',
					400: '#52a4fa',
					500: '#2e80f7',
					600: '#1b62ec',
					700: '#1a4fd8',
					800: '#1c43ae',
					900: '#1c3c8a',
					950: '#162656',
				},
				'gray': {
					50: '#f8f9fb',
					100: '#eef0f5',
					200: '#dbe0e8',
					300: '#bec7d4',
					400: '#9ba7ba',
					500: '#7f8ca3',
					600: '#67738b',
					700: '#556072',
					800: '#475061',
					900: '#3d4354',
					950: '#282c38',
				},
				'green': {
					50: '#f0fdf6',
					100: '#dbfce9',
					200: '#b8f5d5',
					300: '#84eab8',
					400: '#48d594',
					500: '#20b974',
					600: '#0f995e',
					700: '#107b4f',
					800: '#116141',
					900: '#115038',
					950: '#032d20',
				},
				'red': {
					50: '#fef3f5',
					100: '#fee5ea',
					200: '#fecfd9',
					300: '#fcaaba',
					400: '#f87993',
					500: '#f04f6e',
					600: '#e12f50',
					700: '#c91d3c',
					800: '#a41a34',
					900: '#881c32',
					950: '#4c0815',
				},
				'yellow': {
					50: '#fffbea',
					100: '#fff4c6',
					200: '#ffea89',
					300: '#ffda4f',
					400: '#ffc823',
					500: '#ffb208',
					600: '#f98c00',
					700: '#cd6800',
					800: '#a74f07',
					900: '#89420c',
					950: '#4b2103',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			fontFamily: {
				'sans': ['Inter', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
