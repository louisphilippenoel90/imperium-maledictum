'use client';

import { WeaponsData } from '@/app/types/sheet';
import type { SpecialisationData } from '@/app/components/page1/SkillsSection';

interface WeaponsSectionProps {
	data: WeaponsData;
	specialisations: SpecialisationData[];
	onChange: (next: WeaponsData) => void;
	showTitle?: boolean;
}

export default function WeaponsSection({
	data,
	specialisations,
	onChange,
	showTitle = true,
}: WeaponsSectionProps) {
	const addWeapon = () => {
		onChange({
			...data,
			weapons: [
				...data.weapons,
				{
					id: Date.now().toString(),
					name: '',
					specialisationId: '',
					test: '',
					damage: '',
					range: '',
					mag: '',
					enc: '',
					traits: '',
				},
			],
		});
	};

	const removeWeapon = (id: string) => {
		onChange({ ...data, weapons: data.weapons.filter((w) => w.id !== id) });
	};

	const updateWeapon = (id: string, patch: Partial<(typeof data.weapons)[number]>) => {
		onChange({
			...data,
			weapons: data.weapons.map((w) => (w.id === id ? { ...w, ...patch } : w)),
		});
	};

	const specialisationOptions = specialisations
		.filter((s) => (s.specialisation || '').trim().length > 0)
		.map((s) => ({
			id: s.id,
			label: `${s.specialisation}${s.skill ? ` (${s.skill})` : ''}`,
		}));

	const getSpecialisationTotal = (specialisationId: string): string => {
		if (!specialisationId) return '';
		const spec = specialisations.find((s) => s.id === specialisationId);
		return spec?.total ?? '';
	};

	return (
		<div>
			{showTitle ? <h2 className='section-title'>🗡️ WEAPONS</h2> : null}

			<div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
				<div style={{ color: '#846b44', fontSize: '0.8rem', fontStyle: 'italic' }}>
					Specialisation dropdown uses the specialisations created in Skills.
				</div>
				<button
					type='button'
					onClick={addWeapon}
					style={{
						background: '#5c3f28',
						border: 'none',
						borderRadius: '999px',
						padding: '6px 12px',
						color: '#fef0df',
						cursor: 'pointer',
						fontSize: '0.75rem',
						whiteSpace: 'nowrap',
					}}
				>
					+ Add Weapon
				</button>
			</div>

			<div style={{ overflowX: 'auto' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '980px' }}>
					<thead>
						<tr style={{ backgroundColor: '#e9dfcb' }}>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								NAME
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								SPECIALISATION
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								TEST
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								DAMAGE
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								RANGE
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}>
								MAG
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}>
								ENC
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								TRAITS
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }} />
						</tr>
					</thead>
					<tbody>
						{data.weapons.length === 0 ? (
							<tr>
								<td colSpan={9} style={{ padding: '12px', textAlign: 'center', color: '#846b44' }}>
									No weapons yet.
								</td>
							</tr>
						) : (
							data.weapons.map((w) => (
								<tr key={w.id} style={{ borderBottom: '1px solid #e2cfaa' }}>
									<td style={{ padding: '8px', width: '180px' }}>
										<textarea
											value={w.name}
											onChange={(e) => updateWeapon(w.id, { name: e.target.value })}
											placeholder='Weapon name'
											className='text-input'
										/>
									</td>
									<td style={{ padding: '8px', width: '220px' }}>
										<select
											value={w.specialisationId}
											onChange={(e) => {
												const specialisationId = e.target.value;
												const specTotal = getSpecialisationTotal(specialisationId);
												updateWeapon(w.id, {
													specialisationId,
													// keep exports consistent with displayed computed test
													test: specTotal || w.test,
												});
											}}
											className='text-input'
										>
											<option value=''>None</option>
											{specialisationOptions.map((opt) => (
												<option key={opt.id} value={opt.id}>
													{opt.label}
												</option>
											))}
										</select>
									</td>
									<td style={{ padding: '8px', width: '140px' }}>
										<input
											type='text'
											value={w.specialisationId ? getSpecialisationTotal(w.specialisationId) : w.test}
											onChange={(e) => updateWeapon(w.id, { test: e.target.value })}
											readOnly={Boolean(w.specialisationId)}
											placeholder='Test'
											className='text-input'
											style={{
												backgroundColor: w.specialisationId ? '#e9dfcb' : undefined,
												fontWeight: w.specialisationId ? 'bold' : undefined,
											}}
										/>
									</td>
									<td style={{ padding: '8px', width: '120px' }}>
										<input
											type='text'
											value={w.damage}
											onChange={(e) => updateWeapon(w.id, { damage: e.target.value })}
											placeholder='Damage'
											className='text-input'
										/>
									</td>
									<td style={{ padding: '8px', width: '120px' }}>
										<input
											type='text'
											value={w.range}
											onChange={(e) => updateWeapon(w.id, { range: e.target.value })}
											placeholder='Range'
											className='text-input'
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '80px' }}>
										<input
											type='text'
											value={w.mag}
											onChange={(e) => updateWeapon(w.id, { mag: e.target.value })}
											placeholder='0'
											style={{ width: '70px', textAlign: 'center' }}
											className='text-input'
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '80px' }}>
										<input
											type='text'
											value={w.enc}
											onChange={(e) => updateWeapon(w.id, { enc: e.target.value })}
											placeholder='0'
											style={{ width: '70px', textAlign: 'center' }}
											className='text-input'
										/>
									</td>
									<td style={{ padding: '8px', width: '260px' }}>
										<textarea
											value={w.traits}
											onChange={(e) => updateWeapon(w.id, { traits: e.target.value })}
											rows={2}
											placeholder='Traits'
											className='textarea-input'
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '60px' }}>
										<button
											type='button'
											onClick={() => removeWeapon(w.id)}
											style={{
												background: '#a0522d',
												border: 'none',
												borderRadius: '999px',
												padding: '4px 10px',
												color: 'white',
												cursor: 'pointer',
												fontSize: '0.7rem',
											}}
										>
											✕
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

