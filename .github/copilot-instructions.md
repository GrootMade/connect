# Copilot Instructions — Grootmade WordPress Plugin

## Architecture Overview

WordPress plugin with a **React 18 SPA frontend** embedded in WP admin. The PHP backend primarily proxies requests to an external engine API (`https://api.grootmade.com`). The frontend uses a **hash router** (`createHashRouter`) so WP admin menu items map to `#/item/theme`, `#/settings`, etc.

**Key data flow**: React hook → `@wordpress/api-fetch` → WP REST (`grootmade/v1/…`) → PHP `ApiBase` subclass → `Helper::engine_post()` → external engine API.

## Build System & Environment

- **`.env` drives everything**: PHP namespaces, plugin headers, `Constants.php` values, and `src/settings.json` are all rewritten from `.env` at build time by the custom Vite plugin in `src/vite/wp-react/`.
- `npm start` — dev server with HMR (writes `build/dev-server.json` for PHP to detect dev mode)
- `npm run build` — production build to `build/` with hashed filenames
- `npm run deploy` — build + copy production files to `deploy/`
- `npm run dist` — build + create distributable ZIP in `dist/`
- `npm run format && npm run lint` — prettier + eslint (run via `npm test`)
- `composer install` — PHP dependencies to `includes/lib/`

## PHP Backend (`includes/src/`)

- **Singleton pattern everywhere**: `private static $instance; public static function get_instance()`. Use this for new service classes.
- **REST API**: Extend `ApiBase`, override `endpoints()`. Prefix auto-derives from class name. Namespace: `grootmade/v1/{prefix}/{route}`. **All endpoints use POST**.
- **External calls**: Always use `Helper::engine_post($path, $data)` — it injects auth headers and site info automatically.
- **Constants**: `Constants.php` values are overwritten by the build. To add a new constant that syncs from `.env`, add it to the `constants` array in `vite.config.ts`.
- **Asset loading**: `ViteAssets.php` handles both dev (reads `dev-server.json`) and prod (reads `manifest.json`). Scripts are loaded as ES modules.
- **Autoloading**: PSR-4 under `Grootmade\` namespace from `includes/src/`.

### Adding a REST endpoint

```php
// includes/src/api/MyResource.php
class MyResource extends ApiBase {
    protected function endpoints() {
        return [
            ['route' => 'action-name', 'callback' => 'handle_action'],
        ];
    }
    public function handle_action(\WP_REST_Request $request) {
        return Helper::engine_post('/my-resource/action', $request->get_params());
    }
}
```
Then register it in `RestAPI.php`'s constructor.

## React Frontend (`src/`)

### Routing (generouted)

File-based routing in `src/pages/`. **`src/router.ts` is auto-generated — never edit it manually.**

| Convention | Meaning |
|---|---|
| `[param]` folder/file | Dynamic route segment |
| `-[param]` prefix | Optional parameter |
| `_components/` | Co-located page components (not routes) |
| `_app.tsx` | Root layout with error boundary |

### API & State

- **Read data**: `useApiFetch<TResponse, TPost>(path, data?, enabled?)` — wraps `useQuery`, path = `grootmade/v1/…`
- **Write data**: `useApiMutation<TResponse, TData>(path)` — wraps `useMutation`
- **Cache invalidation**: Manual via `queryClient.invalidateQueries({ queryKey: ['path'] })` in domain hooks. No optimistic updates.
- **QueryClient config**: `staleTime: 5min`, `refetchOnWindowFocus: false`

### UI Stack

- **Components**: shadcn/ui (new-york style) in `src/components/ui/`, Radix primitives, Tailwind CSS with CSS variables
- **Toasts**: `sonner` — use `toast.promise(asyncOp, { loading, success, error })` pattern
- **Forms**: `react-hook-form` + `zod` resolvers; schemas in `src/zod/`
- **Tables**: `@tanstack/react-table` via `useDataTable` hook
- **Search**: Typesense via `react-instantsearch` + `typesense-instantsearch-adapter`
- **i18n**: Import `{ __ }` from `@/lib/i18n` (wraps `@wordpress/i18n` with auto textdomain). Never import directly from `@wordpress/i18n`.

### Provider hierarchy (in `src/components/providers.tsx`)

```
QueryClientProvider → InstantSearch → NoticeProvider → DownloadProvider → BulkProvider → ThemeProvider
```

### Naming conventions

| Type | Pattern | Location |
|---|---|---|
| Hooks | `use-{domain}.ts(x)` | `src/hooks/` |
| Types | `{domain}.ts` | `src/types/` |
| Zod schemas | `{domain}.ts` | `src/zod/` |
| Config | `{domain}.ts` | `src/config/` |
| UI primitives | shadcn convention | `src/components/ui/` |
| Page components | `_components/` subfolder | co-located with page |

### Path alias

`@/` → `src/` (configured in both `tsconfig.json` and `vite.config.ts`)

## Item Types

The plugin manages 4 item types: `theme`, `plugin`, `template-kit`, `request`. Slugs and type strings are mapped bidirectionally via `src/lib/type-to-slug.ts`.

## Key Files Reference

| Purpose | File |
|---|---|
| Plugin bootstrap | `plugin.php` |
| PHP constants (build-injected) | `includes/src/Constants.php` |
| REST endpoint base class | `includes/src/api/ApiBase.php` |
| External API helper | `includes/src/Helper.php` |
| Vite asset loader (PHP) | `includes/src/ViteAssets.php` |
| Custom Vite plugin | `src/vite/wp-react/` |
| Frontend entry | `src/index.tsx` → `src/App.tsx` |
| API hooks | `src/hooks/use-api-fetch.ts`, `src/hooks/use-api-mutation.ts` |
| i18n wrapper | `src/lib/i18n.ts` |
| Frontend config (generated) | `src/settings.json` |
