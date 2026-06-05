# Boreal UI CLI

Standalone CLI for configuring Boreal UI in existing React and Next.js apps.

```sh
npm install --save-dev @boreal-ui/cli
npx @boreal-ui/cli init --framework next
```

The CLI installs the framework-specific runtime package, `@boreal-ui/core` or `@boreal-ui/next`. When it detects TypeScript, it can also add `@boreal-ui/types` as a dev dependency, and it can create a consumer-focused `AGENTS.md` guide for using Boreal UI correctly in the app.
