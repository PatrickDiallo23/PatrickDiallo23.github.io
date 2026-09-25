---
company: "DataLoom"
role: "Software Engineer, Data Platform"
line: "python"
start: "2020-07"
end: "2022-12"
location: "Berlin, Germany"
url: "https://example.com"
plain: "Built the tools the data team used to test and ship pipelines without breaking production."
highlights:
  - "Replaced ad-hoc notebooks with a tested, scheduled pipeline framework"
  - "Cut a report that took a day to generate down to 20 minutes"
  - "Onboarded 6 analysts onto the new framework with no incidents"
stack:
  - Python
  - Airflow
  - dbt
  - Snowflake
---

The data team shipped pipelines straight from notebooks, so a bad join could silently corrupt a
report for weeks before anyone noticed. I introduced a small internal framework with schema checks,
a local test runner, and a staging environment that mirrored production data volumes. Once analysts
could run their own pipeline in staging before merging, review time and incident count both dropped.
