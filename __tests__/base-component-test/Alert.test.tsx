import { fireEvent, render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import AlertBase from "../../src/components/Alert/AlertBase";

expect.extend(toHaveNoViolations);

const classMap = {
  alert: "alert",
  icon: "alert__icon",
  content: "alert__content",
  title: "alert__title",
  message: "alert__message",
  actions: "alert__actions",
  dismissButton: "alert__dismiss",

  primary: "alert--primary",
  secondary: "alert--secondary",
  tertiary: "alert--tertiary",
  quaternary: "alert--quaternary",
  clear: "alert--clear",

  success: "alert--success",
  error: "alert--error",
  warning: "alert--warning",
  info: "alert--info",

  soft: "alert--soft",
  solid: "alert--solid",
  subtle: "alert--subtle",

  shadowNone: "alert--shadow-none",
  shadowLight: "alert--shadow-light",
  shadowMedium: "alert--shadow-medium",
  shadowStrong: "alert--shadow-strong",
  shadowIntense: "alert--shadow-intense",

  roundNone: "alert--round-none",
  roundSmall: "alert--round-small",
  roundMedium: "alert--round-medium",
  roundLarge: "alert--round-large",
  roundFull: "alert--round-full",
  glass: "alert--glass",
  outline: "alert--outline",
} as const;

describe("AlertBase", () => {
  it("renders title and message content", () => {
    render(
      <AlertBase classMap={classMap} title="Saved" testId="save-alert">
        Your changes were saved.
      </AlertBase>,
    );

    expect(screen.getByTestId("save-alert")).toBeInTheDocument();
    expect(screen.getByTestId("save-alert-title")).toHaveTextContent("Saved");
    expect(screen.getByTestId("save-alert-message")).toHaveTextContent(
      "Your changes were saved.",
    );
  });

  it("uses status role by default when state is not error", () => {
    render(
      <AlertBase classMap={classMap} title="Info" state="success">
        Everything looks good.
      </AlertBase>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses alert role by default when state is error", () => {
    render(
      <AlertBase classMap={classMap} title="Error" state="error">
        Something went wrong.
      </AlertBase>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("allows the role to be overridden", () => {
    render(
      <AlertBase classMap={classMap} role="note" title="Note">
        Custom role alert.
      </AlertBase>,
    );

    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it("uses testId over data-testid when both are provided", () => {
    render(
      <AlertBase
        classMap={classMap}
        testId="preferred-alert"
        data-testid="fallback-alert"
        title="Preferred"
      >
        Test id precedence.
      </AlertBase>,
    );

    expect(screen.getByTestId("preferred-alert")).toBeInTheDocument();
    expect(screen.queryByTestId("fallback-alert")).not.toBeInTheDocument();
  });

  it("uses data-testid when testId is not provided", () => {
    render(
      <AlertBase classMap={classMap} data-testid="custom-data-alert">
        Data test id alert.
      </AlertBase>,
    );

    expect(screen.getByTestId("custom-data-alert")).toBeInTheDocument();
  });

  it("falls back to the default test id", () => {
    render(<AlertBase classMap={classMap}>Default test id.</AlertBase>);

    expect(screen.getByTestId("alert")).toBeInTheDocument();
  });

  it("renders an icon as decorative when provided", () => {
    render(
      <AlertBase
        classMap={classMap}
        testId="icon-alert"
        icon={<svg data-testid="mock-icon" />}
      >
        Alert with icon.
      </AlertBase>,
    );

    const iconWrapper = screen.getByTestId("icon-alert-icon");

    expect(iconWrapper).toBeInTheDocument();
    expect(iconWrapper).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("does not render icon, title, message, actions, or dismiss button when not provided", () => {
    render(<AlertBase classMap={classMap} testId="minimal-alert" />);

    expect(screen.getByTestId("minimal-alert")).toBeInTheDocument();
    expect(screen.queryByTestId("minimal-alert-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("minimal-alert-title")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("minimal-alert-message"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("minimal-alert-dismiss"),
    ).not.toBeInTheDocument();
  });

  it("renders actions when provided", () => {
    render(
      <AlertBase
        classMap={classMap}
        title="Action needed"
        actions={<button type="button">Retry</button>}
      >
        The request failed.
      </AlertBase>,
    );

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders a dismiss button when dismissible is true", () => {
    const onDismiss = jest.fn();

    render(
      <AlertBase
        classMap={classMap}
        testId="dismissible-alert"
        dismissible
        onDismiss={onDismiss}
      >
        Dismiss me.
      </AlertBase>,
    );

    const dismissButton = screen.getByRole("button", {
      name: "Dismiss alert",
    });

    expect(dismissButton).toBeInTheDocument();

    fireEvent.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("uses a custom dismiss label", () => {
    render(
      <AlertBase
        classMap={classMap}
        dismissible
        dismissLabel="Close notification"
      >
        Custom dismiss label.
      </AlertBase>,
    );

    expect(
      screen.getByRole("button", { name: "Close notification" }),
    ).toBeInTheDocument();
  });

  it("does not render a dismiss button when dismissible is false even if onDismiss is provided", () => {
    render(
      <AlertBase classMap={classMap} onDismiss={jest.fn()}>
        Not dismissible.
      </AlertBase>,
    );

    expect(
      screen.queryByRole("button", { name: "Dismiss alert" }),
    ).not.toBeInTheDocument();
  });

  it("applies theme, state, variant, glass, shadow, rounding, and custom root classes", () => {
    render(
      <AlertBase
        classMap={classMap}
        testId="styled-alert"
        theme="secondary"
        state="warning"
        variant="glassOutline"
        shadow="strong"
        rounding="large"
        className="custom-alert"
      >
        Styled alert.
      </AlertBase>,
    );

    expect(screen.getByTestId("styled-alert")).toHaveClass(
      "alert",
      "alert--secondary",
      "alert--warning",
      "alert--outline",
      "alert--glass",
      "alert--shadow-strong",
      "alert--round-large",
      "custom-alert",
    );
  });

  it("does not apply optional state, glass, shadow, or rounding classes when disabled or empty", () => {
    render(
      <AlertBase
        classMap={classMap}
        testId="plain-alert"
        theme="primary"
        state=""
        variant="soft"
        shadow="none"
        rounding="none"
      >
        Plain alert.
      </AlertBase>,
    );

    const alert = screen.getByTestId("plain-alert");

    expect(alert).toHaveClass(
      "alert",
      "alert--primary",
      "alert--soft",
      "alert--shadow-none",
      "alert--round-none",
    );

    expect(alert).not.toHaveClass("alert--glass");
    expect(alert).not.toHaveClass("alert--success");
    expect(alert).not.toHaveClass("alert--error");
    expect(alert).not.toHaveClass("alert--warning");
  });

  it("applies custom slot class names", () => {
    render(
      <AlertBase
        classMap={classMap}
        testId="slot-alert"
        title="Slots"
        icon={<span>!</span>}
        actions={<button type="button">Action</button>}
        dismissible
        iconClassName="custom-icon"
        contentClassName="custom-content"
        titleClassName="custom-title"
        messageClassName="custom-message"
        actionsClassName="custom-actions"
        dismissButtonClassName="custom-dismiss"
      >
        Slot classes.
      </AlertBase>,
    );

    expect(screen.getByTestId("slot-alert-icon")).toHaveClass(
      "alert__icon",
      "custom-icon",
    );

    expect(screen.getByTestId("slot-alert-title")).toHaveClass(
      "alert__title",
      "custom-title",
    );

    expect(screen.getByTestId("slot-alert-message")).toHaveClass(
      "alert__message",
      "custom-message",
    );

    expect(screen.getByRole("button", { name: "Dismiss alert" })).toHaveClass(
      "alert__dismiss",
      "custom-dismiss",
    );

    expect(screen.getByText("Slot classes.").parentElement).toHaveClass(
      "alert__content",
      "custom-content",
    );

    expect(
      screen.getByRole("button", { name: "Action" }).parentElement,
    ).toHaveClass("alert__actions", "custom-actions");
  });

  it("supports ReactNode title, children, icon, and actions", () => {
    render(
      <AlertBase
        classMap={classMap}
        testId="react-node-alert"
        title={<span>Custom title node</span>}
        icon={<span data-testid="node-icon">i</span>}
        actions={<a href="/details">View details</a>}
      >
        <span>Custom message node</span>
      </AlertBase>,
    );

    expect(screen.getByText("Custom title node")).toBeInTheDocument();
    expect(screen.getByText("Custom message node")).toBeInTheDocument();
    expect(screen.getByTestId("node-icon")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute(
      "href",
      "/details",
    );
  });

  it("has no accessibility violations for a basic status alert", async () => {
    const { container } = render(
      <AlertBase classMap={classMap} title="Saved" state="success">
        Your changes were saved successfully.
      </AlertBase>,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for an error alert with actions and dismiss button", async () => {
    const { container } = render(
      <AlertBase
        classMap={classMap}
        title="Upload failed"
        state="error"
        icon={<span>!</span>}
        actions={<button type="button">Try again</button>}
        dismissible
        onDismiss={jest.fn()}
      >
        The selected file could not be uploaded.
      </AlertBase>,
    );

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
