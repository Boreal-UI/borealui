# Boreal UI CLI

Standalone CLI for configuring Boreal UI in existing React and Next.js apps.

```sh
npx @boreal-ui/cli@latest init --yes
```

The CLI detects React or Next.js and npm, pnpm, Yarn, or Bun. It installs the framework-specific runtime package, imports global styles once, and wires `ThemeProvider` without copying a brittle snapshot of Boreal's defaults into the app. Component declarations work through the runtime package. Use `--dry-run` to preview, `--no-install` to manage dependencies yourself, or `--agents-guide` to add optional AI-agent guidance.

The CLI requires Node 18 or newer; its minimum and current verification lanes
are listed in the [published compatibility matrix](https://github.com/DaveC6662/borealui/blob/main/docs/compatibility.md).
