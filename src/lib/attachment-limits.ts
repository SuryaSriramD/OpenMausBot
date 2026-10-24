import { DEFAULT_ATTACHMENT_LIMITS, type AttachmentLimits } from "../../shared/attachment-limits.ts";

export let FILE_MAX_BYTES = DEFAULT_ATTACHMENT_LIMITS.fileMaxBytes;

export function setAttachmentLimits(limits: AttachmentLimits | undefined): void {
  const bytes = limits?.fileMaxBytes;
  FILE_MAX_BYTES = typeof bytes === "number" && Number.isSafeInteger(bytes) && bytes >= DEFAULT_ATTACHMENT_LIMITS.imageMaxBytes && bytes <= 512 * 1024 * 1024
    ? bytes
    : DEFAULT_ATTACHMENT_LIMITS.fileMaxBytes;
}
