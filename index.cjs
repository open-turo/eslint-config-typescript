// @ts-check

/** @import { ConfigWithExtends } from "typescript-eslint" */
const eslint = require("@eslint/js");
const tsParser = require("@typescript-eslint/parser");
const vitestPlugin = require("@vitest/eslint-plugin");
const importPlugin = require("eslint-plugin-import");
const jestPlugin = require("eslint-plugin-jest");
const jsonPlugin = require("eslint-plugin-json");
const nPlugin = require("eslint-plugin-n");
const perfectionistPlugin = require("eslint-plugin-perfectionist");
const prettierPluginRecommended = require("eslint-plugin-prettier/recommended");
const sonarjsPlugin = require("eslint-plugin-sonarjs");
const unicornPlugin = require("eslint-plugin-unicorn");
const eslintConfig = require("eslint/config");
const tseslint = require("typescript-eslint");

const FILES_JS = "**/*.?([cm])js";
const FILES_SRC_EXTENSION = "?([cm])[jt]s?(x)";
const FILES_TS = "**/*.?([cm])ts";
const FILES_TSX = "**/*.?([cm])tsx";
const FILES_TEST = [
  `**/__tests__/**/*.${FILES_SRC_EXTENSION}`,
  `**/*.spec.${FILES_SRC_EXTENSION}`,
  `**/*.test.${FILES_SRC_EXTENSION}`,
];

const typescriptLanguageOptions = () => ({
  parser: tsParser,
  parserOptions: {
    projectService: true,
    tsconfigRootDir: process.cwd(),
  },
});

/**
 * @typedef {NonNullable<NonNullable<ConfigWithExtends['languageOptions']>['parserOptions']>['ecmaVersion']} EcmaVersion
 */

/**
 * @param {EcmaVersion} [ecmaVersion]
 */
const javascriptConfig = (ecmaVersion = "latest") =>
  eslintConfig.defineConfig(eslint.configs.recommended, {
    files: [FILES_JS],
    languageOptions: {
      parserOptions: {
        ecmaVersion,
      },
    },
  });

const getImportPluginFlatConfigs = () => {
  if (!importPlugin.flatConfigs) {
    throw new Error(
      "Unexpected value from eslint-plugin-import. You will need to upgrade the plugin.",
    );
  }

  return importPlugin.flatConfigs;
};

const importConfig = () =>
  eslintConfig.defineConfig({
    extends: [getImportPluginFlatConfigs().recommended],
    rules: {
      "import/default": "off",
      "import/named": "off",
      "import/namespace": "off",
      "import/no-default-export": "error",
      "import/no-extraneous-dependencies": [
        "error",
        { devDependencies: [`eslint.config.${FILES_SRC_EXTENSION}`] },
      ],
      "import/prefer-default-export": "off",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  });

const nPluginConfig = (allowModules = ["@jest/globals", "nock"]) =>
  eslintConfig.defineConfig({
    extends: [
      nPlugin.configs["flat/recommended"],
      nPlugin.configs["flat/mixed-esm-and-cjs"],
    ],
    rules: {
      "n/no-missing-import": "off",
      "n/no-unpublished-import": [
        "error",
        {
          allowModules,
        },
      ],
      "n/no-unsupported-features/es-syntax": "off",
    },
  });

const sonarJsConfig = () =>
  eslintConfig.defineConfig({
    extends: [sonarjsPlugin.configs.recommended],
    rules: {
      // Noisy rule - we may have helpers/methods that we mark as @deprecated but aren't planning to remove in the near future. This rule also significantly adds to eslint running time, which slows down both local development and CI.
      "sonarjs/deprecation": "off",
      // This rule is not helpful in TypeScript files, and in JavaScript we often return different types from functions, so this is not a strictness level we want to enforce.
      "sonarjs/function-return-type": "off",
      // We may want to catch errors but not use the error object directly, just trigger error handling fallbacks within the catch block.
      "sonarjs/no-ignored-exceptions": "off",
      "sonarjs/no-nested-functions": ["warn", { threshold: 5 }],
      "sonarjs/no-small-switch": "off",
      // Overlaps with @typescript-eslint/no-unused-vars
      "sonarjs/no-unused-vars": "off",
      // Overlaps with @typescript-eslint/prefer-nullish-coalescing
      "sonarjs/prefer-nullish-coalescing": "off",
      // Overlaps with @typescript-eslint/prefer-optional-chain
      "sonarjs/prefer-optional-chain": "off",
      // Useful for guarding against prop mutation in React, but too much of a lift as very rarely do we apply readonly/ReadonlyArray<T> to type definitions
      "sonarjs/prefer-read-only-props": "off",
      // Noisy rule: if we wanted stricter linting of TODOs, we could use unicorn/expiring-todo-comments
      "sonarjs/todo-tag": "off",
      // A useful rule to consider for libraries to better document (and export) type definitions, but noisy in app usages (especially around redux type definitions)
      "sonarjs/use-type-alias": "off",
    },
  });

const typescriptConfig = () =>
  eslintConfig.defineConfig({
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // @ts-expect-error -- We are inferring the types of this import from runtime, but the rule values are inferred as `string` instead of `RuleEntry` ("off" | "warn" | "error")
      getImportPluginFlatConfigs().typescript,
    ],
    files: [FILES_TS, FILES_TSX],
    languageOptions: typescriptLanguageOptions(),
    rules: {
      /** Forbids `as` casting (that excludes `as const`) to prevent unsafe type casts */
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      /**
       * {@link https://typescript-eslint.io/rules/consistent-type-imports | TypeScript ESLint: consistent-type-imports docs}
       */
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: true,
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      /** We do not need to force people to wrap `void`-return implicit arrow returns with braces just for a lint rule. TypeScript alone covers functionality, by the return type being `void`. */
      "@typescript-eslint/no-confusing-void-expression": "off",
      /** Included as part of `strict-type-checked`, but nothing we want to enforce. */
      "@typescript-eslint/no-deprecated": "off",
      /** Prefers `import type {}` syntax over `import { type }` if all imports are type-only */
      "@typescript-eslint/no-import-type-side-effects": "error",
      /** A relatively stylistic rule, downgraded to "off" to limit breaking changes in the update that includes `strict-type-checked`. */
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",
      /** This rule can help us identify syntax that is more defensive than the types suggest. Unfortunately, it may be protecting us from runtime errors where the type definitions are incorrect. As such, it is turned "off", as even "warn" auto-fixes source code. */
      "@typescript-eslint/no-unnecessary-condition": "off",
      /** There is readability benefit to passing in type arguments that match defaults. If defaults change, we may prefer the manual inspection of all the types changed, too. */
      "@typescript-eslint/no-unnecessary-type-arguments": "off",
      /** Errors on generic type parameters that are only used once, even though that helps with return type inference. */
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          // Allow to name unused vars with _
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/prefer-ts-expect-error": "error",
      "@typescript-eslint/unbound-method": "error",
    },
  });

