'use client';

import { FateCorruption } from '@/app/types/sheet';

interface FateCorruptionProps {
	data: FateCorruption;
	onChange: (field: keyof FateCorruption, value: string) => void;
}

export default function FateCorruptionSection({ data, onChange }: FateCorruptionProps) {
	return (
		<div className='form-section'>
			<h2 className='section-title'>🔥 FATE & CORRUPTION</h2>
			<div className='grid-2cols'>
				<div className='field-group'>
					<label className='field-label'>FATE — CURRENT</label>
					<input
						type='text'
						value={data.fateCurrent}
						onChange={(e) => onChange('fateCurrent', e.target.value)}
						placeholder='Current Fate'
						className='text-input'
					/>
				</div>
				<div className='field-group'>
					<label className='field-label'>FATE — TOTAL</label>
					<input
						type='text'
						value={data.fateTotal}
						onChange={(e) => onChange('fateTotal', e.target.value)}
						placeholder='Max Fate'
						className='text-input'
					/>
				</div>
				<div className='field-group'>
					<label className='field-label'>CORRUPTION — CURRENT</label>
					<input
						type='text'
						value={data.corruptionCurrent}
						onChange={(e) => onChange('corruptionCurrent', e.target.value)}
						placeholder='Current corruption'
						className='text-input'
					/>
				</div>
				<div className='field-group'>
					<label className='field-label'>CORRUPTION — TOTAL</label>
					<input
						type='text'
						value={data.corruptionTotal}
						onChange={(e) => onChange('corruptionTotal', e.target.value)}
						placeholder='Threshold'
						className='text-input'
					/>
				</div>
			</div>
			<div className='field-group mt-4'>
				<label className='field-label'>MUTATIONS & MALIGNANCIES</label>
				<textarea
					value={data.mutationsMalignancies}
					onChange={(e) => onChange('mutationsMalignancies', e.target.value)}
					rows={2}
					placeholder='List any mutations, mental afflictions...'
					className='textarea-input'
				/>
			</div>
		</div>
	);
}
