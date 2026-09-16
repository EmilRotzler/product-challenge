"use client";

import Link from "next/link";
import styles from "./Menu.module.css";

type MenuProps = {
  open: boolean;
  onClose: () => void;
};

export function Menu({ open, onClose }: MenuProps) {
  if (!open) {
    return null;
  }

  return (
    <nav aria-label="Main menu" className={styles.menu}>
      <ul className={styles.list}>
        <li>
          <Link href="/" onClick={onClose} className={styles.link}>
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
}
