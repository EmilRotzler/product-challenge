"use client";

import Link from "next/link";
import { getTopLevelCategories } from "@/shared/services/categories";
import styles from "./Menu.module.css";

type MenuProps = {
  open: boolean;
  onClose: () => void;
};

export function Menu({ open, onClose }: MenuProps) {
  if (!open) {
    return null;
  }

  const categories = getTopLevelCategories();

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={styles.backdrop}
      />
      <nav aria-label="Main menu" className={styles.menu}>
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>Menu</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className={styles.close}
          >
            <span className={styles.closeBar} />
            <span className={styles.closeBar} />
          </button>
        </div>
        <ul className={styles.list}>
          <li>
            <Link href="/" onClick={onClose} className={styles.link}>
              Home
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/categories/${category.slug}`} onClick={onClose} className={styles.link}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
