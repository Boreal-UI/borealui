import React from "react";
import { renderToString } from "react-dom/server";
import * as Core from "@/index.core";
import * as Next from "@/index.next";

describe.each([
  ["core", Core.FileUpload],
  ["next", Next.FileUpload],
] as const)("%s FileUpload SSR", (_flavor, FileUpload) => {
  it("renders without browser globals", () => {
    expect(() =>
      renderToString(
        <FileUpload
          label="Upload document"
          allowedFileTypes={["image/png", ".pdf"]}
          onSubmit={() => undefined}
          testId="ssr-file-upload"
        />,
      ),
    ).not.toThrow();
  });
});
