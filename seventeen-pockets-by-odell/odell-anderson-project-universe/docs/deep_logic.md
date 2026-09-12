# Deep Logic Audit Layer

This project now includes `scripts/deep-logic-audit.mjs`, a non-breaking introspection script that reports:

* API surface count
* test file count
* markdown count
* CI presence
* env example presence
* package script health

Run it with:

```bash
node scripts/deep-logic-audit.mjs
```

This is the first safe layer before deeper runtime integrations are added.
