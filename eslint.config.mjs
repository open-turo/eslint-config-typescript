import openTuroTypescriptConfig from "./index.mjs";
import jestPlugin from "eslint-plugin-jest";

export default [
  ...openTuroTypescriptConfig,
  {
    files: ["*.cjs", "*.mjs", "test/**/*.js"],
    languageOptions: {
      parserOptions: {
        projectService: {
          // This project doesn't use Typescript and a lot of our rules require type checking
          allowDefaultProject: [
            "index.mjs",
            "index.cjs",
            "eslint.config.mjs",
            "recommended.cjs",
            "test/test.spec.js",
          ],
        },
      },
    },
  },
];
