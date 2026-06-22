'use client';

import { useState, useEffect, useCallback } from 'react';
import {
	CharacterSheetData,
	BasicInfo,
	Characteristics,
	FateCorruption,
	GoalsInfluence,
	SkillData,
	Characteristic,
	WoundsData,
	WeaponsData,
	ArmourData,
	EquipmentData,
	PsychicPowersData,
	PatronPageData,
	defaultBasicInfo,
	defaultCharacteristics,
	defaultFateCorruption,
	defaultGoalsInfluence,
	defaultSkillsData,
	defaultWoundsData,
	defaultWeaponsData,
	defaultArmourData,
	defaultEquipmentData,
	defaultPsychicPowersData,
	defaultPatronPageData,
	SKILLS_LIST,
} from '@/app/types/sheet';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '@/app/utils/storage';
import BasicInfoSection from './page1/BasicInfo';
import FateCorruptionSection from './page1/FateCorruption';
import SkillsSection from './page1/SkillsSection';
import GoalsInfluenceSection from './page1/GoalsInfluence';
import { SpecialisationData } from './page1/SkillsSection';

import WoundsSection from './page2/WoundsSection';
import WeaponsSection from './page2/WeaponsSection';
import ArmourSection from './page2/ArmourSection';
import EquipmentSection from './page2/EquipmentSection';
import PsychicPowersSection from './page2/PsychicPowersSection';

import InfosSection from './page3/InfosSection';
import BoonsSection from './page3/BoonsSection';
import InfluenceSection from './page3/InfluenceSection';
import NotesSection from './page3/NotesSection';

import CollapseSection from './CollapseSection';
import ActionButtons from './ActionButtons';
import DiceModal from './DiceModal';

import { CharacterStatsProvider } from '@/app/context/CharacterStatsContext';
import { ExportJsonProvider, useExportJson } from '@/app/context/ExportJsonContext';

const defaultSpecialisationsData: SpecialisationData[] = [];

