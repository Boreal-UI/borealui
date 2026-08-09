# Secure Development Lifecycle

Security and accessibility are acceptance criteria for every Boreal UI change, not release-only activities. This process applies to maintainers, contributors, automation, documentation, and all published `@boreal-ui/*` packages.

## Lifecycle

### 1. Plan and classify

Describe the intended behavior and assign a risk level before implementation:

| Risk   | Examples                                                                                                                 | Required review                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Low    | Documentation, stories, tests, or non-behavioral styling                                                                 | One peer approval and normal required checks                                            |
| Medium | Component behavior, public APIs, parsing, storage, URLs, files, or dependencies                                          | Maintainer approval, security checklist, and threat-model review                        |
| High   | CI/release workflows, package publishing, security controls, credential boundaries, sanitization, or a vulnerability fix | Code Owner approval, a second-person release approval, and explicit threat-model update |

When uncertain, use the higher risk level. Security fixes remain private until coordinated disclosure permits a public pull request.

### 2. Threat model

For medium- and high-risk work, identify assets, actors, entry points, trust boundaries, abuse cases, and mitigations. Update [the living threat model](./threat-model.md) when the system or its risks change.

At minimum, ask:

- What new input can an untrusted consumer, browser, package, workflow, or contributor control?
- Can the change expose secrets, execute code, render unsafe content, navigate to an unsafe URL, overwrite files, or publish an artifact?
- What happens when validation, network access, storage, or cleanup fails?
- Can permissions or CI tokens be narrower?
- Which regression test proves the mitigation?

### 3. Implement securely

Follow [CONTRIBUTING.md](../CONTRIBUTING.md), `AGENTS.md`, and the component architecture. Prefer safe platform primitives, explicit allowlists, structured process arguments, minimal dependencies, least-privilege workflow permissions, and fail-closed release checks.

Security-sensitive behavior must have a regression test. Interactive behavior must cover keyboard and focus behavior. UI output must include jest-axe coverage where the rendered accessibility tree changes.

### 4. Verify and review

Every pull request must pass:

- `Lint` and `Typecheck`;
- `Unit tests` and `Accessibility tests`;
- `Build and package verification`;
- `CodeQL SAST`;
- `npm audit`, `Dependency review`, and `CycloneDX SBOM`.

The author completes the pull request checklist. A reviewer independently checks the diff, tests, threat model, dependency impact, generated output, and public API compatibility. The author cannot supply the required approval. Code Owner review is required for workflows, security policy, release controls, threat models, and access-control policy.

### 5. Release

Only a reviewed commit on the protected default branch may be released. The release version and all package manifests must match. Releases require:

1. all required branch checks passing on the release commit;
2. a GitHub-verified signed annotated tag;
3. approval from a required reviewer on the protected `npm` environment, with self-review prevented;
4. successful clean build, tests, dependency audit, package checks, checksums, and artifact attestations;
5. npm trusted publishing with provenance and no long-lived publish token;
6. release notes that identify security fixes without exposing an unpatched vulnerability.

The release approver must not be the person who created the release when two qualified maintainers are available. Failed or partially completed publishing is an incident: stop, preserve logs, identify which package versions were published, and do not overwrite artifacts or tags.

## Security review checklist

Reviewers use the portions relevant to the change and record exceptions in the pull request:

- Inputs are validated at every changed trust boundary, with explicit limits for size, count, format, and allowed schemes where applicable.
- Rendered HTML, Markdown, URLs, filenames, selectors, and error messages cannot inject code or disclose sensitive content.
- Client code contains no server secret, registry token, private advisory data, or privileged environment value.
- File and CLI operations use resolved, scoped paths and structured arguments; destructive behavior is explicit and recoverable where practical.
- Authentication, authorization, workflow, and environment permissions are minimal and fail closed.
- Dependencies are necessary, reputable, license-compatible, locked, audited, and free of unexpected install scripts.
- Logs and analytics exclude secrets, personal data, uploaded content, and security-report details.
- Error states do not bypass validation, authorization, cleanup, or release verification.
- Unit, security regression, keyboard, focus, and axe tests cover the changed behavior.
- Documentation, stories, type definitions, core/next wrappers, styles, exports, and package contents remain synchronized.

## Dependency update process

Dependabot checks npm and GitHub Actions weekly. Security updates are handled ahead of routine upgrades.

1. Confirm the advisory, affected dependency path, reachable behavior, and available fixed version.
2. Review release notes, provenance, maintainership, license, install scripts, and transitive changes.
3. Update with npm so the manifest and lockfile remain synchronized. Never hand-edit integrity data.
4. Run `npm run audit:dependencies`, relevant tests, the production build, and package verification.
5. Merge through a reviewed pull request after required security and dependency checks pass.
6. For a high or critical reachable vulnerability, prepare a patched release promptly and use the vulnerability-response process below.

Routine updates may be grouped when risk is low. Coupled toolchain versions, such as Vite and `@vitejs/plugin-react`, are grouped and moved together in a deliberate migration pull request. Other major versions, runtime dependencies, build tools with install scripts, and GitHub Actions are reviewed separately. Automated dependency pull requests never bypass review, and an incompatible automated update is corrected at the dependency level rather than installed with `--force` or `--legacy-peer-deps`.

## Vulnerability response

Reports arrive through the private process in [SECURITY.md](../SECURITY.md).

1. Acknowledge the report within 3 business days and restrict discussion to the private advisory.
2. Triage severity, affected packages/versions, exploitability, exposure, and whether credentials or published artifacts are compromised.
3. Assign an incident owner and a second reviewer. Rotate or revoke affected credentials immediately.
4. Develop the smallest safe fix on the private security fork, adding a regression test and updating the threat model.
5. Validate all packages, provenance, checksums, advisories, and release notes before coordinated publication.
6. Publish the fixed packages, issue the GitHub security advisory/CVE when appropriate, notify affected consumers, and monitor for recurrence.
7. Complete a blameless retrospective for high/critical incidents and track follow-up controls to closure.

Target remediation is risk-based: actively exploited or critical issues are handled immediately; high-severity reachable issues target a fix within 7 days; lower-severity issues are scheduled according to impact. These are targets, not a reason to ship an unsafe or unreviewed fix.

## Exceptions and review cadence

A policy exception must state its owner, scope, reason, compensating controls, expiry date, and approving administrator. Permanent suppressions are not allowed. Maintainers review this lifecycle, the threat model, access assignments, required checks, and dependency policy at least quarterly and after every high-impact incident.
