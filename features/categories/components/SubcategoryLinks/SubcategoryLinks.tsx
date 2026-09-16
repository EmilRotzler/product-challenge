import Link from "next/link";
import type { Category } from "@/shared/types/category";
import styles from "./SubcategoryLinks.module.css";

type SubcategoryLinksProps = {
  categories: Category[];
};

export function SubcategoryLinks({ categories }: SubcategoryLinksProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Subcategories" className={styles.nav}>
      <ul className={styles.list}>
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/categories/${category.slug}`} className={styles.link}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
