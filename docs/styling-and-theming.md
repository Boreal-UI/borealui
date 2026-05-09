# Styling and Theming

Boreal UI styles are driven by CSS variables, shared style props, global defaults, and the color scheme theme provider.

## Global Styles

Import the global stylesheet once.

```tsx
import "boreal-ui/core/globals.css";
```

For Next.js:

```tsx
import "boreal-ui/next/globals.css";
```

The global stylesheet provides CSS variables, resets, theme values, animations, and shared utility styles used by components.

Be careful with the default `globals.css` created by many Next.js starters:

```css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
```

When that reset is loaded after Boreal, the universal `padding` and `margin` declarations can override spacing used by Boreal components and nested content. A safer app-level baseline is:

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

Keep broader spacing rules scoped to your app shell, page layouts, or utility classes so they do not erase component-level padding and margins.

The CLI can create or repair that safer baseline for Next.js apps:

```bash
npx boreal-ui init --framework next --recommended-globals
```

## Shared Style Props

Many components support a common styling vocabulary.

| Prop | Values |
| --- | --- |
| `theme` | `primary`, `secondary`, `tertiary`, `quaternary`, `clear` |
| `state` | `success`, `error`, `warning`, `disabled`, empty string |
| `size` | `xs`, `small`, `medium`, `large`, `xl` |
| `rounding` | `none`, `small`, `medium`, `large`, `full` |
| `shadow` | `none`, `light`, `medium`, `strong`, `intense` |
| `borderWidth` | `none`, `xs`, `small`, `medium`, `large`, `xl` |
| `outline` | Boolean outline treatment where supported. |
| `glass` | Boolean translucent surface treatment where supported. |
| `className` | Consumer class hook on the root element. |

Exact support varies by component. Use TypeScript or generated prop docs to confirm a component's full API.

```tsx
import { Button, Card } from "boreal-ui/core";

export function Actions() {
  return (
    <Card theme="secondary" rounding="large" shadow="strong" glass>
      <Button theme="primary" size="large" outline>
        Save changes
      </Button>
    </Card>
  );
}
```

## Global Style Defaults

Use `borealConfig` to set project-wide defaults for components that read Boreal style config. `setBorealStyleConfig` is still exported for the same behavior.

```tsx
import { borealConfig } from "boreal-ui/core";

borealConfig({
  defaultTheme: "secondary",
  defaultSize: "medium",
  defaultRounding: "medium",
  defaultShadow: "light",
  defaultBorderWidth: "none",
  defaultGlass: false,
  defaultOutline: false,
  defaultColorSchemeName: "Forest Dusk",
});
```

For Next.js:

```tsx
import { borealConfig } from "boreal-ui/next";
```

Component props override global defaults.

```tsx
<Button theme="primary" size="large">
  Save
</Button>
```

## ThemeProvider

`ThemeProvider` manages the active color scheme and writes it into CSS variables. It resolves text colors against the active surfaces with a WCAG 2.1 AA normal-text contrast target, so low-contrast custom schemes fall back to readable foreground colors instead of blindly using `forceTextColor`.

```tsx
import { ThemeProvider } from "boreal-ui/core";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider initialSchemeName="Forest Dusk">{children}</ThemeProvider>;
}
```

For Next.js:

```tsx
"use client";

import { ThemeProvider } from "boreal-ui/next";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider initialSchemeName="Forest Dusk">{children}</ThemeProvider>;
}
```

To reduce first-paint color flashing, render Boreal's initialization script as early as possible in the document. In Next.js app router projects, place it in the root layout before themed content:

```tsx
import { getThemeInitializationScript } from "boreal-ui/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          dangerouslySetInnerHTML={{ __html: getThemeInitializationScript() }}
        />
        {children}
      </body>
    </html>
  );
}
```

`ThemeProvider` props:

| Prop | Description |
| --- | --- |
| `children` | Application or subtree to theme. |
| `customSchemes` | Registers additional color schemes. |
| `initialSchemeName` | Selects the starting scheme by name. |
| `useOnlyCustomSchemes` | Uses only custom schemes instead of built-in schemes. |

When `initialSchemeName` is provided, it is preferred over the saved theme name. Without it, the saved theme name is used when available, then the configured Boreal default, then the first available scheme.

## Custom Color Schemes

```tsx
import { ThemeProvider } from "boreal-ui/core";
import type { ColorScheme } from "boreal-ui/core/types";

const schemes: ColorScheme[] = [
  {
    name: "Brand Night",
    primaryColor: "#4f46e5",
    secondaryColor: "#06b6d4",
    tertiaryColor: "#a855f7",
    quaternaryColor: "#22c55e",
    backgroundColor: "#0f172a",
    forceTextColor: "#ffffff",
  },
];

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider customSchemes={schemes} initialSchemeName="Brand Night">
      {children}
    </ThemeProvider>
  );
}
```

You can also register a scheme outside the provider.

```tsx
import { registerColorScheme } from "boreal-ui/core";

registerColorScheme({
  name: "Brand Light",
  primaryColor: "#2563eb",
  secondaryColor: "#0891b2",
  tertiaryColor: "#7c3aed",
  quaternaryColor: "#16a34a",
  backgroundColor: "#ffffff",
});
```

## ThemeSelect

`ThemeSelect` renders a control for selecting registered color schemes.

```tsx
import { ThemeProvider, ThemeSelect } from "boreal-ui/core";

export function Settings() {
  return (
    <ThemeProvider>
      <ThemeSelect aria-label="Select color scheme" />
    </ThemeProvider>
  );
}
```

## CSS Variable Overrides

Override variables globally or scope them to a subtree.

```css
:root {
  --font-family-ui: Inter, system-ui, sans-serif;
  --border-radius-md: 0.5rem;
  --transition-default: 160ms ease;
  --focus-outline-color: #2563eb;
}

.admin-shell {
  --background-color: #0f172a;
  --text-color: #f8fafc;
}
```

## Class Name Customization

Most components accept `className`. Larger components expose section-level class props so consumers can style specific regions while preserving Boreal's internal classes.

```tsx
<Card
  title="Revenue"
  className="dashboard-card"
  headerClassName="dashboard-card-header"
  contentClassName="dashboard-card-content"
>
  <MetricBox value="$42,180" label="This month" />
</Card>
```

Prefer CSS variables for global visual changes and class props for local layout or component-specific polish.
