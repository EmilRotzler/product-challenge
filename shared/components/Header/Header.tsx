"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "@/shared/components/Menu";
import styles from "./Header.module.css";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Product Challenge
        </Link>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className={styles.toggle}
        >
          <span className={styles.toggleBar} />
          <span className={styles.toggleBar} />
          <span className={styles.toggleBar} />
        </button>
        <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
        <button type="button" aria-label="Cart" className={styles.cart}>
          <Image src="/cart.svg" alt="" width={20} height={20} />
        </button>
      </div>
    </header>
  );
}
