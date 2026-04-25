'use client';

import { useMemo } from 'react';
import { WoundsData } from '@/app/types/sheet';
import { useCharacterStats } from '@/app/context/CharacterStatsContext';

interface WoundsSectionProps {
	data: WoundsData;
	onChange: (next: WoundsData) => void;
	showTitle?: boolean;
}

const bonusFromCurrent = (value: string): number => {
	const n = parseInt(value) || 0;
	return Math.floor(n / 10);
};

export default function WoundsSection({ data, onChange, showTitle = true }: WoundsSectionProps) {
	const { characteristics } = useCharacterStats();

	const perB = bonusFromCurrent(characteristics.per.current);
	const agB = bonusFromCurrent(characteristics.ag.current);
	const strB = bonusFromCurrent(characteristics.str.current);
	const tghB = bonusFromCurrent(characteristics.tgh.current);
	const wilB = bonusFromCurrent(characteristics.wil.current);

	const initiative = perB + agB;
	const woundsMax = strB + 2 * tghB + wilB;
	const criticalMax = tghB;

	const computedCurrent = useMemo(() => {
		const n = parseInt(data.current);
		return Number.isFinite(n) ? String(n) : '';
	}, [data.current]);

	const addCritical = () => {
		onChange({
			...data,
			critical: [...data.critical, { id: Date.now().toString(), location: '', effect: '' }],
		});
	};

	const removeCritical = (id: string) => {
		onChange({ ...data, critical: data.critical.filter((c) => c.id !== id) });
	};

	const updateCritical = (id: string, patch: Partial<{ location: string; effect: string }>) => {
		onChange({
			...data,
			critical: data.critical.map((c) => (c.id === id ? { ...c, ...patch } : c)),
		});
	};

	return (
		<div>
			{showTitle ? <h2 className='section-title'>🩸 WOUNDS</h2> : null}

			<div style={{ display: 'flex', gap: '18px', alignItems: 'stretch', flexWrap: 'wrap' }}>
				{/* INITIATIVE */}
				<div style={{ flex: '1 1 240px', minWidth: '240px' }}>
					<h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4f351e', marginBottom: '8px' }}>
						INITIATIVE
					</h3>
					<div style={{ fontSize: '0.75rem', color: '#846b44', marginBottom: '10px' }}>
						PERB + AGB
					</div>

					<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
						<div className='field-group' style={{ flex: 1 }}>
							<label className='field-label'>PERB</label>
							<input
								type='text'
								value={perB}
								readOnly
								className='text-input'
								style={{ textAlign: 'center', backgroundColor: '#e9dfcb', fontWeight: 'bold' }}
							/>
						</div>
						<div className='field-group' style={{ flex: 1 }}>
							<label className='field-label'>AGB</label>
							<input
								type='text'
								value={agB}
								readOnly
								className='text-input'
								style={{ textAlign: 'center', backgroundColor: '#e9dfcb', fontWeight: 'bold' }}
							/>
						</div>
						<div className='field-group' style={{ flex: 1 }}>
							<label className='field-label'>TOTAL</label>
							<input
								type='text'
								value={initiative}
								readOnly
								className='text-input'
								style={{ textAlign: 'center', backgroundColor: '#e9dfcb', fontWeight: 'bold' }}
							/>
						</div>
					</div>
				</div>

				{/* WOUNDS */}
				<div style={{ flex: '1 1 260px', minWidth: '260px' }}>
					<h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4f351e', marginBottom: '8px' }}>
						WOUNDS
					</h3>
					<div style={{ fontSize: '0.75rem', color: '#846b44', marginBottom: '10px' }}>
						STRB + (2 × T G H B) + WILB
					</div>

					<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
						<div className='field-group' style={{ flex: 1 }}>
							<label className='field-label'>CURRENT</label>
							<input
								type='text'
								value={computedCurrent}
								onChange={(e) => onChange({ ...data, current: e.target.value })}
								placeholder='0'
								className='text-input'
								style={{ textAlign: 'center' }}
							/>
						</div>
						<div className='field-group' style={{ flex: 1 }}>
							<label className='field-label'>MAXIMUM</label>
							<input
								type='text'
								value={woundsMax}
								readOnly
								className='text-input'
								style={{ textAlign: 'center', backgroundColor: '#e9dfcb', fontWeight: 'bold' }}
							/>
						</div>
					</div>

					<div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
						{[
							{ label: 'STRB', value: strB },
							{ label: 'TGH B', value: tghB },
							{ label: 'WILB', value: wilB },
						].map((b) => (
							<div key={b.label} style={{ fontSize: '0.75rem', color: '#846b44' }}>
								<b>{b.label}</b>: {b.value}
							</div>
						))}
					</div>
				</div>

				{/* CRITICAL WOUNDS */}
				<div style={{ flex: '2 1 420px', minWidth: '320px' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
						<div>
							<h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4f351e', marginBottom: '4px' }}>
								CRITICAL WOUNDS
							</h3>
							<div style={{ fontSize: '0.75rem', color: '#846b44' }}>Maximum = TGH B ({criticalMax})</div>
						</div>
						<button
							type='button'
							onClick={addCritical}
							disabled={data.critical.length >= criticalMax && criticalMax > 0}
							style={{
								background: '#5c3f28',
								border: 'none',
								borderRadius: '999px',
								padding: '6px 12px',
								color: '#fef0df',
								cursor:
									data.critical.length >= criticalMax && criticalMax > 0 ? 'not-allowed' : 'pointer',
								fontSize: '0.75rem',
								whiteSpace: 'nowrap',
								opacity: data.critical.length >= criticalMax && criticalMax > 0 ? 0.6 : 1,
							}}
						>
							+ Add Critical
						</button>
					</div>

					<div style={{ overflowX: 'auto', marginTop: '10px' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
							<thead>
								<tr style={{ backgroundColor: '#e9dfcb' }}>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
										LOCATION
									</th>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
										EFFECT
									</th>
									<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }} />
								</tr>
							</thead>
							<tbody>
								{data.critical.length === 0 ? (
									<tr>
										<td colSpan={3} style={{ padding: '12px', textAlign: 'center', color: '#846b44' }}>
											No critical wounds.
										</td>
									</tr>
								) : (
									data.critical.map((row) => (
										<tr key={row.id} style={{ borderBottom: '1px solid #e2cfaa' }}>
											<td style={{ padding: '8px', width: '180px' }}>
												<input
													type='text'
													value={row.location}
													onChange={(e) => updateCritical(row.id, { location: e.target.value })}
													placeholder='e.g., Arm, Head'
													className='text-input'
												/>
											</td>
											<td style={{ padding: '8px' }}>
												<textarea
													value={row.effect}
													onChange={(e) => updateCritical(row.id, { effect: e.target.value })}
													rows={2}
													placeholder='Describe the effect'
													className='textarea-input'
												/>
											</td>
											<td style={{ padding: '8px', textAlign: 'center', width: '60px' }}>
												<button
													type='button'
													onClick={() => removeCritical(row.id)}
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
			</div>
		</div>
	);
}

