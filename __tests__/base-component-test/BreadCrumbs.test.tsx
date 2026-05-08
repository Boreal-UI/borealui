import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { BreadcrumbsBase } from "@/components/Breadcrumbs/BreadcrumbsBase";
import { ELLIPSIS_LABEL } from "@/components/Breadcrumbs/BreadcrumbsBase";
import { DummyButton, DummyLinkComponent } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const classMap = {
  breadcrumbs: "breadcrumbs",

  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",

  success: "success",
  warning: "warning",
  error: "error",
  clear: "clear",

  xs: "xs",
  small: "small",
  medium: "medium",
  large: "large",
  xl: "xl",

  outline: "outline",
  glass: "glass",
  disabled: "disabled",

  shadowNone: "shadowNone",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  shadowIntense: "shadowIntense",

  roundNone: "roundNone",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  roundFull: "roundFull",

  list: "breadcrumb-list",
  item: "breadcrumb-item",
  item_animate: "animate",
  item_active: "active",
  ellipsis: "ellipsis",
  link: "breadcrumb-link",
  link_label: "link-label",
  link_disabled: "link-disabled",
  current: "current-page",
  separator: "separator",
  separatorIcon: "separator-icon",
};

describe("BreadcrumbsBase", () => {
  const defaultItems = [
    { label: "Home", href: "/" },
    { label: "Library", href: "/library" },
    { label: "Current Page" },
  ];

  const renderBreadcrumbs = (
    props: Partial<React.ComponentProps<typeof BreadcrumbsBase>> = {},
  ) =>
    render(
      <BreadcrumbsBase
        items={defaultItems}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        data-testid="breadcrumbs"
        {...props}
      />,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders null when items are empty", () => {
    const { container } = render(
      <BreadcrumbsBase
        items={[]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        data-testid="breadcrumbs"
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders null when items are not provided", () => {
    const { container } = render(
      <BreadcrumbsBase
        items={undefined as never}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        data-testid="breadcrumbs"
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders nav, list, and all breadcrumb items", () => {
    renderBreadcrumbs();

    expect(screen.getByTestId("breadcrumbs-nav-container")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs-nav-list")).toBeInTheDocument();

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Library")).toBeInTheDocument();
    expect(screen.getByText("Current Page")).toBeInTheDocument();

    expect(screen.getAllByTestId("breadcrumbs-nav-item")).toHaveLength(3);
  });

  it('uses the provided "aria-label"', () => {
    renderBreadcrumbs({ "aria-label": "Breadcrumb trail" });

    const nav = screen.getByRole("navigation", { name: "Breadcrumb trail" });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb trail");
  });

  it('uses the default "aria-label"', () => {
    renderBreadcrumbs();

    const nav = screen.getByRole("navigation", { name: "Breadcrumbs" });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("aria-label", "Breadcrumbs");
  });

  it('uses "aria-labelledby" instead of the internal aria-label when both are provided', () => {
    render(
      <>
        <span id="external-breadcrumb-label">External breadcrumb label</span>
        <BreadcrumbsBase
          items={defaultItems}
          classMap={classMap}
          LinkComponent={DummyLinkComponent}
          ButtonComponent={DummyButton}
          data-testid="breadcrumbs"
          aria-label="Internal breadcrumb label"
          aria-labelledby="external-breadcrumb-label"
        />
      </>,
    );

    const nav = screen.getByRole("navigation", {
      name: "External breadcrumb label",
    });

    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("aria-labelledby", "external-breadcrumb-label");
    expect(nav).not.toHaveAttribute("aria-label", "Internal breadcrumb label");
  });

  it('applies "aria-describedby" to the nav container', () => {
    render(
      <>
        <p id="breadcrumb-description">This shows your current location.</p>
        <BreadcrumbsBase
          items={defaultItems}
          classMap={classMap}
          LinkComponent={DummyLinkComponent}
          ButtonComponent={DummyButton}
          data-testid="breadcrumbs"
          aria-describedby="breadcrumb-description"
        />
      </>,
    );

    const nav = screen.getByTestId("breadcrumbs-nav-container");
    expect(nav).toHaveAttribute("aria-describedby", "breadcrumb-description");
  });

  it("passes through additional native HTML attributes to the nav", () => {
    renderBreadcrumbs({
      id: "main-breadcrumbs",
      role: "navigation",
      tabIndex: 0,
      title: "Breadcrumb navigation",
    });

    const nav = screen.getByTestId("breadcrumbs-nav-container");
    expect(nav).toHaveAttribute("id", "main-breadcrumbs");
    expect(nav).toHaveAttribute("role", "navigation");
    expect(nav).toHaveAttribute("tabindex", "0");
    expect(nav).toHaveAttribute("title", "Breadcrumb navigation");
  });

  it("renders linked breadcrumb items for non-last items with href", () => {
    renderBreadcrumbs();

    const links = screen.getAllByTestId("breadcrumbs-nav-item-label");
    expect(links).toHaveLength(2);

    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/library");

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Library")).toBeInTheDocument();
  });

  it("renders the last breadcrumb as the current page", () => {
    renderBreadcrumbs();

    const current = screen.getByTestId("breadcrumbs-nav-item-current");
    expect(current).toBeInTheDocument();
    expect(current).toHaveTextContent("Current Page");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveClass("current-page");
  });

  it("renders items without href as current page when they are last", () => {
    render(
      <BreadcrumbsBase
        items={[{ label: "Home", href: "/" }, { label: "Section" }]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        data-testid="breadcrumbs"
      />,
    );

    expect(screen.getByText("Section")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs-nav-item-current")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it('applies item-level "aria-label" to interactive breadcrumb links', () => {
    render(
      <BreadcrumbsBase
        items={[
          { label: "Docs", href: "/docs", "aria-label": "Documentation home" },
          { label: "API", href: "/docs/api" },
          { label: "Hooks" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        data-testid="breadcrumbs"
      />,
    );

    const link = screen.getByLabelText("Documentation home");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/docs");
  });

  it('applies item-level "aria-label" to the current page item', () => {
    render(
      <BreadcrumbsBase
        items={[
          { label: "Home", href: "/" },
          { label: "Profile", "aria-label": "Current profile page" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        data-testid="breadcrumbs"
      />,
    );

    const current = screen.getByLabelText("Current profile page");
    expect(current).toBeInTheDocument();
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("uses item title when provided for interactive links", () => {
    render(
      <BreadcrumbsBase
        items={[
          { label: "Home", href: "/", title: "Go to home page" },
          { label: "Library", href: "/library" },
          { label: "Current Page" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        data-testid="breadcrumbs"
      />,
    );

    const link = screen.getAllByTestId("breadcrumbs-nav-item-label")[0];
    expect(link).toHaveAttribute("title", "Go to home page");
  });

  it("falls back to the label for title when no item title is provided", () => {
    renderBreadcrumbs();

    const links = screen.getAllByTestId("breadcrumbs-nav-item-label");
    expect(links[0]).toHaveAttribute("title", "Home");
    expect(links[1]).toHaveAttribute("title", "Library");
  });

  it("uses item title when provided for the current page item", () => {
    render(
      <BreadcrumbsBase
        items={[
          { label: "Home", href: "/" },
          { label: "Settings", title: "Current settings page" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        data-testid="breadcrumbs"
      />,
    );

    const current = screen.getByTestId("breadcrumbs-nav-item-current");
    expect(current).toHaveAttribute("title", "Current settings page");
  });

  it("renders separators between non-last items", () => {
    renderBreadcrumbs();

    const separators = screen.getAllByText((_, element) => {
      return element?.className === "separator";
    });

    expect(separators).toHaveLength(2);
  });

  it("renders a custom separator", () => {
    renderBreadcrumbs({
      separator: <span data-testid="custom-separator">/</span>,
    });

    const separators = screen.getAllByTestId("custom-separator");
    expect(separators).toHaveLength(2);
  });

  it("shows ellipsis when maxVisible truncates the list", () => {
    render(
      <BreadcrumbsBase
        items={[
          { label: "1", href: "/1" },
          { label: "2", href: "/2" },
          { label: "3", href: "/3" },
          { label: "4", href: "/4" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        maxVisible={3}
        data-testid="breadcrumbs"
      />,
    );

    expect(screen.getByTestId("breadcrumbs-ellipsis")).toBeInTheDocument();
    expect(screen.getByLabelText("Show all breadcrumbs")).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(ELLIPSIS_LABEL)).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("expands truncated breadcrumbs when ellipsis is clicked", () => {
    render(
      <BreadcrumbsBase
        items={[
          { label: "1", href: "/1" },
          { label: "2", href: "/2" },
          { label: "3", href: "/3" },
          { label: "4", href: "/4" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        maxVisible={3}
        data-testid="breadcrumbs"
      />,
    );

    const ellipsis = screen.getByLabelText("Show all breadcrumbs");
    expect(ellipsis).toBeInTheDocument();
    expect(ellipsis).toHaveAttribute("aria-expanded", "false");

    expect(screen.queryByText("2")).not.toBeInTheDocument();
    expect(screen.queryByText("3")).not.toBeInTheDocument();

    fireEvent.click(ellipsis);

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Show all breadcrumbs"),
    ).not.toBeInTheDocument();
  });

  it("does not render ellipsis when item count is within maxVisible", () => {
    renderBreadcrumbs({ maxVisible: 5 });

    expect(
      screen.queryByTestId("breadcrumbs-ellipsis"),
    ).not.toBeInTheDocument();
  });

  it("renders disabled non-last links as non-interactive labels", () => {
    renderBreadcrumbs({ disabled: true });

    const labels = screen.getAllByTestId("breadcrumbs-nav-item-label");
    expect(labels).toHaveLength(2);

    expect(labels[0].tagName).toBe("SPAN");
    expect(labels[1].tagName).toBe("SPAN");

    expect(labels[0]).toHaveTextContent("Home");
    expect(labels[1]).toHaveTextContent("Library");

    expect(labels[0]).toHaveClass("link-disabled");
    expect(labels[1]).toHaveClass("link-disabled");
    expect(labels[0]).toHaveAttribute("aria-disabled", "true");
    expect(labels[1]).toHaveAttribute("aria-disabled", "true");
  });

  it("renders an item-level disabled breadcrumb as a non-interactive label", () => {
    render(
      <BreadcrumbsBase
        items={[
          { label: "Home", href: "/" },
          { label: "Library", href: "/library", disabled: true },
          { label: "Current Page" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        data-testid="breadcrumbs"
      />,
    );

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");

    const disabledItem = screen.getByText("Library");
    expect(disabledItem.tagName).toBe("SPAN");
    expect(disabledItem).toHaveClass("link-disabled");
    expect(disabledItem).toHaveAttribute("aria-disabled", "true");
  });

  it("applies disabled styling to an item-level disabled breadcrumb item", () => {
    render(
      <BreadcrumbsBase
        items={[
          { label: "Home", href: "/", disabled: true },
          { label: "Current Page" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        data-testid="breadcrumbs"
      />,
    );

    const items = screen.getAllByTestId("breadcrumbs-nav-item");
    expect(items[0]).toHaveClass("disabled");
  });

  it("disables ellipsis button when breadcrumbs are disabled", () => {
    render(
      <BreadcrumbsBase
        items={[
          { label: "1", href: "/1" },
          { label: "2", href: "/2" },
          { label: "3", href: "/3" },
          { label: "4", href: "/4" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        maxVisible={3}
        disabled
        data-testid="breadcrumbs"
      />,
    );

    const ellipsis = screen.getByTestId("breadcrumbs-ellipsis");
    expect(ellipsis).toBeDisabled();
    expect(ellipsis).toHaveAttribute("tabindex", "-1");
    expect(ellipsis).toHaveAttribute("aria-disabled", "true");

    fireEvent.click(ellipsis);
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("applies item_animate class to visible items after expanding", () => {
    render(
      <BreadcrumbsBase
        items={[
          { label: "1", href: "/1" },
          { label: "2", href: "/2" },
          { label: "3", href: "/3" },
          { label: "4", href: "/4" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        maxVisible={3}
        data-testid="breadcrumbs"
      />,
    );

    fireEvent.click(screen.getByTestId("breadcrumbs-ellipsis"));

    const items = screen.getAllByTestId("breadcrumbs-nav-item");
    const animatedItems = items.filter((item) =>
      item.className.includes("animate"),
    );

    expect(animatedItems.length).toBeGreaterThan(0);
  });

  it("applies active class to the last visible item", () => {
    renderBreadcrumbs();

    const items = screen.getAllByTestId("breadcrumbs-nav-item");
    expect(items[items.length - 1]).toHaveClass("active");
  });

  it("applies wrapper classes from props", () => {
    renderBreadcrumbs({
      theme: "primary",
      state: "success",
      size: "medium",
      shadow: "light",
      rounding: "small",
      outline: true,
      glass: true,
      disabled: true,
      className: "custom-breadcrumbs-class",
    });

    const nav = screen.getByTestId("breadcrumbs-nav-container");

    expect(nav).toHaveClass("breadcrumbs");
    expect(nav).toHaveClass("primary");
    expect(nav).toHaveClass("success");
    expect(nav).toHaveClass("medium");
    expect(nav).toHaveClass("shadowLight");
    expect(nav).toHaveClass("roundSmall");
    expect(nav).toHaveClass("outline");
    expect(nav).toHaveClass("glass");
    expect(nav).toHaveClass("disabled");
    expect(nav).toHaveClass("custom-breadcrumbs-class");
  });

  it("applies the list class", () => {
    renderBreadcrumbs();

    expect(screen.getByTestId("breadcrumbs-nav-list")).toHaveClass(
      "breadcrumb-list",
    );
  });

  it("applies the link class to interactive breadcrumb links", () => {
    renderBreadcrumbs();

    const links = screen.getAllByTestId("breadcrumbs-nav-item-label");
    expect(links[0]).toHaveClass("breadcrumb-link");
    expect(links[1]).toHaveClass("breadcrumb-link");
  });

  it("applies the link label class to inner link text", () => {
    renderBreadcrumbs();

    const homeText = screen.getByText("Home");
    const libraryText = screen.getByText("Library");

    expect(homeText).toHaveClass("link-label");
    expect(libraryText).toHaveClass("link-label");
  });

  it("uses the default test id when none is provided", () => {
    render(
      <BreadcrumbsBase
        items={defaultItems}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
      />,
    );

    expect(screen.getByTestId("breadcrumbs-nav-container")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumbs-nav-list")).toBeInTheDocument();
  });

  it("renders schema.org BreadcrumbList metadata", () => {
    renderBreadcrumbs();

    const list = screen.getByTestId("breadcrumbs-nav-list");
    expect(list).toHaveAttribute("itemscope");
    expect(list).toHaveAttribute(
      "itemtype",
      "https://schema.org/BreadcrumbList",
    );

    const items = screen.getAllByTestId("breadcrumbs-nav-item");
    expect(items[0]).toHaveAttribute("itemprop", "itemListElement");
    expect(items[0]).toHaveAttribute("itemscope");
    expect(items[0]).toHaveAttribute("itemtype", "https://schema.org/ListItem");
  });

  it("renders position metadata for each breadcrumb item", () => {
    renderBreadcrumbs();

    const metaTags = document.querySelectorAll('meta[itemprop="position"]');
    expect(metaTags).toHaveLength(3);

    expect(metaTags[0]).toHaveAttribute("content", "1");
    expect(metaTags[1]).toHaveAttribute("content", "2");
    expect(metaTags[2]).toHaveAttribute("content", "3");
  });

  it("has no accessibility violations for standard breadcrumbs", async () => {
    const { container } = renderBreadcrumbs();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for truncated breadcrumbs", async () => {
    const { container } = render(
      <BreadcrumbsBase
        items={[
          { label: "1", href: "/1" },
          { label: "2", href: "/2" },
          { label: "3", href: "/3" },
          { label: "4", href: "/4" },
        ]}
        classMap={classMap}
        LinkComponent={DummyLinkComponent}
        ButtonComponent={DummyButton}
        maxVisible={3}
        data-testid="breadcrumbs"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for disabled breadcrumbs", async () => {
    const { container } = renderBreadcrumbs({ disabled: true });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when using "aria-labelledby" and "aria-describedby"', async () => {
    const { container } = render(
      <>
        <h2 id="breadcrumbs-heading">Page hierarchy</h2>
        <p id="breadcrumbs-description">
          Use this to move up the site structure.
        </p>

        <BreadcrumbsBase
          items={defaultItems}
          classMap={classMap}
          LinkComponent={DummyLinkComponent}
          ButtonComponent={DummyButton}
          data-testid="breadcrumbs"
          aria-labelledby="breadcrumbs-heading"
          aria-describedby="breadcrumbs-description"
        />
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
