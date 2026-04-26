'use client';

import { PatronBoonRow } from '@/app/types/sheet';

export default function BoonsSection({
	boons,
	onChange,
	showTitle = true,
}: {
	boons: PatronBoonRow[];
	onChange: (next: PatronBoonRow[]) => void;
	showTitle?: boolean;
}) {
	const addBoon = () => {
		onChange([...boons, { id: Date.now().toString(), name: '', liabilities: '' }]);
	};

	const removeBoon = (id: string) => onChange(boons.filter((b) => b.id !== id));

	const updateBoon = (id: string, patch: Partial<PatronBoonRow>) =>
		onChange(boons.map((b) => (b.id === id ? { ...b, ...patch } : b)));

	return (
		<div>
			{showTitle ? <h2 className='section-title'>✨ BOONS</h2> : null}

			<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
				<button
					type='button'
					onClick={addBoon}
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
					+ Add Boon
				</button>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				{boons.length === 0 ? (
					<div style={{ textAlign: 'center', padding: '14px', color: '#846b44', fontStyle: 'italic' }}>
						No boons yet.
					</div>
				) : (
					boons.map((b) => (
						<div
							key={b.id}
							style={{
								border: '1px solid #e2cfaa',
								borderRadius: '14px',
								background: '#fff9ef',
								padding: '12px',
							}}
						>
							<div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
								<div className='field-group' style={{ flex: '0 0 260px', minWidth: '220px' }}>
									<label className='field-label'>BOON NAME</label>
									<input
										type='text'
										value={b.name}
										onChange={(e) => updateBoon(b.id, { name: e.target.value })}
										className='text-input'
									/>
								</div>
								<div className='field-group' style={{ flex: '1 1 360px', minWidth: '260px' }}>
									<label className='field-label'>LIABILITIES</label>
									<textarea
										value={b.liabilities}
										onChange={(e) => updateBoon(b.id, { liabilities: e.target.value })}
										rows={3}
										className='textarea-input'
									/>
								</div>
								<div style={{ flex: '0 0 auto', paddingTop: '18px' }}>
									<button
										type='button'
										onClick={() => removeBoon(b.id)}
										style={{
											background: '#a0522d',
											border: 'none',
											borderRadius: '999px',
											padding: '6px 12px',
											color: 'white',
											cursor: 'pointer',
											fontSize: '0.75rem',
										}}
									>
										✕ Remove
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

