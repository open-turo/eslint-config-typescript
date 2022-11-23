# `@open-turo/eslint-config-typescript`

Turo eslint configuration for typescript.

## Usage

Install the package and all of its peer dependencies:

```shell
npx install-peerdeps --dev @open-turo/eslint-config-typescript
```

Then in your `.eslintrc` file extend from one of the two configurations included in this package:

1. The default, recommended for new Typescript projects
2. The "legacy", which is used by `eslint-config-react`, to support our existing front-end projects

### Default config (for new projects)

The default config of this repo is the recommended version for new Typescript projects.

To use this config, just add to your `.eslintrc` the following:

```
"extends": "@open-turo/eslint-config-typescript"
```

### Legacy config (for some internal front-end projects)

We also provide an alternative `legacy` preset, which is used by `eslint-config-react`, for compatibility with our
existing front-end projects.

If you want to use this `legacy` configuration, you can import it by instead adding the following to your `.eslintrc`:

```
"extends": "@open-turo/eslint-config-typescript/legacy"
```

Simply notice the `/legacy` suffix, which points to the `legacy.js` file in this repository.

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
