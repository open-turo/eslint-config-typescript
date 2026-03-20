/** @import { ParserOptions } from "@typescript-eslint/parser"; */
import { loadESLint } from "eslint";

const TEST_FILE_PATH = "./test/sample.test.ts";

function getRuleSeverity(rules, ruleName) {
  const value = rules[ruleName];
  if (value === undefined) return;
  if (Array.isArray(value)) {
    const severity = value[0];
    return typeof severity === "string"
      ? { error: 2, off: 0, warn: 1 }[severity]
      : severity;
  }
  return typeof value === "string"
    ? { error: 2, off: 0, warn: 1 }[value]
    : value;
}

/**
 * Extension rules from @typescript-eslint replace core ESLint rules for TypeScript.
 * Ensures 1:1 mapping: @typescript-eslint version is error, vanilla version is off.
 * @see https://typescript-eslint.io/rules?=extension#rules
 */
const EXTENSION_RULES = [
  {
    baseRule: "class-methods-use-this",
    tsRule: "@typescript-eslint/class-methods-use-this",
  },
  {
    baseRule: "consistent-return",
    tsRule: "@typescript-eslint/consistent-return",
  },
  {
    baseRule: "default-param-last",
    tsRule: "@typescript-eslint/default-param-last",
  },
  { baseRule: "dot-notation", tsRule: "@typescript-eslint/dot-notation" },
  {
    baseRule: "init-declarations",
    tsRule: "@typescript-eslint/init-declarations",
  },
  { baseRule: "max-params", tsRule: "@typescript-eslint/max-params" },
  {
    baseRule: "no-array-constructor",
    tsRule: "@typescript-eslint/no-array-constructor",
  },
  {
    baseRule: "no-dupe-class-members",
    tsRule: "@typescript-eslint/no-dupe-class-members",
  },
  {
    baseRule: "no-empty-function",
    tsRule: "@typescript-eslint/no-empty-function",
  },
  {
    baseRule: "no-implied-eval",
    tsRule: "@typescript-eslint/no-implied-eval",
  },
  {
    baseRule: "no-invalid-this",
    tsRule: "@typescript-eslint/no-invalid-this",
  },
  { baseRule: "no-loop-func", tsRule: "@typescript-eslint/no-loop-func" },
  {
    baseRule: "no-loss-of-precision",
    tsRule: "@typescript-eslint/no-loss-of-precision",
  },
  {
    baseRule: "no-magic-numbers",
    tsRule: "@typescript-eslint/no-magic-numbers",
  },
  { baseRule: "no-redeclare", tsRule: "@typescript-eslint/no-redeclare" },
  {
    baseRule: "no-restricted-imports",
    tsRule: "@typescript-eslint/no-restricted-imports",
  },
  { baseRule: "no-shadow", tsRule: "@typescript-eslint/no-shadow" },
  {
    baseRule: "no-unused-expressions",
    tsRule: "@typescript-eslint/no-unused-expressions",
  },
  {
    baseRule: "no-unused-private-class-members",
    tsRule: "@typescript-eslint/no-unused-private-class-members",
  },
  { baseRule: "no-unused-vars", tsRule: "@typescript-eslint/no-unused-vars" },
  {
    baseRule: "no-use-before-define",
    tsRule: "@typescript-eslint/no-use-before-define",
  },
  {
    baseRule: "no-useless-constructor",
    tsRule: "@typescript-eslint/no-useless-constructor",
  },
  /**
   * Only example where the rule name is different, which forces us to use this object API.
   */
  {
    baseRule: "no-throw-literal",
    tsRule: "@typescript-eslint/only-throw-error",
  },
  {
    baseRule: "prefer-destructuring",
    tsRule: "@typescript-eslint/prefer-destructuring",
  },
  {
    baseRule: "prefer-promise-reject-errors",
    tsRule: "@typescript-eslint/prefer-promise-reject-errors",
  },
  { baseRule: "require-await", tsRule: "@typescript-eslint/require-await" },
];

