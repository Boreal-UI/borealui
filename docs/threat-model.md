# Boreal UI Threat Model

This is the living threat model for the Boreal UI source repository, browser components, CLI, build pipeline, and published npm packages. Update it in the same pull request whenever a new asset, entry point, trust boundary, dependency, permission, or release path is introduced.

## Security objectives

- Published packages correspond to reviewed source and verified builds.
- Consumers are not exposed to script injection, unsafe navigation, arbitrary file writes, or unexpected code execution through Boreal UI APIs.
- Repository, npm, and CI credentials remain confidential and short-lived.
- Package contents, types, client/server boundaries, checksums, and provenance cannot be silently altered.
- Security and accessibility failures block merge or release.

## Assets and actors

Protected assets include source code, branch history, workflows, npm namespace ownership, release tags, package artifacts, signing identities, security advisories, CI credentials, consumer data passed to components, and files modified by the CLI.

Actors include maintainers, contributors, consumers, dependency maintainers, GitHub Apps/Actions, npm trusted publishing, security researchers, and attackers controlling component props, URLs, Markdown, files, storage, dependency packages, forks, or workflow inputs.

## Trust boundaries and mitigations

| Boundary or entry point                 | Principal threats                                                                    | Current controls                                                                                                         | Required review trigger                                                             |
| --------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Consumer props and browser events       | Injection, unsafe state transitions, denial of service, accessibility loss           | TypeScript, semantic rendering, input constraints, unit/interaction/axe tests                                            | New parsing, HTML, URL, file, storage, or event behavior                            |
| Markdown and rich content               | Cross-site scripting, unsafe links, content spoofing                                 | Avoid unsanitized HTML; validate rendered output and URL schemes                                                         | Renderer, parser, sanitizer, or link-policy changes                                 |
| URL and polymorphic link props          | `javascript:`/unsafe schemes, tabnabbing, navigation spoofing                        | Scheme validation where navigation is constructed; safe `rel` behavior for new tabs                                      | Any component that starts constructing or transforming URLs                         |
| FileUpload and file metadata            | Oversized input, spoofed MIME/type, unsafe filenames, content disclosure             | Client constraints are usability controls only; consumers must validate server-side                                      | File reading, previewing, parsing, upload, or path changes                          |
| Browser storage and theme configuration | Tampering, malformed data, privacy leakage                                           | Treat storage as untrusted; safe defaults and parsing                                                                    | New persisted values or cross-context synchronization                               |
| CLI filesystem and process boundary     | Path traversal, unintended overwrite, command injection, malicious lifecycle scripts | Scoped paths, structured process execution, dry-run/confirmation behavior, tests                                         | New command, file target, package-manager invocation, or deletion                   |
| Dependencies and install lifecycle      | Compromised package, vulnerable transitive code, install-script execution            | Lockfile, Dependabot, dependency review, npm audit, SBOM, manual adoption review                                         | Any new dependency, major update, action, or install script                         |
| Pull request and default branch         | Unauthorized changes, review bypass, compromised contributor                         | Required PR, independent approval, Code Owners, status checks, signed commits, no force push                             | Changes to rulesets, ownership, permissions, or bypass actors                       |
| GitHub Actions                          | Token theft, untrusted fork execution, action compromise, artifact tampering         | Minimal permissions, no privileged `pull_request_target`, Dependabot action updates, attestations                        | Permission increase, third-party action, secrets, workflow input, or trigger change |
| npm release boundary                    | Unauthorized/partial publish, tag substitution, artifact mismatch                    | Protected environment, signed annotated tag, version checks, clean audit/build, checksums, attestations, OIDC provenance | Package ownership, publish order, workflow, registry, or environment change         |
| Private vulnerability handling          | Premature disclosure, reporter data leakage, incomplete remediation                  | Private vulnerability reporting, restricted advisory, coordinated disclosure                                             | Security contact, advisory access, or response-process change                       |

## Abuse cases reviewers must consider

FileUpload applies the same MIME, media-wildcard, extension and size constraints
to picker and dropped files. Native disabled state gates custom actions, including
inherited fieldset state and its first-legend exception. MIME metadata and file
extensions remain untrusted: applications must validate uploaded content and
enforce size limits on the server.

### Published component regression review (November 13, 2026)

Sidebar identity accepts optional sibling-unique IDs, encoded only for internal
tree keys; ARIA IDs remain generated and no ID becomes raw markup or navigation.
Disabled parent activation is guarded for pointer and native keyboard clicks.
NumberInput forwards actual typed events and clamps committed numbers without
introducing synthetic event casts. Notification localization uses Intl after
hydration; initial timestamps use deterministic ISO-derived UTC text. React
escapes these strings. No new dependency, raw HTML, privileged API, network access,
or publication boundary is introduced. Regression tests cover identity collisions,
disabled activation, numeric bounds, callback delivery, hydration, and rendered
text contrast. Custom CSS overrides and differing server/client Date inputs
remain consumer responsibilities.

### Breadcrumb metadata review (November 12, 2026)

