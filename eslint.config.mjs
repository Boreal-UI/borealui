import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
      ".storybook-static/**",
      "storybook-static/**",
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
    ],

    extends: [...tseslint.configs.recommendedTypeChecked],

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

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    rules: {
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
    },
  },

  {
    files: [
      "*.config.{js,cjs,mjs,ts}",
      "vite.config*.ts",
      "webpack.config.cjs",
      "eslint.config.js",
      "scripts/**/*.{js,cjs,mjs}",
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
    },
  },
);
