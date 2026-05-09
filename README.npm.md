# Boreal UI

Boreal UI is a customizable, accessible React and Next.js component library with SCSS-powered theming, TypeScript types, generated prop metadata, and parallel `core` and `next` package outputs.

Use it when you want production-ready UI primitives that can be themed globally, customized per component, tested predictably, and imported in either standard React apps or Next.js app-router projects.

## Highlights

- **React and Next.js builds:** import from `boreal-ui/core` for React apps or `boreal-ui/next` for Next.js apps.
- **Deep component set:** buttons, forms, navigation, data display, feedback, overlays, layout primitives, and utility components.
- **Theme system:** curated color schemes, custom schemes, runtime theme selection, CSS variables, and `ThemeSelect`.
- **Global defaults:** configure default theme, size, rounding, shadow, border width, glass, outline, and color scheme once with `borealConfig`.
- **Accessible by default:** semantic markup, ARIA support, keyboard behavior, visible focus states, disabled states, live announcements where useful, and predictable test IDs.
- **Styling flexibility:** theme, state, size, rounding, shadow, outline, glass, custom class names, SCSS variables, and consumer CSS overrides.
- **Typed public API:** TypeScript component props, shared type exports, and generated prop documentation objects for docs tooling.

## Installation

```bash
npm install boreal-ui
```

Boreal UI expects React and React DOM in the consuming app. Next.js users should also have Next installed.

Some components and utilities rely on `marked` and `uuid`, so make sure they are available if your package manager does not install peer dependencies automatically.

## CLI Setup

Use the CLI inside an existing React or Next.js project to add the package dependency, global stylesheet import, `ThemeProvider`, and default style config.

```bash
npx boreal-ui@latest init
```

Preview changes before writing files:

```bash
npx boreal-ui init --dry-run
```

Run non-interactively:

```bash
npx boreal-ui init --framework next --yes
```

For Next.js projects, you can also apply Boreal’s recommended global CSS baseline:

```bash
npx boreal-ui init --framework next --recommended-globals
```

## Setup

Import the global stylesheet once near the top of your application.

## React

```tsx
import "boreal-ui/core/globals.css";
```

Then import components from the core build:

```tsx
import { Button, Card, TextInput } from "boreal-ui/core";

export function Example() {
  return (
    <Card title="Welcome" theme="primary" shadow="medium">
      <TextInput label="Project name" placeholder="Aurora dashboard" />
      <Button theme="secondary" size="large">
        Continue
      </Button>
    </Card>
  );
}
```

## Next.js

Import the Next stylesheet once from `app/layout.tsx`, `pages/_app.tsx`, or your global stylesheet.

```tsx
import "boreal-ui/next/globals.css";
```

Then import components from the Next build:

```tsx
"use client";

import { Button, Card, TextInput } from "boreal-ui/next";

export default function Example() {
  return (
    <Card title="Welcome" theme="primary" shadow="medium">
      <TextInput label="Project name" placeholder="Aurora dashboard" />
      <Button theme="secondary" size="large">
        Continue
      </Button>
    </Card>
  );
}
```

### Next.js Global CSS Note

If your Next.js app still has the default starter reset below, avoid loading it after Boreal styles:

```css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
```

The universal `padding` and `margin` reset can override spacing that Boreal components and nested content rely on.

Prefer this safer baseline:

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

## Standalone Component Imports

You can import individual components directly:

```tsx
import Button from "boreal-ui/core/Button";
import Card from "boreal-ui/next/Card";
```

## Package Entry Points

```tsx
import { Button } from "boreal-ui/core";
import Button from "boreal-ui/core/Button";
import "boreal-ui/core/globals.css";

import { Button as NextButton } from "boreal-ui/next";
import NextCard from "boreal-ui/next/Card";
import "boreal-ui/next/globals.css";
```

The root `boreal-ui` entry currently points to the core build. For Next.js apps, prefer `boreal-ui/next` so the Next wrappers and client directives are used.

## Components

### Actions

- `Button`
- `IconButton`
- `ScrollToTop`

### Forms and Inputs

- `TextInput`
- `TextArea`
- `Select`
- `ThemeSelect`
- `Checkbox`
- `RadioButton`
- `RadioGroup`
- `Toggle`
- `Slider`
- `ColorPicker`
- `DateTimePicker`
- `FileUpload`
- `TagInput`
- `FormGroup`

### Data and Content

- `DataTable`
- `MarkdownRenderer`
- `Typography`
- `MetricBox`

### Feedback and Status

- `Badge`
- `Chip`
- `ChipGroup`
- `Progressbar`
- `CircularProgress`
- `Spinner`
- `Skeleton`
- `Rating`
- `Tooltip`
- `MessagePopup`
- `PopOver`
- `Modal`
- `NotificationCenter`
- `EmptyState`

### Navigation and Layout

- `Navbar`
- `Sidebar`
- `Footer`
- `Breadcrumbs`
- `Tabs`
- `Stepper`
- `Timeline`
- `Accordion`
- `Pager`
- `Toolbar`
- `Dropdown`
- `Divider`
- `Card`
- `Avatar`

