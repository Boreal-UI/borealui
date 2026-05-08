#!/usr/bin/env node
/* eslint-disable no-undef */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const VERSION = "0.0.887";
const FRAMEWORKS = new Set(["react", "next"]);
const PACKAGE_MANAGERS = new Set(["npm", "pnpm", "yarn"]);

const args = process.argv.slice(2);

function printHelp() {
  console.log(`Boreal UI CLI

Usage:
  boreal-ui create [project-name] [options]
  boreal-ui init [project-name] [options]

Options:
  --framework <react|next>      Select React core or Next.js output
  --typescript, --ts            Generate TypeScript files
  --javascript, --js            Generate JavaScript files
  --starter                     Add a Boreal-themed starter home page
  --minimal                     Add only the smallest working example
  --install                     Install dependencies after generation
  --no-install                  Skip dependency installation
  --git                         Initialize a git repository
  --no-git                      Skip git initialization
  --package-manager <name>      npm, pnpm, or yarn
  --yes, -y                     Use defaults for missing options
  --help, -h                    Show this help message
  --version, -v                 Show CLI version
`);
}

function parseArgs(argv) {
  const options = {
    command: "create",
    projectName: undefined,
    framework: undefined,
    typescript: undefined,
    starter: undefined,
    install: undefined,
    git: undefined,
    packageManager: undefined,
    yes: false,
  };

  const rest = [...argv];
  const first = rest[0];
  if (first === "create" || first === "init") {
    options.command = rest.shift();
  }

  while (rest.length > 0) {
    const arg = rest.shift();

    switch (arg) {
      case "--help":
      case "-h":
        options.help = true;
        break;
      case "--version":
      case "-v":
        options.version = true;
        break;
      case "--yes":
      case "-y":
        options.yes = true;
        break;
      case "--framework":
        options.framework = rest.shift();
        break;
      case "--typescript":
      case "--ts":
        options.typescript = true;
        break;
      case "--javascript":
      case "--js":
        options.typescript = false;
        break;
      case "--starter":
        options.starter = true;
        break;
      case "--minimal":
        options.starter = false;
        break;
      case "--install":
        options.install = true;
        break;
      case "--no-install":
        options.install = false;
        break;
      case "--git":
        options.git = true;
        break;
      case "--no-git":
        options.git = false;
        break;
      case "--package-manager":
        options.packageManager = rest.shift();
        break;
      default:
        if (arg?.startsWith("--")) {
          fail(`Unknown option: ${arg}`);
        }
        if (!options.projectName) {
          options.projectName = arg;
        } else {
          fail(`Unexpected argument: ${arg}`);
        }
    }
  }

  return options;
}

function fail(message) {
  console.error(`\n${message}`);
  console.error("Run boreal-ui --help for usage.");
  process.exit(1);
}

function slugifyProjectName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function promptForOptions(options) {
  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (options.version) {
    console.log(VERSION);
    process.exit(0);
  }

  const rl = createInterface({ input, output });
  const defaults = {
    projectName: "boreal-app",
    framework: "react",
    typescript: true,
    starter: true,
    install: false,
    git: true,
    packageManager: "npm",
  };

  try {
    const promptText = (label, defaultValue) =>
      options.yes ? String(defaultValue) : undefined;

    if (!options.projectName) {
      options.projectName =
        promptText("Project name", defaults.projectName) ??
        (await rl.question(`Project name (${defaults.projectName}): `)) ??
        defaults.projectName;
    }

    options.projectName = slugifyProjectName(
      options.projectName || defaults.projectName,
    );
    if (!options.projectName) {
      options.projectName = defaults.projectName;
    }

    if (!options.framework) {
      options.framework =
        promptText("Framework", defaults.framework) ??
        (await rl.question(
          "Framework: React core or Next.js? (react/next) [react]: ",
        )) ??
        defaults.framework;
    }
    options.framework = normalizeChoice(options.framework, defaults.framework);
    if (!FRAMEWORKS.has(options.framework)) {
      fail("Framework must be either react or next.");
    }

    if (typeof options.typescript !== "boolean") {
      options.typescript = await promptBoolean(
        rl,
        "Use TypeScript?",
        defaults.typescript,
        options.yes,
      );
    }

    if (typeof options.starter !== "boolean") {
      options.starter = await promptBoolean(
        rl,
        "Add a Boreal-themed starter home page?",
        defaults.starter,
        options.yes,
      );
    }

    if (!options.packageManager) {
      options.packageManager =
        promptText("Package manager", defaults.packageManager) ??
        (await rl.question("Package manager? (npm/pnpm/yarn) [npm]: ")) ??
        defaults.packageManager;
    }
    options.packageManager = normalizeChoice(
      options.packageManager,
      defaults.packageManager,
    );
    if (!PACKAGE_MANAGERS.has(options.packageManager)) {
      fail("Package manager must be npm, pnpm, or yarn.");
    }

    if (typeof options.install !== "boolean") {
      options.install = await promptBoolean(
        rl,
        "Install dependencies now?",
        defaults.install,
        options.yes,
      );
    }

    if (typeof options.git !== "boolean") {
      options.git = await promptBoolean(
        rl,
        "Initialize git?",
        defaults.git,
        options.yes,
      );
    }
  } finally {
    rl.close();
  }

  return options;
}

