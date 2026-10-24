import { DEFAULT_ATTACHMENT_LIMITS, type AttachmentLimits } from "../shared/attachment-limits.ts";

export function parseAttachmentLimits(value: string | undefined): Readonly<AttachmentLimits> {
  if (value === undefined) return DEFAULT_ATTACHMENT_LIMITS;
  const megabytes = Number(value);
  if (!/^\d+$/.test(value.trim()) || !Number.isSafeInteger(megabytes) || megabytes < 10 || megabytes > 512) {
    throw new Error("OMB_ATTACHMENT_MAX_MB must be an integer from 10 to 512 (MiB)");
  }
  return Object.freeze({ ...DEFAULT_ATTACHMENT_LIMITS, fileMaxBytes: megabytes * 1024 * 1024 });
}

export const ATTACHMENT_LIMITS = parseAttachmentLimits(process.env.OMB_ATTACHMENT_MAX_MB);
