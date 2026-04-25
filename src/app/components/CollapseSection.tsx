'use client';

import { useId, useState } from 'react';

export default function CollapseSection({
	title,
	defaultOpen = false,
	children,
}: {
	title: string;
	defaultOpen?: boolean;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(defaultOpen);
	const contentId = useId();

	return (
		<div className='form-section'>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: '12px',
					marginBottom: open ? '16px' : '0px',
				}}
			>
				<h2 className='section-title' style={{ marginBottom: 0 }}>
					{title}
				</h2>
				<button
					type='button'
					onClick={() => setOpen((v) => !v)}
					aria-expanded={open}
					aria-controls={contentId}
					style={{
						background: open ? '#a0522d' : '#5c3f28',
						border: 'none',
						borderRadius: '999px',
						padding: '6px 12px',
						color: 'white',
						cursor: 'pointer',
						fontSize: '0.75rem',
						whiteSpace: 'nowrap',
					}}
				>
					{open ? 'Collapse' : 'Expand'}
				</button>
			</div>

			<div id={contentId} style={{ display: open ? 'block' : 'none' }}>
				{children}
			</div>
		</div>
	);
}
