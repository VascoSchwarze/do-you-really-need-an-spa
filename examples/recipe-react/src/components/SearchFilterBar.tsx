import styles from "./SearchFilterBar.module.css";

type SearchFilterBarProps = {
	query: string;
	onQueryChange: (value: string) => void;
	category: string;
	onCategoryChange: (value: string) => void;
	categories: string[];
}

export default function SearchFilterBar({
	query,
	onQueryChange,
	category,
	onCategoryChange,
	categories,
}: SearchFilterBarProps) {
	return (
		<div className={styles.bar}>
			<input
				type="search"
				className={styles.search}
				placeholder="Rezept suchen…"
				value={query}
				onChange={(e) => onQueryChange(e.target.value)}
				aria-label="Rezepte durchsuchen"
			/>
			<div className={styles.categories} role="group" aria-label="Nach Kategorie filtern">
				<button
					type="button"
					className={category === "" ? styles.activeChip : styles.chip}
					onClick={() => onCategoryChange("")}
				>
					Alle
				</button>
				{categories.map((c) => (
					<button
						key={c}
						type="button"
						className={category === c ? styles.activeChip : styles.chip}
						onClick={() => onCategoryChange(c)}
					>
						{c}
					</button>
				))}
			</div>
		</div>
	);
}
