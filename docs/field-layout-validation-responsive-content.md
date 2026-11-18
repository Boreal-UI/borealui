# Field layout, validation presentation and responsive content

Run either Storybook (`npm run storybook:core` or `npm run storybook:next`) and
open **Recipes / Fields, actions and tables / Responsive Composition**. Both
stories render `shared-story-assets/FieldCompositionExamples.tsx`, the same
recipe exercised by the browser suite. It includes email/server feedback,
blur-and-correct validation, a required Select placeholder, notes with an external
description, a failed action that retains values, narrow wrapping actions, a
documents table and an intentionally wide financial table.

## Field API and slots

TextInput, TextArea and Select share:

| Prop | Target or behavior |
| --- | --- |
| `helperText` | Visible description beneath the control |
| `errorMessage` | Visible error beneath the description; implies error presentation |
| `invalid` | Error presentation without requiring text |
| `errorLive` | `"off"` (default), `"polite"`, or `"assertive"` |
| `fullWidth` | Fill the parent through layout and control wrappers |
| `rootClassName` | Outer field layout, including label and feedback |
| `labelClassName` | Visible native label |
| `controlClassName` | Native input, textarea, or select |
| `descriptionClassName` | Visible `helperText` element |
| `errorClassName` | Visible `errorMessage` element |

Existing customization props keep their targets and merge with the common aliases:

| Component | `className` | Existing outer slot | Existing native slot |
| --- | --- | --- | --- |
| TextInput | Visual control wrapper | `containerClassName` | `inputClassName` |
| TextArea | Visual control wrapper | `containerClassName` | `inputClassName` |
| Select | Visual control wrapper | `layoutClassName` | `selectClassName` |

All three also accept `helperTextClassName` and `errorMessageClassName`; these
merge with `descriptionClassName` and `errorClassName`. Existing icon, password
toggle, resize-handle and screen-reader slots remain supported. Consumer classes
are always added alongside internal classes, never substituted for them.

```tsx
<TextInput
  fullWidth label="Email" type="email" name="email"
  value={email} onChange={setEmail}
  helperText="We use this address for publication updates."
  errorMessage={serverErrors.email}
  rootClassName="emailField" errorClassName="emailFeedback"
/>

<Select fullWidth required label="Format" name="format" defaultValue=""
  placeholder="Choose a format" errorMessage={errors.format}
  options={[{ value: "print", label: "Print" }, { value: "digital", label: "Digital" }]} />

<p id="notes-policy">Editorial policy applies.</p>
<TextArea fullWidth rows={4} label="Notes" aria-describedby="notes-policy"
  helperText="Include relevant editorial context." errorMessage={errors.notes} />
```

