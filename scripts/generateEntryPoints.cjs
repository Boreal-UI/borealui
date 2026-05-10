const fs = require("fs");
const path = require("path");

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
    `
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
console.log("Generated entrypoint files!");
