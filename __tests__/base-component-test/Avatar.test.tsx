import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { AvatarBase } from "@/components/Avatar/AvatarBase";

expect.extend(toHaveNoViolations);

const classMap = {
  avatar: "avatar",
  image: "img",
  initials: "initials",
  fallback_icon: "icon_fallback",
  status: "status",
  dot: "status_dot",
  icon_only: "status_icon_only",
  srOnly: "sr_only",

  online: "status_online",
  offline: "status_offline",
  busy: "status_busy",
  away: "status_away",

  topLeft: "status_topLeft",
  topRight: "status_topRight",
  bottomLeft: "status_bottomLeft",
  bottomRight: "status_bottomRight",

  clickable: "clickable",
  circle: "circle",
  square: "square",

  xs: "xs",
  small: "small",
  medium: "medium",
  large: "large",
  xl: "xl",

  shadowNone: "shadow_none",
  shadowLight: "shadow_light",
  shadowMedium: "shadow_medium",
  shadowStrong: "shadow_strong",
  shadowIntense: "shadow_intense",

  outline: "outline",
  glass: "glass",
  disabled: "disabled",

  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",

  success: "success",
  warning: "warning",
  error: "error",
  clear: "clear",
};

describe("AvatarBase (Jest)", () => {
  const renderAvatar = (props = {}) =>
    render(<AvatarBase classMap={classMap} data-testid="avatar" {...props} />);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders as a button by default", () => {
    renderAvatar({ name: "John Doe" });

    const avatar = screen.getByTestId("avatar-main");
    expect(avatar.tagName).toBe("BUTTON");
    expect(avatar).toHaveAttribute("type", "button");
  });

  it("renders initials fallback when name is provided and no src exists", () => {
    renderAvatar({ name: "John Doe" });

    const avatar = screen.getByRole("button", { name: "John Doe" });
    const initials = screen.getByTestId("avatar-initials");

    expect(avatar).toBeInTheDocument();
    expect(initials).toHaveTextContent("JD");
    expect(initials).toHaveAttribute("title", "John Doe");
    expect(initials).not.toHaveAttribute("aria-label");
    expect(initials).not.toHaveAttribute("role", "img");
  });

  it("uses label over alt and name for the root accessible name", () => {
    renderAvatar({
      name: "John Doe",
      alt: "Alt text",
      label: "Profile avatar label",
    });

    const avatar = screen.getByRole("button", {
      name: "Profile avatar label",
    });
    const initials = screen.getByTestId("avatar-initials");

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("aria-label", "Profile avatar label");
    expect(initials).toHaveAttribute("title", "Profile avatar label");
    expect(initials).not.toHaveAttribute("aria-label");
  });

  it("uses alt when label is not provided", () => {
    renderAvatar({
      name: "John Doe",
      alt: "Custom alt label",
    });

    const avatar = screen.getByRole("button", { name: "Custom alt label" });
    const initials = screen.getByTestId("avatar-initials");

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("aria-label", "Custom alt label");
    expect(initials).toHaveAttribute("title", "Custom alt label");
    expect(initials).not.toHaveAttribute("aria-label");
  });

  it("falls back to the default label when no label, alt, or name is provided", () => {
    renderAvatar();

    const avatar = screen.getByRole("button", { name: "User avatar" });
    const initials = screen.getByTestId("avatar-initials");

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("aria-label", "User avatar");
    expect(initials).toHaveAttribute("title", "User avatar");
    expect(initials).not.toHaveAttribute("aria-label");
  });

  it("prefers aria-labelledby over the internal fallback label", () => {
    render(
      <>
        <span id="external-avatar-label">External Avatar Label</span>
        <AvatarBase
          classMap={classMap}
          data-testid="avatar"
          name="Internal Name"
          label="Internal Label"
          aria-labelledby="external-avatar-label"
        />
      </>,
    );

    const avatar = screen.getByRole("button", {
      name: "External Avatar Label",
    });

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("aria-labelledby", "external-avatar-label");
    expect(avatar).not.toHaveAttribute("aria-label");
  });

  it("uses aria-label when explicitly provided", () => {
    renderAvatar({
      name: "John Doe",
      "aria-label": "Explicit avatar label",
    });

    const avatar = screen.getByRole("button", {
      name: "Explicit avatar label",
    });

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("aria-label", "Explicit avatar label");
  });

  it("renders avatar image when src is valid", () => {
    renderAvatar({
      src: "/avatar.jpg",
      alt: "User avatar",
    });

    const avatar = screen.getByRole("button", { name: "User avatar" });
    const image = screen.getByTestId("avatar-image");

    expect(avatar).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/avatar.jpg");
    expect(image).toHaveAttribute("alt", "User avatar");
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("uses eager loading when priority is true", () => {
    renderAvatar({
      src: "/avatar.jpg",
      alt: "Priority avatar",
      priority: true,
    });

    const image = screen.getByTestId("avatar-image");
    expect(image).toHaveAttribute("loading", "eager");
  });

  it("falls back to initials when image errors and name is available", () => {
    renderAvatar({
      src: "/broken-avatar.jpg",
      name: "Jane Smith",
      alt: "Jane Smith avatar",
    });

    const image = screen.getByTestId("avatar-image");
    fireEvent.error(image);

    const avatar = screen.getByRole("button", { name: "Jane Smith avatar" });
    const initials = screen.getByTestId("avatar-initials");

    expect(avatar).toBeInTheDocument();
    expect(initials).toHaveTextContent("JS");
    expect(screen.queryByTestId("avatar-image")).not.toBeInTheDocument();
  });

  it("renders the fallback icon when there is no name and no image", () => {
    renderAvatar();

    const fallback = screen.getByTestId("avatar-initials");
    expect(fallback).toBeInTheDocument();
    expect(fallback.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom fallback content when provided", () => {
    renderAvatar({
      fallback: <span data-testid="custom-fallback">CF</span>,
    });

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-initials")).toContainElement(
      screen.getByTestId("custom-fallback"),
    );
  });

  it("renders children instead of default avatar content when children are provided", () => {
    renderAvatar({
      name: "Should Not Render Initials",
      children: <span data-testid="custom-child">Custom Child</span>,
    });

    const avatar = screen.getByRole("button", {
      name: "Should Not Render Initials",
    });

    expect(avatar).toBeInTheDocument();
    expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    expect(screen.queryByTestId("avatar-initials")).not.toBeInTheDocument();
    expect(screen.queryByTestId("avatar-image")).not.toBeInTheDocument();
  });

  it("renders with status dot indicator", () => {
    renderAvatar({
      name: "Jane",
      status: "online",
    });

    const status = screen.getByTestId("avatar-status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-hidden", "true");
    expect(status).toHaveClass("status");
    expect(status).toHaveClass("status_online");
    expect(status).toHaveClass("status_bottomRight");

    const dot = status.querySelector("span");
    expect(dot).toHaveClass("status_dot");
  });

  it("renders status icon instead of dot when statusIcon is provided", () => {
    renderAvatar({
      name: "Jane",
      status: "busy",
      statusIcon: <span data-testid="status-icon">!</span>,
    });

    const status = screen.getByTestId("avatar-status");
    expect(status).toHaveClass("status");
    expect(status).toHaveClass("status_busy");
    expect(status).toHaveClass("status_icon_only");
    expect(screen.getByTestId("status-icon")).toBeInTheDocument();
    expect(status.querySelector(".status_dot")).not.toBeInTheDocument();
  });

  it("renders status when only statusIcon is provided", () => {
    renderAvatar({
      name: "Jane",
      statusIcon: <span data-testid="status-icon">*</span>,
    });

    const status = screen.getByTestId("avatar-status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveClass("status");
    expect(status).toHaveClass("status_icon_only");
    expect(screen.getByTestId("status-icon")).toBeInTheDocument();
  });

  it("applies custom status position class", () => {
    renderAvatar({
      name: "Jane",
      status: "online",
      statusPosition: "topLeft",
    });

    const status = screen.getByTestId("avatar-status");
    expect(status).toHaveClass("status_topLeft");
  });

  it("does not render status indicator when neither status nor statusIcon is provided", () => {
    renderAvatar({ name: "Jane" });

    expect(screen.queryByTestId("avatar-status")).not.toBeInTheDocument();
  });

  it("renders an sr-only status label and merges it into aria-describedby", () => {
    renderAvatar({
      name: "Jane Doe",
      status: "online",
      statusLabel: "Online",
      "aria-describedby": "avatar-extra-description",
    });

    const avatar = screen.getByRole("button", { name: "Jane Doe" });
    const statusLabel = screen.getByTestId("avatar-status-label");

    expect(statusLabel).toBeInTheDocument();
    expect(statusLabel).toHaveTextContent("Online");
    expect(statusLabel).toHaveClass("sr_only");

    const describedBy = avatar.getAttribute("aria-describedby");
    expect(describedBy).toContain("avatar-extra-description");
    expect(describedBy).toContain(statusLabel.getAttribute("id") ?? "");
  });

  it("does not render a status label element when statusLabel is not provided", () => {
    renderAvatar({
      name: "Jane Doe",
      status: "online",
    });

    expect(screen.queryByTestId("avatar-status-label")).not.toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();

    renderAvatar({
      name: "Clickable Avatar",
      onClick: handleClick,
    });

    fireEvent.click(screen.getByTestId("avatar-main"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies clickable class when onClick is provided", () => {
    renderAvatar({
      name: "Clickable Avatar",
      onClick: jest.fn(),
    });

    const avatar = screen.getByTestId("avatar-main");
    expect(avatar).toHaveClass("clickable");
  });

  it("does not call onClick when disabled button is clicked", () => {
    const handleClick = jest.fn();

    renderAvatar({
      name: "Disabled Avatar",
      onClick: handleClick,
      disabled: true,
    });

    const avatar = screen.getByTestId("avatar-main");
    expect(avatar).toBeDisabled();

    fireEvent.click(avatar);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies disabled class when disabled", () => {
    renderAvatar({
      name: "Disabled Avatar",
      disabled: true,
    });

    expect(screen.getByTestId("avatar-main")).toHaveClass("disabled");
  });

  it("renders as an anchor when href is provided", () => {
    renderAvatar({
      name: "Linked Avatar",
      href: "/profile",
    });

    const avatar = screen.getByRole("link", { name: "Linked Avatar" });
    expect(avatar.tagName).toBe("A");
    expect(avatar).toHaveAttribute("href", "/profile");
  });

  it("renders external links with target and rel", () => {
    renderAvatar({
      name: "External Avatar",
      href: "https://example.com/profile",
    });

    const avatar = screen.getByRole("link", { name: "External Avatar" });
    expect(avatar.tagName).toBe("A");
    expect(avatar).toHaveAttribute("href", "https://example.com/profile");
    expect(avatar).toHaveAttribute("target", "_blank");
    expect(avatar).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not add target or rel for internal links", () => {
    renderAvatar({
      name: "Internal Avatar",
      href: "/dashboard",
    });

    const avatar = screen.getByRole("link", { name: "Internal Avatar" });
    expect(avatar).not.toHaveAttribute("target");
    expect(avatar).not.toHaveAttribute("rel");
  });

  it("prevents navigation behavior for disabled anchor", () => {
    const handleClick = jest.fn();

    renderAvatar({
      name: "Disabled Link Avatar",
      href: "https://example.com/profile",
      onClick: handleClick,
      disabled: true,
    });

    const avatar = screen.getByTestId("avatar-main");
    expect(avatar.tagName).toBe("A");
    expect(avatar).not.toHaveAttribute("href");
    expect(avatar).toHaveAttribute("aria-disabled", "true");
    expect(avatar).toHaveAttribute("tabindex", "-1");

    fireEvent.click(avatar);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("calls onClick for enabled anchor", () => {
    const handleClick = jest.fn();

    renderAvatar({
      name: "Enabled Link Avatar",
      href: "/profile",
      onClick: handleClick,
    });

    fireEvent.click(screen.getByTestId("avatar-main"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("supports a custom LinkComponent", () => {
    const CustomLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >(function CustomLink(props, ref) {
      return <a ref={ref} {...props} />;
    });

    renderAvatar({
      name: "Custom Link",
      href: "/custom",
      LinkComponent: CustomLink,
    });

    const avatar = screen.getByTestId("avatar-main");
    expect(avatar).toBeInTheDocument();
    expect(avatar.tagName).toBe("A");
    expect(avatar).toHaveAttribute("href", "/custom");
  });

  it("supports a custom ImageComponent", () => {
    const CustomImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img {...props} />
    );

    renderAvatar({
      src: "/avatar.jpg",
      alt: "Custom image avatar",
      ImageComponent: CustomImage,
    });

    const image = screen.getByTestId("avatar-image");
    expect(image).toBeInTheDocument();
    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("src", "/avatar.jpg");
  });

  it("applies theme, state, shape, size, shadow, outline, glass, and custom className classes", () => {
    renderAvatar({
      name: "Styled Avatar",
      theme: "primary",
      state: "success",
      shape: "circle",
      size: "medium",
      shadow: "light",
      outline: true,
      glass: true,
      className: "custom-avatar-class",
    });

    const avatar = screen.getByTestId("avatar-main");

    expect(avatar).toHaveClass("avatar");
    expect(avatar).toHaveClass("primary");
    expect(avatar).toHaveClass("success");
    expect(avatar).toHaveClass("circle");
    expect(avatar).toHaveClass("medium");
    expect(avatar).toHaveClass("shadow_light");
    expect(avatar).toHaveClass("outline");
    expect(avatar).toHaveClass("glass");
    expect(avatar).toHaveClass("custom-avatar-class");
  });

  it("forwards extra props to the root button element", () => {
    renderAvatar({
      name: "Forward Props",
      title: "Profile title",
      "aria-describedby": "avatar-desc",
    });

    const avatar = screen.getByTestId("avatar-main");
    expect(avatar).toHaveAttribute("title", "Profile title");
    expect(avatar).toHaveAttribute("aria-describedby", "avatar-desc");
  });

  it("forwards role and aria-current when provided", () => {
    renderAvatar({
      name: "Current user",
      role: "menuitem",
      "aria-current": "page",
    });

    const avatar = screen.getByTestId("avatar-main");
    expect(avatar).toHaveAttribute("role", "menuitem");
    expect(avatar).toHaveAttribute("aria-current", "page");
  });

  it("uses the default test id when none is provided", () => {
    render(<AvatarBase name="Default Test Id" classMap={classMap} />);

    expect(screen.getByTestId("avatar-main")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-initials")).toBeInTheDocument();
  });

  it("has no accessibility violations with initials fallback", async () => {
    const { container } = renderAvatar({
      name: "Accessible User",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with image avatar", async () => {
    const { container } = renderAvatar({
      src: "/avatar.jpg",
      alt: "Accessible image avatar",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with link + status avatar", async () => {
    const { container } = renderAvatar({
      name: "Accessible Link Avatar",
      href: "/profile",
      status: "online",
      statusLabel: "Online",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
