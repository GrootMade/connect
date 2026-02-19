# Grootmade — Premium Themes & Plugins from Your Dashboard

[![GitHub license](https://img.shields.io/github/license/GrootMade/connect)](https://github.com/GrootMade/connect/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/GrootMade/connect)](https://github.com/GrootMade/connect/issues)
[![GitHub stars](https://img.shields.io/github/stars/GrootMade/connect)](https://github.com/GrootMade/connect/stargazers)
[![Crowdin](https://badges.crowdin.net/grootmade/localized.svg)](https://crowdin.com)

Access 25K+ premium themes, plugins, and template kits — browse, install, and auto-update everything directly from your dashboard.

## Features

- **Massive catalog** — 25,000+ themes, plugins, and template kits searchable with Typesense-powered instant search
- **One-click install** — Download and install any item directly from the dashboard
- **Auto-updates** — Schedule automatic updates with configurable days, times, and per-item toggles
- **Collections** — Organize favorites into collections for quick access
- **Requests** — Request items not yet in the catalog
- **Multi-role access** — Control which user roles can access the plugin
- **White-label ready** — Fully rebrandable via `.env` configuration (logo, name, colors)
- **Internationalization** — Translation-ready with Crowdin integration

## Requirements

| Requirement | Version |
|-------------|---------|
| PHP         | 7.4+    |
| Node.js     | 18+     |
| npm         | 9+      |

## Installation

### From a Release (recommended)

1. Download `grootmade.zip` from the [stable branch](https://github.com/GrootMade/connect/tree/stable).
2. In your dashboard, go to **Plugins → Add New → Upload Plugin**.
3. Select the downloaded ZIP file and click **Install Now**.
4. Click **Activate Plugin**.

### Via FTP

1. Extract `grootmade.zip` on your local machine.
2. Upload the extracted folder to `/wp-content/plugins/` via FTP.
3. Go to **Plugins → Installed Plugins** and click **Activate**.

### From Source (development)

```bash
git clone https://github.com/GrootMade/connect.git wp-content/plugins/grootmade
cd wp-content/plugins/grootmade
cp .env.example .env       # edit values as needed
npm install
composer install
npm run build               # production build
# or
npm start                   # dev server with HMR
```

Then activate the plugin from **Plugins → Installed Plugins**.

## Development

### Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Vite dev server with HMR |
| `npm run build` | Production build to `build/` |
| `npm run deploy` | Build + copy to `deploy/` |
| `npm run dist` | Build + create distributable ZIP in `dist/` |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint with ESLint |
| `npm test` | Format + lint |

### Project Structure

```
├── includes/src/         # PHP backend (PSR-4 autoloaded under Grootmade\)
│   ├── api/              # REST API endpoints (extend ApiBase)
│   ├── Admin.php         # Admin integration
│   ├── AutoUpdate.php    # Scheduled auto-update logic
│   ├── Constants.php     # Build-injected constants from .env
│   ├── Helper.php        # Engine API proxy (engine_post)
│   ├── Installer.php     # Theme/plugin installer
│   ├── RestAPI.php       # REST route registration
│   └── ViteAssets.php    # Dev/prod asset loading
├── src/                  # React 18 SPA frontend
│   ├── pages/            # File-based routing (generouted)
│   ├── components/       # UI components (shadcn/ui + Radix)
│   ├── hooks/            # React Query hooks (useApiFetch, useApiMutation)
│   ├── lib/              # Utilities, i18n wrapper
│   ├── types/            # TypeScript type definitions
│   └── zod/              # Zod validation schemas
├── .env.example          # Environment template
├── .env.stable           # Stable release configuration
├── plugin.php            # Plugin entry point
└── vite.config.ts        # Vite config with custom WP plugin
```

### Tech Stack

**Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, React Router (hash), TanStack Query, TanStack Table, react-hook-form + Zod, Typesense instant search, Recharts

**Backend:** PHP 7.4+, REST API, PSR-4 autoloading

**Build:** Vite, custom Vite plugin, ESLint, Prettier, Husky

### Environment Configuration

The `.env` file drives the entire build — PHP namespaces, plugin headers, `Constants.php`, and `src/settings.json` are all generated from it. See `.env.example` for all available options.

Key variables:
- `SLUG` / `NAME` / `NAMESPACE` — Plugin identity
- `ENGINE_URL` — External API endpoint
- `WHITELABEL` — Enable white-label mode (`1` / `0`)
- `LOGO_LIGHT` / `LOGO_DARK` — Custom branding logos
- `TYPESENSE_*` — Search configuration

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Active development |
| `stable` | Latest production release (auto-built from `main` via GitHub Actions) |
| `beta-release` | Beta releases (auto-built from `beta`) |

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/GrootMade/connect/issues).

## License

This project is licensed under the GNU General Public License v3.0 — see the [LICENSE](LICENSE) file for details.