No application-generated error ID or duplicate error markup is needed. Caller
`aria-describedby` references (and TextArea's existing `describedBy` alias) merge
with generated IDs, with duplicate references removed. Each field's IDs are
unique, stable through rerenders, and generated during SSR using React `useId`.
Clearing `errorMessage` removes both its markup and generated association.
TextArea retains its existing `aria-errormessage` compatibility, including an
explicit external override; descriptions also include the rendered error.

### Precedence and announcements

1. A nonempty `errorMessage`, `invalid={true}`, or `state="error"` resolves the
   visual state to error. Error presentation takes priority over success/warning/info.
2. Explicit `aria-invalid` wins for the native ARIA attribute, including `false`.
   Otherwise the attribute is inferred from resolved error presentation.
   An explicit ARIA override does not hide feedback or change visual state.
   Avoid contradictory overrides unless your accessibility flow needs them.
3. When an error clears, `invalid` or `state="error"` can still keep error
   presentation active. Clear those as well when appropriate.

Rendered errors are **static by default**, associated with the field and read
when it receives focus. They no longer automatically have `role="alert"`.
Use `errorLive="polite"` when a particular field needs live updates; avoid live
errors on every keystroke. Assertive announcements require explicit opt-in.
The action recipe uses one polite form-level status with a short instruction,
and leaves field errors static, so it does not repeat each error's text.
Screen-reader/browser combinations differ in announcing newly mounted live
regions; a persistent form-level status is preferable for submission summaries.

These components perform no business validation and choose no validation timing.
Use native validation attributes, consumer-controlled state, or any server/library
validator. The blur recipe derives an error from `touched` and the current value;
the server recipe uses a controlled input and React `useFormStatus` for pending
presentation, retaining the entered value after a failed submission. Inputs and
textareas keep native controlled/uncontrolled behavior, events, refs, and form
submission. Select retains the P0 native empty-option and controlled-reset contract.
Select now also forwards ordinary native attributes/events such as `onBlur` and
`onFocus`, while retaining its string `onChange` callback.

## Heights, width and spacing

Equivalent single-line size variants share these CSS tokens:

| Size | Token | Default at a 16px root font |
| --- | --- | --- |
| xs | `--control-height-xs` | 1.75rem / 28px |
| small (`sm`) | `--control-height-small` | 2rem / 32px |
| medium (`md`) | `--control-height-medium` | 2.5rem / 40px |
| large (`lg`) | `--control-height-large` | 3rem / 48px |
| xl | `--control-height-xl` | 3.5rem / 56px |

TextInput (including native date inputs), Select, and nonwrapping Button use the
same surface heights. Buttons can grow beyond the minimum when wrapping. TextArea
remains multiline: `rows`, `height`, native `style`, and `resizable` govern its
size; it is never forced to a single-line height.

Fields have no external margins. Labels and feedback share typography tokens and
`--spacing-xs` gaps. Labels and feedback wrap, including long unbroken text.
Side labels use bounded, shrinkable columns so long labels cannot displace the
control off the page. Existing `labelPosition` values remain supported.

Use `fullWidth` for predictable filling; a normal field remains intrinsically
sized within its parent's maximum width. Layout and visual wrappers have
`min-width: 0` and `max-width: 100%`. Consumer flex/grid tracks must also allow
their **own** panels to shrink; Boreal cannot alter ancestors.

The toolbar recipe uses a flex parent with `align-items: end`, `gap`, and
`flex-wrap: wrap`, and labelled native controls through `aria-label`. It compares
text, date, select and button surfaces at each size. Labelled forms with feedback
should use the recipe's separate field grid rather than align actions against
the bottom of an entire field including its feedback.

```css
.fieldGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1rem;
  min-width: 0;
}
.emailField { --control-height-medium: 2.75rem; }
```

Import global styles once as documented. Component sidecars provide height-token
fallbacks; applications can override the tokens on a field root or containing panel.

## Responsive Button

`wrapLabel?: boolean` defaults to `false`, preserving single-line labels. At a
constrained width the single line truncates visually while retaining its full
accessible name. `wrapLabel` permits ordinary wrapping and breaks unbroken text
with `overflow-wrap: anywhere`. `fullWidth` fills its container without the former
desktop 640px cap. Wrapping buttons use a minimum height and grow vertically.

```tsx
<Button fullWidth wrapLabel icon={ArrowRightIcon}>
  Save automation settings and return to the project
</Button>
<Button fullWidth wrapLabel loading={pending}
  loadingLabel="Saving automation settings and retaining your email address">
  Save automation settings
</Button>
```

`className` targets the native button/link, `labelClassName` the label,
`iconWrapperClassName` and `iconClassName` the icon, and `loaderClassName` the
spinner. No internal-span selectors are needed. Icons and spinners don't shrink;
the loading label is now visible as well as accessible and follows the wrapping
setting. Native loading buttons remain disabled and busy. Full-width/wrapping
buttons do not enlarge on hover and push beyond their parent.

An extremely narrow container must still accommodate padding, the icons/spinner,
and at least a glyph. Wrapping cannot compress those physical dimensions. Choose
a reasonable panel minimum width or omit optional icons for such layouts. Native
Select text itself remains single-line; its label and feedback can wrap.

## Responsive DataTable

`minWidth?: string | number` configures the **table**, not its
scroll-region wrapper. Numeric values are pixels; CSS lengths such as `"60rem"`
are accepted. Omit it for the existing responsive default minimum (520–720px).
Use `minWidth={0}` when the table should fit a narrow panel.

`tableLayout?: "auto" | "fixed"` defaults to `"auto"`:

- **Auto:** the native algorithm balances content, `column.width`,
  `column.minWidth`, and `column.maxWidth`. Widths are hints/constraints, not pixel
  guarantees; unwrapped content can require a wider table. `maxWidth` is not a
  reliable hard cap on a native auto-layout table cell.
- **Fixed:** the table uses its available width (or larger configured minimum).
  First-row column widths allocate explicit space; remaining space is shared by
  flexible columns. Use `column.wrap` or `wrapCells` for long content. Min/max
  sizing hints are not hard clamps in this native algorithm. An explicit sum of
  column widths larger than the panel intentionally produces horizontal scrolling.
- Controlled/internal `columnWidths` from column resizing override `column.width`.
  Header/body cells receive the same sizing; sortable headers use the same wrapping
  contract. Selection and expansion columns keep their existing widths.

```tsx
<DataTable caption="Documents" minWidth={0} tableLayout="fixed"
  data={documents} columns={[
    { key: 'filename', label: 'Filename', wrap: true, isRowHeader: true },
    { key: 'actions', label: 'Actions', width: '38%', wrap: true,
      render: () => <Button fullWidth wrapLabel>Edit document and review settings</Button> },
  ]} />
<DataTable caption="Financial transactions" minWidth="60rem"
  data={transactions} columns={financialColumns} />
```

Prefer wrapping/fixed layout for filenames, URLs, descriptions and long actions
that should fit the panel. Prefer an intentional minimum and horizontal scrolling
for dense financial or comparison columns that must stay side by side. The native
table structure and headers now remain visible at mobile widths; the previous
automatic card conversion and hidden header styles have been removed. No columns
are automatically hidden.

Existing customization hooks remain: root/scroll-region `className` and
`scrollRegionProps`, `tableClassName`, `theadClassName`, `tbodyClassName`,
`rowClassName`, `cellClassName`, plus column `headerClassName`, `cellClassName`,
`rowHeaderClassName`, `sortButtonClassName`. The region stays within its parent,
while horizontal overflow stays inside it. P0 caption-derived SSR names, keyboard
focus/scrolling and nested-control isolation are preserved.

## Verification and migration

`BOREAL_BROWSER_CHANNEL=chrome node scripts/testFieldCompositionBrowser.cjs`
(set the environment variable using your shell's syntax) runs installed Chrome
at 320px, 768px, 1280px and actual **200% page zoom**. It uses a temporary browser
profile under ignored `out/`, and verifies zoom with DPR=2 and the reduced CSS
viewport. It does not substitute CSS zoom, pinch zoom, or viewport emulation for
the zoom check. Screenshots go to `out/field-composition-browser/`; checks include
heights, alignment, full width, feedback bounds, retained values, pending/disabled
buttons, icons, table sizing, header alignment, native scrolling and live resize.
The existing P0 browser and Cypress suites remain regression gates.

Remove duplicated field errors/IDs and compensation-only ARIA associations; use
`helperText`, `errorMessage`, and common slots. Remove repeated control-height,
label-spacing, field margin/width/min-width corrections where these defaults now
cover them. Replace Button internal-span overrides with `wrapLabel` and
`fullWidth`; replace table internal-scroll selectors with `scrollRegionProps`,
`minWidth`, `tableLayout`, and existing column props. Bare TextArea Core
`.container`/`.label` classes are now component-prefixed; use the public class
props instead of internal selectors.

Retain business/server validation, validation timing, content limits, parent
grids/gaps/breakpoints, and intentionally wide table/column choices expressed
through the supported APIs. Server TextInput/TextArea retain their existing
read-only defaults; server Select remains a native initial-value field, and
client Select retains the P0 controlled reset behavior.
