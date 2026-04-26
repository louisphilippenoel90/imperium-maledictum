'use client';

import { useMemo } from 'react';
import { EquipmentData } from '@/app/types/sheet';
import { useCharacterStats } from '@/app/context/CharacterStatsContext';

interface EquipmentSectionProps {
	data: EquipmentData;
	onChange: (next: EquipmentData) => void;
	showTitle?: boolean;
}

const bonusFromCurrent = (value: string): number => {
	const n = parseInt(value) || 0;
	return Math.floor(n / 10);
};

export default function EquipmentSection({
	data,
	onChange,
	showTitle = true,
}: EquipmentSectionProps) {
	const { characteristics } = useCharacterStats();

	const strB = bonusFromCurrent(characteristics.str.current);
	const tghB = bonusFromCurrent(characteristics.tgh.current);
	const encMax = useMemo(() => strB + tghB, [strB, tghB]);

	const addItem = () => {
		onChange({
			...data,
			items: [{ id: Date.now().toString(), equipment: '', combatNotes: '' }, ...data.items],
		});
	};

	const removeItem = (id: string) => {
		onChange({ ...data, items: data.items.filter((i) => i.id !== id) });
	};

	const updateItem = (id: string, patch: Partial<(typeof data.items)[number]>) => {
		onChange({
			...data,
			items: data.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
		});
	};

	return (
		<div>
			{showTitle ? <h2 className='section-title'>🎒 EQUIPMENT</h2> : null}

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					gap: '10px',
					marginBottom: '10px',
				}}
			>
				<div style={{ color: '#846b44', fontSize: '0.8rem', fontStyle: 'italic' }}>
					Add items; each row has Equipment + Combat Notes.
				</div>
				<button
					type='button'
					onClick={addItem}
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
					+ Add Equipment
				</button>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
				{data.items.length === 0 ? (
					<div
						style={{ textAlign: 'center', padding: '14px', color: '#846b44', fontStyle: 'italic' }}
					>
						No equipment yet.
					</div>
				) : (
					data.items.map((item) => (
						<div
							key={item.id}
							style={{
								border: '1px solid #e2cfaa',
								borderRadius: '14px',
								background: '#fff9ef',
								padding: '12px',
							}}
						>
							<div
								style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}
							>
								<div style={{ flex: '1 1 360px', minWidth: '260px' }}>
									<label className='field-label'>EQUIPMENT</label>
									<textarea
										value={item.equipment}
										onChange={(e) => updateItem(item.id, { equipment: e.target.value })}
										rows={3}
										placeholder='Equipment...'
										className='textarea-input'
									/>
								</div>
								<div style={{ flex: '1 1 360px', minWidth: '260px' }}>
									<label className='field-label'>COMBAT NOTES</label>
									<textarea
										value={item.combatNotes}
										onChange={(e) => updateItem(item.id, { combatNotes: e.target.value })}
										rows={3}
										placeholder='Combat notes...'
										className='textarea-input'
									/>
								</div>
								<div style={{ flex: '0 0 auto', paddingTop: '18px' }}>
									<button
										type='button'
										onClick={() => removeItem(item.id)}
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

			<div style={{ marginTop: '16px' }}>
				<h3
					style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4f351e', marginBottom: '10px' }}
				>
					ENCUMBRANCE
				</h3>
				<div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
					<div className='field-group' style={{ width: '140px' }}>
						<label className='field-label'>CURRENT</label>
						<input
							type='text'
							value={data.encumbranceCurrent}
							onChange={(e) => onChange({ ...data, encumbranceCurrent: e.target.value })}
							placeholder='0'
							className='text-input'
							style={{ textAlign: 'center' }}
						/>
					</div>
					<div className='field-group' style={{ width: '140px' }}>
						<label className='field-label'>MAXIMUM</label>
						<input
							type='text'
							value={encMax}
							readOnly
							className='text-input'
							style={{ textAlign: 'center', backgroundColor: '#e9dfcb', fontWeight: 'bold' }}
						/>
					</div>
					<div style={{ fontSize: '0.75rem', color: '#846b44' }}>
						Max = STRB ({strB}) + TGH B ({tghB})
					</div>
				</div>
			</div>
		</div>
	);
}
