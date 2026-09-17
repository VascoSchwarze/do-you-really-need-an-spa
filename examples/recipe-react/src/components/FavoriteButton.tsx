import styles from "./FavoriteButton.module.css";

type FavoriteButtonProps = {
	active: boolean;
	onToggle: () => void;
	label: string;
}

export default function FavoriteButton({ active, onToggle, label }: FavoriteButtonProps) {
	return (
		<button
			type="button"
			className={`${styles.button} ${active ? styles.active : ""}`}
			onClick={onToggle}
			aria-pressed={active}
			aria-label={active ? `${label} von Favoriten entfernen` : `${label} zu Favoriten hinzufügen`}
		>
			{active ? "♥" : "♡"}
		</button>
	);
}
