"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AttributeOption, FilterOptions } from "../../utils/getFilterOptions";
import type { AttributeFilterValue, FilterState } from "../../utils/query";
import { clearedFilterState, serializeFilterState } from "../../utils/query";
import styles from "./FilterPanel.module.css";

type FilterPanelProps = {
  open: boolean;
  onClose: () => void;
  slug: string;
  filterOptions: FilterOptions;
  initialState: FilterState;
};

export function FilterPanel({ open, onClose, slug, filterOptions, initialState }: FilterPanelProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<FilterState>(initialState);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDraft(initialState);
    }
  }

  if (!open) {
    return null;
  }

  function toggleId(list: number[], id: number): number[] {
    return list.includes(id) ? list.filter((existing) => existing !== id) : [...list, id];
  }

  function updateAttribute(attributeId: number, value: AttributeFilterValue | undefined) {
    setDraft((current) => {
      const attributes = { ...current.attributes };
      if (value === undefined) {
        delete attributes[attributeId];
      } else {
        attributes[attributeId] = value;
      }
      return { ...current, attributes };
    });
  }

  function navigateWithState(state: FilterState) {
    const query = serializeFilterState(state);
    router.push(`/categories/${slug}${query ? `?${query}` : ""}`);
    onClose();
  }

  return (
    <>
      <button type="button" aria-label="Close filters" onClick={onClose} className={styles.backdrop} />
      <aside aria-label="Filters" className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.title}>Filters</span>
          <button type="button" aria-label="Close filters" onClick={onClose} className={styles.close}>
            <span className={styles.closeBar} />
            <span className={styles.closeBar} />
          </button>
        </div>
        <div className={styles.body}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Price</h3>
            <div className={styles.rangeInputs}>
              <input
                type="number"
                aria-label="Minimum price"
                placeholder="Min"
                value={draft.minPrice ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    minPrice: event.target.value === "" ? undefined : Number(event.target.value),
                  }))
                }
                className={styles.numberInput}
              />
              <input
                type="number"
                aria-label="Maximum price"
                placeholder="Max"
                value={draft.maxPrice ?? ""}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    maxPrice: event.target.value === "" ? undefined : Number(event.target.value),
                  }))
                }
                className={styles.numberInput}
              />
            </div>
          </section>

          <CheckboxSection
            title="Brand"
            options={filterOptions.brands.map((brand) => ({ id: brand.id, label: brand.name }))}
            selectedIds={draft.brandIds}
            onToggle={(id) => setDraft((current) => ({ ...current, brandIds: toggleId(current.brandIds, id) }))}
          />
          <CheckboxSection
            title="Color"
            options={filterOptions.colors.map((color) => ({ id: color.id, label: color.name }))}
            selectedIds={draft.colorIds}
            onToggle={(id) => setDraft((current) => ({ ...current, colorIds: toggleId(current.colorIds, id) }))}
          />
          <CheckboxSection
            title="Size"
            options={filterOptions.sizes.map((size) => ({ id: size.id, label: size.name }))}
            selectedIds={draft.sizeIds}
            onToggle={(id) => setDraft((current) => ({ ...current, sizeIds: toggleId(current.sizeIds, id) }))}
          />

          <section className={styles.section}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={draft.inStockOnly}
                onChange={(event) => setDraft((current) => ({ ...current, inStockOnly: event.target.checked }))}
              />
              In stock only
            </label>
          </section>

          {filterOptions.attributeOptions.map((option) => (
            <AttributeSection
              key={option.attribute.id}
              option={option}
              value={draft.attributes[option.attribute.id]}
              onChange={(value) => updateAttribute(option.attribute.id, value)}
            />
          ))}
        </div>
        <div className={styles.footer}>
          <button
            type="button"
            onClick={() => navigateWithState(clearedFilterState(draft))}
            className={styles.clearButton}
          >
            Clear
          </button>
          <button type="button" onClick={() => navigateWithState(draft)} className={styles.applyButton}>
            Apply
          </button>
        </div>
      </aside>
    </>
  );
}

type CheckboxSectionProps = {
  title: string;
  options: { id: number; label: string }[];
  selectedIds: number[];
  onToggle: (id: number) => void;
};

function CheckboxSection({ title, options, selectedIds, onToggle }: CheckboxSectionProps) {
  if (options.length === 0) {
    return null;
  }
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {options.map((option) => (
        <label key={option.id} className={styles.checkboxLabel}>
          <input type="checkbox" checked={selectedIds.includes(option.id)} onChange={() => onToggle(option.id)} />
          {option.label}
        </label>
      ))}
    </section>
  );
}

type AttributeSectionProps = {
  option: AttributeOption;
  value: AttributeFilterValue | undefined;
  onChange: (value: AttributeFilterValue | undefined) => void;
};

function AttributeSection({ option, value, onChange }: AttributeSectionProps) {
  const { attribute, distinctValues } = option;

  if (attribute.type === "boolean") {
    return (
      <section className={styles.section}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={value?.kind === "boolean"}
            onChange={(event) => onChange(event.target.checked ? { kind: "boolean" } : undefined)}
          />
          {attribute.name}
        </label>
      </section>
    );
  }

  if (attribute.type === "number") {
    const rangeValue = value?.kind === "range" ? value : undefined;
    return (
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>{attribute.name}</h3>
        <div className={styles.rangeInputs}>
          <input
            type="number"
            aria-label={`Minimum ${attribute.name}`}
            placeholder="Min"
            value={rangeValue?.min ?? ""}
            onChange={(event) =>
              onChange({
                kind: "range",
                min: event.target.value === "" ? undefined : Number(event.target.value),
                max: rangeValue?.max,
              })
            }
            className={styles.numberInput}
          />
          <input
            type="number"
            aria-label={`Maximum ${attribute.name}`}
            placeholder="Max"
            value={rangeValue?.max ?? ""}
            onChange={(event) =>
              onChange({
                kind: "range",
                min: rangeValue?.min,
                max: event.target.value === "" ? undefined : Number(event.target.value),
              })
            }
            className={styles.numberInput}
          />
        </div>
      </section>
    );
  }

  const listValues = value?.kind === "list" ? value.values : [];
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{attribute.name}</h3>
      {distinctValues.map((distinctValue) => (
        <label key={distinctValue} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={listValues.includes(distinctValue)}
            onChange={() => {
              const next = listValues.includes(distinctValue)
                ? listValues.filter((existing) => existing !== distinctValue)
                : [...listValues, distinctValue];
              onChange(next.length > 0 ? { kind: "list", values: next } : undefined);
            }}
          />
          {distinctValue}
        </label>
      ))}
    </section>
  );
}
