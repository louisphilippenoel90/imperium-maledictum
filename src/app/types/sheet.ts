export interface BasicInfo {
	origin: string;
	faction: string;
	role: string;
	patron: string;
	age: string;
	eyes: string;
	hair: string;
	height: string;
	weight: string;
	handedness: string;
	characterName: string;
	distinguishingFeatures: string;
	currentXp: string;
	spentXp: string;
	characteristicsRaw: string;
}

export interface FateCorruption {
	fateCurrent: string;
	fateTotal: string;
	corruptionCurrent: string;
	corruptionTotal: string;
	mutationsMalignancies: string;
}

export interface SkillData {
	skillName: string;
	characteristic: string;
	advances: string;
	total: string;
	specialisation: string;
}

export interface GoalsInfluence {
	goals: string;
	factionInfluence: string;
	contacts: string;
}

export interface CharacterSheetData {
	basic: BasicInfo;
	fateCorruption: FateCorruption;
	skillsData: SkillData[];
	goalsInfluence: GoalsInfluence;
}

export const SKILLS_LIST = [
	{ name: 'ATHLETICS', characteristic: 'STR' },
	{ name: 'AWARENESS', characteristic: 'PER' },
	{ name: 'DEXTERITY', characteristic: 'AG' },
	{ name: 'DISCIPLINE', characteristic: 'WIL' },
	{ name: 'FORTITUDE', characteristic: 'TGH' },
	{ name: 'INTUITION', characteristic: 'PER' },
	{ name: 'LINGUISTICS', characteristic: 'INT' },
	{ name: 'LOGIC', characteristic: 'INT' },
	{ name: 'LORE', characteristic: 'INT' },
	{ name: 'MEDICAE', characteristic: 'INT' },
	{ name: 'MELEE', characteristic: 'WS' },
	{ name: 'NAVIGATION', characteristic: 'INT' },
	{ name: 'PRESENCE', characteristic: 'WIL' },
	{ name: 'PILOTING', characteristic: 'AG' },
	{ name: 'PSYCHIC MASTERY', characteristic: 'WIL' },
	{ name: 'RANGED', characteristic: 'BS' },
	{ name: 'RAPPORT', characteristic: 'FEL' },
	{ name: 'REFLEXES', characteristic: 'AG' },
	{ name: 'STEALTH', characteristic: 'AG' },
	{ name: 'TECH', characteristic: 'INT' },
];

export const defaultBasicInfo: BasicInfo = {
	origin: '',
	faction: '',
	role: '',
	patron: '',
	age: '',
	eyes: '',
	hair: '',
	height: '',
	weight: '',
	handedness: '',
	characterName: '',
	distinguishingFeatures: '',
	currentXp: '0',
	spentXp: '0',
	characteristicsRaw: '',
};

export const defaultFateCorruption: FateCorruption = {
	fateCurrent: '',
	fateTotal: '',
	corruptionCurrent: '',
	corruptionTotal: '',
	mutationsMalignancies: '',
};

export const defaultGoalsInfluence: GoalsInfluence = {
	goals: '',
	factionInfluence: '',
	contacts: '',
};

export const defaultSkillsData: SkillData[] = SKILLS_LIST.map((skill) => ({
	skillName: skill.name,
	characteristic: skill.characteristic,
	advances: '',
	total: '',
	specialisation: '',
}));
