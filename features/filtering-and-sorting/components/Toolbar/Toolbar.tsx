"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterPanel } from "../FilterPanel/FilterPanel";
import type { FilterOptions } from "../../utils/getFilterOptions";
import type { FilterState, SortOption } from "../../utils/query";
import { SORT_OPTIONS } from "../../utils/query";
import styles from "./Toolbar.module.css";

type ToolbarProps = {
  slug: string;
  filterState: FilterState;
  filterOptions: FilterOptions;
};

const SORT_LABELS: Record<SortOption, string> = {
  relevant: "Most relevant",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  alpha: "Alphabetical",
  stock: "In stock first",
};

export function Toolbar({ slug, filterState, filterOptions }: ToolbarProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSortChange(sort: SortOption) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (sort === "relevant") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    const query = params.toString();
    router.push(`/categories/${slug}${query ? `?${query}` : ""}`);
  }

  return (
    <div className={styles.toolbar}>
      <label className={styles.sortLabel}>
        Sort by
        <select
          value={filterState.sort}
          onChange={(event) => handleSortChange(event.target.value as SortOption)}
          className={styles.sortSelect}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {SORT_LABELS[option]}
            </option>
          ))}
        </select>
      </label>
      <button type="button" onClick={() => setPanelOpen(true)} className={styles.filterButton}>
        <Image src="/filter.svg" alt="" width={16} height={16} />
        Filter
      </button>
      <FilterPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        slug={slug}
        filterOptions={filterOptions}
        initialState={filterState}
      />
    </div>
  );
}