/**
 *
 * @param {object} options Configuration options
 * @param {boolean} options.typescript Whether to include typescript rules
 */
const jestTestConfig = (options) => {
  const typescriptRules = options.typescript
    ? /** @type {const} */ ({
        "@typescript-eslint/unbound-method": "off",
        "jest/unbound-method": "error",
      })
    : {};
  return eslintConfig.defineConfig({
    extends: [jestPlugin.configs["flat/recommended"]],
    files: FILES_TEST,
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
      ...(options.typescript ? typescriptLanguageOptions() : {}),
    },
    plugins: { jest: jestPlugin },
    rules: {
      ...jestPlugin.configs["flat/recommended"].rules,
      ...typescriptRules,
      "jest/no-jest-import": "off",
    },
  });
};

/**
 * Creates Vitest-specific test configuration
 * @param {object} options Configuration options
 * @param {boolean} options.typescript Whether to include typescript rules
 */
const vitestTestConfig = (options) => {
  return eslintConfig.defineConfig({
    extends: [vitestPlugin.configs.recommended],
    files: FILES_TEST,
    languageOptions: {
      globals: vitestPlugin.environments.env.globals,
      ...(options.typescript ? typescriptLanguageOptions() : {}),
    },
    plugins: { vitest: vitestPlugin },
  });
};

/**
 *
 * @param {object} options Configuration options
 * @param {boolean} options.typescript Whether to include typescript rules
 * @param {"jest" | "vitest"} options.testFramework Test framework to use
 */
const testConfig = (options) => {
  const frameworkConfig =
    options.testFramework === "vitest"
      ? vitestTestConfig(options)
      : jestTestConfig(options);

  return eslintConfig.defineConfig(...frameworkConfig, {
    files: FILES_TEST,
    rules: {
      "import/no-extraneous-dependencies": [
        "error",
        { devDependencies: FILES_TEST },
      ],
    },
  });
};

/**
 * @param {string[]} ignores
 */
const ignoresConfig = (ignores = []) =>
  eslintConfig.defineConfig({
    ignores: ["**/.yalc", "**/dist", ...ignores],
  });

/**
 * Turo eslint configuration for typescript
 * @param {object} [options] - Eslint config options
 * @param {string[]} [options.allowModules] - List of modules to allow in the n/no-unpublished-import rule
 * @param {string[]} [options.ignores] - List of patterns to ignore
 * @param {boolean} [options.typescript] - Whether to include typescript rules
 * @param {EcmaVersion} [options.ecmaVersion] - The ECMAScript version to use
 * @param {"jest" | "vitest"} [options.testFramework] - Test framework to use (defaults to "jest")
 */
module.exports = function config(options = {}) {
  const useTypescript =
    options.typescript === undefined ? true : options.typescript;
  const testFramework = options.testFramework || "jest";

  if (testFramework !== "jest" && testFramework !== "vitest") {
    throw new Error(
      `Invalid testFramework option: "${testFramework}". Valid values are "jest" or "vitest".`,
    );
  }

  const defaultAllowModules =
    testFramework === "vitest" ? ["nock"] : ["@jest/globals", "nock"];
  const allowModules = options.allowModules || defaultAllowModules;

  return eslintConfig.defineConfig(
    javascriptConfig(options.ecmaVersion),
    importConfig(),
    nPluginConfig(allowModules),
    perfectionistPlugin.configs["recommended-alphabetical"],
    sonarJsConfig(),
    unicornPlugin.configs["flat/recommended"],
    prettierPluginRecommended,
    jsonPlugin.configs["recommended"],
    useTypescript ? typescriptConfig() : {},
    testConfig({ testFramework, typescript: useTypescript }),
    ignoresConfig(options.ignores),
  );
};
