# Architecture Overview
This document serves as a critical, living template designed to equip agents with a rapid and comprehensive understanding of the codebase's architecture, enabling efficient navigation and effective contribution from day one. Update this document as the codebase evolves.

## 1. Project Structure
This section provides a high-level overview of the project's directory and file structure, categorised by architectural layer or major functional area. It is essential for quickly navigating the codebase, locating relevant files, and understanding the overall organization and separation of concerns.

[Project Root]/
├── app/                      # App-level setup
│   ├── App.tsx
│   ├── router.tsx
│   ├── providers.tsx         # context providers, theme, etc.
│   └── store.ts              # global state setup (if using Redux/Zustand)
│
├── features/                 # One folder per business domain
│   ├── front-page/
│   │   ├── components/       # components used only within this feature
│   │   ├── hooks/
│   │   ├── api/              # feature-specific API calls
│   │   ├── types.ts
│   │   ├── utils.ts          # utils specific to this feature
│   │   └── index.ts          # public exports for this feature
│   │
│   ├── categories/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   └── product/
│       └── ...same shape
│
├── shared/                   # Truly cross-feature code
│   ├── components/           # Button, Modal, Input, Card, etc.
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── Modal/
│   ├── hooks/                 # useDebounce, useLocalStorage, etc.
│   ├── utils/                 # formatDate, currency helpers, etc.
│   ├── types/                 # shared TS types/interfaces
│   ├── constants/
│   └── api/                   # base API client, interceptors, config
│
├── pages/ (or routes/)        # Thin route-level components
│   ├── FrontPage.tsx
│   ├── CategoriesPage.tsx
│   └── ProductPage.tsx
│
├── styles/                    # global styles, theme tokens
├── assets/                    # images, fonts, icons, etc.
├── data/                      # JSON files acting as the data store (see Data Stores)
│   ├── users.json
│   ├── products.json
│   └── orders.json
│
└── main.tsx

# 2. Data Stores

(List and describe the databases and other persistent storage solutions used.)

### 2.1. JSON File Storage

Name: Application data store

Type: JSON object files (flat files on disk)

Purpose: Stores all application data for the initial version. Chosen for simplicity while the project is early-stage. May be replaced with a proper database (e.g., PostgreSQL, MongoDB) in the future as needs grow.

Key Schemas/Collections: [List important JSON files as they're introduced, e.g., users.json, products.json, orders.json]
