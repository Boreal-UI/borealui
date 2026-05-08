# AGENTS.md

Guidance for AI agents and contributors editing Boreal UI.

Boreal UI is a React + Next.js component library with a shared `base`, `core`, and `next` component architecture. The project prioritizes accessibility, theming, reusable styling patterns, testability, and clean package output for both React and Next.js consumers.

---

## Project Goals

When editing this project, preserve these goals:

1. Components should be accessible by default.
2. Components should support both React core and Next.js builds.
3. Shared logic should live in base components whenever possible.
4. Core components should use global SCSS class names.
5. Next components should use SCSS Modules.
6. Consumers should be able to customize appearance through props, class names, CSS variables, and the Boreal theme system.
7. Components should be easy to test with Testing Library, Jest, jest-axe, and Cypress.
8. Package output should remain tree-shakeable and safe for Next.js client/server boundaries.

---

## Component Structure

Most components should follow this structure:

```txt
src/components/ComponentName/
  ComponentName.types.ts
  ComponentNameBase.tsx
  core/
    ComponentName.tsx
    ComponentName.scss
  next/
    ComponentName.tsx
    ComponentName.module.scss
  __tests__/
    ComponentName.test.tsx
  ComponentName.stories.tsx
```

Some components may have additional files for hooks, helpers, constants, or subcomponents.

### Base Component

The base component owns shared rendering logic.

Use the base component for:

- ARIA logic
- keyboard handling
- state management
- derived class names
- conditional rendering
- event normalization
- shared layout structure
- test IDs
- framework-neutral behavior

Base components should not directly import SCSS.

Preferred base pattern:

```tsx
type ComponentNameBaseProps = {
  classMap: Record<string, string>;
  className?: string;
  testId?: string;
};
```

Use `classMap` to inject framework-specific classes from either the core or next wrapper.

For newer base components, prefer a single `styles` or `classMap` object instead of many individual class props unless the component already uses a stable API.

---

## Core Components

Core components are for standard React usage.

Core components should:

- import global SCSS directly
- pass plain string class names into the base component
- avoid CSS Modules
- export a default React component

Example:

```tsx
import "./Button.scss";
import ButtonBase from "../ButtonBase";
import { ButtonProps } from "../Button.types";

const classes = {
  button: "button",
  primary: "button_primary",
  secondary: "button_secondary",
};

export default function Button(props: ButtonProps) {
  return <ButtonBase {...props} classMap={classes} />;
}
```

Core SCSS should use flattened class names:

```scss
.button {
  // base styles
}

.button_primary {
  // primary theme
}

.button_outline {
  // outline variant
}
```

Do not use SCSS Modules in `core`.

---

## Next Components

Next components are for Next.js consumers.

Next components should:

- use `"use client"` when the component uses hooks, browser APIs, events, state, refs, or context
- import SCSS Modules
- pass the imported module object into the base component
- preserve compatibility with Next.js app router

Example:

```tsx
"use client";

import styles from "./Button.module.scss";
import ButtonBase from "../ButtonBase";
import { ButtonProps } from "../Button.types";

export default function Button(props: ButtonProps) {
  return <ButtonBase {...props} classMap={styles} />;
}
```

Next SCSS Modules should use flattened class names, not deeply nested selectors.

```scss
.button {
  // base styles
}

.button_primary {
  // theme modifier
}

.button_outline {
  // variant modifier
}
```

Avoid relying on generated module class names in tests.

---

## Class Name Rules

Use `combineClassNames` from:

```ts
import { combineClassNames } from "@/utils/classNames";
```

Prefer this over manual string concatenation.

Good:

```tsx
const buttonClassName = combineClassNames(
  classMap.button,
  classMap[theme],
  disabled && classMap.disabled,
  className,
);
```

Avoid:

```tsx
const buttonClassName = `${styles.button} ${styles[theme]} ${className}`;
```

When adding new style props, update all three layers:

1. Type definitions
2. Base component class logic
3. Core and Next class maps/styles

---

## Styling Conventions

Boreal UI uses SCSS, CSS variables, and theme maps.

Use design tokens whenever possible:

