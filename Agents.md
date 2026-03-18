# AGENTS.md

This guide is for AI agents (and new contributors) working on the frontend repository.  
It documents how the app is structured, where business flows live, and what to watch out for when making safe changes.

## Project identity

- Name: `mindyourmoney-front`
- Type: React + TypeScript + Vite single-page app
- Domain: personal/shared expense tracking (expenses, groups, categories, settlements, balances)
- State/Data: React Query (server state), React Context (auth + settings), Redux Toolkit (modal state)
- Styling: Tailwind CSS v4 + utility components

## Quick orientation

Start in this order:

1. `src/main.tsx` (provider wiring).
2. `src/App.tsx` (route map, auth protection, lazy-loaded pages).
3. `src/api/axiosClient.ts` (API base URL, auth header injection, global error handling).
4. `src/context/AuthContext.tsx` + `src/components/Auth/ProtectedRoute.tsx` (session lifecycle).
5. Feature hooks and services:
   - `src/hooks/useExpenses.ts`, `src/hooks/useSettledExpense.ts`, `src/services/ExpenseService.ts`
   - `src/hooks/useGroups.ts`, `src/services/GroupService.ts`
   - `src/hooks/useExpenseCategories.ts`, `src/services/ExpenseCategoryService.ts`
6. Form-heavy flows:
   - `src/components/Expense/ExpenseForm.tsx`
   - `src/components/Expense/ExpenseSettleForm.tsx`

## Top-level layout

- `src/main.tsx`
  - Boots React app, Redux store provider, React Query provider.
- `src/App.tsx`
  - Router + route declarations + lazy loading + auth wrappers.
- `src/pages`
  - Route-level screen components.
- `src/components`
  - Reusable UI + feature components (expense forms, list rows, layout, menus, modals).
- `src/hooks`
  - Data hooks (`useQuery`/`useMutation`) and UI behavior hooks.
- `src/services`
  - API adapters over axios client.
- `src/context`
  - Auth + settings contexts.
- `src/store`
  - Redux Toolkit store/slices (`modalSlice`).
- `src/domain/models.ts`
  - Shared zod schemas/types/constants (DTO shapes, filters, split types).
- `src/api/axiosClient.ts`
  - Base axios client, token injection, centralized error normalization.
- `src/utils`
  - Generic helpers (`retryService`, formatting, class merging, category theme mapping).

## Runtime stack

- React `^19.2.0`
- React Router `^7.13.0`
- TypeScript `~5.9.3`
- React Query `@tanstack/react-query ^5.90`
- Redux Toolkit `^2.11`
- Axios `^1.13`
- Tailwind CSS v4 via `@tailwindcss/vite`
- Icons: `lucide-react`

## Boot flow

From `src/main.tsx`:

1. Create `QueryClient`.
2. Render app under:
   - `<Provider store={store}>`
   - `<QueryClientProvider client={queryClient}>`
3. `App` then mounts providers and router:
   - `<AuthProvider>`
   - `<SettingsProvider>`
   - `<BrowserRouter>`
   - lazy routes in `<Suspense>`

## Route map

Declared in `src/App.tsx`:

- Public:
  - `/login`
  - `/signup`
- Protected:
  - `/` -> redirects to `/dashboard`
  - `/dashboard`
  - `/expenses`
  - `/groups`
  - `/expense-categories`
  - `/expenses/new`
  - `/expenses/new/:groupId`
  - `/expenses/edit/:expenseId`
  - `/expenses/view/:expenseId`
  - `/expenses/settle/new`
  - `/expenses/settle/view/:id`
  - `/expenses/settle/edit/:id`
  - `/groups/:groupId`
  - `/groups/:groupId/settings`
  - `/settings`

Note:
- Sidebar has a link for `/non-groups`, but this route is currently commented out in `App.tsx`.

## API and auth flow

Core API client: `src/api/axiosClient.ts`

- `baseURL`: `import.meta.env.VITE_API_URL || 'http://192.168.1.12:3000/'`
- Request interceptor:
  - reads token from `localStorage['auth_token']`
  - sends `Authorization: Bearer <token>`
- Response interceptor:
  - on `401`: removes token and redirects to `/login` (except login/signup paths)
  - on `422/423`: rejects with structured API error payload

Auth context: `src/context/AuthContext.tsx`

- On mount:
  - if token exists, calls `AuthService.getCurrentUser()`
  - if invalid, clears token and resets user
- `login/signup`:
  - stores token in localStorage
  - stores returned user in context state
- `logout`:
  - clears token and user

Protected routing: `src/components/Auth/ProtectedRoute.tsx`

- Shows loading view while auth bootstrap runs.
- Redirects to `/login` if unauthenticated.

## Data fetching and cache behavior

Pattern:
- Hooks in `src/hooks` own query keys, request execution, and invalidation.
- Services in `src/services` only do endpoint IO and response extraction.

Common query keys:

- `['expenses']`
- `['expenses', 'filter', filters]`
- `['expenses', 'filter', 'rows', filters]`
- `['expenses', 'settled']`
- `['expenses', 'settled', id]`
- `['groups']`, `['groups', id]`
- `['expense-categories']`, `['expense-categories', id]`
- `['users']`

When adding mutations:

