'use client';

import { GoalsInfluence } from '@/app/types/sheet';

interface GoalsInfluenceProps {
	data: GoalsInfluence;
	onChange: (next: GoalsInfluence) => void;
	showTitle?: boolean;
}

export default function GoalsInfluenceSection({
	data,
	onChange,
	showTitle = true,
}: GoalsInfluenceProps) {
	const update = (patch: Partial<GoalsInfluence>) => onChange({ ...data, ...patch });

	const handleAddInfluence = () => {
		update({
			influences: [
				...data.influences,
				{ id: Date.now().toString(), faction: '', influence: '', contacts: '' },
			],
		});
	};

	const handleRemoveInfluence = (id: string) => {
		update({ influences: data.influences.filter((r) => r.id !== id) });
	};

	const handleInfluenceChange = (
		id: string,
		field: 'faction' | 'influence' | 'contacts',
		value: string,
	) => {
		update({
			influences: data.influences.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
		});
	};

	const handleAddTalent = () => {
		update({ talents: [...data.talents, { id: Date.now().toString(), name: '', effects: '' }] });
	};

	const handleRemoveTalent = (id: string) => {
		update({ talents: data.talents.filter((r) => r.id !== id) });
	};

	const handleTalentChange = (id: string, field: 'name' | 'effects', value: string) => {
		update({ talents: data.talents.map((r) => (r.id === id ? { ...r, [field]: value } : r)) });
	};

	return (
		<div>
			{showTitle ? <h2 className='section-title'>🎯 GOALS & INFLUENCE</h2> : null}
			<div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
				{/* LEFT COLUMN */}
				<div style={{ flex: '1 1 320px', minWidth: '220px' }}>
					<div className='field-group' style={{ marginBottom: '14px' }}>
						<label className='field-label'>GOALS</label>
						<textarea
							value={data.goals}
							onChange={(e) => update({ goals: e.target.value })}
							rows={3}
							placeholder='Short / long term goals'
							className='textarea-input'
						/>
					</div>

					<div className='field-group' style={{ marginBottom: '14px' }}>
						<label className='field-label'>CONNECTIONS</label>
						<textarea
							value={data.connections}
							onChange={(e) => update({ connections: e.target.value })}
							rows={3}
							placeholder='Allies, contacts, ties...'
							className='textarea-input'
						/>
					</div>

					<div className='field-group' style={{ marginBottom: '14px' }}>
						<label className='field-label'>NOTES</label>
						<textarea
							value={data.notes}
							onChange={(e) => update({ notes: e.target.value })}
							rows={3}
							placeholder='Anything important'
							className='textarea-input'
						/>
					</div>

					<div className='field-group' style={{ marginBottom: '14px' }}>
						<label className='field-label'>DIVINATION</label>
						<textarea
							value={data.divination}
							onChange={(e) => update({ divination: e.target.value })}
							rows={2}
							placeholder='Portents, omens...'
							className='textarea-input'
						/>
					</div>

					<div className='grid-2cols' style={{ gap: '10px 14px' }}>
						<div className='field-group'>
							<label className='field-label'>SOLARS</label>
							<input
								type='text'
								value={data.solars}
								onChange={(e) => update({ solars: e.target.value })}
								placeholder='0'
								className='text-input'
							/>
						</div>
						<div className='field-group'>
							<label className='field-label'>OTHER CURRENCIES</label>
							<input
								type='text'
								value={data.otherCurrencies}
								onChange={(e) => update({ otherCurrencies: e.target.value })}
								placeholder='e.g., Thrones, scrip...'
								className='text-input'
							/>
						</div>
					</div>
				</div>

				{/* RIGHT COLUMN */}
				<div style={{ flex: '1 1 520px', minWidth: '340px' }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: '10px',
							marginBottom: '10px',
						}}
					>
						<h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4f351e' }}>INFLUENCE</h3>
						<button
							type='button'
							onClick={handleAddInfluence}
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

					<div style={{ overflowX: 'auto', marginBottom: '18px' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
							<thead>
								<tr style={{ backgroundColor: '#e9dfcb' }}>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'left',
										}}
									>
										FACTION
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'center',
										}}
									>
										INFL.
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'left',
										}}
									>
										CONTACTS
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'center',
										}}
									/>
								</tr>
							</thead>
							<tbody>
								{data.influences.length === 0 ? (
									<tr>
										<td
											colSpan={4}
											style={{ padding: '12px', textAlign: 'center', color: '#846b44' }}
										>
											No influences yet.
										</td>
									</tr>
								) : (
									data.influences.map((row) => (
										<tr key={row.id} style={{ borderBottom: '1px solid #e2cfaa' }}>
											<td style={{ padding: '8px' }}>
												<input
													type='text'
													value={row.faction}
													onChange={(e) => handleInfluenceChange(row.id, 'faction', e.target.value)}
													placeholder='Faction'
													className='text-input'
												/>
											</td>
											<td style={{ padding: '8px', textAlign: 'center' }}>
												<input
													type='text'
													value={row.influence}
													onChange={(e) =>
														handleInfluenceChange(row.id, 'influence', e.target.value)
													}
													placeholder='0'
													style={{ width: '90px', textAlign: 'center' }}
													className='text-input'
												/>
											</td>
											<td style={{ padding: '8px' }}>
												<textarea
													value={row.contacts}
													onChange={(e) =>
														handleInfluenceChange(row.id, 'contacts', e.target.value)
													}
													placeholder='Contacts'
													className='text-input'
												/>
											</td>
											<td style={{ padding: '8px', textAlign: 'center' }}>
												<button
													type='button'
													onClick={() => handleRemoveInfluence(row.id)}
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

					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: '10px',
							marginBottom: '10px',
						}}
					>
						<h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#4f351e' }}>TALENTS</h3>
						<button
							type='button'
							onClick={handleAddTalent}
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
							+ Add Talent
						</button>
					</div>

					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '520px' }}>
							<thead>
								<tr style={{ backgroundColor: '#e9dfcb' }}>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'left',
										}}
									>
										NAME
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'left',
										}}
									>
										EFFECTS
									</th>
									<th
										style={{
											padding: '10px',
											borderBottom: '2px solid #b58b4b',
											textAlign: 'center',
										}}
									/>
								</tr>
							</thead>
							<tbody>
								{data.talents.length === 0 ? (
									<tr>
										<td
											colSpan={3}
											style={{ padding: '12px', textAlign: 'center', color: '#846b44' }}
										>
											No talents yet.
										</td>
									</tr>
								) : (
									data.talents.map((row) => (
										<tr key={row.id} style={{ borderBottom: '1px solid #e2cfaa' }}>
											<td style={{ padding: '8px' }}>
												<input
													type='text'
													value={row.name}
													onChange={(e) => handleTalentChange(row.id, 'name', e.target.value)}
													placeholder='Talent'
													className='text-input'
												/>
											</td>
											<td style={{ padding: '8px' }}>
												<textarea
													value={row.effects}
													onChange={(e) => handleTalentChange(row.id, 'effects', e.target.value)}
													placeholder='Effect'
													className='text-input'
												/>
											</td>
											<td style={{ padding: '8px', textAlign: 'center' }}>
												<button
													type='button'
													onClick={() => handleRemoveTalent(row.id)}
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
			</div>
		</div>
	);
}
