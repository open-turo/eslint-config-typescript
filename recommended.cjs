// @ts-check

/**
 * Our flat config contains some ESLint recommended config breaking changes.
 * Additionally, there appear to be some differences between Unicorn's recommended flat config and the non-flat recommended config.
 * This object changes those values so that we backport them to the legacy config, to ensure that linting
 * stays consistent regardless of whether a user is consuming ESLint v8 or v9.
 */
const ESLINT_V9_DEFAULTS = {
  "constructor-super": "off",
  "getter-return": "off",
  "no-class-assign": "off",
  "no-const-assign": "off",
  "no-dupe-args": "off",
  "no-dupe-keys": "off",
  "no-func-assign": "off",
  "no-import-assign": "off",
  "no-new-native-nonconstructor": "off",
  "no-obj-calls": "off",
  "no-setter-return": "off",
  "no-this-before-super": "off",
  "no-undef": "off",
  "no-unreachable": "off",
  "no-unsafe-negation": "off",
  "no-with": "off",
};

/**
 * Unicorn rules disabled in flat config (index.cjs); we mirror here so legacy matches flat.
 * These conflict with Prettier or are too stylistic for a TypeScript-focused config.
 */
const UNICORN_RULES_OFF = {
  "unicorn/empty-brace-spaces": 0,
  "unicorn/no-nested-ternary": 0,
  "unicorn/number-literal-case": 0,
  "unicorn/template-indent": 0,
};

/**
 * Core ESLint rules disabled for TS files - @typescript-eslint provides TypeScript-aware equivalents,
 * but there are some rules enabled in ESLint v9 that are not yet disabled by @typescript-eslint.
 * @see https://typescript-eslint.io/rules?=extension#rules
 */
const TYPESCRIPT_ESLINT_EXTENSION_RULES = /** @type {const} */ ({
  "@typescript-eslint/no-dupe-class-members": "error",
  "@typescript-eslint/no-redeclare": "error",
  "@typescript-eslint/no-unused-private-class-members": "error",
  "@typescript-eslint/no-unused-vars": "error",
  "no-dupe-class-members": "off",
  "no-redeclare": "off",
  "no-unused-private-class-members": "off",
  "no-unused-vars": "off",
});

module.exports = {
  env: {
    es2022: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jest/recommended",
    "plugin:json/recommended-legacy",
    "plugin:n/recommended",
    "plugin:perfectionist/recommended-alphabetical-legacy",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended-legacy",
    "plugin:unicorn/recommended",
  ],
  overrides: [
    {
      files: ["test/**"],
      plugins: ["jest"],
      rules: {
        // this turns the original rule off *only* for test files, for jest compatibility
        "@typescript-eslint/unbound-method": "off",
        "jest/unbound-method": "error",
      },
    },
    {
      files: ["**/*.json"],
      rules: {
        "json/*": "error",
      },
    },
    {
      files: ["**/*.ts", "**/*.tsx"],
      rules: TYPESCRIPT_ESLINT_EXTENSION_RULES,
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    project: "./tsconfig.json",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "eslint-plugin-jest",
    "import",
    "jest",
    "json",
    "n",
    "perfectionist",
    "prettier",
    "sonarjs",
    "unicorn",
  ],
  root: true,
  rules: {
    ...ESLINT_V9_DEFAULTS,
    ...UNICORN_RULES_OFF,
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
    "import/default": "off",
    "import/named": "off",
    "import/namespace": "off",
    "import/no-default-export": "error",
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["test/**"] },
    ],
    "import/prefer-default-export": "off",
    "jest/no-jest-import": "off",
    "n/no-missing-import": "off",
    "n/no-unpublished-import": [
      "error",
      {
        allowModules: ["@jest/globals", "nock"],
      },
    ],
    "n/no-unsupported-features/es-syntax": "off",
    // Sort classes by natural order to match @typescript-eslint/member-ordering rule - https://perfectionist.dev/rules/sort-classes#groups
    "perfectionist/sort-classes": [
      "error",
      {
        groups: [
          "index-signature",
          ["static-property", "static-accessor-property"],
          ["static-get-method", "static-set-method"],
          ["protected-static-property", "protected-static-accessor-property"],
          ["protected-static-get-method", "protected-static-set-method"],
          ["private-static-property", "private-static-accessor-property"],
          ["private-static-get-method", "private-static-set-method"],
          "static-block",
          ["property", "accessor-property"],
          ["protected-property", "protected-accessor-property"],
          ["private-property", "private-accessor-property"],
          "constructor",
          ["get-method", "set-method"],
          ["protected-get-method", "protected-set-method"],
          ["private-get-method", "private-set-method"],
          ["static-method", "static-function-property"],
          ["protected-static-method", "protected-static-function-property"],
          ["private-static-method", "private-static-function-property"],
          ["method", "function-property"],
          ["protected-method", "protected-function-property"],
          ["private-method", "private-function-property"],
          "unknown",
        ],
      },
    ],
    // Sort switch case by natural order - https://perfectionist.dev/rules/sort-switch-case.html#options
    "perfectionist/sort-switch-case": ["error", { type: "natural" }],
    // Sort union types by natural order - https://perfectionist.dev/rules/sort-union-types.html#options
    "perfectionist/sort-union-types": ["error", { type: "natural" }],
    // Noisy rule - we may have helpers/methods that we mark as @deprecated but aren't planning to remove in the near future. This rule also significantly adds to eslint running time, which slows down both local development and CI.
    "sonarjs/deprecation": "off",
    // This rule is not helpful in TypeScript files, and in JavaScript we often return different types from functions, so this is not a strictness level we want to enforce.
    "sonarjs/function-return-type": "off",
    // Performance issues with this rule, and TypeScript already catches the primary case (async constructors are a compile error)
    "sonarjs/no-async-constructor": "off",
    // Performance issues, inconsistent behavior, and primarily catches edge cases rather than common issues
    "sonarjs/no-dead-store": "off",
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
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
