import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRecipes } from "../context/RecipesContext";
import { useFavorites } from "../hooks/useFavorites";
import { scaleAmount } from "../utils/scaleIngredient";
import Stars from "../components/Stars";
import FavoriteButton from "../components/FavoriteButton";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "./RecipeDetail.module.css";

export default function RecipeDetail() {
	const { slug } = useParams<{ slug: string }>();
	const { recipes, status } = useRecipes();
	const { isFavorite, toggleFavorite } = useFavorites();

	const recipe = recipes.find((r) => r.slug === slug);

	const [servings, setServings] = useState<number | null>(null);
	const [checkedSteps, setCheckedSteps] = useState<Set<number>>(() => new Set());

	const activeServings = servings ?? recipe?.servings ?? 1;

	const scaledIngredients = useMemo(() => {
		if (!recipe) return [];
		return recipe.ingredients.map((ing) => ({
			...ing,
			scaledAmount: scaleAmount(ing.amount, recipe.servings, activeServings),
		}));
	}, [recipe, activeServings]);

	function toggleStep(index: number) {
		setCheckedSteps((prev) => {
			const next = new Set(prev);
			if (next.has(index)) next.delete(index);
			else next.add(index);
			return next;
		});
	}

	if (status === "loading") return <LoadingSpinner />;
	if (status === "error") return <p role="alert">Rezepte konnten nicht geladen werden.</p>;
	if (!recipe) {
		return (
			<div>
				<p>Rezept nicht gefunden.</p>
				<Link to="/rezepte">Zurück zur Übersicht</Link>
			</div>
		);
	}

	return (
		<article className={styles.page}>
			<Link to="/rezepte" className={styles.back}>
				← Zurück zur Übersicht
			</Link>

			<div className={styles.hero}>
				<img src={recipe.image} alt={recipe.title} className={styles.image} />
				<div className={styles.heroInfo}>
					<span className={styles.category}>{recipe.category}</span>
					<h1>{recipe.title}</h1>
					<p>{recipe.description}</p>
					<div className={styles.metaRow}>
						<span>⏱ {recipe.cookTime} Min.</span>
						<Stars level={recipe.difficulty} />
						<FavoriteButton
							active={isFavorite(recipe.slug)}
							onToggle={() => toggleFavorite(recipe.slug)}
							label={recipe.title}
						/>
					</div>
				</div>
			</div>

			<div className={styles.content}>
				<section className={styles.ingredients} aria-labelledby="ingredients-heading">
					<h2 id="ingredients-heading">Zutaten</h2>

					<div className={styles.calculator}>
						<label htmlFor="servings">Portionen</label>
						<div className={styles.stepper}>
							<button
								type="button"
								onClick={() => setServings(Math.max(1, activeServings - 1))}
								aria-label="Weniger Portionen"
							>
								−
							</button>
							<input
								id="servings"
								type="number"
								min="1"
								max="50"
								value={activeServings}
								onChange={(e) => {
									const val = Number(e.target.value);
									if (Number.isFinite(val) && val > 0) setServings(val);
								}}
							/>
							<button
								type="button"
								onClick={() => setServings(activeServings + 1)}
								aria-label="Mehr Portionen"
							>
								+
							</button>
						</div>
					</div>

					<ul className={styles.ingredientList}>
						{scaledIngredients.map((ing) => (
							<li key={ing.name}>
								<span className={styles.amount}>
									{ing.scaledAmount} {ing.unit}
								</span>
								<span>{ing.name}</span>
							</li>
						))}
					</ul>
				</section>

				<section className={styles.steps} aria-labelledby="steps-heading">
					<h2 id="steps-heading">Kochmodus</h2>
					<p className={styles.hint}>Hake Schritte ab, während du kochst.</p>
					<ol className={styles.stepList}>
						{recipe.steps.map((step, index) => {
							const checked = checkedSteps.has(index);
							return (
								<li key={index} className={checked ? styles.done : undefined}>
									<label>
										<input
											type="checkbox"
											checked={checked}
											onChange={() => toggleStep(index)}
										/>
										<span>{step}</span>
									</label>
								</li>
							);
						})}
					</ol>
				</section>
			</div>
		</article>
	);
}
