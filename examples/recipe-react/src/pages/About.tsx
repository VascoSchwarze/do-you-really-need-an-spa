import styles from "./About.module.css";

export default function About() {
  return (
    <div className={styles.page}>
      <h1>Über uns</h1>
      <p>
        Rezeptbuch ist ein Demo-Projekt, das im Rahmen eines Konferenzvortrags entstanden ist. Es
        vergleicht zwei technische Ansätze für dieselbe kleine Rezepte-App: eine klassische React
        Single Page Application (dieses Projekt) und eine Astro-App mit Islands-Architektur.
      </p>
      <p>
        Beide Varianten bieten identische Inhalte und Funktionen: Rezeptsuche, Portionsrechner,
        Favoriten und einen Kochmodus. Der Unterschied liegt ausschließlich darin, wie viel
        JavaScript zum Anzeigen und Bedienen der Seite notwendig ist.
      </p>
    </div>
  );
}
