import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseNavBar from "@/components/NavBar/NavBarBase";
import { FaHome, FaUser } from "react-icons/fa";

expect.extend(toHaveNoViolations);

const mockItems = [
  { label: "Home", path: "/home", icon: <FaHome /> },
  { label: "Profile", path: "/profile", icon: <FaUser /> },
];

const classMap = {
  container: "navContainer",
  list: "navList",
  listItem: "navListItem",
  item: "navItem",
  item_active: "navItemActive",
  linkContent: "navLinkContent",
  icon: "navIcon",
  label: "navLabel",
  primary: "primaryTheme",
  secondary: "secondaryTheme",
  clear: "clearTheme",
  glass: "glass",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
};

type MockLinkWrapperProps = {
  href: string;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  children: React.ReactNode;
  className: string;
  isActive: boolean;
  "data-testid"?: string;
  "aria-current"?: "page";
  "aria-label"?: string;
};

const LinkWrapper = ({
  href,
  target,
  rel,
  children,
  className,
  isActive,
  "data-testid": testId,
  "aria-current": ariaCurrent,
  "aria-label": ariaLabel,
}: MockLinkWrapperProps) => (
  <a
    href={href}
    target={target}
    rel={rel}
    className={className}
    data-testid={testId}
    aria-current={ariaCurrent}
    aria-label={ariaLabel}
    data-active={isActive ? "true" : "false"}
  >
    {children}
  </a>
);

