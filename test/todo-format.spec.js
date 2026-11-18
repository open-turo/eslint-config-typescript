import { Linter, RuleTester } from "eslint";

import { todoFormatRule } from "../rules/todo-format.js";

const ruleTester = new RuleTester();
const invalidFormat = [{ messageId: "invalidFormat" }];

describe("with default options", () => {
  ruleTester.run("todo-format", todoFormatRule, {
    invalid: [
      { code: "// TODO: fix this", errors: invalidFormat },
      { code: "// TODO(owner-name): fix this", errors: invalidFormat },
      {
        code: "// TODO (ABC-123, owner-name): fix this",
        errors: invalidFormat,
      },
      { code: "// TODO(ABC-123 owner-name): fix this", errors: invalidFormat },
      { code: "// TODO(ABC-123, owner-name) fix this", errors: invalidFormat },
      { code: "// TODO [ABC-123]: fix this", errors: invalidFormat },
      { code: "// TODO-FOO: fix this", errors: invalidFormat },
      { code: "/* TODO: fix this */", errors: invalidFormat },
      { code: "// @ts-expect-error -- TODO: fix this", errors: invalidFormat },
      {
        code: "// TODO(https://example.com/browse/ABC-123, owner-name): fix this",
        errors: [{ messageId: "invalidTicket" }],
      },
      {
        code: "// TODO(abc-123, owner-name): fix this",
        errors: [{ messageId: "invalidTicket" }],
      },
      {
        code: "// TODO(ABC-123, owner, other-owner): fix this",
        errors: [{ messageId: "invalidOwner" }],
      },
      {
        code: "/**\n * Some context.\n * TODO: fix this\n */",
        errors: [{ column: 1, line: 1, messageId: "invalidFormat" }],
      },
      {
        code: "/**\n * TODO: fix this\n * TODO: and this\n */",
        errors: [{ column: 1, line: 1, messageId: "invalidFormat" }],
      },
      {
        code: "foo(); // TODO: fix this",
        errors: [{ column: 8, line: 1, messageId: "invalidFormat" }],
      },
      {
        code: "const a = <div>{/* TODO: fix this */}</div>;",
        errors: invalidFormat,
        languageOptions: {
          parserOptions: { ecmaFeatures: { jsx: true } },
        },
      },
    ],
    valid: [
      "// TODO(ABC-123, owner-name): fix this",
      "// TODO(AB2-1, @someone): fix this",
      "// TODO(ABC-123, owner-name):",
      "// @ts-expect-error -- TODO(ABC-123, owner-name): fix this",
      "/**\n * TODO(ABC-123, owner-name):\n * fix this\n */",
      // RuleTester registers the rule as `rule-to-test/todo-format`.
      "// eslint-disable-next-line rule-to-test/todo-format -- TODO(ABC-123, owner-name): reformat to the expected format\n/**\n * Some context.\n * TODO: fix this\n */",
      "// TODO(ABC-123, owner-name): fix this, see the TODO above",
      "// TODO(ABC-123, owner-name): fix this\n// once the TODO list ships",
      "// Keep the TODO list in sync",
      "// See https://example.com/docs/TODO.md",
      "// TODOs are tracked in tickets",
      "// todo: lowercase is ignored",
      'const label = "TODO: not a comment";',
    ],
  });
});

describe("with custom options", () => {
  ruleTester.run("todo-format", todoFormatRule, {
    invalid: [
      {
        code: "// TODO(XYZ-1, team:core): fix this",
        errors: [
          {
            data: { pattern: String.raw`ABC-\d+`, ticket: "XYZ-1" },
            messageId: "invalidTicket",
          },
        ],
        options: [{ ticketPattern: String.raw`ABC-\d+` }],
      },
      {
        code: "// TODO(ABC-1, owner-name): fix this",
        errors: [
          {
            data: {
              owner: "owner-name",
              pattern: "^(team|service):[a-z-]+$|^@bot$",
            },
            messageId: "invalidOwner",
          },
        ],
        options: [{ ownerPattern: "^(team|service):[a-z-]+$|^@bot$" }],
      },
      {
        code: "// TODO-FOOBAR: fix this",
        errors: invalidFormat,
        options: [{ ignore: ["TODO-FOO"] }],
      },
    ],
    valid: [
      {
        code: "// TODO(ABC-1, team:core): fix this",
        options: [
          {
            ownerPattern: "^(team|service):[a-z-]+$|^@bot$",
            ticketPattern: String.raw`ABC-\d+`,
          },
        ],
      },
      {
        code: "// TODO(ABC-1, @bot): fix this",
        options: [{ ownerPattern: "^(team|service):[a-z-]+$|^@bot$" }],
      },
      {
        code: "// TODO-FOO: fix this",
        options: [{ ignore: ["TODO-FOO"] }],
      },
      {
        code: "// TODO-FOO(ABC-1): fix this",
        options: [{ ignore: ["TODO-FOO"] }],
      },
    ],
  });
});

describe("with an invalid pattern option", () => {
  test("throws an error that names the option", () => {
    const linter = new Linter();
    const verify = () =>
      linter.verify("// TODO(ABC-1, owner-name): fix this", {
        plugins: { test: { rules: { "todo-format": todoFormatRule } } },
        rules: { "test/todo-format": ["error", { ownerPattern: "(" }] },
      });

    expect(verify).toThrow(
      "the `ownerPattern` option is not a valid regular expression: (",
    );
  });
});
