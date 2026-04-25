'use client';

import { SkillData, SKILLS_LIST } from '@/app/types/sheet';

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
	// Calculate TOTAL for skill: manualInput + (advances × 5)
	const calculateSkillTotal = (manualInput: string, advances: string): string => {
		const manual = parseInt(manualInput) || 0;
		const adv = parseInt(advances) || 0;
		return (manual + adv * 5).toString();
	};

	const handleManualInputChange = (index: number, value: string) => {
		const skill = skills[index];
		const total = calculateSkillTotal(value, skill.advances);
		onSkillChange(index, 'manualInput', value);
		onSkillChange(index, 'total', total);
	};

	const handleAdvChange = (index: number, value: string) => {
		const skill = skills[index];
		const total = calculateSkillTotal(skill.manualInput, value);
		onSkillChange(index, 'advances', value);
		onSkillChange(index, 'total', total);
	};

	// Calculate TOTAL for specialisation: adv × 5 (base from characteristic, but user manages total)
	const calculateSpecialisationTotal = (adv: string): string => {
		const advValue = parseInt(adv) || 0;
		return (advValue * 5).toString();
	};

	const handleSpecialisationAdvChange = (index: number, value: string) => {
		const total = calculateSpecialisationTotal(value);
		onSpecialisationChange(index, 'adv', value);
		onSpecialisationChange(index, 'total', total);
	};

	// Split skills into two columns for better layout
	const midPoint = Math.ceil(skills.length / 2);
	const leftSkills = skills.slice(0, midPoint);
	const rightSkills = skills.slice(midPoint);

	return (
		<div className='form-section'>
			<h2 className='section-title'>⚙️ SKILLS & SPECIALISATIONS</h2>

			{/* SKILLS TABLE */}
			<div className='skills-table-container' style={{ overflowX: 'auto', marginBottom: '32px' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr style={{ backgroundColor: '#e9dfcb' }}>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								Skill
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								Characteristic
							</th>
							<th
								style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}
							>
								Manual Input
							</th>
							<th
								style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}
							>
								ADV. (+5 each)
							</th>
							<th
								style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}
							>
								TOTAL
							</th>
						</tr>
					</thead>
					<tbody>
						{skills.map((skill, idx) => (
							<tr key={idx} style={{ borderBottom: '1px solid #e2cfaa' }}>
								<td style={{ padding: '8px', fontWeight: 'bold' }}>{skill.skillName}</td>
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
										value={skill.manualInput || ''}
										onChange={(e) => handleManualInputChange(idx, e.target.value)}
										placeholder='0'
										style={{ width: '80px', textAlign: 'center' }}
										className='text-input'
									/>
								</td>
								<td style={{ padding: '8px', textAlign: 'center' }}>
									<input
										type='text'
										value={skill.advances}
										onChange={(e) => handleAdvChange(idx, e.target.value)}
										placeholder='0'
										style={{ width: '80px', textAlign: 'center' }}
										className='text-input'
									/>
								</td>
								<td style={{ padding: '8px', textAlign: 'center' }}>
									<input
										type='text'
										value={skill.total}
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
							</tr>
						))}
					</tbody>
				</table>
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
												onChange={(e) => onSpecialisationChange(idx, 'skill', e.target.value)}
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
												value={spec.total}
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
