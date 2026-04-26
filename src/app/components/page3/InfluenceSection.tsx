'use client';

import { PatronInfluenceRow } from '@/app/types/sheet';

export default function InfluenceSection({
	influences,
	onChange,
	showTitle = true,
}: {
	influences: PatronInfluenceRow[];
	onChange: (next: PatronInfluenceRow[]) => void;
	showTitle?: boolean;
}) {
	const addRow = () => {
		onChange([
			...influences,
			{ id: Date.now().toString(), faction: '', infl: '', contact: '', intel: '' },
		]);
	};

	const removeRow = (id: string) => onChange(influences.filter((r) => r.id !== id));

	const updateRow = (id: string, patch: Partial<PatronInfluenceRow>) =>
		onChange(influences.map((r) => (r.id === id ? { ...r, ...patch } : r)));

	return (
		<div>
			{showTitle ? <h2 className='section-title'>🤝 INFLUENCE</h2> : null}

			<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
				<button
					type='button'
					onClick={addRow}
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
					+ Add Influence
				</button>
			</div>

			<div style={{ overflowX: 'auto' }}>
				<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
					<thead>
						<tr style={{ backgroundColor: '#e9dfcb' }}>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								FACTION
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }}>
								INFL
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								CONTACT
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'left' }}>
								INTEL
							</th>
							<th style={{ padding: '10px', borderBottom: '2px solid #b58b4b', textAlign: 'center' }} />
						</tr>
					</thead>
					<tbody>
						{influences.length === 0 ? (
							<tr>
								<td colSpan={5} style={{ padding: '12px', textAlign: 'center', color: '#846b44' }}>
									No influences yet.
								</td>
							</tr>
						) : (
							influences.map((r) => (
								<tr key={r.id} style={{ borderBottom: '1px solid #e2cfaa' }}>
									<td style={{ padding: '8px', width: '220px' }}>
										<input
											type='text'
											value={r.faction}
											onChange={(e) => updateRow(r.id, { faction: e.target.value })}
											className='text-input'
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '90px' }}>
										<input
											type='text'
											value={r.infl}
											onChange={(e) => updateRow(r.id, { infl: e.target.value })}
											className='text-input'
											style={{ width: '80px', textAlign: 'center' }}
										/>
									</td>
									<td style={{ padding: '8px', width: '240px' }}>
										<input
											type='text'
											value={r.contact}
											onChange={(e) => updateRow(r.id, { contact: e.target.value })}
											className='text-input'
										/>
									</td>
									<td style={{ padding: '8px', width: '260px' }}>
										<input
											type='text'
											value={r.intel}
											onChange={(e) => updateRow(r.id, { intel: e.target.value })}
											className='text-input'
										/>
									</td>
									<td style={{ padding: '8px', textAlign: 'center', width: '60px' }}>
										<button
											type='button'
											onClick={() => removeRow(r.id)}
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

