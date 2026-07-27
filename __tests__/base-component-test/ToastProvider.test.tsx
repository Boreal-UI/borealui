import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ToastProviderBase, {
  useToast,
} from "../../src/components/ToastProvider/ToastProviderBase";

expect.extend(toHaveNoViolations);

const classMap = {
  viewport: "toast_viewport",
  topRight: "toast_topRight",
  topLeft: "toast_topLeft",
  bottomRight: "toast_bottomRight",
  bottomLeft: "toast_bottomLeft",

  toast: "toast",
  content: "toast_content",
  title: "toast_title",
  message: "toast_message",
  dismissButton: "toast_dismissButton",

  success: "toast_success",
  error: "toast_error",
  warning: "toast_warning",
  info: "toast_info",

  shadowNone: "toast_shadowNone",
  shadowLight: "toast_shadowLight",
  shadowMedium: "toast_shadowMedium",
  shadowStrong: "toast_shadowStrong",
  shadowIntense: "toast_shadowIntense",

  roundNone: "toast_roundNone",
  roundSmall: "toast_roundSmall",
  roundMedium: "toast_roundMedium",
  roundLarge: "toast_roundLarge",
  roundFull: "toast_roundFull",
};

function ToastActions() {
  const { toasts, addToast, removeToast, clearToasts } = useToast();

  return (
    <div>
      <div data-testid="toast-count">{toasts.length}</div>

      <button
        type="button"
        onClick={() =>
          addToast({
            id: "success-toast",
            title: "Saved",
            message: "Your changes were saved.",
            state: "success",
            duration: 0,
          })
        }
      >
        Add success toast
      </button>

      <button
        type="button"
        onClick={() =>
          addToast({
            id: "error-toast",
            title: "Failed",
            message: "Something went wrong.",
            state: "error",
            duration: 0,
          })
        }
      >
        Add error toast
      </button>

      <button
        type="button"
        onClick={() =>
          addToast({
            id: "temporary-toast",
            message: "This will disappear.",
            duration: 1000,
          })
        }
      >
        Add temporary toast
      </button>

      <button type="button" onClick={() => removeToast("success-toast")}>
        Remove success toast
      </button>

      <button type="button" onClick={clearToasts}>
        Clear toasts
      </button>
    </div>
  );
}

function renderToastProvider(
  props: Partial<React.ComponentProps<typeof ToastProviderBase>> = {},
) {
  return render(
    <ToastProviderBase classMap={classMap} {...props}>
      <ToastActions />
    </ToastProviderBase>,
  );
}

