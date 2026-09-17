import { Link } from "react-router-dom";
import Stars from "./Stars";
import FavoriteButton from "./FavoriteButton";
import { useFavorites } from "../hooks/useFavorites";
import type { Recipe } from "../types";
import styles from "./RecipeCard.module.css";

type RecipeCardProps = {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <article className={styles.card}>
      <Link to={`/rezepte/${recipe.slug}`} className={styles.imageLink}>
        <img src={recipe.image} alt={recipe.title} loading="lazy" className={styles.image} />
      </Link>
      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.category}>{recipe.category}</span>
          <FavoriteButton
            active={isFavorite(recipe.slug)}
            onToggle={() => toggleFavorite(recipe.slug)}
            label={recipe.title}
          />
        </div>
        <h3 className={styles.title}>
          <Link to={`/rezepte/${recipe.slug}`}>{recipe.title}</Link>
        </h3>
        <p className={styles.description}>{recipe.description}</p>
        <div className={styles.footer}>
          <span>{recipe.cookTime} Min.</span>
          <Stars level={recipe.difficulty} />
        </div>
      </div>
    </article>
  );
}
