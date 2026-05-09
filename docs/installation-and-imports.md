# Installation and Imports

Boreal UI ships two consumer builds:

- `boreal-ui/core` for standard React apps.
- `boreal-ui/next` for Next.js apps, including app-router projects.

The root `boreal-ui` entry currently resolves to the core build. Prefer the explicit build entry so your intent is clear.

## Install

```bash
npm install boreal-ui
```

Boreal UI expects these peer dependencies in the consuming app:

```bash
npm install react react-dom marked uuid
```

Next.js apps should also install `next`.

## React Setup

Import the core stylesheet once near the top of your app.

```tsx
import "boreal-ui/core/globals.css";
```

Then import components from the core build.

```tsx
import { Button, Card, TextInput } from "boreal-ui/core";

export function ProjectForm() {
  return (
    <Card title="New project" theme="primary" shadow="medium">
      <TextInput label="Project name" name="projectName" />
      <Button type="submit">Create project</Button>
    </Card>
  );
}
```

## Next.js Setup

Import the Next stylesheet once from `app/layout.tsx`, `pages/_app.tsx`, or another global stylesheet loaded by the app.

```tsx
import "boreal-ui/next/globals.css";
```

Next.js starter projects often include this broad reset in the app's default `globals.css`:

```css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
```

Avoid loading that reset after Boreal styles. The universal `padding` and `margin` rules can override spacing that Boreal components and nested content rely on. Prefer a narrower global override that keeps box sizing predictable without removing spacing from every element:

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

If your app needs additional layout resets, scope them to your own shell classes instead of applying them to every element globally.

The CLI can create or repair that safer baseline for Next.js apps:

```bash
npx boreal-ui init --framework next --recommended-globals
```

Use the Next build for components.

```tsx
"use client";

import { Button, Card, TextInput } from "boreal-ui/next";

export default function ProjectForm() {
  return (
    <Card title="New project" theme="primary" shadow="medium">
      <TextInput label="Project name" name="projectName" />
      <Button type="submit">Create project</Button>
    </Card>
  );
}
```

Use `"use client"` in your own Next.js component when you render Boreal components inside a file that uses browser-only behavior, events, hooks, local state, or context. Boreal's Next entry points preserve their own client boundaries.

## Standalone Component Imports

Standalone imports are available when you want a narrower import path.

```tsx
import Button from "boreal-ui/core/Button";
import Card from "boreal-ui/next/Card";
```

Standalone paths follow the same core/next split:

```tsx
import DataTable from "boreal-ui/core/DataTable";
import NextDataTable from "boreal-ui/next/DataTable";
```

## Public API Entry Points

| Entry point | Purpose |
| --- | --- |
| `boreal-ui/core` | React components, theme APIs, style config, generated prop docs, and public types. |
| `boreal-ui/next` | Next.js wrappers with the same public API shape. |
| `boreal-ui/core/Button` | Standalone core component import. |
| `boreal-ui/next/Button` | Standalone Next component import. |
| `boreal-ui/core/globals.css` | Core global CSS import. |
| `boreal-ui/next/globals.css` | Next global CSS import. |
| `boreal-ui/core/types` | Shared public type entry point. |
| `boreal-ui/next/types` | Shared public type entry point for Next consumers. |
| `boreal-ui/docs` | Generated component prop metadata for docs tools and prop tables. |
| `boreal-ui/core/registerColorScheme` | Standalone color-scheme registration helper for React consumers. |
| `boreal-ui/next/registerColorScheme` | Standalone color-scheme registration helper for Next consumers. |

For a complete list of barrel exports, standalone component paths, generated prop-doc objects, and compatibility aliases, see [Public API Reference](./public-api-reference.md).

## Choosing Core or Next

Use `core` when the app is a Vite, CRA, Remix, Astro, or other React application that can consume normal React components and global CSS.

Use `next` when the app is a Next.js app. The Next wrappers use SCSS Modules internally and preserve client-boundary behavior expected by Next.js.

Do not mix `core` and `next` imports in the same component tree unless you have a specific migration reason. Pick one build per app shell so styles, class names, and bundler behavior stay predictable.
