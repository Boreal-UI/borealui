import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom";
import ColorPickerBase from "@/components/ColorPicker/ColorPickerBase";
import userEvent from "@testing-library/user-event";

expect.extend(toHaveNoViolations);

const colors = [
  { label: "Red", value: "#ff0000" },
  { label: "Green", value: "#00ff00" },
  { label: "Blue", value: "#0000ff" },
];

const colorsWithDisabled = [
  { label: "Red", value: "#ff0000" },
  { label: "Green", value: "#00ff00", disabled: true },
  { label: "Blue", value: "#0000ff" },
];

const classMap = {
  color_picker: "colorPicker",
  legend: "legend",
  color_picker_grid: "colorGrid",
  swatch: "colorSwatch",
  preview: "colorPreview",
  radio_input: "radioInput",
  selected: "selected",
  custom_input: "customColorInput",
  helper_text: "helperText",
  error_text: "errorText",
  invalid: "invalid",
  disabled: "disabled",
  sr_only: "srOnly",
  medium: "medium",
  small: "small",
  large: "large",
  round: "round",
  square: "square",
  pill: "pill",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
};

const renderColorPicker = (props = {}) =>
  render(
    <ColorPickerBase
      colors={colors}
      selected="#ff0000"
      onChange={jest.fn()}
      label="Pick a color"
      classMap={classMap}
      data-testid="color-picker"
      {...props}
    />,
  );

