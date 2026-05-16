import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseSelect from "@/components/Select/SelectBase";

expect.extend(toHaveNoViolations);

const classMap = {
  layout: "layout",
  wrapper: "wrapper",
  select: "select",
  icon: "icon",
  label: "label",
  labelOverlay: "labelOverlay",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  loading: "loading",
  outline: "outline",
  glass: "glass",
  disabled: "disabled",
  primary: "themePrimary",
  secondary: "themeSecondary",
  error: "stateError",
  shadowMedium: "shadowMedium",
  roundMedium: "roundMedium",
};

describe("BaseSelect", () => {
  const defaultProps = {
    value: "",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
    onChange: jest.fn(),
    classMap,
    "data-testid": "select",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the select and allows selecting an option", () => {
    render(<BaseSelect {...defaultProps} />);

    const select = screen.getByTestId("select-input");
    fireEvent.change(select, { target: { value: "banana" } });

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChange).toHaveBeenCalledWith("banana");
  });

  it("renders the placeholder option as disabled and hidden", () => {
    render(<BaseSelect {...defaultProps} placeholder="Choose fruit" />);

    const select = screen.getByTestId("select-input") as HTMLSelectElement;
    const placeholderOption = select.querySelector(
      'option[value=""]',
    ) as HTMLOptionElement;

    expect(placeholderOption).toBeInTheDocument();
    expect(placeholderOption).toHaveTextContent("Choose fruit");
    expect(placeholderOption.disabled).toBe(true);
    expect(placeholderOption.hidden).toBe(true);
  });

  it("renders all provided options", () => {
    render(<BaseSelect {...defaultProps} />);

    expect(screen.getByTestId("select-option-apple")).toBeInTheDocument();
    expect(screen.getByTestId("select-option-banana")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
  });

  it("renders with the provided selected value", () => {
    render(<BaseSelect {...defaultProps} value="apple" />);

    const select = screen.getByTestId("select-input");
    expect(select).toHaveValue("apple");
  });

  it("uses the placeholder as the accessible name when aria-label is not provided", () => {
    render(<BaseSelect {...defaultProps} placeholder="Choose fruit" />);

    expect(
      screen.getByRole("combobox", { name: "Choose fruit" }),
    ).toBeInTheDocument();
  });

  it("supports aria-label", () => {
    render(<BaseSelect {...defaultProps} aria-label="Fruit select" />);

    const select = screen.getByRole("combobox", { name: "Fruit select" });
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute("aria-label", "Fruit select");
  });

  it("supports aria-description and renders an internal description element", () => {
    render(
      <BaseSelect
        {...defaultProps}
        aria-label="Fruit select"
        aria-description="Select your favorite fruit"
      />,
    );

    const select = screen.getByTestId("select-input");
    const desc = screen.getByTestId("select-description");

    expect(desc).toHaveTextContent("Select your favorite fruit");
    expect(select).toHaveAttribute(
      "aria-description",
      "Select your favorite fruit",
    );
    expect(select).toHaveAttribute("aria-describedby", desc.id);
  });

  it("merges aria-describedby with the internal description id", () => {
    render(
      <>
        <div id="external-help">Helpful text</div>
        <BaseSelect
          {...defaultProps}
          aria-label="Fruit select"
          aria-description="Select your favorite fruit"
          aria-describedby="external-help"
        />
      </>,
    );

    const select = screen.getByTestId("select-input");
    const desc = screen.getByTestId("select-description");

    expect(select).toHaveAttribute(
      "aria-describedby",
      `external-help ${desc.id}`,
    );
  });

  it("supports aria-labelledby and does not set aria-label when labelledby is provided", () => {
    render(
      <>
        <span id="fruit-label">Fruit field</span>
        <BaseSelect
          {...defaultProps}
          aria-label="Hidden fallback label"
          aria-labelledby="fruit-label"
        />
      </>,
    );

    const select = screen.getByRole("combobox", { name: "Fruit field" });

    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute("aria-labelledby", "fruit-label");
    expect(select).not.toHaveAttribute("aria-label");
  });

  it("supports explicit aria-invalid", () => {
    render(
      <BaseSelect {...defaultProps} aria-label="Fruit select" aria-invalid />,
    );

    const select = screen.getByTestId("select-input");
    expect(select).toHaveAttribute("aria-invalid", "true");
  });

  it("defaults aria-invalid to true when state is error", () => {
    render(
      <BaseSelect {...defaultProps} aria-label="Fruit select" state="error" />,
    );

    const select = screen.getByTestId("select-input");
    expect(select).toHaveAttribute("aria-invalid", "true");
  });

  it("supports aria-required and required", () => {
    render(
      <BaseSelect
        {...defaultProps}
        aria-label="Fruit select"
        required
        aria-required
      />,
    );

    const select = screen.getByTestId("select-input");
    expect(select).toBeRequired();
    expect(select).toHaveAttribute("aria-required", "true");
  });

  it("falls back aria-required from required when aria-required is not provided", () => {
    render(<BaseSelect {...defaultProps} aria-label="Fruit select" required />);

    const select = screen.getByTestId("select-input");
    expect(select).toBeRequired();
    expect(select).toHaveAttribute("aria-required", "true");
  });

  it("supports disabled state accessibly", () => {
    render(<BaseSelect {...defaultProps} aria-label="Fruit select" disabled />);

    const select = screen.getByTestId("select-input");
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("aria-disabled", "true");
  });

  it("applies disabled to individual options", () => {
    render(
      <BaseSelect
        {...defaultProps}
        options={[
          { value: "apple", label: "Apple", disabled: true },
          { value: "banana", label: "Banana" },
        ]}
        aria-label="Fruit select"
      />,
    );

    expect(screen.getByRole("option", { name: "Apple" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "Banana" })).not.toBeDisabled();
  });

  it("supports id, name, form, autocomplete, role, and tabIndex", () => {
    render(
      <BaseSelect
        {...defaultProps}
        id="fruit-select"
        name="fruit"
        form="fruit-form"
        autoComplete="off"
        role="combobox"
        tabIndex={2}
        aria-label="Fruit select"
      />,
    );

    const select = screen.getByTestId("select-input");
    expect(select).toHaveAttribute("id", "fruit-select");
    expect(select).toHaveAttribute("name", "fruit");
    expect(select).toHaveAttribute("form", "fruit-form");
    expect(select).toHaveAttribute("autocomplete", "off");
    expect(select).toHaveAttribute("role", "combobox");
    expect(select).toHaveAttribute("tabindex", "2");
  });

  it("renders the icon as decorative", () => {
    render(<BaseSelect {...defaultProps} aria-label="Fruit select" />);

    const iconWrapper = screen.getByTestId("select-icon");
    expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards wrapper pointer presses to the native select", () => {
    render(<BaseSelect {...defaultProps} aria-label="Fruit select" />);

    const wrapper = screen.getByTestId("select");
    const select = screen.getByTestId("select-input") as HTMLSelectElement;
    const focusSpy = jest.spyOn(select, "focus");
    const clickSpy = jest.spyOn(select, "click");

    fireEvent.mouseDown(wrapper);

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("does not forward direct select clicks back to the native select", () => {
    render(<BaseSelect {...defaultProps} aria-label="Fruit select" />);

    const select = screen.getByTestId("select-input") as HTMLSelectElement;
    const clickSpy = jest.spyOn(select, "click");

    fireEvent.click(select);

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("does not forward wrapper clicks when disabled", () => {
    render(<BaseSelect {...defaultProps} aria-label="Fruit select" disabled />);

    const wrapper = screen.getByTestId("select");
    const select = screen.getByTestId("select-input") as HTMLSelectElement;
    const focusSpy = jest.spyOn(select, "focus");
    const clickSpy = jest.spyOn(select, "click");

    fireEvent.click(wrapper);

    expect(focusSpy).not.toHaveBeenCalled();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("renders a visible label when provided", () => {
    render(
      <BaseSelect
        {...defaultProps}
        label="Favorite fruit"
        labelPosition="top"
        aria-label="Fruit select"
      />,
    );

    expect(screen.getByTestId("select-label")).toBeInTheDocument();
    expect(screen.getByText("Favorite fruit")).toBeInTheDocument();
  });

  it("renders the layout wrapper and main wrapper test ids", () => {
    render(
      <BaseSelect
        {...defaultProps}
        aria-label="Fruit select"
        theme="primary"
        state="error"
        outline
        glass
        rounding="medium"
        shadow="medium"
      />,
    );

    expect(screen.getByTestId("select-layout")).toBeInTheDocument();
    expect(screen.getByTestId("select")).toHaveClass(
      "wrapper",
      "themePrimary",
      "stateError",
      "glass",
      "outline",
      "roundMedium",
      "shadowMedium",
    );
  });

  it("applies custom class names to select sections", () => {
    render(
      <BaseSelect
        {...defaultProps}
        aria-label="Fruit select"
        aria-description="Choose carefully"
        label="Favorite fruit"
        layoutClassName="custom-layout"
        labelClassName="custom-label"
        selectClassName="custom-select"
        iconClassName="custom-icon"
        srOnlyClassName="custom-sr-only"
      />,
    );

    expect(screen.getByTestId("select-layout")).toHaveClass(
      "layout",
      "custom-layout",
    );
    expect(screen.getByTestId("select-label")).toHaveClass(
      "label",
      "labelOverlay",
      "custom-label",
    );
    expect(screen.getByTestId("select-input")).toHaveClass(
      "select",
      "custom-select",
    );
    expect(screen.getByTestId("select-icon")).toHaveClass(
      "icon",
      "custom-icon",
    );
    expect(screen.getByTestId("select-description")).toHaveClass(
      "sr_only",
      "custom-sr-only",
    );
  });

  it("applies custom class names to async loading text", async () => {
    const asyncOptions = jest
      .fn()
      .mockResolvedValue([{ value: "orange", label: "Orange" }]);

    render(
      <BaseSelect
        {...defaultProps}
        asyncOptions={asyncOptions}
        aria-label="Fruit select"
        loadingClassName="custom-loading"
      />,
    );

    expect(screen.getByTestId("select-loading")).toHaveClass(
      "loading",
      "custom-loading",
    );

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Orange" }),
      ).toBeInTheDocument();
    });
  });

  it("loads async options and shows a loading message", async () => {
    const asyncOptions = jest.fn().mockResolvedValue([
      { value: "orange", label: "Orange" },
      { value: "grape", label: "Grape" },
    ]);

    render(
      <BaseSelect
        {...defaultProps}
        asyncOptions={asyncOptions}
        aria-label="Fruit select"
      />,
    );

    expect(asyncOptions).toHaveBeenCalledWith("");

    expect(screen.getByTestId("select-loading")).toBeInTheDocument();
    expect(screen.getByTestId("select-loading")).toHaveAttribute(
      "aria-live",
      "polite",
    );

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Orange" }),
      ).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Grape" })).toBeInTheDocument();
    });
  });

  it("supports custom aria-live on the loading message", async () => {
    const asyncOptions = jest
      .fn()
      .mockResolvedValue([{ value: "orange", label: "Orange" }]);

    render(
      <BaseSelect
        {...defaultProps}
        asyncOptions={asyncOptions}
        aria-label="Fruit select"
        aria-live="assertive"
      />,
    );

    const loading = screen.getByTestId("select-loading");
    expect(loading).toHaveAttribute("aria-live", "assertive");

    await waitFor(() => {
      expect(
        screen.getByRole("option", { name: "Orange" }),
      ).toBeInTheDocument();
    });
  });

  it("sets aria-busy while async options are loading", async () => {
    let resolveOptions: (
      value: { value: string; label: string }[],
    ) => void = () => {};

    const asyncOptions = jest.fn(
      () =>
        new Promise<{ value: string; label: string }[]>((resolve) => {
          resolveOptions = resolve;
        }),
    );

    render(
      <BaseSelect
        {...defaultProps}
        asyncOptions={asyncOptions}
        aria-label="Fruit select"
      />,
    );

    const select = screen.getByTestId("select-input");
    expect(select).toHaveAttribute("aria-busy", "true");

    resolveOptions([{ value: "pear", label: "Pear" }]);

    await waitFor(() => {
      expect(select).not.toHaveAttribute("aria-busy");
      expect(screen.getByRole("option", { name: "Pear" })).toBeInTheDocument();
    });
  });

  it("respects explicit aria-busy over internal loading state", async () => {
    const asyncOptions = jest
      .fn()
      .mockResolvedValue([{ value: "pear", label: "Pear" }]);

    render(
      <BaseSelect
        {...defaultProps}
        asyncOptions={asyncOptions}
        aria-label="Fruit select"
        aria-busy={false}
      />,
    );

    const select = screen.getByTestId("select-input");
    expect(select).toHaveAttribute("aria-busy", "false");

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Pear" })).toBeInTheDocument();
    });

    expect(select).toHaveAttribute("aria-busy", "false");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BaseSelect
        {...defaultProps}
        aria-label="Fruit select"
        aria-description="Select your favorite fruit"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
