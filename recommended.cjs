module.exports = {
  env: {
    es2022: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
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
    "json/*": "error",
    "n/no-missing-import": "off",
    "n/no-unpublished-import": [
      "error",
      {
        allowModules: ["@jest/globals", "nock"],
      },
    ],
    "n/no-unsupported-features/es-syntax": "off",
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
