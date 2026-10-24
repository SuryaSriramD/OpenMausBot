import { mkdtempSync, rmSync, statSync, truncateSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_ATTACHMENT_LIMITS } from "../shared/attachment-limits.ts";
import { parseAttachmentLimits } from "./attachment-limits.ts";

const MIB = 1024 * 1024;

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("attachment limit configuration", () => {
  it("preserves the default when the environment variable is absent", () => {
    expect(parseAttachmentLimits(undefined)).toEqual(DEFAULT_ATTACHMENT_LIMITS);
  });

  it.each([10, 25, 250, 512])("accepts %i MiB without increasing the image cap", (megabytes) => {
    expect(parseAttachmentLimits(String(megabytes))).toEqual({
      fileMaxBytes: megabytes * MIB,
      imageMaxBytes: 10 * MIB,
    });
  });

  it.each(["", " ", "0", "-1", "1", "9", "513", "250.5", "1e2", "0x100", "NaN", "Infinity", "250MB"])(
    "rejects invalid explicit value %j",
    (value) => {
      expect(() => parseAttachmentLimits(value)).toThrow("OMB_ATTACHMENT_MAX_MB must be an integer from 10 to 512");
    },
  );

  it("accepts and serves files above the old cap while enforcing the configured boundary", async () => {
    const root = mkdtempSync(join(tmpdir(), "omb-configured-attachments-"));
    vi.stubEnv("OMB_DATA_DIR", root);
    vi.stubEnv("OMB_ATTACHMENT_MAX_MB", "250");
    vi.resetModules();
    try {
      const attachments = await import("./attachments.ts");
      const messages = await import("./message-file.ts");
      const catalog = await import("./drivers/agents-catalog.ts");
      const { saveBotAttachment } = await import("./bot-attachment.ts");
      const expectedBytes = 26 * MIB;
      async function* chunks() {
        const chunk = Buffer.alloc(MIB);
        for (let index = 0; index < 26; index++) yield chunk;
      }
      const saved = await attachments.saveFile(chunks(), "large.pdf", "application/pdf", { expectedBytes });
      expect(statSync(saved.path).size).toBe(expectedBytes);
      const botCopy = await saveBotAttachment({ path: saved.path, roots: [attachments.ATTACHMENTS_DIR], name: "bot-report.pdf" });
      expect(botCopy.bytes).toBe(expectedBytes);
      expect(botCopy.attachment).toMatchObject({ kind: "file", name: "bot-report.pdf" });
      expect(statSync(botCopy.attachment.path).size).toBe(expectedBytes);
      expect(attachments.IMAGE_MAX_BYTES).toBe(10 * MIB);
      expect(attachments.ATTACHMENTS_MAX_BYTES).toBe(512 * MIB);
      const opened = await messages.openMessageFile(saved.path, [attachments.ATTACHMENTS_DIR]);
      try {
        expect(opened.bytes).toBe(expectedBytes);
      } finally {
        await opened.handle.close();
      }
      const boundary = join(root, "boundary.pdf");
      writeFileSync(boundary, "");
      truncateSync(boundary, 250 * MIB);
      const atLimit = await messages.openMessageFile(boundary, [root]);
      await atLimit.handle.close();
      truncateSync(boundary, 250 * MIB + 1);
      await expect(messages.openMessageFile(boundary, [root])).rejects.toMatchObject({ status: 413 });
      await expect(attachments.saveFile(chunks(), "too-large.pdf", "application/pdf", {
        expectedBytes: 250 * MIB + 1,
      })).rejects.toMatchObject({ status: 413 });
      const tool = catalog.availableTools(catalog.catalogProfileFromEnv({})).find((entry) => entry.name === "attach_file");
      expect(tool?.description).toContain("Up to 250 MB (images 10 MB)");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("enforces a configured cap on an upload without a declared length", async () => {
    const root = mkdtempSync(join(tmpdir(), "omb-small-attachments-"));
    vi.stubEnv("OMB_DATA_DIR", root);
    vi.stubEnv("OMB_ATTACHMENT_MAX_MB", "10");
    vi.resetModules();
    try {
      const { saveFile } = await import("./attachments.ts");
      async function* chunks() {
        yield Buffer.alloc(10 * MIB);
        yield Buffer.alloc(1);
      }
      await expect(saveFile(chunks(), "too-large.pdf", "application/pdf"))
        .rejects.toMatchObject({ status: 413 });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
