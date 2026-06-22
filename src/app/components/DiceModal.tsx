'use client';

import { useState, useEffect, useRef } from 'react';

const DICE_TYPES = [
	{ label: 'D-100', sides: 100 },
	{ label: 'D-6', sides: 6 },
	{ label: 'D-10', sides: 10 },
	{ label: 'D-20', sides: 20 },
] as const;

const ROLL_DURATION_MS = 1500;

interface DiceModalProps {
	open: boolean;
	onClose: () => void;
}

export default function DiceModal({ open, onClose }: DiceModalProps) {
	const [displayValue, setDisplayValue] = useState(1);
	const [rolling, setRolling] = useState(false);
	const [pulseGeneration, setPulseGeneration] = useState(0);
	const rollFrameRef = useRef<number | null>(null);
	const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearRollTimers = () => {
		if (rollFrameRef.current !== null) cancelAnimationFrame(rollFrameRef.current);
		if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
		rollFrameRef.current = null;
		rollTimeoutRef.current = null;
	};

	useEffect(() => {
		setDisplayValue(1);
		setRolling(false);
		setPulseGeneration(0);
		clearRollTimers();
	}, [open]);

	useEffect(() => () => clearRollTimers(), []);

	if (!open) return null;

	const roll = (sides: number) => {
		if (rolling) return;

		clearRollTimers();
		const finalResult = Math.floor(Math.random() * sides) + 1;
		setRolling(true);
		setPulseGeneration(0);

		const tick = () => {
			setDisplayValue(Math.floor(Math.random() * sides) + 1);
			rollFrameRef.current = requestAnimationFrame(tick);
		};

		rollFrameRef.current = requestAnimationFrame(tick);

		rollTimeoutRef.current = setTimeout(() => {
			clearRollTimers();
			setDisplayValue(finalResult);
			setRolling(false);
			setPulseGeneration((g) => g + 1);
		}, ROLL_DURATION_MS);
	};

	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 1000,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'rgba(0, 0, 0, 0.5)',
			}}
			onClick={onClose}
		>
			<div
				style={{
					background: '#fef7e6',
					padding: '32px',
					borderRadius: '16px',
					border: '1px solid #cfb87c',
					minWidth: '280px',
					textAlign: 'center',
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<h1 style={{ marginBottom: '24px', fontSize: '1.5rem', color: '#4f351e' }}>Dice</h1>

				<div
					key={pulseGeneration}
					className={[
						'dice-result-square',
						rolling ? 'dice-result-square--rolling' : '',
						!rolling && pulseGeneration > 0 ? 'dice-result-square--pulse' : '',
					]
						.filter(Boolean)
						.join(' ')}
				>
					{displayValue}
				</div>

				<div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
					{DICE_TYPES.map(({ label, sides }) => (
						<button
							key={label}
							type='button'
							disabled={rolling}
							onClick={() => roll(sides)}
							style={{
								background: '#5c3f28',
								border: '1px solid #cfb87c',
								borderRadius: '999px',
								padding: '10px 18px',
								color: '#fef0df',
								cursor: rolling ? 'not-allowed' : 'pointer',
								fontSize: '0.85rem',
								fontWeight: 700,
								opacity: rolling ? 0.5 : 1,
							}}
						>
							{label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
