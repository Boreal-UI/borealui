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

For a medium- or high-risk pull request, add or update a row above and record:

1. assets and security objective affected;
2. attacker-controlled inputs and trust boundaries;
3. credible abuse cases and impact;
4. prevention, detection, recovery, and regression tests;
5. residual risk, owner, and any time-bounded follow-up.
