# Changelog

## Unreleased

### Chrome DevTools audit fixes

- Keep keyboard-active MultiSelect and ComboBox options visible within long lists.
- Preserve mobile NavBar link names in Core and Next wrappers.
- Separate chart accents from readable chart/legend text; restore contrast for
  Breadcrumbs, PageHeader eyebrows, Timeline dates and selected TreeView items.
- Give every Rating size a minimum 24px target and include displayed values in
  default searchable MultiSelect trigger names. Explicit naming overrides remain supported.
- Correct PopOver story trigger composition and use Next chart imports in Next stories.
- Add unit, SSR, story-boundary and browser regressions. See
  [audit fix verification](docs/chrome-devtools-fixes-2026-11-15.md).

### Interaction follow-up to 0.3.2

- MultiSelect supports Arrow/Enter navigation without search, exposes its active
  option, skips disabled options and restores trigger focus on Escape. Disabled
  native form controls no longer submit values or block required validation.
- Rating moves actual focus with radio selection. Right/Down advance, Left/Up
  go back, and arrows wrap at boundaries; external updates never steal focus.
- ComboBox cannot activate hidden stale options while loading and emits popup
  ARIA references only while their targets exist.
- Core and Next share the fixes. Public prop shapes remain unchanged; updated
  keyboard/loading contracts are included in Types and generated Docs metadata.
- See [interaction verification and site handoff](docs/release-review-0.3.2-interactions.md).

### Follow-up contrast and table scrolling fixes

- Pair InputGroup and DateTimePicker semantic text with matching solid and hover
  surfaces in Core and Next; stop forcing dark native date/time controls.
- Keep Sidebar active semantic foregrounds paired with their surfaces across
  glass and outline variants.
- Keep DataTable toolbar, bulk actions, and pagination visible while scrolling
  horizontally; column headings remain aligned with body columns.
- Public APIs are unchanged. See [verification and site handoff](docs/release-review-0.3.2-fixes.md).

### Published 0.3.1 component regressions

- NumberInput delivers both supported callbacks for edits, stepper changes, and
  changed blur clamps. Its event argument is now the actual input change,
  button click, or input blur event (`NumberInputChangeEvent`). Value-only
  handlers remain compatible; input-only event annotations must widen.
- NumberInput preserves fractional values on blur and clamps final numeric
  commits, including fractional bounds with integer or exponent-form steps.
- Sidebar groups use optional sibling-unique `id` keys or tree-position identity,
  allowing duplicate labels and independent expansion. Disabled groups remain
  focusable but reject pointer/Enter/Space activation.
- Semantic feedback and selected/hover brand color pairs are derived for text
  contrast. Consumers pair state backgrounds with state foregrounds; nested
  DatePicker and Accordion content are included. MultiSelect chips use opaque
  selected-surface tokens rather than unsafe translucent inherited text.
- NotificationCenter renders deterministic UTC timestamps for SSR/initial
  hydration, then localizes after mount with optional `locale` and `timeZone`.
  Semantic time elements preserve ISO values and accessible relationships.
- Affects Core, Next, Types, and Docs. See
  [contracts and site handoff](docs/release-review-0.3.1-fixes.md) for compatibility
  details and post-release verification. No standalone server entries are added.


### Toolbar public heading level

- Expose `headingLevel?: 1 | 2 | 3 | 4 | 5 | 6` on public `ToolbarProps`
  for Core, Next, and server entries. H1 remains the default; typography,
  classes, IDs, accessible naming, and container semantics are unchanged.
- Includes regenerated `@boreal-ui/docs` metadata and declarations for
  `@boreal-ui/core`, `@boreal-ui/next`, and `@boreal-ui/types`.


### Breadcrumb metadata and heading semantics

- Breadcrumbs now emits one complete BreadcrumbList independently of visual
  truncation, including original positions and safe destinations for disabled
  crumbs. The disclosure is never a ListItem. Incomplete hierarchies (missing
  intermediate destinations or labels) omit structured data rather than fabricate
  URLs. Core, Next, and static server entries use the same metadata renderer.
- Button preserves explicit `aria-label` on text buttons, including the
  “Show all breadcrumbs” disclosure. `aria-labelledby` takes precedence.
- PageHeader and BreadCrumbPageHeader accept `titleAs` (`h1` through `h6`),
  defaulting to `h1`. Title styling and PageHeader root `as` are unchanged.
- Affects `@boreal-ui/core`, `@boreal-ui/next`, `@boreal-ui/types`, and
  `@boreal-ui/docs`.

This release improves native forms, responsive layouts, accessible tables and
custom themes across Boreal UI's React Core and Next.js components.

### Forms and validation

- **Select supports valid empty options.** Use `value=""` for choices such as
  “All statuses” or “None.” A real empty option takes precedence over the disabled
  placeholder; `placeholder={null}` disables the placeholder entirely.
- **Select supports uncontrolled forms with `defaultValue`.** Controlled `value`
  and `onChange(value)` remain supported. Selection, submitted values and native
  resets stay synchronized, including repeated React 19 form-action submissions.
- **TextInput, TextArea and Select share validation presentation.** Use
  `helperText`, `errorMessage` and `invalid` to display feedback. Boreal generates
  stable IDs, connects feedback to the native control and retains caller-provided
  `aria-describedby` references. Clearing an error removes its association.
