#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

function printUsage() {
  console.log(`Usage: node scripts/addComponent.cjs <ComponentName> [options]

Creates a Boreal UI component scaffold with shared props, core/next wrappers,
SCSS, Jest tests, and core/next Storybook stories.

Options:
  --dry-run       Print files that would be created or updated.
  --force         Overwrite generated files if they already exist.
  --skip-exports  Do not update src index files or package.json exports.
  --help          Show this help message.

Examples:
  npm run generate:component -- SearchInput
  node scripts/addComponent.cjs EmptyStateBadge --dry-run
`);
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    force: false,
    skipExports: false,
  };
  const names = [];

  for (const arg of argv) {
    if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--skip-exports") options.skipExports = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else names.push(arg);
  }

  return { name: names[0], options };
}

function toPascalCase(input) {
  return String(input)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toCamelCase(input) {
  const pascal = toPascalCase(input);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toKebabCase(input) {
  return String(input)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function ensureValidComponentName(name) {
  if (!name) {
    throw new Error("Component name is required.");
  }

  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new Error(
      `Component name must resolve to PascalCase. Received "${name}".`,
    );
  }
}

function writeFile(filePath, content, options) {
  const relativePath = path.relative(repoRoot, filePath);
  if (options.dryRun) {
    console.log(`[create] ${relativePath}`);
    return;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  let fileDescriptor;
  try {
    fileDescriptor = fs.openSync(filePath, options.force ? "w" : "wx");
    fs.writeFileSync(fileDescriptor, content, "utf8");
  } catch (error) {
    if (error?.code === "EEXIST") {
      throw new Error(
        `${relativePath} already exists. Re-run with --force to overwrite it.`,
        { cause: error },
      );
    }
    throw error;
  } finally {
    if (fileDescriptor !== undefined) fs.closeSync(fileDescriptor);
  }
}

function updateTextFile(filePath, updater, options) {
  const relativePath = path.relative(repoRoot, filePath);
  const current = fs.readFileSync(filePath, "utf8");
  const next = updater(current);

  if (next === current) return;

  if (options.dryRun) {
    console.log(`[update] ${relativePath}`);
    return;
  }

  fs.writeFileSync(filePath, next, "utf8");
}

function insertSortedExport(current, exportLine) {
  if (current.includes(exportLine)) return current;

  const lines = current.trimEnd().split(/\r?\n/);
  lines.push(exportLine);
  lines.sort((a, b) => a.localeCompare(b));
  return `${lines.join("\n")}\n`;
}

function updatePackageExports(componentName, options) {
  const packagePath = path.join(repoRoot, "package.json");
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  pkg.exports = pkg.exports || {};

  const coreKey = `./core/${componentName}`;
  const nextKey = `./next/${componentName}`;
  const nextExports = {
    ...pkg.exports,
    [coreKey]: {
      types: `./dist/types/core/${componentName}.d.ts`,
      import: `./dist/core/${componentName}.js`,
    },
    [nextKey]: {
      types: `./dist/types/next/${componentName}.d.ts`,
      import: `./dist/next/${componentName}.js`,
    },
  };

  pkg.exports = Object.fromEntries(
    Object.entries(nextExports).sort(([a], [b]) => a.localeCompare(b)),
  );

  const current = fs.readFileSync(packagePath, "utf8");
  const next = `${JSON.stringify(pkg, null, 2)}\n`;
  if (next === current) return;

  if (options.dryRun) {
    console.log("[update] package.json");
    return;
  }

  fs.writeFileSync(packagePath, next, "utf8");
}

function buildTemplates(componentName) {
  const componentVar = toCamelCase(componentName);
  const testId = toKebabCase(componentName);
  const title = componentName.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  const classPrefix = componentVar;

  const classMap = `const classes = {
  container: "${classPrefix}_container",
  label: "${classPrefix}_label",
  labelTop: "${classPrefix}_labelTop",
  labelBottom: "${classPrefix}_labelBottom",
  labelLeft: "${classPrefix}_labelLeft",
  labelRight: "${classPrefix}_labelRight",

  root: "${classPrefix}",
  content: "${classPrefix}_content",
  loader: "${classPrefix}_loader",
  srOnly: "sr_only",

  primary: "${classPrefix}_primary",
  secondary: "${classPrefix}_secondary",
  tertiary: "${classPrefix}_tertiary",
  quaternary: "${classPrefix}_quaternary",

  success: "${classPrefix}_success",
  info: "${classPrefix}_info",
  warning: "${classPrefix}_warning",
  error: "${classPrefix}_error",

  clear: "${classPrefix}_clear",
  outline: "${classPrefix}_outline",
  glass: "${classPrefix}_glass",
  disabled: "${classPrefix}_disabled",
  loading: "${classPrefix}_loading",

  shadowNone: "${classPrefix}_shadow-None",
  shadowLight: "${classPrefix}_shadow-Light",
  shadowMedium: "${classPrefix}_shadow-Medium",
  shadowStrong: "${classPrefix}_shadow-Strong",
  shadowIntense: "${classPrefix}_shadow-Intense",

  roundNone: "${classPrefix}_round-None",
  roundSmall: "${classPrefix}_round-Small",
  roundMedium: "${classPrefix}_round-Medium",
  roundLarge: "${classPrefix}_round-Large",
  roundFull: "${classPrefix}_round-Full",
};`;

  const types = `import {
  HTMLAttributes,
  ReactNode,
  RefAttributes,
  ForwardRefExoticComponent,
} from "react";
import {
  LabelPositionType,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "@/types/types";

type Native${componentName}Props = Omit<HTMLAttributes<HTMLDivElement>, "title">;

/**
 * Props for the ${componentName} component.
 */
export interface ${componentName}Props extends Native${componentName}Props {
  /**
   * Main content rendered inside the component.
   */
  children?: ReactNode;

  /**
   * Optional visible label for the component.
   */
  label?: ReactNode;

  /**
   * Position of the label relative to the component.
   *
   * @default "top"
   */
  labelPosition?: LabelPositionType;

  /**
   * Theme used for styling.
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;

  /**
   * Visual state for styling.
   */
  state?: StateType;

  /**
   * Whether to render outlined styling.
   *
   * @default configured default outline setting (fallback: false)
   */
  outline?: boolean;

  /**
   * Whether to render glass styling.
   *
   * @default configured default glass setting (fallback: false)
   */
  glass?: boolean;

  /**
   * Rounding style for the component.
   *
   * @default configured default rounding (fallback: "medium")
   */
  rounding?: RoundingType;

  /**
   * Shadow style for the component.
   *
   * @default configured default shadow (fallback: "light")
   */
  shadow?: ShadowType;

  /**
   * Whether the component is disabled.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the component should display a loading state.
   *
   * @default false
   */
  loading?: boolean;

  /**
   * Additional class name for the component root.
   */
  className?: string;

  /**
   * Additional class name for the outer label/component container.
   */
  containerClassName?: string;

  /**
   * Additional class name for the visible label.
   */
  labelClassName?: string;

  /**
   * Additional class name for the content area.
   */
  contentClassName?: string;

  /**
   * Optional content rendered for assistive technologies only.
   */
  srOnlyText?: ReactNode;

  /**
   * Additional class name for screen-reader-only content.
   */
  srOnlyClassName?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "${testId}"
   */
  testId?: string;

  /**
   * Backward-compatible alias for test ID attributes.
   */
  "data-testid"?: string;
}

export interface ${componentName}BaseProps extends ${componentName}Props {
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}

export type ${componentName}Component = ForwardRefExoticComponent<
  ${componentName}Props & RefAttributes<HTMLDivElement>
>;
`;

  const base = `import { forwardRef, useId, useMemo, HTMLAttributes } from "react";
import { ${componentName}BaseProps } from "./${componentName}.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const ${componentName}Base = forwardRef<HTMLDivElement, ${componentName}BaseProps>(
  (
    {
      children,
      label,
      labelPosition = "top",
      theme = getDefaultTheme(),
      state,
      outline = getDefaultOutline(),
      glass = getDefaultGlass(),
      rounding = getDefaultRounding(),
      shadow = getDefaultShadow(),
      disabled = false,
      loading = false,
      classMap,
      className,
      containerClassName,
      labelClassName,
      contentClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "${testId}",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const resolvedLabelPosition = resolvePropAlias(labelPosition);

    const {
      id: idProp,
      "aria-describedby": ariaDescribedBy,
      "aria-disabled": ariaDisabled,
      ...restRoot
    } = rest as HTMLAttributes<HTMLDivElement> & {
      "aria-describedby"?: string;
      "aria-disabled"?: boolean;
    };

    const rootId = idProp ?? \`\${testId}-\${generatedId}\`;
    const srDescriptionId = srOnlyText ? \`\${rootId}-sr-description\` : undefined;
    const computedAriaDescribedBy =
      [ariaDescribedBy, srDescriptionId].filter(Boolean).join(" ") ||
      undefined;
    const computedAriaDisabled = ariaDisabled ?? (disabled || undefined);

    const containerClass = useMemo(
      () =>
        combineClassNames(
          classMap.container,
          classMap[\`label\${capitalize(resolvedLabelPosition)}\`],
          containerClassName,
        ),
      [classMap, resolvedLabelPosition, containerClassName],
    );

    const rootClass = useMemo(
      () =>
        combineClassNames(
          classMap.root,
          classMap[theme],
          state && classMap[state],
          outline && classMap.outline,
          glass && classMap.glass,
          disabled && classMap.disabled,
          loading && classMap.loading,
          shadow && classMap[\`shadow\${capitalize(shadow)}\`],
          rounding && classMap[\`round\${capitalize(rounding)}\`],
          className,
        ),
      [
        classMap,
        theme,
        state,
        outline,
        glass,
        disabled,
        loading,
        shadow,
        rounding,
        className,
      ],
    );

    return (
      <div className={containerClass} data-testid={testId}>
        {label ? (
          <div
            className={combineClassNames(classMap.label, labelClassName)}
            data-testid={\`\${testId}-label\`}
          >
            {label}
          </div>
        ) : null}

        <div
          ref={ref}
          id={rootId}
          className={rootClass}
          aria-busy={loading || undefined}
          aria-disabled={computedAriaDisabled}
          aria-describedby={computedAriaDescribedBy}
          data-testid={\`\${testId}-root\`}
          {...restRoot}
        >
          {loading ? (
            <span
              className={classMap.loader}
              aria-hidden="true"
              data-testid={\`\${testId}-loader\`}
            />
          ) : null}

          <div
            className={combineClassNames(classMap.content, contentClassName)}
            data-testid={\`\${testId}-content\`}
          >
            {children}
          </div>

          {srOnlyText ? (
            <span
              id={srDescriptionId}
              className={combineClassNames(
                classMap.srOnly ?? "sr_only",
                srOnlyClassName,
              )}
              data-testid={\`\${testId}-sr-only-text\`}
            >
              {srOnlyText}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);

${componentName}Base.displayName = "${componentName}Base";
export default ${componentName}Base;
`;

  const coreWrapper = `import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./${componentName}.scss";
import ${componentName}Base from "../${componentName}Base";
import { ${componentName}Props } from "../${componentName}.types";

${classMap}

const ${componentName} = forwardRef<HTMLDivElement, ${componentName}Props>(
  (props, ref) => (
    <${componentName}Base
      {...props}
      ref={ref}
      classMap={expandClassMap(classes)}
    />
  ),
);

${componentName}.displayName = "${componentName}";
export default ${componentName};
`;

  const nextWrapper = `"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./${componentName}.module.scss";
import ${componentName}Base from "../${componentName}Base";
import { ${componentName}Props } from "../${componentName}.types";

const ${componentName} = forwardRef<HTMLDivElement, ${componentName}Props>(
  (props, ref) => (
    <${componentName}Base
      {...props}
      ref={ref}
      classMap={expandClassMap(styles)}
    />
  ),
);

${componentName}.displayName = "${componentName}";
export default ${componentName};
`;

  const coreEntry = `export { default } from "../components/${componentName}/core/${componentName}";
export type { ${componentName}Props } from "../components/${componentName}/${componentName}.types";
`;

  const nextEntry = `export { default } from "../components/${componentName}/next/${componentName}";
export type { ${componentName}Props } from "../components/${componentName}/${componentName}.types";
`;

  const coreScss = `@use "../../../styles/theme" as theme;
@use "../../../styles/_breakpoints" as bp;
@use "../../../styles/_mixins" as mixins;
@use "sass:map";

@layer boreal-ui.reset, boreal-ui.base, boreal-ui.components, boreal-ui.overrides;
@layer boreal-ui.components {
  .${classPrefix}_container {
    display: inline-flex;
    gap: var(--spacing-xs);
    align-items: flex-start;
    max-width: 100%;
    font-family: var(--font-family-body);
  }

  .${classPrefix}_label {
    font-family: var(--font-family-ui);
    font-size: var(--font-size-body-sm);
    font-weight: var(--font-weight-ui);
    line-height: var(--line-height-label);
    color: var(--text-color-primary);
  }

  .${classPrefix}_labelTop {
    flex-direction: column;
  }

  .${classPrefix}_labelBottom {
    flex-direction: column-reverse;
  }

  .${classPrefix}_labelLeft {
    flex-direction: row;
    align-items: center;
  }

  .${classPrefix}_labelRight {
    flex-direction: row-reverse;
    align-items: center;
  }

  .${classPrefix} {
    --${classPrefix}-glass-bg: rgba(255, 255, 255, 0.18);
    --${classPrefix}-glass-hover-bg: rgba(255, 255, 255, 0.24);
    --${classPrefix}-glass-border: rgba(255, 255, 255, 0.28);
    --${classPrefix}-glass-text: var(--text-color-primary);

    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    min-width: 0;
    max-width: 100%;
    border: 1px solid transparent;
    border-radius: var(--border-radius-md);
    background: var(--background-color);
    color: var(--text-color-primary);
    box-shadow: var(--box-shadow-sm);
    padding: var(--spacing-sm);
    transition: var(--transition-default);
  }

  .${classPrefix}_content {
    min-width: 0;
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .${classPrefix}_loader {
    display: inline-block;
    flex: 0 0 auto;
    width: 1rem;
    height: 1rem;
    border: 2px solid currentcolor;
    border-right-color: transparent;
    border-radius: 50%;
    opacity: 0.72;
    animation: ${classPrefix}-spin 700ms linear infinite;
  }

  @keyframes ${classPrefix}-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @each $themeName, $vals in theme.$themes {
    .${classPrefix}_#{$themeName} {
      --${classPrefix}-glass-bg: #{map.get($vals, glass-bg)};
      --${classPrefix}-glass-hover-bg: #{map.get($vals, glass-hover)};
      --${classPrefix}-glass-border: #{map.get($vals, glass-border)};
      --${classPrefix}-glass-text: #{map.get($vals, text)};
      background-color: map.get($vals, bg);
      color: map.get($vals, text);
      border-color: map.get($vals, border);

      &:hover {
        background-color: if(
          map.has-key($vals, hover),
          map.get($vals, hover),
          map.get($vals, bg)
        );
      }

      &.${classPrefix}_outline {
        background-color: transparent;
        color: map.get($vals, text);
        box-shadow: none;
        border: 2px solid map.get($vals, border);
      }
    }
  }

  @each $state, $vals in theme.$states {
    .${classPrefix}_#{$state} {
      --${classPrefix}-glass-bg: #{map.get($vals, glass-bg)};
      --${classPrefix}-glass-hover-bg: #{map.get($vals, glass-hover)};
      --${classPrefix}-glass-border: #{map.get($vals, glass-border)};
      --${classPrefix}-glass-text: #{map.get($vals, text)};
      border-width: 2px;
      border-color: map.get($vals, border);
      color: map.get($vals, text);
    }
  }

  .${classPrefix}_clear {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
  }

  .${classPrefix}_glass {
    @include mixins.glass-surface(
      var(--${classPrefix}-glass-bg),
      var(--${classPrefix}-glass-border),
      16px
    );

    color: var(--${classPrefix}-glass-text);
  }

  .${classPrefix}_glass:hover {
    background: var(--${classPrefix}-glass-hover-bg);
  }

  .${classPrefix}_glass.${classPrefix}_outline {
    border-color: var(--${classPrefix}-glass-border);
  }

  .${classPrefix}_disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background-color: var(--disabled-color);
    border-color: var(--disabled-color);

    &:hover {
      background-color: var(--disabled-color);
    }
  }

  .${classPrefix}_loading {
    cursor: progress;
  }

  @each $key, $value in theme.$rounding {
    .${classPrefix}_round-#{$key} {
      border-radius: $value;
    }
  }

  @each $key, $value in theme.$shadow {
    .${classPrefix}_shadow-#{$key} {
      box-shadow: $value;
    }
  }

  @include bp.down(xs) {
    .${classPrefix}_container,
    .${classPrefix} {
      width: 100%;
    }

    .${classPrefix}_labelLeft,
    .${classPrefix}_labelRight {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .${classPrefix},
    .${classPrefix} * {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (forced-colors: active) {
    .${classPrefix} {
      background: Canvas;
      color: CanvasText;
      border: 1px solid ButtonText;
      box-shadow: none;
    }

    .${classPrefix}_glass {
      background: Canvas;
      border-color: ButtonText;
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }
  }
}
`;

  const nextScss = coreScss
    .replaceAll(`.${classPrefix}_container`, ".container")
    .replaceAll(`.${classPrefix}_labelTop`, ".labelTop")
    .replaceAll(`.${classPrefix}_labelBottom`, ".labelBottom")
    .replaceAll(`.${classPrefix}_labelLeft`, ".labelLeft")
    .replaceAll(`.${classPrefix}_labelRight`, ".labelRight")
    .replaceAll(`.${classPrefix}_label`, ".label")
    .replaceAll(`.${classPrefix}_content`, ".content")
    .replaceAll(`.${classPrefix}_loader`, ".loader")
    .replaceAll(`.${classPrefix}_clear`, ".clear")
    .replaceAll(`.${classPrefix}_outline`, ".outline")
    .replaceAll(`.${classPrefix}_glass`, ".glass")
    .replaceAll(`.${classPrefix}_disabled`, ".disabled")
    .replaceAll(`.${classPrefix}_loading`, ".loading")
    .replaceAll(`.${classPrefix}_round-#{$key}`, ".round#{$key}")
    .replaceAll(`.${classPrefix}_shadow-#{$key}`, ".shadow#{$key}")
    .replaceAll(`.${classPrefix}_#{$themeName}`, ".#{$themeName}")
    .replaceAll(`.${classPrefix}_#{$state}`, ".#{$state}")
    .replaceAll(`.${classPrefix}`, ".root");

  const test = `import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import ${componentName}Base from "@/components/${componentName}/${componentName}Base";

expect.extend(toHaveNoViolations);

const classMap = {
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  root: "root",
  content: "content",
  loader: "loader",
  srOnly: "srOnly",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  clear: "clear",
  outline: "outline",
  glass: "glass",
  disabled: "disabled",
  loading: "loading",
  shadowLight: "shadowLight",
  shadowStrong: "shadowStrong",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
};

const render${componentName} = (
  props: Partial<React.ComponentProps<typeof ${componentName}Base>> = {},
) =>
  render(
    <${componentName}Base
      label="${title}"
      classMap={classMap}
      {...props}
    >
      Example content
    </${componentName}Base>,
  );

describe("${componentName}Base", () => {
  it("renders labelled content", () => {
    render${componentName}();

    expect(screen.getByTestId("${testId}-label")).toHaveTextContent(
      "${title}",
    );
    expect(screen.getByTestId("${testId}-content")).toHaveTextContent(
      "Example content",
    );
  });

  it("connects screen-reader-only text with aria-describedby", () => {
    render${componentName}({
      id: "${testId}-custom",
      srOnlyText: "Additional context",
    });

    expect(screen.getByTestId("${testId}-sr-only-text")).toHaveTextContent(
      "Additional context",
    );
    expect(screen.getByTestId("${testId}-root")).toHaveAttribute(
      "aria-describedby",
      "${testId}-custom-sr-description",
    );
  });

  it("applies theme, state, outline, glass, rounding, and shadow classes", () => {
    render${componentName}({
      theme: "secondary",
      state: "success",
      outline: true,
      glass: true,
      rounding: "large",
      shadow: "strong",
    });

    const root = screen.getByTestId("${testId}-root");
    expect(root).toHaveClass("root");
    expect(root).toHaveClass("secondary");
    expect(root).toHaveClass("success");
    expect(root).toHaveClass("outline");
    expect(root).toHaveClass("glass");
    expect(root).toHaveClass("roundLarge");
    expect(root).toHaveClass("shadowStrong");
  });

  it("applies label position and custom class names", () => {
    render${componentName}({
      labelPosition: "left",
      containerClassName: "customContainer",
      labelClassName: "customLabel",
      contentClassName: "customContent",
    });

    expect(screen.getByTestId("${testId}")).toHaveClass("labelLeft");
    expect(screen.getByTestId("${testId}")).toHaveClass("customContainer");
    expect(screen.getByTestId("${testId}-label")).toHaveClass("customLabel");
    expect(screen.getByTestId("${testId}-content")).toHaveClass(
      "customContent",
    );
  });

  it("applies disabled and loading states", () => {
    render${componentName}({ disabled: true, loading: true });

    const root = screen.getByTestId("${testId}-root");
    expect(root).toHaveClass("disabled");
    expect(root).toHaveClass("loading");
    expect(root).toHaveAttribute("aria-busy", "true");
    expect(root).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByTestId("${testId}-loader")).toBeInTheDocument();
  });

  it("forwards refs to the root", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <${componentName}Base label="${title}" classMap={classMap} ref={ref}>
        Example content
      </${componentName}Base>,
    );

    expect(ref.current).toBe(screen.getByTestId("${testId}-root"));
  });

  it("has no accessibility violations", async () => {
    const { container } = render${componentName}({
      srOnlyText: "Additional context",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
`;

  const storyCore = `import type { Meta, StoryObj } from "@storybook/react-vite";
import { ${componentName} } from "../src/index.core";
import type { ${componentName}Props } from "../src/components/${componentName}/${componentName}.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";

const meta: Meta<${componentName}Props> = {
  title: "Components/${componentName}",
  component: ${componentName},
  tags: ["autodocs"],
  args: {
    label: "${title}",
    children: "Example content",
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<${componentName}Props>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <${componentName} key={theme} label={theme} theme={theme}>
        Example content
      </${componentName}>
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <${componentName} key={theme} label={theme} theme={theme} glass>
        Example content
      </${componentName}>
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <${componentName} key={state} label={state} state={state}>
        Example content
      </${componentName}>
    ))}
  </StoryGrid>
);

export const OutlineVariants = () => (
  <StoryGrid title="Outline Variants">
    {themeOptions.map((theme) => (
      <${componentName} key={theme} label={\`\${theme} outline\`} theme={theme} outline>
        Example content
      </${componentName}>
    ))}
  </StoryGrid>
);

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <${componentName} key={rounding} label={rounding} rounding={rounding}>
        Example content
      </${componentName}>
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <${componentName} key={shadow} label={shadow} shadow={shadow}>
        Example content
      </${componentName}>
    ))}
  </StoryGrid>
);

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
`;

  const storyNext = storyCore
    .replace("@storybook/react-vite", "@storybook/nextjs-vite")
    .replace(`from "../src/index.core"`, `from "../../src/index.next"`)
    .replace(
      `from "../src/components/${componentName}/${componentName}.types"`,
      `from "../../src/components/${componentName}/${componentName}.types"`,
    )
    .replace(
      `from "../.storybook-core/helpers/StoryGrid"`,
      `from "../../.storybook-core/helpers/StoryGrid"`,
    )
    .replace(
      `from "../shared-story-assets/OptionTypes"`,
      `from "../../shared-story-assets/OptionTypes"`,
    );

  return {
    types,
    base,
    coreWrapper,
    nextWrapper,
    coreEntry,
    nextEntry,
    coreScss,
    nextScss,
    test,
    storyCore,
    storyNext,
  };
}

function main() {
  const { name, options } = parseArgs(process.argv.slice(2));

  if (options.help) {
    printUsage();
    return;
  }

  const componentName = toPascalCase(name || "");
  ensureValidComponentName(componentName);

  const templates = buildTemplates(componentName);
  const componentDir = path.join(repoRoot, "src", "components", componentName);
  const files = new Map([
    [path.join(componentDir, `${componentName}.types.ts`), templates.types],
    [path.join(componentDir, `${componentName}Base.tsx`), templates.base],
    [
      path.join(componentDir, "core", `${componentName}.tsx`),
      templates.coreWrapper,
    ],
    [
      path.join(componentDir, "core", `${componentName}.scss`),
      templates.coreScss,
    ],
    [
      path.join(componentDir, "next", `${componentName}.tsx`),
      templates.nextWrapper,
    ],
    [
      path.join(componentDir, "next", `${componentName}.module.scss`),
      templates.nextScss,
    ],
    [
      path.join(repoRoot, "src", "core", `${componentName}.ts`),
      templates.coreEntry,
    ],
    [
      path.join(repoRoot, "src", "next", `${componentName}.ts`),
      templates.nextEntry,
    ],
    [
      path.join(
        repoRoot,
        "__tests__",
        "base-component-test",
        `${componentName}.test.tsx`,
      ),
      templates.test,
    ],
    [
      path.join(repoRoot, "stories-core", `${componentName}.stories.tsx`),
      templates.storyCore,
    ],
    [
      path.join(
        repoRoot,
        "stories-next",
        "components",
        `${componentName}.stories.tsx`,
      ),
      templates.storyNext,
    ],
  ]);

  for (const [filePath, content] of files) {
    writeFile(filePath, content, options);
  }

  if (!options.skipExports) {
    updateTextFile(
      path.join(repoRoot, "src", "index.core.ts"),
      (current) =>
        insertSortedExport(
          current,
          `export { default as ${componentName} } from "./core/${componentName}";`,
        ),
      options,
    );
    updateTextFile(
      path.join(repoRoot, "src", "index.next.ts"),
      (current) =>
        insertSortedExport(
          current,
          `export { default as ${componentName} } from "./next/${componentName}";`,
        ),
      options,
    );
    updatePackageExports(componentName, options);
  }

  console.log(
    options.dryRun
      ? `Dry run complete for ${componentName}.`
      : `Created ${componentName} scaffold.`,
  );
  console.log(
    "Run npm run generate:docs after adding component-specific props.",
  );
}

try {
  main();
} catch (error) {
  console.error(error.message);
  console.error("");
  printUsage();
  process.exitCode = 1;
}
