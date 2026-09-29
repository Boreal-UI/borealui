import React, { StrictMode } from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { useFloatingPanelSync } from "@/hooks/useFloatingPanelSync";

const Harness = ({
  open,
  updatePosition,
  shouldUpdate,
}: {
  open: boolean;
  updatePosition: () => void;
  shouldUpdate?: (event: Event) => boolean;
}) => {
  useFloatingPanelSync({ open, updatePosition, shouldUpdate });
  return null;
};

describe("useFloatingPanelSync", () => {
  let animationFrameSpy: jest.SpyInstance;
  let cancelAnimationFrameSpy: jest.SpyInstance;

  beforeEach(() => {
    animationFrameSpy = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      });
    cancelAnimationFrameSpy = jest
      .spyOn(window, "cancelAnimationFrame")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    animationFrameSpy.mockRestore();
    cancelAnimationFrameSpy.mockRestore();
  });

  it("does not update or subscribe while closed", () => {
    const updatePosition = jest.fn();
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    render(<Harness open={false} updatePosition={updatePosition} />);
    fireEvent(window, new Event("resize"));

    expect(updatePosition).not.toHaveBeenCalled();
    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
    addEventListenerSpy.mockRestore();
  });

  it("schedules resize and captured scroll updates while open", () => {
    let queuedCallback: FrameRequestCallback | undefined;
    animationFrameSpy.mockImplementation((callback: FrameRequestCallback) => {
      queuedCallback = callback;
      return 1;
    });
    const updatePosition = jest.fn();
    render(<Harness open updatePosition={updatePosition} />);

    fireEvent(window, new Event("resize"));
    fireEvent.scroll(document.body);

    expect(animationFrameSpy).toHaveBeenCalledTimes(1);
    expect(updatePosition).not.toHaveBeenCalled();
    act(() => queuedCallback?.(0));
    expect(updatePosition).toHaveBeenCalledTimes(1);
  });

  it("allows component policy to ignore selected events", () => {
    const updatePosition = jest.fn();
    render(
      <Harness
        open
        updatePosition={updatePosition}
        shouldUpdate={(event) => event.type !== "scroll"}
      />,
    );

    fireEvent.scroll(document.body);
    fireEvent(window, new Event("resize"));

    expect(updatePosition).toHaveBeenCalledTimes(1);
  });

  it("balances subscriptions through Strict Mode cleanup", () => {
    const updatePosition = jest.fn();
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(
      <StrictMode>
        <Harness open updatePosition={updatePosition} />
      </StrictMode>,
    );
    unmount();

    const resizeAdds = addEventListenerSpy.mock.calls.filter(
      ([type]) => type === "resize",
    ).length;
    const resizeRemovals = removeEventListenerSpy.mock.calls.filter(
      ([type]) => type === "resize",
    ).length;
    const scrollAdds = addEventListenerSpy.mock.calls.filter(
      ([type]) => type === "scroll",
    ).length;
    const scrollRemovals = removeEventListenerSpy.mock.calls.filter(
      ([type]) => type === "scroll",
    ).length;

    expect(resizeAdds).toBeGreaterThan(0);
    expect(resizeRemovals).toBe(resizeAdds);
    expect(scrollRemovals).toBe(scrollAdds);
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it("cancels a queued update on unmount", () => {
    let queuedCallback: FrameRequestCallback | undefined;
    animationFrameSpy.mockImplementation((callback: FrameRequestCallback) => {
      queuedCallback = callback;
      return 42;
    });
    const updatePosition = jest.fn();
    const { unmount } = render(
      <Harness open updatePosition={updatePosition} />,
    );

    fireEvent(window, new Event("resize"));
    expect(queuedCallback).toBeDefined();
    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(42);
    expect(updatePosition).not.toHaveBeenCalled();
  });
});
