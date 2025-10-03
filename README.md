# `@open-turo/eslint-config-typescript`

Turo eslint configuration for typescript.

[![Release](https://img.shields.io/github/v/release/open-turo/eslint-config-typescript)](https://github.com/open-turo/eslint-config-typescript/releases/)
[![Tests pass/fail](https://img.shields.io/github/actions/workflow/status/open-turo/eslint-config-typescript/ci.yaml)](https://github.com/open-turo/eslint-config-typescript/actions/)
[![License](https://img.shields.io/github/license/open-turo/eslint-config-typescript)](./LICENSE)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/dwyl/esta/issues)
![CI](https://github.com/open-turo/eslint-config-typescript/actions/workflows/release.yaml/badge.svg)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Conventional commits](https://img.shields.io/badge/conventional%20commits-1.0.2-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![Join us!](https://img.shields.io/badge/Turo-Join%20us%21-593CFB.svg)](https://turo.com/jobs)

## Usage

Install the package and all of its peer dependencies:

```shell
npx install-peerdeps --dev @open-turo/eslint-config-typescript
```

### [`eslint.config.js`](https://eslint.org/docs/latest/use/configure/configuration-files-new) (requires eslint>=v8.23.0)

```js
const turoConfig = require("@open-turo/eslint-config-typescript");

module.exports = turoConfig();
```

The `turoConfig` function accepts an options object with the following properties:

- `allowModules` - List of modules to allow in the `n/no-unpublished-import` rule. Defaults to `["@jest/globals", "nock"]` for Jest or `["nock"]` for Vitest
- `ignores` - List of patterns to ignore
- `typescript` - Whether to include typescript rules. Defaults to `true`
- `ecmaVersion` - The ECMAScript version to use. Defaults to `latest`
- `testFramework` - Test framework to use: `"jest"` (default) or `"vitest"`

#### Vitest Configuration Example

```js
const turoConfig = require("@open-turo/eslint-config-typescript");

module.exports = turoConfig({
  testFramework: "vitest",
});
```

### **[.eslintrc](https://eslint.org/docs/latest/use/configure/configuration-files)** (legacy example)

```jsonc
{
  "extends": "@open-turo/eslint-config-typescript/recommended"],
}
```

You will have to set the `ESLINT_USE_FLAT_CONFIG` env var to true.

## Development

Install [pre-commit](https://pre-commit.com/) and the commit hooks:

```shell
pre-commit install
pre-commit install --hook-type commit-msg
```

## Get Help

Please review Issues, post new Issues against this repository as needed.

## Contributions

Please see [here](https://github.com/open-turo/contributions) for guidelines on how to contribute to this project.
