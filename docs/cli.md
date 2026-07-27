# Boreal UI CLI

The CLI adds Boreal UI to an existing React or Next.js application. It detects the framework and package manager, installs the correct runtime package, imports Boreal's global stylesheet once, and wires the theme provider.

## Quick Start

Run this from the root of an existing app:

```bash
npx @boreal-ui/cli@latest init --yes
```

The default flow installs dependencies. To inspect the changes first or manage dependencies yourself:

```bash
npx @boreal-ui/cli@latest init --dry-run
npx @boreal-ui/cli@latest init --yes --no-install
```

The aliases `setup` and `create` run the same workflow. A project directory can be positional or passed with `--cwd`.

```bash
npx @boreal-ui/cli@latest setup ./apps/web
npx @boreal-ui/cli@latest init --cwd ./apps/web
```

The setup edits are idempotent. Running the command again repairs missing setup without intentionally duplicating the package dependency, stylesheet import, provider wrapper, or generated provider file. Use `--dry-run` after upgrades to inspect what the current CLI would change.

## Options

| Option | Description |
| --- | --- |
| `--cwd`, `--project`, `--dir <path>` | Project directory to configure. |
| `--framework <react\|next>` | Override automatic framework detection. |
| `--package-manager <npm\|pnpm\|yarn\|bun>` | Override automatic package-manager detection. |
| `--install` | Install dependencies after applying edits. This is the default. |
| `--no-install` | Leave dependency installation to you. |
| `--recommended-globals` | Add or repair the Boreal-safe Next.js global CSS baseline. |
| `--no-recommended-globals` | Skip the Next.js global CSS baseline. |
| `--agents-guide` | Add an optional consumer-focused `AGENTS.md`. |
| `--no-agents-guide` | Do not add `AGENTS.md`. This is the default. |
| `--dry-run`, `--check` | Print planned changes without writing files or installing packages. |
| `--yes`, `-y` | Accept recommended setup edits without file-by-file prompts. |
| `--help`, `-h` | Print help. |
| `--version`, `-v` | Print the CLI version. |

## Generated Setup

For React, the CLI adds `@boreal-ui/core`, imports `@boreal-ui/core/globals.css` in the application entry, and wraps `<App />` in `ThemeProvider`.

For the Next.js app router, it adds `@boreal-ui/next`, imports `@boreal-ui/next/globals.css` in the root layout, and creates or repairs a small client provider beside the layout. For the pages router, it applies the same setup in `_app`.

The generated provider intentionally does not copy Boreal's default theme, size, rounding, shadow, border, or color-scheme values into the app. It inherits the library's current defaults, so a future Boreal update cannot leave a newly scaffolded app with an obsolete configuration snapshot. Add only the defaults the app actually wants to customize:

```tsx
import { borealConfig } from "@boreal-ui/next";

borealConfig({
  defaultTheme: "secondary",
  defaultRounding: "large",
});
```

Component declarations work automatically through the framework runtime package. Add `@boreal-ui/types` separately only if application code imports that package directly; the beginner setup does not need it.

## Next.js Global CSS

Some starter apps reset every element's margin and padding, which can remove intended component spacing. The recommended baseline keeps predictable box sizing without globally erasing Boreal spacing:

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

Interactive Next.js setup asks before creating or repairing this baseline. `--yes` accepts it; the explicit globals flags override it.

## Detection

Framework detection checks dependencies and conventional React/Next.js entry files. Package-manager detection checks lockfiles in this order: pnpm, Yarn, Bun, then npm as the fallback. Use the override flags when a monorepo or unconventional layout is ambiguous.

## After Setup

Use component subpaths when you want the smallest, clearest import boundary:

```tsx
import Button from "@boreal-ui/next/Button";
```

The package root is also supported:

```tsx
import { Button, Card } from "@boreal-ui/next";
```

React applications use the equivalent `@boreal-ui/core` paths.

If the CLI cannot find `package.json`, a React entry file, a Next.js layout, or `_app`, run it from the actual application directory or pass `--cwd` and `--framework` explicitly.