```scss
color: var(--text-color);
background: var(--background-color);
border-radius: var(--border-radius-md);
box-shadow: var(--box-shadow-md);
transition: var(--transition-default);
font-family: var(--font-family-ui);
```

Avoid hardcoding values unless the value is component-specific and unlikely to become a token.

Preferred:

```scss
padding: var(--spacing-sm);
```

Avoid:

```scss
padding: 12px;
```

---

## Flattened BEM Naming

Use flattened BEM-style class names.

Good:

```scss
.card
.card_header
.card_content
.card_icon
.card_primary
.card_outline
.card_shadowStrong
.card_roundLarge
```

Avoid deeply nested selectors:

```scss
.card {
  .header {
    .icon {
    }
  }
}
```

This is especially important for SCSS Modules, because nested selectors can become harder to map through `classMap`.

---

## Theme Mapping

Theme variants should usually be generated from the shared theme map.

Preferred pattern:

```scss
@use "../../../styles/theme" as theme;
@use "sass:map";

.card {
  @each $name, $props in theme.$themes {
    &_#{$name} {
      background: map.get($props, bg);
      color: map.get($props, text);
      border-color: map.get($props, border);

      .card_icon,
      .card_description {
        color: inherit;
      }
    }

    &_#{$name}.card_outline {
      background: transparent;
      border-color: map.get($props, border);
      color: map.get($props, text);
    }
  }
}
```

When adding a new theme-aware visual feature, update the theme map if the values need to vary per theme.

Examples:

```scss
glass-bg
glass-hover
glass-border
text
bg
border
hover
active
```

---

## Glass Styling

Glass variants should not leave the component with a solid theme background.

When adding or editing a `glass` prop:

1. Add the prop to the component types.
2. Add the class condition in the base component.
3. Add the class to the core class map.
4. Add the class to the next class map.
5. Add SCSS for both core and module styles.
6. Add Storybook examples.
7. Add Jest tests.

Recommended SCSS pattern:

```scss
.card_glass {
  background: var(--card-glass-bg);
  color: var(--card-glass-text);
  border-color: var(--card-glass-border);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  box-shadow: var(--box-shadow-md);
}

.card_glass:hover {
  background: var(--card-glass-hover-bg);
}
```

Theme variants should assign glass variables:

```scss
@each $name, $props in theme.$themes {
  .card_#{$name} {
    --card-glass-bg: #{map.get($props, glass-bg)};
    --card-glass-hover-bg: #{map.get($props, glass-hover)};
    --card-glass-border: #{map.get($props, glass-border)};
    --card-glass-text: #{map.get($props, text)};
  }
}
```

Do not make glass styling only a border effect. It should visibly affect background, border, and hover state.

---

## Custom Class Name Props

Many components support consumer class overrides.

When adding section-level class customization, preserve the original API and add optional class props.

Example for Card:

```ts
type CardProps = {
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};
```

Apply custom class names alongside internal classes:

```tsx
<div className={combineClassNames(classMap.content, contentClassName)}>
  {children}
</div>
```

Do not replace internal classes with consumer classes. Always merge them.

---

## Conditional Rendering

Avoid rendering empty structural wrappers.

Example:

```tsx
const hasHeader = renderHeader || title || cardIcon;

return hasHeader ? (
  <div className={combineClassNames(classMap.header, headerClassName)}>
    {renderHeader ? renderHeader() : titleContent}
  </div>
) : null;
```

For Card specifically, the header should not render if there is no title, icon, or custom header.

---

## Accessibility Requirements

Every interactive component must be accessible by default.

Use semantic HTML first.

Preferred:

```tsx
<button type="button">Open</button>
```

Only use ARIA when semantic HTML is not enough.

### Required Patterns

Interactive components should support:

- keyboard navigation
- visible focus states
- disabled states
- ARIA labels when icon-only
- `aria-describedby` for helper/error text where relevant
- stable `id` fallbacks
- `data-testid` support
- screen reader announcements where useful

### Avoid Invalid ARIA

Do not add ARIA attributes to elements where they are not allowed.

Examples:

