export function scaleAmount(amount: number, baseServings: number, targetServings: number): number | string {
	const scaled = (amount * targetServings) / baseServings;
	const rounded = Math.round(scaled * 100) / 100;
	return Number.isInteger(rounded) ? rounded : rounded.toFixed(rounded < 10 ? 2 : 1).replace(/\.?0+$/, "");
}
