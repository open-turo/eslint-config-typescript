module.exports = {
  root: true,
  env: {
    es2022: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["jest.config.js"],
  plugins: [
    "@typescript-eslint",
    "eslint-plugin-jest",
    "import",
    "jest",
    "json",
    "node",
    "prettier",
    "simple-import-sort",
    "sonarjs",
    "sort-destructure-keys",
    "typescript-sort-keys",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jest/recommended",
    "plugin:json/recommended-legacy",
    "plugin:node/recommended",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended-legacy",
    "plugin:typescript-sort-keys/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2022,
    project: "./tsconfig.json",
  },
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
  rules: {
    "import/default": "off",
    "import/named": "off",
    "import/namespace": "off",
    "import/no-default-export": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["test/**/*.tsx", "test/**/*.ts"],
      },
    ],
    "import/export": "off",
    "import/prefer-default-export": "off",
    "jest/no-jest-import": "off",
    "json/*": "error",
    "node/no-unpublished-import": [
      "error",
      {
        allowModules: ["@jest/globals", "nock"],
      },
    ],
    "node/no-unsupported-features/es-syntax": "off",
    "node/no-missing-import": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sort-destructure-keys/sort-destructure-keys": "error",
    // Noisy rule - we may have helpers/methods that we mark as @deprecated but aren't planning to remove in the near future. This rule also significantly adds to eslint running time, which slows down both local development and CI.
    "sonarjs/deprecation": "off",
    // This rule is not helpful in TypeScript files, and in JavaScript we often return different types from functions, so this is not a strictness level we want to enforce.
    "sonarjs/function-return-type": "off",
    // We may want to catch errors but not use the error object directly, just trigger error handling fallbacks within the catch block.
    "sonarjs/no-ignored-exceptions": "off",
    "sonarjs/no-nested-functions": ["warn", { threshold: 5 }],
    // Overlaps with @typescript-eslint/prefer-nullish-coalescing
    "sonarjs/prefer-nullish-coalescing": "off",
    // Overlaps with @typescript-eslint/no-unused-vars
    "sonarjs/sonar-no-unused-vars": "off",
    // Overlaps with @typescript-eslint/prefer-optional-chain
    "sonarjs/sonar-prefer-optional-chain": "off",
    // Useful for guarding against prop mutation in React, but too much of a lift as very rarely do we apply readonly/ReadonlyArray<T> to type definitions
    "sonarjs/sonar-prefer-read-only-props": "off",
    // Noisy rule: if we wanted stricter linting of TODOs, we could use unicorn/expiring-todo-comments
    "sonarjs/todo-tag": "off",
    // A useful rule to consider for libraries to better document (and export) type definitions, but noisy in app usages (especially around redux type definitions)
    "sonarjs/use-type-alias": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        // Allow to name unused vars with _
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowBoolean: true,
      },
    ],
    "@typescript-eslint/unbound-method": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/prefer-ts-expect-error": "error",
    // Any-related TS rules are turned to warn to allow building "non-TS-native" packages w/ many occurrences of them
    "@typescript-eslint/no-unsafe-argument": ["warn"],
    "@typescript-eslint/no-unsafe-return": ["warn"],
    "@typescript-eslint/no-unsafe-call": ["warn"],
    "@typescript-eslint/no-unsafe-member-access": ["warn"],
    "@typescript-eslint/no-unsafe-assignment": ["warn"],
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
