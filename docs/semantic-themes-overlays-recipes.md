# Semantic themes, overlays and application recipes

## Inventory and scope

The existing runtime (`src/context/themeRuntime.ts`) already resolves palettes,
text-on-palette colors, page text, muted text, borders, focus colors, initialization
scripts, cookies and server HTML attributes. This change extends that resolver;
it does not replace scheme definitions or the Cedarweave palette.

| Existing variables | Meaning and consumers |
| --- | --- |
| `--primary-color`, `--secondary-color`, `--tertiary-color`, `--quaternary-color` | Brand palettes used by Button, fields, themed cards, menus and table headers |
| `--text-color-primary` etc. | Readable **on the corresponding palette color**, not general page text |
| `--background-color`, `--background-color-surface` | Page and neutral raised surfaces; panels and dialogs |
| `--text-color`, `--text-color-light` | Primary and muted page text; neutral content and field descriptions |
| `--border-color`, `--border-color-strong`, `--focus-outline-color` | Boundaries and focus on neutral surfaces |
| `--background-color-light/dark/darker/lighter`, `--text-color-lighter`, `--text-color-placeholder`, `--divider-color` | Compatibility variables; the last three track the resolved muted/border roles |
| `--disabled-color` | Legacy general disabled color, historically used as both foreground and background; retained without redefining that ambiguous meaning |

The shared portal inventory is complete for the current source tree:

| Component | Rendering and inheritance |
| --- | --- |
| Modal, CommandPalette, MessagePopup | `usePortalHost` manages body-level hosts and per-overlay resolved theme scopes |
| Chip (including notifications using Chip) | Uses the same managed host when `usePortal` is enabled |
| Portal | Its existing wrapper receives originating resolved variables, including with an explicit `container` |
| Drawer, Dropdown, PopOver, Tooltip | Currently render inline, not through React portals; normal DOM inheritance applies |

No new portal behavior is invented for inline components. Existing focus,
outside-interaction, Escape handling, modal stacking and scroll locks are retained.

## Semantic token contract

Use these names directly instead of application-local aliases and repeated mixes:

| Role | Token |
| --- | --- |
| Base surface | `--background-color` |
| Raised surface | `--background-color-surface` |
| Subtle surface/striping | `--background-color-subtle` |
| Primary text on neutral surfaces | `--text-color` |
| Muted text on neutral surfaces | `--text-color-light` |
| Default/strong boundary | `--border-color`, `--border-color-strong` |
| Focus ring on neutral surroundings | `--focus-outline-color` |
| Hover/pressed neutral surface | `--hover-background`, `--active-background` |
| Selected pair | `--selected-background`, `--selected-text-color` |
| Disabled pair | `--disabled-background`, `--disabled-text-color` |

The disabled background name is deliberately distinct from the legacy
`--disabled-color`, whose existing foreground consumers must not receive a new,
near-background color. Existing palette and compatibility names remain available.
No application needs to copy a `color-mix()` formula.

All built-in schemes and existing palette-only custom schemes resolve this
contract centrally. Derived surfaces blend the base toward readable page text at
small, centrally defined weights, reduced when necessary to retain 4.5:1 text
contrast. Muted text must remain readable across these neutral surfaces or falls
back to primary text. Adaptive borders/focus fall back to readable page text when
needed to retain 3:1 boundary contrast. Strong/default roles can coincide when
contrast constraints require it. Selection also has a checkbox/semantic state;
disabled controls retain native semantics and use a dashed boundary, not color alone.

The supported contrast targets are 4.5:1 for normal text on base, raised, subtle,
hover and active surfaces, the selected pair, and the disabled pair; 3:1 for focus
and boundaries against the neutral surfaces. Palette components still pair
`--primary-color` with `--text-color-primary`, and likewise for other palettes.
Do not put page/muted text on a brand swatch without checking that pair.
Glass/translucent content and legacy alpha palette values depend on the content
behind them and require application-level composited contrast checks. Alpha
palette definitions remain accepted for compatibility; the opaque-role audit
does not model those backgrounds.