function normalizeChoice(value, fallback) {
  const cleaned = String(value || fallback)
    .trim()
    .toLowerCase();
  if (cleaned === "nextjs" || cleaned === "next.js") return "next";
  if (cleaned === "core" || cleaned === "react-core") return "react";
  return cleaned || fallback;
}

async function promptBoolean(rl, question, defaultValue, yes) {
  if (yes) return defaultValue;
  const suffix = defaultValue ? "Y/n" : "y/N";
  const answer = (await rl.question(`${question} (${suffix}): `))
    .trim()
    .toLowerCase();
  if (!answer) return defaultValue;
  return ["y", "yes", "true", "1"].includes(answer);
}

function writeProject(options) {
  const root = resolve(options.projectName);
  if (existsSync(root) && readdirSync(root).length > 0) {
    fail(`Target directory is not empty: ${root}`);
  }

  mkdirSync(root, { recursive: true });

  const files =
    options.framework === "next"
      ? getNextFiles(options)
      : getReactFiles(options);

  for (const file of files) {
    const target = join(root, file.path);
    mkdirSync(resolve(target, ".."), { recursive: true });
    writeFileSync(target, file.contents.trimStart(), "utf8");
  }

  if (options.git) {
    runCommand("git", ["init"], root, "Initialized git repository.");
  }

  if (options.install) {
    const command = options.packageManager;
    const args = options.packageManager === "yarn" ? [] : ["install"];
    runCommand(command, args, root, "Installed dependencies.");
  }

  printSuccess(root, options);
}

function runCommand(command, commandArgs, cwd, successMessage) {
  const result = spawnSync(command, commandArgs, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status === 0) {
    console.log(successMessage);
    return;
  }

  console.warn(
    `Skipped: ${command} ${commandArgs.join(" ")} did not complete successfully.`,
  );
}

function packageJson(options) {
  const isNext = options.framework === "next";
  const scripts = isNext
    ? {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      }
    : {
        dev: "vite",
        build: options.typescript ? "tsc -b && vite build" : "vite build",
        preview: "vite preview",
      };

  const dependencies = isNext
    ? {
        "boreal-ui": "^0.0.887",
        marked: ">=12.0.0",
        next: ">=13.0.0",
        react: ">=18.2.0",
        "react-dom": ">=18.2.0",
        uuid: ">=9.0.0",
      }
    : {
        "boreal-ui": "^0.0.887",
        marked: ">=12.0.0",
        react: ">=18.2.0",
        "react-dom": ">=18.2.0",
        uuid: ">=9.0.0",
      };

  const devDependencies = isNext
    ? options.typescript
      ? {
          "@types/node": "latest",
          "@types/react": "latest",
          "@types/react-dom": "latest",
          typescript: "latest",
        }
      : {}
    : {
        "@vitejs/plugin-react": "latest",
        vite: "latest",
        ...(options.typescript
          ? {
              "@types/react": "latest",
              "@types/react-dom": "latest",
              typescript: "latest",
            }
          : {}),
      };

  return JSON.stringify(
    {
      name: options.projectName,
      version: "0.1.0",
      private: true,
      type: "module",
      scripts,
      dependencies,
      devDependencies,
    },
    null,
    2,
  );
}

function getReactFiles(options) {
  const ext = options.typescript ? "tsx" : "jsx";
  const files = [
    { path: "package.json", contents: packageJson(options) },
    { path: "index.html", contents: reactIndexHtml(options.projectName, ext) },
    { path: `src/main.${ext}`, contents: reactMain(options, ext) },
    {
      path: `src/App.${ext}`,
      contents: options.starter ? reactStarterApp() : reactMinimalApp(),
    },
    { path: "src/App.css", contents: starterCss() },
    { path: ".gitignore", contents: gitignore() },
    { path: "README.md", contents: projectReadme(options) },
  ];

  if (options.typescript) {
    files.push({ path: "tsconfig.json", contents: reactTsConfig() });
    files.push({ path: "tsconfig.node.json", contents: reactNodeTsConfig() });
  }

  files.push({ path: "vite.config.js", contents: viteConfig() });
  return files;
}

