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
 * This intentionally mirrors the component's established accept semantics:
 * exact MIME strings and case-insensitive filename extensions are supported.
 * MIME wildcards and comma-delimited entries are not expanded here.
 */
export function validateFiles(
  files: readonly File[],
  { allowedFileTypes, maxFileSizeBytes }: FileValidationConstraints,
): FileValidationResult {
  const valid: File[] = [];
  const rejected: RejectedFile[] = [];
  const exactAllowedTypes = new Set(allowedFileTypes);
  const normalizedAllowedTypes = new Set(
    allowedFileTypes.map((type) => type.toLowerCase()),
  );

  files.forEach((file) => {
    const isSizeOk = file.size <= maxFileSizeBytes;
    const extension = file.name.includes(".")
      ? `.${file.name.split(".").pop()!.toLowerCase()}`
      : "";
    const typeAllowed =
      allowedFileTypes.length === 0 ||
      exactAllowedTypes.has(file.type) ||
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
