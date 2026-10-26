# Boreal UI Types

Shared TypeScript declaration package for the Boreal UI split packages.

```sh
npm install -D @boreal-ui/types
```

The runtime packages `@boreal-ui/core` and `@boreal-ui/next` reference this package for their public TypeScript declarations.

Import shared types directly when defining a custom color scheme:

```ts
import type { ColorScheme } from "@boreal-ui/types";
import { registerColorScheme, setBorealStyleConfig } from "@boreal-ui/core";

const appScheme: ColorScheme = {
  name: "App Theme",
  primaryColor: "#2563eb",
  secondaryColor: "#64748b",
  tertiaryColor: "#0d9488",
  quaternaryColor: "#f1f5f9",
  backgroundColor: "#ffffff",
};

registerColorScheme([appScheme]);
setBorealStyleConfig({ defaultColorSchemeName: appScheme.name });
```

For Next.js, import the runtime functions from `@boreal-ui/next`.

Published peer and type-verification boundaries are documented in the
[compatibility matrix](https://github.com/DaveC6662/borealui/blob/main/docs/compatibility.md).

Generated documentation metadata and its declarations are published separately
in `@boreal-ui/docs`.
