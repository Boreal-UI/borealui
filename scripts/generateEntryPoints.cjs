const fs = require("fs");
const path = require("path");
const { updateFileSync } = require("./safeFileUpdates.cjs");

const componentNames = {
  NavBar: "Navbar",
  PopOver: "Popover",
};

const nestedEntries = [
  {
    name: "ChipGroup",
    componentPath: "Chip/ChipGroup",
    typesPath: "Chip/ChipGroup/ChipGroup.types",
    styleName: "ChipGroup",
  },
  {
    name: "ThemeSelect",
    componentPath: "Select/ThemeSelect",
    typesPath: "Select/Select.types",
  },
];

const serverEntries = [
  "Alert",
  "Avatar",
  "Badge",
  "BarChart",
  "BreadCrumbPageHeader",
  "Breadcrumbs",
  "Button",
  "Card",
  "CheckBox",
  "Divider",
  "EmptyState",
  "Footer",
  "Layout",
  "Legend",
  "LineChart",
  "MetricBox",
  "PageHeader",
  "ProgressBar",
  "RadioButton",
  "RadioGroup",
  "Select",
  "Skeleton",
  "Sparkline",
  "TextArea",
  "TextInput",
  "Timeline",
  "Toolbar",
  "Typography",
  "ValidationSummary",
];

function writeFileIfChanged(filePath, content) {
  const normalize = (value) => value.replace(/\r\n/g, "\n");

  updateFileSync(
    filePath,
    (existing) =>
      normalize(existing) === normalize(content) ? existing : content,
    { create: true },
  );
}

function writeEntrypoint({
  type,
  outDir,
  name,
  componentPath,
  typesPath,
  styleName,
}) {
  const componentsDir = path.resolve(__dirname, "../src/components");
  const resolvedStyleName = styleName ?? name;
  const stylePath =
    type === "core"
      ? path.resolve(
          componentsDir,
          componentPath,
          "core",
          `${resolvedStyleName}.scss`,
        )
      : path.resolve(
          componentsDir,
          componentPath,
          "next",
          `${resolvedStyleName}.module.scss`,
        );

  const styleImport = fs.existsSync(stylePath)
    ? type === "core"
      ? `import "../components/${componentPath}/core/${resolvedStyleName}.scss";`
      : `import "../components/${componentPath}/next/${resolvedStyleName}.module.scss";`
    : "";

  const content =
    name === "Layout"
      ? `
${styleImport}
export {
  BentoBox,
  BentoBoxItem,
  Container,
  Grid,
  Inline,
  Section,
  Stack,
} from "../components/${componentPath}/${type}/${name}";
export * from "../components/${typesPath}";
`.trim() + "\n"
      : name === "ToastProvider"
        ? `
${styleImport}
export { default, useToast } from "../components/${componentPath}/${type}/${name}";
export * from "../components/${typesPath}";
`.trim() + "\n"
        : `
${styleImport}
export { default } from "../components/${componentPath}/${type}/${name}";
export * from "../components/${typesPath}";
`.trim() + "\n";

  fs.writeFileSync(path.join(outDir, `${name}.ts`), content);
}

function generateEntrypoints(type) {
  const componentsDir = path.resolve(__dirname, "../src/components");
  const outDir = path.resolve(__dirname, `../src/${type}`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.readdirSync(componentsDir, { withFileTypes: true }).forEach((dirent) => {
    if (!dirent.isDirectory()) return;

    const component = dirent.name;
    const name = componentNames[component] ?? component;

    writeEntrypoint({
      type,
      outDir,
      name,
      componentPath: component,
      typesPath: `${component}/${component}.types`,
      styleName: component,
    });
  });

  nestedEntries.forEach((entry) =>
    writeEntrypoint({
      type,
      outDir,
      ...entry,
    }),
  );
}

generateEntrypoints("core");
generateEntrypoints("next");
generateServerEntrypoints();
console.log("Generated entrypoint files!");

function writeServerEntrypoint({
  outDir,
  name,
  componentPath,
  typesPath,
  styleName,
}) {
  const componentsDir = path.resolve(__dirname, "../src/components");
  const resolvedStyleName = styleName ?? name;
  const stylePath = path.resolve(
    componentsDir,
    componentPath,
    "next",
    `${resolvedStyleName}.module.scss`,
  );
  const styleImport = fs.existsSync(stylePath)
    ? `import "../../components/${componentPath}/next/${resolvedStyleName}.module.scss";`
    : "";

  const content =
    name === "Layout"
      ? `
${styleImport}
export {
  BentoBox,
  BentoBoxItem,
  Container,
  Grid,
  Inline,
  Section,
  Stack,
} from "../../components/${componentPath}/server/${name}";
export * from "../../components/${typesPath}";
`.trim() + "\n"
      : `
${styleImport}
export { default } from "../../components/${componentPath}/server/${name}";
export * from "../../components/${typesPath}";
`.trim() + "\n";

  writeFileIfChanged(path.join(outDir, `${name}.ts`), content);
}

function generateServerEntrypoints() {
  const outDir = path.resolve(__dirname, "../src/next/server");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  serverEntries.forEach((name) =>
    writeServerEntrypoint({
      outDir,
      name,
      componentPath: name === "RadioGroup" ? "RadioButton" : name,
      typesPath:
        name === "RadioGroup"
          ? "RadioButton/RadioButton.types"
          : `${name}/${name}.types`,
      styleName: name === "RadioGroup" ? "RadioButton" : name,
    }),
  );

  const indexExports = serverEntries
    .map((name) =>
      name === "Layout"
        ? 'export { BentoBox, BentoBoxItem, Container, Grid, Inline, Section, Stack } from "./Layout";'
        : `export { default as ${name} } from "./${name}";`,
    )
    .join("\n");
  const themeProviderExports = `export {
  getThemeAttributes,
  getThemeStyle,
  readSavedSchemeCookie,
  resolveThemeScheme,
  THEME_COOKIE_NAME,
  type ServerThemeResolutionOptions,
  type ThemeHtmlAttributes,
  type ThemeStyle,
} from "./ThemeProvider";`;

  writeFileIfChanged(
    path.join(outDir, "index.ts"),
    `${indexExports}\n${themeProviderExports}\n`,
  );
}
