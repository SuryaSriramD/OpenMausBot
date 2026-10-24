# Configurable attachment limits

`OMB_ATTACHMENT_MAX_MB` sets the server's per-file limit at startup. It accepts
whole numbers from 10 to 512 in MiB (1,048,576 bytes); unset preserves 25 MiB.
Images remain capped at 10 MiB and the shared attachment store at 512 MiB.
The server includes the effective limits in config snapshots and advertises
the file limit to agent tools. The web composer and media previews consume
the config snapshot. Reload clients after deploying the updated application.

Run the isolated HTTP and conversation check:

```sh
node --experimental-strip-types scripts/verify-attachment-limits.ts
```

It launches `control-omb`'s disposable fake-engine server with a 250 MiB cap,
checks its config response, streams a file exactly at the limit, verifies a
250 MiB + 1 declared upload receives HTTP 413, and uses the mapped `new-bot`,
`send`, and `wait` commands to produce a bot reply linking the uploaded file.
It then downloads all 250 MiB through that message's authorized file route.
The emitted JSON includes the fixture URL, log path, byte counts, refusal
status, and settled conversation result. Preserve that JSON and server log.
The fixture closes its child and removes its temporary data on completion.

Focused regression checks:

```sh
pnpm exec vitest run server/attachment-limits.test.ts server/attachments.test.ts server/message-file.test.ts server/bot-attachment.test.ts scripts/control-omb.test.ts server/drivers/agents-proxy.test.ts src/lib/attachment-limits.test.ts src/lib/composer-attachments.test.ts src/components/AttachmentGallery.test.ts src/state/store.test.ts
pnpm typecheck
pnpm i18n:check
```

The regression tests cover agent attachment copying, configured/default
limits, oversized streamed uploads, image and quota invariants, composer
validation, media previews, and config frames. The HTTP fixture does not
exercise a real provider, the `attach_file` MCP call, native iOS clients,
or an external proxy's request limit.
