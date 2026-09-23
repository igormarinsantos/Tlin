---
schema_version: 1
open_count: 0
waived_count: 0
fixed_count: 2
total_count: 2
last_updated: 2026-09-23T20:45:06.840Z
---

# Broken Windows Ledger

> Cross-phase defect register. With `workflow.windows_enforce` enabled, `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 06 | deviation | tests/editorial/tracer.test.ts |  | Tracer de sitemap deixou de assumir um único artigo após o fechamento do registro canônico. | fixed |  | 2026-09-23T20:44:12.006Z | 2026-09-23T20:45:06.289Z |
| 2 | 06 | deviation | tests/editorial/tracer.test.ts |  | Tracer alinhado ao campo controlado content_group do contrato editorial paralelo. | fixed |  | 2026-09-23T20:44:12.538Z | 2026-09-23T20:45:06.840Z |

````json
[
  {
    "id": 1,
    "kind": "deviation",
    "phase": "06",
    "file": "tests/editorial/tracer.test.ts",
    "line": null,
    "description": "Tracer de sitemap deixou de assumir um único artigo após o fechamento do registro canônico.",
    "status": "fixed",
    "reason": "",
    "recorded_at": "2026-09-23T20:44:12.006Z",
    "resolved_at": "2026-09-23T20:45:06.289Z"
  },
  {
    "id": 2,
    "kind": "deviation",
    "phase": "06",
    "file": "tests/editorial/tracer.test.ts",
    "line": null,
    "description": "Tracer alinhado ao campo controlado content_group do contrato editorial paralelo.",
    "status": "fixed",
    "reason": "",
    "recorded_at": "2026-09-23T20:44:12.538Z",
    "resolved_at": "2026-09-23T20:45:06.840Z"
  }
]
````
