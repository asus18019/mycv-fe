# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# mycv-fe

Car price recommendation platform. Users submit sale reports (model, mileage, year, price, location) which are reviewed by an admin. Once approved, reports feed a price recommendation engine — when a user searches for a car, the system calculates a recommended price based on model, mileage, year, and location data from past sales.

## Tech stack

- **Next.js 16.2.9** — breaking changes vs 13/14/15; APIs, routing, and config all differ
- **React 19.2.4** — new hooks, Server Actions, and compiler changes
- **Tailwind CSS v4** — CSS-first config, no `tailwind.config.js`; utility names and behavior differ from v3
- **TypeScript 5**

## Dev commands

```
npm run dev    # start dev server
npm run build  # production build
npm run start  # serve production build
npm run lint   # eslint
```

## Architecture

Follows the [Bulletproof React](https://github.com/alan2207/bulletproof-react) feature-based structure.

```
src/
  app/              # Next.js routing only — page.tsx, layout.tsx, loading.tsx, error.tsx
  features/
    auth/           # login, register, session
    cars/           # price search, car details
    reports/        # submit sale report, report status
    admin/          # review and approve/reject reports
  components/       # shared UI components (shadcn/ui wrappers, layout primitives)
  lib/              # API client, utilities, constants
  hooks/            # shared React hooks
  types/            # shared TypeScript types
```

Rules:
- `app/` contains **only** routing files — no business logic, no direct API calls
- Each feature is self-contained: its own components, hooks, api, and types live inside `features/<name>/`
- Cross-feature imports are not allowed — go through `components/`, `lib/`, or `types/` instead
- shadcn/ui primitives live in `components/ui/`

## Conventions

- **App Router only** — no Pages Router
- Components are **Server Components by default**; add `"use client"` only when necessary
- File naming: `kebab-case` for files/folders, `PascalCase` for component names
- Shared components go in `app/components/`

## Do NOT use (outdated patterns)

- `next/head` — use the Metadata API (`export const metadata`) instead
- `getServerSideProps` / `getStaticProps` / `getStaticPaths` — use Server Components and `fetch` with cache options
- `tailwind.config.js` — Tailwind v4 is configured via CSS `@theme` in `globals.css`
- `pages/` directory — App Router only

## Forms & validation

- **React Hook Form (RHF)** for all form state management
- **Zod** for schema definition and validation
- Wire them together with `@hookform/resolvers/zod`
- Define Zod schemas in `features/<name>/schemas/` alongside the form that uses them
- Infer TypeScript types from schemas (`z.infer<typeof schema>`) — do not duplicate type definitions

## Design

- **Style:** minimalistic and simple, modern feel — clean typography, generous whitespace, neutral color palette
- **Animations:** none — no transitions, keyframes, or motion effects until explicitly requested
- **Components:** use shadcn/ui as the base; customize only when the default doesn't fit the minimal aesthetic
- **Density:** prefer spacious layouts over packed ones; avoid visual clutter

## Deployment

Target: Vercel (default Next.js deployment). No custom server.