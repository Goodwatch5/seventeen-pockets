# Status Model

This page defines the canonical status vocabulary for the Seventeen Pockets / Rightway ecosystem.

The purpose of this model is to keep project descriptions, documentation, and platform communication consistent across repositories and pages.

***

## Core principle

A project or service should be described according to its current operational role in the ecosystem, not according to aspiration alone.

***

## Canonical statuses

### Active

Use **Active** for projects that are currently part of the operating platform and are part of the present ecosystem story.

Examples:

* Rightway
* seventeen-pockets
* solar-connect
* nextmyteam

### Supporting

Use **Supporting** for projects, tools, or repositories that are useful to the platform and may be integrated into platform work, but are not central to the primary platform identity.

Use this when a repository helps the ecosystem without being one of the main operational forms.

### Integrated external

Use **Integrated external** for services or repositories that are connected to the ecosystem architecture but are not controlled from the same repository set or namespace.

Example:

* deepagent

### Planned

Use **Planned** for projects, modules, or services that are defined as intended work but are not yet operating as active parts of the platform.

Use this only when the work has enough definition to be treated as real planned scope.

### Experimental

Use **Experimental** for projects, modules, or ideas that are under exploration, testing, or validation and should not yet be presented as stable platform truth.

### Legacy

Use **Legacy** for projects, deployment paths, or materials retained for history, compatibility, or transition purposes but not meant to represent the main current direction.

***

## Decision rule

When choosing a status, ask:

1. Is this currently part of the live platform story?
2. Is it controlled within the core ecosystem repositories?
3. Is it stable enough to describe as present truth?
4. Is it external, exploratory, or retained mainly for history?

***

## Recommended usage

Use these statuses consistently in:

* project inventory tables
* README files
* architecture notes
* roadmap and current-state pages
* ecosystem summaries

***

## Current examples

| Project or service | Recommended status  |
| ------------------ | ------------------- |
| Rightway           | Active              |
| seventeen-pockets  | Active              |
| solar-connect      | Active              |
| nextmyteam         | Active              |
| deepagent          | Integrated external |

***

## What to avoid

Avoid mixing status vocabulary casually.

Do not alternate between different terms for the same meaning unless a distinction is intentional. For example, avoid using `active`, `live`, `current`, and `core` as if they were interchangeable status labels.

***

## Platform principle

**One platform. Multiple operational forms. Unified by design.**
