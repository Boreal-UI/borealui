# Security Foundation

This repository uses layered controls for source, dependencies, builds, and npm releases.

Development review, threat modeling, vulnerability handling, release approvals, and least-privilege roles are defined in the [Secure Development Lifecycle](./secure-development-lifecycle.md), and [Threat Model](./threat-model.md).

## Automated controls

- `CI` runs linting, style linting, TypeScript checks, Jest unit tests, focused jest-axe accessibility tests, production builds, and package-quality verification.
- `CodeQL` performs JavaScript/TypeScript SAST on pushes, pull requests, and a weekly schedule.
- `Dependency and supply-chain security` runs dependency review on pull requests, blocks high-severity runtime findings and critical findings anywhere in the development tree, and generates a validated CycloneDX SBOM.
- Dependabot updates npm dependencies and GitHub Actions every week.
- Release jobs require a GitHub-verified signed annotated tag, rebuild and verify every package, generate SHA-256 checksums, create signed GitHub artifact attestations, and publish with npm provenance.

Run the local security checks with:

```bash
npm run audit:dependencies
npm run sbom
```

The generated `bom.cdx.json` is intentionally ignored locally and uploaded as a workflow artifact in CI.

### Temporary development-tool advisory

The full-tree audit currently reports the high-severity `image-size` advisories
`GHSA-w3rx-r6r6-pgpr` and `GHSA-5p2g-fcmc-qvqq`. This package is used only by
`@storybook/nextjs-vite` through `vite-plugin-storybook-nextjs`; it is not a
runtime dependency of the published Boreal packages. npm reports no fix as of
August 10, 2026. The audit still displays these findings and fails if their
severity becomes critical.

## One-time GitHub configuration

Repository administrators must configure these controls after the workflows land on `main`:

1. In **Settings → Rules → Rulesets**, create an active branch ruleset targeting the default branch (`main`). Require pull requests, at least one approval, dismissal of stale approvals, approval of the most recent push, conversation resolution, linear history, and the status checks listed below. Block force pushes and deletions. Enable required signed commits after confirming maintainers and automation use verified signatures.
2. Require these status checks: `Lint`, `Typecheck`, `Unit tests`, `Accessibility tests`, `Build and package verification`, `CodeQL SAST`, `npm audit`, `CycloneDX SBOM`, and `Dependency review`.
3. In **Settings → Advanced Security**, enable the dependency graph, Dependabot alerts, Dependabot security updates, secret scanning, push protection, CodeQL/code scanning, and private vulnerability reporting.
4. In **Settings → Actions → General**, set workflow permissions to read-only by default and allow GitHub Actions to create/approve pull requests only if the maintenance workflow needs it.
5. Create an `npm` environment. Restrict deployments to protected tags matching `v*`, add required reviewers if a second maintainer is available, and prevent environment-admin bypass where practical.
6. For each `@boreal-ui/*` package on npm, configure the trusted publisher as repository `DaveC6662/borealui`, workflow `release.yml`, environment `npm`. After a successful OIDC release, revoke legacy automation tokens.
7. Require signed annotated release tags. Create them with `git tag -s vX.Y.Z -m "Boreal UI vX.Y.Z"`, push the tag, then publish the matching GitHub release. Enable immutable releases in GitHub if available for the repository.
8. Apply the organization ownership, two-administrator, secure MFA, team-role, and audit-review controls in the [Access Control Standard](./access-control.md).

The release workflow deliberately fails before publishing if any package version differs from the release tag or already exists on npm. Packages publish in dependency order: types, core, next, docs, then CLI.

The release job uses Node 24 because npm trusted publishing requires Node 22.14 or newer and npm 11.5.1 or newer.

## Package verification

For an npm package with provenance, consumers can verify the registry signatures and provenance during installation:

```bash
npm audit signatures
```

Release artifacts also include `SHA256SUMS`. GitHub attestations can be checked with:

```bash
gh attestation verify package.tgz --repo DaveC6662/borealui
```
