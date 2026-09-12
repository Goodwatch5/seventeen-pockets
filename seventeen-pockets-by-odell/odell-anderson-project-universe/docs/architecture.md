# Architecture

This page describes the high-level structure of the Seventeen Pockets / Rightway ecosystem.

***

## High-level architecture

```
Seventeen Pockets / Rightway Platform

                           ┌─────────────────────┐
                           │      Rightway       │
                           │  Frontend / UI Form │
                           └──────────┬──────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │   seventeen-pockets      │
                         │ Backend / API / Orchestration │
                         └───────┬─────────┬────────┘
                                 │         │
                                 ▼         ▼
                    ┌─────────────────┐   ┌─────────────────┐
                    │  solar-connect  │   │   nextmyteam    │
                    │ Data / Metrics  │   │ Collaboration   │
                    └─────────────────┘   └────────┬────────┘
                                                   │
                                                   ▼
                                         ┌─────────────────┐
                                         │    deepagent    │
                                         │ AI / Intelligence │
                                         └─────────────────┘
```

***

## Functional roles

* **Rightway** is the primary interface and ecosystem home
* **seventeen-pockets** coordinates backend logic and service orchestration
* **solar-connect** gathers and exposes metrics and system intelligence
* **nextmyteam** provides collaboration and workflow support
* **deepagent** provides affiliated AI-enabled reasoning and intelligence services

***

## Ownership note

The core controlled repositories are centered in the Rightway ecosystem. Some connected services, such as deepagent, operate as affiliated external integrations rather than as repositories controlled from the same namespace.

***

## Data flow

```
User interaction begins in Rightway
→ Rightway requests and displays platform data
→ seventeen-pockets coordinates backend services and logic
→ solar-connect provides metrics and connected system intelligence
→ nextmyteam contributes collaboration and workflow functionality
→ deepagent provides affiliated intelligence services
```

***

## Platform principle

**One platform. Multiple operational forms. Unified by design.**
