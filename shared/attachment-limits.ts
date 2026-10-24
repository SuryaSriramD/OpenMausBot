export interface AttachmentLimits {
  fileMaxBytes: number;
  imageMaxBytes: number;
}

export const DEFAULT_ATTACHMENT_LIMITS: Readonly<AttachmentLimits> = Object.freeze({
  fileMaxBytes: 25 * 1024 * 1024,
  imageMaxBytes: 10 * 1024 * 1024,
});
