# Architecture Overview
This document serves as a critical, living template designed to equip agents with a rapid and comprehensive understanding of the codebase's architecture, enabling efficient navigation and effective contribution from day one. Update this document as the codebase evolves.

## 1. Project Structure
This section provides a high-level overview of the project's directory and file structure, categorised by architectural layer or major functional area. It is essential for quickly navigating the codebase, locating relevant files, and understanding the overall organization and separation of concerns.

This project uses Next.js (App Router), where routing is file-system based and
must live under `app/`. The structure below adapts the original framework-agnostic
plan to that constraint: `app/` is kept routing-only (thin `page.tsx`/`layout.tsx`
files), while actual page content and cross-route UI live outside it, in
`features/` and `shared/`.

[Project Root]/
├── app/                       # Routing only (Next.js App Router)
│   ├── layout.tsx             # Root layout: fonts, metadata, renders <Header />
│   ├── page.tsx               # "/" route, renders features/front-page
│   └── globals.css            # Tailwind v4 theme tokens + base styles
│
├── features/                  # One folder per business domain
│   ├── front-page/
│   │   ├── components/        # one folder per component (see convention below)
│   │   └── index.ts           # public exports for this feature
│   │
│   ├── categories/
│   │   ├── components/        # CategoryPage, SubcategoryLinks, Pagination
│   │   ├── utils/              # feature-local helpers (e.g. paginate())
│   │   └── index.ts
│   │
│   └── product/                # (not yet implemented)
│       └── ...same shape
│
├── shared/                    # Truly cross-feature code
│   ├── components/            # Header, Menu, ProductCard, ProductGrid, and future shared UI
│   ├── services/               # data-fetching layer over data/*.json (categories, products)
│   └── types/                  # shared TypeScript types for data/*.json shapes
│
├── public/                    # Static assets served as-is
├── data/                      # JSON files acting as the data store (see Data Stores)
│   ├── categories.json
│   ├── brands.json
│   ├── colors.json
│   ├── sizes.json
│   ├── attributes.json
│   ├── products.json
│   ├── users.json             # (not yet implemented)
│   └── orders.json            # (not yet implemented)
└── scripts/
    └── seed/
        ├── generate-data.mjs   # deterministic generator for data/*.json
        └── verify-data.mjs     # cross-validates data/*.json references

> Note: Tailwind v4 keeps theme tokens (colors, fonts) directly in
> `app/globals.css` via `@theme`, which is that version's idiomatic location —
> there is no separate top-level `styles/` folder. Component-level styling uses
> CSS Modules with Tailwind's `@apply` (e.g. `Header.module.css`), referencing
> `app/globals.css` via `@reference` for theme tokens, rather than long inline
> utility-class strings.

> Convention: every component, in both `shared/components/` and a feature's
> `components/`, gets its own folder: `ComponentName/ComponentName.tsx` plus
> `ComponentName/ComponentName.module.css` (e.g. `shared/components/Header/`).
> This keeps a growing `components/` directory scannable one component at a
> time instead of a flat pile of `.tsx`/`.module.css` pairs. Each `components/`
> directory has a single barrel `index.ts` re-exporting every component in it
> (e.g. `shared/components/index.ts`), rather than one `index.ts` per
> component folder — one file to update per new component instead of one to
> create. Imports between components in the same `components/` directory must
> reference the sibling file directly (`../Menu/Menu`, not the barrel), to
> avoid a circular import through that directory's own `index.ts`.

Future routes (e.g. `/categories`, `/product`) follow the same pattern: a thin
`app/<route>/page.tsx` renders a component from a matching `features/<route>/`
folder.

# 2. Data Stores

(List and describe the databases and other persistent storage solutions used.)

### 2.1. JSON File Storage

Name: Application data store

Type: JSON object files (flat files on disk)

Purpose: Stores all application data for the initial version. Chosen for simplicity while the project is early-stage. May be replaced with a proper database (e.g., PostgreSQL, MongoDB) in the future as needs grow.

Key Schemas/Collections: categories.json, brands.json, colors.json, sizes.json, attributes.json, products.json, users.json, orders.json (users/orders not yet implemented)
