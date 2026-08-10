import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import SidebarBase from "../../src/components/Sidebar/SidebarBase";

expect.extend(toHaveNoViolations);

const mockLinks = [
  { label: "Dashboard", href: "/Dashboard" },
  {
    label: "Reports",
    children: [
      { label: "Monthly", href: "/Reports/Monthly" },
      { label: "Annual", href: "/Reports/Annual" },
    ],
  },
  { label: "Settings", href: "/Settings" },
];

const mockFooterLinks = [
  { label: "Help", href: "/Help" },
  { label: "Logout", href: "/Logout" },
];

const classMap = {
  wrapper: "wrapper",
  nav: "nav",
  list: "list",
  childList: "childList",
  item: "item",
  link: "link",
  childLink: "childLink",
  active: "active",
  chevron: "chevron",
  chevronOpen: "chevronOpen",
  submenu: "submenu",
  submenuOpen: "submenuOpen",
  footer: "footer",
  footerLink: "footerLink",
  footerVersion: "footerVersion",
  icon: "icon",
  primary: "primary",
  success: "success",
  shadowMedium: "shadowMedium",
  roundMedium: "roundMedium",
  glass: "glass",
  outline: "outline",
};

const TestLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ children, href, ...props }, ref) => (
  <a ref={ref} href={href} {...props}>
    {children}
  </a>
));
TestLink.displayName = "TestLink";

