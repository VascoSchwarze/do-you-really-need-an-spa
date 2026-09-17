import styles from "./LoadingSpinner.module.css";

type LoadingSpinnerProps = {
  label?: string;
}

export default function LoadingSpinner({ label = "Rezepte werden geladen…" }: LoadingSpinnerProps) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
