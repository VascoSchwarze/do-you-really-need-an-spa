import { Link } from "react-router-dom";
import { useRecipes } from "../context/RecipesContext";
import RecipeCard from "../components/RecipeCard";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "./Home.module.css";

export default function Home() {
	const { recipes, status } = useRecipes();
	const featured = recipes.filter((r) => r.featured);

	return (
		<div>
			<section className={styles.hero}>
				<h1>Kochen ohne Kompromisse</h1>
				<p>
					Eine Vielzahl durchdachter Rezepte, live berechnete Portionen und ein Kochmodus, der dich
					Schritt für Schritt begleitet.
				</p>
				<Link to="/rezepte" className={styles.cta}>
					Alle Rezepte entdecken
				</Link>
			</section>

			<section className={styles.featured}>
				<h2>Ausgewählte Rezepte</h2>
				{status === "loading" && <LoadingSpinner />}
				{status === "error" && <p role="alert">Rezepte konnten nicht geladen werden.</p>}
				{status === "ready" && (
					<div className={styles.grid}>
						{featured.map((recipe) => (
							<RecipeCard key={recipe.slug} recipe={recipe} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}
