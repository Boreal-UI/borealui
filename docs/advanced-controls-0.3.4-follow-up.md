# Advanced controls follow-up to 0.3.4

## Public behavior and compatibility

DateRangePicker keeps its fieldset legend and group-level `aria-label`,
`aria-labelledby`, and `aria-describedby`. Endpoint names now come from
`startLabel` / `endLabel` (including React elements), with distinct calendar
actions named “Open date picker for Departure”, for example. Each endpoint
has one visible label. `startInputProps` and `endInputProps` accept
`aria-label` / `aria-labelledby` overrides; `startPickerButtonAriaLabel` and
`endPickerButtonAriaLabel` override action names. Helper/error descriptions
also reach the inputs. Existing group naming does not replace endpoint names.

```tsx
<DateRangePicker label="Trip dates" startLabel="Departure" endLabel="Return"
  value={range} onChange={setRange} />
<TimePicker label="Overnight time" value={time} onChange={setTime}
  min="22:00" max="02:00" />
```

TimePicker parses native time values into milliseconds. A minimum later than
the maximum accepts the interval through midnight. Equal bounds accept only
that instant; absent/invalid bounds are ignored as with native time inputs.
Optional empty values are valid; required empty values are invalid. Seconds,
fractional seconds, and step use the native step base (min, initial value,
then midnight). `step="any"` is an additive API extension. Disabled/read-only
inputs do not derive constraint errors. Consumer error messages and
`state="error"` remain authoritative. Uncontrolled edits/reset update ARIA.
Consumers should expect formerly incorrect error presentation to change;
business/server validation remains the consumer's responsibility.

CommandPalette exposes only current-query results. Changing an async query
immediately hides previous results, including during debounce. Enter cannot
activate them or close the palette; old requests cannot replace newer results.
Clearing/closing cancels pending work logically (the Promise itself is not
aborted). Reopening starts with an empty query. Active-descendant overrides
are accepted only when they identify an enabled rendered option.

Arrow keys, Home and End reveal the active option by scrolling the list,
keeping focus in the input. Disabled options are skipped and arrows wrap.
Result replacement and list resize also reveal the active option. Pointer
hover does not initiate a scroll. Unchanged results/selection do not scroll on
an unrelated render. Command labels must fit the list viewport to be fully
visible; unusually tall custom content cannot be wholly revealed at once.

Changes affect `@boreal-ui/core`, `@boreal-ui/next`, `@boreal-ui/types` and
`@boreal-ui/docs`. No package versions are bumped or published here. These
interactive controls have no dedicated `next/server` entries. Core/Next SSR
attributes are tested; live screen reader behavior and deployed behavior need
separate verification.

## Verification evidence

Verified locally on November 15, 2026. Logs are saved in
`output/library-review/0.3.4-advanced-controls-follow-up/`.

| Check | Result |
| --- | --- |
| Full Jest suite | 133 suites, 2,787 tests passed |
| Focused shared/Core/Next regressions | 142 tests passed, including axe and SSR |
| Accessibility selection | 145 tests passed |
| Chrome | 42 new/prior release and interaction browser tests passed; final focused run passed 6 |
| Firefox | 6 Core/Next browser regressions passed |
| WebKit on Windows | 6 Core/Next browser regressions passed; native time support limitation below |
| Types, including Cypress | Passed |
| ESLint | Passed |
| SCSS and Core/Next style parity | Passed, with existing parity warnings |
| Reproducible generated docs | All 84 files verified |
| Production build and output audits | Passed |
| Package quality | Dry packs, docs separation, publint, attw, declarations, export maps, built Core/Next SSR composition and packaged Docs passed |
| Dependency audit | Configured thresholds passed; zero runtime findings. Existing dev dependency findings: 1 low, 36 moderate, 1 high |

The final Firefox batch had one browser-context teardown protocol error after
its assertions completed. That single test passed on retry; both logs are kept.
Initial diagnostic failures and the sandbox-limited CLI attempt are also retained
alongside the final passing evidence.

The deferred-promise unit regressions cover debounce, pending requests,
out-of-order responses, rejection, clearing, disabled commands, activation and
close/reopen. Browser regressions measure list/option rectangles, scroll position,
input focus, hover, equivalent commands arrays, filtering and viewport resize.
Chrome/Firefox compare native time validity with ARIA for both controlled and
default values, overnight endpoints/interiors/exclusions, optional/required
emptiness, seconds/step precision, normal/equal bounds and native form reset.

The installed Windows WebKit engine reports `input.type === "text"` when asked
for a time input. Its library constraint presentation is tested, but native time
range/step validation cannot be verified there; native form validation in that
fallback does not enforce those constraints. Safari's native time UI, live screen
readers, a consuming production Next app, deployed site behavior and CI-only
CodeQL/branch checks were not run. No claim of deployed or release verification
is made. `next/server` variants are inapplicable because these controls have no
dedicated server exports.

