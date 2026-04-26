'use client';

interface ActionButtonsProps {
	onExport: () => void;
	onImport: (file: File) => void;
	onReset: () => void;
}

export default function ActionButtons({ onExport, onImport, onReset }: ActionButtonsProps) {
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) onImport(file);
		e.target.value = '';
	};

	return (
		<div className='button-bar'>
			<button onClick={onExport} className='btn-primary'>
				📎 EXPORT
			</button>
			<label className='file-label'>
				📂 IMPORT
				<input type='file' accept='.json' onChange={handleFileUpload} className='hidden' />
			</label>
			<button onClick={onReset} className='btn-secondary'>
				♻️ RESET ALL
			</button>
		</div>
	);
}