describe("ColorPickerBase", () => {
  it("renders the fieldset and legend", () => {
    renderColorPicker();

    const group = screen.getByTestId("color-picker");
    expect(group).toBeInTheDocument();
    expect(group.tagName).toBe("FIELDSET");

    const legend = screen.getByText("Pick a color");
    expect(legend).toBeInTheDocument();
    expect(legend.tagName).toBe("LEGEND");
    expect(legend).toHaveAttribute("id", "color-picker-legend");
  });

  it("renders all radio options", () => {
    renderColorPicker();

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(colors.length);

    expect(
      screen.getByTestId("color-picker-option-#ff0000"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("color-picker-option-#00ff00"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("color-picker-option-#0000ff"),
    ).toBeInTheDocument();
  });

  it("renders radio inputs with the correct shared name by default", () => {
    renderColorPicker();

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute("name", "color-picker");
    });
  });

  it("uses a custom radio group name when provided", () => {
    renderColorPicker({ name: "theme-colors" });

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute("name", "theme-colors");
    });
  });

  it("checks the selected radio button", () => {
    renderColorPicker({ selected: "#00ff00" });

    const greenInput = screen.getByRole("radio", { name: "Green" });
    const redInput = screen.getByRole("radio", { name: "Red" });
    const blueInput = screen.getByRole("radio", { name: "Blue" });

    expect(greenInput).toBeChecked();
    expect(redInput).not.toBeChecked();
    expect(blueInput).not.toBeChecked();
  });

  it("does not check any radio when selected value does not match provided colors", () => {
    renderColorPicker({ selected: "#123456" });

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).not.toBeChecked();
    });
  });

  it("calls onChange with the selected preset color when a radio is clicked", () => {
    const handleChange = jest.fn();

    renderColorPicker({
      selected: "#ff0000",
      onChange: handleChange,
    });

    const blueInput = screen.getByRole("radio", { name: "Blue" });
    fireEvent.click(blueInput);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("#0000ff");
  });

  it("calls onChange for multiple different radio selections", () => {
    const handleChange = jest.fn();

    renderColorPicker({
      selected: "#ff0000",
      onChange: handleChange,
    });

    const greenInput = screen.getByRole("radio", { name: "Green" });
    const blueInput = screen.getByRole("radio", { name: "Blue" });

    fireEvent.click(greenInput);
    fireEvent.click(blueInput);

    expect(handleChange).toHaveBeenNthCalledWith(1, "#00ff00");
    expect(handleChange).toHaveBeenNthCalledWith(2, "#0000ff");
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("renders each option with the proper title attribute", () => {
    renderColorPicker();

    expect(screen.getByTestId("color-picker-option-#ff0000")).toHaveAttribute(
      "title",
      "Red",
    );
    expect(screen.getByTestId("color-picker-option-#00ff00")).toHaveAttribute(
      "title",
      "Green",
    );
    expect(screen.getByTestId("color-picker-option-#0000ff")).toHaveAttribute(
      "title",
      "Blue",
    );
  });

  it("renders screen-reader-only labels for each color", () => {
    renderColorPicker();

    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("Green")).toBeInTheDocument();
    expect(screen.getByText("Blue")).toBeInTheDocument();
  });

  it("applies the root and legend classes", () => {
    renderColorPicker();

    const root = screen.getByTestId("color-picker");
    const legend = screen.getByText("Pick a color");

    expect(root).toHaveClass("colorPicker");
    expect(legend).toHaveClass("legend");
  });

  it("applies swatch classes based on size and shape", () => {
    renderColorPicker({ size: "medium", shape: "round" });

    const option = screen.getByTestId("color-picker-option-#ff0000");
    expect(option).toHaveClass("colorSwatch", "medium", "round");
  });

  it("applies custom size and shape classes", () => {
    renderColorPicker({ size: "large", shape: "square" });

    const option = screen.getByTestId("color-picker-option-#ff0000");
    expect(option).toHaveClass("colorSwatch", "large", "square");
  });

  it("applies radio input class to each radio", () => {
    renderColorPicker();

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveClass("radioInput");
    });
  });

  it("applies the selected class only to the selected preview", () => {
    renderColorPicker({ selected: "#00ff00" });

    const greenPreview = screen
      .getByTestId("color-picker-option-#00ff00")
      .querySelector("span[aria-hidden='true']") as HTMLElement;

    const redPreview = screen
      .getByTestId("color-picker-option-#ff0000")
      .querySelector("span[aria-hidden='true']") as HTMLElement;

    const bluePreview = screen
      .getByTestId("color-picker-option-#0000ff")
      .querySelector("span[aria-hidden='true']") as HTMLElement;

    expect(greenPreview).toHaveClass("selected");
    expect(redPreview).not.toHaveClass("selected");
    expect(bluePreview).not.toHaveClass("selected");
  });

  it("applies preview shape and shadow classes", () => {
    renderColorPicker({
      selected: "#ff0000",
      shape: "round",
      shadow: "light",
    });

    const preview = screen
      .getByTestId("color-picker-option-#ff0000")
      .querySelector("span[aria-hidden='true']") as HTMLElement;

    expect(preview).toHaveClass(
      "colorPreview",
      "round",
      "selected",
      "shadowLight",
    );
  });

  it("applies a different shadow class when shadow prop changes", () => {
    renderColorPicker({
      selected: "#ff0000",
      shadow: "medium",
    });

    const preview = screen
      .getByTestId("color-picker-option-#ff0000")
      .querySelector("span[aria-hidden='true']") as HTMLElement;

    expect(preview).toHaveClass("shadowMedium");
  });

  it("applies inline background color styles to previews", () => {
    renderColorPicker();

    const redPreview = screen
      .getByTestId("color-picker-option-#ff0000")
      .querySelector("span[aria-hidden='true']") as HTMLElement;

    const greenPreview = screen
      .getByTestId("color-picker-option-#00ff00")
      .querySelector("span[aria-hidden='true']") as HTMLElement;

    const bluePreview = screen
      .getByTestId("color-picker-option-#0000ff")
      .querySelector("span[aria-hidden='true']") as HTMLElement;

    expect(redPreview).toHaveStyle({ backgroundColor: "#ff0000" });
    expect(greenPreview).toHaveStyle({ backgroundColor: "#00ff00" });
    expect(bluePreview).toHaveStyle({ backgroundColor: "#0000ff" });
  });

  it("applies a custom className to the root element", () => {
    renderColorPicker({ className: "customRootClass" });

    expect(screen.getByTestId("color-picker")).toHaveClass(
      "colorPicker",
      "customRootClass",
    );
  });

  it("disables the fieldset when disabled is true", () => {
    renderColorPicker({ disabled: true });

    const root = screen.getByTestId("color-picker");
    expect(root).toBeDisabled();
  });

  it("renders radios as disabled when fieldset is disabled", () => {
    renderColorPicker({ disabled: true });

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it("does not render the custom color input by default", () => {
    renderColorPicker();

    expect(
      screen.queryByLabelText("Custom color picker"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("color-picker-custom-input"),
    ).not.toBeInTheDocument();
  });

  it("renders custom color input if allowCustom is true", () => {
    renderColorPicker({ allowCustom: true });

    const customInput = screen.getByLabelText("Custom color picker");
    expect(customInput).toBeInTheDocument();
    expect(customInput).toHaveAttribute("type", "color");
    expect(customInput).toHaveAttribute(
      "data-testid",
      "color-picker-custom-input",
    );
    expect(customInput).toHaveValue("#ff0000");
    expect(customInput).toHaveClass("customColorInput");
  });

  it("uses the selected value as the custom input value", () => {
    renderColorPicker({
      allowCustom: true,
      selected: "#00ff00",
    });

    const customInput = screen.getByLabelText("Custom color picker");
    expect(customInput).toHaveValue("#00ff00");
  });

  it("calls onChange when custom color input changes", () => {
    const handleChange = jest.fn();

    renderColorPicker({
      allowCustom: true,
      selected: "#ff0000",
      onChange: handleChange,
    });

    const customInput = screen.getByLabelText("Custom color picker");

    fireEvent.change(customInput, { target: { value: "#123456" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("#123456");
  });

  it("uses a custom aria-label for the custom color input when provided", () => {
    renderColorPicker({
      allowCustom: true,
      customInputAriaLabel: "Choose a custom accent color",
    });

    expect(
      screen.getByLabelText("Choose a custom accent color"),
    ).toBeInTheDocument();
  });

  it("uses a custom test id as the base for generated test ids", () => {
    render(
      <ColorPickerBase
        colors={colors}
        selected="#ff0000"
        onChange={jest.fn()}
        label="Choose accent"
        classMap={classMap}
        data-testid="accent-picker"
      />,
    );

    expect(screen.getByTestId("accent-picker")).toBeInTheDocument();
    expect(
      screen.getByTestId("accent-picker-option-#ff0000"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("accent-picker-option-#00ff00"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("accent-picker-option-#0000ff"),
    ).toBeInTheDocument();
  });

  it("generates the expected radio ids", () => {
    renderColorPicker();

    const radios = screen.getAllByRole("radio");

    expect(radios[0]).toHaveAttribute("id", "color-picker-color-0");
    expect(radios[1]).toHaveAttribute("id", "color-picker-color-1");
    expect(radios[2]).toHaveAttribute("id", "color-picker-color-2");
  });

  it("associates labels with radios using htmlFor", () => {
    renderColorPicker();

    const firstLabel = screen.getByTestId("color-picker-option-#ff0000");
    const firstRadio = firstLabel.querySelector("input") as HTMLInputElement;

    expect(firstLabel).toHaveAttribute("for", firstRadio.id);
  });

  it("marks preview elements as aria-hidden", () => {
    renderColorPicker();

    const redPreview = screen
      .getByTestId("color-picker-option-#ff0000")
      .querySelector("span[aria-hidden='true']");
    expect(redPreview).toBeInTheDocument();
  });

  it("matches accessible radio labels", () => {
    renderColorPicker();

    expect(screen.getByRole("radio", { name: "Red" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Green" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Blue" })).toBeInTheDocument();
  });

  it("uses the legend as the accessible group name by default", () => {
    renderColorPicker();

    const fieldset = screen.getByRole("group", { name: "Pick a color" });
    expect(fieldset).toBeInTheDocument();
    expect(fieldset).toHaveAttribute("aria-labelledby", "color-picker-legend");
    expect(fieldset).not.toHaveAttribute("aria-label");
  });

  it("uses aria-label on the fieldset when provided", () => {
    renderColorPicker({
      "aria-label": "Theme color selection",
    });

    const fieldset = screen.getByRole("group", {
      name: "Theme color selection",
    });

    expect(fieldset).toBeInTheDocument();
    expect(fieldset).toHaveAttribute("aria-label", "Theme color selection");
    expect(fieldset).not.toHaveAttribute("aria-labelledby");
  });

  it("uses external aria-labelledby when provided", () => {
    render(
      <>
        <span id="external-color-label">External color label</span>
        <ColorPickerBase
          colors={colors}
          selected="#ff0000"
          onChange={jest.fn()}
          label="Pick a color"
          classMap={classMap}
          data-testid="color-picker"
          aria-labelledby="external-color-label"
        />
      </>,
    );

    const fieldset = screen.getByRole("group", {
      name: "External color label",
    });

    expect(fieldset).toBeInTheDocument();
    expect(fieldset).toHaveAttribute("aria-labelledby", "external-color-label");
    expect(fieldset).not.toHaveAttribute("aria-label");
  });

  it("renders helper text and connects it with aria-describedby", () => {
    renderColorPicker({
      helperText: "Choose a preset swatch or custom color.",
    });

    const fieldset = screen.getByTestId("color-picker");
    const helper = screen.getByTestId("color-picker-helper-text");

    expect(helper).toBeInTheDocument();
    expect(helper).toHaveTextContent("Choose a preset swatch or custom color.");
    expect(helper).toHaveAttribute("id", "color-picker-helper-text");
    expect(fieldset).toHaveAttribute(
      "aria-describedby",
      "color-picker-helper-text",
    );

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute(
        "aria-describedby",
        "color-picker-helper-text",
      );
    });
  });

  it("renders error text when invalid and connects it with aria-describedby", () => {
    renderColorPicker({
      invalid: true,
      errorText: "Please choose a color.",
    });

    const fieldset = screen.getByTestId("color-picker");
    const error = screen.getByTestId("color-picker-error-text");

    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent("Please choose a color.");
    expect(error).toHaveAttribute("id", "color-picker-error-text");
    expect(error).toHaveAttribute("aria-live", "polite");
    expect(fieldset).toHaveAttribute("aria-invalid", "true");
    expect(fieldset).toHaveAttribute(
      "aria-describedby",
      "color-picker-error-text",
    );

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).not.toHaveAttribute("aria-invalid");
      expect(radio).toHaveAttribute(
        "aria-describedby",
        "color-picker-error-text",
      );
    });
  });

  it("merges external aria-describedby with helper and error text ids", () => {
    render(
      <>
        <div id="external-description">External description</div>
        <ColorPickerBase
          colors={colors}
          selected="#ff0000"
          onChange={jest.fn()}
          label="Pick a color"
          classMap={classMap}
          data-testid="color-picker"
          aria-describedby="external-description"
          helperText="Helpful guidance"
          invalid
          errorText="Selection required"
        />
      </>,
    );

    const fieldset = screen.getByTestId("color-picker");
    expect(fieldset).toHaveAttribute(
      "aria-describedby",
      "external-description color-picker-helper-text color-picker-error-text",
    );

    const redRadio = screen.getByRole("radio", { name: "Red" });
    expect(redRadio).toHaveAttribute(
      "aria-describedby",
      "external-description color-picker-helper-text color-picker-error-text",
    );
  });

  it("sets native required state on radios when required is true", () => {
    renderColorPicker({ required: true });

    const fieldset = screen.getByTestId("color-picker");
    expect(fieldset).not.toHaveAttribute("aria-required");

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute("required");
      expect(radio).not.toHaveAttribute("aria-required");
    });
  });

  it("does not render error text when invalid is false", () => {
    renderColorPicker({
      invalid: false,
      errorText: "Please choose a color.",
    });

    expect(
      screen.queryByTestId("color-picker-error-text"),
    ).not.toBeInTheDocument();
  });

  it("renders helper and error text together when invalid", () => {
    renderColorPicker({
      helperText: "Choose any available swatch.",
      invalid: true,
      errorText: "A selection is required.",
    });

    const fieldset = screen.getByTestId("color-picker");
    expect(screen.getByTestId("color-picker-helper-text")).toBeInTheDocument();
    expect(screen.getByTestId("color-picker-error-text")).toBeInTheDocument();
    expect(fieldset).toHaveAttribute(
      "aria-describedby",
      "color-picker-helper-text color-picker-error-text",
    );
  });

  it("applies invalid class when invalid is true", () => {
    renderColorPicker({ invalid: true });

    expect(screen.getByTestId("color-picker")).toHaveClass(
      "colorPicker",
      "invalid",
    );
  });

  it("applies disabled styling class when picker is disabled", () => {
    renderColorPicker({ disabled: true });

    expect(screen.getByTestId("color-picker")).toHaveClass(
      "colorPicker",
      "disabled",
    );

    const option = screen.getByTestId("color-picker-option-#ff0000");
    expect(option).toHaveClass("disabled");
  });

  it("supports per-option disabled state", () => {
    render(
      <ColorPickerBase
        colors={colorsWithDisabled}
        selected="#ff0000"
        onChange={jest.fn()}
        label="Pick a color"
        classMap={classMap}
        data-testid="color-picker"
      />,
    );

    const greenRadio = screen.getByRole("radio", { name: "Green" });
    expect(greenRadio).toBeDisabled();

    const greenOption = screen.getByTestId("color-picker-option-#00ff00");
    expect(greenOption).toHaveClass("disabled");
  });

  it("does not call onChange for a disabled option", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(
      <ColorPickerBase
        colors={colorsWithDisabled}
        selected="#ff0000"
        onChange={handleChange}
        label="Pick a color"
        classMap={classMap}
        data-testid="color-picker"
      />,
    );

    const greenRadio = screen.getByRole("radio", { name: "Green" });
    expect(greenRadio).toBeDisabled();

    await user.click(greenRadio);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("uses aria-labelledby on each radio to reference its hidden label", () => {
    renderColorPicker();

    const redRadio = screen.getByRole("radio", { name: "Red" });
    expect(redRadio).toHaveAttribute(
      "aria-labelledby",
      "color-picker-color-0-label",
    );

    expect(screen.getByText("Red")).toHaveAttribute(
      "id",
      "color-picker-color-0-label",
    );
  });

  it("hides the visible legend with sr-only styling when hideLabel is true", () => {
    renderColorPicker({ hideLabel: true });

    const legend = screen.getByText("Pick a color");
    expect(legend).toBeInTheDocument();
    expect(legend).toHaveClass("legend", "sr_only");
  });

  it("passes describedby to custom input when helper text exists", () => {
    renderColorPicker({
      allowCustom: true,
      helperText: "Custom colors are allowed.",
    });

    const customInput = screen.getByLabelText("Custom color picker");
    expect(customInput).toHaveAttribute(
      "aria-describedby",
      "color-picker-helper-text",
    );
  });

  it("passes invalid state to custom input when invalid is true", () => {
    renderColorPicker({
      allowCustom: true,
      invalid: true,
      errorText: "Please choose a color.",
    });

    const customInput = screen.getByLabelText("Custom color picker");
    expect(customInput).toHaveAttribute("aria-invalid", "true");
  });

  it("disables the custom color input when the picker is disabled", () => {
    renderColorPicker({
      allowCustom: true,
      disabled: true,
    });

    const customInput = screen.getByLabelText("Custom color picker");
    expect(customInput).toBeDisabled();
  });

  it("has no accessibility violations with preset colors only", async () => {
    const { container } = renderColorPicker();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with custom input enabled", async () => {
    const { container } = renderColorPicker({
      allowCustom: true,
      selected: "#00ff00",
      label: "Choose a color",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when helper and error text are present", async () => {
    const { container } = renderColorPicker({
      allowCustom: true,
      helperText: "Pick a preset swatch or choose a custom color.",
      invalid: true,
      errorText: "A color must be selected.",
      required: true,
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