Consumer breadcrumb labels and destinations also enter hidden microdata in Core,
Next and server output. The shared metadata renderer uses React escaping and
`sanitizeNavigationHref`, with no raw HTML or script serialization. Unsafe
intermediate destinations suppress the complete schema; unsafe final destinations
are omitted. Disabled navigation never bypasses URL validation. Regression tests
cover unsafe URLs in server-rendered and hydrated component paths. No new
dependency, privileged API or publishing boundary is introduced. Heading tags are
limited by the public type to h1–h6; accessible button names follow explicit
label precedence across native and framework render paths.

- A consumer passes crafted Markdown, a URL, a filename, an ID, or storage data that becomes executable markup or changes navigation.
- A dependency or GitHub Action update runs code during installation/build and attempts to steal a token or alter package output.
- A forked pull request obtains write permissions, secrets, or a trusted publishing identity.
- A maintainer bypasses review or replaces a release tag/artifact after approval.
- Publishing succeeds for some packages and fails for others, leaving mismatched versions or dependencies.
- A CLI command resolves a path outside the intended project or overwrites an unrelated file.
- A visual change removes keyboard access, accessible naming, or focus visibility while functional tests still pass.

## Residual risks

- A component library cannot enforce server-side validation performed by consumers; documentation must make client-side limitations clear.
- npm, GitHub, and upstream dependencies remain external trust providers. OIDC, provenance, checksums, attestations, lockfiles, and review reduce but do not eliminate that risk.
- A two-administrator model reduces account-loss risk but introduces two highly privileged identities. Hardware-backed MFA, independent review, and audit review are required.
- Public source permits adversarial analysis. Security depends on robust controls and timely fixes, not secrecy.

## Change template

### Development dependency advisories, November 2026

The root lockfile's reported glob cancellation, minimatch pattern amplification,
Next cache-isolation, qs serialization and systeminformation advisories are
addressed through upstream patched releases. Next is pinned to 16.4.6 in the
workspace and the Next 16 compatibility fixtures. qs/systeminformation stay in
their parents' compatible ranges. Overrides replace only glob >=9 <14.0.2 and
minimatch >=7 <11.0.1; unaffected minimatch 3 consumers remain on their existing
API. Jest stays at 30.5.2.

The overrides cross transitive major ranges, so the regression gate exercises
CommonJS aliases, sync/async globbing, coverage inclusion/exclusion, stream and
Promise cancellation, bounded adversarial preprocessing, and malformed comma
serialization. Node 20.19 is explicitly exercised in addition to the local runtime.
Full coverage, docs generation, lint, build, Storybook and package checks validate
the direct callers. Remove the overrides once every affected parent natively
accepts patched versions, after rerunning these checks and npm audit.

These are development-tool dependency paths, not a claim that all advisory
preconditions were reachable through a published Boreal component. Root Next
patching does not enforce consumer framework versions, and npm's graph audit does
not inspect separately downloaded Cypress browser binaries. No audit thresholds
or integrity checks are weakened. Owner: library maintainers.

### Current-query command activation and time constraints

Chromatic tooling is pinned to 18.14.5 with npm lockfile integrity. Its visual CI
lane uses Node 22 to meet the CLI's runtime requirement. The existing conditional
secret-gated upload, ignored install scripts and review of visual changes remain
in place; this introduces no new upload destination or credentials. Local
Storybook compilation, CLI version/help and workflow tests cover the upgrade;
no Chromatic cloud build was started.

The November 17 follow-up also normalizes synchronous provider throws into the
existing rejected-request path, preserving sequencing and avoiding uncaught timer
errors/stuck loading. Active-descendant overrides cannot advertise a different
command from the selected action. Regression cases verify both contracts through
Core and Next; no new capability or trust boundary is introduced.

Async command providers and consumer constraints remain existing input boundaries.
Only enabled, rendered current-query commands can execute; pending and superseded
results cannot activate through keyboard handlers or absent ARIA targets. Deferred
promise regressions exercise query changes, out-of-order replies, rejection and
close/reopen. This does not make provider-supplied actions trusted: consumers still
authorize actions. Time parsing is bounded to native time syntax and normalizes
precision before periodic/step comparisons; it is UI validation, not server-side
enforcement. No new network, HTML, storage, dependency or publication capability
is introduced. Owner: library maintainers.

### Native file selection reconciliation

FileUpload picker/drop files are untrusted browser input. The accepted selection
is validated before being copied via DataTransfer into the successful native form
control, including after append/removal. Single mode limits accepted files to one;
additional files are rejected with text-only feedback. Disabled handlers ignore
selection. Browser regressions inspect FormData names and bytes and required/reset
behavior. This prevents UI/form payload divergence, not malicious uploads: consumer
servers must enforce content, size and authorization independently. No new network,
storage, dependency or publishing boundary is introduced. Owner: library maintainers.

For a medium- or high-risk pull request, add or update a row above and record:

1. assets and security objective affected;
2. attacker-controlled inputs and trust boundaries;
3. credible abuse cases and impact;
4. prevention, detection, recovery, and regression tests;
5. residual risk, owner, and any time-bounded follow-up.
