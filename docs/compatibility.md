# Published compatibility

Boreal separates consumer peer compatibility from the toolchain used to build
the repository. Compatibility is verified from packed npm artifacts in isolated
temporary consumer projects; source imports and the workspace's root
`node_modules` are not used.

| Package | React | ReactDOM | Next | Node |
| --- | --- | --- | --- | --- |
| `@boreal-ui/core` | `>=18.2.0` | `>=18.2.0` | — | No package engine; verified on Node 20 and 22 |
| `@boreal-ui/next` | `>=18.2.0` | `>=18.2.0` | `>=13.0.0` | No package engine; verified on Node 20 and 22 where the selected Next version permits it |
| `@boreal-ui/types` | `>=18.2.0` | `>=18.2.0` | — | No package engine |
| `@boreal-ui/docs` | — | — | — | No package engine |
| `@boreal-ui/cli` | — | — | — | `>=18` |

The Boreal workspace itself requires Node `^20.19.0 || >=22.12.0`. This is a
build/development constraint, not a peer requirement imposed by the runtime
packages.

## Verified matrix

CI exercises these representative boundaries:

- React 18.2 and the current React 19 line with `@boreal-ui/core`.
- Next 13.5.11 with React 18.2, Next 15.5 with React 19, and the current Next 16 line.
- Node 20.19 and Node 22.12 for runtime packages.
- Node 18.20 and Node 22.12 for the CLI.

The framework lanes respect Next's own published constraints. Next 13.5.11
requires React 18.2 and Node 16.14 or newer; Next 15.5.26 accepts React 18.2 or
19 and Node 18.18 or newer; Next 16.3.6 accepts React 18.2 or 19 and requires
Node 20.9 or newer. Boreal tests only combinations that satisfy both the
framework and Boreal ranges.

Each Core fixture checks declarations, ESM bundling, global/component CSS,
representative rendering, context usage, form rendering, and interaction. Each
Next fixture type-checks and runs a production App Router build containing both
client components and `@boreal-ui/next/server` imports. The harness prints the
resolved Node, React, ReactDOM, and Next versions and rejects dependencies that
resolve outside its temporary fixture.

TypeScript does not currently have a separately published support range. The
generated declarations are checked with the repository's current TypeScript
version in every React and Next fixture.
