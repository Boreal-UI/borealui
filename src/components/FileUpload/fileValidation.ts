export interface RejectedFile {
  name: string;
  reason: string;
}

export interface FileValidationConstraints {
  allowedFileTypes: readonly string[];
  maxFileSizeBytes: number;
}

export interface FileValidationResult {
  valid: File[];
  rejected: RejectedFile[];
}

/**
 * Applies FileUpload's synchronous, per-file validation contract.
 *
 * Accepts MIME types, image/audio/video wildcards and filename extensions.
 * File metadata is not a substitute for server-side content validation.
 */
export function validateFiles(
  files: readonly File[],
  { allowedFileTypes, maxFileSizeBytes }: FileValidationConstraints,
): FileValidationResult {
  const valid: File[] = [];
  const rejected: RejectedFile[] = [];
  const normalizedAllowedTypes = new Set(
    allowedFileTypes.flatMap((type) => type.split(",").map(token => token.trim().toLowerCase())),
  );

  files.forEach((file) => {
    const isSizeOk = file.size <= maxFileSizeBytes;
    const extension = file.name.includes(".")
      ? `.${file.name.split(".").pop()!.toLowerCase()}`
      : "";
    const typeAllowed =
      allowedFileTypes.length === 0 ||
      normalizedAllowedTypes.has(file.type.toLowerCase()) ||
      (["image", "audio", "video"].some(type =>
        normalizedAllowedTypes.has(`${type}/*`) && file.type.toLowerCase().startsWith(`${type}/`))) ||
      (extension !== "" && normalizedAllowedTypes.has(extension));

    if (isSizeOk && typeAllowed) {
      valid.push(file);
      return;
    }

    rejected.push({
      name: file.name,
      reason: !isSizeOk
        ? `Exceeds size limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`
        : `Invalid type (${file.type || extension || "unknown"})`,
    });
  });

  return { valid, rejected };
}