function getNextFiles(options) {
  const ext = options.typescript ? "tsx" : "jsx";
  const files = [
    { path: "package.json", contents: packageJson(options) },
    { path: `app/layout.${ext}`, contents: nextLayout(options) },
    { path: `app/providers.${ext}`, contents: nextProviders(options) },
    {
      path: `app/page.${ext}`,
      contents: options.starter ? nextStarterPage() : nextMinimalPage(),
    },
    { path: "app/globals.css", contents: starterCss() },
    {
      path: "next.config.js",
      contents: "const nextConfig = {};\n\nexport default nextConfig;\n",
    },
    { path: ".gitignore", contents: gitignore() },
    { path: "README.md", contents: projectReadme(options) },
  ];

  if (options.typescript) {
    files.push({ path: "tsconfig.json", contents: nextTsConfig() });
    files.push({
      path: "next-env.d.ts",
      contents:
        '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n',
    });
  }

  return files;
}

function reactIndexHtml(projectName, ext) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${ext}"></script>
  </body>
</html>
`;
}

function reactMain(options) {
  const rootElement = options.typescript
    ? 'document.getElementById("root")!'
    : 'document.getElementById("root")';

  return `import React from "react";
import ReactDOM from "react-dom/client";
import "boreal-ui/core/globals.css";
import "./App.css";
import App from "./App";
import { ThemeProvider, setBorealStyleConfig } from "boreal-ui/core";

setBorealStyleConfig({
  defaultTheme: "primary",
  defaultSize: "medium",
  defaultRounding: "medium",
  defaultShadow: "light",
  defaultBorderWidth: "none",
  defaultColorSchemeName: "Forest Dusk",
});

ReactDOM.createRoot(${rootElement}).render(
  <React.StrictMode>
    <ThemeProvider initialSchemeName="Forest Dusk">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
`;
}

function reactStarterApp() {
  return `"use client";

import { Badge, Button, Card, MetricBox, ThemeSelect, Typography } from "boreal-ui/core";

export default function App() {
  return (
    <main className="pageShell">
      <section className="heroBand" aria-labelledby="home-title">
        <div className="heroCopy">
          <Badge theme="secondary" outline>
            Boreal UI starter
          </Badge>
          <Typography as="h1" variant="h1" id="home-title">
            Build a polished interface with Boreal UI.
          </Typography>
          <Typography as="p" variant="body">
            This starter includes global styles, theme setup, peer dependencies, and a few production-minded components wired together.
          </Typography>
          <div className="actions">
            <Button size="large" theme="primary">
              Start building
            </Button>
            <Button size="large" theme="secondary" outline>
              View components
            </Button>
          </div>
        </div>
        <Card title="Theme controls" description="Switch color schemes without leaving the page." glass shadow="medium">
          <ThemeSelect label="Color scheme" />
        </Card>
      </section>

      <section className="metricGrid" aria-label="Project highlights">
        <MetricBox title="Components" value="40+" subtext="Core and Next builds" theme="primary" />
        <MetricBox title="Theming" value="Ready" subtext="CSS variables and schemes" theme="secondary" outline />
        <MetricBox title="A11y" value="First" subtext="Semantic defaults and focus states" theme="tertiary" />
      </section>
    </main>
  );
}
`;
}

function reactMinimalApp() {
  return `import { Button, Card } from "boreal-ui/core";

export default function App() {
  return (
    <main className="pageShell">
      <Card title="Boreal UI is ready" description="Core React components and global styles are installed.">
        <Button theme="primary">Build the app</Button>
      </Card>
    </main>
  );
}
`;
}

function nextLayout(options) {
  const typeAnnotation = options.typescript
    ? ": Readonly<{ children: ReactNode }>"
    : "";
  return `import "boreal-ui/next/globals.css";
import "./globals.css";
import Providers from "./providers";
${options.typescript ? 'import type { Metadata } from "next";\n' : ""}
${options.typescript ? 'import type { ReactNode } from "react";\n' : ""}
${options.typescript ? 'export const metadata: Metadata = {\n  title: "Boreal UI App",\n  description: "Created with the Boreal UI CLI",\n};\n' : 'export const metadata = {\n  title: "Boreal UI App",\n  description: "Created with the Boreal UI CLI",\n};\n'}
export default function RootLayout({ children }${typeAnnotation}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
`;
}

function nextProviders(options) {
  const typeAnnotation = options.typescript
    ? ": Readonly<{ children: ReactNode }>"
    : "";
  return `"use client";

import { ThemeProvider, setBorealStyleConfig } from "boreal-ui/next";
${options.typescript ? 'import type { ReactNode } from "react";\n' : ""}

setBorealStyleConfig({
  defaultTheme: "primary",
  defaultSize: "medium",
  defaultRounding: "medium",
  defaultShadow: "light",
  defaultBorderWidth: "none",
  defaultColorSchemeName: "Forest Dusk",
});

export default function Providers({ children }${typeAnnotation}) {
  return <ThemeProvider initialSchemeName="Forest Dusk">{children}</ThemeProvider>;
}
`;
}

function nextStarterPage() {
  return `"use client";

import { Badge, Button, Card, MetricBox, ThemeSelect, Typography } from "boreal-ui/next";

export default function Home() {
  return (
    <main className="pageShell">
      <section className="heroBand" aria-labelledby="home-title">
        <div className="heroCopy">
          <Badge theme="secondary" outline>
            Boreal UI starter
          </Badge>
          <Typography as="h1" variant="h1" id="home-title">
            Build a polished interface with Boreal UI.
          </Typography>
          <Typography as="p" variant="body">
            This starter includes Next.js app-router setup, global styles, theme setup, peer dependencies, and reusable UI primitives.
          </Typography>
          <div className="actions">
            <Button size="large" theme="primary">
              Start building
            </Button>
            <Button size="large" theme="secondary" outline>
              View components
            </Button>
          </div>
        </div>
        <Card title="Theme controls" description="Switch color schemes without leaving the page." glass shadow="medium">
          <ThemeSelect label="Color scheme" />
        </Card>
      </section>

      <section className="metricGrid" aria-label="Project highlights">
        <MetricBox title="Components" value="40+" subtext="Core and Next builds" theme="primary" />
        <MetricBox title="Theming" value="Ready" subtext="CSS variables and schemes" theme="secondary" outline />
        <MetricBox title="A11y" value="First" subtext="Semantic defaults and focus states" theme="tertiary" />
      </section>
    </main>
  );
}
`;
}

function nextMinimalPage() {
  return `import { Button, Card } from "boreal-ui/next";

export default function Home() {
  return (
    <main className="pageShell">
      <Card title="Boreal UI is ready" description="Next.js components and global styles are installed.">
        <Button theme="primary">Build the app</Button>
      </Card>
    </main>
  );
}
`;
}

function starterCss() {
  return `:root {
  color-scheme: light dark;
  font-family: var(--font-family-ui, Inter, ui-sans-serif, system-ui, sans-serif);
  background: var(--background-color);
  color: var(--text-color);
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
}

.pageShell {
  width: min(100%, 1120px);
  margin: 0 auto;
  padding: clamp(1rem, 4vw, 3rem);
}

.heroBand {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(min(100%, 20rem), 0.7fr);
  gap: var(--spacing-lg, 1.5rem);
  align-items: center;
  min-height: 70vh;
}

.heroCopy,
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md, 1rem);
}

