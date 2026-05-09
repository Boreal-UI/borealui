# Accessibility

Boreal UI components are designed to provide accessible defaults, but the consuming app still controls the final experience. Use this guide when composing Boreal components into forms, pages, navigation, overlays, dashboards, and application workflows.

## What Boreal UI Handles

Boreal UI components aim to provide:

- Semantic elements where a native element fits the job.
- Keyboard behavior for interactive patterns.
- Visible focus states.
- Disabled-state handling.
- ARIA props for labeling, descriptions, expanded state, pressed state, invalid state, busy state, and live updates where relevant.
- Stable `data-testid` hooks for tests.
- Accessible sorting announcements in `DataTable`.
- Dialog semantics and close controls in `Modal`.
- Label and description wiring in form controls where supported.

Those defaults work best when consumers provide meaningful labels, descriptions, and state values.

## Consumer Responsibilities

You are still responsible for:

- Writing clear visible labels for form fields.
- Providing `aria-label` or `aria-labelledby` for icon-only controls.
- Supplying captions or accessible names for tables.
- Keeping heading order meaningful in the page around Boreal components.
- Preserving focus visibility when overriding styles.
- Testing complete flows with real content, validation states, and async states.
- Checking color contrast when you register custom color schemes or override CSS variables.

## Accessible Names

Interactive controls need an accessible name. Text children usually provide one automatically.

```tsx
import { Button } from "boreal-ui/core";

export function SubmitAction() {
  return <Button type="submit">Submit request</Button>;
}
```

Icon-only controls need an explicit label.

```tsx
import { IconButton } from "boreal-ui/core";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.2 4.8 12 10.6l5.8-5.8 1.4 1.4L13.4 12l5.8 5.8-1.4 1.4L12 13.4l-5.8 5.8-1.4-1.4 5.8-5.8-5.8-5.8 1.4-1.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CloseAction() {
  return <IconButton icon={CloseIcon} aria-label="Close dialog" />;
}
```

Use `aria-labelledby` when a visible element outside the control should provide the name.

```tsx
<h2 id="billing-actions-title">Billing actions</h2>
<Button aria-labelledby="billing-actions-title">Open</Button>
```

## Forms

Prefer visible labels. Do not rely on placeholder text as the only label.

```tsx
import { TextInput } from "boreal-ui/core";

export function EmailField() {
  return (
    <>
      <TextInput
        id="email"
        name="email"
        type="email"
        label="Email"
        aria-describedby="email-help"
        autoComplete="email"
        required
      />
      <p id="email-help">Use the address attached to your account.</p>
    </>
  );
}
```

When showing validation errors, pass the component's error or invalid state props where available so assistive technology receives the same state as sighted users.

```tsx
<>
  <TextInput
    id="project-name"
    name="projectName"
    label="Project name"
    state="error"
    aria-invalid
    aria-describedby="project-name-error"
  />
  <p id="project-name-error">Project name is required.</p>
</>
```

For grouped fields, use `FormGroup`, fieldsets, headings, or helper text so related controls have context.

## Buttons, Links, and Disabled State

Use `Button` for actions and `href` for navigation.

```tsx
<Button type="button" onClick={saveDraft}>
  Save draft
</Button>

<Button href="/settings">Open settings</Button>
```

When a button opens or controls another element, expose that relationship.

```tsx
<Button
  aria-controls="project-menu"
  aria-expanded={menuOpen}
  aria-haspopup="menu"
  onClick={() => setMenuOpen((open) => !open)}
>
  Project actions
</Button>
```

Avoid using disabled controls as the only way to explain what happened. Pair disabled states with visible helper text when the reason is not obvious.

## Tables

Give `DataTable` a caption, `aria-label`, or `aria-labelledby`.

```tsx
import { DataTable } from "boreal-ui/core";

<DataTable
  caption="Invoices"
  columns={columns}
  data={rows}
  rowKey={(row) => row.id}
/>;
```

Use `caption` for the clearest built-in table label. Use `hideCaption` when the table needs a semantic caption but the page already has a visible heading.

