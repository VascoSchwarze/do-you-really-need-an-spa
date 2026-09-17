import { useMemo, useState } from "react";
import { useRecipes } from "../context/RecipesContext";
import RecipeCard from "../components/RecipeCard";
import SearchFilterBar from "../components/SearchFilterBar";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "./Recipes.module.css";

export default function Recipes() {
	const { recipes, status } = useRecipes();
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("");

	const categories = useMemo(() => [...new Set(recipes.map((r) => r.category))].sort(), [recipes]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		return recipes.filter((r) => {
			const matchesQuery = q === "" || r.title.toLowerCase().includes(q);
			const matchesCategory = category === "" || r.category === category;
			return matchesQuery && matchesCategory;
		});
	}, [recipes, query, category]);

	return (
		<div className={styles.page}>
			<h1>Alle Rezepte</h1>
			<SearchFilterBar
				query={query}
				onQueryChange={setQuery}
				category={category}
				onCategoryChange={setCategory}
				categories={categories}
			/>

			{status === "loading" && <LoadingSpinner />}
			{status === "error" && <p role="alert">Rezepte konnten nicht geladen werden.</p>}
			{status === "ready" && (
				<>
					<p className={styles.count}>
						{filtered.length} {filtered.length === 1 ? "Rezept" : "Rezepte"}
					</p>
					<div className={styles.grid}>
						{filtered.map((recipe) => (
							<RecipeCard key={recipe.slug} recipe={recipe} />
						))}
					</div>
					{filtered.length === 0 && <p>Keine Rezepte gefunden.</p>}
				</>
			)}
		</div>
	);
}
