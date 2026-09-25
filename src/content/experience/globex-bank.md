---
company: "Globex Bank"
role: "Backend Engineer"
line: "java"
start: "2018-03"
end: "2020-06"
location: "Remote"
plain: "Rebuilt a payments backend so it stopped losing transactions during peak load."
highlights:
  - "Cut duplicate-payment incidents from weekly to zero over 8 months"
  - "Moved the settlement job from a nightly batch to an event stream"
  - "Wrote the on-call runbook the team still uses today"
stack:
  - Java
  - Spring Boot
  - PostgreSQL
  - Kafka
---

The settlement pipeline ran once a night and any failure meant re-running the whole batch by hand.
I split it into idempotent, replayable steps driven off a Kafka topic, added a dead-letter queue for
the rows that needed a human, and instrumented every stage so on-call could see exactly where a run
had stopped. Transaction volume tripled over the following year without another rewrite.
