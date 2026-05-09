import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { BadgeBase } from "@/components/Badge/BadgeBase";
import { DummyIcon } from "../test-utils/dummyComponents";
import { BadgeBaseProps } from "@/components/Badge/Badge.types";

expect.extend(toHaveNoViolations);

const classMap = {
  badge: "badge",

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
  clickable: "clickable",
  badge_icon: "badge_icon",

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
};

describe("BadgeBase", () => {
  const renderBadge = (
    props: Omit<BadgeBaseProps, "classMap" | "children"> = {},
    children: React.ReactNode = "Active",
  ) => {
    const badgeProps = {
      classMap,
      "data-testid": "badge",
      ...props,
    } as BadgeBaseProps;

    return render(<BadgeBase {...badgeProps}>{children}</BadgeBase>);
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders text content from children", () => {
    renderBadge();

    const badge = screen.getByTestId("badge-main");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Active");
    expect(badge).toHaveAttribute("role", "status");
    expect(badge).toHaveAttribute("title", "Active");
    expect(badge).toHaveAttribute("aria-label", "Active");
  });

  it("renders numeric children and uses them for accessibility text", () => {
    renderBadge({}, 12);

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveTextContent("12");
    expect(badge).toHaveAttribute("title", "12");
    expect(badge).toHaveAttribute("aria-label", "12");
  });

  it("renders custom child content", () => {
    renderBadge({}, <span data-testid="badge-child">Custom</span>);

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveTextContent("Custom");
    expect(screen.getByTestId("badge-child")).toBeInTheDocument();
  });

  it("does not automatically set aria-label for non-text children unless aria-label is provided", () => {
    renderBadge({}, <span data-testid="badge-child">Custom</span>);

    const badge = screen.getByTestId("badge-main");
    expect(badge).not.toHaveAttribute("aria-label");
  });

  it("uses aria-label when provided", () => {
    renderBadge({ "aria-label": "Custom badge label" }, "Visible Badge");

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveAttribute("aria-label", "Custom badge label");
    expect(badge).toHaveAttribute("title", "Custom badge label");
  });

  it("uses title prop over derived accessible label when provided", () => {
    renderBadge({ title: "Explicit title" }, "Visible Badge");

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveAttribute("title", "Explicit title");
    expect(badge).toHaveAttribute("aria-label", "Visible Badge");
  });

  it("renders icon when passed", () => {
    renderBadge({ icon: DummyIcon }, "New");

    const icon = screen.getByTestId("badge-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("focusable", "false");
    expect(icon).toHaveClass("badge_icon");
  });

  it("renders icon-only badge", () => {
    render(
      <BadgeBase
        icon={DummyIcon}
        classMap={classMap}
        data-testid="badge"
        aria-label="Notifications"
      />,
    );

    const badge = screen.getByTestId("badge-main");
    const icon = screen.getByTestId("badge-icon");

    expect(badge).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(badge).toHaveAttribute("role", "status");
    expect(badge).toHaveAttribute("aria-label", "Notifications");
    expect(badge).toHaveAttribute("title", "Notifications");
  });

  it("returns null when both children and icon are missing", () => {
    const { container } = render(
      <BadgeBase classMap={classMap} data-testid="badge" />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders a span by default when no onClick or href is provided", () => {
    renderBadge();

    const badge = screen.getByTestId("badge-main");
    expect(badge.tagName).toBe("SPAN");
  });

  it("renders a button when onClick is provided", () => {
    const handleClick = jest.fn();
    renderBadge({ onClick: handleClick }, "Clickable");

    const badge = screen.getByTestId("badge-main");
    expect(badge.tagName).toBe("BUTTON");
    expect(badge).toHaveAttribute("type", "button");
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    renderBadge({ onClick: handleClick }, "Clickable");

    fireEvent.click(screen.getByTestId("badge-main"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies clickable class when onClick is provided", () => {
    renderBadge({ onClick: jest.fn() }, "Clickable");

    expect(screen.getByTestId("badge-main")).toHaveClass("clickable");
  });

  it("does not call onClick when disabled button is clicked", () => {
    const handleClick = jest.fn();
    renderBadge({ onClick: handleClick, disabled: true }, "Disabled");

    const badge = screen.getByTestId("badge-main");
    expect(badge).toBeDisabled();

    fireEvent.click(badge);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies disabled class when disabled", () => {
    renderBadge({ onClick: jest.fn(), disabled: true }, "Disabled");

    expect(screen.getByTestId("badge-main")).toHaveClass("disabled");
  });

  it("renders an anchor when href is provided", () => {
    renderBadge({ href: "/profile" }, "Linked");

    const badge = screen.getByTestId("badge-main");
    expect(badge.tagName).toBe("A");
    expect(badge).toHaveAttribute("href", "/profile");
  });

  it("renders external href with target and rel", () => {
    renderBadge({ href: "https://example.com" }, "External");

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveAttribute("href", "https://example.com");
    expect(badge).toHaveAttribute("target", "_blank");
    expect(badge).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not set target or rel for internal href", () => {
    renderBadge({ href: "/dashboard" }, "Internal");

    const badge = screen.getByTestId("badge-main");
    expect(badge).not.toHaveAttribute("target");
    expect(badge).not.toHaveAttribute("rel");
  });

  it("applies custom target and rel for link badges", () => {
    renderBadge(
      {
        href: "/release-notes",
        target: "_blank",
        rel: "external",
      },
      "Release Notes",
    );

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveAttribute("target", "_blank");
    expect(badge).toHaveAttribute("rel", "external");
  });

  it("renders disabled anchor without href and with aria-disabled", () => {
    renderBadge({ href: "/dashboard", disabled: true }, "Disabled Link");

    const badge = screen.getByTestId("badge-main");
    expect(badge.tagName).toBe("A");
    expect(badge).not.toHaveAttribute("href");
    expect(badge).toHaveAttribute("aria-disabled", "true");
    expect(badge).toHaveAttribute("tabindex", "-1");
  });

  it("does not call onClick for disabled anchor", () => {
    const handleClick = jest.fn();
    renderBadge(
      { href: "/dashboard", disabled: true, onClick: handleClick },
      "Disabled Link",
    );

    fireEvent.click(screen.getByTestId("badge-main"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("calls onClick for enabled anchor", () => {
    const handleClick = jest.fn((event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
    });
    renderBadge({ href: "/dashboard", onClick: handleClick }, "Enabled Link");

    fireEvent.click(screen.getByTestId("badge-main"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies theme, state, size, shadow, rounding, outline, glass, and custom className", () => {
    renderBadge(
      {
        theme: "primary",
        state: "success",
        size: "medium",
        shadow: "light",
        rounding: "small",
        outline: true,
        glass: true,
        className: "custom-badge-class",
      },
      "Styled Badge",
    );

    const badge = screen.getByTestId("badge-main");

    expect(badge).toHaveClass("badge");
    expect(badge).toHaveClass("primary");
    expect(badge).toHaveClass("success");
    expect(badge).toHaveClass("medium");
    expect(badge).toHaveClass("shadowLight");
    expect(badge).toHaveClass("roundSmall");
    expect(badge).toHaveClass("outline");
    expect(badge).toHaveClass("glass");
    expect(badge).toHaveClass("custom-badge-class");
  });

  it("forwards aria-describedby to the rendered element", () => {
    renderBadge(
      {
        id: "badge-id",
        "aria-describedby": "badge-desc",
      },
      "Forwarded",
    );

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveAttribute("id", "badge-id");
    expect(badge).toHaveAttribute("aria-describedby", "badge-desc");
  });

  it("forwards aria-labelledby to the rendered element", () => {
    render(
      <>
        <span id="external-badge-label">External badge label</span>
        <BadgeBase
          classMap={classMap}
          data-testid="badge"
          aria-labelledby="external-badge-label"
        >
          Visible Badge
        </BadgeBase>
      </>,
    );

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveAttribute("aria-labelledby", "external-badge-label");
    expect(badge).toHaveAttribute("aria-label", "Visible Badge");
  });

  it("forwards aria-live and aria-atomic to the rendered element", () => {
    renderBadge(
      {
        "aria-live": "polite",
        "aria-atomic": true,
      },
      "Uploading",
    );

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveAttribute("aria-live", "polite");
    expect(badge).toHaveAttribute("aria-atomic", "true");
  });

  it("uses a custom role when provided", () => {
    renderBadge({ role: "note" }, "Info");

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveAttribute("role", "note");
  });

  it("uses the default status role for non-interactive badges", () => {
    renderBadge({}, "Status");

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveAttribute("role", "status");
  });

  it("forwards tabIndex to a non-interactive badge", () => {
    renderBadge({ tabIndex: 0 }, "Focusable");

    const badge = screen.getByTestId("badge-main");
    expect(badge).toHaveAttribute("tabindex", "0");
  });

  it("uses the default test id when none is provided", () => {
    render(<BadgeBase classMap={classMap}>Default Badge</BadgeBase>);

    expect(screen.getByTestId("badge-main")).toBeInTheDocument();
  });

  it("has no accessibility violations for text badge", async () => {
    const { container } = renderBadge({}, "Accessible Badge");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for icon + text badge", async () => {
    const { container } = renderBadge(
      { icon: DummyIcon, theme: "primary" },
      "Accessible Badge",
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for link badge", async () => {
    const { container } = renderBadge(
      { href: "/profile", icon: DummyIcon },
      "Profile",
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for button badge", async () => {
    const { container } = renderBadge(
      { onClick: jest.fn(), icon: DummyIcon },
      "Action",
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for icon-only badge with aria-label", async () => {
    const { container } = render(
      <BadgeBase
        icon={DummyIcon}
        classMap={classMap}
        data-testid="badge"
        aria-label="Notifications"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