1. Invalidate all affected key families, not only one key.
2. For cross-feature impact (example: settlement affects expenses list + balances), invalidate both settled and general expense keys.
3. Keep query key shape stable to avoid partial invalidations missing data.

## Feature architecture

### Expenses

- Service: `src/services/ExpenseService.ts`
- Hooks: `src/hooks/useExpenses.ts`
- Main screens:
  - `src/pages/ExpensesPage.tsx`
  - `src/pages/ExpenseEntryPage.tsx`
  - `src/pages/ExpenseEditPage.tsx`
  - `src/pages/ExpenseViewPage.tsx`
- Form:
  - `src/components/Expense/ExpenseForm.tsx`

Expense form responsibilities:

- Handles create/edit/view modes.
- Maps UI values to backend payload:
  - `expenseDate` -> ISO string
  - `expenseCategoryId: -1` -> `null`
  - optional payer/group normalization
- Builds splits based on selected strategy and available members.

### Settlements

- Hooks: `src/hooks/useSettledExpense.ts`
- Page: `src/pages/ExpenseSettledPage.tsx`
- Form: `src/components/Expense/ExpenseSettleForm.tsx`

Modes are route-driven:

- `/settle/new` => create
- `/settle/view/:id` => read-only
- `/settle/edit/:id` => update

Delete currently routes through generic `ExpenseService.deleteExpense(id)` (backend `/expense/:id`).

### Groups

- Service: `src/services/GroupService.ts`
- Hooks: `src/hooks/useGroups.ts`
- Pages:
  - `src/pages/GroupsPage.tsx`
  - `src/pages/GroupDetailsPage.tsx`
  - `src/pages/GroupSettingsPage.tsx`

### Categories

- Service: `src/services/ExpenseCategoryService.ts`
- Hooks: `src/hooks/useExpenseCategories.ts`
- Page: `src/pages/ExpenseCategoriesPage.tsx`

## Validation and type system

Canonical model/types live in `src/domain/models.ts` using zod.

Important:

- Some schemas still use UUID-style `string` IDs while backend currently returns numeric IDs for many endpoints.
- Several form flows coerce IDs manually (`Number(...)`, `String(...)`) before submit/use.

Agent guidance:

1. Do not assume one ID type globally.
2. When changing DTOs, verify both:
   - schema in `models.ts`
   - transformations in form/service layers

## Styling and UI system

- Tailwind v4 is imported in `src/index.css`.
- Custom theme tokens and app animations are defined via `@theme`.
- `MainLayout` provides:
  - responsive sidebar
  - app chrome
  - decorative liquid background

UI primitives:

- `src/components/UI` and `src/components/UI/Form/*` are preferred over ad-hoc raw inputs/buttons.

## Build/dev workflow

Install:

- `npm install`

Run dev:

- `npm run dev`

Lint:

- `npm run lint`

Build:

- `npm run build`

Preview build:

- `npm run preview`

## Environment contract

Used frontend env vars:

- `VITE_API_URL` (optional, falls back to hardcoded LAN URL)

Local storage keys:

- `auth_token`
- `app_currency`

If changing auth/session/settings behavior, keep these keys in sync across `AuthService`, `AuthContext`, and `axiosClient`.

## Known pitfalls / high-risk gaps

1. Route drift:
- Sidebar links to `/non-groups`, route disabled in `App.tsx`.

2. ID type inconsistency:
- Domain schemas define many IDs as `string().uuid()`, but feature code frequently uses numeric IDs and coercion.

3. Service endpoint drift risk:
- Some service methods use endpoints that may not match backend exactly if backend changes (verify against backend route files before edits).

4. Cache invalidation gaps:
- Some mutations invalidate only narrow keys; derived lists can go stale if related keys are not also invalidated.

5. No automated tests:
- There is no configured unit/integration/e2e test suite in this repo.

6. Hardcoded API fallback:
- Default API base URL is a specific private IP, which can fail in other environments.

## Agent operating guidelines for this repo

When implementing changes:

1. Start at hook + service + page together; avoid changing only one layer.
2. Preserve query key conventions unless doing a deliberate migration.
3. Keep API-side effects in hooks/services, not deeply inside presentational components.
4. Prefer existing `FormInput`, `FormSelect`, `ErrorDisplay`, `Loader` for consistency.
5. Keep route-driven page mode contracts intact (`new/edit/view` flows).
6. If touching DTO/schema types, validate all ID conversions in submit payloads and select options.
7. Update docs/env instructions when new env variables are added.

When reviewing diffs:

1. Check auth flow first (token usage, 401 redirect, ProtectedRoute behavior).
2. Check query invalidation and stale data behavior after mutations.
3. Check route/path consistency between sidebar links and router declarations.
4. Check service endpoint path correctness against backend routes.
5. Check form submit payload normalization (dates, null mapping, number coercion).

## Suggested immediate improvements (backlog)

1. Add frontend `README` focused on real project setup (env, backend URL, run flow, architecture map).
2. Normalize ID types across domain schemas and service payloads.
3. Centralize API response extraction shape to reduce per-service inconsistencies.
4. Add baseline tests (auth bootstrap, protected route redirect, expense create/edit/settle flows).
5. Expand mutation invalidations for cross-feature consistency (expenses, settled expenses, dashboard balances).
6. Replace hardcoded API fallback URL with environment-specific defaults.