describe("SidebarBase", () => {
  const isLinkActive = (link: { href?: string }) => link.href === "/Settings";

  it("renders without crashing and shows the main navigation list", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        isLinkActive={isLinkActive}
      />,
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();

    const lists = screen.getAllByTestId("sidebar-list");
    expect(lists.length).toBeGreaterThan(0);
    expect(lists[0]).toBeInTheDocument();
  });

  it("renders the navigation landmark with the default accessible label", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        isLinkActive={isLinkActive}
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Sidebar navigation" }),
    ).toBeInTheDocument();
  });

  it("applies a custom aria-label to the navigation landmark", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        isLinkActive={isLinkActive}
        aria-label="Primary sidebar"
      />,
    );

    expect(
      screen.getByRole("navigation", { name: "Primary sidebar" }),
    ).toBeInTheDocument();
  });

  it("prefers aria-labelledby over aria-label on the navigation landmark", () => {
    render(
      <>
        <h2 id="sidebar-heading">Workspace Sidebar</h2>
        <SidebarBase
          classMap={classMap}
          links={mockLinks}
          isLinkActive={isLinkActive}
          aria-label="Ignored sidebar label"
          aria-labelledby="sidebar-heading"
        />
      </>,
    );

    const nav = screen.getByRole("navigation", { name: "Workspace Sidebar" });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("aria-labelledby", "sidebar-heading");
    expect(nav).not.toHaveAttribute("aria-label", "Ignored sidebar label");
  });

  it("applies aria-describedby to the navigation landmark", () => {
    render(
      <>
        <p id="sidebar-description">Main application navigation</p>
        <SidebarBase
          classMap={classMap}
          links={mockLinks}
          isLinkActive={isLinkActive}
          aria-describedby="sidebar-description"
        />
      </>,
    );

    expect(screen.getByTestId("sidebar")).toHaveAttribute(
      "aria-describedby",
      "sidebar-description",
    );
  });

  it("highlights the active link and sets aria-current=page", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        isLinkActive={isLinkActive}
        LinkComponent={TestLink}
      />,
    );

    const settingsLink = screen.getByRole("link", { name: "Settings" });
    expect(settingsLink).toHaveClass("active");
    expect(settingsLink).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current on inactive links", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        isLinkActive={isLinkActive}
        LinkComponent={TestLink}
      />,
    );

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink).not.toHaveAttribute("aria-current");
  });

  it("renders expandable parent items as buttons with collapsed state by default", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        isLinkActive={isLinkActive}
      />,
    );

    const reportsButton = screen.getByRole("button", { name: /reports/i });
    expect(reportsButton).toBeInTheDocument();
    expect(reportsButton).toHaveAttribute("aria-expanded", "false");

    const subMenu = screen.getByTestId("sidebar-subMenu");
    expect(subMenu).toHaveAttribute("hidden");
  });

  it("expands and collapses a submenu when the parent button is clicked", () => {
    render(<SidebarBase classMap={classMap} links={mockLinks} />);

    const reportsButton = screen.getByRole("button", { name: /reports/i });
    expect(reportsButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(reportsButton);
    expect(reportsButton).toHaveAttribute("aria-expanded", "true");

    const subMenu = screen.getByTestId("sidebar-subMenu");
    expect(subMenu).not.toHaveAttribute("hidden");

    fireEvent.click(reportsButton);
    expect(reportsButton).toHaveAttribute("aria-expanded", "false");
    expect(subMenu).toHaveAttribute("hidden");
  });

  it("automatically opens a parent item when it contains an active child", () => {
    const activeChildMatcher = (link: { href?: string }) =>
      link.href === "/Reports/Monthly";

    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        isLinkActive={activeChildMatcher}
        LinkComponent={TestLink}
      />,
    );

    const reportsButton = screen.getByRole("button", { name: /reports/i });
    expect(reportsButton).toHaveAttribute("aria-expanded", "true");

    const monthlyLink = screen.getByRole("link", { name: "Monthly" });
    expect(monthlyLink).toHaveAttribute("aria-current", "page");
  });

  it("uses hasActiveChild to mark parent items active/open", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        hasActiveChild={(link) => link.label === "Reports"}
      />,
    );

    const reportsButton = screen.getByRole("button", { name: /reports/i });
    expect(reportsButton).toHaveAttribute("aria-expanded", "true");
    expect(reportsButton).toHaveClass("active");
  });

  it("associates each submenu with its controlling button", () => {
    render(<SidebarBase classMap={classMap} links={mockLinks} />);

    const reportsButton = screen.getByRole("button", { name: /reports/i });
    const subMenu = screen.getByTestId("sidebar-subMenu");

    const controlsId = reportsButton.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    expect(subMenu).toHaveAttribute("id", controlsId!);
    expect(subMenu).toHaveAttribute("aria-labelledby", reportsButton.id);
  });

  it("renders non-clickable items as labels when href is missing and there are no children", () => {
    const links = [{ label: "Section Title" }];

    render(<SidebarBase classMap={classMap} links={links} />);

    expect(screen.getByTestId("sidebar-sidebarLabel")).toHaveTextContent(
      "Section Title",
    );
  });

  it("applies per-link aria props to regular links", () => {
    const links = [
      {
        label: "Settings",
        href: "/Settings",
        "aria-label": "Open settings page",
        "aria-description": "Navigates to application settings",
      },
    ];

    render(
      <SidebarBase
        classMap={classMap}
        links={links}
        LinkComponent={TestLink}
      />,
    );

    const link = screen.getByRole("link", { name: "Open settings page" });

    expect(link).toHaveAttribute(
      "aria-description",
      "Navigates to application settings",
    );
  });

  it("applies target and rel to regular links", () => {
    const links = [
      {
        label: "Docs",
        href: "/docs",
        target: "_blank" as const,
        rel: "external",
      },
    ];

    render(
      <SidebarBase
        classMap={classMap}
        links={links}
        LinkComponent={TestLink}
      />,
    );

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "external noopener noreferrer");
  });

  it("renders aria-disabled links as non-link labels", () => {
    const links = [
      {
        label: "Settings",
        href: "/Settings",
        "aria-label": "Open settings page",
        "aria-description": "Navigates to application settings",
        "aria-disabled": true,
      },
    ];

    render(
      <SidebarBase
        classMap={classMap}
        links={links}
        LinkComponent={TestLink}
      />,
    );

    const label = screen.getByTestId("sidebar-sidebarLabel");

    expect(label).toHaveAttribute("aria-disabled", "true");
    expect(label).toHaveAttribute(
      "aria-description",
      "Navigates to application settings",
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("applies generated aria props to expandable buttons", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        getExpandButtonAriaLabel={(link, isOpen) =>
          `${link.label} submenu ${isOpen ? "expanded" : "collapsed"}`
        }
        getExpandButtonAriaDescription={(link) =>
          `Toggle ${link.label} navigation section`
        }
      />,
    );

    const button = screen.getByRole("button", {
      name: "Reports submenu collapsed",
    });

    expect(button).toHaveAttribute(
      "title",
      "Toggle Reports navigation section",
    );
  });

  it("updates the generated expand button aria-label after toggling", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        getExpandButtonAriaLabel={(link, isOpen) =>
          `${link.label} submenu ${isOpen ? "expanded" : "collapsed"}`
        }
      />,
    );

    const button = screen.getByRole("button", {
      name: "Reports submenu collapsed",
    });

    fireEvent.click(button);

    expect(
      screen.getByRole("button", { name: "Reports submenu expanded" }),
    ).toBeInTheDocument();
  });

  it("renders footer when showFooter is true", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        showFooter
        footerLinks={mockFooterLinks}
        footerVersion="v1.0.0"
        LinkComponent={TestLink}
      />,
    );

    expect(screen.getByTestId("sidebar-footer")).toBeInTheDocument();
    expect(screen.getAllByTestId("sidebar-footerLink")).toHaveLength(2);
    expect(screen.getByTestId("sidebar-footerVersion")).toHaveTextContent(
      "v1.0.0",
    );
  });

  it("does not render footer when showFooter is false", () => {
    render(
      <SidebarBase classMap={classMap} links={mockLinks} showFooter={false} />,
    );

    expect(screen.queryByTestId("sidebar-footer")).not.toBeInTheDocument();
  });

  it("applies footer landmark accessibility props", () => {
    render(
      <>
        <span id="footer-label">Support links</span>
        <SidebarBase
          classMap={classMap}
          links={mockLinks}
          showFooter
          footerLinks={mockFooterLinks}
          footerAriaLabel="Ignored footer label"
          footerAriaLabelledBy="footer-label"
          LinkComponent={TestLink}
        />
      </>,
    );

    const footer = screen.getByTestId("sidebar-footer");
    expect(footer).toHaveAttribute("aria-labelledby", "footer-label");
    expect(footer).not.toHaveAttribute("aria-label", "Ignored footer label");
  });

  it("applies accessibility props to footer links", () => {
    const footerLinks = [
      {
        label: "Help",
        href: "/Help",
        "aria-label": "Open help center",
        "aria-description": "Get support and documentation",
        "aria-disabled": true,
      },
    ];

    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        showFooter
        footerLinks={footerLinks}
        LinkComponent={TestLink}
      />,
    );

    const footerLink = screen.getByRole("link", { name: "Open help center" });
    expect(footerLink).toHaveAttribute(
      "aria-description",
      "Get support and documentation",
    );
    expect(footerLink).toHaveAttribute("aria-disabled", "true");
  });

  it("applies target and rel to footer links", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        showFooter
        footerLinks={[
          {
            label: "Docs",
            href: "/docs",
            target: "_blank",
            rel: "external",
          },
        ]}
        LinkComponent={TestLink}
      />,
    );

    const footerLink = screen.getByRole("link", { name: "Docs" });
    expect(footerLink).toHaveAttribute("target", "_blank");
    expect(footerLink).toHaveAttribute("rel", "external noopener noreferrer");
  });

  it("applies custom data-testid values consistently", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        data-testid="custom-sidebar"
      />,
    );

    expect(screen.getByTestId("custom-sidebar")).toBeInTheDocument();
    expect(screen.getAllByTestId("custom-sidebar-list")).toHaveLength(2);
  });

  it("renders nested list after expansion with child list styling", () => {
    render(<SidebarBase classMap={classMap} links={mockLinks} />);

    const button = screen.getByRole("button", { name: /reports/i });
    fireEvent.click(button);

    const lists = screen.getAllByTestId("sidebar-list");
    expect(lists).toHaveLength(2);
    expect(lists[1]).toHaveClass("childList");
  });

  it("applies theme, state, outline, glass, rounding, shadow, and custom root className to the wrapper", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        theme="primary"
        state="success"
        variant="glassOutline"
        rounding="medium"
        shadow="medium"
        className="customSidebar"
      />,
    );

    const sidebar = screen.getByTestId("sidebar");

    expect(sidebar).toHaveClass("wrapper");
    expect(sidebar).toHaveClass("primary");
    expect(sidebar).toHaveClass("success");
    expect(sidebar).toHaveClass("outline");
    expect(sidebar).toHaveClass("glass");
    expect(sidebar).toHaveClass("roundMedium");
    expect(sidebar).toHaveClass("shadowMedium");
    expect(sidebar).toHaveClass("customSidebar");
  });

  it("applies custom slot class names while preserving default sidebar classes", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        LinkComponent={TestLink}
        navClassName="customNav"
        listClassName="customList"
        itemClassName="customItem"
        linkClassName="customLink"
      />,
    );

    const nav = screen.getByTestId("sidebar").querySelector(".nav");
    expect(nav).toHaveClass("nav");
    expect(nav).toHaveClass("customNav");

    const lists = screen.getAllByTestId("sidebar-list");
    expect(lists[0]).toHaveClass("list");
    expect(lists[0]).toHaveClass("customList");

    const items = screen.getAllByTestId("sidebar-listItem");
    expect(items[0]).toHaveClass("item");
    expect(items[0]).toHaveClass("customItem");

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink).toHaveClass("link");
    expect(dashboardLink).toHaveClass("customLink");
  });

  it("applies custom child list and child link class names", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        LinkComponent={TestLink}
        childListClassName="customChildList"
        childLinkClassName="customChildLink"
      />,
    );

    const reportsButton = screen.getByRole("button", { name: /reports/i });
    fireEvent.click(reportsButton);

    const lists = screen.getAllByTestId("sidebar-list");
    expect(lists[1]).toHaveClass("childList");
    expect(lists[1]).toHaveClass("customChildList");

    const monthlyLink = screen.getByRole("link", { name: "Monthly" });
    expect(monthlyLink).toHaveClass("childLink");
    expect(monthlyLink).toHaveClass("customChildLink");
  });

  it("applies custom active class name while preserving default active class", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        isLinkActive={isLinkActive}
        LinkComponent={TestLink}
        activeClassName="customActive"
      />,
    );

    const settingsLink = screen.getByRole("link", { name: "Settings" });

    expect(settingsLink).toHaveClass("active");
    expect(settingsLink).toHaveClass("customActive");
    expect(settingsLink).toHaveAttribute("aria-current", "page");
  });

  it("applies custom expandable button, label, chevron, and submenu class names", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        expandButtonClassName="customExpandButton"
        expandLabelClassName="customExpandLabel"
        chevronClassName="customChevron"
        chevronOpenClassName="customChevronOpen"
        submenuClassName="customSubmenu"
        submenuOpenClassName="customSubmenuOpen"
      />,
    );

    const reportsButton = screen.getByRole("button", { name: /reports/i });
    expect(reportsButton).toHaveClass("link");
    expect(reportsButton).toHaveClass("customExpandButton");

    const label = screen.getByTestId("sidebar-expandItemLabel");
    expect(label).toHaveClass("customExpandLabel");

    const chevron = screen.getByTestId("sidebar-expandIcon");
    expect(chevron).toHaveClass("chevron");
    expect(chevron).toHaveClass("customChevron");
    expect(chevron).not.toHaveClass("chevronOpen");
    expect(chevron).not.toHaveClass("customChevronOpen");

    const submenu = screen.getByTestId("sidebar-subMenu");
    expect(submenu).toHaveClass("submenu");
    expect(submenu).toHaveClass("customSubmenu");
    expect(submenu).not.toHaveClass("submenuOpen");
    expect(submenu).not.toHaveClass("customSubmenuOpen");

    fireEvent.click(reportsButton);

    expect(chevron).toHaveClass("chevronOpen");
    expect(chevron).toHaveClass("customChevronOpen");
    expect(submenu).toHaveClass("submenuOpen");
    expect(submenu).toHaveClass("customSubmenuOpen");
  });

  it("applies custom icon class name to link, button, and footer icons", () => {
    const links = [
      {
        label: "Dashboard",
        href: "/Dashboard",
        icon: <span data-testid="dashboard-icon">D</span>,
      },
      {
        label: "Reports",
        icon: <span data-testid="reports-icon">R</span>,
        children: [{ label: "Monthly", href: "/Reports/Monthly" }],
      },
    ];

    const footerLinks = [
      {
        label: "Help",
        href: "/Help",
        icon: <span data-testid="help-icon">H</span>,
      },
    ];

    render(
      <SidebarBase
        classMap={classMap}
        links={links}
        showFooter
        footerLinks={footerLinks}
        LinkComponent={TestLink}
        iconClassName="customIcon"
      />,
    );

    const dashboardIconWrapper =
      screen.getByTestId("dashboard-icon").parentElement;
    const reportsIconWrapper = screen.getByTestId("reports-icon").parentElement;
    const helpIconWrapper = screen.getByTestId("help-icon").parentElement;

    expect(dashboardIconWrapper).toHaveClass("icon");
    expect(dashboardIconWrapper).toHaveClass("customIcon");

    expect(reportsIconWrapper).toHaveClass("icon");
    expect(reportsIconWrapper).toHaveClass("customIcon");

    expect(helpIconWrapper).toHaveClass("icon");
    expect(helpIconWrapper).toHaveClass("customIcon");
  });

  it("applies custom footer, footer link, and footer version class names", () => {
    render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        showFooter
        footerLinks={mockFooterLinks}
        footerVersion="v1.0.0"
        LinkComponent={TestLink}
        footerClassName="customFooter"
        footerLinkClassName="customFooterLink"
        footerVersionClassName="customFooterVersion"
      />,
    );

    const footer = screen.getByTestId("sidebar-footer");
    expect(footer).toHaveClass("footer");
    expect(footer).toHaveClass("customFooter");

    const footerLinks = screen.getAllByTestId("sidebar-footerLink");
    footerLinks.forEach((footerLink) => {
      expect(footerLink).toHaveClass("footerLink");
      expect(footerLink).toHaveClass("customFooterLink");
    });

    const footerVersion = screen.getByTestId("sidebar-footerVersion");
    expect(footerVersion).toHaveClass("footerVersion");
    expect(footerVersion).toHaveClass("customFooterVersion");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SidebarBase
        classMap={classMap}
        links={mockLinks}
        isLinkActive={isLinkActive}
        showFooter
        footerLinks={mockFooterLinks}
        footerVersion="v1.0.0"
        LinkComponent={TestLink}
        aria-label="Application sidebar"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
