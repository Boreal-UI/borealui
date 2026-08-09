import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import SpinnerBase from "@/components/Spinner/SpinnerBase";

expect.extend(toHaveNoViolations);

const mockStyles = {
  wrapper: "spinner-wrapper",
  spinner: "spinner-base",
  glassRing: "spinner-glass-ring",
  shadowElement: "spinner-shadow",
  label: "spinner-label",
  primary: "theme-primary",
  secondary: "theme-secondary",
  clear: "theme-clear",
  success: "state-success",
  error: "state-error",
  shadowNone: "shadow-none",
  shadowLight: "shadow-light",
  shadowMedium: "shadow-medium",
  shadowStrong: "shadow-strong",
  shadowIntense: "shadow-intense",
  glass: "spinner-glass",
};

describe("SpinnerBase", () => {
  it("renders the wrapper, ring, and default accessible status role", () => {
    render(<SpinnerBase classMap={mockStyles} />);

    const spinner = screen.getByTestId("spinner");
    const ring = screen.getByTestId("spinner-ring");

    expect(spinner).toBeInTheDocument();
    expect(ring).toBeInTheDocument();
    expect(spinner).toHaveAttribute("role", "status");
  });

  it("renders with correct size styles on shadow and ring", () => {
    render(<SpinnerBase size={60} classMap={mockStyles} />);

    const ring = screen.getByTestId("spinner-ring");
    const shadow = ring.previousElementSibling as HTMLElement;

    expect(ring).toHaveStyle({
      width: "60px",
      height: "60px",
      borderWidth: "5px",
    });

    expect(shadow).toHaveStyle({
      width: "60px",
      height: "60px",
    });
  });

  it("applies theme and state classes to the ring", () => {
    render(
      <SpinnerBase theme="primary" state="success" classMap={mockStyles} />,
    );

    const ring = screen.getByTestId("spinner-ring");

    expect(ring).toHaveClass("spinner-base");
    expect(ring).toHaveClass("theme-primary");
    expect(ring).toHaveClass("state-success");
  });

  it("applies theme, state, and glass classes to the ring", () => {
    render(
      <SpinnerBase
        theme="secondary"
        state="success"
        variant="glassOutline"
        classMap={mockStyles}
      />,
    );

    const spinner = screen.getByTestId("spinner");
    const ring = screen.getByTestId("spinner-ring");

    expect(spinner).toHaveClass("spinner-wrapper");
    expect(spinner).not.toHaveClass("theme-secondary");
    expect(spinner).not.toHaveClass("state-success");
    expect(spinner).not.toHaveClass("spinner-glass");

    expect(ring).toHaveClass(
      "spinner-base",
      "theme-secondary",
      "state-success",
      "spinner-glass",
    );
  });

  it("applies wrapper className to the outer container", () => {
    render(<SpinnerBase classMap={mockStyles} className="custom-wrapper" />);

    expect(screen.getByTestId("spinner")).toHaveClass("spinner-wrapper");
    expect(screen.getByTestId("spinner")).toHaveClass("custom-wrapper");
  });

  it("applies the correct shadow class", () => {
    render(<SpinnerBase shadow="strong" classMap={mockStyles} />);

    const ring = screen.getByTestId("spinner-ring");
    const shadow = ring.previousElementSibling as HTMLElement;

    expect(shadow).toHaveClass("spinner-shadow");
    expect(shadow).toHaveClass("shadow-strong");
  });

  it("does not apply the default shadow class when the clear theme is used", () => {
    render(<SpinnerBase theme="clear" classMap={mockStyles} />);

    const ring = screen.getByTestId("spinner-ring");
    const shadow = ring.previousElementSibling as HTMLElement;

    expect(ring).toHaveClass("theme-clear");
    expect(shadow).toHaveClass("spinner-shadow");
    expect(shadow).not.toHaveClass("shadow-light");
  });

  it("applies an explicit shadow class when the clear theme is used", () => {
    render(<SpinnerBase theme="clear" shadow="strong" classMap={mockStyles} />);

    const ring = screen.getByTestId("spinner-ring");
    const shadow = ring.previousElementSibling as HTMLElement;

    expect(ring).toHaveClass("theme-clear");
    expect(shadow).toHaveClass("spinner-shadow");
    expect(shadow).toHaveClass("shadow-strong");
  });

  it("uses default accessible attributes when no label props are provided", () => {
    render(<SpinnerBase classMap={mockStyles} />);

    const spinner = screen.getByRole("status", { name: "Loading" });

    expect(spinner).toHaveAttribute("aria-busy", "true");
    expect(spinner).toHaveAttribute("aria-live", "polite");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
    expect(spinner).not.toHaveAttribute("aria-labelledby");
  });

  it("renders a visible label and uses aria-labelledby when label is provided", () => {
    render(<SpinnerBase label="Loading content..." classMap={mockStyles} />);

    const spinner = screen.getByRole("status", {
      name: "Loading content...",
    });
    const label = screen.getByTestId("spinner-label");

    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Loading content...");
    expect(spinner).toHaveAttribute("aria-labelledby", label.id);
    expect(spinner).not.toHaveAttribute("aria-label", "Loading content...");
  });

  it("uses aria-label when explicitly provided", () => {
    render(
      <SpinnerBase
        label="Visible loading text"
        aria-label="Screen reader loading text"
        classMap={mockStyles}
      />,
    );

    const spinner = screen.getByRole("status", {
      name: "Screen reader loading text",
    });
    const label = screen.getByTestId("spinner-label");

    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Visible loading text");
    expect(spinner).toHaveAttribute("aria-label", "Screen reader loading text");
    expect(spinner).not.toHaveAttribute("aria-labelledby", label.id);
  });

  it("prefers aria-labelledby over aria-label when both are provided", () => {
    render(
      <>
        <span id="external-spinner-label">External spinner label</span>
        <SpinnerBase
          label="Visible loading text"
          aria-label="Fallback loading label"
          aria-labelledby="external-spinner-label"
          classMap={mockStyles}
        />
      </>,
    );

    const spinner = screen.getByRole("status", {
      name: "External spinner label",
    });

    expect(spinner).toHaveAttribute(
      "aria-labelledby",
      "external-spinner-label",
    );
    expect(spinner).not.toHaveAttribute("aria-label", "Fallback loading label");
  });

  it("renders the visible label even when aria-label is provided", () => {
    render(
      <SpinnerBase
        label="Visible label"
        aria-label="Accessible label"
        classMap={mockStyles}
      />,
    );

    expect(screen.getByTestId("spinner-label")).toHaveTextContent(
      "Visible label",
    );
    expect(
      screen.getByRole("status", { name: "Accessible label" }),
    ).toBeInTheDocument();
  });

  it("does not render the internal label element when only aria-label is provided", () => {
    render(
      <SpinnerBase aria-label="Loading profile data" classMap={mockStyles} />,
    );

    expect(
      screen.getByRole("status", { name: "Loading profile data" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("spinner-label")).not.toBeInTheDocument();
  });

  it("does not render an internal label element when aria-labelledby is provided without label", () => {
    render(
      <>
        <span id="external-label">Fetching data</span>
        <SpinnerBase aria-labelledby="external-label" classMap={mockStyles} />
      </>,
    );

    expect(
      screen.getByRole("status", { name: "Fetching data" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("spinner-label")).not.toBeInTheDocument();
  });

  it("uses the external label instead of rendering an internal label when aria-labelledby is provided", () => {
    render(
      <>
        <span id="outside-label">Outside label</span>
        <SpinnerBase
          label="Inside label"
          aria-labelledby="outside-label"
          classMap={mockStyles}
        />
      </>,
    );

    const spinner = screen.getByRole("status", { name: "Outside label" });

    expect(spinner).toHaveAttribute("aria-labelledby", "outside-label");
    expect(spinner).not.toHaveAccessibleName("Inside label");
    expect(screen.queryByTestId("spinner-label")).not.toBeInTheDocument();
  });

  it("applies aria-describedby when provided", () => {
    render(
      <>
        <p id="spinner-description">Please wait while content loads.</p>
        <SpinnerBase
          aria-describedby="spinner-description"
          classMap={mockStyles}
        />
      </>,
    );

    const spinner = screen.getByRole("status", { name: "Loading" });

    expect(spinner).toHaveAttribute("aria-describedby", "spinner-description");
  });

  it("uses custom aria-live and aria-busy values", () => {
    render(
      <SpinnerBase
        aria-live="assertive"
        aria-busy={false}
        classMap={mockStyles}
      />,
    );

    const spinner = screen.getByTestId("spinner");

    expect(spinner).toHaveAttribute("aria-live", "assertive");
    expect(spinner).toHaveAttribute("aria-busy", "false");
  });

  it("supports a custom role", () => {
    render(
      <SpinnerBase
        role="alert"
        aria-label="Loading alert"
        classMap={mockStyles}
      />,
    );

    expect(
      screen.getByRole("alert", { name: "Loading alert" }),
    ).toBeInTheDocument();
  });

  it("marks decorative spinner parts as aria-hidden", () => {
    render(<SpinnerBase classMap={mockStyles} />);

    const ring = screen.getByTestId("spinner-ring");
    const shadow = ring.previousElementSibling as HTMLElement;

    expect(ring).toHaveAttribute("aria-hidden", "true");
    expect(shadow).toHaveAttribute("aria-hidden", "true");
  });

  it("supports a custom data-testid", () => {
    render(<SpinnerBase data-testid="loading-spinner" classMap={mockStyles} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner-ring")).toBeInTheDocument();
  });

  it("has no accessibility violations with visible label", async () => {
    const { container } = render(
      <SpinnerBase label="Loading dashboard" classMap={mockStyles} />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with aria-labelledby", async () => {
    const { container } = render(
      <>
        <span id="external-spinner-name">Loading reports</span>
        <SpinnerBase
          aria-labelledby="external-spinner-name"
          classMap={mockStyles}
        />
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
