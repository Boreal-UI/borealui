import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import TypographyBase from "@/components/Typography/TypographyBase";
import { TypographyVariant } from "@/core/Typography";

expect.extend(toHaveNoViolations);

const mockClassMap = {
  typography: "typography",

  display: "display",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  bodyLg: "bodyLg",
  body: "body",
  bodySm: "bodySm",
  label: "label",
  caption: "caption",
  overline: "overline",
  code: "code",

  alignLeft: "alignLeft",
  alignCenter: "alignCenter",
  alignRight: "alignRight",
  alignInherit: "alignInherit",

  weightLight: "weightLight",
  weightNormal: "weightNormal",
  weightMedium: "weightMedium",
  weightBold: "weightBold",
  weightBolder: "weightBolder",
  weightInherit: "weightInherit",

  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",
  clear: "clear",
  success: "success",
  warning: "warning",
  error: "error",
  themeInherit: "themeInherit",

  italic: "italic",
  underline: "underline",
  truncate: "truncate",
  noWrap: "noWrap",
  srOnly: "srOnly",
  glass: "glass",
};

const combineClassNames = (
  ...classes: Array<string | false | null | undefined>
) => classes.filter(Boolean).join(" ");

const renderTypography = (props = {}) =>
  render(
    <TypographyBase
      classMap={mockClassMap}
      combineClassNames={combineClassNames}
      {...props}
    >
      Example text
    </TypographyBase>,
  );

