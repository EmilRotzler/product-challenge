This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## About this project

This product listing app was built in a single **4-hour time-boxed session** as a
challenge submission. The goal wasn't just to ship features, but to demonstrate
both **planning** and **productivity** under a tight deadline:

- **Planning** — Before writing code, the project's structure and conventions
  were laid out in [ARCHITECTURE.md](ARCHITECTURE.md), a living document that
  defines the folder layout (`app/` for routing only, `features/` for
  business domains, `shared/` for cross-feature code), component conventions,
  and data storage approach. This let each feature slot into a predictable
  structure instead of being figured out ad hoc.
- **Productivity** — Within the 4-hour window, the app went from a blank
  Next.js template to a working product catalog: category pages, a product
  grid, individual product pages with full product information, and
  filtering/sorting functionality (see the commit history for the
  incremental build-out).

Given the time constraint, some areas (e.g. users, orders, a real database)
are intentionally left as "not yet implemented" — noted in
[ARCHITECTURE.md](ARCHITECTURE.md) — rather than rushed or half-built.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
