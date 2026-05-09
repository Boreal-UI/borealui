# Boreal UI CLI

The Boreal UI CLI configures an existing React or Next.js application for Boreal UI. It is intentionally small: it adds the package dependency when needed, imports the right global stylesheet, wires `ThemeProvider`, and adds the default Boreal style config.

Use it when you want the setup edits generated for you instead of applying the React or Next.js setup steps by hand.

## Quick Start

Run the CLI from the root of an existing app:

```bash
npx boreal-ui@latest init
```

Preview the planned edits without writing files:

```bash
npx boreal-ui@latest init --dry-run
```

Run setup without prompts:

```bash
npx boreal-ui@latest init --framework next --yes
```

You can also use the package bin directly after installing Boreal UI:

```bash
npm install boreal-ui
npx boreal-ui init
```

## Commands

All CLI commands currently run the setup workflow.

| Command | Purpose |
| --- | --- |
| `boreal-ui init` | Configure the current or provided project directory. |
| `boreal-ui setup` | Alias for `init`. |
| `boreal-ui create` | Alias for `init`. |
| `boreal-ui [project-directory]` | Configure a project directory without naming the command. |
| `create-boreal-ui` | Alternate package bin that runs the same CLI. |

Examples:

```bash
npx boreal-ui@latest init ./apps/web
npx boreal-ui@latest setup --cwd ./apps/web
npx --package boreal-ui@latest create-boreal-ui ./apps/web --framework react
```

## Options

| Option | Description |
| --- | --- |
| `--cwd <path>` | Project directory to configure. |
| `--project <path>` | Alias for `--cwd`. |
| `--dir <path>` | Alias for `--cwd`. |
| `--framework <react\|next>` | Choose React core setup or Next.js setup. If omitted, the CLI tries to detect the framework. |
| `--dry-run` | Print planned edits without writing files. |
| `--check` | Alias for `--dry-run`. |
| `--install` | Run the detected or selected package manager after applying edits. |
| `--no-install` | Skip dependency installation. This is the default unless you opt in or answer yes to the install prompt. |
| `--package-manager <npm\|pnpm\|yarn>` | Select the package manager used by `--install` and the final install hint. |
| `--recommended-globals` | For Next.js apps, create or repair a Boreal-safe `globals.css` baseline without prompting. |
| `--no-recommended-globals` | For Next.js apps, skip the recommended `globals.css` prompt and change. |
| `--yes`, `-y` | Apply recommended edits without prompts. |
| `--help`, `-h` | Print CLI help. |
| `--version`, `-v` | Print the CLI version. |

## What The CLI Changes

The CLI only writes files when there is a missing or repairable setup step. If the app already looks configured, it exits with an "already configured" message.

For every supported project, it can:

- Add `boreal-ui` to `package.json` dependencies when the package is missing.
- Preserve an existing `boreal-ui` dependency version.
- Print a plan before applying changes.
- Ask before each file edit unless `--yes` is used.

## React Setup

For React apps, the CLI looks for:

```txt
src/main.tsx
src/main.jsx
src/main.ts
src/main.js
src/index.tsx
src/index.jsx
src/index.ts
src/index.js
```

It then updates the entry file to:

- Import `boreal-ui/core/globals.css`.
- Import `ThemeProvider` and `setBorealStyleConfig` from `boreal-ui/core`.
- Add a default Boreal style config when one is not already present.
- Wrap `<App />` in `ThemeProvider`.

Typical command:

```bash
npx boreal-ui@latest init --framework react
```

After setup, import React components from the core build:

```tsx
import { Button, Card } from "boreal-ui/core";
```

## Next.js Setup

For Next.js apps, the CLI supports both app router and pages router projects.

App router candidates:

```txt
app/layout.tsx
app/layout.jsx
app/layout.ts
app/layout.js
src/app/layout.tsx
src/app/layout.jsx
src/app/layout.ts
src/app/layout.js
```

Pages router candidates:

```txt
pages/_app.tsx
pages/_app.jsx
pages/_app.ts
pages/_app.js
src/pages/_app.tsx
src/pages/_app.jsx
src/pages/_app.ts
src/pages/_app.js
```

For app router projects, the CLI updates the root layout to import `boreal-ui/next/globals.css` and wrap `{children}` in a client provider. It reuses an existing `providers`, `provider`, or `boreal-provider` file in the layout directory when one exists, or creates `boreal-provider` next to the layout.

The provider file is updated or created with:

- `"use client"`.
- `ThemeProvider` and `setBorealStyleConfig` from `boreal-ui/next`.
- Default Boreal style config.
- `initialSchemeName="Forest Dusk"`.
- `enableThemeScript={false}` to avoid pre-hydration HTML mutation in the app router.

For pages router projects, the CLI updates `_app` to:

- Import `boreal-ui/next/globals.css`.
- Import `ThemeProvider` and `setBorealStyleConfig` from `boreal-ui/next`.
- Add default Boreal style config.
- Wrap `<Component {...pageProps} />` in `ThemeProvider`.

Typical command:

```bash
npx boreal-ui@latest init --framework next
```

After setup, import Next.js components from the Next build:

```tsx
import { Button, Card } from "boreal-ui/next";
```

## Recommended Next Globals

Next.js starter apps often include a broad reset like this:

```css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
```

That global `padding` and `margin` reset can remove spacing from Boreal components and nested content. The CLI can create or repair a safer baseline:

```bash
npx boreal-ui@latest init --framework next --recommended-globals
```

The generated baseline is:

```css
html {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  margin: 0;
}
```

Interactive Next.js setup prompts for this change. Use `--recommended-globals` to apply it automatically, or `--no-recommended-globals` to skip it.

## Prompts And Automation

Without flags, the CLI may ask:

- Which framework to use, unless it can be auto-detected or you pass `--framework`.
- Whether to run dependency installation after edits.
- Whether to create or repair the recommended Next.js globals baseline.
- Whether to apply each proposed file edit.

For CI, template scripts, or repeatable setup, prefer:

```bash
npx boreal-ui@latest init --framework next --yes --no-install
```

Add `--dry-run` when you want to validate the plan without changing files:

```bash
npx boreal-ui@latest init --framework next --dry-run --no-recommended-globals
```

## Package Manager Detection

When a package manager is not provided, the CLI checks for lockfiles in this order:

1. `pnpm-lock.yaml` uses `pnpm`.
2. `yarn.lock` uses `yarn`.
3. Otherwise, it uses `npm`.

The package manager is only run when `--install` is passed or you approve the install prompt.

## Troubleshooting

If framework detection fails, pass the framework explicitly:

```bash
npx boreal-ui@latest init --framework react
npx boreal-ui@latest init --framework next
```

If the CLI cannot find an expected entry file, create the app entry first or pass `--cwd` to the actual app directory.

If you want to inspect the exact edits before applying them, run:

```bash
npx boreal-ui@latest init --dry-run
```
