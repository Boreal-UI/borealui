# Access Control Standard

This standard defines how administrative and release access is granted,
reviewed, and removed for the Boreal UI GitHub repository, npm scope, and
supporting automation. It complements the
[Secure Development Lifecycle](./secure-development-lifecycle.md) and
[Security Foundation](./security-foundation.md).

## Principles

- Grant the minimum role needed for the work and prefer team-managed access
  over direct user grants.
- Keep at least two trusted administrators where the hosting plan and team size
  permit, so recovery does not depend on one account.
- Require phishing-resistant multi-factor authentication for administrators
  and publishers. Recovery codes and hardware-key backups must be stored
  securely and separately from the primary device.
- Use GitHub environments and npm trusted publishing for releases. Do not issue
  long-lived npm automation tokens when OIDC can perform the release.
- Separate authorship, approval, and release authorization whenever two
  qualified maintainers are available.

## Roles

| Role | Permitted access | Restrictions |
| --- | --- | --- |
| Contributor | Forks or feature branches and pull requests | No direct default-branch, environment, npm publish, or security-advisory administration |
| Maintainer | Repository write access, review, and routine triage | Cannot bypass required checks or self-approve protected changes |
| Release approver | Approval for the protected `npm` environment | Must review the release commit, tag, checks, and package versions before approval |
| Administrator | Repository rules, teams, environments, security settings, and recovery | Reserved for the smallest practical group; administrative changes require recorded review |
| Security maintainer | Private vulnerability reports and security-advisory coordination | Access is limited to people actively responsible for vulnerability response |

npm package ownership must be limited to active release administrators. Normal
publication uses the trusted publisher configured for `release.yml` and the
protected `npm` environment rather than a maintainer workstation.

## Granting and changing access

An administrator must record the business need, requested role, scope, owner,
and review date before granting privileged access. A second administrator or
maintainer reviews administrative, release, npm-owner, and private-security
access changes. Prefer a time-limited grant for incident response or temporary
maintenance.

Before access becomes active:

1. verify the person's identity through an established channel;
2. confirm multi-factor authentication and account recovery are configured;
3. add the person through the appropriate GitHub team or npm role;
4. verify that branch rules and environment protections still prevent direct
   publication or self-approval; and
5. record the approver and next review date without storing recovery secrets.

## Removing access

Remove access immediately when a maintainer leaves, changes responsibility, or
loses a trusted device. Remove the user from GitHub teams, repository access,
the `npm` environment, npm package ownership, and private advisory access as
applicable. Revoke active sessions, credentials, deploy keys, and recovery
material that may have been exposed, then review recent audit events and
release activity.

## Review and monitoring

Administrators review privileged access at least quarterly and after every
security incident or team change. The review covers:

- GitHub organization and repository owners, teams, outside collaborators, and
  installed applications;
- branch rulesets, CODEOWNERS, required checks, environment reviewers, and
  environment bypass settings;
- npm organization roles, package owners, trusted-publisher configuration, and
  active tokens;
- deploy keys, webhooks, workflow permissions, Actions secrets, and unusual
  audit-log or release events; and
- expired temporary grants and accounts that no longer need access.

Record the review date, reviewer, findings, and remediation owner. Do not copy
tokens, recovery codes, private advisory details, or personal data into the
review record.

## Emergency access

Break-glass access is limited to restoring availability, revoking compromised
access, or stopping an unsafe release. Use the narrowest available permission,
record the reason and actions taken, and remove temporary access as soon as the
incident is contained. A second administrator must review the event and any
ruleset bypass within one business day, followed by the incident process in the
[Secure Development Lifecycle](./secure-development-lifecycle.md#vulnerability-response).
