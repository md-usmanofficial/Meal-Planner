# 📋 PROJECT RULES — Meal Planner Web Application

> **CRITICAL**: Read this file before every task. These rules are non-negotiable.
> They exist to ensure the project remains clean, scalable, and production-ready.

---

## 1. Architecture Rules

- **Never rewrite unrelated files.** Only touch files that are required for the current feature.
- **Ask before changing the architecture.** Any structural change (new folder, new pattern, new library) must be explicitly approved first.
- **Build one feature at a time.** Complete and verify a feature before starting the next.
- **Follow the established folder structure** defined in the implementation plan at all times.
- **Use the App Router exclusively.** No Pages Router files should ever be created.

---

## 2. Code Quality Rules

- **Strict TypeScript always.** No `any` types allowed. Use proper interfaces, enums, and generics.
- **No code duplication.** Extract repeated logic into reusable hooks, utilities, or components.
- **Prefer composition over duplication.** Build small, composable components.
- **Keep components reusable and focused.** One component = one responsibility.
- **Use clean architecture.** Business logic belongs in `services/` or `lib/`, not in components.
- **Always handle edge cases:** loading states, error states, empty states, unauthorized states.
- **Document complex logic** with concise comments. Do not comment obvious code.
- **Use environment variables** for all secrets and API keys. Never hardcode credentials.

---

## 3. API Rules

- **Use free public APIs only.** No paid APIs unless explicitly approved.
  - Spoonacular (Primary recipes + nutrition)
  - TheMealDB (Recipe fallback)
  - Open Food Facts (Food search + barcodes)
  - USDA FoodData Central (Nutrition accuracy)
- **Never permanently copy recipe or nutrition data into the database.** Only save what a user explicitly saves.
- **All external API calls must go through the `src/lib/api/` wrappers.** Never call external APIs directly from components.
- **Always validate API responses** before using them.

---

## 4. Database Rules

- **Store only user-related data in Supabase.** No recipe databases, no food databases.
- **All tables must have Row Level Security (RLS) enabled** in Supabase.
- **Use Prisma for all database operations.** Never write raw SQL unless absolutely necessary.
- **Never run raw mutations from the client.** All writes must go through Next.js API routes.
- **Use Prisma migrations** for all schema changes. Never manually edit the database.

---

## 5. UI/Design Rules

- **Maintain a consistent design system.** Use only the established color tokens and spacing.
- **Use shadcn/ui components** as the base. Extend them, don't replace them.
- **Follow the UI reference image** for layout inspiration, but build an original design.
- **All pages must be fully responsive** — mobile, tablet, laptop, desktop.
- **Dark mode must work on every component.**
- **Use Framer Motion** for meaningful animations only. Avoid animation for animation's sake.
- **Use Lucide React** for all icons. No mixing of icon libraries.
- **English only.** No i18n implementation needed.

---

## 6. State Management Rules

- **Zustand for client-side state** (auth session, UI state, settings).
- **Server Components by default.** Only add `"use client"` when truly necessary.
- **No prop drilling.** Use stores or React Context for shared state.

---

## 7. Form & Validation Rules

- **React Hook Form for all forms.** No uncontrolled forms.
- **Zod for all schema validation** — both client and server side.
- **Validate on the server too.** Client validation is UX, server validation is security.

---

## 8. Security Rules

- **Never expose API keys to the client.** All external API calls with secrets go through Next.js API routes.
- **Always authenticate before data access.** Use Supabase middleware to protect routes.
- **Sanitize all user inputs** before processing or storing.
- **Use HTTPS only.** No plain HTTP in production.

---

## 9. Git Rules

- **One feature = one commit** (or a small set of related commits).
- **Use conventional commit messages:** `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- **Never commit `.env.local`.** Only `.env.example` belongs in git.
- **No broken builds on main.** Every commit must leave the project in a working state.

---

## 10. Workflow Rules

- **Explain major decisions before implementing them.**
- **Never start a new phase without user approval.**
- **After every phase, verify:** TypeScript compiles, dev server runs, feature works end-to-end.
- **Preserve existing functionality.** New features must not break existing ones.
- **Run `tsc --noEmit` before marking any phase complete.**

---

## Technology Stack Reference

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Database | Supabase PostgreSQL |
| ORM | Prisma |
| Auth | Supabase Authentication |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Notifications | Sonner |
| PDF Export | @react-pdf/renderer |
| Deployment | Vercel |

---

*Last updated: Phase 0 — Initial Setup*
