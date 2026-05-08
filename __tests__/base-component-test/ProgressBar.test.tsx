import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseProgressBar from "@/components/ProgressBar/ProgressBarBase";

expect.extend(toHaveNoViolations);

const classNames = {
  layout: "progressLayout",
  container: "progressContainer",
  bar: "progressBar",
  glass: "glass",
  glassBar: "glassBar",
  label: "progressLabel",

  primary: "themePrimary",
  secondary: "themeSecondary",
  success: "stateSuccess",
  error: "stateError",
  warning: "stateWarning",

  small: "sizeSmall",
  medium: "sizeMedium",
  large: "sizeLarge",

  animated: "animated",
  indeterminate: "indeterminate",

  roundNone: "roundNone",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  roundFull: "roundFull",

  shadowNone: "shadowNone",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  shadowIntense: "shadowIntense",

  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
};

describe("BaseProgressBar", () => {
  it("renders a determinate progress bar with correct default accessible attributes", () => {
    render(
      <BaseProgressBar
        value={70}
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar", { name: /progress/i });
    const bar = screen.getByTestId("progressbar-bar");

    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "70");
    expect(progressbar).toHaveAttribute("aria-valuetext", "70% complete");
    expect(progressbar).not.toHaveAttribute("aria-busy");

    expect(bar).toHaveStyle({ width: "70%" });
  });

  it("clamps values below 0 to 0", () => {
    render(
      <BaseProgressBar
        value={-25}
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar");
    const bar = screen.getByTestId("progressbar-bar");

    expect(progressbar).toHaveAttribute("aria-valuenow", "0");
    expect(progressbar).toHaveAttribute("aria-valuetext", "0% complete");
    expect(bar).toHaveStyle({ width: "0%" });
  });

  it("clamps values above 100 to 100", () => {
    render(
      <BaseProgressBar
        value={125}
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar");
    const bar = screen.getByTestId("progressbar-bar");

    expect(progressbar).toHaveAttribute("aria-valuenow", "100");
    expect(progressbar).toHaveAttribute("aria-valuetext", "100% complete");
    expect(bar).toHaveStyle({ width: "100%" });
  });

  it("rounds decimal values for aria-valuenow and width", () => {
    render(
      <BaseProgressBar
        value={42.6}
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar");
    const bar = screen.getByTestId("progressbar-bar");

    expect(progressbar).toHaveAttribute("aria-valuenow", "43");
    expect(progressbar).toHaveAttribute("aria-valuetext", "43% complete");
    expect(bar).toHaveStyle({ width: "43%" });
  });

  it("falls back to 0 when value is not a finite number", () => {
    render(
      <BaseProgressBar
        value={Number.NaN}
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar");
    const bar = screen.getByTestId("progressbar-bar");

    expect(progressbar).toHaveAttribute("aria-valuenow", "0");
    expect(progressbar).toHaveAttribute("aria-valuetext", "0% complete");
    expect(bar).toHaveStyle({ width: "0%" });
  });

  it("renders indeterminate progress correctly", () => {
    render(
      <BaseProgressBar
        indeterminate
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar");
    const bar = screen.getByTestId("progressbar-bar");

    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).not.toHaveAttribute("aria-valuenow");
    expect(progressbar).toHaveAttribute("aria-valuetext", "Loading");
    expect(progressbar).toHaveAttribute("aria-busy", "true");
    expect(bar).not.toHaveStyle("width: 0%");
  });

  it("applies custom aria-label when provided", () => {
    render(
      <BaseProgressBar
        value={35}
        aria-label="Upload progress"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    expect(
      screen.getByRole("progressbar", { name: /upload progress/i }),
    ).toBeInTheDocument();
  });

  it("uses a visible label as the accessible name through aria-labelledby", () => {
    render(
      <BaseProgressBar
        value={55}
        label="File upload"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar", {
      name: /file upload/i,
    });
    const label = screen.getByTestId("progressbar-label");

    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("File upload");
    expect(label).toHaveAttribute("id", "progressbar-label");
    expect(progressbar).toHaveAttribute("aria-labelledby", "progressbar-label");
    expect(progressbar).not.toHaveAttribute("aria-label", "Progress");
  });

  it("uses a custom labelId when provided", () => {
    render(
      <BaseProgressBar
        value={60}
        label="Processing"
        labelId="custom-progress-label"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar", {
      name: /processing/i,
    });
    const label = screen.getByTestId("progressbar-label");

    expect(label).toHaveAttribute("id", "custom-progress-label");
    expect(progressbar).toHaveAttribute(
      "aria-labelledby",
      "custom-progress-label",
    );
  });

  it("applies aria-describedby from rendered description", () => {
    render(
      <BaseProgressBar
        value={45}
        description="Uploading 2 of 4 files"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar");
    const description = screen.getByTestId("progressbar-description");

    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent("Uploading 2 of 4 files");
    expect(description).toHaveAttribute("id", "progressbar-description");
    expect(progressbar).toHaveAttribute(
      "aria-describedby",
      "progressbar-description",
    );
  });

  it("uses a custom descriptionId when provided", () => {
    render(
      <BaseProgressBar
        value={45}
        description="Transferring data"
        descriptionId="custom-progress-description"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar");
    const description = screen.getByTestId("progressbar-description");

    expect(description).toHaveAttribute("id", "custom-progress-description");
    expect(progressbar).toHaveAttribute(
      "aria-describedby",
      "custom-progress-description",
    );
  });

  it("prefers an explicit aria-labelledby over generated label linkage", () => {
    render(
      <div>
        <span id="external-label">External Progress Label</span>
        <BaseProgressBar
          value={80}
          label="Internal Label"
          aria-labelledby="external-label"
          classMap={classNames}
          data-testid="progressbar"
        />
      </div>,
    );

    const progressbar = screen.getByRole("progressbar", {
      name: /external progress label/i,
    });

    expect(progressbar).toHaveAttribute("aria-labelledby", "external-label");
  });

  it("prefers an explicit aria-describedby over generated description linkage", () => {
    render(
      <div>
        <span id="external-description">External description text</span>
        <BaseProgressBar
          value={80}
          description="Internal description"
          aria-describedby="external-description"
          classMap={classNames}
          data-testid="progressbar"
        />
      </div>,
    );

    const progressbar = screen.getByRole("progressbar");

    expect(progressbar).toHaveAttribute(
      "aria-describedby",
      "external-description",
    );
  });

  it("uses a custom aria-valuetext when provided", () => {
    render(
      <BaseProgressBar
        value={65}
        aria-valuetext="Uploading 3 of 5 files"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute(
      "aria-valuetext",
      "Uploading 3 of 5 files",
    );
  });

  it("renders the label before the progress bar when labelPosition is top", () => {
    render(
      <BaseProgressBar
        value={30}
        label="Top Label"
        labelPosition="top"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const label = screen.getByTestId("progressbar-label");
    const progressbar = screen.getByTestId("progressbar");

    expect(label.compareDocumentPosition(progressbar)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the label after the progress bar when labelPosition is bottom", () => {
    render(
      <BaseProgressBar
        value={30}
        label="Bottom Label"
        labelPosition="bottom"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const label = screen.getByTestId("progressbar-label");
    const progressbar = screen.getByTestId("progressbar");

    expect(progressbar.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the label before the progress bar when labelPosition is left", () => {
    render(
      <BaseProgressBar
        value={30}
        label="Left Label"
        labelPosition="left"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const label = screen.getByTestId("progressbar-label");
    const progressbar = screen.getByTestId("progressbar");

    expect(label.compareDocumentPosition(progressbar)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the label after the progress bar when labelPosition is right", () => {
    render(
      <BaseProgressBar
        value={30}
        label="Right Label"
        labelPosition="right"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const label = screen.getByTestId("progressbar-label");
    const progressbar = screen.getByTestId("progressbar");

    expect(progressbar.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("applies expected theme, state, size, rounding, shadow, glass, and custom classes", () => {
    render(
      <BaseProgressBar
        value={75}
        theme="secondary"
        state="success"
        size="large"
        rounding="full"
        shadow="strong"
        glass
        className="custom-progress"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const progressbar = screen.getByTestId("progressbar");
    const bar = screen.getByTestId("progressbar-bar");

    expect(progressbar).toHaveClass(
      "progressContainer",
      "sizeLarge",
      "themeSecondary",
      "stateSuccess",
      "glass",
      "shadowStrong",
      "roundFull",
      "custom-progress",
    );

    expect(bar).toHaveClass(
      "progressBar",
      "themeSecondary",
      "stateSuccess",
      "glassBar",
      "animated",
      "roundFull",
    );
  });

  it("applies the indeterminate class to the inner bar when indeterminate", () => {
    render(
      <BaseProgressBar
        indeterminate
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const bar = screen.getByTestId("progressbar-bar");
    expect(bar).toHaveClass("indeterminate");
  });

  it("does not apply the animated class when animated is false", () => {
    render(
      <BaseProgressBar
        value={40}
        animated={false}
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const bar = screen.getByTestId("progressbar-bar");
    expect(bar).not.toHaveClass("animated");
  });

  it("renders without label or description when not provided", () => {
    render(
      <BaseProgressBar
        value={20}
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    expect(screen.queryByTestId("progressbar-label")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("progressbar-description"),
    ).not.toBeInTheDocument();
  });

  it("uses the provided data-testid values", () => {
    render(
      <BaseProgressBar
        value={50}
        label="Testing"
        description="Description text"
        classMap={classNames}
        data-testid="upload-progress"
      />,
    );

    expect(screen.getByTestId("upload-progress")).toBeInTheDocument();
    expect(screen.getByTestId("upload-progress-bar")).toBeInTheDocument();
    expect(screen.getByTestId("upload-progress-label")).toBeInTheDocument();
    expect(
      screen.getByTestId("upload-progress-description"),
    ).toBeInTheDocument();
  });

  it("is accessible in determinate mode", async () => {
    const { container } = render(
      <BaseProgressBar
        value={50}
        label="Upload progress"
        description="Uploading 1 of 2 files"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("is accessible in indeterminate mode", async () => {
    const { container } = render(
      <BaseProgressBar
        indeterminate
        aria-label="Loading progress"
        classMap={classNames}
        data-testid="progressbar"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
