import styles from "./FrontPage.module.css";

export function FrontPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Product Challenge</h1>
      <p className={styles.subtext}>This is the starting point. More is on the way.</p>
    </main>
  );
}
