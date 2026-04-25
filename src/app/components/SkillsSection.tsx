'use client';

import { useEffect } from 'react';
import { SkillData, SKILLS_LIST } from '@/app/types/sheet';
import { useCharacterStats } from '@/app/context/CharacterStatsContext';

interface SkillsSectionProps {
	skills: SkillData[];
	specialisations: SpecialisationData[];
	onSkillChange: (index: number, field: keyof SkillData, value: string) => void;
	onSpecialisationChange: (index: number, field: keyof SpecialisationData, value: string) => void;
	onAddSpecialisation: () => void;
	onRemoveSpecialisation: (index: number) => void;
}

export interface SpecialisationData {
	id: string;
	specialisation: string;
	skill: string;
	adv: string;
	total: string;
}

export default function SkillsSection({
	skills,
	specialisations,
	onSkillChange,
	onSpecialisationChange,
	onAddSpecialisation,
	onRemoveSpecialisation,
}: SkillsSectionProps) {
	const { characteristics } = useCharacterStats();

	const characteristicKeyByLabel: Record<string, keyof typeof characteristics> = {
		WS: 'ws',
		BS: 'bs',
		STR: 'str',
		TGH: 'tgh',
		AG: 'ag',
		INT: 'int',
		PER: 'per',
		WIL: 'wil',
		FEL: 'fel',
	};

	const getSkillBaseCurrent = (skill: SkillData): string => {
		const label = (skill.characteristic || '').toUpperCase().trim();
		const key = characteristicKeyByLabel[label];
		if (!key) return '0';
		return characteristics[key]?.current ?? '0';
	};

	// Calculate TOTAL for skill: characteristicCurrent + (advances × 5)
	const calculateSkillTotal = (characteristicCurrent: string, advances: string): string => {
		const base = parseInt(characteristicCurrent) || 0;
		const adv = parseInt(advances) || 0;
		return (base + adv * 5).toString();
	};

	const handleAdvChange = (index: number, value: string) => {
		const skill = skills[index];
		const baseCurrent = getSkillBaseCurrent(skill);
		const total = calculateSkillTotal(baseCurrent, value);
		onSkillChange(index, 'advances', value);
		onSkillChange(index, 'total', total);
	};

	// Keep stored totals in sync when characteristics change (export/import stays consistent)
	useEffect(() => {
		skills.forEach((skill, index) => {
			const baseCurrent = getSkillBaseCurrent(skill);
			const computedTotal = calculateSkillTotal(baseCurrent, skill.advances);
			if ((skill.total || '') !== computedTotal) {
				onSkillChange(index, 'total', computedTotal);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [characteristics]);

	const getSpecialisationBaseFromSkill = (skillName: string): string => {
		if (!skillName) return '0';
		const target = skills.find((s) => (s.skillName || '').toUpperCase() === skillName.toUpperCase());
		if (!target) return '0';
		const baseCurrent = getSkillBaseCurrent(target);
		return calculateSkillTotal(baseCurrent, target.advances);
	};

	// Calculate TOTAL for specialisation: base(skill total) + (adv × 5)
	const calculateSpecialisationTotal = (base: string, adv: string): string => {
		const baseValue = parseInt(base) || 0;
		const advValue = parseInt(adv) || 0;
		return (baseValue + advValue * 5).toString();
	};

	const handleSpecialisationAdvChange = (index: number, value: string) => {
		const spec = specialisations[index];
		const base = getSpecialisationBaseFromSkill(spec.skill);
		const total = calculateSpecialisationTotal(base, value);
		onSpecialisationChange(index, 'adv', value);
		onSpecialisationChange(index, 'total', total);
	};

	const handleSpecialisationSkillChange = (index: number, value: string) => {
		onSpecialisationChange(index, 'skill', value);
		const base = getSpecialisationBaseFromSkill(value);
		const total = calculateSpecialisationTotal(base, specialisations[index]?.adv || '');
		onSpecialisationChange(index, 'total', total);
	};

	// Keep specialisation totals in sync if skill totals change
	useEffect(() => {
		specialisations.forEach((spec, index) => {
			const base = getSpecialisationBaseFromSkill(spec.skill);
			const computedTotal = calculateSpecialisationTotal(base, spec.adv);
			if ((spec.total || '') !== computedTotal) {
				onSpecialisationChange(index, 'total', computedTotal);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skills, characteristics]);

	// Split skills into two tables (keep original indices for handlers)
	const findSkillIndex = (name: string) =>
		skills.findIndex((s) => (s.skillName || '').toLowerCase() === name.toLowerCase());

	const athleticIdx = findSkillIndex('athletics');
	const medicaeIdx = findSkillIndex('medicae');
	const meleeIdx = findSkillIndex('melee');
	const techIdx = findSkillIndex('tech');

	const sliceByIndices = (startIdx: number, endIdx: number) => {
		if (startIdx < 0 || endIdx < 0) return [];
		const from = Math.min(startIdx, endIdx);
		const to = Math.max(startIdx, endIdx);
		return skills.slice(from, to + 1).map((skill, i) => ({ skill, index: from + i }));
	};

	const skillsTable1 = sliceByIndices(athleticIdx, medicaeIdx);
	const skillsTable2 = sliceByIndices(meleeIdx, techIdx);

	// Fallback: if the expected skills aren't found, keep old behavior (split in half)
	const fallbackMidPoint = Math.ceil(skills.length / 2);
	const fallbackTable1 = skills.slice(0, fallbackMidPoint).map((skill, i) => ({ skill, index: i }));
	const fallbackTable2 = skills
		.slice(fallbackMidPoint)
		.map((skill, i) => ({ skill, index: fallbackMidPoint + i }));

	const leftTable = skillsTable1.length > 0 ? skillsTable1 : fallbackTable1;
	const rightTable = skillsTable2.length > 0 ? skillsTable2 : fallbackTable2;

	return (
		<div className='form-section'>
			<h2 className='section-title'>⚙️ SKILLS & SPECIALISATIONS</h2>

			{/* SKILLS TABLE */}
			<div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '32px' }}>
				{[
					{ data: leftTable, keyPrefix: 'left' },
					{ data: rightTable, keyPrefix: 'right' },
				].map(({ data, keyPrefix }) => (
					<div
						key={keyPrefix}
						className='skills-table-container'
						style={{ flex: '1 1 0', minWidth: '420px', overflowX: 'auto' }}
					>
						<table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
							<thead>
								<tr style={{ backgroundColor: '#e9dfcb' }}>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'left',
											width: '38%',
										}}
									>
										Skill
									</th>
									<th
										colSpan={2}
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'left',
											width: '32%',
										}}
									>
										Characteristic
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'center',
											width: '15%',
										}}
									>
										ADV.
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'center',
											width: '15%',
										}}
									>
										TOTAL
									</th>
								</tr>
							</thead>
							<tbody>
								{data.map(({ skill, index }) => (
									<tr key={`${keyPrefix}-${index}`} style={{ borderBottom: '1px solid #e2cfaa' }}>
										<td style={{ padding: '8px', fontWeight: 'bold', overflow: 'hidden' }}>
											{skill.skillName}
										</td>
										<td style={{ padding: '8px' }}>
											<span
												className='skill-stat'
												style={{
													background: '#e9dfcb',
													padding: '4px 10px',
													borderRadius: '20px',
													fontSize: '0.75rem',
												}}
											>
												{skill.characteristic}
											</span>
										</td>
										<td style={{ padding: '8px', textAlign: 'center' }}>
											<input
												type='text'
												value={getSkillBaseCurrent(skill)}
												readOnly
												style={{ width: '60px', textAlign: 'center' }}
												className='text-input'
											/>
										</td>
										<td style={{ padding: '8px', textAlign: 'center' }}>
											<input
												type='text'
												value={skill.advances}
												onChange={(e) => handleAdvChange(index, e.target.value)}
												placeholder='0'
												style={{ width: '60px', textAlign: 'center' }}
												className='text-input'
											/>
										</td>
										<td style={{ padding: '8px', textAlign: 'center' }}>
											<input
												type='text'
												value={calculateSkillTotal(getSkillBaseCurrent(skill), skill.advances)}
												readOnly
												style={{
													width: '60px',
													textAlign: 'center',
													backgroundColor: '#e9dfcb',
													fontWeight: 'bold',
												}}
												className='text-input'
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				))}
			</div>

			{/* SPECIALISATIONS TABLE */}
			<div style={{ marginTop: '28px' }}>
				<h3
					style={{
						fontSize: '1.2rem',
						fontWeight: 'bold',
						color: '#4f351e',
						borderLeft: '4px solid #b87c3a',
						paddingLeft: '12px',
						marginBottom: '16px',
					}}
				>
					📌 SPECIALISATIONS
				</h3>

				{specialisations.length === 0 ? (
					<div
						style={{ textAlign: 'center', padding: '20px', color: '#846b44', fontStyle: 'italic' }}
					>
						No specialisations added. Click "+ Add Specialisation" to create one.
					</div>
				) : (
					<div className='specialisations-table-container' style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ backgroundColor: '#e9dfcb' }}>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'left',
										}}
									>
										Specialisation
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'left',
										}}
									>
										Skill
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'center',
										}}
									>
										Base
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'center',
										}}
									>
										ADV. (+5 each)
									</th>
							
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'center',
										}}
									>
										TOTAL
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'center',
										}}
									></th>
								</tr>
							</thead>
							<tbody>
								{specialisations.map((spec, idx) => (
									<tr key={spec.id} style={{ borderBottom: '1px solid #e2cfaa' }}>
										<td style={{ padding: '8px' }}>
											<input
												type='text'
												value={spec.specialisation}
												onChange={(e) =>
													onSpecialisationChange(idx, 'specialisation', e.target.value)
												}
												placeholder='e.g., Swords, Las Weapons'
												style={{ width: '180px' }}
												className='text-input'
											/>
										</td>
										<td style={{ padding: '8px' }}>
											<select
												value={spec.skill}
												onChange={(e) => handleSpecialisationSkillChange(idx, e.target.value)}
												style={{ width: '150px' }}
												className='text-input'
											>
												<option value=''>Select Skill</option>
												{SKILLS_LIST.map((skill) => (
													<option key={skill.name} value={skill.name}>
														{skill.name}
													</option>
												))}
											</select>
										</td>
										
										<td style={{ padding: '8px', textAlign: 'center' }}>
											<input
												type='text'
												value={getSpecialisationBaseFromSkill(spec.skill)}
												readOnly
												style={{
													width: '80px',
													textAlign: 'center',
													backgroundColor: '#fff7e6',
													fontWeight: 'bold',
												}}
												className='text-input'
											/>
										</td>
										<td style={{ padding: '8px', textAlign: 'center' }}>
											<input
												type='text'
												value={spec.adv}
												onChange={(e) => handleSpecialisationAdvChange(idx, e.target.value)}
												placeholder='0'
												style={{ width: '80px', textAlign: 'center' }}
												className='text-input'
											/>
										</td>
										<td style={{ padding: '8px', textAlign: 'center' }}>
											<input
												type='text'
												value={calculateSpecialisationTotal(
													getSpecialisationBaseFromSkill(spec.skill),
													spec.adv,
												)}
												readOnly
												style={{
													width: '80px',
													textAlign: 'center',
													backgroundColor: '#e9dfcb',
													fontWeight: 'bold',
												}}
												className='text-input'
											/>
										</td>
										<td style={{ padding: '8px', textAlign: 'center' }}>
											<button
												onClick={() => onRemoveSpecialisation(idx)}
												style={{
													background: '#a0522d',
													border: 'none',
													borderRadius: '20px',
													padding: '4px 12px',
													color: 'white',
													cursor: 'pointer',
													fontSize: '0.7rem',
												}}
											>
												✕ Remove
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<button
					onClick={onAddSpecialisation}
					style={{
						marginTop: '16px',
						background: '#5c3f28',
						border: 'none',
						borderRadius: '30px',
						padding: '8px 20px',
						color: '#fef0df',
						cursor: 'pointer',
						fontSize: '0.8rem',
					}}
				>
					+ Add Specialisation
				</button>
			</div>

			<div className='text-xs text-stone-500 mt-4 italic'>
				※ Skills: TOTAL = Manual Input + (ADV × 5) | Specialisations: TOTAL = ADV × 5
			</div>
		</div>
	);
}
