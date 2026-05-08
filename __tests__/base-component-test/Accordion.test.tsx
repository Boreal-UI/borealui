import { render, screen, fireEvent, act } from "@testing-library/react";
import { AccordionBase } from "@/components/Accordion/AccordionBase";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const styles = {
  accordion: "accordion",
  header: "accordionHeader",
  content: "accordionContent",
  icon: "accordionIcon",
  accordionTitle: "accordionTitle",
  expanded: "expanded",
  primary: "primary",
  secondary: "secondary",
  medium: "medium",
  small: "small",
  large: "large",
  outline: "outline",
  glass: "glass",
  disabled: "disabled",
  loading: "loading",
  shadowSmall: "shadowSmall",
  shadowMedium: "shadowMedium",
  shadowLarge: "shadowLarge",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  success: "success",
  warning: "warning",
  error: "error",
};

describe("AccordionBase (Jest)", () => {
  const getUniqueId = () => "unique-id";

  const renderAccordion = (props = {}) =>
    render(
      <AccordionBase
        title="Test Accordion"
        getUniqueId={getUniqueId}
        classMap={styles}
        data-testid="test"
        {...props}
      >
        <div>Accordion content</div>
      </AccordionBase>,
    );

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("renders title, collapsed by default, and toggles content in uncontrolled mode", () => {
    renderAccordion();

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    expect(screen.getByTestId("test-title")).toHaveTextContent(
      "Test Accordion",
    );
    expect(content).toHaveAttribute("data-state", "collapsed");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(content).toHaveAttribute("data-state", "open");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Accordion content")).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(content).toHaveAttribute("data-state", "collapsed");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("respects disabled state and does not toggle on click", () => {
    renderAccordion({ disabled: true });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute("aria-disabled", "true");
    expect(toggle).toHaveAttribute("tabindex", "-1");
    expect(content).toHaveAttribute("data-state", "collapsed");

    fireEvent.click(toggle);
    expect(content).toHaveAttribute("data-state", "collapsed");
  });

  it("respects disabled state and does not toggle on keyboard interaction", () => {
    renderAccordion({ disabled: true });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    fireEvent.keyDown(toggle, { key: "Enter" });
    expect(content).toHaveAttribute("data-state", "collapsed");

    fireEvent.keyDown(toggle, { key: " " });
    expect(content).toHaveAttribute("data-state", "collapsed");
  });

  it("honors initiallyExpanded", () => {
    renderAccordion({ initiallyExpanded: true });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    expect(content).toHaveAttribute("data-state", "open");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Accordion content")).toBeInTheDocument();
  });

  it("supports controlled mode and calls onToggle with the next value", () => {
    const onToggle = jest.fn();

    renderAccordion({
      expanded: false,
      onToggle,
    });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    expect(content).toHaveAttribute("data-state", "collapsed");

    fireEvent.click(toggle);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(true);

    expect(content).toHaveAttribute("data-state", "collapsed");
  });

  it("calls onToggle with false when controlled and currently expanded", () => {
    const onToggle = jest.fn();

    renderAccordion({
      expanded: true,
      onToggle,
    });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    expect(content).toHaveAttribute("data-state", "open");

    fireEvent.click(toggle);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("toggles with Enter key", () => {
    renderAccordion();

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    fireEvent.keyDown(toggle, { key: "Enter" });
    expect(content).toHaveAttribute("data-state", "open");

    fireEvent.keyDown(toggle, { key: "Enter" });
    expect(content).toHaveAttribute("data-state", "collapsed");
  });

  it("toggles with Space key", () => {
    renderAccordion();

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    fireEvent.keyDown(toggle, { key: " " });
    expect(content).toHaveAttribute("data-state", "open");

    fireEvent.keyDown(toggle, { key: " " });
    expect(content).toHaveAttribute("data-state", "collapsed");
  });

  it("does not toggle for unrelated keys", () => {
    renderAccordion();

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    fireEvent.keyDown(toggle, { key: "Escape" });
    expect(content).toHaveAttribute("data-state", "collapsed");

    fireEvent.keyDown(toggle, { key: "ArrowDown" });
    expect(content).toHaveAttribute("data-state", "collapsed");
  });

  it("renders description and wires generated aria-describedby correctly", () => {
    renderAccordion({
      description: "Helpful description for assistive tech",
    });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const description = screen.getByTestId("test-description");

    expect(description).toHaveTextContent(
      "Helpful description for assistive tech",
    );
    expect(description).toHaveAttribute("id", "unique-id-desc");
    expect(toggle).toHaveAttribute("aria-describedby", "unique-id-desc");
  });

  it("merges generated description id with external aria-describedby", () => {
    renderAccordion({
      description: "Helpful description for assistive tech",
      "aria-describedby": "external-description",
    });

    const toggle = screen.getByTestId("test-accordion-toggle");

    expect(toggle).toHaveAttribute(
      "aria-describedby",
      "unique-id-desc external-description",
    );
  });

  it("uses external aria-describedby when description is not provided", () => {
    renderAccordion({
      "aria-describedby": "external-description",
    });

    const toggle = screen.getByTestId("test-accordion-toggle");
    expect(toggle).toHaveAttribute("aria-describedby", "external-description");
  });

  it("does not set aria-describedby when neither description nor external description is provided", () => {
    renderAccordion();

    const toggle = screen.getByTestId("test-accordion-toggle");
    expect(toggle).not.toHaveAttribute("aria-describedby");
  });

  it("applies aria-label to the toggle button", () => {
    renderAccordion({
      "aria-label": "Accordion toggle label",
    });

    const toggle = screen.getByRole("button", {
      name: "Accordion toggle label",
    });

    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-label", "Accordion toggle label");
  });

  it("applies aria-labelledby to the toggle button", () => {
    render(
      <>
        <span id="external-toggle-label">External accordion label</span>
        <AccordionBase
          title="Test Accordion"
          getUniqueId={getUniqueId}
          classMap={styles}
          data-testid="test"
          aria-labelledby="external-toggle-label"
        >
          <div>Accordion content</div>
        </AccordionBase>
      </>,
    );

    const toggle = screen.getByRole("button", {
      name: "External accordion label",
    });

    expect(toggle).toHaveAttribute("aria-labelledby", "external-toggle-label");
    expect(toggle).not.toHaveAttribute("aria-label");
  });

  it("wires aria-controls, aria-labelledby, and ids correctly with generated id", () => {
    renderAccordion();

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    expect(toggle).toHaveAttribute("id", "unique-id-button");
    expect(toggle).toHaveAttribute("aria-controls", "unique-id-content");

    expect(content).toHaveAttribute("id", "unique-id-content");
    expect(content).toHaveAttribute("role", "region");
    expect(content).toHaveAttribute("aria-labelledby", "unique-id-button");
  });

  it("uses provided id prop instead of generated id", () => {
    renderAccordion({ id: "custom-id" });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    expect(toggle).toHaveAttribute("id", "custom-id-button");
    expect(toggle).toHaveAttribute("aria-controls", "custom-id-content");
    expect(content).toHaveAttribute("id", "custom-id-content");
    expect(content).toHaveAttribute("aria-labelledby", "custom-id-button");
  });

  it("applies regionAriaLabel to the content region", () => {
    renderAccordion({
      regionAriaLabel: "Accordion panel details",
    });

    const content = screen.getByRole("region", {
      name: "Accordion panel details",
    });

    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("aria-label", "Accordion panel details");
    expect(content).not.toHaveAttribute("aria-labelledby");
  });

  it("applies regionAriaLabelledBy to the content region", () => {
    render(
      <>
        <span id="external-region-label">External region label</span>
        <AccordionBase
          title="Test Accordion"
          getUniqueId={getUniqueId}
          classMap={styles}
          data-testid="test"
          regionAriaLabelledBy="external-region-label"
        >
          <div>Accordion content</div>
        </AccordionBase>
      </>,
    );

    const content = screen.getByRole("region", {
      name: "External region label",
    });

    expect(content).toHaveAttribute("aria-labelledby", "external-region-label");
    expect(content).not.toHaveAttribute("aria-label");
  });

  it("applies regionAriaDescribedBy to the content region", () => {
    render(
      <>
        <span id="external-region-description">
          External region description
        </span>
        <AccordionBase
          title="Test Accordion"
          getUniqueId={getUniqueId}
          classMap={styles}
          data-testid="test"
          regionAriaDescribedBy="external-region-description"
        >
          <div>Accordion content</div>
        </AccordionBase>
      </>,
    );

    const content = screen.getByTestId("test-content");
    expect(content).toHaveAttribute(
      "aria-describedby",
      "external-region-description",
    );
  });

  it("renders default collapsed icon and expanded icon", () => {
    renderAccordion();

    const toggle = screen.getByTestId("test-accordion-toggle");
    const icon = screen.getByTestId("test-icon");

    expect(icon).toHaveTextContent("+");

    fireEvent.click(toggle);
    expect(icon).toHaveTextContent("−");
  });

  it("renders custom collapsed and expanded icons", () => {
    renderAccordion({
      customCollapsedIcon: "OPEN",
      customExpandedIcon: "CLOSE",
    });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const icon = screen.getByTestId("test-icon");

    expect(icon).toHaveTextContent("OPEN");

    fireEvent.click(toggle);
    expect(icon).toHaveTextContent("CLOSE");
  });

  it("renders icon on the right by default", () => {
    renderAccordion();

    const toggle = screen.getByTestId("test-accordion-toggle");
    const children = Array.from(toggle.children);

    expect(children[0]).toHaveAttribute("data-testid", "test-title");
    expect(children[1]).toHaveAttribute("data-testid", "test-icon");
  });

  it("renders icon on the left when iconPosition is left", () => {
    renderAccordion({ iconPosition: "left" });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const children = Array.from(toggle.children);

    expect(children[0]).toHaveAttribute("data-testid", "test-icon");
    expect(children[1]).toHaveAttribute("data-testid", "test-title");
  });

  it("prevents collapsing when isToggleable is false and already expanded", () => {
    renderAccordion({
      initiallyExpanded: true,
      isToggleable: false,
    });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    expect(content).toHaveAttribute("data-state", "open");

    fireEvent.click(toggle);
    expect(content).toHaveAttribute("data-state", "open");
  });

  it("still allows opening when isToggleable is false and currently collapsed", () => {
    renderAccordion({
      isToggleable: false,
    });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");

    expect(content).toHaveAttribute("data-state", "collapsed");

    fireEvent.click(toggle);
    expect(content).toHaveAttribute("data-state", "open");
  });

  it("does not render children initially when lazyLoad is true and never expanded", () => {
    renderAccordion({ lazyLoad: true });

    expect(screen.queryByText("Accordion content")).not.toBeInTheDocument();
  });

  it("renders children after first expansion when lazyLoad is true", () => {
    renderAccordion({ lazyLoad: true });

    const toggle = screen.getByTestId("test-accordion-toggle");

    expect(screen.queryByText("Accordion content")).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByText("Accordion content")).toBeInTheDocument();
  });

  it("keeps children mounted after collapsing once lazyLoad content has been expanded", () => {
    renderAccordion({ lazyLoad: true });

    const toggle = screen.getByTestId("test-accordion-toggle");

    fireEvent.click(toggle);
    expect(screen.getByText("Accordion content")).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByText("Accordion content")).toBeInTheDocument();
    expect(screen.getByTestId("test-content")).toHaveAttribute(
      "data-state",
      "collapsed",
    );
  });

  it("renders asyncContent loader with default message and then content", () => {
    jest.useFakeTimers();

    renderAccordion({
      initiallyExpanded: true,
      asyncContent: true,
    });

    const content = screen.getByTestId("test-content");

    expect(screen.getByTestId("test-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading content")).toBeInTheDocument();
    expect(content).toHaveAttribute("aria-busy", "true");
    expect(content).toHaveAttribute("aria-describedby", "unique-id-loading");
    expect(screen.queryByText("Accordion content")).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByTestId("test-loading")).not.toBeInTheDocument();
    expect(content).not.toHaveAttribute("aria-busy");
    expect(content).not.toHaveAttribute("aria-describedby");
    expect(screen.getByText("Accordion content")).toBeInTheDocument();
  });

  it("renders asyncContent loader with custom loadingAriaLabel", () => {
    jest.useFakeTimers();

    renderAccordion({
      initiallyExpanded: true,
      asyncContent: true,
      loadingAriaLabel: "Fetching accordion panel",
    });

    const loading = screen.getByTestId("test-loading");

    expect(loading).toHaveTextContent("Fetching accordion panel");
    expect(loading).toHaveAttribute("aria-live", "polite");
    expect(loading).toHaveAttribute("aria-atomic", "true");
  });

  it("does not show async loader while collapsed", () => {
    jest.useFakeTimers();

    renderAccordion({
      asyncContent: true,
    });

    expect(screen.queryByTestId("test-loading")).not.toBeInTheDocument();
    expect(screen.getByText("Accordion content")).toBeInTheDocument();
    expect(screen.getByTestId("test-content")).toHaveAttribute(
      "data-state",
      "collapsed",
    );
    expect(screen.getByTestId("test-content")).not.toHaveAttribute("aria-busy");
  });

  it("combines regionAriaDescribedBy with the loading id while async loader is visible", () => {
    jest.useFakeTimers();

    render(
      <>
        <span id="external-region-description">
          External region description
        </span>
        <AccordionBase
          title="Test Accordion"
          getUniqueId={getUniqueId}
          classMap={styles}
          data-testid="test"
          initiallyExpanded={true}
          asyncContent={true}
          regionAriaDescribedBy="external-region-description"
        >
          <div>Accordion content</div>
        </AccordionBase>
      </>,
    );

    const content = screen.getByTestId("test-content");

    expect(content).toHaveAttribute(
      "aria-describedby",
      "external-region-description unique-id-loading",
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(content).toHaveAttribute(
      "aria-describedby",
      "external-region-description",
    );
  });

  it("restarts the async loader when reopened", () => {
    jest.useFakeTimers();

    renderAccordion({
      asyncContent: true,
    });

    const toggle = screen.getByTestId("test-accordion-toggle");

    fireEvent.click(toggle);
    expect(screen.getByTestId("test-loading")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByTestId("test-loading")).not.toBeInTheDocument();
    expect(screen.getByText("Accordion content")).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByTestId("test-content")).toHaveAttribute(
      "data-state",
      "collapsed",
    );

    fireEvent.click(toggle);
    expect(screen.getByTestId("test-loading")).toBeInTheDocument();
  });

  it("applies wrapper, header, content, and icon classes based on props and state", () => {
    renderAccordion({
      theme: "primary",
      size: "medium",
      state: "success",
      outline: true,
      glass: true,
      initiallyExpanded: true,
      disabled: false,
      className: "customClassName",
      shadow: "medium",
      rounding: "large",
    });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const content = screen.getByTestId("test-content");
    const icon = screen.getByTestId("test-icon");

    const wrapper = toggle.parentElement;

    expect(wrapper).toHaveClass("accordion");
    expect(wrapper).toHaveClass("medium");
    expect(wrapper).toHaveClass("success");
    expect(wrapper).toHaveClass("glass");
    expect(wrapper).toHaveClass("shadowMedium");
    expect(wrapper).toHaveClass("roundLarge");
    expect(wrapper).toHaveClass("expanded");
    expect(wrapper).toHaveClass("customClassName");

    expect(toggle).toHaveClass("accordionHeader");
    expect(toggle).toHaveClass("primary");
    expect(toggle).toHaveClass("success");
    expect(toggle).toHaveClass("outline");
    expect(toggle).toHaveClass("glass");
    expect(toggle).toHaveClass("expanded");

    expect(content).toHaveClass("accordionContent");
    expect(content).toHaveClass("primary");
    expect(content).toHaveClass("success");
    expect(content).toHaveClass("glass");
    expect(content).toHaveClass("expanded");

    expect(icon).toHaveClass("accordionIcon");
    expect(icon).toHaveClass("expanded");
  });

  it("applies disabled classes when disabled", () => {
    renderAccordion({
      disabled: true,
      initiallyExpanded: true,
    });

    const toggle = screen.getByTestId("test-accordion-toggle");
    const wrapper = toggle.parentElement;

    expect(wrapper).toHaveClass("disabled");
    expect(toggle).toHaveClass("disabled");
  });

  it("supports rendering without a custom data-testid prop by falling back to default", () => {
    render(
      <AccordionBase
        title="Fallback Test Id"
        getUniqueId={getUniqueId}
        classMap={styles}
      >
        <div>Fallback content</div>
      </AccordionBase>,
    );

    expect(
      screen.getByTestId("accordion-accordion-toggle"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("accordion-title")).toBeInTheDocument();
    expect(screen.getByTestId("accordion-icon")).toBeInTheDocument();
    expect(screen.getByTestId("accordion-content")).toBeInTheDocument();
  });

  it("forwards extra non-accessibility props to the wrapper element", () => {
    render(
      <AccordionBase
        title="Forward Props"
        getUniqueId={getUniqueId}
        classMap={styles}
        data-testid="test"
        data-surface="wrapper"
      >
        <div>Forwarded content</div>
      </AccordionBase>,
    );

    const wrapper = screen.getByTestId("test-accordion-toggle").parentElement;
    expect(wrapper).toHaveAttribute("data-surface", "wrapper");
  });

  it("has no accessibility violations when collapsed", async () => {
    const { container } = renderAccordion();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when expanded with description", async () => {
    const { container } = renderAccordion({
      initiallyExpanded: true,
      description: "Accordion helper description",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations while async loader is visible", async () => {
    const { container } = renderAccordion({
      initiallyExpanded: true,
      asyncContent: true,
      loadingAriaLabel: "Fetching accordion content",
    });

    expect(screen.getByTestId("test-loading")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
