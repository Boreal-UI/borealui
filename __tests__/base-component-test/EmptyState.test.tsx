import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseEmptyState from "@/components/EmptyState/EmptyStateBase";
import { FaRegSmile } from "../../shared-story-assets/icons";
import { DummyButton } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const classMap = {
  empty_state: "emptyState",
  title: "emptyTitle",
  message: "emptyMessage",
  icon: "emptyIcon",

  primary: "themePrimary",
  secondary: "themeSecondary",
  success: "stateSuccess",
  error: "stateError",
  warning: "stateWarning",

  small: "sizeSmall",
  medium: "sizeMedium",
  large: "sizeLarge",

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
  glass: "glass",
  outline: "outline",
};

const renderEmptyState = (
  props: Partial<React.ComponentProps<typeof BaseEmptyState>> = {},
) => {
  return render(
    <BaseEmptyState
      icon={FaRegSmile}
      title="No Data"
      message="Please add some data to get started."
      Button={DummyButton}
      classMap={classMap}
      data-testid="empty-state"
      {...props}
    />,
  );
};

describe("BaseEmptyState", () => {
  it("renders the titled region variant with title, message, and icon", () => {
    renderEmptyState();

    const section = screen.getByTestId("empty-state");
    const region = screen.getByRole("region", { name: "No Data" });
    const title = screen.getByTestId("empty-state-title");
    const message = screen.getByTestId("empty-state-message");
    const icon = screen.getByTestId("empty-state-icon");

    expect(section).toBeInTheDocument();
    expect(region).toBe(section);
    expect(title).toHaveTextContent("No Data");
    expect(message).toHaveTextContent("Please add some data to get started.");
    expect(icon).toBeInTheDocument();
  });

  it("renders the default title and message when not provided", () => {
    render(
      <BaseEmptyState
        Button={DummyButton}
        classMap={classMap}
        data-testid="empty-state"
      />,
    );

    expect(
      screen.getByRole("region", { name: "Nothing Here Yet" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("empty-state-title")).toHaveTextContent(
      "Nothing Here Yet",
    );
    expect(screen.getByTestId("empty-state-message")).toHaveTextContent(
      "There’s no content to display.",
    );
  });

  it("applies theme, state, size, shadow, rounding, outline, glass, and custom className", () => {
    renderEmptyState({
      theme: "secondary",
      state: "warning",
      size: "large",
      shadow: "medium",
      rounding: "large",
      variant: "glassOutline",
      className: "customClass",
    });

    const section = screen.getByTestId("empty-state");

    expect(section).toHaveClass("emptyState");
    expect(section).toHaveClass("themeSecondary");
    expect(section).toHaveClass("stateWarning");
    expect(section).toHaveClass("sizeLarge");
    expect(section).toHaveClass("shadowMedium");
    expect(section).toHaveClass("roundLarge");
    expect(section).toHaveClass("outline");
    expect(section).toHaveClass("glass");
    expect(section).toHaveClass("customClass");
  });

  it("renders icon as decorative and hides it from assistive technology by default", () => {
    renderEmptyState();

    const iconWrapper = screen.getByTestId("empty-state-icon");
    const svg = iconWrapper.querySelector("svg");

    expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).not.toHaveAttribute("aria-label");
  });

  it("renders a non-decorative icon with an accessible label", () => {
    renderEmptyState({
      iconDecorative: false,
      iconAriaLabel: "Happy empty state",
    });

    const iconWrapper = screen.getByTestId("empty-state-icon");
    const svg = iconWrapper.querySelector("svg");

    expect(iconWrapper).not.toHaveAttribute("aria-hidden");
    expect(svg).toBeInTheDocument();
    expect(svg).not.toHaveAttribute("aria-hidden");
    expect(svg).toHaveAttribute("aria-label", "Happy empty state");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  it("does not render icon wrapper when no icon is provided", () => {
    renderEmptyState({ icon: undefined });

    expect(screen.queryByTestId("empty-state-icon")).not.toBeInTheDocument();
  });

  it("does not render message when message is empty", () => {
    renderEmptyState({ message: "" });

    expect(screen.queryByTestId("empty-state-message")).not.toBeInTheDocument();
  });

  it("renders action button and handles click", () => {
    const onActionClick = jest.fn();

    renderEmptyState({
      actionLabel: "Try Again",
      onActionClick,
    });

    const button = screen.getByTestId("empty-state-action");
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Try Again");
    expect(onActionClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom class names to empty state sections", () => {
    renderEmptyState({
      actionLabel: "Try Again",
      onActionClick: jest.fn(),
      iconClassName: "custom-icon",
      titleClassName: "custom-title",
      messageClassName: "custom-message",
      actionButtonClassName: "custom-action",
    });

    expect(screen.getByTestId("empty-state-icon")).toHaveClass(
      "emptyIcon",
      "custom-icon",
    );
    expect(screen.getByTestId("empty-state-title")).toHaveClass(
      "emptyTitle",
      "custom-title",
    );
    expect(screen.getByTestId("empty-state-message")).toHaveClass(
      "emptyMessage",
      "custom-message",
    );
    expect(screen.getByTestId("empty-state-action")).toHaveClass(
      "custom-action",
    );
  });

  it("passes theme='clear' and outline to the injected Button component", () => {
    renderEmptyState({
      actionLabel: "Retry",
      onActionClick: jest.fn(),
      variant: "glassOutline",
    });

    const button = screen.getByTestId("empty-state-action");

    expect(button).toHaveAttribute("data-theme", "clear");
    expect(button).toHaveAttribute("data-outline", "true");
    expect(button).toHaveAttribute("data-glass", "true");
  });

  it("does not render action button when actionLabel is missing", () => {
    renderEmptyState({
      actionLabel: undefined,
      onActionClick: jest.fn(),
    });

    expect(screen.queryByTestId("empty-state-action")).not.toBeInTheDocument();
  });

  it("does not render action button when onActionClick is missing", () => {
    renderEmptyState({
      actionLabel: "Try Again",
      onActionClick: undefined,
    });

    expect(screen.queryByTestId("empty-state-action")).not.toBeInTheDocument();
  });

  it("does not add aria-label to the action button when actionLabel is a string", () => {
    renderEmptyState({
      actionLabel: "Try Again",
      onActionClick: jest.fn(),
    });

    const button = screen.getByTestId("empty-state-action");
    expect(button).not.toHaveAttribute("aria-label");
  });

  it("adds a fallback aria-label to the action button when actionLabel is not a string", () => {
    renderEmptyState({
      actionLabel: <span>Retry</span>,
      onActionClick: jest.fn(),
    });

    const button = screen.getByTestId("empty-state-action");
    expect(button).toHaveAttribute("aria-label", "Perform action");
  });

  it("uses actionAriaLabel when provided", () => {
    renderEmptyState({
      actionLabel: <span>Retry</span>,
      actionAriaLabel: "Retry loading content",
      onActionClick: jest.fn(),
    });

    const button = screen.getByTestId("empty-state-action");
    expect(button).toHaveAttribute("aria-label", "Retry loading content");
  });

  it("connects the region to title and message with aria-labelledby and aria-describedby", () => {
    renderEmptyState();

    const section = screen.getByTestId("empty-state");
    const title = screen.getByTestId("empty-state-title");
    const message = screen.getByTestId("empty-state-message");

    expect(section).toHaveAttribute("aria-labelledby", title.id);
    expect(section).toHaveAttribute("aria-describedby", message.id);
  });

  it("does not set aria-describedby when message is not rendered", () => {
    renderEmptyState({ message: "" });

    const section = screen.getByTestId("empty-state");
    expect(section).not.toHaveAttribute("aria-describedby");
  });

  it("uses aria-label instead of generated aria-labelledby when aria-label is provided", () => {
    renderEmptyState({
      "aria-label": "Empty search results",
    });

    const section = screen.getByTestId("empty-state");
    expect(section).toHaveAttribute("aria-label", "Empty search results");
    expect(section).not.toHaveAttribute("aria-labelledby");
  });

  it("uses custom aria-labelledby and aria-describedby when provided", () => {
    renderEmptyState({
      "aria-labelledby": "external-title",
      "aria-describedby": "external-description",
    });

    const section = screen.getByTestId("empty-state");

    expect(section).toHaveAttribute("aria-labelledby", "external-title");
    expect(section).toHaveAttribute("aria-describedby", "external-description");
  });

  it("uses a custom role when provided", () => {
    renderEmptyState({
      role: "status",
    });

    expect(screen.getByTestId("empty-state")).toHaveAttribute("role", "status");
  });

  it("passes a custom id to the root section", () => {
    renderEmptyState({
      id: "custom-empty-state",
    });

    expect(screen.getByTestId("empty-state")).toHaveAttribute(
      "id",
      "custom-empty-state",
    );
  });

  it("passes through additional HTML attributes to the root section", () => {
    renderEmptyState({
      lang: "en-CA",
      tabIndex: -1,
    });

    const section = screen.getByTestId("empty-state");
    expect(section).toHaveAttribute("lang", "en-CA");
    expect(section).toHaveAttribute("tabindex", "-1");
  });

  it("renders the no-title branch without a default role or heading", () => {
    renderEmptyState({
      title: "",
      message: "Only message available.",
    });

    const section = screen.getByTestId("empty-state");

    expect(section.tagName).toBe("SECTION");
    expect(section).not.toHaveAttribute("role");
    expect(section).not.toHaveAttribute("aria-labelledby");
    expect(screen.queryByTestId("empty-state-title")).not.toBeInTheDocument();
    expect(screen.getByTestId("empty-state-message")).toHaveTextContent(
      "Only message available.",
    );
  });

  it("still renders icon and action button in the no-title branch", () => {
    const onActionClick = jest.fn();

    renderEmptyState({
      title: "",
      actionLabel: "Reload",
      onActionClick,
    });

    expect(screen.getByTestId("empty-state-icon")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state-action")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("empty-state-action"));
    expect(onActionClick).toHaveBeenCalledTimes(1);
  });

  it("supports a custom test id prefix for nested elements", () => {
    render(
      <BaseEmptyState
        icon={FaRegSmile}
        title="Custom Empty"
        message="Custom message"
        actionLabel="Retry"
        onActionClick={jest.fn()}
        Button={DummyButton}
        classMap={classMap}
        data-testid="custom-empty"
      />,
    );

    expect(screen.getByTestId("custom-empty")).toBeInTheDocument();
    expect(screen.getByTestId("custom-empty-title")).toBeInTheDocument();
    expect(screen.getByTestId("custom-empty-message")).toBeInTheDocument();
    expect(screen.getByTestId("custom-empty-icon")).toBeInTheDocument();
    expect(screen.getByTestId("custom-empty-action")).toBeInTheDocument();
  });

  it("has no accessibility violations in the titled region variant", async () => {
    const { container } = renderEmptyState({
      actionLabel: "Try Again",
      onActionClick: jest.fn(),
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in the no-title branch", async () => {
    const { container } = renderEmptyState({
      title: "",
      actionLabel: "Retry",
      onActionClick: jest.fn(),
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when using a custom aria-label and announced icon", async () => {
    const { container } = renderEmptyState({
      "aria-label": "Empty notifications",
      iconDecorative: false,
      iconAriaLabel: "Notification placeholder",
      actionLabel: <span>Open settings</span>,
      actionAriaLabel: "Open notification settings",
      onActionClick: jest.fn(),
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