describe("TypographyBase", () => {
  it("renders with the default body variant as a paragraph", () => {
    renderTypography();

    const element = screen.getByTestId("typography");
    expect(element.tagName).toBe("P");
    expect(element).toHaveTextContent("Example text");
  });

  it("renders the correct semantic tag for each default variant", () => {
    const variantTagMap: Array<[string, string]> = [
      ["display", "H1"],
      ["h1", "H1"],
      ["h2", "H2"],
      ["h3", "H3"],
      ["h4", "H4"],
      ["h5", "H5"],
      ["h6", "H6"],
      ["body-lg", "P"],
      ["body", "P"],
      ["body-sm", "P"],
      ["label", "SPAN"],
      ["caption", "SPAN"],
      ["overline", "SPAN"],
      ["code", "CODE"],
    ];

    variantTagMap.forEach(([variant, expectedTag]) => {
      const { unmount } = render(
        <TypographyBase
          textStyle={variant as TypographyVariant}
          classMap={mockClassMap}
          combineClassNames={combineClassNames}
        >
          Variant text
        </TypographyBase>,
      );

      expect(screen.getByTestId("typography").tagName).toBe(expectedTag);
      unmount();
    });
  });

  it("uses the `as` prop instead of the default tag", () => {
    renderTypography({ textStyle: "body", as: "div" });

    const element = screen.getByTestId("typography");
    expect(element.tagName).toBe("DIV");
  });

  it("applies the base, variant, alignment, weight, theme, and glass classes", () => {
    renderTypography({
      align: "center",
      weight: "bold",
      theme: "success",
      textStyle: "h2",
      variant: "glassOutline",
    });

    const element = screen.getByTestId("typography");
    expect(element).toHaveClass(
      "typography",
      "h2",
      "alignCenter",
      "weightBold",
      "success",
      "glass",
    );
  });

  it("applies optional style modifier classes", () => {
    renderTypography({
      italic: true,
      underline: true,
      truncate: true,
      noWrap: true,
      srOnly: true,
    });

    const element = screen.getByTestId("typography");
    expect(element).toHaveClass(
      "italic",
      "underline",
      "truncate",
      "noWrap",
      "sr_only",
    );
  });

  it("applies a custom className", () => {
    renderTypography({ className: "customClass" });

    expect(screen.getByTestId("typography")).toHaveClass("customClass");
  });

  it("applies inline styles", () => {
    renderTypography({
      style: { color: "red", marginTop: "12px" },
    });

    const typography = screen.getByTestId("typography");

    expect(typography.style.color).toBe("red");
    expect(typography.style.marginTop).toBe("12px");
  });

  it("applies id and title attributes", () => {
    renderTypography({
      id: "hero-title",
      title: "Helpful tooltip title",
    });

    const element = screen.getByTestId("typography");
    expect(element).toHaveAttribute("id", "hero-title");
    expect(element).toHaveAttribute("title", "Helpful tooltip title");
  });

  it("uses a custom testId when provided", () => {
    render(
      <TypographyBase
        classMap={mockClassMap}
        combineClassNames={combineClassNames}
        testId="custom-typography"
      >
        Custom test id
      </TypographyBase>,
    );

    expect(screen.getByTestId("custom-typography")).toBeInTheDocument();
  });

  it("applies the provided role", () => {
    renderTypography({ role: "status" });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses aria-label when provided", () => {
    renderTypography({
      as: "div",
      "aria-label": "Accessible summary text",
    });

    const element = screen.getByLabelText("Accessible summary text");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("aria-label", "Accessible summary text");
  });

  it("uses aria-labelledby when provided", () => {
    render(
      <>
        <span id="external-label">External typography label</span>
        <TypographyBase
          as="div"
          aria-labelledby="external-label"
          classMap={mockClassMap}
          combineClassNames={combineClassNames}
        >
          Example text
        </TypographyBase>
      </>,
    );

    const element = screen.getByLabelText("External typography label");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("aria-labelledby", "external-label");
  });

  it("prefers aria-labelledby over aria-label when both are provided", () => {
    render(
      <>
        <span id="external-label">External label wins</span>
        <TypographyBase
          as="div"
          aria-label="Internal label"
          aria-labelledby="external-label"
          classMap={mockClassMap}
          combineClassNames={combineClassNames}
        >
          Example text
        </TypographyBase>
      </>,
    );

    const element = screen.getByLabelText("External label wins");
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute("aria-labelledby", "external-label");
    expect(element).not.toHaveAttribute("aria-label");
  });

  it("applies aria-describedby when provided", () => {
    render(
      <>
        <p id="helper-text">This text gives extra context.</p>
        <TypographyBase
          as="div"
          aria-describedby="helper-text"
          classMap={mockClassMap}
          combineClassNames={combineClassNames}
        >
          Example text
        </TypographyBase>
      </>,
    );

    const element = screen.getByTestId("typography");
    expect(element).toHaveAttribute("aria-describedby", "helper-text");
  });

  it("applies aria-hidden when content is decorative", () => {
    renderTypography({
      as: "span",
      "aria-hidden": true,
    });

    expect(screen.getByTestId("typography")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("applies live region attributes when ariaLive is provided", () => {
    renderTypography({
      as: "div",
      role: "status",
      "aria-live": "polite",
      "aria-atomic": true,
      "aria-busy": true,
    });

    const element = screen.getByRole("status");
    expect(element).toHaveAttribute("aria-live", "polite");
    expect(element).toHaveAttribute("aria-atomic", "true");
    expect(element).toHaveAttribute("aria-busy", "true");
  });

  it("does not apply aria-atomic or aria-busy when ariaLive is not provided", () => {
    renderTypography({
      as: "div",
      "aria-atomic": true,
      "aria-busy": true,
    });

    const element = screen.getByTestId("typography");
    expect(element).not.toHaveAttribute("aria-live");
    expect(element).not.toHaveAttribute("aria-atomic");
    expect(element).not.toHaveAttribute("aria-busy");
  });

  it("renders code variant with the code class", () => {
    renderTypography({ textStyle: "code" });

    const element = screen.getByTestId("typography");
    expect(element.tagName).toBe("CODE");
    expect(element).toHaveClass("code");
  });

  it("renders screen-reader-only text while still being present in the document", () => {
    renderTypography({
      srOnly: true,
    });

    const element = screen.getByTestId("typography");
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("Example text");
    expect(element).toHaveClass("sr_only");
  });

  it("has no accessibility violations in a standard usage", async () => {
    const { container } = render(
      <TypographyBase
        textStyle="h2"
        theme="primary"
        classMap={mockClassMap}
        combineClassNames={combineClassNames}
      >
        Section heading
      </TypographyBase>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations as a live region", async () => {
    const { container } = render(
      <TypographyBase
        as="div"
        role="status"
        aria-live="polite"
        aria-atomic={true}
        classMap={mockClassMap}
        combineClassNames={combineClassNames}
      >
        Saved successfully
      </TypographyBase>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
