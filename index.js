module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "import",
    "jest",
    "prettier",
    "simple-import-sort",
    "sonarjs",
    "sort-destructure-keys",
    "typescript-sort-keys",
    "unicorn",
    "node",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jest/recommended",
    "plugin:unicorn/recommended",
    "plugin:node/recommended",
    "plugin:typescript-sort-keys/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "import/default": "off",
    "import/named": "off",
    "import/namespace": "off",
    "import/no-default-export": "error",
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["src/**/__tests__/**"] },
    ],
    "import/prefer-default-export": "off",
    "jest/no-jest-import": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sort-destructure-keys/sort-destructure-keys": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        // Allow to name unused vars with _
        argsIgnorePattern: "^_",
      },
    ],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
