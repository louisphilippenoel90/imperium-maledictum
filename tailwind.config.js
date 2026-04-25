/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				parchment: '#fef7e6',
				'parchment-dark': '#faf0dc',
				leather: '#5c3f28',
				'leather-dark': '#3a2a1c',
				gold: '#cfb87c',
				'gold-dark': '#b58b4b',
			},
			fontFamily: {
				serif: ['Georgia', 'Times New Roman', 'serif'],
				mono: ['Courier New', 'Menlo', 'monospace'],
			},
		},
	},
	plugins: [],
};
