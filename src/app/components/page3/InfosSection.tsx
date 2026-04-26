'use client';

import { PatronInfo } from '@/app/types/sheet';

export default function InfosSection({
	data,
	onChange,
	showTitle = true,
}: {
	data: PatronInfo;
	onChange: (next: PatronInfo) => void;
	showTitle?: boolean;
}) {
	const update = (patch: Partial<PatronInfo>) => onChange({ ...data, ...patch });

	return (
		<div>
			{showTitle ? <h2 className='section-title'>📌 INFOS</h2> : null}

			<div className='grid-2cols'>
				<div className='field-group'>
					<label className='field-label'>PATRON NAME</label>
					<input
						type='text'
						value={data.patronName}
						onChange={(e) => update({ patronName: e.target.value })}
						className='text-input'
					/>
				</div>
				<div className='field-group'>
					<label className='field-label'>FACTION</label>
					<input
						type='text'
						value={data.faction}
						onChange={(e) => update({ faction: e.target.value })}
						className='text-input'
					/>
				</div>
				<div className='field-group'>
					<label className='field-label'>PAY GRADE</label>
					<input
						type='text'
						value={data.payGrade}
						onChange={(e) => update({ payGrade: e.target.value })}
						className='text-input'
					/>
				</div>
				<div className='field-group'>
					<label className='field-label'>MOTIVATION</label>
					<input
						type='text'
						value={data.motivation}
						onChange={(e) => update({ motivation: e.target.value })}
						className='text-input'
					/>
				</div>
			</div>

			<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '14px' }}>
				<div className='field-group' style={{ flex: '1 1 360px', minWidth: '260px' }}>
					<label className='field-label'>DUTY</label>
					<textarea
						value={data.duty}
						onChange={(e) => update({ duty: e.target.value })}
						rows={3}
						className='textarea-input'
					/>
				</div>
				<div className='field-group' style={{ flex: '1 1 360px', minWidth: '260px' }}>
					<label className='field-label'>DEMEANOUR</label>
					<textarea
						value={data.demeanour}
						onChange={(e) => update({ demeanour: e.target.value })}
						rows={3}
						className='textarea-input'
					/>
				</div>
			</div>
		</div>
	);
}

