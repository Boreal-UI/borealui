# Changelog

## Unreleased

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
