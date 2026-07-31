import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ButtonBase from "../../src/components/Button/ButtonBase";
import { FaStar } from "react-icons/fa";
import { setBorealStyleConfig } from "../../src/config/boreal-style-config";

expect.extend(toHaveNoViolations);

const classMap = {
  button: "btn",

  primary: "btn-primary",
  secondary: "btn-secondary",
  tertiary: "btn-tertiary",
  quaternary: "btn-quaternary",

  success: "btn-success",
  warning: "btn-warning",
  error: "btn-error",
  clear: "btn-clear",

  xs: "btn-xs",
  small: "btn-sm",
  medium: "btn-md",
  large: "btn-lg",
  xl: "btn-xl",
  disabled: "btn-disabled",
  fullWidth: "btn-full",
  link: "btn-link",

  buttonIcon: "btn-icon",
  buttonLabel: "btn-label",
  loader: "btn-loader",
  icon: "icon-style",

  iconLeft: "btn-icon-left",
  iconRight: "btn-icon-right",

  shadowNone: "btn-shadow-none",
  shadowLight: "btn-shadow-light",
  shadowMedium: "btn-shadow-medium",
  shadowStrong: "btn-shadow-strong",
  shadowIntense: "btn-shadow-intense",

  roundNone: "btn-round-none",
  roundSmall: "btn-round-small",
  roundMedium: "btn-round-medium",
  roundLarge: "btn-round-large",
  roundFull: "btn-round-full",
  glass: "btn-glass",
  outline: "btn-outline",
};

