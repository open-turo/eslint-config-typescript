import type eslint from "@eslint/js";
import type vitestPlugin from "@vitest/eslint-plugin";
import type importPlugin from "eslint-plugin-import";
import type jestPlugin from "eslint-plugin-jest";
import type nPlugin from "eslint-plugin-n";
import type perfectionistPlugin from "eslint-plugin-perfectionist";
import type sonarjsPlugin from "eslint-plugin-sonarjs";
import type unicornPlugin from "eslint-plugin-unicorn";
import type { Config } from "eslint/config";
import type tseslint from "typescript-eslint";

export interface Options {
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
export interface Plugins {
  eslint: typeof eslint;
  importPlugin: typeof importPlugin;
  jestPlugin: typeof jestPlugin;
  nPlugin: typeof nPlugin;
  perfectionistPlugin: typeof perfectionistPlugin;
  sonarjsPlugin: typeof sonarjsPlugin;
  tseslint: typeof tseslint;
  unicornPlugin: typeof unicornPlugin;
  vitestPlugin: typeof vitestPlugin;
}

declare function config(options?: Options): Config[];
declare namespace config {
  const plugins: Plugins;
}

export default config;
