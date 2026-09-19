import { readFile, writeFile } from "node:fs/promises";
import { ESLint } from "eslint";
import { countWarnings, findWarningRegressions } from "./lint-budget.mjs";

const baselineUrl = new URL("../docs/quality/lint-baseline.json", import.meta.url);
const updateBaseline = process.argv.includes("--update-baseline");
const eslint = new ESLint();
const results = await eslint.lintFiles(["."]);
const errors = results.reduce((sum, result) => sum + result.errorCount, 0);
const warnings = countWarnings(results, process.cwd());
const total = Object.values(warnings).reduce((sum, count) => sum + count, 0);

if (errors > 0) {
  const formatter = await eslint.loadFormatter("stylish");
  console.error(formatter.format(results.filter((result) => result.errorCount > 0)));
  console.error("Lint bloqueado: corrija os erros antes de atualizar a referência.");
  process.exitCode = 1;
} else if (updateBaseline) {
  await writeFile(baselineUrl, `${JSON.stringify({ version: 1, warnings }, null, 2)}\n`);
  console.log(`Referência atualizada: ${total} avisos. Revise o diff; não aceite aumentos automaticamente.`);
} else {
  const baseline = JSON.parse(await readFile(baselineUrl, "utf8"));
  if (baseline.version !== 1 || !baseline.warnings) throw new Error("Referência de lint inválida.");
  const regressions = findWarningRegressions(warnings, baseline.warnings);
  if (regressions.length > 0) {
    console.error("Novos avisos por arquivo/regra:");
    for (const item of regressions) console.error(`  ${item.key}: ${item.count} (limite ${item.allowed})`);
    console.error("Use npm run lint para localizar os avisos e corrija a regressão.");
    process.exitCode = 1;
  } else {
    console.log(`Lint OK: 0 erros, ${total} avisos conhecidos, nenhuma regressão por arquivo/regra.`);
    if (JSON.stringify(warnings) !== JSON.stringify(baseline.warnings)) {
      console.log("A dívida diminuiu. Execute npm run lint:baseline e revise a redução antes de commitar.");
    }
  }
}