describe("validate config", () => {
  const testFileName = "test.js";
  const code = `const foo = 1;\nconsole.log(foo);\n`;
  const parserOptions = {
    projectService: {
      allowDefaultProject: [testFileName],
    },
  };

  test.each(["index.mjs", "index.cjs"])(
    `the flat config is correct for %s`,
    async (configFile) => {
      const ESLint = await loadESLint();
      const { default: config } = await import(`../${configFile}`);
      const linter = new ESLint({
        baseConfig: config(),
        overrideConfig: [
          {
            files: [testFileName],
            languageOptions: {
              parserOptions,
            },
          },
        ],
      });
      const messages = await linter.lintText(code, {
        filePath: testFileName,
      });
      expect(messages[0].messages).toEqual([]);
      expect(messages[0].errorCount).toEqual(0);
      const calculatedConfig =
        await linter.calculateConfigForFile(TEST_FILE_PATH);
      expect(calculatedConfig.rules).toMatchSnapshot();
    },
  );

  test.each(["index.mjs", "index.cjs"])(
    `the flat config with vitest is correct for %s`,
    async (configFile) => {
      const ESLint = await loadESLint();
      const { default: config } = await import(`../${configFile}`);
      const linter = new ESLint({
        baseConfig: config({ testFramework: "vitest" }),
        overrideConfig: [
          {
            files: [testFileName],
            languageOptions: {
              parserOptions,
            },
          },
        ],
      });
      const messages = await linter.lintText(code, {
        filePath: testFileName,
      });
      expect(messages[0].messages).toEqual([]);
      expect(messages[0].errorCount).toEqual(0);
      const calculatedConfig =
        await linter.calculateConfigForFile(TEST_FILE_PATH);
      expect(calculatedConfig.rules).toMatchSnapshot();
    },
  );

  test.each(["index.mjs", "index.cjs"])(
    `the flat config maintains 1:1 mapping for @typescript-eslint extension rules (%s)`,
    async (configFile) => {
      const ESLint = await loadESLint();
      const { default: config } = await import(`../${configFile}`);
      const linter = new ESLint({
        baseConfig: config(),
        overrideConfig: [
          {
            files: ["**/*.ts", "**/*.tsx"],
            languageOptions: {
              parserOptions: {
                ...parserOptions,
                projectService: {
                  allowDefaultProject: [testFileName, TEST_FILE_PATH],
                },
              },
            },
          },
        ],
      });
      const calculatedConfig =
        await linter.calculateConfigForFile(TEST_FILE_PATH);
      const rules = calculatedConfig.rules;

      const violations = [];
      for (const { baseRule, tsRule } of EXTENSION_RULES) {
        /**
         * @typescript-eslint/no-loss-of-precision is deprecated in favor of ESLint's rule.
         * {@link https://typescript-eslint.io/rules/no-loss-of-precision/ Docs}
         */
        if (baseRule === "no-loss-of-precision") continue;

        const tsSeverity = getRuleSeverity(rules, tsRule);
        const baseSeverity = getRuleSeverity(rules, baseRule);

        if (baseSeverity !== undefined && baseSeverity !== 0) {
          violations.push(
            `${baseRule} must be off (use ${tsRule}), got severity ${baseSeverity}`,
          );
        }
        if (tsSeverity !== undefined && tsSeverity !== 0 && tsSeverity !== 2) {
          violations.push(
            `${tsRule} must be error when enabled, got severity ${tsSeverity}`,
          );
        }
      }
      expect(violations).toEqual([]);
    },
  );

  test("throws error for invalid testFramework", async () => {
    const { default: config } = await import("../index.cjs");
    expect(() => config({ testFramework: "invalid" })).toThrow(
      'Invalid testFramework option: "invalid". Valid values are "jest" or "vitest".',
    );
  });
});
