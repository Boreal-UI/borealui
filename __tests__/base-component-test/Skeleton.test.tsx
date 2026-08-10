import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import SkeletonBase from "@/components/Skeleton/SkeletonBase";

expect.extend(toHaveNoViolations);

const classMap = {
  skeleton: "skeleton-base",
  animated: "skeleton-animated",
  shadowNone: "shadow-none",
  shadowLight: "shadow-light",
  shadowMedium: "shadow-medium",
  shadowStrong: "shadow-strong",
  shadowIntense: "shadow-intense",
  roundNone: "round-none",
  roundSmall: "round-small",
  roundMedium: "round-medium",
  roundLarge: "round-large",
  roundFull: "round-full",
};

describe("SkeletonBase", () => {
  it("renders with default accessibility attributes and fallback description", () => {
    render(<SkeletonBase classMap={classMap} data-testid="skeleton-loader" />);

    const skeleton = screen.getByTestId("skeleton-loader");
    const description = screen.getByTestId("skeleton-loader-description");

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("role", "status");
    expect(skeleton).toHaveAttribute("aria-live", "polite");
    expect(skeleton).toHaveAttribute("aria-busy", "true");
    expect(skeleton).toHaveAttribute("aria-relevant", "additions text");
    expect(skeleton).toHaveAttribute(
      "aria-describedby",
      "skeleton-loader-desc",
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveAttribute("id", "skeleton-loader-desc");
    expect(description).toHaveTextContent("Loading content...");
  });

  it("renders with specified dimensions and custom class name", () => {
    render(
      <SkeletonBase
        width="150px"
        height="80px"
        className="custom-skeleton"
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const skeleton = screen.getByTestId("skeleton-loader");

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle({ width: "150px", height: "80px" });
    expect(skeleton).toHaveClass("skeleton-base");
    expect(skeleton).toHaveClass("skeleton-animated");
    expect(skeleton).toHaveClass("custom-skeleton");
  });

  it("renders numeric width and height as pixel values", () => {
    render(
      <SkeletonBase
        width={120}
        height={48}
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const skeleton = screen.getByTestId("skeleton-loader");
    expect(skeleton).toHaveStyle({ width: "120px", height: "48px" });
  });

  it("applies shadow and rounding classes", () => {
    render(
      <SkeletonBase
        shadow="medium"
        rounding="large"
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const skeleton = screen.getByTestId("skeleton-loader");
    expect(skeleton).toHaveClass("shadow-medium");
    expect(skeleton).toHaveClass("round-large");
  });

  it("does not apply animation class when animate is false", () => {
    render(
      <SkeletonBase
        animate={false}
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const skeleton = screen.getByTestId("skeleton-loader");
    expect(skeleton).toHaveClass("skeleton-base");
    expect(skeleton).not.toHaveClass("skeleton-animated");
  });

  it("uses a custom label for the fallback description", () => {
    render(
      <SkeletonBase
        label="Loading profile card"
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    expect(screen.getByTestId("skeleton-loader-description")).toHaveTextContent(
      "Loading profile card",
    );
  });

  it("does not render a description or live-region defaults when announce is false", () => {
    render(
      <SkeletonBase
        announce={false}
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const skeleton = screen.getByTestId("skeleton-loader");

    expect(skeleton).not.toHaveAttribute("role");
    expect(skeleton).not.toHaveAttribute("aria-live");
    expect(skeleton).not.toHaveAttribute("aria-describedby");
    expect(skeleton).toHaveAttribute("aria-hidden", "false");
    expect(
      screen.queryByTestId("skeleton-loader-description"),
    ).not.toBeInTheDocument();
  });

  it("hides the skeleton from assistive technology when aria-hidden is true", () => {
    render(
      <SkeletonBase
        aria-hidden={true}
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const skeleton = screen.getByTestId("skeleton-loader");

    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).not.toHaveAttribute("role");
    expect(skeleton).not.toHaveAttribute("aria-live");
    expect(skeleton).not.toHaveAttribute("aria-describedby");
    expect(
      screen.queryByTestId("skeleton-loader-description"),
    ).not.toBeInTheDocument();
  });

  it("uses aria-label when provided and does not render fallback description", () => {
    render(
      <SkeletonBase
        aria-label="Loading chart"
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const skeleton = screen.getByTestId("skeleton-loader");

    expect(skeleton).toHaveAttribute("role", "status");
    expect(skeleton).toHaveAttribute("aria-label", "Loading chart");
    expect(skeleton).not.toHaveAttribute("aria-describedby");
    expect(
      screen.queryByTestId("skeleton-loader-description"),
    ).not.toBeInTheDocument();
  });

  it("uses aria-labelledby when provided and does not render fallback description", () => {
    render(
      <>
        <span id="external-skeleton-label">External skeleton label</span>
        <SkeletonBase
          aria-labelledby="external-skeleton-label"
          classMap={classMap}
          data-testid="skeleton-loader"
        />
      </>,
    );

    const skeleton = screen.getByTestId("skeleton-loader");

    expect(skeleton).toHaveAttribute(
      "aria-labelledby",
      "external-skeleton-label",
    );
    expect(skeleton).not.toHaveAttribute("aria-describedby");
    expect(
      screen.queryByTestId("skeleton-loader-description"),
    ).not.toBeInTheDocument();
  });

  it("merges external aria-describedby with internal fallback description when announcing", () => {
    render(
      <>
        <p id="external-description">Extra loading context</p>
        <SkeletonBase
          aria-describedby="external-description"
          classMap={classMap}
          data-testid="skeleton-loader"
        />
      </>,
    );

    const skeleton = screen.getByTestId("skeleton-loader");
    const description = screen.getByTestId("skeleton-loader-description");

    expect(description).toBeInTheDocument();
    expect(skeleton).toHaveAttribute(
      "aria-describedby",
      `external-description ${description.id}`,
    );
  });

  it("applies custom aria-live and aria-busy values when provided", () => {
    render(
      <SkeletonBase
        aria-live="assertive"
        aria-busy={false}
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const skeleton = screen.getByTestId("skeleton-loader");

    expect(skeleton).toHaveAttribute("aria-live", "assertive");
    expect(skeleton).toHaveAttribute("aria-busy", "false");
  });

  it("applies a custom role when provided during announce mode", () => {
    render(
      <SkeletonBase
        role="alert"
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    expect(screen.getByTestId("skeleton-loader")).toHaveAttribute(
      "role",
      "alert",
    );
  });

  it("passes accessibility props through when announce is false", () => {
    render(
      <SkeletonBase
        announce={false}
        role="presentation"
        aria-label="Decorative loading block"
        aria-describedby="external-description"
        aria-busy={false}
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const skeleton = screen.getByTestId("skeleton-loader");

    expect(skeleton).toHaveAttribute("role", "presentation");
    expect(skeleton).toHaveAttribute("aria-label", "Decorative loading block");
    expect(skeleton).toHaveAttribute(
      "aria-describedby",
      "external-description",
    );
    expect(skeleton).toHaveAttribute("aria-busy", "false");
    expect(skeleton).toHaveAttribute("aria-hidden", "false");
  });

  it("renders as a custom intrinsic element", () => {
    render(
      <SkeletonBase
        as="section"
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const skeleton = screen.getByTestId("skeleton-loader");
    expect(skeleton.tagName.toLowerCase()).toBe("section");
  });

  it("uses the default test id when none is provided", () => {
    render(<SkeletonBase classMap={classMap} />);

    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
    expect(
      screen.getByTestId("skeleton-loader-description"),
    ).toBeInTheDocument();
  });

  it("has no accessibility violations in default state", async () => {
    const { container } = render(<SkeletonBase classMap={classMap} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when using aria-label", async () => {
    const { container } = render(
      <SkeletonBase
        aria-label="Loading dashboard widgets"
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when hidden from assistive technology", async () => {
    const { container } = render(
      <SkeletonBase
        aria-hidden={true}
        classMap={classMap}
        data-testid="skeleton-loader"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