## Common Styling Props

Many components share the same styling vocabulary:

| Prop          | Values                                                    |
| ------------- | --------------------------------------------------------- |
| `theme`       | `primary`, `secondary`, `tertiary`, `quaternary`, `clear` |
| `state`       | `success`, `error`, `warning`, `disabled`, empty string   |
| `size`        | `xs`, `small`, `medium`, `large`, `xl`                    |
| `rounding`    | `none`, `small`, `medium`, `large`, `full`                |
| `shadow`      | `none`, `light`, `medium`, `strong`, `intense`            |
| `borderWidth` | `none`, `xs`, `small`, `medium`, `large`, `xl`            |
| `outline`     | outline treatment where supported                         |
| `glass`       | translucent theme-aware surface where supported           |
| `className`   | consumer styling hook                                     |
| `data-testid` | stable test selector                                      |

Exact props vary by component. TypeScript and the generated prop docs are the source of truth for each component.

## Global Style Defaults

Call `borealConfig` once before rendering your app to set project-wide defaults.

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

For Next.js, import the same API from `boreal-ui/next`:

```tsx
import { borealConfig } from "boreal-ui/next";
```

Component props still win over global defaults:

```tsx
<Button theme="primary" size="large" shadow="strong">
  Save changes
</Button>
```

## Theme Provider and Color Schemes

`ThemeProvider` manages the active color scheme and writes the scheme into CSS variables used by Boreal UI components.

```tsx
"use client";

import { ThemeProvider } from "boreal-ui/next";

const customSchemes = [
  {
    name: "Cyberpunk Pulse",
    primaryColor: "#ff006e",
    secondaryColor: "#8338ec",
    tertiaryColor: "#3a0ca3",
    quaternaryColor: "#fb5607",
    backgroundColor: "#0f0f0f",
    forceTextColor: "#ffffff",
  },
];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      customSchemes={customSchemes}
      initialSchemeName="Cyberpunk Pulse"
    >
      {children}
    </ThemeProvider>
  );
}
```

### ThemeProvider Props

| Prop                   | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `customSchemes`        | Register additional color schemes at runtime.         |
| `initialSchemeName`    | Select an initial scheme by name.                     |
| `useOnlyCustomSchemes` | Use only custom schemes instead of the built-in list. |

### Color Scheme Shape

```ts
type ColorScheme = {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  quaternaryColor: string;
  backgroundColor: string;
  forceTextColor?: string;
};
```

You can also register schemes manually:

```tsx
import {
  defaultColorSchemes,
  registerColorScheme,
  ThemeSelect,
} from "boreal-ui/core";

registerColorScheme({
  name: "Brand Night",
  primaryColor: "#4f46e5",
  secondaryColor: "#06b6d4",
  tertiaryColor: "#a855f7",
  quaternaryColor: "#22c55e",
  backgroundColor: "#0f172a",
  forceTextColor: "#ffffff",
});

console.log(defaultColorSchemes.map((scheme) => scheme.name));
```

## Type Exports

Shared public types are exported from both builds:

```ts
import type {
  BorderType,
  ColorScheme,
  RoundingType,
  ShadowType,
  SizeType,
  ThemeType,
} from "boreal-ui/core";
```

Standalone type entry points are also available:

```ts
import type { ThemeType } from "boreal-ui/core/types";
import type { SizeType } from "boreal-ui/next/types";
```

## Generated Prop Docs

Boreal UI exports generated prop metadata for documentation sites, playgrounds, and prop tables.

```tsx
import { buttonPropDocs, dataTablePropDocs } from "boreal-ui/core";

console.log(buttonPropDocs.name);
console.log(dataTablePropDocs.props);
```

The docs export includes `GeneratedComponentDoc` and `GeneratedPropDoc` types, plus one prop-doc object per documented component.

## CSS Customization

Boreal UI styles are built on CSS variables and SCSS. You can override variables globally or scope them to a subtree:

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

Most components also accept `className`, and larger components expose section-level class props such as:

```tsx
<Card
  title="Custom Card"
  className="dashboard-card"
  headerClassName="dashboard-card__header"
  contentClassName="dashboard-card__content"
  footerClassName="dashboard-card__footer"
/>
```

## Accessibility and Testing

Boreal UI is designed for Testing Library, Jest, jest-axe, Cypress, and Storybook workflows.

- Prefer roles and accessible names in tests.
- Use `data-testid` when a stable selector is needed.
- Icon-only controls should receive an accessible label.
- Helper and error text are connected with ARIA where components support those states.
- Interactive components are built with keyboard behavior and visible focus states in mind.

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "boreal-ui/core";

it("renders an accessible button", () => {
  render(<Button>Submit</Button>);
  expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
});
```

## Documentation

For full documentation, examples, and API guides, [View the Boreal UI docs](https://www.borealui.ca)

## License

MIT © Davin Chiupka
