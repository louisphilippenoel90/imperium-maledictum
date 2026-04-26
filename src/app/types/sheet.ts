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
}

export interface Characteristic {
	starting: string;
	advances: string;
	current: string;
}

export interface Characteristics {
	ws: Characteristic; // Weapon Skill
	bs: Characteristic; // Ballistic Skill
	str: Characteristic; // Strength
	tgh: Characteristic; // Toughness
	ag: Characteristic; // Agility
	int: Characteristic; // Intelligence
	per: Characteristic; // Perception
	wil: Characteristic; // Willpower
	fel: Characteristic; // Fellowship
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
	manualInput: string; // New: user's manual input value
	advances: string; // Each point adds +5
	total: string; // Calculated: manualInput + (advances × 5)
	specialisation: string;
}

export interface SpecialisationData {
	id: string;
	specialisation: string;
	skill: string;
	adv: string;
	total: string;
}

export interface InfluenceRow {
	id: string;
	faction: string;
	influence: string;
	contacts: string;
}

export interface TalentRow {
	id: string;
	name: string;
	effects: string;
}

export interface GoalsInfluence {
	goals: string;
	connections: string;
	notes: string;
	divination: string;
	solars: string;
	otherCurrencies: string;
	influences: InfluenceRow[];
	talents: TalentRow[];
}

export interface CriticalWoundRow {
	id: string;
	location: string;
	effect: string;
}

export interface WoundsData {
	current: string;
	critical: CriticalWoundRow[];
}

export interface WeaponRow {
	id: string;
	name: string;
	specialisationId: string; // references Skills specialisation id
	test: string;
	damage: string;
	range: string;
	mag: string;
	enc: string;
	traits: string;
}

export interface WeaponsData {
	weapons: WeaponRow[];
}

export type HitLocationKey = 'head' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg' | 'body';

export interface ArmourRow {
	id: string;
	name: string;
	locations: HitLocationKey[];
	armourValue: string;
	enc: string;
	traits: string;
}

export interface ArmourHitLocations {
	head: string;
	leftArm: string;
	rightArm: string;
	leftLeg: string;
	rightLeg: string;
	body: string;
}

export interface ArmourData {
	armours: ArmourRow[];
	hitLocations: ArmourHitLocations;
}

export interface EquipmentRow {
	id: string;
	equipment: string;
	combatNotes: string;
}

export interface EquipmentData {
	items: EquipmentRow[];
	encumbranceCurrent: string;
}

export interface PsychicPowerRow {
	id: string;
	name: string;
	wrp: string;
	diff: string;
	rang: string;
	targ: string;
	dur: string;
	effect: string;
}

export interface PsychicPowersData {
	powers: PsychicPowerRow[];
	warpChargeCurrent: string;
	sanctioned: boolean;
}

export interface PatronInfo {
	patronName: string;
	faction: string;
	duty: string;
	payGrade: string;
	motivation: string;
	demeanour: string;
}

export interface PatronBoonRow {
	id: string;
	name: string;
	liabilities: string;
}

export interface PatronInfluenceRow {
	id: string;
	faction: string;
	infl: string;
	contact: string;
	intel: string;
}

export interface PatronPageData {
	info: PatronInfo;
	boons: PatronBoonRow[];
	influences: PatronInfluenceRow[];
	notes: string;
}

export interface CharacterSheetData {
	basic: BasicInfo;
	characteristics: Characteristics;
	fateCorruption: FateCorruption;
	skillsData: SkillData[];
	specialisations: SpecialisationData[];
	goalsInfluence: GoalsInfluence;
	wounds: WoundsData;
	weapons: WeaponsData;
	armour: ArmourData;
	equipment: EquipmentData;
	psychicPowers: PsychicPowersData;
	patronPage: PatronPageData;
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
};

export const defaultCharacteristics: Characteristics = {
	ws: { starting: '', advances: '', current: '0' },
	bs: { starting: '', advances: '', current: '0' },
	str: { starting: '', advances: '', current: '0' },
	tgh: { starting: '', advances: '', current: '0' },
	ag: { starting: '', advances: '', current: '0' },
	int: { starting: '', advances: '', current: '0' },
	per: { starting: '', advances: '', current: '0' },
	wil: { starting: '', advances: '', current: '0' },
	fel: { starting: '', advances: '', current: '0' },
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
	connections: '',
	notes: '',
	divination: '',
	solars: '',
	otherCurrencies: '',
	influences: [],
	talents: [],
};

export const defaultWoundsData: WoundsData = {
	current: '',
	critical: [],
};

export const defaultWeaponsData: WeaponsData = {
	weapons: [],
};

export const defaultArmourData: ArmourData = {
	armours: [],
	hitLocations: {
		head: '',
		leftArm: '',
		rightArm: '',
		leftLeg: '',
		rightLeg: '',
		body: '',
	},
};

export const defaultEquipmentData: EquipmentData = {
	items: [],
	encumbranceCurrent: '',
};

export const defaultPsychicPowersData: PsychicPowersData = {
	powers: [],
	warpChargeCurrent: '',
	sanctioned: false,
};

export const defaultPatronPageData: PatronPageData = {
	info: {
		patronName: '',
		faction: '',
		duty: '',
		payGrade: '',
		motivation: '',
		demeanour: '',
	},
	boons: [],
	influences: [],
	notes: '',
};

export const defaultSkillsData: SkillData[] = SKILLS_LIST.map((skill) => ({
	skillName: skill.name,
	characteristic: skill.characteristic,
	manualInput: '',
	advances: '',
	total: '',
	specialisation: '',
}));

export const defaultSpecialisationsData: SpecialisationData[] = [];
