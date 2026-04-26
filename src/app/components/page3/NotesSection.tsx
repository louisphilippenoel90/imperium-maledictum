'use client';

export default function NotesSection({
	value,
	onChange,
	showTitle = true,
}: {
	value: string;
	onChange: (next: string) => void;
	showTitle?: boolean;
}) {
	return (
		<div>
			{showTitle ? <h2 className='section-title'>📝 NOTES</h2> : null}
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				rows={10}
				placeholder='Notes...'
				className='textarea-input'
				style={{ width: '100%' }}
			/>
		</div>
	);
}