describe("BaseNavBar", () => {
  const testId = "test-nav";

  it("renders the navigation landmark, list, and all navigation items", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
      />,
    );

    const nav = screen.getByTestId(`${testId}-nav-bar`);
    const list = screen.getByTestId(`${testId}-nav-list`);
    const homeItem = screen.getByTestId(`${testId}-nav-item-home`);
    const profileItem = screen.getByTestId(`${testId}-nav-item-profile`);
    const homeListItem = screen.getByTestId(`${testId}-nav-list-item-home`);
    const profileListItem = screen.getByTestId(
      `${testId}-nav-list-item-profile`,
    );

    expect(nav).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(homeItem).toBeInTheDocument();
    expect(profileItem).toBeInTheDocument();
    expect(homeListItem).toBeInTheDocument();
    expect(profileListItem).toBeInTheDocument();

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders links with the correct href values", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
      />,
    );

    expect(screen.getByTestId(`${testId}-nav-item-home`)).toHaveAttribute(
      "href",
      "/home",
    );
    expect(screen.getByTestId(`${testId}-nav-item-profile`)).toHaveAttribute(
      "href",
      "/profile",
    );
  });

  it("applies target and rel to nav item links", () => {
    render(
      <BaseNavBar
        items={[
          {
            label: "Docs",
            path: "/docs",
            icon: <FaHome />,
            target: "_blank",
            rel: "external",
          },
        ]}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
      />,
    );

    const link = screen.getByTestId(`${testId}-nav-item-docs`);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "external");
  });

  it("applies the default navigation aria-label", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument();
  });

  it("supports a custom aria-label on the navigation landmark", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
        aria-label="Primary site navigation"
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Primary site navigation" }),
    ).toBeInTheDocument();
  });

  it("supports aria-labelledby and suppresses aria-label when provided", () => {
    render(
      <>
        <h2 id="main-nav-heading">Application navigation</h2>
        <BaseNavBar
          items={mockItems}
          classMap={classMap}
          LinkWrapper={LinkWrapper}
          data-testid={testId}
          aria-label="Should not be used"
          aria-labelledby="main-nav-heading"
        />
      </>,
    );

    const nav = screen.getByTestId(`${testId}-nav-bar`);

    expect(nav).toHaveAttribute("aria-labelledby", "main-nav-heading");
    expect(nav).not.toHaveAttribute("aria-label", "Should not be used");
    expect(
      screen.getByRole("navigation", { name: "Application navigation" }),
    ).toBeInTheDocument();
  });

  it("supports aria-describedby on the navigation landmark", () => {
    render(
      <>
        <p id="nav-description">Use these links to move between sections.</p>
        <BaseNavBar
          items={mockItems}
          classMap={classMap}
          LinkWrapper={LinkWrapper}
          data-testid={testId}
          aria-describedby="nav-description"
        />
      </>,
    );

    expect(screen.getByTestId(`${testId}-nav-bar`)).toHaveAttribute(
      "aria-describedby",
      "nav-description",
    );
  });

  it("supports a custom aria-label for the internal list", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
        list-aria-label="Main sections"
      />,
    );

    expect(screen.getByTestId(`${testId}-nav-list`)).toHaveAttribute(
      "aria-label",
      "Main sections",
    );
  });

  it("marks the correct item as active using isItemActive", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
        isItemActive={(item) => item.path === "/home"}
      />,
    );

    const homeItem = screen.getByTestId(`${testId}-nav-item-home`);
    const profileItem = screen.getByTestId(`${testId}-nav-item-profile`);

    expect(homeItem).toHaveAttribute("aria-current", "page");
    expect(profileItem).not.toHaveAttribute("aria-current");

    expect(homeItem).toHaveAttribute("data-active", "true");
    expect(profileItem).toHaveAttribute("data-active", "false");
  });

  it("does not mark any item as active when isItemActive returns false for all items", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
        isItemActive={() => false}
      />,
    );

    expect(screen.getByTestId(`${testId}-nav-item-home`)).not.toHaveAttribute(
      "aria-current",
    );
    expect(
      screen.getByTestId(`${testId}-nav-item-profile`),
    ).not.toHaveAttribute("aria-current");
  });

  it("applies the active class to the active item only", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
        isItemActive={(item) => item.path === "/profile"}
      />,
    );

    const homeItem = screen.getByTestId(`${testId}-nav-item-home`);
    const profileItem = screen.getByTestId(`${testId}-nav-item-profile`);

    expect(homeItem.className).toContain("navItem");
    expect(homeItem.className).not.toContain("navItemActive");

    expect(profileItem.className).toContain("navItem");
    expect(profileItem.className).toContain("navItemActive");
  });

  it("applies theme, rounding, shadow, and custom className to the wrapper and items", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
        theme="primary"
        glass
        rounding="medium"
        shadow="light"
        className="customNavClass"
      />,
    );

    const nav = screen.getByTestId(`${testId}-nav-bar`);
    const homeItem = screen.getByTestId(`${testId}-nav-item-home`);

    expect(nav.className).toContain("navContainer");
    expect(nav.className).toContain("primaryTheme");
    expect(nav.className).toContain("glass");
    expect(nav.className).toContain("customNavClass");

    expect(homeItem.className).toContain("navItem");
    expect(homeItem.className).toContain("roundMedium");
    expect(homeItem.className).toContain("shadowLight");
  });

  it("applies custom class names to nav sections", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
        listClassName="custom-list"
        listItemClassName="custom-list-item"
        itemClassName="custom-item"
        linkContentClassName="custom-link-content"
        iconClassName="custom-icon"
        labelClassName="custom-label"
      />,
    );

    const list = screen.getByTestId(`${testId}-nav-list`);
    const listItem = screen.getByTestId(`${testId}-nav-list-item-home`);
    const item = screen.getByTestId(`${testId}-nav-item-home`);
    const icon = screen.getByTestId(`${testId}-nav-icon-home`);
    const linkContent = icon.parentElement;
    const label = screen.getByText("Home");

    expect(list).toHaveClass("navList", "custom-list");
    expect(listItem).toHaveClass("navListItem", "custom-list-item");
    expect(item).toHaveClass("navItem", "custom-item");
    expect(linkContent).toHaveClass("navLinkContent", "custom-link-content");
    expect(icon).toHaveClass("navIcon", "custom-icon");
    expect(label).toHaveClass("navLabel", "custom-label");
  });

  it("supports custom item aria-labels via getItemAriaLabel", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
        getItemAriaLabel={(item) => `Go to ${item.label}`}
      />,
    );

    expect(screen.getByTestId(`${testId}-nav-item-home`)).toHaveAttribute(
      "aria-label",
      "Go to Home",
    );
    expect(screen.getByTestId(`${testId}-nav-item-profile`)).toHaveAttribute(
      "aria-label",
      "Go to Profile",
    );
  });

  it("falls back to the item label as the accessible name when getItemAriaLabel is not provided", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
      />,
    );

    expect(screen.getByTestId(`${testId}-nav-item-home`)).toHaveAttribute(
      "aria-label",
      "Home",
    );
    expect(screen.getByTestId(`${testId}-nav-item-profile`)).toHaveAttribute(
      "aria-label",
      "Profile",
    );
  });

  it("renders decorative icons with aria-hidden", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
      />,
    );

    expect(screen.getByTestId(`${testId}-nav-icon-home`)).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByTestId(`${testId}-nav-icon-profile`)).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders label content for each item", () => {
    render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
      />,
    );

    const homeItem = screen.getByTestId(`${testId}-nav-item-home`);
    const profileItem = screen.getByTestId(`${testId}-nav-item-profile`);

    expect(homeItem).toHaveTextContent("Home");
    expect(profileItem).toHaveTextContent("Profile");
  });

  it("creates stable slug-based test ids from labels", () => {
    const itemsWithSpacing = [
      { label: "My Home", path: "/home", icon: <FaHome /> },
      { label: "User Profile", path: "/profile", icon: <FaUser /> },
    ];

    render(
      <BaseNavBar
        items={itemsWithSpacing}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
      />,
    );

    expect(screen.getByTestId(`${testId}-nav-item-myhome`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-nav-item-userprofile`),
    ).toBeInTheDocument();
  });

  it("renders correctly when no item is active and still preserves accessibility", async () => {
    const { container } = render(
      <BaseNavBar
        items={mockItems}
        classMap={classMap}
        LinkWrapper={LinkWrapper}
        data-testid={testId}
        isItemActive={() => false}
        aria-label="Section navigation"
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Section navigation" }),
    ).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with an active item and custom accessibility props", async () => {
    const { container } = render(
      <>
        <h2 id="nav-heading">Dashboard navigation</h2>
        <p id="nav-help">Choose a section to continue.</p>
        <BaseNavBar
          items={mockItems}
          classMap={classMap}
          LinkWrapper={LinkWrapper}
          data-testid={testId}
          isItemActive={(item) => item.path === "/home"}
          aria-labelledby="nav-heading"
          aria-describedby="nav-help"
          list-aria-label="Dashboard links"
          getItemAriaLabel={(item) => `Navigate to ${item.label}`}
        />
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
