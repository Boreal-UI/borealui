import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import IconButtonBase from "../../src/components/IconButton/IconButtonBase";
import { FaTimes } from "react-icons/fa";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const classMap = {
  iconButton: "icon-button",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  medium: "medium",
  small: "small",
  large: "large",
  outline: "outline",
  glass: "glass",
  disabled: "disabled",
  buttonLabel: "button-label",
  loader: "loader",
  link: "link",
  shadowNone: "shadow-none",
  shadowSmall: "shadow-small",
  shadowMedium: "shadow-medium",
  shadowLarge: "shadow-large",
  shadowStrong: "shadow-strong",
  roundNone: "round-none",
  roundSmall: "round-small",
  roundMedium: "round-medium",
  roundLarge: "round-large",
  roundFull: "round-full",
};

describe("IconButtonBase", () => {
  it("renders a button with an icon and aria-label", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-testid", "icon-button");
    expect(screen.getByTestId("icon-button-icon")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        title="Dismiss"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const button = screen.getByRole("button", { name: "Dismiss" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Dismiss");
  });

  it("prefers aria-label over title for accessible name", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close dialog"
        title="Dismiss"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Close dialog" }),
    ).toBeInTheDocument();
  });

  it("uses aria-labelledby as the accessible name source", () => {
    render(
      <>
        <span id="icon-button-label">Open menu</span>
        <IconButtonBase
          icon={FaTimes}
          aria-labelledby="icon-button-label"
          classMap={classMap}
          data-testid="icon-button"
        />
      </>,
    );

    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-labelledby", "icon-button-label");
    expect(button).not.toHaveAttribute("aria-label", "Open menu");
  });

  it("passes id to the root button element", () => {
    render(
      <IconButtonBase
        id="close-action"
        icon={FaTimes}
        aria-label="Close"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(screen.getByTestId("icon-button")).toHaveAttribute(
      "id",
      "close-action",
    );
  });

  it("passes keyboard events through", () => {
    const handleKeyDown = jest.fn();

    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        classMap={classMap}
        onKeyDown={handleKeyDown}
        data-testid="icon-button"
      />,
    );

    fireEvent.keyDown(screen.getByTestId("icon-button"), { key: "Enter" });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it("handles click events", () => {
    const handleClick = jest.fn();

    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        classMap={classMap}
        onClick={handleClick}
        data-testid="icon-button"
      />,
    );

    fireEvent.click(screen.getByTestId("icon-button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state and prevents click handler execution", () => {
    const handleClick = jest.fn();

    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        disabled
        classMap={classMap}
        onClick={handleClick}
        data-testid="icon-button"
      />,
    );

    const button = screen.getByTestId("icon-button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled");

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("sets disabled state while loading", () => {
    const handleClick = jest.fn();

    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        loading
        classMap={classMap}
        onClick={handleClick}
        data-testid="icon-button"
      />,
    );

    const button = screen.getByTestId("icon-button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveClass("disabled");

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders loader instead of icon when loading", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        loading
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(screen.queryByTestId("icon-button-icon")).not.toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.getByText("Loading")).toHaveClass("sr_only");
  });

  it("does not render an icon when no icon prop is provided", () => {
    render(
      <IconButtonBase
        aria-label="Empty action"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Empty action" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("icon-button-icon")).not.toBeInTheDocument();
  });

  it("applies theme, size, outline, rounding, shadow, and custom class names", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        theme="primary"
        size="medium"
        outline
        rounding="large"
        shadow="medium"
        className="custom-class"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const button = screen.getByTestId("icon-button");
    expect(button).toHaveClass("icon-button");
    expect(button).toHaveClass("primary");
    expect(button).toHaveClass("medium");
    expect(button).toHaveClass("outline");
    expect(button).toHaveClass("round-large");
    expect(button).toHaveClass("shadow-medium");
    expect(button).toHaveClass("custom-class");
  });

  it("passes iconClassName to the icon", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        iconClassName="custom-icon"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(screen.getByTestId("icon-button-icon")).toHaveClass("custom-icon");
  });

  it("passes the button type prop", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Submit action"
        type="submit"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(screen.getByTestId("icon-button")).toHaveAttribute("type", "submit");
  });

  it("passes tabIndex to the button", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        tabIndex={3}
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const button = screen.getByTestId("icon-button") as HTMLButtonElement;
    expect(button.tabIndex).toBe(3);
  });

  it("forwards refs to button elements", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(
      <IconButtonBase
        ref={ref}
        icon={FaTimes}
        aria-label="Close"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByTestId("icon-button"));
  });

  it("renders as a link when href is provided", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Go home"
        href="/home"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const link = screen.getByRole("link", { name: "Go home" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/home");
    expect(link).toHaveClass("icon-button");
    expect(link).toHaveClass("link");
  });

  it("passes id to the root link element", () => {
    render(
      <IconButtonBase
        id="profile-link"
        icon={FaTimes}
        aria-label="Profile"
        href="/profile"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "id",
      "profile-link",
    );
  });

  it("renders an external anchor with target and rel when isExternal is true", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Open docs"
        href="https://example.com"
        isExternal
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const link = screen.getByRole("link", { name: "Open docs" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders with a custom LinkComponent when href is provided", () => {
    const CustomLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >(function CustomLink(props, ref) {
      return <a ref={ref} {...props} data-custom-link="true" />;
    });

    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Dashboard"
        href="/dashboard"
        LinkComponent={CustomLink}
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link).toHaveAttribute("data-custom-link", "true");
  });

  it("forwards refs to anchor elements when rendered as a link", () => {
    const ref = React.createRef<HTMLAnchorElement>();

    render(
      <IconButtonBase
        ref={ref}
        icon={FaTimes}
        aria-label="Profile"
        href="/profile"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current).toBe(screen.getByRole("link", { name: "Profile" }));
  });

  it("marks links as aria-disabled and removes href when disabled", () => {
    const handleClick = jest.fn();

    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Settings"
        href="/settings"
        disabled
        onClick={handleClick}
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const link = screen.getByTestId("icon-button");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).toHaveClass("disabled");

    fireEvent.click(link);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("marks links as aria-disabled and removes href when loading", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Settings"
        href="/settings"
        loading
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const link = screen.getByTestId("icon-button");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).toHaveAttribute("aria-busy", "true");
  });

  it("uses the provided href normally when link is not disabled or loading", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Projects"
        href="/projects"
        tabIndex={2}
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const link = screen.getByRole("link", { name: "Projects" });
    expect(link).toHaveAttribute("href", "/projects");
    expect(link).toHaveAttribute("tabindex", "2");
  });

  it("passes advanced aria props to the button element", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Toggle navigation"
        aria-describedby="nav-help"
        aria-errormessage="nav-error"
        aria-invalid={true}
        aria-haspopup="menu"
        aria-expanded={true}
        aria-controls="main-menu"
        aria-pressed={true}
        aria-current="page"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const button = screen.getByTestId("icon-button");
    expect(button).toHaveAttribute("aria-describedby", "nav-help");
    expect(button).toHaveAttribute("aria-errormessage", "nav-error");
    expect(button).toHaveAttribute("aria-invalid", "true");
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls", "main-menu");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("aria-current", "page");
  });

  it("passes role-based aria props when explicitly used with a supported role", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Choose item"
        role="menuitemcheckbox"
        aria-checked="mixed"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const button = screen.getByTestId("icon-button");
    expect(button).toHaveAttribute("role", "menuitemcheckbox");
    expect(button).toHaveAttribute("aria-checked", "mixed");
  });

  it("renders the icon wrapper with default aria-live and aria-atomic attributes", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const wrapper = screen.getByTestId("icon-button-icon").parentElement;
    expect(wrapper).toHaveClass("button-label");
    expect(wrapper).toHaveAttribute("aria-live", "polite");
    expect(wrapper).toHaveAttribute("aria-atomic", "true");
  });

  it("allows aria-live and aria-atomic to be overridden on the icon wrapper", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        aria-live="assertive"
        aria-atomic={false}
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const wrapper = screen.getByTestId("icon-button-icon").parentElement;
    expect(wrapper).toHaveAttribute("aria-live", "assertive");
    expect(wrapper).toHaveAttribute("aria-atomic", "false");
  });

  it("allows aria-busy to be set explicitly when not loading", () => {
    render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Sync"
        aria-busy={true}
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(screen.getByTestId("icon-button")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("warns in development when aria-label, aria-labelledby, and title are all missing", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <IconButtonBase
        icon={FaTimes}
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      "IconButtonBase: provide `aria-label`, `aria-labelledby`, or `title` for icon-only buttons.",
    );

    warnSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("does not warn in development when aria-labelledby is provided", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <>
        <span id="icon-button-label">Open navigation</span>
        <IconButtonBase
          icon={FaTimes}
          aria-labelledby="icon-button-label"
          classMap={classMap}
          data-testid="icon-button"
        />
      </>,
    );

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("does not warn outside development when aria-label and title are missing", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <IconButtonBase
        icon={FaTimes}
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("has no accessibility violations in button mode", async () => {
    const { container } = render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Close"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in link mode", async () => {
    const { container } = render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Visit profile"
        href="/profile"
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in loading state", async () => {
    const { container } = render(
      <IconButtonBase
        icon={FaTimes}
        aria-label="Save"
        loading
        classMap={classMap}
        data-testid="icon-button"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
