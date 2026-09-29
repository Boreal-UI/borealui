# Visual regression and Core/Next parity

Boreal uses a curated Storybook project and Chromatic for visual regression.
The full Core and Next Storybooks remain separate build-health gates; the visual
project contains only high-risk cases with an explicit Core/Next mapping.

## Critical matrix

The source of truth is
[`visual-regression/criticalVisualMatrix.ts`](../visual-regression/criticalVisualMatrix.ts).
It currently covers 16 cases, 18 components, two exact viewports, light and dark
schemes, and approximately 40 snapshots:

- Desktop: 1280 × 900.
- Mobile: 375 × 812.
- Light scheme: Citrus Zest.
- Dark scheme: Eclipse Night.
- Accessibility media: `forced-colors: active` and
  `prefers-reduced-motion: reduce` on selected cases.

The matrix favors components with complex state styling, responsive behavior,
or Phase 3E-R corrections. Each entry records stable Core and Next story IDs.
Static tests reject duplicate IDs, incomplete mappings, missing required modes,
or accidental expansion of the initial baseline.

## Local workflow

Build or inspect the curated Storybook without publishing anything:

```bash
npm run storybook:visual
npm run storybook:build:visual
```

The existing Storybook gates remain:

```bash
npm run storybook:build:core
npm run storybook:build:next
```

After configuring a Chromatic visual project, build and publish with:

```bash
npm run storybook:build:visual
CHROMATIC_PROJECT_TOKEN=... npm run chromatic:visual
```

Never commit a project token. CI reads `CHROMATIC_PROJECT_TOKEN_VISUAL` from a
GitHub Actions repository secret and exposes it to Chromatic only as the
standard `CHROMATIC_PROJECT_TOKEN` environment variable.

## Reviewing changes

The initial rollout is informational while the curated baseline is established
and proven stable. Intentional changes follow this workflow:

1. CI publishes the curated Storybook and reports the visual diff.
2. A maintainer compares the mapped Core and Next cases in Chromatic.
3. The maintainer accepts an intentional baseline change or requests a fix.
4. Baselines are never auto-accepted on `main`.

Core and Next stories use the same renderer, fixtures, theme, viewport and play
state. Their stable IDs make the pair explicit instead of relying on coincident
story names. Chromatic's default sensitivity is retained; Boreal does not use a
relaxed pixel threshold.

## CI and forks

`Storybook builds` builds the complete Core and Next Storybooks on pushes and
pull requests. `Visual Regression` always builds the curated Storybook. It
uploads to Chromatic only when `CHROMATIC_PROJECT_TOKEN_VISUAL` is available.

GitHub does not expose repository secrets to fork pull requests. Forks therefore
still receive all static Storybook, unit, accessibility and Cypress gates while
the secret-dependent upload is explicitly skipped. Before merging a visual
change from a fork, a maintainer must validate it from a trusted branch.

Once the baseline is approved and several CI runs demonstrate stability, remove
Chromatic's `--exit-zero-on-changes` rollout option and require these exact
branch-protection checks:

- `Storybook builds`
- `Visual Regression`

Repository branch-protection settings are managed outside this repository and
are not changed by this configuration.

## Determinism

Critical stories use local text icons, fixed chart/table/tree data, fixed theme
names and exact viewport dimensions. Play functions deliberately establish
focus, editing, drag-active and rejected-file states. No selected story depends
on the current date, randomness, timers, remote images, web fonts or network
requests. Chromatic pauses animations, while dedicated stories additionally
exercise reduced-motion behavior.

Visual regression complements the semantic Core/Next style checker. It does not
replace structural parity, browser interaction, accessibility or package tests.
