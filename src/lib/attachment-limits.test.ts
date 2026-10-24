import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ATTACHMENT_LIMITS } from "../../shared/attachment-limits.ts";
import { FILE_MAX_BYTES, setAttachmentLimits } from "./attachment-limits.ts";
import { fileAttachmentFromFile } from "./composer-attachments.ts";

afterEach(() => {
  setAttachmentLimits(undefined);
  vi.restoreAllMocks();
});

describe("server attachment limits", () => {
  it("accepts files above the old limit and rejects those above the advertised limit before upload", async () => {
    setAttachmentLimits({ ...DEFAULT_ATTACHMENT_LIMITS, fileMaxBytes: 250 * 1024 * 1024 });
    const file = new File(["fixture"], "report.pdf", { type: "application/pdf" });
    Object.defineProperty(file, "size", { value: 250 * 1024 * 1024, configurable: true });
    const fetcher = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      path: "/attachments/report.pdf", name: file.name, bytes: file.size,
    }), { status: 201 }));
    await expect(fileAttachmentFromFile(file)).resolves.toMatchObject({ size: file.size });
    expect(fetcher).toHaveBeenCalledTimes(1);
    fetcher.mockClear();
    Object.defineProperty(file, "size", { value: file.size + 1 });
    await expect(fileAttachmentFromFile(file)).rejects.toThrow("exceeds 250 MB");
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("returns to the default when reconnecting to an older server", () => {
    setAttachmentLimits({ ...DEFAULT_ATTACHMENT_LIMITS, fileMaxBytes: 250 * 1024 * 1024 });
    setAttachmentLimits(undefined);
    expect(FILE_MAX_BYTES).toBe(DEFAULT_ATTACHMENT_LIMITS.fileMaxBytes);
  });

  it.each([0, -1, NaN, Infinity, 1.5, 9 * 1024 * 1024, 513 * 1024 * 1024])("does not accept an invalid server limit %s", (fileMaxBytes) => {
    setAttachmentLimits({ ...DEFAULT_ATTACHMENT_LIMITS, fileMaxBytes });
    expect(FILE_MAX_BYTES).toBe(DEFAULT_ATTACHMENT_LIMITS.fileMaxBytes);
  });
});
