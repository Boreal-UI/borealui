import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import storybook from "eslint-plugin-storybook";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "dist/**",
      "coverage/**",
      "node_modules/**",
      ".storybook-static/**",
      "storybook-static/**",
      "storybook-core-json/**",
      "storybook-next-json/**",
      ".tmp-boreal-cli-*/**",
      "*.d.ts",
      "dist/types/**",
    ],
  },

  js.configs.recommended,

  {
    files: [
      "src/**/*.{ts,tsx}",
      "__tests__/**/*.{ts,tsx}",
      "stories-core/**/*.{ts,tsx}",
      "stories-next/**/*.{ts,tsx}",
      ".storybook/**/*.{ts,tsx}",
      ".storybook-core/**/*.{ts,tsx}",
      ".storybook-next/**/*.{ts,tsx}",
      "cypress/**/*.{ts,tsx}",
      "shared-story-assets/**/*.{ts,tsx}",
    ],

    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      jsxA11y.flatConfigs.strict,
    ],

    languageOptions: {
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
        ...globals.jest,
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react-refresh/only-export-components": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "prefer-const": "error",
    },
  },

  ...storybook.configs["flat/recommended"],

  {
    files: [
      "*.config.{js,cjs,mjs,ts}",
      "vite.config*.ts",
      "eslint.config.js",
      "eslint.config.mjs",
      "scripts/**/*.{js,cjs,mjs}",
      "packages/cli/src/**/*.js",
    ],

    extends: [tseslint.configs.disableTypeChecked],

    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      parserOptions: {
        project: false,
      },
    },

    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
      "no-console": "off",
    },
  },

  {
    files: [
      "**/*.test.{ts,tsx}",
      "__tests__/**/*.{ts,tsx}",
      "cypress/**/*.{ts,tsx}",
      "stories-core/**/*.{ts,tsx}",
      "stories-next/**/*.{ts,tsx}",
      "**/*.stories.{ts,tsx}",
    ],

    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "jsx-a11y/anchor-has-content": "off",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/tabindex-no-positive": "off",
      "no-console": "off",
      "no-alert": "off",
      "react-refresh/only-export-components": "off",
    },
  },

  {
    files: ["cypress/**/*.{ts,tsx}"],

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/unbound-method": "off",
    },
  },
);
