'use client';

import { useMemo } from 'react';
import { ArmourData, HitLocationKey } from '@/app/types/sheet';

interface ArmourSectionProps {
	data: ArmourData;
	onChange: (next: ArmourData) => void;
	showTitle?: boolean;
}

const HIT_ROWS: { d10: string; label: string; key: HitLocationKey }[] = [
	{ d10: '1', label: 'Head', key: 'head' },
	{ d10: '2', label: 'Left Arm', key: 'leftArm' },
	{ d10: '3', label: 'Right Arm', key: 'rightArm' },
	{ d10: '4', label: 'Left Leg', key: 'leftLeg' },
	{ d10: '5', label: 'Right Leg', key: 'rightLeg' },
	{ d10: '6-0', label: 'Body', key: 'body' },
];

const HIT_LABELS: { key: HitLocationKey; label: string }[] = HIT_ROWS.map(({ key, label }) => ({ key, label }));

export default function ArmourSection({ data, onChange, showTitle = true }: ArmourSectionProps) {
	const addArmour = () => {
		onChange({
			...data,
			armours: [
				...data.armours,
				{
					id: Date.now().toString(),
					name: '',
					locations: [],
					armourValue: '',
					enc: '',
					traits: '',
				},
			],
		});
	};

	const removeArmour = (id: string) => {
		onChange({ ...data, armours: data.armours.filter((a) => a.id !== id) });
	};

	const updateArmour = (id: string, patch: Partial<(typeof data.armours)[number]>) => {
		onChange({
			...data,
			armours: data.armours.map((a) => (a.id === id ? { ...a, ...patch } : a)),
		});
	};

	const hitArmourByLocation = useMemo(() => {
		const result: Record<HitLocationKey, number> = {
			head: 0,
			leftArm: 0,
			rightArm: 0,
			leftLeg: 0,
			rightLeg: 0,
			body: 0,
		};

		for (const armour of data.armours) {
			const value = parseInt(armour.armourValue) || 0;
			for (const loc of armour.locations || []) {
				result[loc] += value;
			}
		}

		return result;
	}, [data.armours]);

	return (
		<div>
			{showTitle ? <h2 className='section-title'>🛡️ ARMOUR</h2> : null}

			<div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
				{/* ARMOUR LIST */}
				<div style={{ flex: '2 1 640px', minWidth: '320px' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
						<div style={{ color: '#846b44', fontSize: '0.8rem', fontStyle: 'italic' }}>
							Armour list (name / locations / value / enc / traits)
						</div>
						<button
							type='button'
							onClick={addArmour}
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
							+ Add Armour
						</button>
					</div>

					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
							<thead>
								<tr style={{ backgroundColor: '#e9dfcb' }}>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
										NAME
									</th>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
										LOCATIONS
									</th>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}>
										ARMOUR
									</th>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}>
										ENC.
									</th>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
										TRAITS
									</th>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }} />
								</tr>
							</thead>
							<tbody>
								{data.armours.length === 0 ? (
									<tr>
										<td colSpan={6} style={{ padding: '12px', textAlign: 'center', color: '#846b44' }}>
											No armour yet.
										</td>
									</tr>
								) : (
									data.armours.map((a) => (
										<tr key={a.id} style={{ borderBottom: '1px solid #e2cfaa' }}>
											<td style={{ padding: '8px', width: '180px' }}>
												<input
													type='text'
													value={a.name}
													onChange={(e) => updateArmour(a.id, { name: e.target.value })}
													placeholder='Armour name'
													className='text-input'
												/>
											</td>
											<td style={{ padding: '8px', width: '180px' }}>
										<div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
											{HIT_LABELS.map((opt) => {
												const checked = a.locations?.includes(opt.key) ?? false;
												return (
													<label
														key={opt.key}
														style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}
													>
														<input
															type='checkbox'
															checked={checked}
															onChange={(e) => {
																const next = e.target.checked
																	? [...(a.locations || []), opt.key]
																	: (a.locations || []).filter((k) => k !== opt.key);
																updateArmour(a.id, { locations: next });
															}}
														/>
														<span style={{ color: '#4f351e' }}>{opt.label}</span>
													</label>
												);
											})}
										</div>
											</td>
											<td style={{ padding: '8px', textAlign: 'center', width: '90px' }}>
												<input
													type='text'
													value={a.armourValue}
													onChange={(e) => updateArmour(a.id, { armourValue: e.target.value })}
													placeholder='0'
													style={{ width: '70px', textAlign: 'center' }}
													className='text-input'
												/>
											</td>
											<td style={{ padding: '8px', textAlign: 'center', width: '90px' }}>
												<input
													type='text'
													value={a.enc}
													onChange={(e) => updateArmour(a.id, { enc: e.target.value })}
													placeholder='0'
													style={{ width: '70px', textAlign: 'center' }}
													className='text-input'
												/>
											</td>
											<td style={{ padding: '8px', width: '260px' }}>
												<textarea
													value={a.traits}
													onChange={(e) => updateArmour(a.id, { traits: e.target.value })}
													rows={2}
													placeholder='Traits'
													className='textarea-input'
												/>
											</td>
											<td style={{ padding: '8px', textAlign: 'center', width: '60px' }}>
												<button
													type='button'
													onClick={() => removeArmour(a.id)}
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

				{/* HIT LOCATION TABLE */}
				<div style={{ flex: '1 1 320px', minWidth: '280px' }}>
					<h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4f351e', marginBottom: '10px' }}>
						HIT LOCATION
					</h3>
					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '320px' }}>
							<thead>
								<tr style={{ backgroundColor: '#e9dfcb' }}>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}>
										D10
									</th>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
										LOCATION
									</th>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}>
										ARMOUR
									</th>
								</tr>
							</thead>
							<tbody>
								{HIT_ROWS.map((row) => (
									<tr key={row.key} style={{ borderBottom: '1px solid #e2cfaa' }}>
										<td style={{ padding: '8px', textAlign: 'center', width: '60px', fontWeight: 'bold' }}>
											{row.d10}
										</td>
										<td style={{ padding: '8px' }}>{row.label}</td>
										<td style={{ padding: '8px', textAlign: 'center', width: '90px' }}>
											<input
												type='text'
												value={hitArmourByLocation[row.key]}
												readOnly
												style={{
													width: '70px',
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
				</div>
			</div>
		</div>
	);
}

