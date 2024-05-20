const fs = require("fs");
const { ESLint } = require("eslint");

describe("validate config", () => {
  it(`load config file in ESLint to validate all rules are correct`, async () => {
    const stringConfig = fs.readFileSync("./test.js", "utf8");

    const cli = new ESLint({
      overrideConfigFile: "./index.js",
    });

    const lintResult = await cli.lintText(stringConfig);

    /**
     * We just need to validate a value is returned.
     * If there is an issue with the config, `cli.lintText` will error,
     * and we will never hit this line so the test will fail.
     */
    expect(lintResult).toBeTruthy();
  });
});