### Custom definitions and precedence

Minimal palette-only setup continues to work:

```tsx
import type { ColorScheme } from '@boreal-ui/types';
const forest: ColorScheme = {
  name: 'Forest workspace',
  primaryColor: '#24563f', secondaryColor: '#efc579',
  tertiaryColor: '#b49878', quaternaryColor: '#354d42',
  backgroundColor: '#f8faf7',
};
```

Explicit semantic overrides use `ColorScheme.semanticTokens`:

```tsx
const evening: ColorScheme = {
  ...forest, name: 'Evening', backgroundColor: '#14251c',
  semanticTokens: {
    '--background-color-surface': '#20382a',
    '--border-color': '#8ea598',
    '--text-color-light': '#d7e2da',
    '--focus-outline-color': '#f4d995',
  },
};
```

Resolution is pure and deterministic: palette → semantic base/text overrides →
derived roles → remaining explicit semantic overrides → compatibility aliases.
Overrides must be known token names with opaque `#RGB` or `#RRGGBB` values.
Unknown tokens, CSS expressions and alpha semantic overrides are rejected.
Explicit colors are honored, not silently repaired. Check custom combinations in CI:

```tsx
import { getThemeContrastIssues } from '@boreal-ui/next/server';
const issues = getThemeContrastIssues(evening);
if (issues.length) throw new Error(JSON.stringify(issues));
```

The audit returns `{ foreground, background, ratio, minimum }` failures for the
supported opaque neutral pairs. It is also exported by the existing Core/Next
ThemeProvider entries. Callers remain responsible for explicit overrides,
transparency and application-specific color combinations.

Components now consume the relevant roles: neutral Modal/MessagePopup/CommandPalette
surfaces, field descriptions, clear Card text, DataTable body/striping/hover/active/
selection, and disabled Button/TextInput/TextArea/Select presentation. Non-glass
invalid Selects use a neutral surface with an error boundary so their text stays
readable on light as well as dark schemes. Palette-themed surfaces retain their
existing palette pairings, including placeholder text inheriting the control's
foreground rather than the neutral-page muted role. Disabled presentation remains
opaque and readable through hover and outline/glass variants. This is not a redesign of every
component or a promise that arbitrary combinations of legacy palette variables
are readable.

## Scoped providers and portals

`ThemeProvider.scope?: 'document' | 'local'` controls ownership:

- A root provider defaults to document scope, preserving its document-wide theme,
  storage/event synchronization and optional cookie behavior.
- A nested provider defaults to local scope. `scope="local"` also works at the
  root of an independent React region. Local providers render a styled **div**
  during SSR, never change document theme attributes, never write theme preferences,
  and do not render a document initialization script.
- Local providers resolve their own scheme list and initial name. Pass the shared
  custom schemes explicitly, as in the recipes. Use providers around valid block
  content; the local div is unsuitable directly inside a table row/select.
- `scope="document"` explicitly retains the former global behavior of a nested
  provider when that shared document ownership is intentional.

```tsx
<ThemeProvider {...themeConfig} initialSchemeName="Workspace">
  <Workspace />
  <ThemeProvider {...themeConfig} initialSchemeName="Evening">
    <RegionalTools /> {/* overlays opened here retain Evening */}
  </ThemeProvider>
</ThemeProvider>
```

Portaled components receive a live snapshot of **resolved Boreal palette and
semantic variables from React context**, on an owned per-overlay scope. They do
not capture arbitrary computed CSS, ancestor selectors, typography overrides,
layout classes or variables applied outside the documented scheme API. Theme
changes update existing portal scopes without recreating their hosts, preserving
focus and open state. Multiple regions and nested overlays remain independent.
Owned scopes/hosts are released on unmount; consumer-owned hosts are not removed.

`Portal.container` keeps its existing selector/Element/DocumentFragment behavior.
The originating provider's resolved variables take precedence over the target's
Boreal variables; explicit Portal `style` wins on its own wrapper. A wrapper style
does not become a new React theme context for further nested portals. Use a
ThemeProvider for that. `getThemeAttributes` alone styles static DOM; it does not
establish the React context needed for portal inheritance.

