# Development Workflow

This guide is for contributors maintaining Boreal UI source, docs, generated prop metadata, and package output.

## Architecture

Public components follow the base/core/next pattern:

```txt
src/components/ComponentName/
  ComponentName.types.ts
  ComponentNameBase.tsx
  core/ComponentName.tsx
  core/ComponentName.scss
  next/ComponentName.tsx
  next/ComponentName.module.scss
  server/ComponentName.tsx
```

Base components own shared behavior, ARIA wiring, keyboard handling, state, test IDs, and class composition. Core wrappers import global SCSS and pass string class maps. Next wrappers import SCSS Modules and include `"use client"` when the wrapper or base behavior uses client-only React behavior.

Add a `server` wrapper only when the component has useful static rendering
behavior. Server wrappers must avoid `"use client"`, hooks, browser APIs, and
callback props. Reuse a hook-free base where possible; otherwise create a
stripped static renderer. Add the entry to `serverEntries` in
`scripts/generateEntryPoints.cjs`, update server stories and tests, and document
any omitted or replacement props.

When a component has multiple public pieces, such as `RadioButton` and `RadioGroup`, keep each public prop interface documented and exported.

## Updating a Public Component

When changing a public component, update the full surface:

1. Type definitions in `ComponentName.types.ts`.
2. Base behavior in `ComponentNameBase.tsx`.
3. Core wrapper and global SCSS.
4. Next wrapper and SCSS Module.
5. Tests in `__tests__`.
6. Stories, if the behavior is user-facing.
7. Generated prop docs with `npm run gen:docs`.
8. Public entry points or package exports, if the import surface changes.
9. Server wrapper, tests, stories, and docs when the component has a server entry.

Use `combineClassNames` from `src/utils/classNames.ts` for class composition.

## Generated Prop Docs

Generated docs live in `src/generated-docs` and are built from component `.types.ts` files.

```bash
npm run gen:docs
```

The generator emits one `*PropDocs` object per public component props interface with a matching core or next wrapper. This includes multi-component type files such as:

- `RadioButtonProps` and `RadioGroupProps`
- `SelectProps` and `ThemeSelectProps`

Do not hand-edit generated files except as a temporary diagnostic step. Update the source type JSDoc or generator instead, then regenerate.

## Package Output

The package publishes:

- `dist/core` for React consumers.
- `dist/next` for Next.js consumers.
- `dist/next/server` for Next.js React Server Component entries.
- `dist/core/docs.js`, `dist/next/docs.js`, and `dist/generated-docs` for docs metadata.
- `dist/types` for TypeScript declarations.
- `docs` for markdown API guides.
- `packages/cli/src` for the setup CLI.

Build output is produced by:

```bash
npm run build
```

The build also patches Next client directives and generated docs imports so package subpaths work after publishing.

## Publishing a New npm Version

Boreal UI publishes four scoped packages from this repository:

- `@boreal-ui/types`
- `@boreal-ui/core`
- `@boreal-ui/next`
- `@boreal-ui/cli`

All four packages should use the same version. Do not run `npm version` separately inside the package directories. The repository helper also synchronizes internal `@boreal-ui/types` dependencies, the root lockfile version, and the CLI version constant.

### 1. Choose and apply the version

Replace `0.1.43` with the new SemVer version:

```bash
npm run version:packages -- 0.1.43
```

Prerelease versions are supported:

```bash
npm run version:packages -- 0.2.0-beta.1
```

Review the version changes before building:

```bash
git diff -- package.json package-lock.json packages/core/package.json packages/next/package.json packages/types/package.json packages/cli/package.json packages/cli/src/utils/constants.js
```

### 2. Run the release audit

```bash
npm run audit
npm run cypress:run
```

The audit runs type checking, linting, style checks, Jest, production builds, package dry runs, Publint, and Are the Types Wrong checks. Cypress runs the browser component suite separately. Do not publish if any check fails.

### 3. Build inspectable tarballs

```bash
npm run pack:split
```

This rebuilds and stages all package folders, then creates tarballs for `types`, `core`, `next`, and `cli`. Inspect the reported file lists and package sizes before publishing. The package-specific dry-run commands are also available when only one output needs checking:

```bash
npm run audit:package:types
npm run audit:package:core
npm run audit:package:next
npm run audit:package:cli
```

### 4. Confirm npm authentication

```bash
npm whoami
```

If this fails, authenticate with `npm login` before continuing. The account must have publish access to the `@boreal-ui` scope and satisfy any npm two-factor authentication requirements.

### 5. Publish the stable release

Publish `types` first because the runtime packages depend on that exact version. The `latest` tag is explicit here so stable releases become the default version installed by consumers:

```bash
npm publish ./packages/types --access public --tag latest
npm publish ./packages/core --access public --tag latest
npm publish ./packages/next --access public --tag latest
npm publish ./packages/cli --access public --tag latest
```

Publishing is irreversible for a given package version. Confirm the version and tarball contents before running these commands, and publish only from the reviewed release commit.

For a prerelease, use a prerelease tag instead of `latest` for every package:

```bash
npm publish ./packages/types --access public --tag beta
npm publish ./packages/core --access public --tag beta
npm publish ./packages/next --access public --tag beta
npm publish ./packages/cli --access public --tag beta
```

### 6. Verify the registry

```bash
npm view @boreal-ui/types version
npm view @boreal-ui/core version
npm view @boreal-ui/next version
npm view @boreal-ui/cli version
npx @boreal-ui/cli@latest --version
```

For a prerelease, inspect the dist-tags as well:

```bash
npm dist-tag ls @boreal-ui/types
npm dist-tag ls @boreal-ui/core
npm dist-tag ls @boreal-ui/next
npm dist-tag ls @boreal-ui/cli
```

After registry verification, create and push the matching Git tag from the release commit according to the project's release process.

## Verification

Run the targeted check for the area you touched while developing, then run the full audit before beta or release work.

```bash
npm run audit:types
npm run audit:lint
npm run audit:styles
npm run audit:test
npm run audit:build
npm run audit:package
```

The combined command is:

```bash
npm run audit
```

Use `npm run check:sync` after adding, moving, or renaming components. It verifies that each component has the expected base, core, next, and style files.

For timer, polling, or teardown changes, use Jest fake timers for exact deadlines and Cypress component tests for real browser lifecycle behavior. The shared multi-instance regression suite can be run with:

```bash
npx cypress run --component --spec cypress/component/TimerIsolation.cy.tsx
```

Include at least one repeated-instance or unmount case so cleanup in one component cannot silently cancel work owned by another.

## Documentation Checklist

Before merging public API changes:

- JSDoc on public props explains the behavior and default where useful.
- `npm run gen:docs` has been run.
- `docs/public-api-reference.md` is updated when import paths, barrel exports, or standalone exports change.
- `docs/installation-and-imports.md` is updated when setup or package entry points change.
- `docs/performance-and-async-behavior.md` is updated when timer, polling, cleanup, selection-key, or rendering semantics change.
- `docs/server-components.md` is updated when server entries or stripped behavior change.
- `docs/styling-and-theming.md` is updated when style config, theme, color-scheme, or CSS variable APIs change.
- `docs/accessibility.md` is updated when ARIA, keyboard, focus, or labeling behavior changes.
- `README.md` is updated for user-facing capabilities, scripts, or package entry points.

Generated prop metadata should be exhaustive. Markdown docs should stay practical: document import paths, common usage, accessibility expectations, theming workflows, and maintenance rules rather than duplicating every prop table by hand.
