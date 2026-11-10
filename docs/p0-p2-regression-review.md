# P0–P2 combined regression review

Reviewed the native Select/DataTable contract, field layout/validation, responsive
actions/tables, semantic themes, portal scopes, SSR and Card/Modal composition
together. P0/P1 are present in this checkout.

## Findings fixed

| Finding | Correction and coverage |
| --- | --- |
| Select text overlapped its chevron; shared sizing overrode reserved padding. | Size-specific native padding and a constrained SVG prevent overlap while keeping the chevron inside the native pointer hit area. Browser assertions cover all sizes, LTR/RTL, narrow layouts and real 200% zoom. Native forms/actions/reset tests still pass. |
| Grid rows stretched smaller Buttons to the tallest neighbor. | Default `align-self: center` preserves each size and wrapping growth. Tests verify 28/32/40/48/56px heights, increasing horizontal padding and existing toolbar alignment. Explicit consumer alignment remains available. |
| SegmentedControl's outward focus outline was clipped by its scroller. | The 2px outline is inset on the focused option, using that option's readable foreground. Browser checks cover arrow-key selection/focus and computed outline placement. |
| Legacy disabled opacity, hover, outline/glass and child-color rules overrode semantic roles. | Disabled fields/actions retain opaque backgrounds, readable native text/icons and dashed boundaries. Spinners follow the current foreground. Browser checks measure actual colors across built-in themes and representative variants/hover states. |
| Neutral-page placeholder colors could be unreadable on brand surfaces. | Field placeholders inherit the control foreground. Actual placeholder contrast is checked across all built-in themes and both implementations. The compatibility variable remains available for neutral content. |

No changes were needed to native form state, table keyboard/row interaction,
validation precedence or portal ownership. `/server-fields` now exercises repeated
server-entry fields in the installed React Server Component runtime, verifying
unique IDs and connected native labels/feedback in addition to DOM SSR tests.

## Validation commands

Final results:

| Check | Result |
| --- | --- |
| Full Jest coverage run | 124 suites, 2,595 tests passed |
| Full Cypress Electron run | 38 specs, 976 tests passed |
| Canonical audit | Passed; final style/build/package checks also rerun after refinements |
| Core/Next style parity and lint/types | Passed; existing parity advisories only |
| Core/Next/docs/declaration builds and package quality | Passed |
| Next example production build | Passed, including all four example routes |
| Standalone P0/P1/P2 Chrome runners | Passed; responsive recipes at 320/768/1280px and native 200% zoom |

Full-suite logs are `out/full-validation-audit.log` and
`out/full-validation-cypress.log`. Supplemental build, package, example and browser
logs use the same `out/full-validation-` prefix.

- `npm run audit`: generated docs, source/Cypress types, ESLint, SCSS/style parity,
  Jest coverage, all library builds, CSS/client-boundary checks, package dry runs,
  publint and declaration-resolution checks.
- `npm run cypress:run -- --browser electron`: the complete component browser suite.
- Chrome runners: `testSelectDataTableBrowser.cjs`, `testFieldCompositionBrowser.cjs`
  and `testSemanticThemeBrowser.cjs` in `scripts/`.
- Next example type checking and production compilation supplement its live
  SSR/hydration checks.

Responsive runners use 320/768/1280px and actual 200% zoom. Screenshots and logs are
under ignored `out/`. Cold Vite navigation permits 60 seconds; interaction
assertions retain their normal timeouts.

The CLI symlink test needs permissions unavailable inside the restricted Windows
sandbox; the complete audit was rerun outside that sandbox without skipping it.
Existing style parity advisories remain; the parity check passes.
The Cypress optimizer cache is isolated from standalone Vite runners, and its
initial dependency scan includes the component specs to avoid a cold-start reload
interrupting the support-module import.

## Compatibility and limits

These fixes introduce no new component props. The P0/P1 migration guides and P2
[token/scope contract](semantic-themes-overlays-recipes.md) still apply. Keep the
application's palette, business validation, page layouts and useful adapters. The
example Server Action demonstrates transport without persistence. Browser coverage
uses Chrome and Cypress Electron; arbitrary ancestor CSS and translucent
compositing remain outside the portal/opaque-token guarantee.
