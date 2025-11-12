/** @import { ParserOptions } from "@typescript-eslint/parser"; */
import { loadESLint } from "eslint";

import recommendedConfig from "../recommended.cjs";

describe("validate config", () => {
  const testFileName = "test.js";
  const code = `const foo = 1;\nconsole.log(foo);\n`;
  const parserOptions = {
    projectService: {
      allowDefaultProject: [testFileName],
    },
  };

  test("the legacy recommended config is correct", async () => {
    const ESLint = await loadESLint({
      useFlatConfig: false,
    });
    const modifiedRecommendedConfig = {
      ...recommendedConfig,
      parserOptions: {
        ...recommendedConfig.parserOptions,
        /**
         * @typescript-eslint/parser@8.46.4 errors if `projectService` and `project` are both defined.
         * `@typescript-eslint` recommends `projectService` over `project`, and we use `projectService` in the non-legacy config,
         * but not the legacy `recommended` config. Because thi spec uses `projectService`, we explicitly omit `project` here to avoid the error.
         */
        project: undefined,
      },
    };
    const linter = new ESLint({
      baseConfig: modifiedRecommendedConfig,
      overrideConfig: {
        parserOptions,
      },
    });
    const messages = await linter.lintText(code, {
      filePath: testFileName,
    });
    expect(messages[0].messages).toEqual([]);
    expect(messages[0].errorCount).toEqual(0);
    const calculatedConfig =
      await linter.calculateConfigForFile("./test/sample.ts");
    expect(calculatedConfig.rules).toMatchSnapshot();
  });

  test.each(["index.mjs", "index.cjs"])(
    `the flat config is correct for %s`,
    async (configFile) => {
      const ESLint = await loadESLint({
        useFlatConfig: true,
      });
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
        await linter.calculateConfigForFile("./test/sample.ts");
      expect(calculatedConfig.rules).toMatchSnapshot();
    },
  );

  test.each(["index.mjs", "index.cjs"])(
    `the flat config with vitest is correct for %s`,
    async (configFile) => {
      const ESLint = await loadESLint({
        useFlatConfig: true,
      });
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
        await linter.calculateConfigForFile("./test/sample.ts");
      expect(calculatedConfig.rules).toMatchSnapshot();
    },
  );

  test("throws error for invalid testFramework", async () => {
    const { default: config } = await import("../index.cjs");
    expect(() => config({ testFramework: "invalid" })).toThrow(
      'Invalid testFramework option: "invalid". Valid values are "jest" or "vitest".',
    );
  });
});
