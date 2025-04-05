import { loadESLint } from "eslint";

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
    const linter = new ESLint({
      overrideConfig: {
        parserOptions,
      },
      overrideConfigFile: "./recommended.cjs",
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
});
