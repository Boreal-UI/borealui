# Select forms and DataTable scrolling

Runnable examples are in **Components/Select → Native Forms** and
**Components/DataTable → Accessible Scrolling** in both Storybooks. Start with
`npm run storybook:core` or `npm run storybook:next`. The examples import the
actual wrappers and share the same examples used by browser regression tests.

## Select

- Controlled: `value?: string` with `onChange?: (value: string) => void`.
  Supply both when controlling a writable field. Programmatic value changes
  update the native selection and submitted value. Keep the same mode throughout
  the field's lifetime; do not combine `value` and `defaultValue`.
- Uncontrolled: `defaultValue?: string`; selection and reset are browser-owned.
  `onChange` can optionally observe changes without controlling the field.
- An option `{ value: "", label: "All statuses" }` is a normal enabled option.
  It submits `""` through `FormData` without an extra input. The default disabled,
  hidden `"Select an option"` placeholder is added only when no empty option
  exists. `placeholder="Choose format"` customizes it; `placeholder={null}`
  suppresses it. There are never two options competing for the empty value.
- `required`, `disabled`, `name`, `form` and option `disabled` retain native
  behavior. A first empty option in a required single select fails native
  validity; disabled selects are omitted from `FormData`. Disabled options are
  unavailable to ordinary user interaction.
- `ref` reaches the native `HTMLSelectElement` in core and client Next wrappers.
  Visible labels are associated with the select. `aria-describedby`,
  `aria-description`, `helperText`, and `errorMessage` preserve descriptions and
  error associations.
- Reset does not invoke `onChange`. Uncontrolled selects restore their default;
  controlled selects restore their current supplied value. Boreal aligns native
  option reset defaults with controlled selection, including React 19 action
  form automatic resets. Other uncontrolled fields in the form still reset.
  An action can deliberately clear a controlled field by updating its state.
- The server Select renders native initial values and the same empty-option
  policy. Its existing `value` alias initializes `defaultValue`; it does not
  implement client-side controlled state or callbacks. Use the client wrapper
  for controlled React action forms.

```tsx
<Select name="status" label="Status" defaultValue="" options={[
  { value: "", label: "All statuses" },
  { value: "published", label: "Published" },
]} />

<Select name="format" label="Format" required placeholder="Choose format"
  options={[{ value: "print", label: "Print" }]} />
```

The shared `SelectNativeExamples.tsx` contains complete controlled publication
action and uncontrolled reset forms, including observable submitted values.

## DataTable

`scrollRegionProps?: React.HTMLAttributes<HTMLDivElement>` configures the outer
horizontal scroller, retaining the existing table/toolbar/pagination layout.
This region has `role="region"` and `tabIndex={0}` by default **even when it does
not overflow**. This predictable extra tab stop is intentional: it works in SSR,
does not depend on measurement, and remains correct as content or layout changes.
Arrow keys use native browser scrolling. The region's own `:focus-visible` ring
uses the existing focus token, inset so the scroll container does not clip it.
Virtualized tables retain their separate vertical viewport.

Naming precedence:

1. Explicit `scrollRegionProps['aria-labelledby']` takes accessible-name priority.
2. Explicit `scrollRegionProps['aria-label']` replaces automatic naming.
3. Otherwise the region references the rendered caption, including hidden captions.
4. Without a caption, table `aria-labelledby`, then table `aria-label`, then
   `"Data table"` provide the fallback.

Names and caption IDs render on the server. Give each table a meaningful distinct
caption; the generic default cannot distinguish multiple tables. Table caption,
headers, and native table semantics remain intact.

Other region props (including `id`, `title`, `style`, events, `role`, and
`tabIndex`) apply directly. `className` merges with Boreal styles; the root
`testId`/`data-testid` API remains authoritative for its test ID. Explicit
`tabIndex={-1}` opts out of sequential keyboard access, so use that only when
another accessible scrolling strategy exists.

```tsx
<DataTable data={publications} columns={columns} caption="Publications" />
<DataTable data={members} columns={columns} caption="Members"
  scrollRegionProps={{ 'aria-label': 'Member directory, scroll for details', title: 'Use arrow keys to scroll' }} />
```

With `onRowClick`, direct row clicks and Enter/Space on the row itself activate
the row. Descendant links, buttons, form controls, labels, disclosure summaries,
editable content, focusable elements and custom ARIA interactive roles keep their
own behavior without activating the row. Mark custom interactive elements with
appropriate semantics and keyboard support (`role`/`tabIndex`). Boreal does not
cancel nested events, so normal links and modified link clicks remain native.
The shared `DataTableScrollExamples.tsx` demonstrates links and Edit buttons
inside clickable rows without propagation wrappers.

## Verification

`node scripts/testSelectDataTableBrowser.cjs` runs standalone Chromium checks
for native keyboard scrolling, focus visibility, modified-click new tabs, normal
link navigation, disabled-option keyboard behavior, and React 19 action resets.
It starts and stops its own local Vite fixture server on port 4179 and writes
focus screenshots to `out/select-datatable-browser/`. It requires the installed Playwright
Chromium browser (`npx playwright install chromium` if not already installed).
To use installed Chrome instead, set `BOREAL_BROWSER_CHANNEL=chrome`.
The standalone page avoids Cypress iframe limitations on native scroll defaults.
Cypress component specs additionally cover Core/Next focus, layout, interactions
and forms; Jest covers SSR/hydration, FormData, reset, and accessibility.

## Migration guide

Remove Select empty-value sentinels and hidden inputs; use an enabled empty
option. Remove controlled publication Select remount keys and form reset
prevention. Remove DataTable post-hydration `aria-label`/`tabIndex` mutations;
provide captions or `scrollRegionProps`. Remove nested-control propagation
wrappers. Keep HTML-table-to-data adapters and business validation unchanged.

Existing controlled string callbacks, native refs and nonempty-option placeholder
usage remain compatible. Previously broken empty options now take precedence over
the placeholder. If a field needs an explicit unselected state, use a placeholder
with nonempty options; a valid empty choice and the unselected placeholder cannot
both be distinguished by the same native empty string.