```tsx
<h2 id="invoice-table-heading">Invoices</h2>
<DataTable
  aria-labelledby="invoice-table-heading"
  caption="Invoices"
  hideCaption
  columns={columns}
  data={rows}
/>;
```

For interactive rows, provide labels that explain the action.

```tsx
<DataTable
  columns={columns}
  data={rows}
  onRowClick={(row) => openInvoice(row.id)}
  getRowAriaLabel={(row) => `Open invoice ${row.id}`}
/>;
```

## Dialogs and Overlays

`Modal` should have a visible `title`, `aria-label`, or `aria-labelledby`. Add `aria-describedby` when supporting text explains the decision.

```tsx
import { Button, Modal } from "boreal-ui/core";

export function DeleteProjectDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete project"
      aria-describedby="delete-project-description"
      closeButtonAriaLabel="Close delete project dialog"
    >
      <div>
        <p id="delete-project-description">
          This removes the project and its saved dashboard settings.
        </p>
        <Button state="warning">Delete project</Button>
      </div>
    </Modal>
  );
}
```

For `Dropdown`, `PopOver`, `Tooltip`, `Tabs`, `Accordion`, and `CommandPalette`, prefer the component's public props for labels and state. Avoid adding custom roles to wrapper elements unless the component API asks for them.

## Loading and Async States

Use loading props and busy/live-region props where available.

```tsx
<Button loading loadingLabel="Saving changes" aria-live="polite">
  Save changes
</Button>
```

For content regions that update after async work, pair visual loading states with text that explains the state.

```tsx
<DataTable
  aria-label="Search results"
  columns={columns}
  data={rows}
  loading={isLoading}
  loadingMessage="Loading search results"
  emptyMessage="No matching results"
/>;
```

## Custom Color Schemes and Contrast

Boreal derives foreground tokens for each registered color scheme with a WCAG 2.1 AA normal-text contrast target. If `forceTextColor` does not meet that target on a surface, the theme runtime falls back to the more readable black or white foreground for that surface.

When registering custom schemes, still verify borders, focus indicators, success/error/warning states, outline variants, glass surfaces, and any app-specific CSS variable overrides against the backgrounds where they appear.

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

<ThemeProvider customSchemes={schemes} initialSchemeName="Brand Night">
  <App />
</ThemeProvider>;
```

If you override `--focus-outline-color`, make sure it is visible on light, dark, glass, outlined, and themed surfaces.

## Styling Without Breaking Accessibility

When overriding styles:

- Do not remove outlines unless you replace them with an equally visible focus style.
- Avoid `display: none` for content that should remain available to screen readers.
- Do not make disabled content look interactive.
- Keep touch targets large enough for repeated use.
- Check responsive layouts below 500px so labels, helper text, and controls do not overlap.

```css
.app-action:focus-visible {
  outline: 2px solid var(--focus-outline-color);
  outline-offset: 2px;
}
```

## Testing

Use Testing Library role and name queries first.

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "boreal-ui/core";

it("renders an accessible submit button", () => {
  render(<Button type="submit">Submit request</Button>);

  expect(
    screen.getByRole("button", { name: /submit request/i }),
  ).toBeInTheDocument();
});
```

Use `jest-axe` for automated accessibility checks.

```tsx
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { TextInput } from "boreal-ui/core";

it("has no accessibility violations", async () => {
  const { container } = render(<TextInput label="Email" name="email" />);

  expect(await axe(container)).toHaveNoViolations();
});
```

Automated checks are not enough on their own. Also test:

- Keyboard navigation through the complete workflow.
- Focus order and focus return after overlays close.
- Screen reader names for icon-only and custom controls.
- Error messages and helper text.
- Loading and empty states.
- Custom themes and contrast.

## Quick Checklist

Before shipping a page that uses Boreal UI:

- Every control has an accessible name.
- Every form field has a visible label or explicit ARIA label.
- Icon-only controls have `aria-label`.
- Tables have a caption or accessible label.
- Dialogs have a title or accessible label.
- Focus is visible after custom styling.
- Validation errors are visible and announced through descriptions or invalid state.
- Loading states include meaningful text.
- Custom themes pass contrast checks.
- Tests use roles and accessible names before test IDs.
