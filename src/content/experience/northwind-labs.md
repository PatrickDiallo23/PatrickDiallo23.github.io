---
company: "Northwind Labs"
role: "Senior Engineer, Platform & AI"
line: "devops"
start: "2023-01"
end: null
location: "Remote"
url: "https://example.com"
plain: "Own the deploy pipeline and the AI features that ride on top of it."
highlights:
  - "Cut release time from a day of manual steps to 20 minutes, self-serve"
  - "Built the canary rollout that now gates every production deploy"
  - "Shipped an internal search assistant used by support and sales"
stack:
  - Kubernetes
  - Terraform
  - GitHub Actions
  - Python
  - AI/retrieval
---

Releases used to mean a shared spreadsheet, a Slack thread, and someone awake at 6am. I replaced the
manual steps with a GitHub Actions pipeline that runs the test suite, deploys a canary, watches error
rates for 15 minutes, and only then promotes to the rest of the fleet — with an automatic rollback if
the canary's error budget is exceeded. On the AI side, I built a retrieval-augmented search assistant
over the internal docs that support now uses as a first line of triage.