describe("ButtonBase", () => {
  const renderButton = (
    props: Partial<React.ComponentProps<typeof ButtonBase>> = {},
    children: React.ReactNode = "Click me",
  ) =>
    render(
      <ButtonBase
        {...({
          classMap,
          "data-testid": "button-test",
          ...props,
        } as React.ComponentProps<typeof ButtonBase>)}
      >
        {children}
      </ButtonBase>,
    );

  afterEach(() => {
    setBorealStyleConfig({});
    jest.clearAllMocks();
  });

  it("renders a button by default", () => {
    renderButton();

    const button = screen.getByTestId("button-test");
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders button with icon and text", () => {
    renderButton(
      {
        icon: FaStar,
        "aria-label": "Favorite",
      },
      "Click me",
    );

    const button = screen.getByTestId("button-test");
    const icon = screen.getByTestId("button-test-icon");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("btn-icon");

    const svg = icon.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("icon-style");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  it("does not apply the default shadow class when the clear theme is used", () => {
    renderButton({ theme: "clear" });

    const button = screen.getByTestId("button-test");

    expect(button).toHaveClass("btn-clear");
    expect(button).not.toHaveClass("btn-shadow-light");
  });

  it("applies an explicit shadow class when the clear theme is used", () => {
    renderButton({ theme: "clear", shadow: "strong" });

    const button = screen.getByTestId("button-test");

    expect(button).toHaveClass("btn-clear");
    expect(button).toHaveClass("btn-shadow-strong");
  });

  it("defaults iconPosition to left when an icon is provided", () => {
    renderButton(
      {
        icon: FaStar,
      },
      "Favorite",
    );

    const button = screen.getByTestId("button-test");
    const icon = screen.getByTestId("button-test-icon");
    const label = screen.getByTestId("button-test-loading");

    expect(button).toHaveClass("btn-icon-left");
    expect(button).not.toHaveClass("btn-icon-right");

    expect(icon.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the icon before the label when iconPosition is left", () => {
    renderButton(
      {
        icon: FaStar,
        iconPosition: "left",
      },
      "Favorite",
    );

    const button = screen.getByTestId("button-test");
    const icon = screen.getByTestId("button-test-icon");
    const label = screen.getByTestId("button-test-loading");

    expect(button).toHaveClass("btn-icon-left");
    expect(button).not.toHaveClass("btn-icon-right");

    expect(icon.compareDocumentPosition(label)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders the icon after the label when iconPosition is right", () => {
    renderButton(
      {
        icon: FaStar,
        iconPosition: "right",
      },
      "Favorite",
    );

    const button = screen.getByTestId("button-test");
    const icon = screen.getByTestId("button-test-icon");
    const label = screen.getByTestId("button-test-loading");

    expect(button).toHaveClass("btn-icon-right");
    expect(button).not.toHaveClass("btn-icon-left");

    expect(label.compareDocumentPosition(icon)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("does not apply the glass class by default", () => {
    renderButton({}, "Default Button");

    const button = screen.getByTestId("button-test");

    expect(button).toHaveClass("btn");
    expect(button).not.toHaveClass("btn-glass");
  });

  it("applies the glass class when glass is true", () => {
    renderButton(
      {
        variant: "glassOutline",
      },
      "Glass Button",
    );

    const button = screen.getByTestId("button-test");

    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("btn-glass");
  });

  it("uses the configured variant when the prop is omitted", () => {
    setBorealStyleConfig({
      defaultVariant: "outline",
    });

    renderButton({}, "Configured Button");

    const button = screen.getByTestId("button-test");

    expect(button).toHaveClass("btn-outline");
  });

  it("applies glass with a theme class", () => {
    renderButton(
      {
        theme: "primary",
        variant: "glassOutline",
      },
      "Primary Glass",
    );

    const button = screen.getByTestId("button-test");

    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("btn-primary");
    expect(button).toHaveClass("btn-glass");
  });

  it("applies glass with a state class", () => {
    renderButton(
      {
        state: "success",
        variant: "glassOutline",
      },
      "Success Glass",
    );

    const button = screen.getByTestId("button-test");

    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("btn-success");
    expect(button).toHaveClass("btn-glass");
  });

  it("combines glass and outline treatments", () => {
    renderButton(
      {
        theme: "secondary",
        variant: "glassOutline",
      },
      "Outlined Glass",
    );

    const button = screen.getByTestId("button-test");

    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("btn-secondary");
    expect(button).toHaveClass("btn-glass");
    expect(button).toHaveClass("btn-outline");
  });

  it("applies glass to link buttons", () => {
    renderButton(
      {
        href: "/docs",
        variant: "glassOutline",
      },
      "Glass Link",
    );

    const link = screen.getByTestId("button-test");

    expect(link.tagName).toBe("A");
    expect(link).toHaveClass("btn");
    expect(link).toHaveClass("btn-link");
    expect(link).toHaveClass("btn-glass");
  });

  it("applies theme, state, size, outline, glass, shadow, rounding, fullWidth, disabled, icon position, and custom className", () => {
    renderButton(
      {
        theme: "primary",
        state: "success",
        size: "medium",
        variant: "glassOutline",
        shadow: "light",
        rounding: "small",
        fullWidth: true,
        disabled: true,
        iconPosition: "right",
        className: "custom-class",
      },
      "Styled",
    );

    const button = screen.getByTestId("button-test");

    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("btn-primary");
    expect(button).toHaveClass("btn-success");
    expect(button).toHaveClass("btn-md");
    expect(button).toHaveClass("btn-outline");
    expect(button).toHaveClass("btn-glass");
    expect(button).toHaveClass("btn-shadow-light");
    expect(button).toHaveClass("btn-round-small");
    expect(button).toHaveClass("btn-full");
    expect(button).toHaveClass("btn-disabled");
    expect(button).toHaveClass("btn-icon-right");
    expect(button).toHaveClass("custom-class");
  });

  it("renders children inside the label container", () => {
    renderButton({}, "Button Label");

    const label = screen.getByTestId("button-test-loading");
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Button Label");
    expect(label).toHaveClass("btn-label");
  });

  it("applies custom class names to button sections", () => {
    const { unmount } = renderButton(
      {
        icon: FaStar,
        iconWrapperClassName: "custom-icon-wrapper",
        iconClassName: "custom-icon",
        labelClassName: "custom-label",
      },
      "Favorite",
    );

    const renderedIconWrapper = screen.getByTestId("button-test-icon");
    const renderedIcon = renderedIconWrapper.querySelector("svg");

    expect(renderedIconWrapper).toHaveClass("btn-icon", "custom-icon-wrapper");
    expect(renderedIcon).toHaveClass("icon-style", "custom-icon");
    expect(screen.getByTestId("button-test-loading")).toHaveClass(
      "btn-label",
      "custom-label",
    );

    unmount();

    renderButton(
      {
        icon: FaStar,
        labelClassName: "custom-label",
        loaderClassName: "custom-loader",
        loading: true,
      },
      "Saving",
    );

    const iconWrapper = screen.getByTestId("button-test-icon");
    const label = screen.getByTestId("button-test-loading");
    const loader = label.querySelector(`.${classMap.loader}`);

    expect(iconWrapper).toHaveClass("btn-icon");
    expect(label).toHaveClass("btn-label", "custom-label");
    expect(loader).toHaveClass("btn-loader", "custom-loader");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();

    renderButton({ onClick: handleClick }, "Click");

    fireEvent.click(screen.getByTestId("button-test"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("respects disabled state", () => {
    const handleClick = jest.fn();

    renderButton(
      {
        disabled: true,
        onClick: handleClick,
      },
      "Disabled",
    );

    const button = screen.getByTestId("button-test");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("disables the button when loading is true", () => {
    const handleClick = jest.fn();

    renderButton(
      {
        loading: true,
        onClick: handleClick,
      },
      "Loading",
    );

    const button = screen.getByTestId("button-test");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders loading spinner when loading is true", () => {
    renderButton({ loading: true }, "Loading");

    const loadingContainer = screen.getByTestId("button-test-loading");
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveAttribute("aria-live", "polite");
    expect(loadingContainer).toHaveAttribute("aria-atomic", "true");

    expect(
      loadingContainer.querySelector(`.${classMap.loader}`),
    ).toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("uses a custom loading label when provided", () => {
    renderButton(
      {
        loading: true,
        loadingLabel: "Saving changes",
      },
      "Save",
    );

    expect(screen.getByText("Saving changes")).toBeInTheDocument();
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });

  it("uses custom aria-live and aria-atomic values while loading", () => {
    renderButton(
      {
        loading: true,
        "aria-live": "assertive",
        "aria-atomic": false,
      },
      "Save",
    );

    const loadingContainer = screen.getByTestId("button-test-loading");
    expect(loadingContainer).toHaveAttribute("aria-live", "assertive");
    expect(loadingContainer).toHaveAttribute("aria-atomic", "false");
  });

  it("does not render child text while loading", () => {
    renderButton({ loading: true }, "Submit Form");

    const loadingContainer = screen.getByTestId("button-test-loading");
    expect(loadingContainer).not.toHaveTextContent("Submit Form");
    expect(
      loadingContainer.querySelector(`.${classMap.loader}`),
    ).toBeInTheDocument();
  });

  it("supports icon-only buttons with aria-label", () => {
    render(
      <ButtonBase
        icon={FaStar}
        aria-label="Favorite"
        classMap={classMap}
        data-testid="icon-only"
      />,
    );

    const button = screen.getByTestId("icon-only");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Favorite");
    expect(screen.getByTestId("icon-only-icon")).toBeInTheDocument();
  });

  it("supports icon-only buttons with aria-labelledby", () => {
    render(
      <>
        <span id="favorite-button-label">Favorite item</span>
        <ButtonBase
          icon={FaStar}
          aria-labelledby="favorite-button-label"
          classMap={classMap}
          data-testid="icon-only"
        />
      </>,
    );

    const button = screen.getByRole("button", { name: "Favorite item" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-labelledby", "favorite-button-label");
    expect(button).not.toHaveAttribute("aria-label");
  });

  it("does not set aria-label for text buttons unless needed", () => {
    renderButton({ "aria-label": "Favorite button" }, "Favorite");

    const button = screen.getByTestId("button-test");
    expect(button).not.toHaveAttribute("aria-label");
  });

  it("warns in development for icon-only buttons without aria-label or aria-labelledby", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <ButtonBase icon={FaStar} classMap={classMap} data-testid="icon-only" />,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      "ButtonBase: icon-only buttons must provide `aria-label` or `aria-labelledby`.",
    );

    warnSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it("does not warn in development for icon-only buttons with aria-labelledby", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <>
        <span id="icon-button-label">Favorite</span>
        <ButtonBase
          icon={FaStar}
          aria-labelledby="icon-button-label"
          classMap={classMap}
          data-testid="icon-only"
        />
      </>,
    );

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it("does not warn outside development for icon-only buttons without accessible name props", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";

    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    render(
      <ButtonBase icon={FaStar} classMap={classMap} data-testid="icon-only" />,
    );

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it("renders anchor when href is provided", () => {
    renderButton({ href: "/profile" }, "Profile");

    const link = screen.getByTestId("button-test");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/profile");
    expect(link).toHaveClass("btn-link");
  });

  it("renders external anchor attributes when href is external", () => {
    renderButton({ href: "https://example.com", isExternal: true }, "External");

    const link = screen.getByTestId("button-test");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("(opens in a new tab)")).toBeInTheDocument();
  });

  it("does not set target or rel for internal href", () => {
    renderButton({ href: "/dashboard", isExternal: false }, "Dashboard");

    const link = screen.getByTestId("button-test");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
  });

  it("prevents navigation for disabled anchors", () => {
    const handleClick = jest.fn();

    renderButton(
      {
        href: "/profile",
        disabled: true,
        onClick: handleClick,
      },
      "Disabled Link",
    );

    const link = screen.getByTestId("button-test");
    expect(link.tagName).toBe("A");
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");

    fireEvent.click(link);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("calls onClick for enabled anchors", () => {
    const handleClick = jest.fn((event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
    });

    renderButton(
      {
        href: "/profile",
        onClick: handleClick,
      },
      "Profile",
    );

    fireEvent.click(screen.getByTestId("button-test"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("supports a custom LinkComponent", () => {
    const CustomLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >(function CustomLink(props, ref) {
      return <a ref={ref} data-custom-link="true" {...props} />;
    });

    render(
      <ButtonBase
        href="/custom"
        classMap={classMap}
        LinkComponent={CustomLink}
        data-testid="custom-link"
      >
        Custom Link
      </ButtonBase>,
    );

    const link = screen.getByTestId("custom-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/custom");
    expect(link).toHaveAttribute("data-custom-link", "true");
  });

  it("applies theme, state, size, outline, shadow, rounding, fullWidth, disabled, and custom className", () => {
    renderButton(
      {
        theme: "primary",
        state: "success",
        size: "medium",
        variant: "outline",
        shadow: "light",
        rounding: "small",
        fullWidth: true,
        disabled: true,
        className: "custom-class",
      },
      "Styled",
    );

    const button = screen.getByTestId("button-test");
    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("btn-primary");
    expect(button).toHaveClass("btn-success");
    expect(button).toHaveClass("btn-md");
    expect(button).toHaveClass("btn-outline");
    expect(button).toHaveClass("btn-shadow-light");
    expect(button).toHaveClass("btn-round-small");
    expect(button).toHaveClass("btn-full");
    expect(button).toHaveClass("btn-disabled");
    expect(button).toHaveClass("custom-class");
  });

  it("forwards extra props to button elements", () => {
    renderButton(
      {
        id: "my-button",
        name: "actionButton",
        "aria-describedby": "button-help",
      },
      "Forwarded",
    );

    const button = screen.getByTestId("button-test");
    expect(button).toHaveAttribute("id", "my-button");
    expect(button).toHaveAttribute("name", "actionButton");
    expect(button).toHaveAttribute("aria-describedby", "button-help");
  });

  it("forwards extra props to anchor elements", () => {
    renderButton(
      {
        href: "/profile",
        id: "my-link",
        "aria-describedby": "link-help",
      },
      "Profile",
    );

    const link = screen.getByTestId("button-test");
    expect(link).toHaveAttribute("id", "my-link");
    expect(link).toHaveAttribute("aria-describedby", "link-help");
  });

  it("supports custom button type", () => {
    renderButton({ type: "submit" }, "Submit");

    expect(screen.getByTestId("button-test")).toHaveAttribute("type", "submit");
  });

  it("uses the default test id when none is provided", () => {
    render(<ButtonBase classMap={classMap}>Default Test Id</ButtonBase>);

    expect(screen.getByTestId("button")).toBeInTheDocument();
    expect(screen.getByTestId("button-loading")).toBeInTheDocument();
  });

  it("applies aria-describedby and aria-labelledby to button elements", () => {
    render(
      <>
        <span id="button-label">Save item</span>
        <span id="button-description">This action saves your draft.</span>
        <ButtonBase
          classMap={classMap}
          data-testid="button-test"
          aria-labelledby="button-label"
          aria-describedby="button-description"
        />
      </>,
    );

    const button = screen.getByRole("button", { name: "Save item" });
    expect(button).toHaveAttribute("aria-labelledby", "button-label");
    expect(button).toHaveAttribute("aria-describedby", "button-description");
  });

  it("applies disclosure-related aria props to button elements", () => {
    renderButton(
      {
        "aria-controls": "details-panel",
        "aria-expanded": true,
        "aria-haspopup": "dialog",
      },
      "Open details",
    );

    const button = screen.getByTestId("button-test");
    expect(button).toHaveAttribute("aria-controls", "details-panel");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("applies aria-pressed to button elements", () => {
    renderButton(
      {
        "aria-pressed": true,
      },
      "Bold",
    );

    const button = screen.getByTestId("button-test");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("applies aria-current to button elements", () => {
    renderButton(
      {
        "aria-current": "page",
      },
      "Current page",
    );

    const button = screen.getByTestId("button-test");
    expect(button).toHaveAttribute("aria-current", "page");
  });

  it("applies aria props to anchor elements", () => {
    renderButton(
      {
        href: "/settings",
        "aria-controls": "settings-panel",
        "aria-expanded": false,
        "aria-current": "page",
        "aria-haspopup": "menu",
      },
      "Settings",
    );

    const link = screen.getByTestId("button-test");
    expect(link).toHaveAttribute("aria-controls", "settings-panel");
    expect(link).toHaveAttribute("aria-expanded", "false");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveAttribute("aria-haspopup", "menu");
  });

  it("sets aria-busy on links when loading is true", () => {
    renderButton(
      {
        href: "/sync",
        loading: true,
      },
      "Sync",
    );

    const link = screen.getByTestId("button-test");
    expect(link).toHaveAttribute("aria-busy", "true");
  });

  it("supports overriding aria-busy on button elements when not loading", () => {
    renderButton(
      {
        "aria-busy": false,
      },
      "Idle",
    );

    const button = screen.getByTestId("button-test");
    expect(button).toHaveAttribute("aria-busy", "false");
  });

  it("supports overriding aria-disabled on anchor elements", () => {
    renderButton(
      {
        href: "/profile",
        "aria-disabled": true,
      },
      "Profile",
    );

    const link = screen.getByTestId("button-test");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("applies a custom target value to anchor links", () => {
    renderButton(
      {
        href: "https://example.com",
        target: "_blank",
      },
      "Open Example",
    );

    const link = screen.getByTestId("button-test");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("applies custom target and rel values to anchor links", () => {
    renderButton(
      {
        href: "/docs",
        target: "_blank",
        rel: "external",
      },
      "Docs",
    );

    const link = screen.getByTestId("button-test");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "external");
  });

  it("applies a non-blank target value without rel", () => {
    renderButton(
      {
        href: "/docs",
        target: "_self",
      },
      "Docs",
    );

    const link = screen.getByTestId("button-test");
    expect(link).toHaveAttribute("target", "_self");
    expect(link).not.toHaveAttribute("rel");
  });

  it("shows new-tab text when target is _blank", () => {
    renderButton(
      {
        href: "/external-docs",
        target: "_blank",
      },
      "External Docs",
    );

    expect(screen.getByText("(opens in a new tab)")).toBeInTheDocument();
  });

  it("renders as a custom element when as is provided without href", () => {
    renderButton(
      {
        as: "div",
      },
      "Div Button",
    );

    const element = screen.getByTestId("button-test");
    expect(element.tagName).toBe("DIV");
    expect(element).toHaveAttribute("role", "button");
    expect(element).toHaveTextContent("Div Button");
  });

  it("renders as a custom anchor element when as='a' and href is provided", () => {
    renderButton(
      {
        as: "a",
        href: "/about",
      },
      "About",
    );

    const link = screen.getByTestId("button-test");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/about");
  });

  it("renders href links using the as prop instead of LinkComponent when as is provided", () => {
    const CustomAnchor = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement>
    >(function CustomAnchor(props, ref) {
      return <a ref={ref} data-as-link="true" {...props} />;
    });

    render(
      <ButtonBase
        href="/custom-as"
        as={CustomAnchor}
        classMap={classMap}
        data-testid="button-test"
      >
        Custom As Link
      </ButtonBase>,
    );

    const link = screen.getByTestId("button-test");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/custom-as");
    expect(link).toHaveAttribute("data-as-link", "true");
  });

  it("renders non-button custom components with button semantics when as is provided", () => {
    const CustomDiv = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(function CustomDiv(props, ref) {
      return <div ref={ref} data-custom-div="true" {...props} />;
    });

    render(
      <ButtonBase as={CustomDiv} classMap={classMap} data-testid="button-test">
        Custom Div Button
      </ButtonBase>,
    );

    const element = screen.getByTestId("button-test");
    expect(element.tagName).toBe("DIV");
    expect(element).toHaveAttribute("data-custom-div", "true");
    expect(element).toHaveAttribute("role", "button");
  });

  it("prevents href navigation and removes target when disabled even if target is provided", () => {
    renderButton(
      {
        href: "https://example.com",
        target: "_blank",
        disabled: true,
      },
      "Disabled External",
    );

    const link = screen.getByTestId("button-test");
    expect(link).not.toHaveAttribute("href");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("rel");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("has no accessibility violations for custom as rendering", async () => {
    const { container } = render(
      <ButtonBase as="div" classMap={classMap} data-testid="button-test">
        Custom Div Button
      </ButtonBase>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for standard button", async () => {
    const { container } = renderButton(
      {
        icon: FaStar,
      },
      "Accessible Button",
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for icon-only button with aria-label", async () => {
    const { container } = render(
      <ButtonBase
        icon={FaStar}
        aria-label="Favorite"
        classMap={classMap}
        data-testid="icon-only"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for icon-only button with aria-labelledby", async () => {
    const { container } = render(
      <>
        <span id="favorite-label">Favorite item</span>
        <ButtonBase
          icon={FaStar}
          aria-labelledby="favorite-label"
          classMap={classMap}
          data-testid="icon-only"
        />
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for link button", async () => {
    const { container } = renderButton(
      {
        href: "/profile",
        icon: FaStar,
      },
      "Profile",
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for loading button", async () => {
    const { container } = renderButton(
      {
        loading: true,
      },
      "Loading",
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
