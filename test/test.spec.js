import { loadESLint } from "eslint";

describe("validate config", () => {
  test.each(["./index.mjs", "./index.cjs", "./recommended.cjs"])(
    `load config file in ESLint to validate all rules are correct for %s`,
    async (config) => {
      const testFileName = "test.js";
      const useFlatConfig = !config.includes("recommended");
      const ESLint = await loadESLint({
        useFlatConfig,
      });
      const linter = new ESLint({
        overrideConfig: useFlatConfig
          ? [
              {
                files: [testFileName],
                languageOptions: {
                  parserOptions: {
                    projectService: {
                      allowDefaultProject: [testFileName],
                    },
                  },
                },
              },
            ]
          : {
              parserOptions: {
                projectService: {
                  allowDefaultProject: [testFileName],
                },
              },
            },
        // cwd: cwd,
        overrideConfigFile: config,
      });
      const messages = await linter.lintText(
        `const foo = 1;\nconsole.log(foo);\n`,
        {
          filePath: testFileName,
        },
      );
      expect(messages[0].messages).toEqual([]);
      expect(messages[0].errorCount).toEqual(0);
    },
  );
});