.heroCopy {
  flex-direction: column;
  align-items: flex-start;
}

.heroCopy p {
  max-width: 62ch;
  overflow-wrap: anywhere;
}

.metricGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: var(--spacing-md, 1rem);
}

@media (max-width: 720px) {
  .heroBand {
    grid-template-columns: 1fr;
    min-height: auto;
  }
}
`;
}

function reactTsConfig() {
  return `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;
}

function reactNodeTsConfig() {
  return `{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.js"]
}
`;
}

function nextTsConfig() {
  return `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`;
}

function viteConfig() {
  return `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`;
}

function gitignore() {
  return `node_modules
dist
.next
out
coverage
.env
.env.local
*.local
`;
}

function projectReadme(options) {
  const dev =
    options.packageManager === "npm"
      ? "npm run dev"
      : `${options.packageManager} dev`;
  const install =
    options.packageManager === "npm"
      ? "npm install"
      : `${options.packageManager} install`;
  const build =
    options.packageManager === "npm"
      ? "npm run build"
      : `${options.packageManager} build`;
  const importPath =
    options.framework === "next" ? "boreal-ui/next" : "boreal-ui/core";

  return `# ${options.projectName}

Created with the Boreal UI CLI.

## Scripts

\`\`\`bash
${install}
${dev}
${build}
\`\`\`

This project imports Boreal UI from \`${importPath}\` and loads the required global stylesheet once near the application root.
`;
}

function printSuccess(root, options) {
  const cd = `cd ${options.projectName}`;
  const install =
    options.packageManager === "npm"
      ? "npm install"
      : `${options.packageManager} install`;
  const dev =
    options.packageManager === "npm"
      ? "npm run dev"
      : `${options.packageManager} dev`;

  console.log(`
Created ${options.projectName} at ${root}

Next steps:
  ${cd}
  ${options.install ? dev : `${install}\n  ${dev}`}

Imports are configured for ${options.framework === "next" ? "boreal-ui/next" : "boreal-ui/core"}.
`);
}

const options = await promptForOptions(parseArgs(args));
writeProject(options);
