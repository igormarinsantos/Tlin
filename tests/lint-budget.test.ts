import { describe, expect, it } from "vitest";
import { resolve } from "node:path";
import { countWarnings, findWarningRegressions } from "../scripts/lint-budget.mjs";

describe("lint warning budget", () => {
  it("counts warnings by portable path and rule, independently of line numbers", () => {
    const results = [{
      filePath: resolve("components", "Example.tsx"),
      messages: [
        { severity: 1, ruleId: "rule-a", line: 1 },
        { severity: 1, ruleId: "rule-a", line: 200 },
        { severity: 2, ruleId: "rule-b", line: 2 },
      ],
    }];
    expect(countWarnings(results, process.cwd())).toEqual({ "components/Example.tsx::rule-a": 2 });
  });

  it("allows the existing debt and its reduction", () => {
    expect(findWarningRegressions({ "a::rule": 1 }, { "a::rule": 2, "b::rule": 1 })).toEqual([]);
    expect(findWarningRegressions({ "a::rule": 2 }, { "a::rule": 2 })).toEqual([]);
  });

  it("blocks a new warning even when another file was cleaned up", () => {
    expect(findWarningRegressions({ "b::rule": 1 }, { "a::rule": 10 })).toEqual([
      { key: "b::rule", count: 1, allowed: 0 },
    ]);
  });

  it("blocks a new rule and an increase in an existing file", () => {
    expect(findWarningRegressions({ "a::rule": 3, "a::new-rule": 1 }, { "a::rule": 2 })).toEqual([
      { key: "a::rule", count: 3, allowed: 2 },
      { key: "a::new-rule", count: 1, allowed: 0 },
    ]);
  });
});
