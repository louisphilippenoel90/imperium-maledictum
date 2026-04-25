'use client';

import { GoalsInfluence } from '@/app/types/sheet';

interface GoalsInfluenceProps {
	data: GoalsInfluence;
	onChange: (field: keyof GoalsInfluence, value: string) => void;
	showTitle?: boolean;
}

export default function GoalsInfluenceSection({ data, onChange, showTitle = true }: GoalsInfluenceProps) {
	return (
		<div>
			{showTitle ? <h2 className='section-title'>🎯 GOALS & INFLUENCE</h2> : null}
			<div className='field-group mb-4'>
				<label className='field-label'>GOALS (short / long term)</label>
				<textarea
					value={data.goals}
					onChange={(e) => onChange('goals', e.target.value)}
					rows={3}
					placeholder='What does the character strive for?'
					className='textarea-input'
				/>
			</div>
			<div className='grid-2cols'>
				<div className='field-group'>
					<label className='field-label'>FACTION INFLUENCE</label>
					<input
						type='text'
						value={data.factionInfluence}
						onChange={(e) => onChange('factionInfluence', e.target.value)}
						placeholder='e.g., 12, Respected'
						className='text-input'
					/>
				</div>
				<div className='field-group'>
					<label className='field-label'>CONTACTS</label>
					<input
						type='text'
						value={data.contacts}
						onChange={(e) => onChange('contacts', e.target.value)}
						placeholder='Key allies, informants'
						className='text-input'
					/>
				</div>
			</div>
		</div>
	);
}
