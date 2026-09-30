# Contributing to Boreal UI

Thank you for improving Boreal UI. Changes are accepted through pull requests so that behavior, security, accessibility, and package output are reviewed together.

## Before you begin

1. Create a focused feature or fix branch from the current default branch.
2. Read the [development workflow](./docs/development-workflow.md) and [secure development lifecycle](./docs/secure-development-lifecycle.md).
3. For changes that add a trust boundary, accept untrusted input, handle URLs/files/HTML, change authentication or permissions, add a dependency, or modify publishing, update the [threat model](./docs/threat-model.md) in the same pull request.
4. Never include credentials, tokens, personal data, private vulnerability details, or production logs in commits, issues, or pull requests.

## Coding standards

- Preserve the shared base/core/next architecture described in `AGENTS.md` and the development workflow.
- Prefer semantic HTML and accessible behavior by default. Add ARIA only where native semantics are insufficient.
- Validate data at trust boundaries. Treat component props, URLs, rendered markup, uploaded files, storage values, environment variables, package metadata, and CI inputs as untrusted.
- Avoid dynamic code execution, unsanitized HTML, unsafe URL schemes, shell string construction, and secrets in client bundles.
- Use Boreal design tokens, flattened class names, and `combineClassNames` rather than duplicating styling infrastructure.
- Keep dependencies minimal. Explain why a new runtime dependency is necessary and commit the resulting lockfile change.
- Add or update unit, interaction, accessibility, and security regression tests in proportion to the risk.

## Local checks

Run the focused checks while developing and the full audit before requesting review:

```bash
npm run lint
npm run audit:types
npm run test
npm run test:a11y
npm run audit:dependencies
npm run audit:build
npm run audit:package-quality
```

`npm run audit` runs the complete quality suite. `npm run sbom` generates a local CycloneDX software bill of materials.

### Compiled CSS equivalence

For a source-only SCSS refactor that is expected to preserve output, compare the working tree with a known-good Git revision:

```bash
npm run styles:equivalence -- -- --base HEAD --component Button
npm run styles:equivalence -- -- --base <revision> --component Button --component Spinner
npm run styles:equivalence -- -- --base <revision>
```

The first `--` ends npm options and the second ends Node options, which preserves named arguments consistently on Windows and Linux. Omitting `--component` checks the aggregate Core and Next stylesheet set. The command compiles expanded CSS without source maps and requires exact byte equality; a failure reports the affected surface, SHA-256 hashes, and a bounded first-difference excerpt. Exit code `1` means CSS changed, while `2` means the comparison could not run. Use the revision immediately before the refactor, or the branch point when every intervening style change is intended to be output-neutral.

This is a selective migration/review tool, not a universal style gate: it proves output identity, not visual quality, semantic Core/Next parity, or whether an intentional style change is correct. `checkSync` and Chromatic continue to cover those separate concerns. The command reads the baseline through Git objects in an isolated temporary directory; it never checks out, resets, or stashes the active working tree.

## Pull request requirements

Every pull request must:

- use the repository pull request template;
- describe user-visible behavior, risk, testing, and release impact;
- pass all required CI, CodeQL, dependency, accessibility, build, and package checks;
- receive at least one approval from someone other than the author;
- receive Code Owner approval when protected files change;
- resolve all review conversations and rerun checks after the final push;
- avoid direct pushes, force pushes, and merge-rule bypasses on the default branch.

Authors may not approve or merge their own change. Emergency changes follow the same review and test requirements; if a documented break-glass bypass is necessary, an administrator must record the reason and arrange a retrospective review within one business day.

## Dependency changes

Use npm commands so `package.json` and `package-lock.json` stay synchronized. Review the dependency's maintenance history, license, install scripts, transitive dependency count, security advisories, and necessity before adoption. Dependabot pull requests follow the same CI and approval rules as other changes.

Do not suppress audit or CodeQL findings without a written, time-bounded risk acceptance approved by a maintainer. See the [dependency update process](./docs/secure-development-lifecycle.md#dependency-update-process).

## Security reports

Do not discuss suspected vulnerabilities in public issues or pull requests. Follow [SECURITY.md](./SECURITY.md) and use GitHub private vulnerability reporting.
