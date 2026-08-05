# Boreal UI Next

Next.js package for Boreal UI.

```sh
npm install @boreal-ui/next
```

```tsx
import { Button } from "@boreal-ui/next";
import "@boreal-ui/next/globals.css";
```

Use this package when you want the Next.js wrappers and `next/link`, `next/image`, and app router compatibility.

Generated prop metadata is available separately from the optional
`@boreal-ui/docs` package.

TypeScript consumers should also install the shared declarations:

```sh
npm install -D @boreal-ui/types
```

## Server Components

Static, non-interactive components have dedicated React Server Component
entries. Import them from the server barrel or a per-component server path:

```tsx
import { Container, ProgressBar, Typography } from "@boreal-ui/next/server";
import BarChart from "@boreal-ui/next/server/BarChart";
```

Continue importing `@boreal-ui/next/globals.css` once in the application.

Available server entries are `Alert`, `Avatar`, `Badge`, `BarChart`,
`BreadCrumbPageHeader`, `Breadcrumbs`, `Button`, `Card`, `CheckBox`, `Divider`,
`EmptyState`, `Footer`, `Layout`, `Legend`, `LineChart`, `MetricBox`,
`PageHeader`, `ProgressBar`, `RadioButton`, `RadioGroup`, `Select`, `Skeleton`,
`Sparkline`, `TextArea`, `TextInput`, `ThemeProvider`, `Timeline`, `Toolbar`,
`Typography`, and `ValidationSummary`.

The form and normally interactive entries are deliberately stripped server
variants. They render static links, read-only fields, or native initial form
state without callbacks. The server footer omits its theme selector, toolbar
avatars are static, and validation summary items render as links or text
without focus behavior. Use the standard Next entries when client-side behavior
is required.

For SSR theme variables, read Boreal's `boreal-theme` cookie in the root layout
and use `resolveThemeScheme` plus `getThemeAttributes` from
`@boreal-ui/next/server/ThemeProvider`. The normal Next `ThemeProvider`
synchronizes theme changes back to the cookie.

See the
[Next.js Server Components guide](https://github.com/DaveC6662/borealui/blob/main/docs/server-components.md)
for complete usage guidance and examples.
