'use client';

import { BasicInfo } from '@/app/types/sheet';

interface BasicInfoProps {
	data: BasicInfo;
	onChange: (field: keyof BasicInfo, value: string) => void;
}

export default function BasicInfoSection({ data, onChange }: BasicInfoProps) {
	const fields: { label: string; id: keyof BasicInfo; placeholder: string }[] = [
		{ label: 'ORIGIN', id: 'origin', placeholder: 'Homeworld / Forge World' },
		{ label: 'FACTION', id: 'faction', placeholder: 'Astra Militarum, Inquisition' },
		{ label: 'ROLE', id: 'role', placeholder: 'Class / Specialty' },
		{ label: 'PATRON', id: 'patron', placeholder: 'Lord, Magos, Inquisitor' },
		{ label: 'AGE', id: 'age', placeholder: 'Years / cycle' },
		{ label: 'EYES', id: 'eyes', placeholder: 'Color' },
		{ label: 'HAIR', id: 'hair', placeholder: 'Color / style' },
		{ label: 'HEIGHT', id: 'height', placeholder: 'meters / feet' },
		{ label: 'WEIGHT', id: 'weight', placeholder: 'kg / lbs' },
		{ label: 'HANDEDNESS', id: 'handedness', placeholder: 'Left / Right' },
		{ label: 'CHARACTER NAME', id: 'characterName', placeholder: 'Name' },
		{
			label: 'DISTINGUISHING FEATURES',
			id: 'distinguishingFeatures',
			placeholder: 'Scars, tattoos',
		},
	];

	return (
		<div className='form-section'>
			<h2 className='section-title'>📜 ORIGIN & IDENTITY</h2>
			<div className='grid-2cols'>
				{fields.map((field) => (
					<div key={field.id} className='field-group'>
						<label className='field-label'>{field.label}</label>
						<input
							type='text'
							value={data[field.id]}
							onChange={(e) => onChange(field.id, e.target.value)}
							placeholder={field.placeholder}
							className='text-input'
						/>
					</div>
				))}
			</div>
			<div className='grid-2cols mt-4'>
				<div className='field-group'>
					<label className='field-label'>CURRENT XP</label>
					<input
						type='text'
						value={data.currentXp}
						onChange={(e) => onChange('currentXp', e.target.value)}
						placeholder='0'
						className='text-input'
					/>
				</div>
				<div className='field-group'>
					<label className='field-label'>SPENT XP</label>
					<input
						type='text'
						value={data.spentXp}
						onChange={(e) => onChange('spentXp', e.target.value)}
						placeholder='0'
						className='text-input'
					/>
				</div>
			</div>
			<div className='field-group mt-4'>
				<label className='field-label'>CHARACTERISTICS (notable)</label>
				<input
					type='text'
					value={data.characteristicsRaw}
					onChange={(e) => onChange('characteristicsRaw', e.target.value)}
					placeholder='e.g., WS 35, BS 40, S 32...'
					className='text-input'
				/>
			</div>
		</div>
	);
}
