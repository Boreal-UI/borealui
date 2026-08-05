import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import SliderBase from "@/components/Slider/SliderBase";

expect.extend(toHaveNoViolations);

const mockStyles = {
  container: "sliderContainer",
  wrapper: "sliderWrapper",
  label: "sliderLabel",
  meta: "sliderMeta",
  metaValueOnly: "sliderMetaValueOnly",
  slider: "slider",
  value: "sliderValue",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  small: "small",
  medium: "medium",
  large: "large",
  primary: "primary",
  secondary: "secondary",
  error: "error",
  disabled: "disabled",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  glass: "glass",
};

describe("SliderBase", () => {
  const defaultProps = {
    value: 25,
    onChange: jest.fn(),
    classMap: mockStyles,
    "data-testid": "slider",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with label and visible value", () => {
    render(<SliderBase {...defaultProps} label="Volume" />);

    const slider = screen.getByRole("slider", { name: "Volume" });
    const value = screen.getByTestId("slider-value");
    const label = screen.getByTestId("slider-label");

    expect(slider).toBeInTheDocument();
    expect(label).toHaveTextContent("Volume");
    expect(value).toHaveTextContent("25");
  });

  it("renders value without units by default", () => {
    render(<SliderBase {...defaultProps} label="Volume" />);

    expect(screen.getByTestId("slider-value")).toHaveTextContent("25");
    expect(screen.getByTestId("slider-value")).not.toHaveTextContent("25%");
  });

  it("renders value with custom units", () => {
    render(<SliderBase {...defaultProps} label="Volume" units="%" />);

    expect(screen.getByTestId("slider-value")).toHaveTextContent("25%");
  });

  it("renders without visible label when aria-label is provided", () => {
    render(<SliderBase {...defaultProps} aria-label="Brightness" />);

    const slider = screen.getByRole("slider", { name: "Brightness" });

    expect(slider).toBeInTheDocument();
    expect(screen.queryByTestId("slider-label")).not.toBeInTheDocument();
  });

  it("uses aria-labelledby from the rendered label when label is provided", () => {
    render(<SliderBase {...defaultProps} label="Progress" />);

    const slider = screen.getByTestId("slider");
    const label = screen.getByTestId("slider-label");

    expect(slider).toHaveAttribute("aria-labelledby", label.id);
    expect(slider).not.toHaveAttribute("aria-label");
  });

  it("combines internal label id and external aria-labelledby when both are provided", () => {
    render(
      <>
        <span id="external-label">External Label</span>
        <SliderBase
          {...defaultProps}
          label="Volume"
          aria-labelledby="external-label"
        />
      </>,
    );

    const slider = screen.getByTestId("slider");
    const label = screen.getByTestId("slider-label");

    expect(slider).toHaveAttribute(
      "aria-labelledby",
      `${label.id} external-label`,
    );
  });

  it("uses aria-describedby for external description and visible value output", () => {
    render(
      <>
        <p id="slider-help">Use arrow keys to adjust volume</p>
        <SliderBase
          {...defaultProps}
          label="Volume"
          aria-describedby="slider-help"
        />
      </>,
    );

    const slider = screen.getByTestId("slider");
    const value = screen.getByTestId("slider-value");

    expect(slider).toHaveAttribute(
      "aria-describedby",
      `slider-help ${value.id}`,
    );
  });

  it("uses only external aria-describedby when showValue is false", () => {
    render(
      <>
        <p id="slider-help">Helpful text</p>
        <SliderBase
          {...defaultProps}
          aria-label="Volume"
          aria-describedby="slider-help"
          showValue={false}
        />
      </>,
    );

    const slider = screen.getByTestId("slider");

    expect(slider).toHaveAttribute("aria-describedby", "slider-help");
    expect(screen.queryByTestId("slider-value")).not.toBeInTheDocument();
  });

  it("renders label and value above the slider when labelPosition is top", () => {
    render(<SliderBase {...defaultProps} label="Volume" labelPosition="top" />);

    const meta = screen.getByTestId("slider-meta");
    const label = screen.getByTestId("slider-label");
    const value = screen.getByTestId("slider-value");
    const wrapper = screen.getByTestId("slider-wrapper");

    expect(screen.getByTestId("slider-container")).toHaveClass("labelTop");
    expect(meta).toHaveClass("sliderMeta");
    expect(label.compareDocumentPosition(value)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(meta.compareDocumentPosition(wrapper)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders label and value below the slider when labelPosition is bottom", () => {
    render(
      <SliderBase {...defaultProps} label="Volume" labelPosition="bottom" />,
    );

    const meta = screen.getByTestId("slider-meta");
    const wrapper = screen.getByTestId("slider-wrapper");

    expect(screen.getByTestId("slider-container")).toHaveClass("labelBottom");
    expect(wrapper.compareDocumentPosition(meta)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the label before the slider and value when labelPosition is left", () => {
    render(
      <SliderBase {...defaultProps} label="Volume" labelPosition="left" />,
    );

    const label = screen.getByTestId("slider-label");
    const wrapper = screen.getByTestId("slider-wrapper");
    const value = screen.getByTestId("slider-value");

    expect(screen.getByTestId("slider-container")).toHaveClass("labelLeft");
    expect(label.compareDocumentPosition(wrapper)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(wrapper.compareDocumentPosition(value)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.queryByTestId("slider-meta")).not.toBeInTheDocument();
  });

  it("renders the slider before the label and value when labelPosition is right", () => {
    render(
      <SliderBase
        {...defaultProps}
        label="Volume"
        labelPosition="right"
        units="%"
      />,
    );

    const wrapper = screen.getByTestId("slider-wrapper");
    const value = screen.getByTestId("slider-value");
    const label = screen.getByTestId("slider-label");

    expect(screen.getByTestId("slider-container")).toHaveClass("labelRight");
    expect(wrapper.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(label.compareDocumentPosition(value)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(value).toHaveTextContent("25%");
    expect(screen.queryByTestId("slider-meta")).not.toBeInTheDocument();
  });

  it("right-aligns top-positioned value when no label is provided", () => {
    render(<SliderBase {...defaultProps} aria-label="Volume" />);

    expect(screen.getByTestId("slider-meta")).toHaveClass(
      "sliderMetaValueOnly",
    );
  });

  it("fires onChange when value changes", () => {
    const handleChange = jest.fn();

    const TestSlider = () => {
      const [value, setValue] = React.useState(50);

      return (
        <SliderBase
          {...defaultProps}
          value={value}
          onChange={(e) => {
            handleChange(e);
            setValue(Number(e.target.value));
          }}
        />
      );
    };

    render(<TestSlider />);

    const slider = screen.getByTestId("slider");
    fireEvent.change(slider, { target: { value: "60" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(slider).toHaveValue("60");
  });

  it("fires onValueChange with numeric value when value changes", () => {
    const handleValueChange = jest.fn();

    const TestSlider = () => {
      const [value, setValue] = React.useState(50);

      return (
        <SliderBase
          {...defaultProps}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          onValueChange={handleValueChange}
        />
      );
    };

    render(<TestSlider />);

    fireEvent.change(screen.getByTestId("slider"), {
      target: { value: "60" },
    });

    expect(handleValueChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith(60);
    expect(screen.getByTestId("slider")).toHaveValue("60");
  });

  it("fires onValueChange with numeric value when value changes", () => {
    const handleValueChange = jest.fn();

    render(
      <SliderBase
        {...defaultProps}
        value={50}
        onValueChange={handleValueChange}
      />,
    );

    fireEvent.change(screen.getByTestId("slider"), {
      target: { value: "70" },
    });

    expect(handleValueChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith(70);
  });

  it("fires both onChange and onValueChange together", () => {
    const handleChange = jest.fn();
    const handleValueChange = jest.fn();

    render(
      <SliderBase
        {...defaultProps}
        value={40}
        onChange={handleChange}
        onValueChange={handleValueChange}
      />,
    );

    fireEvent.change(screen.getByTestId("slider"), {
      target: { value: "55" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledTimes(1);
    expect(handleValueChange).toHaveBeenCalledWith(55);
  });

  it("applies min, max, step, and current value attributes", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={30}
        min={10}
        max={90}
        step={5}
        aria-label="Level"
      />,
    );

    const slider = screen.getByTestId("slider");

    expect(slider).toHaveAttribute("min", "10");
    expect(slider).toHaveAttribute("max", "90");
    expect(slider).toHaveAttribute("step", "5");
    expect(slider).toHaveValue("30");
    expect(slider).toHaveAttribute("aria-valuemin", "10");
    expect(slider).toHaveAttribute("aria-valuemax", "90");
    expect(slider).toHaveAttribute("aria-valuenow", "30");
  });

  it("clamps the rendered value when provided value is below min", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={-10}
        min={0}
        max={100}
        aria-label="Temperature"
      />,
    );

    const slider = screen.getByTestId("slider");
    const value = screen.getByTestId("slider-value");

    expect(slider).toHaveValue("0");
    expect(slider).toHaveAttribute("aria-valuenow", "0");
    expect(value).toHaveTextContent("0");
  });

  it("clamps the rendered value when provided value is above max", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={150}
        min={0}
        max={100}
        aria-label="Temperature"
      />,
    );

    const slider = screen.getByTestId("slider");
    const value = screen.getByTestId("slider-value");

    expect(slider).toHaveValue("100");
    expect(slider).toHaveAttribute("aria-valuenow", "100");
    expect(value).toHaveTextContent("100");
  });

  it("falls back to safe defaults for invalid min, max, and step", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={20}
        min={Number.NaN}
        max={Number.NaN}
        step={0}
        aria-label="Fallback slider"
      />,
    );

    const slider = screen.getByTestId("slider");

    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "100");
    expect(slider).toHaveAttribute("step", "1");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  it("respects explicit aria value props when provided", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={35}
        aria-label="Custom slider"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={3}
        aria-valuetext="Medium volume"
      />,
    );

    const slider = screen.getByTestId("slider");

    expect(slider).toHaveAttribute("aria-valuemin", "1");
    expect(slider).toHaveAttribute("aria-valuemax", "5");
    expect(slider).toHaveAttribute("aria-valuenow", "3");
    expect(slider).toHaveAttribute("aria-valuetext", "Medium volume");
  });

  it("marks the slider as invalid when state is error", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={20}
        state="error"
        aria-label="Error slider"
      />,
    );

    expect(screen.getByTestId("slider")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("prefers explicit aria-invalid over derived error state", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={20}
        state="error"
        aria-label="Error slider"
        aria-invalid={false}
      />,
    );

    expect(screen.getByTestId("slider")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
  });

  it("marks the slider as required when required is true", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={20}
        required={true}
        aria-label="Required slider"
      />,
    );

    const slider = screen.getByTestId("slider");

    expect(slider).toHaveAttribute("required");
    expect(slider).not.toHaveAttribute("aria-required");
  });

  it("prefers explicit aria-required over derived required state", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={20}
        required={true}
        aria-label="Required slider"
        aria-required={false}
      />,
    );

    expect(screen.getByTestId("slider")).toHaveAttribute("required");
    expect(screen.getByTestId("slider")).toHaveAttribute(
      "aria-required",
      "false",
    );
  });

  it("renders as disabled when disabled is true", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={20}
        disabled={true}
        aria-label="Disabled slider"
      />,
    );

    expect(screen.getByTestId("slider")).toBeDisabled();
  });

  it("uses the provided id and name attributes", () => {
    render(
      <SliderBase
        {...defaultProps}
        id="custom-slider-id"
        name="volume"
        label="Volume"
      />,
    );

    const slider = screen.getByTestId("slider");
    const label = screen.getByTestId("slider-label");

    expect(slider).toHaveAttribute("id", "custom-slider-id");
    expect(slider).toHaveAttribute("name", "volume");
    expect(label).toHaveAttribute("for", "custom-slider-id");
  });

  it("applies custom className to the container", () => {
    render(
      <SliderBase
        {...defaultProps}
        aria-label="Styled slider"
        variant="glassOutline"
        className="custom-class"
      />,
    );

    expect(screen.getByTestId("slider-container")).toHaveClass(
      "glass",
      "custom-class",
    );
  });

  it("renders wrapper and container test ids", () => {
    render(<SliderBase {...defaultProps} aria-label="Wrapper slider" />);

    expect(screen.getByTestId("slider-container")).toBeInTheDocument();
    expect(screen.getByTestId("slider-wrapper")).toBeInTheDocument();
  });

  it("supports vertical orientation", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={40}
        aria-label="Vertical slider"
        aria-orientation="vertical"
      />,
    );

    expect(screen.getByTestId("slider")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });

  it("defaults orientation to horizontal", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={40}
        aria-label="Horizontal slider"
      />,
    );

    expect(screen.getByTestId("slider")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("hides the output element when showValue is false", () => {
    render(
      <SliderBase
        {...defaultProps}
        value={40}
        aria-label="Hidden value slider"
        showValue={false}
      />,
    );

    expect(screen.queryByTestId("slider-value")).not.toBeInTheDocument();
  });

  it("has no accessibility violations with visible label", async () => {
    const { container } = render(
      <SliderBase {...defaultProps} value={30} label="Progress" />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with aria-label only", async () => {
    const { container } = render(
      <SliderBase
        {...defaultProps}
        value={60}
        aria-label="Brightness"
        showValue={false}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
