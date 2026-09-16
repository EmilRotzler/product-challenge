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
│   │   ├── components/        # components used only within this feature
│   │   └── index.ts           # public exports for this feature
│   │
│   ├── categories/             # (not yet implemented)
│   │   └── ...same shape
│   │
│   └── product/                # (not yet implemented)
│       └── ...same shape
│
├── shared/                    # Truly cross-feature code
│   └── components/            # Header, Menu, and future shared UI
│       ├── Header/
│       │   ├── Header.tsx
│       │   ├── Header.module.css
│       │   └── index.ts
│       └── Menu/
│           ├── Menu.tsx
│           ├── Menu.module.css
│           └── index.ts
│
├── public/                    # Static assets served as-is
└── data/                      # JSON files acting as the data store (see Data Stores)
    ├── users.json
    ├── products.json
    └── orders.json

> Note: Tailwind v4 keeps theme tokens (colors, fonts) directly in
> `app/globals.css` via `@theme`, which is that version's idiomatic location —
> there is no separate top-level `styles/` folder. Component-level styling uses
> CSS Modules with Tailwind's `@apply` (e.g. `Header.module.css`), referencing
> `app/globals.css` via `@reference` for theme tokens, rather than long inline
> utility-class strings.

Future routes (e.g. `/categories`, `/product`) follow the same pattern: a thin
`app/<route>/page.tsx` renders a component from a matching `features/<route>/`
folder.

# 2. Data Stores

(List and describe the databases and other persistent storage solutions used.)

### 2.1. JSON File Storage

Name: Application data store

Type: JSON object files (flat files on disk)

Purpose: Stores all application data for the initial version. Chosen for simplicity while the project is early-stage. May be replaced with a proper database (e.g., PostgreSQL, MongoDB) in the future as needs grow.

Key Schemas/Collections: [List important JSON files as they're introduced, e.g., users.json, products.json, orders.json]
