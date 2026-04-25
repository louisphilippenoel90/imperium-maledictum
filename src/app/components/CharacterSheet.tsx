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
	defaultBasicInfo,
	defaultCharacteristics,
	defaultFateCorruption,
	defaultGoalsInfluence,
	defaultSkillsData,
	SKILLS_LIST,
} from '@/app/types/sheet';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '@/app/utils/storage';
import BasicInfoSection from './BasicInfo';
import FateCorruptionSection from './FateCorruption';
import SkillsSection from './SkillsSection';
import GoalsInfluenceSection from './GoalsInfluence';
import ActionButtons from './ActionButtons';

import { SpecialisationData } from './SkillsSection';
import { CharacterStatsProvider } from '@/app/context/CharacterStatsContext';
import { ExportJsonProvider, useExportJson } from '@/app/context/ExportJsonContext';

const defaultSpecialisationsData: SpecialisationData[] = [];

function CharacterSheetInner() {
	const [basic, setBasic] = useState<BasicInfo>(defaultBasicInfo);
	const [characteristics, setCharacteristics] = useState<Characteristics>(defaultCharacteristics);
	const [fateCorruption, setFateCorruption] = useState<FateCorruption>(defaultFateCorruption);
	const [skills, setSkills] = useState<SkillData[]>(defaultSkillsData);
	const [goalsInfluence, setGoalsInfluence] = useState<GoalsInfluence>(defaultGoalsInfluence);
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
			specialisations,
		};
		saveToLocalStorage(fullData);
	}, [basic, characteristics, fateCorruption, skills, goalsInfluence, specialisations]);

	useEffect(() => {
		autoSave();
	}, [basic, characteristics, fateCorruption, skills, goalsInfluence, specialisations, autoSave]);

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

	const handleGoalsInfluenceChange = (field: keyof GoalsInfluence, value: string) => {
		setGoalsInfluence((prev) => ({ ...prev, [field]: value }));
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
				if (parsed.goalsInfluence) setGoalsInfluence(parsed.goalsInfluence);
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

					<CharacterStatsProvider characteristics={characteristics}>
						<BasicInfoSection
							basic={basic}
							characteristics={characteristics}
							onBasicChange={handleBasicChange}
							onCharacteristicChange={handleCharacteristicChange}
						/>

						<FateCorruptionSection data={fateCorruption} onChange={handleFateCorruptionChange} />
						<SkillsSection
							skills={skills}
							specialisations={specialisations}
							onSkillChange={handleSkillChange}
							onSpecialisationChange={handleSpecialisationChange}
							onAddSpecialisation={handleAddSpecialisation}
							onRemoveSpecialisation={handleRemoveSpecialisation}
						/>
						<GoalsInfluenceSection data={goalsInfluence} onChange={handleGoalsInfluenceChange} />
					</CharacterStatsProvider>

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
