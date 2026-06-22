/** Unbiased roll in [1, sides] using crypto.getRandomValues (rejection sampling). */
export function rollDie(sides: number): number {
	const max = Math.floor(0xffffffff / sides) * sides;
	const buf = new Uint32Array(1);
	let value: number;
	do {
		crypto.getRandomValues(buf);
		value = buf[0];
	} while (value >= max);
	return (value % sides) + 1;
}
