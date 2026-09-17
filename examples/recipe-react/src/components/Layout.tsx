import { NavLink, Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" className={styles.brand}>
            Rezeptbuch
          </NavLink>
          <nav className={styles.nav} aria-label="Hauptnavigation">
            <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : undefined)}>
              Start
            </NavLink>
            <NavLink to="/rezepte" className={({ isActive }) => (isActive ? styles.active : undefined)}>
              Rezepte
            </NavLink>
            <NavLink to="/ueber-uns" className={({ isActive }) => (isActive ? styles.active : undefined)}>
              Über uns
            </NavLink>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
