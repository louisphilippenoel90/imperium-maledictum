'use client';

import { useMemo } from 'react';
import { PsychicPowersData } from '@/app/types/sheet';
import { useCharacterStats } from '@/app/context/CharacterStatsContext';

interface PsychicPowersSectionProps {
	data: PsychicPowersData;
	onChange: (next: PsychicPowersData) => void;
	showTitle?: boolean;
}

const bonusFromCurrent = (value: string): number => {
	const n = parseInt(value) || 0;
	return Math.floor(n / 10);
};

export default function PsychicPowersSection({
	data,
	onChange,
	showTitle = true,
}: PsychicPowersSectionProps) {
	const { characteristics } = useCharacterStats();
	const wilB = bonusFromCurrent(characteristics.wil.current);
	const threshold = useMemo(() => wilB * (data.sanctioned ? 2 : 1), [wilB, data.sanctioned]);

	const addPower = () => {
		onChange({
			...data,
			powers: [
				...data.powers,
				{
					id: Date.now().toString(),
					name: '',
					wrp: '',
					diff: '',
					rang: '',
					targ: '',
					dur: '',
					effect: '',
				},
			],
		});
	};

	const removePower = (id: string) => {
		onChange({ ...data, powers: data.powers.filter((p) => p.id !== id) });
	};

	const updatePower = (id: string, patch: Partial<(typeof data.powers)[number]>) => {
		onChange({ ...data, powers: data.powers.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
	};

	return (
		<div>
			{showTitle ? <h2 className='section-title'>🧠 PSYCHIC POWERS</h2> : null}

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					gap: '10px',
					marginBottom: '10px',
				}}
			>
				<div style={{ color: '#846b44', fontSize: '0.8rem', fontStyle: 'italic' }}>
					Effect is a textarea; all other fields are inputs.
				</div>
				<button
					type='button'
					onClick={addPower}
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
					+ Add Power
				</button>
			</div>

			<div style={{ overflowX: 'auto' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1080px' }}>
					<thead>
						<tr style={{ backgroundColor: '#e9dfcb' }}>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								NAME
							</th>
							<th
								style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}
							>
								WR
							</th>
							<th
								style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}
							>
								DIF
							</th>
							<th
								style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}
							>
								RAN
							</th>
							<th
								style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}
							>
								TAR
							</th>
							<th
								style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}
							>
								DUR
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								EFFECT
							</th>
							<th
								style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}
							/>
						</tr>
					</thead>
					<tbody>
						{data.powers.length === 0 ? (
							<tr>
								<td colSpan={8} style={{ padding: '12px', textAlign: 'center', color: '#846b44' }}>
									No psychic powers yet.
								</td>
							</tr>
						) : (
							data.powers.map((p) => (
								<tr key={p.id} style={{ borderBottom: '1px solid #e2cfaa' }}>
									<td style={{ padding: '8px', width: '220px' }}>
										<input
											type='text'
											value={p.name}
											onChange={(e) => updatePower(p.id, { name: e.target.value })}
											placeholder='Power name'
											className='text-input'
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '70px' }}>
										<input
											type='text'
											value={p.wrp}
											onChange={(e) => updatePower(p.id, { wrp: e.target.value })}
											placeholder='-'
											className='text-input'
											style={{ width: '60px', textAlign: 'center' }}
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '80px' }}>
										<input
											type='text'
											value={p.diff}
											onChange={(e) => updatePower(p.id, { diff: e.target.value })}
											placeholder='-'
											className='text-input'
											style={{ width: '70px', textAlign: 'center' }}
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '80px' }}>
										<input
											type='text'
											value={p.rang}
											onChange={(e) => updatePower(p.id, { rang: e.target.value })}
											placeholder='-'
											className='text-input'
											style={{ width: '70px', textAlign: 'center' }}
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '80px' }}>
										<input
											type='text'
											value={p.targ}
											onChange={(e) => updatePower(p.id, { targ: e.target.value })}
											placeholder='-'
											className='text-input'
											style={{ width: '70px', textAlign: 'center' }}
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '80px' }}>
										<input
											type='text'
											value={p.dur}
											onChange={(e) => updatePower(p.id, { dur: e.target.value })}
											placeholder='-'
											className='text-input'
											style={{ width: '70px', textAlign: 'center' }}
										/>
									</td>
									<td style={{ padding: '8px', width: '360px' }}>
										<textarea
											value={p.effect}
											onChange={(e) => updatePower(p.id, { effect: e.target.value })}
											rows={2}
											placeholder='Effect'
											className='textarea-input'
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '60px' }}>
										<button
											type='button'
											onClick={() => removePower(p.id)}
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

			<div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
				<div
					style={{
						border: '1px solid #e2cfaa',
						borderRadius: '14px',
						background: '#fff9ef',
						padding: '12px',
						minWidth: '280px',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: '10px',
							alignItems: 'center',
						}}
					>
						<h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#4f351e', margin: 0 }}>
							WARP CHARGE
						</h3>
						<label
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								fontSize: '0.8rem',
								color: '#4f351e',
							}}
						>
							<input
								type='checkbox'
								checked={data.sanctioned}
								onChange={(e) => onChange({ ...data, sanctioned: e.target.checked })}
							/>
							Sanctioned (×2)
						</label>
					</div>

					<div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
						<div className='field-group' style={{ width: '120px' }}>
							<label className='field-label'>CURRENT</label>
							<input
								type='text'
								value={data.warpChargeCurrent}
								onChange={(e) => onChange({ ...data, warpChargeCurrent: e.target.value })}
								placeholder='0'
								className='text-input'
								style={{ textAlign: 'center' }}
							/>
						</div>
						<div className='field-group' style={{ width: '120px' }}>
							<label className='field-label'>THRESHOLD</label>
							<input
								type='text'
								value={threshold}
								readOnly
								className='text-input'
								style={{ textAlign: 'center', backgroundColor: '#e9dfcb', fontWeight: 'bold' }}
							/>
						</div>
					</div>

					<div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#846b44' }}>
						Threshold = WILB ({wilB}) {data.sanctioned ? '× 2' : ''}
					</div>
				</div>
			</div>
		</div>
	);
}