- `aria-modal` belongs on elements with `role="dialog"` or `role="alertdialog"`
- `aria-required` should not be placed on unsupported elements
- `aria-hidden` should be a boolean-like string in rendered HTML, not an unresolved expression
- invalid role values should never be used

### Focus Styling

Avoid broad focus selectors inside components.

Problematic:

```scss
.card :focus-visible {
  outline: 2px solid var(--focus-outline-color);
}
```

This can create double outlines when components are nested inside cards.

Prefer targeted focus styles:

```scss
.card_focusable:focus-visible {
  outline: 2px solid var(--focus-outline-color);
  outline-offset: 2px;
}
```

For wrapper components, avoid styling all child focus states unless the component is specifically responsible for focus management.

---

## Test IDs

All components should support a `testId` prop.

Default pattern:

```tsx
const resolvedTestId = testId ?? "component-name";
```

Use predictable child IDs:

```tsx
data-testid={`${resolvedTestId}-icon`}
data-testid={`${resolvedTestId}-label`}
data-testid={`${resolvedTestId}-content`}
```

Tests should prefer roles and accessible names first, then test IDs when necessary.

Good:

```tsx
screen.getByRole("button", { name: /submit/i });
```

Acceptable:

```tsx
screen.getByTestId("button-icon");
```

---

## Jest Test Expectations

When adding or changing component behavior, update Jest tests.

Tests should cover:

1. Basic rendering
2. Custom class names
3. Theme classes
4. Variant classes
5. Size classes
6. Disabled behavior
7. ARIA behavior
8. Keyboard interactions
9. Conditional rendering
10. Accessibility with `jest-axe`

Example:

```tsx
import { axe } from "jest-axe";

it("has no accessibility violations", async () => {
  const { container } = render(<Button>Save</Button>);
  expect(await axe(container)).toHaveNoViolations();
});
```

When testing SCSS Modules, mock classes should match the keys used in the component.

Example:

```ts
const mockStyles = {
  button: "button",
  primary: "primary",
  glass: "glass",
};
```

Do not assert generated CSS Module hashes.

---

## Cypress Test Expectations

Use Cypress for real browser behavior where useful.

Good Cypress targets:

- keyboard navigation
- focus trap behavior
- menu/dropdown interaction
- drag and drop
- file upload behavior
- responsive layout
- visual interaction states

Use `data-testid` for stable selectors.

```ts
cy.get('[data-testid="dropdown-trigger"]').click();
```

---

## Storybook Guidelines

Every component should have stories for common variants.

Recommended story groups:

- Default
- Themes
- Sizes
- Outline
- Glass, when supported
- Disabled
- Custom class names
- Accessibility examples
- Component-specific variants

For documentation pages, keep example tabs consistent when possible:

```txt
default
outline
themes
sizes
special/component-specific examples
```

For variant generation helpers, include new props in the variant matrix.

Example:

```tsx
export const GlassThemeVariants = () =>
  withVariants(Card, { ...defaultArgs, glass: true }, [
    { propName: "theme", values: [...themeOptions] },
  ]);
```

---

## Responsive Styling

Components and documentation pages should work below 500px width.

Important rules:

```scss
min-width: 0;
max-width: 100%;
overflow-wrap: anywhere;
```

For code blocks and tables:

```scss
.codeBlock,
.tableWrapper {
  max-width: 100%;
  overflow-x: auto;
}
```

