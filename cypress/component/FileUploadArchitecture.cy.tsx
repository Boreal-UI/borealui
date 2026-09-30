import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type Library = Pick<typeof Core, "FileUpload">;

const libraries: Array<[string, Library]> = [
  ["core", Core],
  ["next", Next],
];

const textFile = (fileName: string, contents = "hello") => ({
  contents: Cypress.Buffer.from(contents),
  fileName,
  mimeType: "text/plain",
});

libraries.forEach(([flavor, { FileUpload }]) => {
  describe(`${flavor} FileUpload browser behavior`, () => {
    it("selects, removes, and reselects a native file", () => {
      const onFilesChange = cy.stub().as(`${flavor}FilesChanged`);

      cy.mount(
        <FileUpload
          label="Upload document"
          onFilesChange={onFilesChange}
          onSubmit={() => undefined}
          testId="architecture-upload"
        />,
      );

      cy.get('[data-testid="architecture-upload-input"]').selectFile(
        textFile("notes.txt"),
        { force: true },
      );
      cy.contains("notes.txt").should("be.visible");
      cy.get(`@${flavor}FilesChanged`).should("have.been.calledOnce");

      cy.get('[data-testid="architecture-upload-remove-0"]')
        .focus()
        .should("have.focus")
        .click();
      cy.get('[aria-label="Selected files"]').should("not.exist");

      cy.get('[data-testid="architecture-upload-input"]').selectFile(
        textFile("notes.txt"),
        { force: true },
      );
      cy.contains("notes.txt").should("be.visible");
      cy.get(`@${flavor}FilesChanged`).should("have.been.calledThrice");
    });

    it("preserves mixed multiple-file validation outcomes", () => {
      cy.mount(
        <FileUpload
          label="Upload images"
          multiple
          allowedFileTypes={["image/png"]}
          onSubmit={() => undefined}
          testId="architecture-upload"
        />,
      );

      cy.get('[data-testid="architecture-upload-input"]').selectFile(
        [
          {
            contents: Cypress.Buffer.from("image"),
            fileName: "valid.png",
            mimeType: "image/png",
          },
          textFile("invalid.txt"),
        ],
        { force: true },
      );

      cy.get('[aria-label="Selected files"]')
        .should("contain.text", "valid.png")
        .and("not.contain.text", "invalid.txt");
      cy.get('[data-testid="architecture-upload-rejected-files"]')
        .should("contain.text", "invalid.txt")
        .and("contain.text", "Invalid type (text/plain)");
    });

    it("handles files through the browser drag-and-drop path", () => {
      cy.mount(
        <FileUpload
          label="Drop document"
          onSubmit={() => undefined}
          testId="architecture-upload"
        />,
      );

      cy.get('[data-testid="architecture-upload-wrapper"]').selectFile(
        textFile("dropped.txt"),
        { action: "drag-drop" },
      );

      cy.contains("dropped.txt").should("be.visible");
    });

    it("keeps disabled native and keyboard-facing controls inactive", () => {
      cy.mount(
        <FileUpload
          label="Disabled upload"
          disabled
          onSubmit={() => undefined}
          testId="architecture-upload"
        />,
      );

      cy.get('[data-testid="architecture-upload-input"]').should("be.disabled");
      cy.get('[data-testid="architecture-upload-file-button"]').should(
        "be.disabled",
      );
      cy.get('[data-testid="architecture-upload-wrapper"]').selectFile(
        textFile("ignored.txt"),
        { action: "drag-drop" },
      );
      cy.contains("ignored.txt").should("not.exist");
    });
  });
});
