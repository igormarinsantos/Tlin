import { relative } from "node:path";

// Line numbers are deliberately excluded: moving code must not consume a budget.
export function countWarnings(results, cwd) {
  const counts = {};
  for (const result of results) {
    const file = relative(cwd, result.filePath).replaceAll("\\", "/");
    for (const message of result.messages) {
      if (message.severity !== 1) continue;
      const key = `${file}::${message.ruleId || "unclassified"}`;
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, "en")));
}

export function findWarningRegressions(current, baseline) {
  return Object.entries(current)
    .filter(([key, count]) => count > (baseline[key] || 0))
    .map(([key, count]) => ({ key, count, allowed: baseline[key] || 0 }));
}
