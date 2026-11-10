# Unreleased: Select and DataTable native behavior

- Select adds uncontrolled `defaultValue` usage and optional change observation,
  accepts enabled empty options, and supports `placeholder={null}`. Existing
  controlled `value` and string `onChange` callbacks remain supported.
- Controlled selection, FormData, native reset and React 19 action form resets
  stay synchronized. Core and Next continue forwarding native select refs.
- Visible Select labels now name their control; helper and error text are linked.
  Server Select shares the empty-option policy and preserves external descriptions.
- DataTable scroll regions derive names from captions during SSR, are keyboard
  focusable with a visible focus ring, and accept `scrollRegionProps` overrides.
  Non-overflowing tables intentionally remain a tab stop.
- Nested interactive content no longer activates clickable rows. Direct row
  pointer and keyboard activation remain supported; links keep native defaults.

Compatibility: empty options now own the empty value instead of competing with
the placeholder. DataTable introduces one default tab stop for the scroller.
No package import paths change. Server Select remains an initial-value native
field rather than a controlled client component.

See [behavior, examples, and migration](select-and-datatable-native-behavior.md)
for final APIs and the consumer migration checklist.
