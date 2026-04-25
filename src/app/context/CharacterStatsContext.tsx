'use client';

import { createContext, useContext } from 'react';
import type { Characteristics } from '@/app/types/sheet';

type CharacterStatsContextValue = {
	characteristics: Characteristics;
};

const CharacterStatsContext = createContext<CharacterStatsContextValue | null>(null);

export function CharacterStatsProvider({
	characteristics,
	children,
}: {
	characteristics: Characteristics;
	children: React.ReactNode;
}) {
	return (
		<CharacterStatsContext.Provider value={{ characteristics }}>
			{children}
		</CharacterStatsContext.Provider>
	);
}

export function useCharacterStats() {
	const ctx = useContext(CharacterStatsContext);
	if (!ctx) {
		throw new Error('useCharacterStats must be used within CharacterStatsProvider');
	}
	return ctx;
}