## Supported Next.js SSR recipe

The complete runnable app is `examples/theme-app`. From the repository root:

```sh
npm --prefix examples/theme-app run dev
```

It uses the installed Next.js 16 integration and `await cookies()`; the installed
cookies and Server/Client Components documentation was consulted before writing
it. One immutable `theme.ts` is shared by server layout and client components.
The sample palettes are illustrative; retain Cedarweave's real palette values.

The server layout resolves the request, writes the exact initial HTML attributes,
and passes the resolved **name** to the client provider:

```tsx
import { cookies } from 'next/headers';
import { ThemeProvider } from '@boreal-ui/next';
import { getThemeAttributes, resolveThemeScheme, THEME_COOKIE_NAME } from '@boreal-ui/next/server';
import { themeConfig, workspaceTheme } from './theme';

export default async function RootLayout({ children }) {
  const preference = (await cookies()).get(THEME_COOKIE_NAME)?.value;
  const scheme = resolveThemeScheme(preference, {
    ...themeConfig, fallbackSchemeName: workspaceTheme.name,
  });
  return <html lang="en" {...getThemeAttributes(scheme)}><body>
    <ThemeProvider {...themeConfig} initialSchemeName={scheme.name}>
      {children}
    </ThemeProvider>
  </body></html>;
}
```

The repository example contains the full imports, styles, types, and client
application. Published consumers use the package entries shown above. Import the
documented global stylesheet once. No hydration-warning suppression or remount
key is required.

Preference policy: a known request cookie wins; missing, stale or unknown names
fall back to the explicitly configured Workspace scheme. That resolved name is
authoritative during hydration, even if localStorage contains another name. The
Next provider's existing cookie synchronization persists later client selection;
unknown cookie values are corrected when the fallback hydrates. With JavaScript
disabled, the server still renders the correct readable theme. Server resolution
uses request-local values and pure helpers; do not call global style-config or
registration setters per request. Keep scheme definitions shared and immutable.

## Five complete composition recipes

Both Storybooks include **Recipes / Semantic themes and composition / Application**,
rendering `shared-story-assets/SemanticThemeRecipes.tsx`. The same recipes run in
the Next example. Their minimal application CSS is expressed through ordinary
grid/flex/gap/padding and the semantic token panel style; no internal DOM selectors
or error-ID assembly are needed.

| Recipe | Boreal owns | Application owns and customization |
| --- | --- | --- |
| Validated form | Labels, descriptions/errors, associations, native form controls, pending Button presentation | Server result/validation timing, controlled values retained on failure, success status, `useFormStatus`. Use P1 field slots and error APIs; a single polite status avoids repeating error text. |
| Filter toolbar | Equivalent sizes, valid empty Select option, native uncontrolled reset | Wrapping flex layout, filtering and clear state. The view name is uncontrolled and resets natively; filename/status are controlled. No sentinel, hidden input or reset prevention. |
| Document table | Caption-derived named scroller, native table headers, containment, wrapping columns/actions, nested-control isolation | Intentional 48rem minimum, filtering, navigation/edit actions and document content. Use `minWidth`, column sizing/wrapping and Button `wrapLabel`; long filenames remain reachable. |
| Mobile dialog | Accessible title, close/Escape/outside dismissal, focus trap/restoration, inherited theme, scrolling body with fixed header/footer | Open/close orchestration, long instructions and footer actions. Buttons wrap; the body scrolls without consumer selectors. |
| Custom-themed application | Deterministic roles, SSR helpers, local providers and portal scope updates | Real palette, shared server/client config, panel layout and explicit semantic choices. Use tokens directly for surfaces/borders/muted text. |

The Next.js form calls `app/actions.ts`, a real Server Action returning deterministic
success/failure results; it does not persist preferences. Replace that demo branch
with application validation and persistence. Storybook uses the same presentation
with a simulated asynchronous result.

