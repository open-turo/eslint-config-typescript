/** @import { Rule } from "eslint" */

/**
 * A TODO used as a tag: at the start of a comment line (after spaces or `*`), or after ` -- `,
 * as in `@ts-expect-error -- TODO(ABC-123, owner-name): description`. The word `TODO` elsewhere in a comment is prose.
 */
const TODO_TAG_PATTERN = /(?:^|\n)[\t *]*(?=TODO\b)|--[\t ]+(?=TODO\b)/g;
const TODO_STRUCTURE = /^TODO\(([^(),]+), ([^()]+)\):(?=\s|$)/;
/** A Jira-like key (`ABC-123`) or a GitHub issue (`owner/repo#123`). */
const DEFAULT_TICKET_PATTERN = String.raw`[A-Z][A-Z0-9]+-\d+|[\w.-]+/[\w.-]+#\d+`;
const DEFAULT_OWNER_PATTERN = String.raw`[^\s(),]+`;

/**
 * @typedef {{ regexp: RegExp, source: string }} Pattern A compiled option, with the source the user wrote
 */

/**
 * @param {string} name The option name, for the error message
 * @param {string} source The regular expression the whole string must match
 * @returns {Pattern}
 */
const compilePattern = (name, source) => {
  try {
    return { regexp: new RegExp(`^(?:${source})$`), source };
  } catch (error) {
    throw new Error(
      `open-turo/todo-format: the \`${name}\` option is not a valid regular expression: ${source}`,
      { cause: error },
    );
  }
};

/**
 * Whether the TODO at the start of `text` is one of the ignored tags, such as `TODO-FOO`.
 * @param {string} text
 * @param {string[]} ignore
 */
const isIgnored = (text, ignore) =>
  ignore.some(
    (tag) => text.startsWith(tag) && !/^[\w-]/u.test(text.slice(tag.length)),
  );

/** @type {Rule.RuleModule} */
export const todoFormatRule = {
  create(context) {
    const options = context.options[0] ?? {};
    const patterns = {
      owner: compilePattern(
        "ownerPattern",
        options.ownerPattern ?? DEFAULT_OWNER_PATTERN,
      ),
      ticket: compilePattern(
        "ticketPattern",
        options.ticketPattern ?? DEFAULT_TICKET_PATTERN,
      ),
    };
    const ignore = options.ignore ?? [];
    const { sourceCode } = context;

    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          if (!comment.loc) continue;

          // Report on the comment's first line, so an `eslint-disable-next-line`
          // above the comment also covers a TODO inside a multi-line comment.
          for (const report of checkComment(comment.value, patterns, ignore)) {
            context.report({ ...report, loc: comment.loc.start });
          }
        }
      },
    };
  },
  meta: {
    docs: {
      description: "Require TODO comments to reference a ticket and an owner",
    },
    messages: {
      invalidFormat:
        "TODO comments must follow `TODO(<ticket>, <owner>): <description>`.",
      invalidOwner:
        'The TODO owner "{{owner}}" does not match the expected pattern `{{pattern}}`.',
      invalidTicket:
        'The TODO ticket "{{ticket}}" does not match the expected pattern `{{pattern}}`.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          ignore: {
            description:
              "TODO tags to skip, such as `TODO-FOO`. A tag matches only when it is not followed by a word character or `-`.",
            items: { type: "string" },
            type: "array",
          },
          ownerPattern: {
            description:
              "Regular expression the whole owner must match. Defaults to any non-empty owner without spaces, commas or parentheses.",
            type: "string",
          },
          ticketPattern: {
            description:
              "Regular expression the whole ticket must match. Defaults to a Jira-like key (`ABC-123`) or a GitHub issue (`owner/repo#123`).",
            type: "string",
          },
        },
        type: "object",
      },
    ],
    type: "suggestion",
  },
};

/**
 * @typedef {Pick<Rule.ReportDescriptor, "data" | "messageId">} Report
 */

/**
 * @param {string} value The comment text
 * @param {{ owner: Pattern, ticket: Pattern }} patterns
 * @param {string[]} ignore
 * @returns {Report[]} Every problem of the TODOs in the comment, without duplicates
 */
function checkComment(value, patterns, ignore) {
  /** @type {Map<string, Report>} */
  const reports = new Map();
  for (const match of value.matchAll(TODO_TAG_PATTERN)) {
    const todo = value.slice(match.index + match[0].length);
    if (isIgnored(todo, ignore)) continue;

    for (const report of checkTodo(todo, patterns)) {
      reports.set(JSON.stringify(report), report);
    }
  }
  return [...reports.values()];
}

/**
 * @param {string} todo The comment text, starting at `TODO`
 * @param {{ owner: Pattern, ticket: Pattern }} patterns
 * @returns {Report[]} Every problem of the TODO, or an empty list when it is valid
 */
function checkTodo(todo, patterns) {
  const structure = TODO_STRUCTURE.exec(todo);
  if (!structure) return [{ messageId: "invalidFormat" }];

  const [, ticket, owner] = structure;
  /** @type {Report[]} */
  const reports = [];
  if (!patterns.ticket.regexp.test(ticket)) {
    reports.push({
      data: { pattern: patterns.ticket.source, ticket },
      messageId: "invalidTicket",
    });
  }
  if (!patterns.owner.regexp.test(owner)) {
    reports.push({
      data: { owner, pattern: patterns.owner.source },
      messageId: "invalidOwner",
    });
  }
  return reports;
}
