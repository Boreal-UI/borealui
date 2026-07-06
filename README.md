# Boreal UI

Boreal UI is a customizable, accessible React and Next.js component library with SCSS-powered theming, TypeScript types, generated prop metadata, and parallel `core` and `next` package outputs.

Use it when you want production-ready UI primitives that can be themed globally, customized per component, tested predictably, and imported in either standard React apps or Next.js app-router projects.

[View the Boreal UI docs](https://www.borealui.ca)

## Highlights

- **Split React and Next.js packages:** install `@boreal-ui/core` for React apps or `@boreal-ui/next` for Next.js apps when you want only that build's runtime code.
- **Deep component set:** buttons, forms, navigation, data display, feedback, overlays, layout primitives, and utility components.
- **Theme system:** curated color schemes, custom schemes, runtime theme selection, CSS variables, and `ThemeSelect`.
- **Global defaults:** configure default theme, size, rounding, shadow, border width, glass, outline, and color scheme once with `borealConfig` or `setBorealStyleConfig`.
- **Accessible by default:** semantic markup, ARIA support, keyboard behavior, visible focus states, disabled states, live announcements where useful, and predictable test IDs.
- **Styling flexibility:** theme, state, size, rounding, shadow, outline, glass, custom class names, SCSS variables, and consumer CSS overrides.
- **Typed public API:** TypeScript component props, shared type exports, and generated prop documentation objects for docs tooling.
- **Package-friendly output:** tree-shakeable ESM, CommonJS support for core entry points, standalone component exports, and Next.js client-boundary handling.

## Installation

Choose the runtime package for your framework:

```bash
npm install @boreal-ui/core
npm install @boreal-ui/next
```

For TypeScript declarations, add the types package as a dev dependency:

```bash
npm install -D @boreal-ui/types
```

`@boreal-ui/core` expects React and React DOM in the consuming app. `@boreal-ui/next` also expects Next.js. `marked` and `uuid` are peer dependencies because some components and utilities rely on them.

## CLI Setup

Use the CLI inside an existing React or Next.js project to add only the file changes Boreal UI needs: the package dependency, the global stylesheet import, `ThemeProvider`, and default style config.

```bash
npx @boreal-ui/cli@latest init
```

You can preview changes or run non-interactively:

```bash
npx @boreal-ui/cli init --dry-run
npx @boreal-ui/cli init --framework next --yes
npx @boreal-ui/cli init --framework next --recommended-globals
```

See [CLI guide](./docs/cli.md) for all commands, options, prompts, and generated file changes.

## Setup

Import the global stylesheet once near the top of your application.

### React

```tsx
import "@boreal-ui/core/globals.css";
```

Then import components from the core build:

```tsx
import { Button, Card, TextInput } from "@boreal-ui/core";

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

### Next.js

Import the Next stylesheet once from `app/layout.tsx`, `pages/_app.tsx`, or your global stylesheet.

```tsx
import "@boreal-ui/next/globals.css";
```

If your Next.js app still has the starter `globals.css` reset below, avoid loading it after Boreal styles:

```css
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
```

The universal `padding` and `margin` reset can override spacing that Boreal components and nested content rely on. Prefer a narrower baseline:

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

The CLI can create or repair that safer baseline for Next.js apps:

```bash
npx @boreal-ui/cli init --framework next --recommended-globals
```

Interactive Next.js setup prompts for this by default. Use `--recommended-globals` to apply it without the prompt, or `--no-recommended-globals` to skip it.

Then import components from the Next build:

```tsx
"use client";

import { Button, Card, TextInput } from "@boreal-ui/next";

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

Static UI can use the dedicated React Server Component entries:

```tsx
import {
  BreadCrumbPageHeader,
  Card,
  MetricBox,
  Timeline,
} from "@boreal-ui/next/server";
import Footer from "@boreal-ui/next/server/Footer";
```

Available server entries are `Alert`, `Avatar`, `Badge`, `BarChart`,
`BreadCrumbPageHeader`, `Breadcrumbs`, `Button`, `Card`, `CheckBox`, `Divider`,
`EmptyState`, `Footer`, `Layout`, `Legend`, `LineChart`, `MetricBox`,
`PageHeader`, `ProgressBar`, `RadioButton`, `RadioGroup`, `Select`, `Skeleton`,
`Sparkline`, `TextArea`, `TextInput`, `ThemeProvider`, `Timeline`, `Toolbar`,
`Typography`, and `ValidationSummary`.

Normally interactive server entries expose stripped static APIs without
callbacks or client-managed behavior. See
[Next.js Server Components](./docs/server-components.md) for details.

You can also import standalone components:

```tsx
import Button from "@boreal-ui/core/Button";
import Card from "@boreal-ui/next/Card";
```

## Components

For deeper consumer API examples, see the [Boreal UI consumer API guides](./docs/README.md). They cover import paths, styling and theming, common component patterns, generated prop docs, public TypeScript types, and contributor workflow.

### Actions

- `Button` supports native buttons, links via `href`, custom elements via `as`, icons, loading states, full-width layout, external links, outline, glass, theme, state, size, rounding, shadow, and ARIA attributes.
- `IconButton` provides compact icon-only actions with accessible labels.
- `ScrollToTop` adds a reusable page action for returning to the top of the viewport.

### Forms and Inputs

- `TextInput` and `TextArea` support labels, helper/error text, validation state, disabled state, sizing, theming, and accessible descriptions.
- `SearchInput`, `NumberInput`, `Select`, `MultiSelect`, `ComboBox`, and `ThemeSelect` cover search, numeric entry, single selection, multi-selection, searchable selection, and color-scheme switching.
- `InputGroup`, `FieldSet`, `SegmentedControl`, and `ValidationSummary` help compose form controls, grouped fields, segmented choices, and form-level errors.
- `CheckBox`, `RadioButton`, `RadioGroup`, `Toggle`, and `Slider` provide common controlled input patterns.
- `ColorPicker` supports color selection flows.
- `DatePicker`, `DateRangePicker`, `DateTimePicker`, and `TimePicker` handle date, date range, date-time, and time input.
- `FileUpload` supports file selection UI.
- `TagInput` supports editable tag lists, async suggestions, debouncing, accessible listbox labeling, and remove-tag controls.
- `FormField` and `FormGroup` help compose labels, helper text, and grouped form controls.

### Data and Content

- `DataTable` supports generic row data, typed columns, sorting, server-side sorting hooks, interactive rows, captions, loading and empty states, row/cell class customization, wrapping cells, striped rows, theme, outline, glass, rounding, shadow, and accessible sort announcements.
- `DataTable` also covers admin/SaaS workflows with pagination, column visibility, column resize/reorder/pinning, row expansion, bulk actions, inline editing, server pagination contracts, and virtualization.
- `Sparkline`, `BarChart`, `LineChart`, `DonutChart`, and `Legend` provide dashboard charting and data summaries.
- `MarkdownRenderer` renders markdown content.
- `Typography` provides semantic text rendering with variants and theme-aware color.
- `MetricBox` displays key values and supporting content.

### Feedback and Status

- `Badge`, `Chip`, and `ChipGroup` cover labels, statuses, and compact selectable or grouped metadata.
- `ProgressBar`, `CircularProgress`, `Spinner`, and `Skeleton` cover loading and progress states.
- `Rating` provides star-style rating UI.
- `Alert`, `Tooltip`, `MessagePopup`, `PopOver`, `Modal`, `ToastProvider`, `NotificationCenter`, and `EmptyState` cover alerts, contextual help, overlays, dialogs, toast notifications, notification lists, and no-data states.

### Navigation and Layout

- `AppShell`, `PageHeader`, `BreadCrumbPageHeader`, `NavBar`, `Sidebar`, `Footer`, `Breadcrumbs`, `TreeView`, `Tabs`, `Stepper`, `Timeline`, `Accordion`, `Pager`, `Toolbar`, `Dropdown`, `Menu`, `Drawer`, `Portal`, `SplitPane`, and `Divider` cover application shells, headers, navigation, page structure, disclosure, pagination, tool rows, menus, overlays, portals, split layouts, and visual separation.
- `Container`, `Grid`, `Inline`, `Section`, and `Stack` provide layout primitives through the `Layout` entry point and the main barrels.
- `Card` supports title, description, icon, header/content/footer customization, loading content, outline, glass, shadow, rounding, theme, and section-level class names.
- `Avatar` supports image, initials, fallback icon, shape, status, status position, size, theme, and custom styling.

## Common Styling Props

Many components share the same styling vocabulary:

| Prop                                 | Values                                                    |
| ------------------------------------ | --------------------------------------------------------- |
| `theme`                              | `primary`, `secondary`, `tertiary`, `quaternary`, `clear` |
| `state`                              | `success`, `error`, `warning`, `disabled`, empty string   |
| `size`                               | `xs`, `small`, `medium`, `large`, `xl`                    |
| `rounding`                           | `none`, `small`, `medium`, `large`, `full`                |
| `shadow`                             | `none`, `light`, `medium`, `strong`, `intense`            |
| `borderWidth` / `defaultBorderWidth` | `none`, `xs`, `small`, `medium`, `large`, `xl`            |
| `outline`                            | outline treatment where supported                         |
| `glass`                              | translucent theme-aware surface where supported           |
| `className` and section class props  | consumer styling hooks where supported                    |
| `data-testid`                        | stable test selectors                                     |

Exact props vary by component. TypeScript and the generated prop docs are the source of truth for each component.

## Global Style Defaults

Call `borealConfig` once before rendering your app to set project-wide defaults. `setBorealStyleConfig` remains available as the explicit API name.

```tsx
import { borealConfig } from "@boreal-ui/core";

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

For Next.js, import the same API from `@boreal-ui/next`:

```tsx
import { borealConfig } from "@boreal-ui/next";
```

Component props still win over global defaults:

```tsx
<Button theme="primary" size="large" shadow="strong">
  Save changes
</Button>
```

## Theme Provider and Color Schemes

`ThemeProvider` manages the active color scheme and writes the scheme into CSS variables used by components.

```tsx
"use client";

import { ThemeProvider } from "@boreal-ui/next";

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

`ThemeProvider` props:

| Prop                   | Description                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `customSchemes`        | Register additional color schemes at runtime.                                            |
| `enableThemeScript`    | Render the pre-hydration theme script. Defaults to `true` for core and `false` for Next. |
| `initialSchemeName`    | Select an initial scheme by name.                                                        |
| `useOnlyCustomSchemes` | Use only custom schemes instead of the built-in list.                                    |

Color scheme shape:

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

You can also use `registerColorScheme` and `defaultColorSchemes`:

```tsx
import {
  defaultColorSchemes,
  registerColorScheme,
  ThemeSelect,
} from "@boreal-ui/core";

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

## Generated Prop Docs

Boreal UI exports generated prop metadata for documentation sites, playgrounds, or prop tables through dedicated docs entry points.

```tsx
import { buttonPropDocs, dataTablePropDocs } from "@boreal-ui/core/docs";

console.log(buttonPropDocs.name);
console.log(dataTablePropDocs.props);
```

The docs export includes `GeneratedComponentDoc` and `GeneratedPropDoc` types, plus one prop-doc object per documented component. Prop docs include `defaultValue` when the component implementation sets a readable default.

For the complete generated prop-doc export list, see [Public API Reference](./docs/public-api-reference.md).

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
} from "@boreal-ui/core";
```

Standalone type entry points are also available:

```ts
import type { SizeType, ThemeType } from "@boreal-ui/types";
```

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

Most components also accept `className`, and larger components expose section-level class props such as `headerClassName`, `contentClassName`, `footerClassName`, `titleClassName`, or similar names where relevant.

## Accessibility and Testing

Boreal UI is designed for Testing Library, Jest, jest-axe, Cypress, and Storybook workflows.

For a full consumer guide, see [Accessibility](./docs/accessibility.md).

- Prefer roles and accessible names in tests.
- Use `data-testid` when a stable selector is needed.
- Icon-only controls should receive an accessible label.
- Helper and error text are connected with ARIA where components support those states.
- Interactive components are built with keyboard behavior and visible focus states in mind.

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@boreal-ui/core";

it("renders an accessible button", () => {
  render(<Button>Submit</Button>);
  expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
});
```

## Development

```bash
npm run dev
npm run storybook:core
npm run storybook:next
npm run test
npm run lint
npm run typecheck
npm run build
```

Useful scripts:

| Script                    | Purpose                                                 |
| ------------------------- | ------------------------------------------------------- |
| `npm run build`           | Build core, Next, docs, and public types.               |
| `npm run test`            | Run Jest tests.                                         |
| `npm run test:coverage`   | Run Jest with coverage.                                 |
| `npm run lint`            | Lint TypeScript and TSX files.                          |
| `npm run lint:styles`     | Lint CSS and SCSS files.                                |
| `npm run audit`           | Run type, lint, style, test, build, and package checks. |
| `npm run gen:docs`        | Regenerate component prop docs.                         |
| `npm run gen:entrypoints` | Regenerate component entry points.                      |
| `npm run gen:exports`     | Regenerate package exports.                             |

Contributor documentation for component structure, generated docs, package output, and release checks lives in [Development Workflow](./docs/development-workflow.md).

## Package Entry Points

```tsx
import { Button } from "@boreal-ui/core";
import Button from "@boreal-ui/core/Button";
import "@boreal-ui/core/globals.css";

import { Button as NextButton } from "@boreal-ui/next";
import NextCard from "@boreal-ui/next/Card";
import "@boreal-ui/next/globals.css";
```

Use the scoped package that matches your framework; pre-alpha builds do not publish a root `boreal-ui` package.

## Contributing

1. Fork this repo.
2. Create a feature branch: `git checkout -b feat/my-component`.
3. Add or update component logic, types, SCSS, tests, stories, and docs metadata as needed.
4. Run the relevant checks.
5. Open a pull request.

When adding or changing a public component, keep the base/core/next architecture aligned: shared behavior in the base component, global SCSS for core, SCSS Modules for Next, and tests that cover accessibility and customization.

## License

MIT (c) [Davin Chiupka](https://davinchiupka.ca)
