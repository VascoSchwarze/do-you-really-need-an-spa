function initSearchFilter(root: HTMLElement) {
	const input = root.querySelector<HTMLInputElement>("[data-search-input]");
	const chips = [...root.querySelectorAll<HTMLButtonElement>("[data-category-chip]")];
	const results = root.querySelector<HTMLElement>("[data-results]");
	const countEl = root.querySelector<HTMLElement>("[data-count]");
	const emptyEl = root.querySelector<HTMLElement>("[data-empty]");
	if (!input || !results) return;

	const cards = [...results.children] as HTMLElement[];
	let activeCategory = "";

	const labels = {
		one: root.dataset.countOne ?? "recipe",
		many: root.dataset.countMany ?? "recipes",
	};

	function applyFilter() {
		const query = input!.value.trim().toLowerCase();
		let visibleCount = 0;

		for (const card of cards) {
			const title = (card.dataset.title ?? "").toLowerCase();
			const category = card.dataset.category ?? "";
			const matchesQuery = query === "" || title.includes(query);
			const matchesCategory = activeCategory === "" || category === activeCategory;
			const visible = matchesQuery && matchesCategory;
			card.hidden = !visible;
			if (visible) visibleCount++;
		}

		if (countEl) countEl.textContent = `${visibleCount} ${visibleCount === 1 ? labels.one : labels.many}`;
		if (emptyEl) emptyEl.hidden = visibleCount !== 0;
	}

	input.addEventListener("input", applyFilter);

	for (const chip of chips) {
		chip.addEventListener("click", () => {
			activeCategory = chip.dataset.categoryChip ?? "";
			for (const c of chips) c.classList.toggle("is-active", c === chip);
			applyFilter();
		});
	}

	applyFilter();
}

document.querySelectorAll<HTMLElement>(".search-filter").forEach(initSearchFilter);
