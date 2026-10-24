import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { request } from "node:http";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { launchVerificationServer, runControlOmb } from "./control-omb.ts";

const maxBytes = 250 * 1024 * 1024;
const fixture = await launchVerificationServer({ ...process.env, OMB_ATTACHMENT_MAX_MB: "250" });
const url = fixture.info.url;
const control = (args: string[]) => runControlOmb([...args, "--url", url]);

try {
  const config = await fetch(`${url}/api/config`).then((response) => response.json());
  assert.deepEqual(config.attachmentLimits, { fileMaxBytes: maxBytes, imageMaxBytes: 10 * 1024 * 1024 });
  let remaining = maxBytes;
  const upload = await fetch(`${url}/api/files?name=boundary.pdf`, {
    method: "POST",
    headers: { "content-type": "application/pdf" },
    body: new ReadableStream({
      pull(controller) {
        if (!remaining) return controller.close();
        const chunk = new Uint8Array(Math.min(remaining, 1024 * 1024));
        remaining -= chunk.length;
        controller.enqueue(chunk);
      },
    }),
    duplex: "half",
  } as RequestInit & { duplex: "half" });
  assert.equal(upload.status, 201, await upload.clone().text());
  const saved = await upload.json();
  assert.equal(saved.bytes, maxBytes);

  const oversizedStatus = await new Promise<number | undefined>((resolve, reject) => {
    const req = request(`${url}/api/files?name=oversized.pdf`, {
      method: "POST", headers: { "content-type": "application/pdf", "content-length": maxBytes + 1 },
    }, (res) => { res.resume(); res.on("end", () => resolve(res.statusCode)); });
    req.on("error", reject);
    req.setTimeout(10_000, () => req.destroy(new Error("oversized refusal timed out")));
    req.end();
  });
  assert.equal(oversizedStatus, 413);

  await control(["new-bot", "--name", "Attachment fixture"]);
  const { bots } = await fetch(`${url}/api/bots?messages=0`).then((response) => response.json());
  const bot = bots.find((item: { name: string }) => item.name === "Attachment fixture");
  assert.ok(bot);
  const wrapper = join(fixture.info.dataDir, "attachment-claude.mjs");
  const fakeCli = fileURLToPath(new URL("../server/testing/fake-claude-cli.ts", import.meta.url));
  writeFileSync(wrapper, [
    "#!/usr/bin/env node",
    `process.env.FAKE_CLAUDE_REPLIES = ${JSON.stringify(JSON.stringify([`[Download fixture](${saved.path})`]))};`,
    `await import(${JSON.stringify(pathToFileURL(fakeCli).href)});`,
  ].join("\n"), { mode: 0o700 });
  const patched = await fetch(`${url}/api/instances/claude`, {
    method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ cli: wrapper }),
  });
  assert.ok(patched.ok, await patched.text());
  await control(["send", "--bot", bot.id, "--text", "Return the synthetic attachment link."]);
  const settled = await control(["wait", "--bot", bot.id, "--timeout", "30"]);
  const page = await fetch(`${url}/api/threads/${bot.threadId}/messages`).then((response) => response.json());
  const reply = page.messages.findLast((message: { role: string; kind: string; text?: string }) => message.role === "bot" && message.kind === "text" && message.text?.includes(saved.path));
  assert.ok(reply, "fixture reply must reference the uploaded file");
  const download = await fetch(`${url}/api/threads/${bot.threadId}/messages/${reply.id}/file`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ path: saved.path }),
  });
  assert.equal(download.status, 200, download.ok ? undefined : await download.text());
  let downloadedBytes = 0;
  for await (const chunk of download.body!) downloadedBytes += chunk.byteLength;
  assert.equal(downloadedBytes, maxBytes);
  console.log(JSON.stringify({ ...fixture.info, limitBytes: maxBytes, uploadedBytes: saved.bytes, downloadedBytes, oversizedStatus, settled }));
} finally {
  await fixture.close();
}
