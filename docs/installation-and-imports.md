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

## Choosing Core or Next

Use `core` when the app is a Vite, CRA, Remix, Astro, or other React application that can consume normal React components and global CSS.

Use `next` when the app is a Next.js app. The Next wrappers use SCSS Modules internally and preserve client-boundary behavior expected by Next.js.

Do not mix `core` and `next` imports in the same component tree unless you have a specific migration reason. Pick one build per app shell so styles, class names, and bundler behavior stay predictable.