- **Feedback announcements are configurable.** `errorLive` supports `"off"`,
  `"polite"` and `"assertive"`; the default is `"off"`.
- **Field customization is more consistent.** Shared slots include
  `rootClassName`, `labelClassName`, `controlClassName`, `descriptionClassName`
  and `errorClassName`. Existing component-specific class props remain supported.

### Responsive controls and tables

- **Controls align across equivalent sizes.** TextInput, native date inputs,
  Select and Button share `--control-height-xs`, `--control-height-small`,
  `--control-height-medium`, `--control-height-large` and `--control-height-xl`.
  TextArea retains multiline sizing.
- **Fields support reliable `fullWidth` layouts**, shrink inside flex/grid panels
  and wrap long labels and feedback without adding external margins.
- **Button adds `wrapLabel`.** Long or unbroken labels can wrap and increase the
  button's height while icons and loading indicators remain visible. Full-width
  buttons fit narrow containers. Default labels remain single-line and truncate
  when space is constrained.
- **Button sizes retain their own height in mixed-size grids**, rather than
  stretching to match the tallest neighboring button.
- **DataTable adds `minWidth` and `tableLayout`**, complementing column width,
  minimum/maximum width and wrapping options. Wide tables scroll within their
  region instead of expanding the page.
- **DataTable scrolling regions are named from captions during server rendering**
  and accept `scrollRegionProps` overrides. They are keyboard focusable with a
  visible focus indicator, including when the table does not overflow.
- **Nested controls no longer activate clickable rows.** Links, buttons, form
  controls and supported custom interactive elements retain their own behavior.
  Direct row clicks and keyboard activation remain supported.
- **Select's chevron no longer overlaps its text**, including in RTL layouts.
  The chevron remains inside the native select's clickable area.
- **SegmentedControl's keyboard focus outline is inset on the focused button**,
  preventing clipping by the scrolling container.

### Themes and overlays

- **Custom themes can override semantic roles through `ColorScheme.semanticTokens`.**
  Roles cover surfaces, text, borders, focus, hover, active, selected and disabled
  presentation. Existing palette-only themes receive centrally derived defaults.
- **`getThemeContrastIssues` audits supported opaque color combinations.** Explicit
  overrides are preserved so applications can check their own choices.
- **Nested ThemeProviders create local theme scopes by default.** Portaled Modal,
  CommandPalette, MessagePopup, Chip and Portal content retain their originating
  theme, including live updates and independent application regions. Explicit
  Portal containers remain supported.
- **Disabled controls use readable foreground/background pairs and dashed
  boundaries.** Hover and outline/glass variants retain the disabled presentation.
  Field placeholders and Button loading indicators follow the control foreground.
- **New recipes cover Next.js server rendering and hydration**, shared custom-theme
  configuration, validated forms, filter toolbars, document tables and mobile
  dialogs.

### Card and Modal composition

- **Card adds `footer` content and `padding="none"`.** Compose simple content with
  children and remove section padding/imposed body layout through supported props.
  Existing renderers and section class props remain available.
- **Modal accepts text and multiple child elements**, adds `padding="none"` and
  uses its visible string/number title for accessible naming. Headerless dialogs
  can use `title={null}` with `aria-label`. Custom title nodes remain supported.
- **Long dialogs retain a scrolling body and reachable footer actions**, including
  narrow screens and 200% browser zoom.

### Upgrade notes

- An enabled empty Select option now owns the empty value. Remove sentinel values
  and hidden inputs used solely to submit an empty string. Uncontrolled fields
  should use `defaultValue`; controlled fields should use `value` and `onChange`.
- DataTable scrolling regions now add a default tab stop. Use `scrollRegionProps`
  when an explicit focus or naming policy is needed. Mobile tables retain native
  table structure; the previous automatic mobile card conversion is removed.
- Field errors are static by default. Set `errorLive` explicitly when live
  announcements are appropriate. TextArea's `errorMessage` now implies invalid
  presentation. Explicit `aria-invalid` still takes precedence for ARIA state.
- Control heights and default field margins have changed. Review local sizing,
  spacing and Button wrapping overrides. Core TextArea's generic internal classes
  are now component-prefixed; prefer its public customization slots.
- Root ThemeProviders retain document-wide behavior. Nested providers now render
  a local wrapper element; use `scope="document"` when intentionally retaining
  nested document-wide theme ownership.
- Derived neutral colors and disabled styling may look different. Existing palette
  definitions and package import paths remain supported. Semantic overrides accept
  opaque `#RGB` or `#RRGGBB` colors. Arbitrary ancestor CSS variables/selectors do
  not automatically cross portals; translucent contrast needs application checks.
- Card's `renderContent` and `renderFooter` retain precedence over simple children
  and footer content. Keep application-specific layouts, dialog orchestration and
  business validation in application code.

### Guides

- [Select forms and DataTable scrolling](docs/select-and-datatable-native-behavior.md)
- [Field layout, validation and responsive content](docs/field-layout-validation-responsive-content.md)
- [Semantic themes, overlays and composition recipes](docs/semantic-themes-overlays-recipes.md)