function CharacterSheetInner() {
	const [page, setPage] = useState<1 | 2 | 3>(1);
	const [diceOpen, setDiceOpen] = useState(false);
	const [basic, setBasic] = useState<BasicInfo>(defaultBasicInfo);
	const [characteristics, setCharacteristics] = useState<Characteristics>(defaultCharacteristics);
	const [fateCorruption, setFateCorruption] = useState<FateCorruption>(defaultFateCorruption);
	const [skills, setSkills] = useState<SkillData[]>(defaultSkillsData);
	const [goalsInfluence, setGoalsInfluence] = useState<GoalsInfluence>(defaultGoalsInfluence);
	const [wounds, setWounds] = useState<WoundsData>(defaultWoundsData);
	const [weapons, setWeapons] = useState<WeaponsData>(defaultWeaponsData);
	const [armour, setArmour] = useState<ArmourData>(defaultArmourData);
	const [equipment, setEquipment] = useState<EquipmentData>(defaultEquipmentData);
	const [psychicPowers, setPsychicPowers] = useState<PsychicPowersData>(defaultPsychicPowersData);
	const [patronPage, setPatronPage] = useState<PatronPageData>(defaultPatronPageData);
	const [status, setStatus] = useState('✅ Ready — fill fields, export/import JSON.');
	const [specialisations, setSpecialisations] = useState<SpecialisationData[]>(
		defaultSpecialisationsData,
	);

	// Load from localStorage on mount
	useEffect(() => {
		const saved = loadFromLocalStorage();
		if (saved) {
			setBasic(saved.basic || defaultBasicInfo);
			// Ensure all characteristic keys are present by merging with defaults
			setCharacteristics({
				...defaultCharacteristics,
				...(saved.characteristics || {}),
			});
			setFateCorruption(saved.fateCorruption || defaultFateCorruption);
			setSkills(saved.skillsData || defaultSkillsData);
			setGoalsInfluence(saved.goalsInfluence || defaultGoalsInfluence);
			setWounds(saved.wounds || defaultWoundsData);
			setWeapons(saved.weapons || defaultWeaponsData);
			setArmour(saved.armour || defaultArmourData);
			setEquipment(saved.equipment || defaultEquipmentData);
			setPsychicPowers(saved.psychicPowers || defaultPsychicPowersData);
			setPatronPage(saved.patronPage || defaultPatronPageData);
			setSpecialisations(saved.specialisations || defaultSpecialisationsData);
			setStatus('📀 Loaded previous session from browser storage.');
			setTimeout(() => setStatus('✅ Ready — fill fields, export/import JSON.'), 3000);
		}
	}, []);

	// Auto-save to localStorage
	const autoSave = useCallback(() => {
		const fullData: CharacterSheetData = {
			basic,
			characteristics,
			fateCorruption,
			skillsData: skills,
			goalsInfluence,
			wounds,
			weapons,
			armour,
			equipment,
			psychicPowers,
			patronPage,
			specialisations,
		};
		saveToLocalStorage(fullData);
	}, [
		basic,
		characteristics,
		fateCorruption,
		skills,
		goalsInfluence,
		wounds,
		weapons,
		armour,
		equipment,
		psychicPowers,
		patronPage,
		specialisations,
	]);

	useEffect(() => {
		autoSave();
	}, [
		basic,
		characteristics,
		fateCorruption,
		skills,
		goalsInfluence,
		wounds,
		weapons,
		armour,
		equipment,
		psychicPowers,
		patronPage,
		specialisations,
		autoSave,
	]);

	const handleBasicChange = (field: keyof BasicInfo, value: string) => {
		setBasic((prev) => ({ ...prev, [field]: value }));
	};

	const handleCharacteristicChange = (
		charKey: keyof Characteristics,
		field: keyof Characteristic,
		value: string,
	) => {
		setCharacteristics((prev) => ({
			...prev,
			[charKey]: { ...prev[charKey], [field]: value },
		}));
	};

	const handleFateCorruptionChange = (field: keyof FateCorruption, value: string) => {
		setFateCorruption((prev) => ({ ...prev, [field]: value }));
	};

	const handleGoalsInfluenceReplace = (next: GoalsInfluence) => {
		setGoalsInfluence(next);
	};

	const handleSkillChange = (index: number, field: keyof SkillData, value: string) => {
		setSkills((prev) =>
			prev.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill)),
		);
	};

	const { dispatchExport } = useExportJson();

	const exportToJSON = () => {
		const fullData: CharacterSheetData = {
			basic,
			characteristics,
			fateCorruption,
			skillsData: skills,
			goalsInfluence,
			wounds,
			weapons,
			armour,
			equipment,
			psychicPowers,
			patronPage,
			specialisations,
		};
		const exportObj = {
			version: 'IM_Maledictum_1.0',
			exportedAt: new Date().toISOString(),
			...fullData,
		};
		const jsonStr = JSON.stringify(exportObj, null, 2);

		// Dispatch exported content to the app (Context API)
		dispatchExport({ exportObject: exportObj, exportJson: jsonStr });

		const blob = new Blob([jsonStr], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		const charName = basic.characterName.trim() || 'character';
		a.download = `IM_${charName.replace(/[^a-z0-9]/gi, '_')}_sheet.json`;
		a.href = url;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		setStatus(`📁 Exported as ${a.download}`);
		setTimeout(() => setStatus('✅ Ready — fill fields, export/import JSON.'), 3000);
	};

	const importFromJSON = (file: File) => {
		const reader = new FileReader();
		reader.onload = (evt) => {
			try {
				const parsed = JSON.parse(evt.target?.result as string);
				if (parsed.basic) setBasic(parsed.basic);
				if (parsed.characteristics) setCharacteristics(parsed.characteristics);
				if (parsed.fateCorruption) setFateCorruption(parsed.fateCorruption);
				if (parsed.skillsData && Array.isArray(parsed.skillsData)) {
					const mergedSkills = SKILLS_LIST.map((defaultSkill, idx) => ({
						...defaultSkill,
						...(parsed.skillsData[idx] || {}),
						skillName: defaultSkill.name,
						characteristic: defaultSkill.characteristic,
					}));
					setSkills(mergedSkills);
				}
				if (parsed.goalsInfluence) {
					// Backward compatible migration (older exports had { goals, factionInfluence, contacts })
					const gi = parsed.goalsInfluence;
					const migrated: GoalsInfluence = {
						...defaultGoalsInfluence,
						...gi,
						connections: gi.connections ?? gi.contacts ?? '',
						influences:
							Array.isArray(gi.influences) && gi.influences.length > 0
								? gi.influences
								: gi.factionInfluence || gi.contacts
									? [
											{
												id: Date.now().toString(),
												faction: gi.factionInfluence ?? '',
												influence: '',
												contacts: gi.contacts ?? '',
											},
										]
									: [],
						talents: Array.isArray(gi.talents) ? gi.talents : [],
					};
					setGoalsInfluence(migrated);
				}
				if (parsed.wounds) setWounds(parsed.wounds);
				if (parsed.weapons) setWeapons(parsed.weapons);
				if (parsed.armour) {
					const a = parsed.armour;
					const migrated = {
						...defaultArmourData,
						...a,
						armours: Array.isArray(a.armours)
							? a.armours.map((row: any) => ({
									id: String(row.id ?? Date.now()),
									name: String(row.name ?? ''),
									armourValue: String(row.armourValue ?? ''),
									enc: String(row.enc ?? ''),
									traits: String(row.traits ?? ''),
									// migrate old single string "location" to multi locations
									locations: Array.isArray(row.locations)
										? row.locations
										: typeof row.location === 'string' && row.location.trim()
											? (['body'] as const)
											: [],
								}))
							: defaultArmourData.armours,
					};
					setArmour(migrated);
				}
				if (parsed.equipment) setEquipment(parsed.equipment);
				if (parsed.psychicPowers) setPsychicPowers(parsed.psychicPowers);
				if (parsed.patronPage) setPatronPage(parsed.patronPage);
				if (parsed.specialisations && Array.isArray(parsed.specialisations)) {
					setSpecialisations(parsed.specialisations);
				}
				setStatus(`✨ Imported from "${file.name}"`);
				setTimeout(() => setStatus('✅ Ready — fill fields, export/import JSON.'), 3000);
			} catch (err) {
				setStatus('❌ Import failed: invalid JSON');
				setTimeout(() => setStatus('✅ Ready — fill fields, export/import JSON.'), 3000);
			}
		};
		reader.readAsText(file);
	};

	const resetAll = () => {
		if (confirm('⚠️ This will clear ALL character data. Export JSON first if needed.')) {
			setBasic(defaultBasicInfo);
			setCharacteristics(defaultCharacteristics);
			setFateCorruption(defaultFateCorruption);
			setSkills(defaultSkillsData);
			setGoalsInfluence(defaultGoalsInfluence);
			setWounds(defaultWoundsData);
			setWeapons(defaultWeaponsData);
			setArmour(defaultArmourData);
			setEquipment(defaultEquipmentData);
			setPsychicPowers(defaultPsychicPowersData);
			setPatronPage(defaultPatronPageData);
			setSpecialisations(defaultSpecialisationsData);
			clearLocalStorage();
			setStatus('🧹 All fields cleared.');
			setTimeout(() => setStatus('✅ Ready — fill fields, export/import JSON.'), 3000);
		}
	};

	const handleSpecialisationChange = (
		index: number,
		field: keyof SpecialisationData,
		value: string,
	) => {
		setSpecialisations((prev) =>
			prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)),
		);
	};

	const handleAddSpecialisation = () => {
		const newId = Date.now().toString();
		setSpecialisations((prev) => [
			...prev,
			{
				id: newId,
				specialisation: '',
				skill: '',
				adv: '',
				total: '',
			},
		]);
	};

	const handleRemoveSpecialisation = (index: number) => {
		setSpecialisations((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className='sheet-container'>
			<div className='sheet-card'>
				<div className='p-6 md:p-8'>
					<div className='text-center mb-6'>
						<h1>IMPERIUM MALEDICTUM</h1>
						<p className='italic text-amber-700 text-sm mt-1'>⚔️ CHARACTER SHEET ⚔️</p>
					</div>

					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '12px',
							marginBottom: '16px',
						}}
					>
						<div
							style={{
								display: 'flex',
								gap: '8px',
								background: 'rgba(233, 223, 203, 0.6)',
								border: '1px solid #cfb87c',
								borderRadius: '999px',
								padding: '6px',
							}}
						>
							{([1, 2, 3] as const).map((p) => (
								<button
									key={p}
									type='button'
									onClick={() => setPage(p)}
									style={{
										background: page === p ? '#5c3f28' : 'transparent',
										border: 'none',
										borderRadius: '999px',
										padding: '8px 14px',
										color: page === p ? '#fef0df' : '#4f351e',
										cursor: 'pointer',
										fontSize: '0.8rem',
										fontWeight: 700,
									}}
								>
									Page {p}
								</button>
							))}
						</div>

						<button
							type='button'
							onClick={() => setDiceOpen(true)}
							style={{
								background: '#5c3f28',
								border: '1px solid #cfb87c',
								borderRadius: '999px',
								padding: '10px 16px',
								color: '#fef0df',
								cursor: 'pointer',
								fontSize: '0.8rem',
								fontWeight: 700,
							}}
						>
							🎲 Dice
						</button>
					</div>

					<DiceModal open={diceOpen} onClose={() => setDiceOpen(false)} />

					<CharacterStatsProvider characteristics={characteristics}>
						{page === 1 ? (
							<>
								<CollapseSection title='📜 ORIGIN & IDENTITY' defaultOpen={false}>
									<BasicInfoSection
										showTitle={false}
										basic={basic}
										characteristics={characteristics}
										onBasicChange={handleBasicChange}
										onCharacteristicChange={handleCharacteristicChange}
									/>
								</CollapseSection>

								<CollapseSection title='🔥 FATE & CORRUPTION' defaultOpen={false}>
									<FateCorruptionSection
										showTitle={false}
										data={fateCorruption}
										onChange={handleFateCorruptionChange}
									/>
								</CollapseSection>

								<CollapseSection title='⚙️ SKILLS & SPECIALISATIONS' defaultOpen={false}>
									<SkillsSection
										showTitle={false}
										skills={skills}
										specialisations={specialisations}
										onSkillChange={handleSkillChange}
										onSpecialisationChange={handleSpecialisationChange}
										onAddSpecialisation={handleAddSpecialisation}
										onRemoveSpecialisation={handleRemoveSpecialisation}
									/>
								</CollapseSection>

								<CollapseSection title='🎯 GOALS & INFLUENCE' defaultOpen={false}>
									<GoalsInfluenceSection
										showTitle={false}
										data={goalsInfluence}
										onChange={handleGoalsInfluenceReplace}
									/>
								</CollapseSection>
							</>
						) : null}

						{page === 2 ? (
							<>
								<CollapseSection title='🩸 WOUNDS' defaultOpen={false}>
									<WoundsSection showTitle={false} data={wounds} onChange={setWounds} />
								</CollapseSection>
								<CollapseSection title='🗡️ WEAPONS' defaultOpen={false}>
									<WeaponsSection
										showTitle={false}
										data={weapons}
										onChange={setWeapons}
										specialisations={specialisations}
									/>
								</CollapseSection>
								<CollapseSection title='🛡️ ARMOUR' defaultOpen={false}>
									<ArmourSection showTitle={false} data={armour} onChange={setArmour} />
								</CollapseSection>
								<CollapseSection title='🎒 EQUIPMENT' defaultOpen={false}>
									<EquipmentSection showTitle={false} data={equipment} onChange={setEquipment} />
								</CollapseSection>
								<CollapseSection title='🧠 PSYCHIC POWERS' defaultOpen={false}>
									<PsychicPowersSection
										showTitle={false}
										data={psychicPowers}
										onChange={setPsychicPowers}
									/>
								</CollapseSection>
							</>
						) : null}

						{page === 3 ? (
							<>
								<CollapseSection title='📌 INFOS' defaultOpen={false}>
									<InfosSection
										showTitle={false}
										data={patronPage.info}
										onChange={(next) => setPatronPage((prev) => ({ ...prev, info: next }))}
									/>
								</CollapseSection>
								<CollapseSection title='✨ BOONS' defaultOpen={false}>
									<BoonsSection
										showTitle={false}
										boons={patronPage.boons}
										onChange={(next) => setPatronPage((prev) => ({ ...prev, boons: next }))}
									/>
								</CollapseSection>
								<CollapseSection title='🤝 INFLUENCE' defaultOpen={false}>
									<InfluenceSection
										showTitle={false}
										influences={patronPage.influences}
										onChange={(next) => setPatronPage((prev) => ({ ...prev, influences: next }))}
									/>
								</CollapseSection>
								<CollapseSection title='📝 NOTES' defaultOpen={false}>
									<NotesSection
										showTitle={false}
										value={patronPage.notes}
										onChange={(next) => setPatronPage((prev) => ({ ...prev, notes: next }))}
									/>
								</CollapseSection>
							</>
						) : null}
					</CharacterStatsProvider>

					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: '12px',
							marginTop: '12px',
						}}
					>
						<button
							type='button'
							onClick={() => setPage((p) => (p > 1 ? ((p - 1) as 1 | 2 | 3) : p))}
							disabled={page === 1}
							style={{
								background: page === 1 ? '#d9cfba' : '#5c3f28',
								border: 'none',
								borderRadius: '999px',
								padding: '8px 16px',
								color: page === 1 ? '#846b44' : '#fef0df',
								cursor: page === 1 ? 'not-allowed' : 'pointer',
								fontSize: '0.8rem',
								fontWeight: 700,
							}}
						>
							← Prev
						</button>
						<button
							type='button'
							onClick={() => setPage((p) => (p < 3 ? ((p + 1) as 1 | 2 | 3) : p))}
							disabled={page === 3}
							style={{
								background: page === 3 ? '#d9cfba' : '#5c3f28',
								border: 'none',
								borderRadius: '999px',
								padding: '8px 16px',
								color: page === 3 ? '#846b44' : '#fef0df',
								cursor: page === 3 ? 'not-allowed' : 'pointer',
								fontSize: '0.8rem',
								fontWeight: 700,
							}}
						>
							Next →
						</button>
					</div>

					<ActionButtons onExport={exportToJSON} onImport={importFromJSON} onReset={resetAll} />

					<div className='status-message'>{status}</div>

					<footer>
						Warhammer 40k Imperium Maledictum · fully editable text sheet · auto-saves locally
					</footer>
				</div>
			</div>
		</div>
	);
}

export default function CharacterSheet() {
	return (
		<ExportJsonProvider>
			<CharacterSheetInner />
		</ExportJsonProvider>
	);
}
