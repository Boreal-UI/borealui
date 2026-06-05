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
```

Base components own shared behavior, ARIA wiring, keyboard handling, state, test IDs, and class composition. Core wrappers import global SCSS and pass string class maps. Next wrappers import SCSS Modules and include `"use client"` when the wrapper or base behavior uses client-only React behavior.

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
- `dist/core/docs.js`, `dist/next/docs.js`, and `dist/generated-docs` for docs metadata.
- `dist/types` for TypeScript declarations.
- `docs` for markdown API guides.
- `packages/cli/src` for the setup CLI.

Build output is produced by:

```bash
npm run build
```

The build also patches Next client directives and generated docs imports so package subpaths work after publishing.

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

## Documentation Checklist

Before merging public API changes:

- JSDoc on public props explains the behavior and default where useful.
- `npm run gen:docs` has been run.
- `docs/public-api-reference.md` is updated when import paths, barrel exports, or standalone exports change.
- `docs/installation-and-imports.md` is updated when setup or package entry points change.
- `docs/styling-and-theming.md` is updated when style config, theme, color-scheme, or CSS variable APIs change.
- `docs/accessibility.md` is updated when ARIA, keyboard, focus, or labeling behavior changes.
- `README.md` is updated for user-facing capabilities, scripts, or package entry points.

Generated prop metadata should be exhaustive. Markdown docs should stay practical: document import paths, common usage, accessibility expectations, theming workflows, and maintenance rules rather than duplicating every prop table by hand.
