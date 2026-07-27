import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
  __testing,
  initCommand,
} from "../../packages/cli/src/commands/init.js";
import { VERSION } from "../../packages/cli/src/utils/constants.js";

describe("Boreal UI CLI setup", () => {
  let root: string;
  let logSpy: jest.SpyInstance<void, Parameters<typeof console.log>>;
  let errorSpy: jest.SpyInstance<void, Parameters<typeof console.error>>;
  let warnSpy: jest.SpyInstance<void, Parameters<typeof console.warn>>;

  beforeEach(() => {
    root = mkdtempSync(join(process.cwd(), ".tmp-boreal-cli-"));

    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    warnSpy.mockRestore();

    rmSync(root, { recursive: true, force: true });
  });

  function writePackageJson(
    dependencies: Record<string, string>,
    extra: Record<string, unknown> = {},
  ): void {
    writeFileSync(
      join(root, "package.json"),
      `${JSON.stringify(
        {
          ...extra,
          dependencies,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
  }

  function writeNextApp(layoutSource: string): void {
    mkdirSync(join(root, "app"), { recursive: true });

    writePackageJson({
      next: "^16.0.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    });

    writeFileSync(join(root, "app", "layout.tsx"), layoutSource, "utf8");
  }

  function writeNextPagesApp(appSource: string): void {
    mkdirSync(join(root, "pages"), { recursive: true });

    writePackageJson({
      next: "^16.0.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    });

    writeFileSync(join(root, "pages", "_app.tsx"), appSource, "utf8");
  }

  function writeReactApp(entrySource: string): void {
    mkdirSync(join(root, "src"), { recursive: true });

    writePackageJson({
      "@vitejs/plugin-react": "^5.0.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    });

    writeFileSync(join(root, "src", "main.tsx"), entrySource, "utf8");
  }

  it("creates a minimal client provider for Next app router setup", async () => {
    writeNextApp(`export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`);

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    const layout = readFileSync(join(root, "app", "layout.tsx"), "utf8");
    const provider = readFileSync(
      join(root, "app", "boreal-provider.tsx"),
      "utf8",
    );

    expect(layout).toContain('import "@boreal-ui/next/globals.css";');
    expect(layout).toContain('import BorealProvider from "./boreal-provider";');
    expect(layout).toContain('<html lang="en">');
    expect(layout).not.toContain("suppressHydrationWarning");
    expect(layout).toContain("<BorealProvider>{children}</BorealProvider>");

    expect(provider).toContain('"use client";');
    expect(provider).toContain(
      'import type { ReactNode } from "react";',
    );
    expect(provider).toContain(
      'import { ThemeProvider } from "@boreal-ui/next";',
    );
    expect(provider).toContain("{ children }: { children: ReactNode }");
    expect(provider).toContain("<ThemeProvider>{children}</ThemeProvider>");
    expect(provider).not.toContain("setBorealStyleConfig");
    expect(provider).not.toContain("initialSchemeName");
  });

  it("repairs an existing Next app provider to avoid pre-hydration html mutation", async () => {
    writeNextApp(`export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`);

    writeFileSync(
      join(root, "app", "providers.tsx"),
      `"use client";

import { ThemeProvider, setBorealStyleConfig } from "@boreal-ui/next";

setBorealStyleConfig({
  defaultColorSchemeName: "Forest Dusk",
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider initialSchemeName="Forest Dusk">{children}</ThemeProvider>;
}
`,
      "utf8",
    );

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    expect(readFileSync(join(root, "app", "providers.tsx"), "utf8")).toContain(
      '<ThemeProvider initialSchemeName="Forest Dusk">',
    );
  });

  it("adds @boreal-ui/next to package.json for Next apps when missing", async () => {
    writeNextApp(`export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`);

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    const packageJson = JSON.parse(
      readFileSync(join(root, "package.json"), "utf8"),
    ) as {
      dependencies: Record<string, string>;
    };

    expect(packageJson.dependencies["@boreal-ui/next"]).toBe(`^${VERSION}`);
  });

  it("does not add a redundant separate types package for TypeScript apps", async () => {
    writeNextApp(`export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`);

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    const packageJson = JSON.parse(
      readFileSync(join(root, "package.json"), "utf8"),
    ) as {
      devDependencies?: Record<string, string>;
    };

    expect(packageJson.devDependencies?.["@boreal-ui/types"]).toBeUndefined();
  });

  it("does not add @boreal-ui/types for JavaScript apps", async () => {
    mkdirSync(join(root, "src"), { recursive: true });

    writePackageJson({
      "@vitejs/plugin-react": "^5.0.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    });

    writeFileSync(
      join(root, "src", "main.jsx"),
      `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
`,
      "utf8",
    );

    await initCommand({
      cwd: root,
      framework: "react",
      install: false,
      yes: true,
    });

    const packageJson = JSON.parse(
      readFileSync(join(root, "package.json"), "utf8"),
    ) as {
      devDependencies?: Record<string, string>;
    };

    expect(packageJson.devDependencies?.["@boreal-ui/types"]).toBeUndefined();
  });

  it("adds an AGENTS.md guide only when explicitly requested", async () => {
    writeReactApp(`import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
`);

    await initCommand({
      cwd: root,
      framework: "react",
      install: false,
      addAgentsGuide: true,
      yes: true,
    });

    const agentsGuide = readFileSync(join(root, "AGENTS.md"), "utf8");

    expect(agentsGuide).toContain(
      "Guidance for AI agents working in this React project with Boreal UI.",
    );
    expect(agentsGuide).toContain(
      "Import components from `@boreal-ui/core`.",
    );
    expect(agentsGuide).toContain(
      "Import Boreal globals once from `@boreal-ui/core/globals.css`",
    );
    expect(agentsGuide).toContain(
      "Component declarations work through the framework package",
    );
  });

  it("does not overwrite an existing AGENTS.md guide", async () => {
    writeReactApp(`import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
`);
    writeFileSync(join(root, "AGENTS.md"), "Existing guidance\n", "utf8");

    await initCommand({
      cwd: root,
      framework: "react",
      install: false,
      yes: true,
    });

    expect(readFileSync(join(root, "AGENTS.md"), "utf8")).toBe(
      "Existing guidance\n",
    );
  });

  it("does not add an AGENTS.md guide during the default setup", async () => {
    writeReactApp(`import App from "./App";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(<App />);
`);

    await initCommand({
      cwd: root,
      framework: "react",
      install: false,
      yes: true,
    });

    expect(existsSync(join(root, "AGENTS.md"))).toBe(false);
  });

  it("does not duplicate @boreal-ui/next when it already exists", async () => {
    mkdirSync(join(root, "app"), { recursive: true });

    writePackageJson({
      next: "^16.0.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "@boreal-ui/next": "^0.0.100",
    });

    writeFileSync(
      join(root, "app", "layout.tsx"),
      `export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
      "utf8",
    );

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    const packageJson = JSON.parse(
      readFileSync(join(root, "package.json"), "utf8"),
    ) as {
      dependencies: Record<string, string>;
    };

    expect(packageJson.dependencies["@boreal-ui/next"]).toBe("^0.0.100");
  });

  it("does not write files during dry run", async () => {
    writeNextApp(`export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`);

    const originalLayout = readFileSync(
      join(root, "app", "layout.tsx"),
      "utf8",
    );
    const originalPackageJson = readFileSync(
      join(root, "package.json"),
      "utf8",
    );

    await initCommand({
      cwd: root,
      framework: "next",
      install: true,
      recommendedGlobals: false,
      dryRun: true,
      yes: true,
    });

    expect(readFileSync(join(root, "app", "layout.tsx"), "utf8")).toBe(
      originalLayout,
    );
    expect(readFileSync(join(root, "package.json"), "utf8")).toBe(
      originalPackageJson,
    );
    expect(existsSync(join(root, "app", "boreal-provider.tsx"))).toBe(false);

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Planned changes:"),
    );
  });

  it("creates a Boreal-safe Next globals.css baseline when recommendedGlobals is true", async () => {
    writeNextApp(`export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`);

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: true,
      yes: true,
    });

    const layout = readFileSync(join(root, "app", "layout.tsx"), "utf8");
    const globals = readFileSync(join(root, "app", "globals.css"), "utf8");

    expect(layout).toContain('import "@boreal-ui/next/globals.css";');
    expect(layout).toContain('import "./globals.css";');

    expect(globals).toContain("html {");
    expect(globals).toContain("box-sizing: border-box;");
    expect(globals).toContain("*::before");
    expect(globals).toContain("box-sizing: inherit;");
    expect(globals).toContain("body {");
    expect(globals).toContain("margin: 0;");
  });

  it("repairs a broad starter reset in Next globals.css", async () => {
    writeNextApp(`export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`);

    writeFileSync(
      join(root, "app", "globals.css"),
      `* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

a {
  color: inherit;
}
`,
      "utf8",
    );

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: true,
      yes: true,
    });

    const globals = readFileSync(join(root, "app", "globals.css"), "utf8");

    expect(globals).toContain("html {");
    expect(globals).toContain("box-sizing: border-box;");
    expect(globals).toContain("*::before");
    expect(globals).toContain("box-sizing: inherit;");
    expect(globals).toContain("body {");
    expect(globals).toContain("margin: 0;");
    expect(globals).toContain("a {");
    expect(globals).not.toContain("padding: 0;");
  });

  it("uses an existing app router provider import name when present", async () => {
    writeNextApp(`import AppProviders from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`);

    writeFileSync(
      join(root, "app", "providers.tsx"),
      `"use client";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return children;
}
`,
      "utf8",
    );

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    const layout = readFileSync(join(root, "app", "layout.tsx"), "utf8");
    const provider = readFileSync(join(root, "app", "providers.tsx"), "utf8");

    expect(layout).toContain('import AppProviders from "./providers";');
    expect(layout).not.toContain("import BorealProvider");
    expect(layout).toContain("<AppProviders>{children}</AppProviders>");

    expect(provider).toContain(
      'import { ThemeProvider } from "@boreal-ui/next";',
    );
    expect(provider).toContain(
      '<ThemeProvider>{children}</ThemeProvider>',
    );
  });

  it("configures a Next pages router app", async () => {
    writeNextPagesApp(`export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
`);

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    const app = readFileSync(join(root, "pages", "_app.tsx"), "utf8");

    expect(app).toContain('import "@boreal-ui/next/globals.css";');
    expect(app).toContain(
      'import { ThemeProvider } from "@boreal-ui/next";',
    );
    expect(app).not.toContain("setBorealStyleConfig");
    expect(app).toContain("<ThemeProvider>");
    expect(app).toContain("<Component {...pageProps} />");
    expect(app).toContain("</ThemeProvider>");
    expect(existsSync(join(root, "pages", "boreal-provider.tsx"))).toBe(false);
  });

  it("configures a React core app", async () => {
    writeReactApp(`import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
`);

    await initCommand({
      cwd: root,
      framework: "react",
      install: false,
      yes: true,
    });

    const entry = readFileSync(join(root, "src", "main.tsx"), "utf8");
    const packageJson = JSON.parse(
      readFileSync(join(root, "package.json"), "utf8"),
    ) as {
      dependencies: Record<string, string>;
    };

    expect(entry).toContain('import "@boreal-ui/core/globals.css";');
    expect(entry).toContain(
      'import { ThemeProvider } from "@boreal-ui/core";',
    );
    expect(packageJson.dependencies["@boreal-ui/core"]).toBe(`^${VERSION}`);
    expect(entry).not.toContain("setBorealStyleConfig");
    expect(entry).toContain("<ThemeProvider>");
    expect(entry).toContain("<App />");
    expect(entry).toContain("</ThemeProvider>");
  });

  it("auto-detects Next from dependencies when framework is omitted", async () => {
    writeNextApp(`export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`);

    await initCommand({
      cwd: root,
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    expect(existsSync(join(root, "app", "boreal-provider.tsx"))).toBe(true);

    const layout = readFileSync(join(root, "app", "layout.tsx"), "utf8");

    expect(layout).toContain('import "@boreal-ui/next/globals.css";');
  });

  it("detects pnpm as the package manager from pnpm-lock.yaml in success output", async () => {
    writeNextApp(`export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`);

    writeFileSync(join(root, "pnpm-lock.yaml"), "", "utf8");

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "Next step: run pnpm install.",
      ),
    );
  });

  it("detects Bun from its current text lockfile", async () => {
    writeNextApp(`export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
`);
    writeFileSync(join(root, "bun.lock"), "", "utf8");

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining("Next step: run bun install."),
    );
  });

  it("rejects file candidates that resolve outside the project root", () => {
    const exitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {
        throw new Error("process.exit");
      }) as typeof process.exit);

    try {
      expect(() =>
        __testing.resolveProjectPath(root, "..", "outside-project.txt"),
      ).toThrow("process.exit");
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Refusing to access a path outside the project directory"),
      );
    } finally {
      exitSpy.mockRestore();
    }
  });

  it("prints already configured message when there are no changes", async () => {
    mkdirSync(join(root, "app"), { recursive: true });

    writePackageJson({
      next: "^16.0.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "@boreal-ui/next": `^${VERSION}`,
      "@boreal-ui/types": `^${VERSION}`,
    });

    writeFileSync(
      join(root, "app", "layout.tsx"),
      `import "@boreal-ui/next/globals.css";
import BorealProvider from "./boreal-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><BorealProvider>{children}</BorealProvider></body>
    </html>
  );
}
`,
      "utf8",
    );

    writeFileSync(
      join(root, "app", "boreal-provider.tsx"),
      `"use client";

import React from "react";
import { ThemeProvider, setBorealStyleConfig } from "@boreal-ui/next";

setBorealStyleConfig({
  defaultTheme: "primary",
  defaultSize: "medium",
  defaultRounding: "medium",
  defaultShadow: "light",
  defaultBorderWidth: "none",
  defaultColorSchemeName: "Forest Dusk",
});

export default function BorealProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider initialSchemeName="Forest Dusk">{children}</ThemeProvider>
  );
}
`,
      "utf8",
    );
    writeFileSync(join(root, "AGENTS.md"), "Existing guidance\n", "utf8");

    await initCommand({
      cwd: root,
      framework: "next",
      install: false,
      recommendedGlobals: false,
      yes: true,
    });

    expect(logSpy).toHaveBeenCalledWith(
      "Boreal UI already looks configured for this project.",
    );
  });
});
