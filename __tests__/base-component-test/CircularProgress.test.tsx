import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom";
import CircularProgressBase from "@/components/CircularProgress/CircularProgressBase";

expect.extend(toHaveNoViolations);

const classMap = {
  circular_progress: "circularProgress",
  circle_border: "circleBorder",
  inner_circle: "innerCircle",
  value_text: "valueText",

  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",
  clear: "clear",

  success: "success",
  warning: "warning",
  error: "error",
  disabled: "disabled",

  xs: "xs",
  small: "small",
  medium: "medium",
  large: "large",
  xl: "xl",

  shadowNone: "shadowNone",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  shadowIntense: "shadowIntense",

  state_success: "stateSuccess",
  state_warning: "stateWarning",
  state_error: "stateError",
  state_disabled: "stateDisabled",
  glass: "glass",
};

describe("CircularProgressBase", () => {
  const getValueText = () => {
    const valueText = screen
      .getByTestId("circular-progress")
      .querySelector(".valueText");

    expect(valueText).toBeInTheDocument();

    return valueText as HTMLElement;
  };

  const renderProgress = (
    props: Partial<React.ComponentProps<typeof CircularProgressBase>> = {},
  ) =>
    render(
      <CircularProgressBase
        value={50}
        classMap={classMap}
        data-testid="circular-progress"
        {...props}
      />,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with default test id", () => {
    render(<CircularProgressBase value={50} classMap={classMap} />);

    expect(screen.getByTestId("circular-progress")).toBeInTheDocument();
  });

  it("renders the correct percent with showRaw=false", () => {
    renderProgress({
      value: 50,
      max: 100,
      showRaw: false,
    });

    const progressbar = screen.getByRole("progressbar");

    expect(progressbar).toHaveAttribute("aria-valuenow", "50");
    expect(progressbar).toHaveAttribute("aria-valuetext", "50%");
    expect(getValueText()).toHaveTextContent("50%");
  });

  it("renders the correct raw format when showRaw=true", () => {
    renderProgress({
      value: 30,
      max: 120,
      showRaw: true,
    });

    const progressbar = screen.getByRole("progressbar");

    expect(progressbar).toHaveAttribute("aria-valuenow", "30");
    expect(progressbar).toHaveAttribute("aria-valuetext", "30 out of 120");
    expect(screen.getByText("30/120")).toBeInTheDocument();
  });

  it("shows units beside raw values", () => {
    renderProgress({
      value: 30,
      max: 120,
      showRaw: true,
      units: "MB",
    });

    const progressbar = screen.getByRole("progressbar");

    expect(progressbar).toHaveAttribute("aria-valuetext", "30 out of 120 MB");
    expect(getValueText()).toHaveTextContent(/30\/120\s*MB/);
  });

  it("uses label as the default accessible name when aria props are not provided", () => {
    renderProgress({
      value: 80,
      label: "Loading Progress",
    });

    const progressbar = screen.getByRole("progressbar", {
      name: /loading progress/i,
    });

    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-valuenow", "80");
    expect(progressbar).toHaveAttribute("aria-valuetext", "80%");
    expect(progressbar).toHaveAttribute("aria-label", "Loading Progress");
  });

  it("uses the default aria-label when label is not provided", () => {
    renderProgress({ value: 40 });

    const progressbar = screen.getByRole("progressbar", {
      name: /progress/i,
    });

    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute("aria-label", "Progress");
  });

  it("prefers aria-label over label when both are provided", () => {
    renderProgress({
      value: 55,
      label: "Visible fallback label",
      "aria-label": "Explicit progress label",
    });

    const progressbar = screen.getByRole("progressbar", {
      name: "Explicit progress label",
    });

    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute(
      "aria-label",
      "Explicit progress label",
    );
  });

  it("prefers aria-labelledby over aria-label and label", () => {
    render(
      <>
        <span id="external-progress-label">External progress label</span>
        <CircularProgressBase
          value={60}
          label="Fallback label"
          aria-label="Explicit label"
          aria-labelledby="external-progress-label"
          classMap={classMap}
          data-testid="circular-progress"
        />
      </>,
    );

    const progressbar = screen.getByRole("progressbar", {
      name: "External progress label",
    });

    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute(
      "aria-labelledby",
      "external-progress-label",
    );
    expect(progressbar).not.toHaveAttribute("aria-label", "Explicit label");
  });

  it("applies aria-describedby when provided", () => {
    render(
      <>
        <p id="progress-description">Upload is currently in progress.</p>
        <CircularProgressBase
          value={35}
          aria-label="Upload progress"
          aria-describedby="progress-description"
          classMap={classMap}
          data-testid="circular-progress"
        />
      </>,
    );

    const progressbar = screen.getByRole("progressbar", {
      name: "Upload progress",
    });

    expect(progressbar).toHaveAttribute(
      "aria-describedby",
      "progress-description",
    );
  });

  it("uses ariaValueText when provided", () => {
    renderProgress({
      value: 3,
      min: 0,
      max: 5,
      showRaw: true,
      ariaValueText: "3 out of 5 steps completed",
      "aria-label": "Setup progress",
    });

    const progressbar = screen.getByRole("progressbar", {
      name: "Setup progress",
    });

    expect(progressbar).toHaveAttribute(
      "aria-valuetext",
      "3 out of 5 steps completed",
    );
    expect(screen.getByText("3/5")).toBeInTheDocument();
  });

  it("clamps value above max", () => {
    renderProgress({
      value: 150,
      min: 0,
      max: 100,
    });

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "100");
    expect(progressbar).toHaveAttribute("aria-valuetext", "100%");
    expect(getValueText()).toHaveTextContent("100%");
  });

  it("clamps value below min", () => {
    renderProgress({
      value: -10,
      min: 0,
      max: 100,
    });

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "0");
    expect(progressbar).toHaveAttribute("aria-valuetext", "0%");
    expect(getValueText()).toHaveTextContent("0%");
  });

  it("calculates percent correctly with a non-zero min", () => {
    renderProgress({
      value: 75,
      min: 50,
      max: 100,
      showRaw: false,
    });

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "75");
    expect(progressbar).toHaveAttribute("aria-valuetext", "50%");
    expect(getValueText()).toHaveTextContent("50%");
  });

  it("renders 0 percent when max equals min", () => {
    renderProgress({
      value: 50,
      min: 50,
      max: 50,
    });

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "50");
    expect(progressbar).toHaveAttribute("aria-valuetext", "0%");
    expect(getValueText()).toHaveTextContent("0%");
  });

  it("applies theme, size, shadow, and custom className", () => {
    renderProgress({
      value: 65,
      theme: "primary",
      size: "medium",
      shadow: "light",
      className: "custom-progress",
    });

    const root = screen.getByTestId("circular-progress");

    expect(root).toHaveClass("circularProgress");
    expect(root).toHaveClass("primary");
    expect(root).toHaveClass("medium");
    expect(root).toHaveClass("shadowLight");
    expect(root).toHaveClass("custom-progress");
  });

  it("applies state class to root and state-specific border class", () => {
    renderProgress({
      value: 65,
      state: "success",
    });

    const root = screen.getByTestId("circular-progress");
    const border = root.firstChild as HTMLElement;

    expect(root).toHaveClass("success");
    expect(border).toHaveClass("circleBorder");
    expect(border).toHaveClass("stateSuccess");
  });

  it("does not apply a state-specific border class when state is not provided", () => {
    renderProgress({
      value: 50,
      state: "",
    });

    const root = screen.getByTestId("circular-progress");
    const border = root.firstChild as HTMLElement;

    expect(border).toHaveClass("circleBorder");
    expect(border).not.toHaveClass("stateSuccess");
    expect(border).not.toHaveClass("stateWarning");
    expect(border).not.toHaveClass("stateError");
    expect(border).not.toHaveClass("stateDisabled");
  });

  it("renders the inner circle and value text classes", () => {
    renderProgress({
      value: 25,
    });

    const root = screen.getByTestId("circular-progress");
    const border = root.firstChild as HTMLElement;
    const innerCircle = border.firstChild as HTMLElement;
    const valueText = getValueText();

    expect(border).toHaveClass("circleBorder");
    expect(innerCircle).toHaveClass("innerCircle");
    expect(valueText).toHaveClass("valueText");
    expect(valueText).toHaveTextContent("25%");
  });

  it("hides the inner value text from assistive technology by default", () => {
    renderProgress({
      value: 25,
    });

    const valueText = getValueText();

    expect(valueText).toHaveTextContent("25%");
    expect(valueText).toHaveAttribute("aria-hidden", "true");
    expect(valueText).not.toHaveAttribute("aria-live");
    expect(valueText).not.toHaveAttribute("aria-atomic");
  });

  it("announces the inner value text when announceInnerValue is true", () => {
    renderProgress({
      value: 25,
      announceInnerValue: true,
    });

    const valueText = getValueText();

    expect(valueText).toHaveTextContent("25%");
    expect(valueText).not.toHaveAttribute("aria-hidden");
    expect(valueText).toHaveAttribute("aria-live", "polite");
    expect(valueText).toHaveAttribute("aria-atomic", "true");
  });

  it("renders as decorative when decorative is true", () => {
    renderProgress({
      value: 75,
      decorative: true,
      label: "Decorative progress",
    });

    const root = screen.getByTestId("circular-progress");

    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).not.toHaveAttribute("role");
    expect(root).not.toHaveAttribute("aria-label");
    expect(root).not.toHaveAttribute("aria-valuenow");
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("updates displayed percentage from props", () => {
    const { rerender } = render(
      <CircularProgressBase
        value={10}
        classMap={classMap}
        data-testid="circular-progress"
      />,
    );

    expect(getValueText()).toHaveTextContent("10%");

    rerender(
      <CircularProgressBase
        value={75}
        classMap={classMap}
        data-testid="circular-progress"
      />,
    );

    expect(getValueText()).toHaveTextContent("75%");
  });

  it("passes through additional HTML attributes", () => {
    renderProgress({
      value: 42,
      id: "progress-id",
      title: "Progress title",
    });

    const root = screen.getByTestId("circular-progress");

    expect(root).toHaveAttribute("id", "progress-id");
    expect(root).toHaveAttribute("title", "Progress title");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <CircularProgressBase
        value={70}
        classMap={classMap}
        label="Progress Tracker"
        data-testid="circular-progress"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with raw value text", async () => {
    const { container } = render(
      <CircularProgressBase
        value={30}
        max={120}
        showRaw
        label="Raw Progress Tracker"
        classMap={classMap}
        data-testid="circular-progress"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with state styling", async () => {
    const { container } = render(
      <CircularProgressBase
        value={85}
        state="success"
        variant="glassOutline"
        label="State Progress Tracker"
        classMap={classMap}
        data-testid="circular-progress"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when using aria-labelledby and aria-describedby", async () => {
    const { container } = render(
      <>
        <h2 id="progress-heading">Upload progress</h2>
        <p id="progress-help">This shows the current upload completion.</p>
        <CircularProgressBase
          value={66}
          aria-labelledby="progress-heading"
          aria-describedby="progress-help"
          classMap={classMap}
          data-testid="circular-progress"
        />
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when decorative", async () => {
    const { container } = render(
      <CircularProgressBase
        value={66}
        decorative
        classMap={classMap}
        data-testid="circular-progress"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
