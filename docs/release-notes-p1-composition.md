# Unreleased: P1 fields, responsive actions and tables

- TextInput, TextArea and Select share feedback association/precedence logic,
  `fullWidth`, common root/control/description/error class slots, and opt-in
  `errorLive` announcements. Existing class props and callbacks remain supported.
  Labels and feedback wrap; description IDs merge with caller IDs and remain stable
  in SSR/hydration. Errors clear without remounting or resetting entered values.
- Shared `--control-height-{xs,small,medium,large,xl}` tokens align TextInput,
  native date inputs, Select and Button. Fields no longer add external margins.
  TextArea retains multiline rows/height sizing.
- Button adds `wrapLabel`, supports full-width narrow layouts, keeps icons/spinners
  visible, and displays its loading label. The former full-width desktop cap is
  removed. Single-line labels remain the default and truncate in constrained space.
- DataTable adds `minWidth` and `tableLayout` alongside existing column sizing and
  wrapping props. Wide content scrolls within the region; mobile tables retain
  native rows and visible headers. P0 naming, keyboard access and nested controls
  remain supported.

Compatibility changes: errors are static by default instead of automatic alert
regions (`errorLive` opts into announcements); TextArea errorMessage now implies
invalid state; control heights and default field margins change; legacy mobile
table card conversion is removed. Core TextArea's generic internal classes are
now component-prefixed. Public import paths and customization props are preserved.
Server Select continues accepting the client-only `loadingClassName` slot for
source compatibility; it has no async loading UI.

See [the full API, runnable recipes and migration guide](field-layout-validation-responsive-content.md)
for precedence, sizing constraints, browser verification and the Cedarweave
workaround-removal checklist. Business validation and page layout remain consumer-owned.