For grid layouts:

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
}
```

Avoid fixed widths unless paired with responsive overrides.

Problematic:

```scss
width: 600px;
```

Preferred:

```scss
width: min(100%, 600px);
```

---

## DataTable Guidelines

Tables should not cut off content.

Wrap tables in a scroll container:

```scss
.data_table_wrapper {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
}
```

Cells should handle long content:

```scss
.data_table_cell {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: normal;
}
```

Avoid deprecated values:

```scss
word-break: break-word;
```

Prefer:

```scss
overflow-wrap: anywhere;
word-break: normal;
```

---

## Forms and Inputs

Form components should support:

- `id`
- `name`
- `label`
- `aria-label`
- `aria-labelledby`
- `aria-describedby`
- `required`
- `disabled`
- `error`
- `helperText`
- `testId`

If a visible label is not provided, ensure an accessible label is still available.

Do not rely only on placeholder text as a label.

---

## Button and IconButton Guidelines

Buttons should support:

- `as`
- `href`
- `type`
- `disabled`
- `aria-label` for icon-only buttons
- `icon`
- `iconPosition`
- `theme`
- `size`
- `rounding`
- `shadow`
- `outline`
- `glass`
- `testId`

If rendering a custom element with `as`, ensure the result still has appropriate button semantics when needed:

```tsx
role="button"
tabIndex={0}
```

Only add these when the rendered element is not naturally interactive.

---

## Card Guidelines

Cards should support direct customization of major sections:

- root
- header
- title
- icon
- description
- content
- footer
- loading area

Do not render the header if no header content exists.

Avoid broad child focus selectors.

Support `glass`, `outline`, `shadow`, `rounding`, and theme combinations.

---

## Toolbar Guidelines

Toolbar should allow direct styling of its title.

Recommended prop:

```ts
titleClassName?: string;
```

When adding toolbar modifiers like `attachment`, ensure the class is actually wired through the base component and maps.

Example issue to avoid:

```txt
Expected class: sticky
Received: toolbar secondary customToolbar shadowStrong roundLarge
```

This means the prop exists but the class mapping was not applied.

---

## Typography Guidelines

Typography should respect theme text color.

When variant or theme is `inherit`, prefer:

```scss
color: var(--text-color);
```

Avoid resolving inherited text to white on light backgrounds.

Typography should support semantic element overrides through an `as` prop where applicable.

---

## Theme Provider Guidelines

The theme system supports custom color schemes.

Important ThemeProvider props:

```ts
type ThemeProviderProps = {
  children: ReactNode;
  customSchemes?: ColorScheme[];
  initialSchemeName?: string;
  useOnlyCustomSchemes?: boolean;
};
```

Expected behavior:

- `customSchemes` registers additional schemes.
- `initialSchemeName` should be able to override saved localStorage values when explicitly provided.
- `useOnlyCustomSchemes` should allow consumers to ship only their custom schemes.
- Theme selection should update CSS variables.
- Avoid requiring consumers to import many default schemes if they do not need them.

---

## Global Style Config

Boreal UI supports global defaults through `setBorealStyleConfig`.

Example:

```ts
setBorealStyleConfig({
  defaultTheme: "secondary",
  defaultSize: "medium",
  defaultRounding: "medium",
  defaultShadow: "soft",
  defaultBorderWidth: "thin",
  defaultColorSchemeName: "Cyberpunk Pulse",
});
```

When adding a prop that should support global defaults:

1. Add it to the config type.
2. Add a default value.
3. Resolve the prop in the component with local prop first, config fallback second.
4. Add tests.
5. Add Storybook coverage.

---

## Package and Build Rules

The library has separate core and next outputs.

Keep package exports stable.

Expected consumer imports:

```ts
import { Button } from "boreal-ui/core";
import { Button } from "boreal-ui/next";
import Button from "boreal-ui/next/Button";
```

Global styles:

```ts
import "boreal-ui/core/globals.css";
import "boreal-ui/next/globals.css";
```

Do not break these paths without updating `package.json` exports.

### Next.js Client Boundaries

Any Next component that uses React hooks, browser APIs, context, event handlers, refs, or state must include:

```tsx
"use client";
```

Ensure build tooling preserves this directive.

---

## CSS Import Rules

Consumers should usually import global styles once.

Components may import their own component styles.

Do not require consumers to manually import every component stylesheet.

Core component:

```tsx
import "./Component.scss";
```

Next component:

```tsx
import styles from "./Component.module.scss";
```

Global variables and animations should come from the global stylesheet.

---

## Linting and Compatibility

Avoid deprecated or poorly supported CSS where possible.

Be cautious with:

```scss
color-mix()
```

If used, provide a reasonable fallback when compatibility matters.

Avoid deprecated values like:

```scss
word-break: break-word;
```

Prefer:

```scss
overflow-wrap: anywhere;
word-break: normal;
```

Keep SCSS nesting shallow.

Use SCSS maps and loops for repeated theme/state variants.

---

## Adding a New Component

When creating a new component:

1. Create `ComponentName.types.ts`.
2. Create `ComponentNameBase.tsx`.
3. Create `core/ComponentName.tsx`.
4. Create `core/ComponentName.scss`.
5. Create `next/ComponentName.tsx`.
6. Create `next/ComponentName.module.scss`.
7. Add Jest tests.
8. Add Cypress tests when interaction-heavy.
9. Add Storybook stories.
10. Add exports to core, next, and package entry points.
11. Add docs page if the component is public.
12. Add component to any registry/list used by the docs site.

---

## Editing an Existing Component

Before editing:

1. Check the base component first.
2. Check both core and next wrappers.
3. Check both SCSS files.
4. Check tests.
5. Check stories.
6. Check exports if the public API changes.

When adding a prop, update:

```txt
ComponentName.types.ts
ComponentNameBase.tsx
core/ComponentName.tsx
next/ComponentName.tsx
core/ComponentName.scss
next/ComponentName.module.scss
ComponentName.test.tsx
ComponentName.stories.tsx
docs page, if applicable
```

---

## Accessibility Checklist

Before finishing component work, verify:

- The component has a meaningful role or semantic element.
- Interactive elements are keyboard accessible.
- Focus is visible.
- Disabled state is communicated correctly.
- Icon-only controls have accessible names.
- Error/helper text is connected with `aria-describedby`.
- Dialog-like components use valid dialog semantics.
- No invalid ARIA attributes are present.
- `jest-axe` passes.
- Tests do not rely only on implementation details.

---

## Styling Checklist

Before finishing styling work, verify:

- Core and Next styles both updated.
- CSS variables are used where appropriate.
- Theme map integration works.
- Outline, shadow, rounding, size, and theme variants still work.
- Responsive styles work below 500px.
- No broad selectors accidentally override nested components.
- No generated CSS Module class names are used directly.
- No important consumer override paths were removed.

---

## Testing Checklist

Before finishing test work, verify:

- Tests cover the new prop or behavior.
- Existing behavior is still covered.
- ARIA behavior is tested.
- Custom class names are tested.
- `data-testid` behavior is tested.
- `jest-axe` passes.
- Tests work for both base behavior and wrapper behavior where appropriate.

---

## Common Pitfalls

### Prop exists but class is missing

If a test expects a class like `sticky`, `glass`, or `large`, check:

1. Is the prop in the type?
2. Is the class added in the base component?
3. Is the class key present in the core class map?
4. Is the class key present in the next styles object?
5. Does the SCSS class exist?

### Style overridden unexpectedly

Check specificity and order.

Prefer modifier classes on the same element:

```scss
.card.card_glass {
  // stronger than .card
}
```

For CSS Modules, make sure the modifier class is applied to the same node as the base class when the selector expects both.

### Component breaks in Next.js

Check for missing:

```tsx
"use client";
```

Also confirm that the export points to the Next wrapper, not the base component directly.

### Table or code block cut off on mobile

Add a wrapper with:

```scss
max-width: 100%;
overflow-x: auto;
```

Also ensure children have:

```scss
min-width: 0;
```

### Double focus outline

Avoid parent selectors like:

```scss
.component :focus-visible
```

Use targeted focus styles instead.

---

## Preferred Response Style for Code Changes

When suggesting edits, provide complete updated files or clearly marked patches.

Prefer this structure:

```txt
1. Update the type
2. Update the base component
3. Update the core wrapper/styles
4. Update the next wrapper/styles
5. Update stories
6. Update tests
```

When only one file is needed, provide the full updated file.

---

## Boreal UI Design Direction

Boreal UI should feel:

- polished
- accessible
- modern
- customizable
- developer-friendly
- theme-driven
- suitable for production apps and documentation sites

Visual patterns may include:

- soft shadows
- rounded corners
- glass effects
- clean grid layouts
- theme-aware color systems
- responsive bento-style layouts
- clear focus states
- minimal but useful animation

Animations should improve clarity and should not interfere with usability.

---

## Final Rule

When in doubt, preserve the existing public API and extend it carefully.

Do not remove consumer customization paths unless replacing them with a better documented alternative.
