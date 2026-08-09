import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseFileUpload from "@/components/FileUpload/FileUploadBase";
import {
  DummyButton,
  DummyFormGroup,
  DummyIconButton,
  DummyProgressBar,
} from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const classMap = {
  fileUpload: "fileUpload",
  uploadActions: "uploadActions",
  fileInput: "fileInput",
  hiddenInput: "hiddenInput",
  fileList: "fileList",
  fileListItem: "fileListItem",
  removeButton: "removeButton",
  uploadButton: "uploadButton",
  rejectedFiles: "rejectedFiles",
  rejectedLabel: "rejectedLabel",
  rejectedList: "rejectedList",
  rejectedItem: "rejectedItem",
  rejectedReason: "rejectedReason",
  uploadControls: "uploadControls",
  uploadProgress: "uploadProgress",
  error: "error",
  disabled: "disabled",
  dragging: "dragging",
  roundMedium: "roundMedium",
  shadowLight: "shadowLight",
  primary: "primary",
  glass: "glass",
};

const createFile = (
  name: string,
  type: string,
  size: number,
  content = "file-content",
): File => {
  const file = new File([content], name, { type });
  Object.defineProperty(file, "size", {
    value: size,
    configurable: true,
  });
  return file;
};

const renderFileUpload = (
  props: Partial<React.ComponentProps<typeof BaseFileUpload>> = {},
) => {
  const onSubmit = jest.fn().mockResolvedValue(undefined);

  const result = render(
    <BaseFileUpload
      FormGroup={DummyFormGroup}
      Button={DummyButton}
      IconButton={DummyIconButton}
      ProgressBar={DummyProgressBar}
      classMap={classMap}
      onSubmit={onSubmit}
      data-testid="upload"
      label="Upload a file"
      {...props}
    />,
  );

  return {
    ...result,
    onSubmit,
    input: screen.getByTestId("upload-input") as HTMLInputElement,
    wrapper: screen.getByTestId("upload-wrapper"),
    liveRegion: screen.getByTestId("upload-upload-message"),
    fileButton: screen.getByTestId("upload-file-button"),
  };
};

