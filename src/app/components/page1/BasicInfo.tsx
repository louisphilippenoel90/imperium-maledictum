'use client';

import { BasicInfo, Characteristics, Characteristic } from '@/app/types/sheet';

interface BasicInfoProps {
	basic: BasicInfo;
	characteristics: Characteristics;
	onBasicChange: (field: keyof BasicInfo, value: string) => void;
	onCharacteristicChange: (
		charKey: keyof Characteristics,
		field: keyof Characteristic,
		value: string,
	) => void;
	showTitle?: boolean;
}

export default function BasicInfoSection({
	basic,
	characteristics,
	onBasicChange,
	onCharacteristicChange,
	showTitle = true,
}: BasicInfoProps) {
	const basicFields: { label: string; id: keyof BasicInfo; placeholder: string }[] = [
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

	const characteristicKeys: { key: keyof Characteristics; label: string }[] = [
		{ key: 'ws', label: 'WS' },
		{ key: 'bs', label: 'BS' },
		{ key: 'str', label: 'STR' },
		{ key: 'tgh', label: 'TGH' },
		{ key: 'ag', label: 'AG' },
		{ key: 'int', label: 'INT' },
		{ key: 'per', label: 'PER' },
		{ key: 'wil', label: 'WIL' },
		{ key: 'fel', label: 'FEL' },
	];

	const calculateCurrent = (starting: string, advances: string): string => {
		const startNum = parseInt(starting) || 0;
		const advNum = parseInt(advances) || 0;
		return (startNum + advNum).toString();
	};

	// Guard against undefined characteristics
	const getCharacteristic = (key: keyof Characteristics) => {
		return characteristics?.[key] || { starting: '', advances: '', current: '0' };
	};

	const handleStartingChange = (charKey: keyof Characteristics, value: string) => {
		onCharacteristicChange(charKey, 'starting', value);
		const advances = getCharacteristic(charKey).advances;
		const current = calculateCurrent(value, advances);
		onCharacteristicChange(charKey, 'current', current);
	};

	const handleAdvancesChange = (charKey: keyof Characteristics, value: string) => {
		onCharacteristicChange(charKey, 'advances', value);
		const starting = getCharacteristic(charKey).starting;
		const current = calculateCurrent(starting, value);
		onCharacteristicChange(charKey, 'current', current);
	};

	return (
		<div>
			{showTitle ? <h2 className='section-title'>📜 ORIGIN & IDENTITY</h2> : null}
			<div className='grid-2cols'>
				{basicFields.map((field) => (
					<div key={field.id} className='field-group'>
						<label className='field-label'>{field.label}</label>
						<input
							type='text'
							value={basic[field.id]}
							onChange={(e) => onBasicChange(field.id, e.target.value)}
							placeholder={field.placeholder}
							className='text-input'
						/>
					</div>
				))}
			</div>

			{/* XP Section */}
			<div className='grid-2cols mt-4'>
				<div className='field-group'>
					<label className='field-label'>CURRENT XP</label>
					<input
						type='text'
						value={basic.currentXp}
						onChange={(e) => onBasicChange('currentXp', e.target.value)}
						placeholder='0'
						className='text-input'
					/>
				</div>
				<div className='field-group'>
					<label className='field-label'>SPENT XP</label>
					<input
						type='text'
						value={basic.spentXp}
						onChange={(e) => onBasicChange('spentXp', e.target.value)}
						placeholder='0'
						className='text-input'
					/>
				</div>
			</div>

			{/* CHARACTERISTICS TABLE - Horizontal layout: characteristics as columns */}
			<div className='mt-4'>
				<h3 className='section-title' style={{ fontSize: '1.2rem', marginTop: '8px' }}>
					⚔️ CHARACTERISTICS
				</h3>
				<div className='characteristics-table' style={{ overflowX: 'auto' }}>
					<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
						<thead>
							<tr>
								<th
									style={{
										padding: '10px',
										borderBottom: '2px solid #b58b4b',
										textAlign: 'left',
										minWidth: '100px',
									}}
								></th>
								{characteristicKeys.map((char, index) => (
									<th
										key={char.key}
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'center',
											fontWeight: 'bold',
										}}
									>
										{char.label}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{/* STARTING row */}
							<tr>
								<td
									style={{
										padding: '8px',
										borderBottom: '1px solid #e2cfaa',
										fontWeight: 'bold',
										backgroundColor: '#f5efdf',
									}}
								>
									STARTING
								</td>
								{characteristicKeys.map((char, index) => (
									<td
										key={char.key}
										style={{
											padding: '8px',
											borderBottom: '1px solid #e2cfaa',
											textAlign: 'center',
											backgroundColor: index % 2 === 0 ? '#e9dfcb' : '#f5efdf',
										}}
									>
										<input
											type='text'
											value={characteristics[char.key].starting}
											onChange={(e) => handleStartingChange(char.key, e.target.value)}
											placeholder='0'
											style={{ width: '70px', textAlign: 'center' }}
											className='text-input'
										/>
									</td>
								))}
							</tr>
							{/* ADVANCES row */}
							<tr>
								<td
									style={{
										padding: '8px',
										borderBottom: '1px solid #e2cfaa',
										fontWeight: 'bold',
										backgroundColor: '#f5efdf',
									}}
								>
									ADVANCES
								</td>
								{characteristicKeys.map((char, index) => (
									<td
										key={char.key}
										style={{
											padding: '8px',
											borderBottom: '1px solid #e2cfaa',
											textAlign: 'center',
											backgroundColor: index % 2 === 0 ? '#e9dfcb' : '#f5efdf',
										}}
									>
										<input
											type='text'
											value={characteristics[char.key].advances}
											onChange={(e) => handleAdvancesChange(char.key, e.target.value)}
											placeholder='0'
											style={{ width: '70px', textAlign: 'center' }}
											className='text-input'
										/>
									</td>
								))}
							</tr>
							{/* CURRENT row (calculated, read-only) */}
							<tr>
								<td
									style={{
										padding: '8px',
										borderBottom: '1px solid #e2cfaa',
										fontWeight: 'bold',
										backgroundColor: '#f5efdf',
									}}
								>
									CURRENT
								</td>
								{characteristicKeys.map((char, index) => (
									<td
										key={char.key}
										style={{
											padding: '8px',
											borderBottom: '1px solid #e2cfaa',
											textAlign: 'center',
											backgroundColor: index % 2 === 0 ? '#e9dfcb' : '#f5efdf',
										}}
									>
										<input
											type='text'
											value={characteristics[char.key].current}
											readOnly
											style={{
												width: '70px',
												textAlign: 'center',
												backgroundColor: '#e9dfcb',
												fontWeight: 'bold',
											}}
											className='text-input'
										/>
									</td>
								))}
							</tr>
						</tbody>
					</table>
				</div>
				<div
					style={{ fontSize: '0.7rem', color: '#846b44', marginTop: '8px', fontStyle: 'italic' }}
				>
					※ CURRENT = STARTING + ADVANCES (auto-calculated)
				</div>
			</div>
		</div>
	);
}
