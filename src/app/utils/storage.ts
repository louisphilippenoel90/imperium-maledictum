import { CharacterSheetData } from '@/app/types/sheet';

const STORAGE_KEY = 'IM_Maledictum_Sheet';

export const saveToLocalStorage = (data: CharacterSheetData): void => {
	if (typeof window !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}
};

export const loadFromLocalStorage = (): CharacterSheetData | null => {
	if (typeof window !== 'undefined') {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				return JSON.parse(saved);
			} catch (e) {
				console.error('Failed to parse saved data', e);
			}
		}
	}
	return null;
};

export const clearLocalStorage = (): void => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(STORAGE_KEY);
	}
};
