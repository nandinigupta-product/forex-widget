# replit.md

## Overview

This is a **Forex Currency Exchange Widget** — a full-stack web application built for the Indian market. It lets users select a city, choose between forex cards or cash notes, pick a currency, enter an amount, and see a live conversion. The widget captures leads (user inquiries) and stores them in a PostgreSQL database. Think of it as an embeddable tool for a forex platform like BookMyForex.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure

The project uses a three-folder monorepo pattern:

- **`client/`** — React frontend (SPA)
- **`server/`** — Express backend (API server)
- **`shared/`** — Shared types, schemas, and API route contracts used by both client and server

### Frontend (`client/src/`)

- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router)
- **State/Data Fetching**: `@tanstack/react-query` for server state management
- **UI Components**: Shadcn UI (new-york style) with Radix UI primitives, styled with Tailwind CSS
- **Animations**: Framer Motion for widget transitions
- **Fonts**: Inter (body) and Outfit (headings) via Google Fonts
- **Key Components**:
  - `ForexWidget` — Main interactive widget (city selector, product tabs, currency picker, amount input, conversion display)
  - `CitySelector` — Combobox using `cmdk` for searchable city selection
- **Custom Hooks** (`client/src/hooks/`):
  - `use-forex.ts` — React Query hooks for fetching cities, rates, and creating leads
  - `use-toast.ts` — Toast notification system
  - `use-mobile.tsx` — Mobile breakpoint detection

### Backend (`server/`)

- **Framework**: Express 5 on Node.js, running via `tsx`
- **API Design**: RESTful JSON API under `/api/*`
- **Key Routes**:
  - `GET /api/cities` — Returns city list from a static JSON file (`attached_assets/Cities_list_*.json`)
  - `GET /api/rates` — Returns exchange rates (contract defined but implementation may need completion)
  - `POST /api/leads` — Creates a lead record in the database
- **Dev Server**: Vite dev server is integrated as middleware for HMR during development
- **Production**: Client is built to `dist/public/`, server is bundled with esbuild to `dist/index.cjs`

### Shared Layer (`shared/`)

- **`schema.ts`** — Drizzle ORM table definitions and Zod schemas. Currently defines a `leads` table.
- **`routes.ts`** — API contract definitions using Zod. Both client and server import these to ensure type-safe API boundaries. Defines request/response schemas for cities, rates, and leads endpoints.

### Database

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Driver**: `pg` (node-postgres) with connection pooling
- **Schema Management**: `drizzle-kit push` for schema migrations (no migration files, direct push)
- **Connection**: Requires `DATABASE_URL` environment variable
- **Tables**:
  - `leads` — Stores forex inquiry leads with fields: id, city, product (card/note), currency, amount, converted_amount, created_at

### Build System

- **Dev**: `tsx server/index.ts` runs the server with Vite middleware for hot reloading
- **Build**: Custom script (`script/build.ts`) runs Vite build for client, then esbuild for server. Server dependencies on an allowlist are bundled to reduce cold start times.
- **Output**: `dist/public/` (client assets) and `dist/index.cjs` (server bundle)

### Path Aliases

- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/`

## External Dependencies

- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable. Required for the app to start.
- **Google Fonts CDN** — Inter, Outfit, DM Sans, Geist Mono, Fira Code, Architects Daughter fonts loaded from `fonts.googleapis.com`
- **BookMyForex CDN** — City icon images referenced in the cities JSON data (`cdn.bookmyforex.com`)
- **No authentication** — The app currently has no auth system
- **No external API integrations** for rates — Exchange rate data appears to be served from the backend (implementation may use static/mock data or need an external forex rate API to be connected)