`/builtins` is a server-rendered contrast gallery. `/overlay-family` is a runnable
inventory covering Drawer, Dropdown, PopOver, Tooltip, CommandPalette,
MessagePopup and Chip, supplementing the nested Modal/Portal recipe.
`/server-fields` renders repeated server-entry fields to exercise native labels,
unique feedback IDs and hydration in the installed React Server Component runtime.

## Card and Modal composition

Card already accepted children, so no alternative content API was introduced.
`footer?: ReactNode` now complements direct children, and `renderContent` /
`renderFooter` retain precedence when supplied. Existing action buttons and all
section class props remain supported. `padding="none"` removes header/body/footer
padding and the body's imposed flex layout; `padding="default"` preserves existing
styling. Child cards keep their own defaults. Root margins/layout choices remain
separate; the existing `--card-outer-margin` and public root/section class props
can express application-specific choices without reaching into internal markup.

Modal now accepts arbitrary ReactNode children (including text and siblings) and
`padding="default" | "none"`. Its existing header/body/footer and title class slots
remain unchanged. The default body already scrolls: use the `footer` slot for
reachable actions, not buttons at the bottom of a long body. The footer can wrap;
the panel respects the dynamic viewport height. A string/number `title` is the visible
h2 that labels the dialog; custom ReactNode titles keep their own heading structure.
For a deliberately headerless dialog, use `title={null}`
and an `aria-label`; no placeholder header is needed. Custom headers should supply
an explicit `aria-labelledby` when their own heading is the accessible title.

No imperative application dialog API is added. Keep orchestration and thin
application adapters that still express useful conventions. Button additionally
types its native submitter `name`/`value`, which its rendering already forwards;
the success/failure demo uses these ordinary form semantics.

## Verification and migration

`BOREAL_BROWSER_CHANNEL=chrome node scripts/testSemanticThemeBrowser.cjs`
(set the variable using your shell's syntax) starts/stops the real Next recipe,
checks readable SSR with JavaScript disabled, preference fallback and hydration,
all built-in computed contrast samples, the overlay family, live/nested portal
updates, focus/scroll locks, form results and semantic interaction states. It runs
320/768/1280px recipes and actual 200% page zoom using an isolated temporary Chrome
profile. Screenshots are written to ignored `out/semantic-theme-browser/`.
Unit/integration tests cover all built-in resolutions, overrides, request
isolation, explicit containers, cleanup, SSR IDs, Card/Modal composition and
existing dismissal behavior. P0/P1 regression suites remain applicable.

Map each Cedarweave removal to its replacement:

- Local neutral surface/border/muted-text mixes and aliases → the semantic tokens
  above, or explicit matching values once in the real custom scheme.
- Duplicate modal-only theme declarations → a local ThemeProvider with shared
  scheme configuration; arbitrary CSS ancestry still needs an intentional strategy.
- Card `renderContent` indirection → direct children. Compensating section padding/
  flex resets → `padding="none"` and supported section slots where equivalent.
- Modal internal-body scrolling overrides → existing scrolling body + footer;
  placeholder headers → real title or headerless aria-label composition.

Keep Cedarweave's palette, the shared SSR/client configuration, application grids
and visual choices, business validation, content limits, open/close orchestration,
imperative adapters still used by application code, and useful convention wrappers.
Do not delete complete theme scopes or adapters without checking equivalence.

Compatibility: nested providers now default to local div scopes instead of
changing the document (explicit `scope="document"` retains legacy ownership).
Derived neutral surfaces may change slightly to meet contrast targets; explicit
semantic overrides preserve intentional color choices. Disabled fields/actions
use readable semantic pairs and a dashed boundary instead of reduced opacity.
Existing palette definitions/imports, root-provider persistence, Card render props,
P0 Select/DataTable and P1 layout/validation APIs remain supported. Browser checks
cover installed Chrome; arbitrary CSS inheritance and translucent compositing are
outside the guaranteed contract.
