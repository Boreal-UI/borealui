import { StrictMode, useRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import {
  isEventInsideElements,
  useOutsideInteraction,
} from "@/hooks/useOutsideInteraction";

const Harness = ({
  active,
  onOutsideInteraction,
}: {
  active: boolean;
  onOutsideInteraction: (event: MouseEvent) => void;
}) => {
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useOutsideInteraction({
    active,
    insideRefs: [firstRef, secondRef],
    onOutsideInteraction,
  });

  return (
    <>
      <div ref={firstRef} data-testid="inside-first">
        <button type="button" data-testid="inside-nested">
          Nested
        </button>
      </div>
      <div ref={secondRef} data-testid="inside-second" />
      <button type="button" data-testid="outside">
        Outside
      </button>
    </>
  );
};

describe("useOutsideInteraction", () => {
  it("recognizes targets inside any supplied element, including descendants", () => {
    const first = document.createElement("div");
    const nested = document.createElement("button");
    const second = document.createElement("div");
    first.appendChild(nested);
    document.body.append(first, second);

    const nestedEvent = new MouseEvent("mousedown", { bubbles: true });
    nested.dispatchEvent(nestedEvent);
    expect(isEventInsideElements(nestedEvent, [first, second])).toBe(true);

    const outsideEvent = new MouseEvent("mousedown", { bubbles: true });
    document.body.dispatchEvent(outsideEvent);
    expect(isEventInsideElements(outsideEvent, [first, second])).toBe(false);

    first.remove();
    second.remove();
  });

  it("is inert while inactive and reports only outside mousedown events", () => {
    const onOutsideInteraction = jest.fn();
    const { rerender } = render(
      <Harness active={false} onOutsideInteraction={onOutsideInteraction} />,
    );

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(onOutsideInteraction).not.toHaveBeenCalled();

    rerender(
      <Harness active onOutsideInteraction={onOutsideInteraction} />,
    );
    fireEvent.mouseDown(screen.getByTestId("inside-first"));
    fireEvent.mouseDown(screen.getByTestId("inside-nested"));
    fireEvent.mouseDown(screen.getByTestId("inside-second"));
    expect(onOutsideInteraction).not.toHaveBeenCalled();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(onOutsideInteraction).toHaveBeenCalledTimes(1);
  });

  it("uses the latest callback without replacing the active listener", () => {
    const firstCallback = jest.fn();
    const secondCallback = jest.fn();
    const addSpy = jest.spyOn(document, "addEventListener");
    const { rerender } = render(
      <Harness active onOutsideInteraction={firstCallback} />,
    );

    rerender(<Harness active onOutsideInteraction={secondCallback} />);
    fireEvent.mouseDown(screen.getByTestId("outside"));

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
    expect(
      addSpy.mock.calls.filter(([type]) => type === "mousedown"),
    ).toHaveLength(1);
    addSpy.mockRestore();
  });

  it("cleans up across rapid active changes", () => {
    const onOutsideInteraction = jest.fn();
    const { rerender, unmount } = render(
      <Harness active onOutsideInteraction={onOutsideInteraction} />,
    );

    rerender(
      <Harness active={false} onOutsideInteraction={onOutsideInteraction} />,
    );
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(onOutsideInteraction).not.toHaveBeenCalled();

    rerender(<Harness active onOutsideInteraction={onOutsideInteraction} />);
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(onOutsideInteraction).toHaveBeenCalledTimes(1);

    unmount();
    fireEvent.mouseDown(document.body);
    expect(onOutsideInteraction).toHaveBeenCalledTimes(1);
  });

  it("balances document listeners through Strict Mode effect replay", () => {
    const addSpy = jest.spyOn(document, "addEventListener");
    const removeSpy = jest.spyOn(document, "removeEventListener");
    const { unmount } = render(
      <StrictMode>
        <Harness active onOutsideInteraction={jest.fn()} />
      </StrictMode>,
    );

    const addedBeforeUnmount = addSpy.mock.calls.filter(
      ([type]) => type === "mousedown",
    ).length;
    const removedBeforeUnmount = removeSpy.mock.calls.filter(
      ([type]) => type === "mousedown",
    ).length;
    expect(addedBeforeUnmount - removedBeforeUnmount).toBe(1);

    unmount();
    const removedAfterUnmount = removeSpy.mock.calls.filter(
      ([type]) => type === "mousedown",
    ).length;
    expect(removedAfterUnmount).toBe(addedBeforeUnmount);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("does not access document during server rendering", () => {
    expect(() =>
      renderToString(
        <Harness active onOutsideInteraction={jest.fn()} />,
      ),
    ).not.toThrow();
  });
});
