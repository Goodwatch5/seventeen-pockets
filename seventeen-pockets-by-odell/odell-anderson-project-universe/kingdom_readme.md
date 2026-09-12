# Stratum Clinical Health

> Intelligence platform for healthcare. Every decision carries an audit trail; designed to minimize errors through continuous validation.

_Part of **Seventeen Pockets** — autonomous intelligence infrastructure built on continuous validation._

> Brand note: "Stratum Clinical Health™" is the healthcare product brand for this system (formerly "Rightway"). ™ denotes an unregistered mark; trademark registration is pending and has not yet been granted. The repository path and technical identifiers are unchanged.

## What this is

Stratum Clinical Health is the healthcare product of the Seventeen Pockets platform. It supports decisions with evidence, records an audit trail for every action, and is designed to detect, reduce, and correct errors through continuous validation.

Clinical decision-support capabilities are scoped: any clinical use requires appropriate testing and regulatory/clinical review before being claimed as production-ready.

## Where it sits in the kingdom

* **Seventeen Pockets** — intelligence operating system (parent platform)
* **Stratum Clinical Health** — healthcare product (this system)
* Connected via parent-child pipelines and a shared validation layer.

## Deployment modes

* **Offline (primary)** — local data + local inference, no internet required (rural / field / disaster)
* **Hybrid** — local with optional cloud sync (privacy / GDPR)
* **Connected** — full cloud (urban, cloud-native)

Offline operation is backed by CI proof, not just claimed.

## How We Validate

We don't claim zero errors. We engineer to detect, reduce, and correct them.

1. **Evidence** — inputs and assumptions are recorded.
2. **Checks** — automated tests, linting, and policy gates run in CI.
3. **Confidence** — outputs carry a confidence score; low-confidence results are flagged.
4. **Traceability** — each decision emits an audit record.
5. **Correction** — failures feed the next run, so the system improves automatically.

## Status

State only what is demonstrable today. Healthcare capabilities require appropriate testing, validation, and regulatory/clinical review before being claimed.

## Links

* Live: pending validation
* Pipelines: see project CI/CD
