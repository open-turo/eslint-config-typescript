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
import turoConfig from "@open-turo/eslint-config-typescript";

export default turoConfig();
```

The `turoConfig` function accepts an options object with the following properties:

- `allowModules` - List of modules to allow in the `n/no-unpublished-import` rule. Defaults to `["@jest/globals", "nock"]` for Jest or `["nock"]` for Vitest
- `ignores` - List of patterns to ignore
- `typescript` - Whether to include typescript rules. Defaults to `true`
- `ecmaVersion` - The ECMAScript version to use. Defaults to `latest`
- `testFramework` - Test framework to use: `"jest"` (default) or `"vitest"`

#### Vitest Configuration Example

```js
import turoConfig from "@open-turo/eslint-config-typescript";

export default turoConfig({
  testFramework: "vitest",
});
```

### `open-turo/todo-format`

Requires TODO comments to reference a ticket and an owner:

```js
// TODO(ABC-123, owner-name): description
// TODO(owner/repo#123, owner-name): description
```

The rule is off by default. By default, the ticket is a Jira-like key (`ABC-123`) or a GitHub issue (`owner/repo#123`), and the owner is any word without spaces, commas or parentheses. To turn it on, with the formats used in your repo:

```js
import turoConfig from "@open-turo/eslint-config-typescript";

export default [
  ...turoConfig(),
  {
    rules: {
      "open-turo/todo-format": [
        "error",
        {
          // Regular expression the whole ticket must match.
          ticketPattern: "[A-Z][A-Z0-9]+-\\d+",
          // Regular expression the whole owner must match.
          ownerPattern: "^team:[a-z-]+$",
          // TODO tags to skip.
          ignore: ["TODO-FOO"],
        },
      ],
    },
  },
];
```

Only TODOs used as a tag are checked: at the start of a comment line, or after `--` (as in `// @ts-expect-error -- TODO(ABC-123, owner-name): description`). The word `TODO` elsewhere in a comment is not checked. The errors are reported on the first line of the comment, so an `eslint-disable-next-line` above a multi-line comment covers the TODOs inside it.

To turn the rule on without fixing the existing TODOs first, add an `eslint-disable-next-line` above each of them, with a reason that is itself a valid TODO:

```js
// eslint-disable-next-line open-turo/todo-format -- TODO(ABC-123, owner-name): reformat to the expected format
// TODO: existing TODO, unchanged
```

The disables are then easy to find and fix later. With `reportUnusedDisableDirectives`, a disable left behind after a fix fails lint.

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
