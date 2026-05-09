import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseMetricBox from "@/components/MetricBox/MetricBoxBase";
import { FaUsers } from "react-icons/fa";

expect.extend(toHaveNoViolations);

const classNames = {
  wrapper: "metricWrapper",
  outline: "metricOutline",
  glass: "metricGlass",
  primary: "themePrimary",
  secondary: "themeSecondary",
  success: "stateSuccess",
  medium: "sizeMedium",
  large: "sizeLarge",
  center: "alignCenter",
  left: "alignLeft",
  icon: "metricIcon",
  content: "metricContent",
  title: "metricTitle",
  value: "metricValue",
  subtext: "metricSubtext",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
};

describe("BaseMetricBox", () => {
  it("renders all metric content with default accessible region semantics", () => {
    render(
      <BaseMetricBox
        title="New Users"
        value="12"
        subtext="Since yesterday"
        icon={FaUsers}
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    const region = screen.getByRole("region", { name: /new users/i });
    const title = screen.getByTestId("metric-box-title");
    const value = screen.getByTestId("metric-box-value");
    const subtext = screen.getByTestId("metric-box-subtext");
    const iconWrapper = screen.getByTestId("metric-box-icon");

    expect(region).toBeInTheDocument();
    expect(title.tagName).toBe("H3");
    expect(title).toHaveTextContent("New Users");
    expect(value).toHaveTextContent("12");
    expect(value).toHaveAttribute("aria-label", "12 New Users");
    expect(subtext).toHaveTextContent("Since yesterday");

    expect(region).toHaveAttribute("aria-labelledby", title.getAttribute("id"));
    expect(region).toHaveAttribute(
      "aria-describedby",
      subtext.getAttribute("id"),
    );

    expect(iconWrapper).toBeInTheDocument();
    expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    expect(iconWrapper.firstChild).toHaveAttribute("aria-hidden", "true");
    expect(iconWrapper.firstChild).toHaveAttribute("focusable", "false");
  });

  it("does not include aria-describedby when subtext is missing", () => {
    render(
      <BaseMetricBox
        title="Active Users"
        value="24"
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    const region = screen.getByRole("region", { name: /active users/i });

    expect(region).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByTestId("metric-box-subtext")).not.toBeInTheDocument();
  });

  it("does not render an icon wrapper when no icon is provided", () => {
    render(
      <BaseMetricBox
        title="Downloads"
        value="144"
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    expect(screen.queryByTestId("metric-box-icon")).not.toBeInTheDocument();
  });

  it("uses a custom aria-label and suppresses aria-labelledby when aria-label is provided", () => {
    render(
      <BaseMetricBox
        title="Revenue"
        value="$450"
        subtext="Updated hourly"
        aria-label="Revenue metric showing four hundred fifty dollars"
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    const region = screen.getByRole("region", {
      name: /revenue metric showing four hundred fifty dollars/i,
    });

    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute(
      "aria-label",
      "Revenue metric showing four hundred fifty dollars",
    );
    expect(region).not.toHaveAttribute("aria-labelledby");
    expect(region).toHaveAttribute("aria-describedby");
  });

  it("uses custom aria-labelledby and aria-describedby when supplied", () => {
    render(
      <>
        <span id="external-label">External Metric Label</span>
        <span id="external-description">External Metric Description</span>

        <BaseMetricBox
          title="Ignored Internal Title"
          value="88"
          subtext="Ignored internal subtext"
          aria-labelledby="external-label"
          aria-describedby="external-description"
          classMap={classNames}
          data-testid="metric-box"
        />
      </>,
    );

    const region = screen.getByRole("region", {
      name: /external metric label/i,
    });

    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-labelledby", "external-label");
    expect(region).toHaveAttribute("aria-describedby", "external-description");
  });

  it("applies aria-live and aria-atomic when provided", () => {
    render(
      <BaseMetricBox
        title="Live Metric"
        value="42"
        aria-live="polite"
        aria-atomic={true}
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    const region = screen.getByRole("region", { name: /live metric/i });

    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-atomic", "true");
  });

  it("renders a non-decorative icon with an accessible label when decorativeIcon is false", () => {
    render(
      <BaseMetricBox
        title="Team Members"
        value="18"
        icon={FaUsers}
        decorativeIcon={false}
        iconAriaLabel="Users icon"
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    const iconWrapper = screen.getByTestId("metric-box-icon");
    const svg = iconWrapper.firstChild as HTMLElement;

    expect(iconWrapper).not.toHaveAttribute("aria-hidden");
    expect(svg).not.toHaveAttribute("aria-hidden");
    expect(svg).toHaveAttribute("aria-label", "Users icon");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  it("applies style-related classes based on props", () => {
    render(
      <BaseMetricBox
        title="Styled Metric"
        value="300"
        subtext="With variants"
        theme="primary"
        state="success"
        size="large"
        align="left"
        outline={true}
        glass={true}
        shadow="medium"
        rounding="medium"
        className="customClass"
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    const wrapper = screen.getByTestId("metric-box");

    expect(wrapper).toHaveClass("metricWrapper");
    expect(wrapper).toHaveClass("metricOutline");
    expect(wrapper).toHaveClass("themePrimary");
    expect(wrapper).toHaveClass("stateSuccess");
    expect(wrapper).toHaveClass("sizeLarge");
    expect(wrapper).toHaveClass("alignLeft");
    expect(wrapper).toHaveClass("metricGlass");
    expect(wrapper).toHaveClass("shadowMedium");
    expect(wrapper).toHaveClass("roundMedium");
    expect(wrapper).toHaveClass("customClass");
  });

  it("applies custom class names to metric box sections", () => {
    render(
      <BaseMetricBox
        title="Custom Metric"
        value="42"
        subtext="Updated now"
        icon={FaUsers}
        iconClassName="custom-icon"
        contentClassName="custom-content"
        titleClassName="custom-title"
        valueClassName="custom-value"
        subtextClassName="custom-subtext"
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    expect(screen.getByTestId("metric-box-icon")).toHaveClass(
      "metricIcon",
      "custom-icon",
    );
    expect(screen.getByTestId("metric-box-title").parentElement).toHaveClass(
      "metricContent",
      "custom-content",
    );
    expect(screen.getByTestId("metric-box-title")).toHaveClass(
      "metricTitle",
      "custom-title",
    );
    expect(screen.getByTestId("metric-box-value")).toHaveClass(
      "metricValue",
      "custom-value",
    );
    expect(screen.getByTestId("metric-box-subtext")).toHaveClass(
      "metricSubtext",
      "custom-subtext",
    );
  });

  it("uses the value itself as the aria-label when title is unavailable", () => {
    render(
      <BaseMetricBox
        title={""}
        value="77"
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    const wrapper = screen.getByTestId("metric-box");
    const value = screen.getByTestId("metric-box-value");

    expect(wrapper).not.toHaveAttribute("role");
    expect(wrapper).not.toHaveAttribute("aria-labelledby");
    expect(value).toHaveAttribute("aria-label", "77");
    expect(screen.queryByTestId("metric-box-title")).not.toBeInTheDocument();
  });

  it("renders numeric values correctly", () => {
    render(
      <BaseMetricBox
        title="Projects"
        value={9}
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    const value = screen.getByTestId("metric-box-value");
    expect(value).toHaveTextContent("9");
    expect(value).toHaveAttribute("aria-label", "9 Projects");
  });

  it("renders content structure correctly", () => {
    render(
      <BaseMetricBox
        title="Members"
        value="120"
        subtext="Current total"
        icon={FaUsers}
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    expect(screen.getByTestId("metric-box")).toBeInTheDocument();
    expect(screen.getByTestId("metric-box-icon")).toBeInTheDocument();
    expect(screen.getByTestId("metric-box-title")).toBeInTheDocument();
    expect(screen.getByTestId("metric-box-value")).toBeInTheDocument();
    expect(screen.getByTestId("metric-box-subtext")).toBeInTheDocument();
  });

  it("has no accessibility violations with default semantics", async () => {
    const { container } = render(
      <BaseMetricBox
        title="A11y Metric"
        value="99"
        subtext="Accessible"
        icon={FaUsers}
        classMap={classNames}
        data-testid="metric-box"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with custom aria props and non-decorative icon", async () => {
    const { container } = render(
      <>
        <span id="metric-label">Custom Metric Label</span>
        <span id="metric-description">Custom Metric Description</span>

        <BaseMetricBox
          title="Users"
          value="72"
          icon={FaUsers}
          decorativeIcon={false}
          iconAriaLabel="User metric icon"
          aria-labelledby="metric-label"
          aria-describedby="metric-description"
          aria-live="polite"
          aria-atomic={true}
          classMap={classNames}
          data-testid="metric-box"
        />
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