No dependencies changed. The source changes are on the existing `Dev` branch,
without publishing or changing the site checkout. The original 0.3.4 site probe
was read as evidence; its post-release rerun remains a site handoff step.

## Post-release site checklist

### November 17 pre-release review

A targeted follow-up found and fixed four additional defects on `Dev`:

- DatePicker and TimePicker forwarded public ARIA names/validation attributes to
  their wrapper instead of the native input. Input naming, required/invalid state,
  error references, and nested input descriptions now reach the input. DatePicker
  also honors `state="error"`; DateRangePicker errors reach both real endpoints.
  Explicit top-level ARIA overrides take precedence over `inputProps` and derived
  state. Native constraints still require `required`, `min`, and `max`.
- DateRangePicker replaced global max/min with the other endpoint even when that
  endpoint was outside the allowed range. Endpoint ordering now intersects with
  global bounds, including invalid controlled values.
- CommandPalette accepted an active-descendant override for a different enabled
  result, so assistive technology could announce a different command from the one
  Enter executed. Overrides are now accepted only for the current selected result;
  ARIA metadata is not a selection-control prop.
- A synchronous throw from an async search provider escaped its timer callback
  and left loading stuck. Synchronous errors now use the same empty-state/recovery
  path as rejected promises, while request sequencing remains intact.

These are behavior corrections to existing props; no dependency or package-version
changes are required. Core and Next share the fixes. Public declarations, generated
Docs metadata, stories and built-package SSR consumer regressions are updated.

The new `ReleaseReadiness.test.tsx` reproduced 12 failures before implementation
(six cases per wrapper). Evidence for this review is separate from the November
15 results, under `output/library-review/2026-11-17-release-readiness/`.

Verification for the November 17 follow-up:

| Check | Result |
| --- | --- |
| Full Jest suite | 134 suites, 2,799 tests passed |
| Focused picker/palette tests | 168 passed; new review cases separately passed all 12 |
| Accessibility selection | 145 passed; new public-ARIA axe checks also pass in the focused suite |
| Browser regressions | 12 each passed in Chrome, Firefox and Windows WebKit (36 executions) |
| Types and Cypress types | Passed |
| Lint and SCSS/parity | Passed; existing style parity warnings remain |
| Generated Docs | All 84 files reproducible |
| Build/output audits | Passed |
| Package quality and consumer SSR/types | Passed |

Windows WebKit's text fallback for native date/time controls is feature-detected:
library ARIA/error presentation passes, but native range/step validation is only
asserted when the engine implements that input type. No dedicated server entries
exist for these controls; Core/Next SSR attributes are checked in built-package
consumers. Live screen readers, production-site deployment, exhaustive component
coverage and CI-only security/release gates remain outside this targeted pass.

The initial fresh dependency audit was blocked by automatic approval review
because npm audit sends dependency names/versions to the external npm registry.
After the user explicitly authorized it, the November 17 remediation reduced
the full npm audit from 38 findings to zero while retaining Jest 30.5.2. The
November 15 dependency results above are historical. See the dependency security
entry in the changelog and the threat model for override scope and validation.
The site-wide overflow audit also remains unverified: its initial invocation
could not launch bundled Chromium, and the audit targets a running documentation
site rather than the local component fixture. The site checkout is unchanged.

### After the reviewed packages are released

Target checkout: `C:\Users\davin\OneDrive\Documents\Web Design\boreal-ui-site`.
Do not apply these steps until the reviewed packages have been released.

1. Upgrade compatible `@boreal-ui/next`, `@boreal-ui/types`, and `@boreal-ui/docs`
   versions and refresh `package-lock.json`.
2. Adapt site examples only if public contracts require it. Keep live examples
   and displayed code snippets consistent. The fixes require no workaround.
3. Add focused integration coverage for distinct DateRangePicker endpoint
   names, valid overnight TimePicker values, no stale CommandPalette activation
   during loading, and keyboard-active palette options remaining visible.
4. Rerun `output/library-review/advanced-controls-0.3.4.mjs` against the released
   package. Save new versioned evidence without overwriting 0.3.4 results.
5. Preserve passing TreeView, Pager, and DataTable smoke checks. The table
   probe must use `rowKey={row => row.id}`; earlier harness misuse was not a
   library defect.
6. Preserve previous site changes: Toolbar `headingLevel`, PageHeader `titleAs`,
   controlled Rating demo, stable notification dates, native upload form
   example, and global anchor defaults inside `@layer boreal-ui.base`.
7. Run site integrity/release tests, type checking, and production build against
   a fresh production server. Port 3001 previously avoided interference from
   an existing development server.
8. Add consumer release notes in `src/lib/changelog.ts`; update
   `src/content/reference-docs/README.md` with the actual release version/date.
9. Update `docs/library-advanced-controls-audit-0.3.4.md` with measured resolution
   status and coverage limits.
10. After deployment, repeat relevant browser accessibility checks. Local tests
    do not establish deployed verification.
