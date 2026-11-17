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
