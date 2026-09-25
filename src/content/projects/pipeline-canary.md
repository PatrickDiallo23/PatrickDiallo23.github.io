---
title: "Canary Deploy Toolkit"
line: "devops"
category: "DevOps"
plain: "A GitHub Action that rolls a deploy out to a small slice of traffic first, then promotes or rolls back on its own."
stack:
  - GitHub Actions
  - Kubernetes
  - Prometheus
repo: "https://github.com/your-username/canary-toolkit"
start: "2024-02"
end: "2024-05"
featured: true
---

Watches error rate and latency on the canary slice for a configurable window, then promotes
automatically if both stay inside budget, or rolls back and posts the reason to Slack if they don't.
Used in production to gate every deploy at Northwind Labs.