describe("ToastProviderBase", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });

    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("renders the notification viewport with default accessibility attributes", async () => {
    jest.useRealTimers();

    const { container } = renderToastProvider();

    const viewport = screen.getByTestId("toast-provider");

    expect(viewport).toBeInTheDocument();
    expect(viewport).toHaveAttribute("role", "region");
    expect(viewport).toHaveAttribute("aria-label", "Notifications");
    expect(viewport).toHaveClass("toast_viewport");
    expect(viewport).toHaveClass("toast_topRight");

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    jest.useFakeTimers();
  });

  it("uses testId before data-testid when both are provided", () => {
    renderToastProvider({
      testId: "custom-toast-provider",
      "data-testid": "fallback-toast-provider",
    });

    expect(screen.getByTestId("custom-toast-provider")).toBeInTheDocument();
    expect(
      screen.queryByTestId("fallback-toast-provider"),
    ).not.toBeInTheDocument();
  });

  it("uses data-testid when testId is not provided", () => {
    renderToastProvider({
      "data-testid": "data-toast-provider",
    });

    expect(screen.getByTestId("data-toast-provider")).toBeInTheDocument();
  });

  it("renders children inside the provider", () => {
    renderToastProvider();

    expect(screen.getByText("Add success toast")).toBeInTheDocument();
    expect(screen.getByText("Add error toast")).toBeInTheDocument();
    expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
  });

  it("adds a toast and exposes the updated toast list through context", () => {
    renderToastProvider();

    fireEvent.click(screen.getByText("Add success toast"));

    expect(screen.getByTestId("toast-count")).toHaveTextContent("1");

    const toast = screen.getByTestId("toast-provider-toast-success-toast");

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveAttribute("role", "status");
    expect(toast).toHaveClass("toast");
    expect(toast).toHaveClass("toast_success");

    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Your changes were saved.")).toBeInTheDocument();
  });

  it("renders error toasts with role alert", () => {
    renderToastProvider();

    fireEvent.click(screen.getByText("Add error toast"));

    const toast = screen.getByTestId("toast-provider-toast-error-toast");

    expect(toast).toBeInTheDocument();
    expect(toast).toHaveAttribute("role", "alert");
    expect(toast).toHaveClass("toast_error");
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("replaces an existing toast when the same id is added again", () => {
    renderToastProvider();

    fireEvent.click(screen.getByText("Add success toast"));
    fireEvent.click(screen.getByText("Add success toast"));

    expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    expect(
      screen.getAllByTestId("toast-provider-toast-success-toast"),
    ).toHaveLength(1);
  });

  it("restarts the expiry timer when replacing a toast with the same id", () => {
    function ReplacementTimerTester() {
      const { addToast } = useToast();

      return (
        <>
          <button
            type="button"
            onClick={() =>
              addToast({ id: "shared", message: "First", duration: 500 })
            }
          >
            Add first
          </button>
          <button
            type="button"
            onClick={() =>
              addToast({ id: "shared", message: "Replacement", duration: 1000 })
            }
          >
            Add replacement
          </button>
        </>
      );
    }

    render(
      <ToastProviderBase classMap={classMap}>
        <ReplacementTimerTester />
      </ToastProviderBase>,
    );

    fireEvent.click(screen.getByText("Add first"));
    act(() => jest.advanceTimersByTime(250));
    fireEvent.click(screen.getByText("Add replacement"));

    act(() => jest.advanceTimersByTime(250));
    expect(screen.getByText("Replacement")).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(749));
    expect(screen.getByText("Replacement")).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(1));
    expect(screen.queryByText("Replacement")).not.toBeInTheDocument();
  });

  it("dismisses a toast when the dismiss button is clicked", () => {
    renderToastProvider();

    fireEvent.click(screen.getByText("Add success toast"));

    expect(
      screen.getByTestId("toast-provider-toast-success-toast"),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );

    expect(
      screen.queryByTestId("toast-provider-toast-success-toast"),
    ).not.toBeInTheDocument();

    expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
  });

  it("removes a toast through removeToast from context", () => {
    renderToastProvider();

    fireEvent.click(screen.getByText("Add success toast"));

    expect(
      screen.getByTestId("toast-provider-toast-success-toast"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Remove success toast"));

    expect(
      screen.queryByTestId("toast-provider-toast-success-toast"),
    ).not.toBeInTheDocument();

    expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
  });

  it("clears all toasts through clearToasts from context", () => {
    renderToastProvider();

    fireEvent.click(screen.getByText("Add success toast"));
    fireEvent.click(screen.getByText("Add error toast"));

    expect(screen.getByTestId("toast-count")).toHaveTextContent("2");

    fireEvent.click(screen.getByText("Clear toasts"));

    expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
    expect(
      screen.queryByTestId("toast-provider-toast-success-toast"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("toast-provider-toast-error-toast"),
    ).not.toBeInTheDocument();
  });

  it("auto-dismisses toasts after their duration", () => {
    renderToastProvider();

    fireEvent.click(screen.getByText("Add temporary toast"));

    expect(
      screen.getByTestId("toast-provider-toast-temporary-toast"),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(999);
    });

    expect(
      screen.getByTestId("toast-provider-toast-temporary-toast"),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(
      screen.queryByTestId("toast-provider-toast-temporary-toast"),
    ).not.toBeInTheDocument();
  });

  it("uses defaultDuration when a toast duration is not provided", () => {
    function DefaultDurationTester() {
      const { addToast } = useToast();

      return (
        <button
          type="button"
          onClick={() =>
            addToast({
              id: "default-duration-toast",
              message: "Uses provider duration.",
            })
          }
        >
          Add default duration toast
        </button>
      );
    }

    render(
      <ToastProviderBase
        classMap={classMap}
        defaultDuration={2500}
        data-testid="duration-provider"
      >
        <DefaultDurationTester />
      </ToastProviderBase>,
    );

    fireEvent.click(screen.getByText("Add default duration toast"));

    expect(
      screen.getByTestId("duration-provider-toast-default-duration-toast"),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2499);
    });

    expect(
      screen.getByTestId("duration-provider-toast-default-duration-toast"),
    ).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(
      screen.queryByTestId("duration-provider-toast-default-duration-toast"),
    ).not.toBeInTheDocument();
  });

  it("does not auto-dismiss when duration is 0", () => {
    renderToastProvider();

    fireEvent.click(screen.getByText("Add success toast"));

    act(() => {
      jest.advanceTimersByTime(10_000);
    });

    expect(
      screen.getByTestId("toast-provider-toast-success-toast"),
    ).toBeInTheDocument();
  });

  it("applies placement, rounding, shadow, viewport className, and toastClassName", () => {
    renderToastProvider({
      placement: "bottomLeft",
      rounding: "large",
      shadow: "strong",
      className: "custom-viewport",
      toastClassName: "custom-toast",
    });

    fireEvent.click(screen.getByText("Add success toast"));

    const viewport = screen.getByTestId("toast-provider");
    const toast = screen.getByTestId("toast-provider-toast-success-toast");

    expect(viewport).toHaveClass("toast_viewport");
    expect(viewport).toHaveClass("toast_bottomLeft");
    expect(viewport).toHaveClass("custom-viewport");

    expect(toast).toHaveClass("toast");
    expect(toast).toHaveClass("toast_success");
    expect(toast).toHaveClass("toast_shadowStrong");
    expect(toast).toHaveClass("toast_roundLarge");
    expect(toast).toHaveClass("custom-toast");
  });

  it("does not render a title container when title is omitted", () => {
    renderToastProvider();

    fireEvent.click(screen.getByText("Add temporary toast"));

    const toast = screen.getByTestId("toast-provider-toast-temporary-toast");

    expect(toast).toHaveTextContent("This will disappear.");
    expect(toast.querySelector(".toast_title")).not.toBeInTheDocument();
  });

  it("returns a generated toast id when no id is provided", () => {
    function GeneratedIdTester() {
      const { addToast } = useToast();
      const [generatedId, setGeneratedId] = React.useState("");

      return (
        <div>
          <div data-testid="generated-id">{generatedId}</div>
          <button
            type="button"
            onClick={() => {
              const id = addToast({
                message: "Generated ID toast.",
                duration: 0,
              });

              setGeneratedId(id);
            }}
          >
            Add generated id toast
          </button>
        </div>
      );
    }

    render(
      <ToastProviderBase classMap={classMap}>
        <GeneratedIdTester />
      </ToastProviderBase>,
    );

    fireEvent.click(screen.getByText("Add generated id toast"));

    const generatedId = screen.getByTestId("generated-id").textContent;

    expect(generatedId).toMatch(/^toast-/);
    expect(
      screen.getByTestId(`toast-provider-toast-${generatedId}`),
    ).toBeInTheDocument();
  });

  it("throws a clear error when useToast is used outside ToastProviderBase", () => {
    function InvalidConsumer() {
      useToast();
      return <div>Invalid</div>;
    }

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    expect(() => render(<InvalidConsumer />)).toThrow(
      "useToast must be used within ToastProvider.",
    );

    consoleErrorSpy.mockRestore();
  });
});
