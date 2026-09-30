import { validateFiles } from "@/components/FileUpload/fileValidation";

const createFile = (name: string, type: string, size: number): File => {
  const file = new File(["content"], name, { type });
  Object.defineProperty(file, "size", {
    value: size,
    configurable: true,
  });
  return file;
};

const validate = (
  files: File[],
  allowedFileTypes: string[] = [],
  maxFileSizeBytes = Infinity,
) => validateFiles(files, { allowedFileTypes, maxFileSizeBytes });

describe("FileUpload file validation", () => {
  it("accepts files when no type or size constraints reject them", () => {
    const file = createFile("notes.txt", "text/plain", 512);

    expect(validate([file])).toEqual({ valid: [file], rejected: [] });
  });

  it("matches exact MIME types without making MIME comparison case-insensitive", () => {
    const matching = createFile("image.bin", "image/png", 512);
    const mismatching = createFile("other.bin", "image/png", 512);

    expect(validate([matching], ["image/png"]).valid).toEqual([matching]);
    expect(validate([mismatching], ["IMAGE/PNG"]).rejected).toEqual([
      { name: "other.bin", reason: "Invalid type (image/png)" },
    ]);
  });

  it("matches filename extensions case-insensitively", () => {
    const file = createFile("document.PDF", "application/octet-stream", 512);

    expect(validate([file], [".pDf"]).valid).toEqual([file]);
  });

  it("does not expand MIME wildcards or comma-delimited accept entries", () => {
    const image = createFile("image.bin", "image/png", 512);
    const document = createFile("document.pdf", "application/pdf", 512);

    expect(validate([image], ["image/*"]).rejected).toHaveLength(1);
    expect(validate([document], ["image/png,.pdf"]).rejected).toHaveLength(1);
  });

  it.each([
    ["below", 1023, true],
    ["equal", 1024, true],
    ["above", 1025, false],
  ])("handles a file %s the maximum size", (_label, size, accepted) => {
    const file = createFile(`${size}.txt`, "text/plain", size as number);
    const result = validate([file], [], 1024);

    expect(result.valid).toHaveLength(accepted ? 1 : 0);
    expect(result.rejected).toHaveLength(accepted ? 0 : 1);
  });

  it("returns all per-file outcomes in their original order", () => {
    const firstValid = createFile("first.png", "image/png", 512);
    const invalidType = createFile("second.txt", "text/plain", 512);
    const oversized = createFile("third.png", "image/png", 2048);
    const secondValid = createFile("fourth.PNG", "application/octet-stream", 512);

    expect(
      validate(
        [firstValid, invalidType, oversized, secondValid],
        ["image/png", ".png"],
        1024,
      ),
    ).toEqual({
      valid: [firstValid, secondValid],
      rejected: [
        { name: "second.txt", reason: "Invalid type (text/plain)" },
        { name: "third.png", reason: "Exceeds size limit (0.00MB)" },
      ],
    });
  });

  it("uses the size reason first when a file fails both constraints", () => {
    const file = createFile("bad.exe", "application/x-msdownload", 2048);

    expect(validate([file], ["image/png"], 1024).rejected).toEqual([
      { name: "bad.exe", reason: "Exceeds size limit (0.00MB)" },
    ]);
  });

  it("preserves duplicate file entries", () => {
    const file = createFile("duplicate.txt", "text/plain", 512);

    expect(validate([file, file]).valid).toEqual([file, file]);
  });

  it("reports an unknown invalid type when MIME and extension are absent", () => {
    const file = createFile("README", "", 512);

    expect(validate([file], ["image/png"]).rejected).toEqual([
      { name: "README", reason: "Invalid type (unknown)" },
    ]);
  });
});
