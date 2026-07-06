# Next.js Server Components

Boreal UI publishes dedicated React Server Component entries for static UI in
Next.js app-router projects. These entries use the Next SCSS Modules without
adding `"use client"`, React hooks, browser APIs, or callback props.

Import server components from the server barrel:

```tsx
import {
  BreadCrumbPageHeader,
  Card,
  Container,
  MetricBox,
  Timeline,
} from "@boreal-ui/next/server";
```

Per-component server paths are also available:

```tsx
import MetricBox from "@boreal-ui/next/server/MetricBox";
import { Grid, Stack } from "@boreal-ui/next/server/Layout";
```

Continue importing the global Next stylesheet once:

```tsx
import "@boreal-ui/next/globals.css";
```

## Available Server Entries

`Alert`, `Avatar`, `Badge`, `BarChart`, `BreadCrumbPageHeader`, `Breadcrumbs`,
`Button`, `Card`, `CheckBox`, `Divider`, `EmptyState`, `Footer`, `Layout`,
`Legend`, `LineChart`, `MetricBox`, `PageHeader`, `ProgressBar`, `RadioButton`,
`RadioGroup`, `Select`, `Skeleton`, `Sparkline`, `TextArea`, `TextInput`,
`ThemeProvider`, `Timeline`, `Toolbar`, `Typography`, and `ValidationSummary`.

The `Layout` entry exports `Container`, `Grid`, `Inline`, `Section`, and
`Stack`.

The `ThemeProvider` server entry exports server-safe theme helpers rather than
a React provider component.

## SSR Theme Setup

Use the server-safe theme helpers in `app/layout.tsx` to resolve the selected
theme from Boreal's `boreal-theme` cookie and render its CSS variables directly
onto `<html>`. Wrap the body with the normal client `ThemeProvider` so theme
selection remains interactive after hydration.

```tsx
import { cookies } from "next/headers";
import { ThemeProvider } from "@boreal-ui/next/ThemeProvider";
import {
  getThemeAttributes,
  resolveThemeScheme,
  THEME_COOKIE_NAME,
} from "@boreal-ui/next/server/ThemeProvider";
import "@boreal-ui/next/globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const savedThemeName = cookieStore.get(THEME_COOKIE_NAME)?.value;
  const scheme = resolveThemeScheme(savedThemeName);

  return (
    <html lang="en" {...getThemeAttributes(scheme)}>
      <body>
        <ThemeProvider initialSchemeName={scheme.name}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

The Next `ThemeProvider` synchronizes changes to both localStorage and the
`boreal-theme` cookie by default. This lets the next request render the selected
theme without a first-paint flash or hydration mismatch.

When using custom schemes, pass the same `customSchemes` and
`useOnlyCustomSchemes` options to both `resolveThemeScheme` and the client
`ThemeProvider`.

Server theme helpers:

- `resolveThemeScheme(name, options)` resolves a cookie value with custom
  scheme and fallback support.
- `getThemeStyle(scheme)` returns the accessible Boreal CSS-variable map.
- `getThemeAttributes(scheme)` returns `data-boreal-theme` and `style`
  attributes for `<html>`.
- `readSavedSchemeCookie(cookieHeader, cookieName)` reads a theme value from a
  raw cookie header.
- `THEME_COOKIE_NAME` contains the default `boreal-theme` cookie name.

## Static And Stripped Behavior

Server entries are intended for values and markup known during server render.
Normally interactive components use deliberately stripped APIs:

- `Button` renders static button or link markup without event callbacks.
- `TextInput` and `TextArea` render read-only values or native initial state.
- `Select`, `CheckBox`, `RadioButton`, and `RadioGroup` render native initial
  form state without change callbacks.
- `EmptyState` uses `actionHref` for a static action link and omits
  `onActionClick`.
- `Footer` renders links and static social actions, and always omits the theme
  selector.
- `Toolbar` renders a static avatar and omits the avatar click handler.
- `ValidationSummary` renders items as links or text and omits focus-on-mount
  and item-click behavior.

Use the standard `@boreal-ui/next` entries when a component needs hooks,
context, browser APIs, event handlers, or client-managed state.

## Example

```tsx
import {
  BreadCrumbPageHeader,
  Button,
  Card,
  Grid,
  MetricBox,
  Stack,
  ValidationSummary,
} from "@boreal-ui/next/server";

export default function DashboardPage() {
  return (
    <Stack gap="lg">
      <BreadCrumbPageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Reports" }]}
        title="Reports"
        actions={<Button href="/reports/archive">View archive</Button>}
      />

      <Grid minColumnWidth="14rem">
        <MetricBox title="Requests" value="12.4" units="k" />
        <MetricBox title="Availability" value="99.99" units="%" />
      </Grid>

      <Card title="Validation status">
        <ValidationSummary
          items={[{ message: "Name is required", fieldId: "name" }]}
        />
      </Card>
    </Stack>
  );
}
```

Server component examples are also available in Storybook under
`Server Components/Overview`.
