import Link from "next/link";
import type { Category } from "@/shared/types/category";
import styles from "./Breadcrumbs.module.css";

type BreadcrumbsProps = {
  ancestors: Category[];
  current: { name: string };
};

export function Breadcrumbs({ ancestors, current }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <ol className={styles.list}>
        <li>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </li>
        {ancestors.map((category) => (
          <li key={category.id} className={styles.item}>
            <span className={styles.separator} aria-hidden="true">
              /
            </span>
            <Link href={`/categories/${category.slug}`} className={styles.link}>
              {category.name}
            </Link>
          </li>
        ))}
        <li className={styles.item}>
          <span className={styles.separator} aria-hidden="true">
            /
          </span>
          <span aria-current="page" className={styles.current}>
            {current.name}
          </span>
        </li>
      </ol>
    </nav>
  );
}
