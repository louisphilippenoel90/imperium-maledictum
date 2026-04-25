'use client';

import { useState, useEffect, useCallback } from 'react';
import {
	CharacterSheetData,
	BasicInfo,
	FateCorruption,
	GoalsInfluence,
	SkillData,
	defaultBasicInfo,
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

export default function CharacterSheet() {
	const [basic, setBasic] = useState<BasicInfo>(defaultBasicInfo);
	const [fateCorruption, setFateCorruption] = useState<FateCorruption>(defaultFateCorruption);
	const [skills, setSkills] = useState<SkillData[]>(defaultSkillsData);
	const [goalsInfluence, setGoalsInfluence] = useState<GoalsInfluence>(defaultGoalsInfluence);
	const [status, setStatus] = useState('✅ Ready — fill fields, export/import JSON.');

	// Load from localStorage on mount
	useEffect(() => {
		const saved = loadFromLocalStorage();
		if (saved) {
			setBasic(saved.basic);
			setFateCorruption(saved.fateCorruption);
			setSkills(saved.skillsData);
			setGoalsInfluence(saved.goalsInfluence);
			setStatus('📀 Loaded previous session from browser storage.');
			setTimeout(() => setStatus('✅ Ready — fill fields, export/import JSON.'), 3000);
		}
	}, []);

	// Auto-save to localStorage
	const autoSave = useCallback(() => {
		const fullData: CharacterSheetData = {
			basic,
			fateCorruption,
			skillsData: skills,
			goalsInfluence,
		};
		saveToLocalStorage(fullData);
	}, [basic, fateCorruption, skills, goalsInfluence]);

	useEffect(() => {
		autoSave();
	}, [basic, fateCorruption, skills, goalsInfluence, autoSave]);

	const handleBasicChange = (field: keyof BasicInfo, value: string) => {
		setBasic((prev) => ({ ...prev, [field]: value }));
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

	const exportToJSON = () => {
		const fullData: CharacterSheetData = {
			basic,
			fateCorruption,
			skillsData: skills,
			goalsInfluence,
		};
		const exportObj = {
			version: 'IM_Maledictum_1.0',
			exportedAt: new Date().toISOString(),
			...fullData,
		};
		const jsonStr = JSON.stringify(exportObj, null, 2);
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
				if (parsed.fateCorruption) setFateCorruption(parsed.fateCorruption);
				if (parsed.skillsData && Array.isArray(parsed.skillsData)) {
					// Ensure all skills have the right structure, merge with defaults
					const mergedSkills = SKILLS_LIST.map((defaultSkill, idx) => ({
						...defaultSkill,
						...(parsed.skillsData[idx] || {}),
						skillName: defaultSkill.name,
						characteristic: defaultSkill.characteristic,
					}));
					setSkills(mergedSkills);
				}
				if (parsed.goalsInfluence) setGoalsInfluence(parsed.goalsInfluence);
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
			setFateCorruption(defaultFateCorruption);
			setSkills(defaultSkillsData);
			setGoalsInfluence(defaultGoalsInfluence);
			clearLocalStorage();
			setStatus('🧹 All fields cleared.');
			setTimeout(() => setStatus('✅ Ready — fill fields, export/import JSON.'), 3000);
		}
	};

	return (
		<div className='sheet-container'>
			<div className='sheet-card'>
				<div className='p-6 md:p-8'>
					<div className='text-center mb-6'>
						<h1 className='text-3xl md:text-4xl font-serif font-bold text-leather-dark tracking-wider'>
							IMPERIUM MALEDICTUM
						</h1>
						<p className='italic text-amber-700 text-sm mt-1'>⚔️ CHARACTER SHEET ⚔️</p>
					</div>

					<BasicInfoSection data={basic} onChange={handleBasicChange} />
					<FateCorruptionSection data={fateCorruption} onChange={handleFateCorruptionChange} />
					<SkillsSection skills={skills} onSkillChange={handleSkillChange} />
					<GoalsInfluenceSection data={goalsInfluence} onChange={handleGoalsInfluenceChange} />

					<ActionButtons onExport={exportToJSON} onImport={importFromJSON} onReset={resetAll} />

					<div className='status-message'>{status}</div>

					<footer className='text-center text-xs text-stone-500 mt-6 pt-4 border-t border-amber-300'>
						Warhammer 40k Imperium Maledictum · fully editable text sheet · auto-saves locally
					</footer>
				</div>
			</div>
		</div>
	);
}