describe("BaseFileUpload", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("renders with label and input", () => {
    renderFileUpload();

    expect(screen.getByText("Upload a file")).toBeInTheDocument();
    expect(screen.getByTestId("upload-input")).toBeInTheDocument();
    expect(screen.getByTestId("upload-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("upload-file-button")).toBeInTheDocument();
  });

  it("applies default structural classes", () => {
    const { wrapper, input, fileButton } = renderFileUpload({
      variant: "glassOutline",
    });

    expect(wrapper).toHaveClass("fileUpload");
    expect(wrapper).toHaveClass("primary");
    expect(wrapper).toHaveClass("glass");
    expect(wrapper).toHaveClass("roundMedium");
    expect(wrapper).toHaveClass("shadowLight");

    expect(input).toHaveClass("hiddenInput");
    expect(fileButton).toHaveClass("fileInput");
    expect(fileButton).toHaveAttribute("data-glass", "true");
  });

  it("sets accessible wrapper and input attributes including describedby", () => {
    const { wrapper, input } = renderFileUpload({
      helperText: "Only PNG files",
      errorMessage: "A file is required",
    });

    expect(wrapper).toHaveAttribute(
      "aria-describedby",
      "upload-helperText upload-errorMessage",
    );
    expect(wrapper).toHaveAttribute("aria-errormessage", "upload-errorMessage");
    expect(wrapper).toHaveAttribute("aria-invalid", "true");

    expect(input).toHaveAttribute(
      "aria-describedby",
      "upload-helperText upload-errorMessage",
    );
    expect(input).toHaveAttribute("aria-errormessage", "upload-errorMessage");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-describedby when helperText and errorMessage are absent", () => {
    const { wrapper, input } = renderFileUpload();

    expect(wrapper).not.toHaveAttribute("aria-describedby");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("uses the visible label as the input aria-label by default", () => {
    const { input } = renderFileUpload();

    expect(input).toHaveAttribute("aria-label", "Upload a file");
  });

  it("uses inputAriaLabel when provided", () => {
    const { input } = renderFileUpload({
      inputAriaLabel: "Choose a document to upload",
    });

    expect(input).toHaveAttribute("aria-label", "Choose a document to upload");
  });

  it("passes required state to the file input and wrapper", () => {
    const { input, wrapper } = renderFileUpload({ required: true });

    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
    expect(wrapper).toHaveAttribute("aria-required", "true");
  });

  it("sets multiple on the file input when enabled", () => {
    const { input } = renderFileUpload({ multiple: true });

    expect(input).toHaveAttribute("multiple");
  });

  it("applies accept attribute from allowedFileTypes", () => {
    const { input } = renderFileUpload({
      allowedFileTypes: ["image/png", ".pdf"],
    });

    expect(input).toHaveAttribute("accept", "image/png,.pdf");
  });

  it("does not set accept attribute when allowedFileTypes is empty", () => {
    const { input } = renderFileUpload();

    expect(input).not.toHaveAttribute("accept");
  });

  it("shows selected file name and upload controls after file selection", () => {
    const file = createFile("hello.txt", "text/plain", 1000);

    renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(screen.getByText("hello.txt")).toBeInTheDocument();
    expect(screen.getByTestId("upload-controls")).toBeInTheDocument();
    expect(screen.getByTestId("upload-upload-button")).toBeInTheDocument();
  });

  it("updates the file button label to 'Select New' after one file is selected in single mode", () => {
    const file = createFile("hello.txt", "text/plain", 1000);

    renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(screen.getByTestId("upload-file-button")).toHaveTextContent(
      "Select New",
    );
  });

  it("updates the file button label to 'Add Files' after files are selected in multiple mode", () => {
    const file = createFile("hello.txt", "text/plain", 1000);

    renderFileUpload({ multiple: true });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(screen.getByTestId("upload-file-button")).toHaveTextContent(
      "Add Files",
    );
  });

  it("keeps the default file button aria-label before and after selection", () => {
    const file = createFile("hello.txt", "text/plain", 1000);

    renderFileUpload();

    expect(screen.getByTestId("upload-file-button")).toHaveAttribute(
      "aria-label",
      "Choose file",
    );

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(screen.getByTestId("upload-file-button")).toHaveAttribute(
      "aria-label",
      "Choose file",
    );
  });

  it("uses selectButtonAriaLabel when provided", () => {
    renderFileUpload({
      selectButtonAriaLabel: "Select files to attach",
    });

    expect(screen.getByTestId("upload-file-button")).toHaveAttribute(
      "aria-label",
      "Select files to attach",
    );
  });

  it("adds aria-describedby on the select button when files are selected", () => {
    const file = createFile("hello.txt", "text/plain", 1000);

    renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(screen.getByTestId("upload-file-button")).toHaveAttribute(
      "aria-describedby",
      "upload-file-list",
    );
  });

  it("truncates very long file names for display", () => {
    const longName = "this-is-a-very-very-very-long-file-name-example.txt";
    const file = createFile(longName, "text/plain", 1000);

    renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(
      screen.getByText("this-is-a-very-very-very-lo..."),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Remove this-is-a-very-very-very-lo..."),
    ).toBeInTheDocument();
  });

  it("rejects invalid MIME types and displays the reason", () => {
    const file = createFile("bad.exe", "application/x-msdownload", 1000);

    renderFileUpload({
      allowedFileTypes: ["image/png"],
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    const rejectedFiles = screen.getByTestId("upload-rejected-files");

    expect(
      within(rejectedFiles).getByText("Rejected Files:"),
    ).toBeInTheDocument();
    expect(within(rejectedFiles).getByText("bad.exe")).toBeInTheDocument();
    expect(
      within(rejectedFiles).getByText(
        /Invalid type \(application\/x-msdownload\)/,
      ),
    ).toBeInTheDocument();
  });

  it("uses rejectedFilesAriaLabel when provided", () => {
    const file = createFile("bad.exe", "application/x-msdownload", 1000);

    renderFileUpload({
      allowedFileTypes: ["image/png"],
      rejectedFilesAriaLabel: "Files that were rejected",
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(
      screen.getByRole("list", { name: "Files that were rejected" }),
    ).toBeInTheDocument();
  });

  it("accepts files by extension when allowedFileTypes contains extensions", () => {
    const file = createFile("document.PDF", "application/octet-stream", 1000);

    renderFileUpload({
      allowedFileTypes: [".pdf"],
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(screen.getByText("document.PDF")).toBeInTheDocument();
    expect(screen.queryByText("Rejected Files:")).not.toBeInTheDocument();
  });

  it("rejects files that exceed the max size", () => {
    const file = createFile("large.txt", "text/plain", 3 * 1024 * 1024);

    renderFileUpload({
      maxFileSizeBytes: 1024,
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    const rejectedFiles = screen.getByTestId("upload-rejected-files");

    expect(within(rejectedFiles).getByText("large.txt")).toBeInTheDocument();
    expect(
      within(rejectedFiles).getByText(/Exceeds size limit/),
    ).toBeInTheDocument();
  });

  it("replaces files in single mode when a new file is selected", () => {
    const first = createFile("first.txt", "text/plain", 1000);
    const second = createFile("second.txt", "text/plain", 1000);

    renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [first] },
    });

    expect(screen.getByText("first.txt")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [second] },
    });

    expect(screen.queryByText("first.txt")).not.toBeInTheDocument();
    expect(screen.getByText("second.txt")).toBeInTheDocument();
  });

  it("appends files in multiple mode", () => {
    const first = createFile("first.txt", "text/plain", 1000);
    const second = createFile("second.txt", "text/plain", 1000);

    renderFileUpload({ multiple: true });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [first] },
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [second] },
    });

    expect(screen.getByText("first.txt")).toBeInTheDocument();
    expect(screen.getByText("second.txt")).toBeInTheDocument();
  });

  it("calls onFilesChange when files are selected", () => {
    const file = createFile("hello.txt", "text/plain", 1000);
    const onFilesChange = jest.fn();

    renderFileUpload({ onFilesChange });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(onFilesChange).toHaveBeenCalledWith([file]);
  });

  it("clears the native input value after selection", () => {
    const file = createFile("hello.txt", "text/plain", 1000);
    const { input } = renderFileUpload();

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(input.value).toBe("");
  });

  it("removes a selected file when the remove button is clicked", () => {
    const file = createFile("good.txt", "text/plain", 1000);

    renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(screen.getByText("good.txt")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Remove good.txt"));

    expect(screen.queryByText("good.txt")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("upload-upload-button"),
    ).not.toBeInTheDocument();
  });

  it("calls onFilesChange when a file is removed", () => {
    const file = createFile("good.txt", "text/plain", 1000);
    const onFilesChange = jest.fn();

    renderFileUpload({ onFilesChange });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByLabelText("Remove good.txt"));

    expect(onFilesChange).toHaveBeenLastCalledWith([]);
  });

  it("uses custom removeFileAriaLabel when provided", () => {
    const file = createFile("good.txt", "text/plain", 1000);

    renderFileUpload({
      removeFileAriaLabel: (fileName, index) =>
        `Delete file ${index + 1}: ${fileName}`,
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(
      screen.getByLabelText("Delete file 1: good.txt"),
    ).toBeInTheDocument();
  });

  it("disables the upload button when there are no files", () => {
    renderFileUpload();

    expect(
      screen.queryByTestId("upload-upload-button"),
    ).not.toBeInTheDocument();
  });

  it("disables the choose file button and applies disabled class when disabled", () => {
    const { wrapper, fileButton, input } = renderFileUpload({
      disabled: true,
    });

    expect(wrapper).toHaveClass("disabled");
    expect(fileButton).toBeDisabled();
    expect(input).toBeDisabled();
  });

  it("disables the upload button when component is disabled even if files exist", () => {
    const file = createFile("good.txt", "text/plain", 1000);

    renderFileUpload({ disabled: true });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(screen.getByTestId("upload-upload-button")).toBeDisabled();
  });

  it("applies errorMessage class when errorMessage is provided", () => {
    const { wrapper } = renderFileUpload({
      errorMessage: "Something went wrong",
    });

    expect(wrapper).toHaveClass("error");
  });

  it("applies dragging class during drag over and removes it on drag leave", () => {
    const { wrapper } = renderFileUpload();

    fireEvent.dragOver(wrapper);
    expect(wrapper).toHaveClass("dragging");

    fireEvent.dragLeave(wrapper);
    expect(wrapper).not.toHaveClass("dragging");
  });

  it("handles dropping files onto the drop area", () => {
    const file = createFile("dropped.txt", "text/plain", 1000);
    const { wrapper } = renderFileUpload();

    fireEvent.drop(wrapper, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(screen.getByText("dropped.txt")).toBeInTheDocument();
    expect(wrapper).not.toHaveClass("dragging");
  });

  it("does not activate drag state when drag and drop is disabled", () => {
    const { wrapper } = renderFileUpload({
      enableDragAndDrop: false,
    });

    fireEvent.dragOver(wrapper);
    expect(wrapper).not.toHaveClass("dragging");
  });

  it("does nothing when the input change event has no files", () => {
    renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [] },
    });

    expect(screen.queryByTestId("upload-controls")).not.toBeInTheDocument();
  });

  it("does nothing when upload is triggered with no files", async () => {
    const { onSubmit } = renderFileUpload();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with selected files when upload is clicked", async () => {
    const file = createFile("upload.txt", "text/plain", 1000);
    const { onSubmit } = renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByTestId("upload-upload-button"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith([file]);
    });
  });

  it("shows progress bar while uploading and hides upload button temporarily", async () => {
    jest.useFakeTimers();

    const file = createFile("upload.txt", "text/plain", 1000);
    let resolveSubmit: () => void = () => {};

    const onSubmit = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    renderFileUpload({ onSubmit });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByTestId("upload-upload-button"));

    expect(
      screen.queryByTestId("upload-upload-button"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("upload-progress")).toBeInTheDocument();

    await act(async () => {
      resolveSubmit();
    });

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByTestId("upload-upload-button")).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it("clears the delayed upload reset when unmounted", async () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
    const file = createFile("upload.txt", "text/plain", 1000);
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { unmount } = renderFileUpload({ onSubmit });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByTestId("upload-upload-button"));

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByTestId("upload-upload-message")).toHaveTextContent(
      "Upload successful.",
    );
    expect(jest.getTimerCount()).toBeGreaterThan(0);

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("announces selected files in the live region", () => {
    const file = createFile("upload.txt", "text/plain", 1000);

    renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(screen.getByTestId("upload-upload-message")).toHaveTextContent(
      "upload.txt selected.",
    );
  });

  it("announces rejected files in the live region", () => {
    const file = createFile("bad.exe", "application/x-msdownload", 1000);

    renderFileUpload({
      allowedFileTypes: ["image/png"],
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(screen.getByTestId("upload-upload-message")).toHaveTextContent(
      "bad.exe was rejected: Invalid type (application/x-msdownload).",
    );
  });

  it("uses custom selection and rejection messages when provided", () => {
    const valid = createFile("good.png", "image/png", 1000);
    const invalid = createFile("bad.exe", "application/x-msdownload", 1000);

    renderFileUpload({
      multiple: true,
      allowedFileTypes: ["image/png"],
      filesSelectedMessage: (files) => `${files.length} accepted`,
      rejectedFilesMessage: (files) => `${files.length} rejected`,
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [valid, invalid] },
    });

    expect(screen.getByTestId("upload-upload-message")).toHaveTextContent(
      "1 accepted 1 rejected",
    );
  });

  it("announces removed files in the live region", () => {
    const file = createFile("upload.txt", "text/plain", 1000);

    renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByLabelText("Remove upload.txt"));

    expect(screen.getByTestId("upload-upload-message")).toHaveTextContent(
      "upload.txt removed.",
    );
  });

  it("uses custom removed file messages when provided", () => {
    const file = createFile("upload.txt", "text/plain", 1000);

    renderFileUpload({
      fileRemovedMessage: (fileName, index) =>
        `Deleted ${fileName} at ${index}`,
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByLabelText("Remove upload.txt"));

    expect(screen.getByTestId("upload-upload-message")).toHaveTextContent(
      "Deleted upload.txt at 0",
    );
  });

  it("announces successful uploads in the live region", async () => {
    const file = createFile("upload.txt", "text/plain", 1000);

    renderFileUpload();

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByTestId("upload-upload-button"));

    await waitFor(() => {
      expect(screen.getByTestId("upload-upload-message")).toHaveTextContent(
        "Upload successful.",
      );
    });
  });

  it("announces failed uploads in the live region", async () => {
    const file = createFile("upload.txt", "text/plain", 1000);
    const onSubmit = jest.fn().mockRejectedValue(new Error("Upload failed"));

    renderFileUpload({ onSubmit });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByTestId("upload-upload-button"));

    await waitFor(() => {
      expect(screen.getByTestId("upload-upload-message")).toHaveTextContent(
        "Upload failed. Please try again.",
      );
    });
  });

  it("uses custom upload success and failure messages", async () => {
    const file = createFile("upload.txt", "text/plain", 1000);
    const onSubmit = jest.fn().mockRejectedValue(new Error("Nope"));

    renderFileUpload({
      onSubmit,
      successMessage: "Done uploading.",
      failureMessage: "Could not upload.",
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    fireEvent.click(screen.getByTestId("upload-upload-button"));

    await waitFor(() => {
      expect(screen.getByTestId("upload-upload-message")).toHaveTextContent(
        "Could not upload.",
      );
    });
  });

  it("marks the live region as polite and atomic by default", () => {
    const { liveRegion } = renderFileUpload();

    expect(liveRegion).toHaveAttribute("aria-live", "polite");
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");
  });

  it("supports custom live region politeness", () => {
    const { liveRegion } = renderFileUpload({
      liveRegionPoliteness: "assertive",
    });

    expect(liveRegion).toHaveAttribute("aria-live", "assertive");
  });

  it("supports overriding aria-live directly", () => {
    const { liveRegion } = renderFileUpload({
      "aria-live": "off",
    });

    expect(liveRegion).toHaveAttribute("aria-live", "off");
  });

  it("clears dragging state after drop", () => {
    const file = createFile("dropped.txt", "text/plain", 1000);
    const { wrapper } = renderFileUpload();

    fireEvent.dragOver(wrapper);
    expect(wrapper).toHaveClass("dragging");

    fireEvent.drop(wrapper, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(wrapper).not.toHaveClass("dragging");
  });

  it("keeps rejected files separate from accepted files in multiple selection", () => {
    const valid = createFile("good.png", "image/png", 1000);
    const invalid = createFile("bad.exe", "application/x-msdownload", 1000);

    renderFileUpload({
      multiple: true,
      allowedFileTypes: ["image/png"],
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [valid, invalid] },
    });

    expect(screen.getByText("good.png")).toBeInTheDocument();
    expect(screen.getByText("bad.exe")).toBeInTheDocument();

    const rejectedFiles = screen.getByTestId("upload-rejected-files");
    expect(rejectedFiles).toHaveTextContent(
      "Invalid type (application/x-msdownload)",
    );
  });

  it("uses fileListAriaLabel when provided", () => {
    const file = createFile("good.txt", "text/plain", 1000);

    renderFileUpload({
      fileListAriaLabel: "Chosen files",
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    expect(
      screen.getByRole("list", { name: "Chosen files" }),
    ).toBeInTheDocument();
  });

  it("supports dropzone helperText and role", () => {
    const { wrapper } = renderFileUpload({
      dropzoneDescription: "Drop files here or use the select button.",
      dropzoneRole: "region",
    });

    expect(wrapper).toHaveAttribute("role", "region");
    expect(wrapper).toHaveAttribute(
      "aria-describedby",
      "upload-dropzone-helperText",
    );
    expect(
      screen.getByText("Drop files here or use the select button."),
    ).toBeInTheDocument();
  });

  it("passes through wrapper aria props", () => {
    const { wrapper } = renderFileUpload({
      "aria-label": "File uploader region",
      "aria-labelledby": "external-label",
      "aria-describedby": "external-helperText",
      "aria-busy": true,
      className: "customWrapper",
    });

    expect(wrapper).toHaveAttribute("aria-label", "File uploader region");
    expect(wrapper).toHaveAttribute("aria-labelledby", "external-label");
    expect(wrapper).toHaveAttribute("aria-describedby", "external-helperText");
    expect(wrapper).toHaveAttribute("aria-busy", "true");
    expect(wrapper).toHaveClass("customWrapper");
  });

  it("applies custom class names to file upload sections", () => {
    const accepted = createFile("good.txt", "text/plain", 1000);
    const rejected = createFile("bad.exe", "application/x-msdownload", 1000);

    renderFileUpload({
      multiple: true,
      allowedFileTypes: ["text/plain"],
      formGroupClassName: "custom-form-group",
      labelClassName: "custom-label",
      helperText: "Upload text files only",
      descriptionClassName: "custom-helperText",
      dropzoneClassName: "custom-dropzone",
      inputClassName: "custom-input",
      uploadActionsClassName: "custom-upload-actions",
      selectButtonClassName: "custom-select-button",
      rejectedFilesClassName: "custom-rejected-files",
      rejectedLabelClassName: "custom-rejected-label",
      rejectedListClassName: "custom-rejected-list",
      rejectedItemClassName: "custom-rejected-item",
      rejectedReasonClassName: "custom-rejected-reason",
      uploadControlsClassName: "custom-upload-controls",
      fileListClassName: "custom-file-list",
      fileListItemClassName: "custom-file-list-item",
      removeButtonClassName: "custom-remove-button",
      uploadButtonClassName: "custom-upload-button",
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [accepted, rejected] },
    });

    expect(screen.getByTestId("upload")).toHaveClass("custom-form-group");
    expect(screen.getByText("Upload a file")).toHaveClass("custom-label");
    expect(screen.getByText("Upload text files only")).toHaveClass(
      "custom-helperText",
    );
    expect(screen.getByTestId("upload-wrapper")).toHaveClass(
      "fileUpload",
      "custom-dropzone",
    );
    expect(screen.getByTestId("upload-input")).toHaveClass(
      "hiddenInput",
      "custom-input",
    );
    expect(screen.getByTestId("upload-file-button").parentElement).toHaveClass(
      "uploadActions",
      "custom-upload-actions",
    );
    expect(screen.getByTestId("upload-file-button")).toHaveClass(
      "fileInput",
      "custom-select-button",
    );
    expect(screen.getByTestId("upload-rejected-files")).toHaveClass(
      "rejectedFiles",
      "custom-rejected-files",
    );
    expect(screen.getByText("Rejected Files:")).toHaveClass(
      "rejectedLabel",
      "custom-rejected-label",
    );
    expect(screen.getByRole("list", { name: "Rejected files" })).toHaveClass(
      "rejectedList",
      "custom-rejected-list",
    );
    expect(screen.getByText("bad.exe").parentElement).toHaveClass(
      "rejectedItem",
      "custom-rejected-item",
    );
    expect(
      within(screen.getByTestId("upload-rejected-files")).getByText(
        /Invalid type/,
      ),
    ).toHaveClass("rejectedReason", "custom-rejected-reason");
    expect(screen.getByTestId("upload-controls")).toHaveClass(
      "uploadControls",
      "custom-upload-controls",
    );
    expect(screen.getByRole("list", { name: "Selected files" })).toHaveClass(
      "fileList",
      "custom-file-list",
    );
    expect(screen.getByText("good.txt").parentElement).toHaveClass(
      "fileListItem",
      "custom-file-list-item",
    );
    expect(screen.getByLabelText("Remove good.txt")).toHaveClass(
      "removeButton",
      "custom-remove-button",
    );
    expect(screen.getByTestId("upload-upload-button")).toHaveClass(
      "uploadButton",
      "custom-upload-button",
    );
  });

  it("applies custom class names to file upload progress", async () => {
    const file = createFile("upload.txt", "text/plain", 1000);
    let resolveSubmit: () => void = () => {};
    const onSubmit = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    renderFileUpload({
      onSubmit,
      uploadProgressClassName: "custom-progress",
    });

    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByTestId("upload-upload-button"));

    expect(screen.getByTestId("upload-progress")).toHaveClass(
      "uploadProgress",
      "custom-progress",
    );

    await act(async () => {
      resolveSubmit();
    });
  });

  it("applies custom class names to file upload form errors", () => {
    renderFileUpload({
      errorMessage: "A file is required",
      errorMessageClassName: "custom-errorMessage-message",
    });

    expect(screen.getByText("A file is required")).toHaveClass(
      "custom-errorMessage-message",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = renderFileUpload({
      helperText: "Drag and drop your file",
      dropzoneDescription: "You can also browse to select a file.",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
