import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseNotificationCenter from "@/components/NotificationCenter/NotificationCenterBase";
import { DummyButton, DummyIconButton } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

jest.mock("@/components/NotificationCenter/NotificationCenter.types", () => ({
  ...jest.requireActual(
    "@/components/NotificationCenter/NotificationCenter.types",
  ),
  themeIcons: {
    success: () => <svg data-testid="icon-success" />,
    error: () => <svg data-testid="icon-error" />,
    info: () => <svg data-testid="icon-info" />,
    warning: () => <svg data-testid="icon-warning" />,
    general: () => <svg data-testid="icon-general" />,
  },
}));

const classMap = {
  wrapper: "wrapper",
  header: "header",
  body: "body",
  list: "list",
  notification: "notification",
  icon: "icon",
  content: "content",
  message: "message",
  timestamp: "timestamp",
  close: "close",
  clearAll: "clearAll",
  empty: "empty",
  srOnly: "srOnly",
  success: "success",
  error: "error",
  info: "info",
  warning: "warning",
  general: "general",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
};

describe("BaseNotificationCenter", () => {
  const testId = "notification-center";

  const mockNotifications = [
    {
      id: "1",
      message: "Success message",
      type: "success" as const,
      timestamp: new Date("2025-04-20T10:30:00"),
    },
    {
      id: "2",
      message: "Error occurred",
      type: "error" as const,
    },
  ];

  const renderNotificationCenter = (props = {}) =>
    render(
      <BaseNotificationCenter
        notifications={mockNotifications}
        onRemove={jest.fn()}
        onClearAll={jest.fn()}
        showClearAll
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
        {...props}
      />,
    );

  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders the notification center with default accessible region labeling", () => {
    renderNotificationCenter();

    const region = screen.getByRole("region", { name: /notifications/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("data-testid", testId);
    expect(region).toHaveAttribute("aria-labelledby", `${testId}-title`);

    expect(screen.getByTestId(`${testId}-header`)).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("renders notifications with message content, timestamp, and dismiss controls", () => {
    renderNotificationCenter();

    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByText("Error occurred")).toBeInTheDocument();

    expect(screen.getByTestId(`${testId}-item-1-message`)).toHaveTextContent(
      "Success message",
    );
    expect(screen.getByTestId(`${testId}-item-2-message`)).toHaveTextContent(
      "Error occurred",
    );

    expect(
      screen.getByTestId(`${testId}-item-1-timestamp`),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-item-2-timestamp`),
    ).not.toBeInTheDocument();

    expect(screen.getByTestId(`${testId}-item-1-dismiss`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-item-2-dismiss`)).toBeInTheDocument();
  });

  it("renders the live region with correct default accessibility attributes", () => {
    renderNotificationCenter();

    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-relevant", "additions text");
    expect(status).toHaveAttribute("aria-atomic", "false");
    expect(status).toHaveAttribute("data-testid", `${testId}-live-region`);
  });

  it("renders the list labeled by the internal title by default", () => {
    renderNotificationCenter();

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list).toHaveAttribute("aria-labelledby", `${testId}-title`);
    expect(list).not.toHaveAttribute("aria-label");
  });

  it("renders each notification item with semantic listitem role", () => {
    renderNotificationCenter();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(screen.getByTestId(`${testId}-item-1`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-item-2`)).toBeInTheDocument();
  });

  it("renders themed icons for each notification type", () => {
    renderNotificationCenter();

    const successItem = screen.getByTestId("notification-center-item-1");
    const errorItem = screen.getByTestId("notification-center-item-2");

    expect(successItem.querySelector("svg.icon")).toBeInTheDocument();
    expect(errorItem.querySelector("svg.icon")).toBeInTheDocument();
  });

  it("applies notification styling classes including rounding, shadow, and state", () => {
    renderNotificationCenter({
      notificationRounding: "medium",
      notificationShadow: "light",
    });

    expect(screen.getByTestId(`${testId}-item-1`)).toHaveClass(
      "notification",
      "shadowLight",
      "roundMedium",
      "success",
    );

    expect(screen.getByTestId(`${testId}-item-2`)).toHaveClass(
      "notification",
      "shadowLight",
      "roundMedium",
      "error",
    );
  });

  it("applies custom class names to notification center sections", () => {
    renderNotificationCenter({
      className: "custom-wrapper",
      headerClassName: "custom-header",
      clearAllClassName: "custom-clear",
      bodyClassName: "custom-body",
      listClassName: "custom-list",
      notificationClassName: "custom-notification",
      iconClassName: "custom-icon",
      contentClassName: "custom-content",
      messageClassName: "custom-message",
      timestampClassName: "custom-timestamp",
      closeButtonClassName: "custom-close",
    });

    const item = screen.getByTestId(`${testId}-item-1`);

    expect(screen.getByTestId(testId)).toHaveClass("wrapper", "custom-wrapper");
    expect(screen.getByTestId(`${testId}-header`)).toHaveClass(
      "header",
      "custom-header",
    );
    expect(screen.getByTestId(`${testId}-clear-all`)).toHaveClass(
      "clearAll",
      "custom-clear",
    );
    expect(screen.getByTestId(`${testId}-live-region`)).toHaveClass(
      "body",
      "custom-body",
    );
    expect(screen.getByRole("list")).toHaveClass("list", "custom-list");
    expect(item).toHaveClass("notification", "custom-notification");
    expect(item.querySelector("svg")).toHaveClass("icon", "custom-icon");
    expect(screen.getByTestId(`${testId}-item-1-message`).parentElement).toHaveClass(
      "content",
      "custom-content",
    );
    expect(screen.getByTestId(`${testId}-item-1-message`)).toHaveClass(
      "message",
      "custom-message",
    );
    expect(screen.getByTestId(`${testId}-item-1-timestamp`)).toHaveClass(
      "timestamp",
      "custom-timestamp",
    );
    expect(screen.getByTestId(`${testId}-item-1-dismiss`)).toHaveClass(
      "close",
      "custom-close",
    );
  });

  it("applies custom class names to the empty notification state", () => {
    render(
      <BaseNotificationCenter
        notifications={[]}
        onRemove={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
        emptyClassName="custom-empty"
      />,
    );

    expect(screen.getByTestId(`${testId}-empty`)).toHaveClass(
      "empty",
      "custom-empty",
    );
  });

  it("shows the clear all button only when enabled, notifications exist, and onClearAll is provided", () => {
    renderNotificationCenter();

    expect(screen.getByTestId(`${testId}-clear-all`)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /clear all notifications/i }),
    ).toBeInTheDocument();
  });

  it("does not render the clear all button when showClearAll is false", () => {
    renderNotificationCenter({ showClearAll: false });

    expect(screen.queryByTestId(`${testId}-clear-all`)).not.toBeInTheDocument();
  });

  it("does not render the clear all button when there are no notifications", () => {
    render(
      <BaseNotificationCenter
        notifications={[]}
        onRemove={jest.fn()}
        onClearAll={jest.fn()}
        showClearAll
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
      />,
    );

    expect(screen.queryByTestId(`${testId}-clear-all`)).not.toBeInTheDocument();
  });

  it("triggers onRemove when a dismiss button is clicked", () => {
    const onRemove = jest.fn();

    renderNotificationCenter({ onRemove });

    fireEvent.click(screen.getByTestId(`${testId}-item-1-dismiss`));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith("1");
  });

  it("triggers onClearAll when the clear all button is clicked", () => {
    const onClearAll = jest.fn();

    renderNotificationCenter({ onClearAll });

    fireEvent.click(screen.getByTestId(`${testId}-clear-all`));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it("applies a custom region aria-label when provided", () => {
    renderNotificationCenter({
      "aria-label": "Alerts panel",
    });

    const region = screen.getByRole("region", { name: /notifications/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-label", "Alerts panel");
  });

  it("supports aria-describedby on the outer region", () => {
    render(
      <>
        <p id="notification-help">Recent account activity and system alerts</p>
        <BaseNotificationCenter
          notifications={mockNotifications}
          onRemove={jest.fn()}
          onClearAll={jest.fn()}
          showClearAll
          Button={DummyButton}
          IconButton={DummyIconButton}
          classMap={classMap}
          data-testid={testId}
          aria-describedby="notification-help"
        />
      </>,
    );

    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-describedby",
      "notification-help",
    );
  });

  it("uses external aria-labelledby when provided and does not render the internal title", () => {
    render(
      <>
        <h2 id="external-notification-title">System Alerts</h2>
        <BaseNotificationCenter
          notifications={mockNotifications}
          onRemove={jest.fn()}
          onClearAll={jest.fn()}
          showClearAll
          Button={DummyButton}
          IconButton={DummyIconButton}
          classMap={classMap}
          data-testid={testId}
          aria-labelledby="external-notification-title"
        />
      </>,
    );

    const region = screen.getByRole("region", { name: /system alerts/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute(
      "aria-labelledby",
      "external-notification-title",
    );
    expect(screen.queryByText("Notifications")).not.toBeInTheDocument();
  });

  it("uses list-aria-label when provided instead of aria-labelledby on the list", () => {
    renderNotificationCenter({
      "list-aria-label": "Recent alerts list",
    });

    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("aria-label", "Recent alerts list");
    expect(list).not.toHaveAttribute("aria-labelledby");
  });

  it("uses custom live region settings when provided", () => {
    renderNotificationCenter({
      liveRegionPoliteness: "assertive",
      liveRegionRelevant: "all",
      liveRegionAtomic: true,
    });

    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveAttribute("aria-live", "assertive");
    expect(liveRegion).toHaveAttribute("aria-relevant", "all");
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");
  });

  it("renders an empty message when there are no notifications", () => {
    render(
      <BaseNotificationCenter
        notifications={[]}
        onRemove={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
      />,
    );

    expect(screen.getByTestId(`${testId}-empty`)).toBeInTheDocument();
    expect(screen.getByText("No notifications.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders a custom empty message when provided", () => {
    render(
      <BaseNotificationCenter
        notifications={[]}
        onRemove={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
        emptyMessage="You're all caught up."
      />,
    );

    expect(screen.getByText("You're all caught up.")).toBeInTheDocument();
  });

  it("uses a custom clear all aria-label", () => {
    renderNotificationCenter({
      clearAllAriaLabel: "Remove every notification",
    });

    expect(
      screen.getByRole("button", { name: /remove every notification/i }),
    ).toBeInTheDocument();
  });

  it("uses the dismiss button label prefix for each notification dismiss control", () => {
    renderNotificationCenter({
      dismissButtonLabelPrefix: "Close alert",
    });

    expect(
      screen.getByRole("button", { name: /close alert 1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /close alert 2/i }),
    ).toBeInTheDocument();
  });

  it("supports notification-level ariaLabel and ariaDescription", () => {
    const notifications = [
      {
        id: "custom-1",
        message: "Deployment completed",
        type: "success" as const,
        ariaLabel: "Deployment success notification",
        ariaDescription: "Completed 2 minutes ago",
      },
    ];

    render(
      <BaseNotificationCenter
        notifications={notifications}
        onRemove={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
      />,
    );

    const item = screen.getByTestId(`${testId}-item-custom-1`);
    expect(item).toHaveAttribute(
      "aria-label",
      "Deployment success notification",
    );
    expect(
      screen.getByTestId(`${testId}-item-custom-1-description`),
    ).toHaveTextContent("Completed 2 minutes ago");
  });

  it("falls back to aria-labelledby on notification items when ariaLabel is not provided", () => {
    renderNotificationCenter();

    const item = screen.getByTestId(`${testId}-item-1`);
    expect(item).toHaveAttribute("aria-labelledby", `${testId}-item-1-message`);
    expect(item).not.toHaveAttribute("aria-label");
  });

  it("adds aria-describedby to a notification item when it has a timestamp", () => {
    renderNotificationCenter();

    const item = screen.getByTestId(`${testId}-item-1`);
    expect(item).toHaveAttribute(
      "aria-describedby",
      `${testId}-item-1-timestamp`,
    );
  });

  it("adds both timestamp and custom description ids to aria-describedby when both are present", () => {
    const notifications = [
      {
        id: "described",
        message: "Backup complete",
        type: "info" as const,
        timestamp: new Date("2025-04-20T12:00:00"),
        ariaDescription: "Stored in archive A",
      },
    ];

    render(
      <BaseNotificationCenter
        notifications={notifications}
        onRemove={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
      />,
    );

    const item = screen.getByTestId(`${testId}-item-described`);
    expect(item).toHaveAttribute(
      "aria-describedby",
      `${testId}-item-described-timestamp ${testId}-item-described-description`,
    );
  });

  it("starts auto-dismiss timers for notifications with duration", () => {
    jest.useFakeTimers();

    const onRemove = jest.fn();
    const notifications = [
      {
        id: "timed-1",
        message: "Temporary notice",
        type: "info" as const,
        duration: 1500,
      },
    ];

    render(
      <BaseNotificationCenter
        notifications={notifications}
        onRemove={onRemove}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(1499);
    });
    expect(onRemove).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onRemove).toHaveBeenCalledWith("timed-1");
  });

  it("does not start duplicate timers for the same notification across rerenders", () => {
    jest.useFakeTimers();

    const onRemove = jest.fn();
    const notifications = [
      {
        id: "timed-2",
        message: "Do not duplicate timer",
        type: "info" as const,
        duration: 1000,
      },
    ];

    const { rerender } = render(
      <BaseNotificationCenter
        notifications={notifications}
        onRemove={onRemove}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
      />,
    );

    rerender(
      <BaseNotificationCenter
        notifications={notifications}
        onRemove={onRemove}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledWith("timed-2");
  });

  it("clears overflow notifications from the front when maxNotifications is exceeded and clearOldOnOverflow is true", async () => {
    const setNotifications = jest.fn();
    const notifications = [
      { id: "1", message: "One", type: "info" as const },
      { id: "2", message: "Two", type: "info" as const },
      { id: "3", message: "Three", type: "info" as const },
    ];

    render(
      <BaseNotificationCenter
        notifications={notifications}
        setNotifications={setNotifications}
        onRemove={jest.fn()}
        maxNotifications={2}
        clearOldOnOverflow
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
      />,
    );

    await waitFor(() => {
      expect(setNotifications).toHaveBeenCalledTimes(1);
    });

    const updater = setNotifications.mock.calls[0][0];
    const result = updater(notifications);

    expect(result).toEqual([
      { id: "2", message: "Two", type: "info" },
      { id: "3", message: "Three", type: "info" },
    ]);
  });

  it("does not trim notifications when clearOldOnOverflow is false", async () => {
    const setNotifications = jest.fn();
    const notifications = [
      { id: "1", message: "One", type: "info" as const },
      { id: "2", message: "Two", type: "info" as const },
      { id: "3", message: "Three", type: "info" as const },
    ];

    render(
      <BaseNotificationCenter
        notifications={notifications}
        setNotifications={setNotifications}
        onRemove={jest.fn()}
        maxNotifications={2}
        clearOldOnOverflow={false}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
      />,
    );

    await waitFor(() => {
      expect(setNotifications).not.toHaveBeenCalled();
    });
  });

  it("calls fetchNotifications immediately and then polls at the given interval", () => {
    jest.useFakeTimers();

    const fetchNotifications = jest.fn().mockResolvedValue([]);

    renderNotificationCenter({
      fetchNotifications,
      pollInterval: 2000,
    });

    expect(fetchNotifications).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(fetchNotifications).toHaveBeenCalledTimes(2);

    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(fetchNotifications).toHaveBeenCalledTimes(4);
  });

  it("does not poll when fetchNotifications is not provided", () => {
    jest.useFakeTimers();

    renderNotificationCenter({
      fetchNotifications: undefined,
    });

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("has no accessibility violations with populated notifications", async () => {
    const { container } = renderNotificationCenter();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in the empty state", async () => {
    const { container } = render(
      <BaseNotificationCenter
        notifications={[]}
        onRemove={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classMap}
        data-testid={testId}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
