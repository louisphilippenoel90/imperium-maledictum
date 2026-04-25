import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Imperium Maledictum - Character Sheet',
	description: 'Warhammer 40k Imperium Maledictum Character Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
