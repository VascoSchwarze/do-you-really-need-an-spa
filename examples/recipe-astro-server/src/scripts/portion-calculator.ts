function scaleAmount(amount: number, baseServings: number, targetServings: number): string {
	const scaled = (amount * targetServings) / baseServings;
	const rounded = Math.round(scaled * 100) / 100;
	if (Number.isInteger(rounded)) return String(rounded);
	return rounded.toFixed(rounded < 10 ? 2 : 1).replace(/\.?0+$/, "");
}

function initPortionCalculator(root: HTMLElement) {
	const baseServings = Number(root.dataset.baseServings ?? "1");
	const input = root.querySelector<HTMLInputElement>("[data-servings-input]");
	const decrement = root.querySelector<HTMLButtonElement>("[data-decrement]");
	const increment = root.querySelector<HTMLButtonElement>("[data-increment]");
	const amounts = [...root.querySelectorAll<HTMLElement>("[data-amount]")];
	if (!input) return;

	const render = (servings: number) => {
		input.value = String(servings);
		for (const el of amounts) {
			const baseAmount = Number(el.dataset.amount);
			const unit = el.dataset.unit ?? "";
			el.textContent = `${scaleAmount(baseAmount, baseServings, servings)} ${unit}`.trim();
		}
	};

	const currentServings = () => Math.max(1, Number(input.value) || baseServings);

	decrement?.addEventListener("click", () => render(Math.max(1, currentServings() - 1)));
	increment?.addEventListener("click", () => render(currentServings() + 1));
	input.addEventListener("input", () => {
		const val = Number(input.value);
		if (Number.isFinite(val) && val > 0) render(val);
	});
}

document.querySelectorAll<HTMLElement>(".portion-calculator").forEach(initPortionCalculator);
