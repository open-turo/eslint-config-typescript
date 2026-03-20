import type eslint from "@eslint/js";
import type vitest from "@vitest/eslint-plugin";
import type importX from "eslint-plugin-import-x";
import type jest from "eslint-plugin-jest";
import type n from "eslint-plugin-n";
import type perfectionist from "eslint-plugin-perfectionist";
import type sonarjs from "eslint-plugin-sonarjs";
import type unicorn from "eslint-plugin-unicorn";
import type { Config } from "eslint/config";
import type tseslint from "typescript-eslint";

declare namespace config {
  interface Options {
    /** List of modules to allow in the `n/no-unpublished-import` rule */
    allowModules?: string[];
    /** The ECMAScript version to use */
    ecmaVersion?: "latest" | number;
    /** List of glob patterns to ignore */
    ignores?: string[];
    /** Test framework to use (defaults to `"jest"`) */
    testFramework?: "jest" | "vitest";
    /** Whether to include TypeScript rules (defaults to `true`) */
    typescript?: boolean;
  }

  /**
   * The underlying ESLint plugins bundled with this config, re-exported so
   * consumers can extend or reference them without adding redundant direct
   * dependencies to their own `package.json`.
   */
  interface Plugins {
    eslint: typeof eslint;
    import: typeof importX;
    jest: typeof jest;
    n: typeof n;
    perfectionist: typeof perfectionist;
    sonarjs: typeof sonarjs;
    tseslint: typeof tseslint;
    unicorn: typeof unicorn;
    vitest: typeof vitest;
  }

  const plugins: Plugins;
}

declare function config(options?: config.Options): Config[];

export = config;
