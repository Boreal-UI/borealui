import type React from "react";
import { composeEventHandlers } from "@/utils/eventHandlers";

type TestEvent = React.SyntheticEvent<HTMLElement>;

const createEvent = (): TestEvent => {
  let prevented = false;

  return {
    get defaultPrevented() {
      return prevented;
    },
    preventDefault: () => {
      prevented = true;
    },
  } as TestEvent;
};

describe("composeEventHandlers", () => {
  it("returns the consumer handler when no internal handler exists", () => {
    const consumer = jest.fn();
    const event = createEvent();

    composeEventHandlers(consumer)?.(event);

    expect(consumer).toHaveBeenCalledWith(event);
  });

  it("returns the internal handler when no consumer handler exists", () => {
    const internal = jest.fn();
    const event = createEvent();

    composeEventHandlers(undefined, internal)?.(event);

    expect(internal).toHaveBeenCalledWith(event);
  });

  it("runs the consumer before the internal handler", () => {
    const calls: string[] = [];
    const event = createEvent();

    composeEventHandlers<TestEvent>(
      () => calls.push("consumer"),
      () => calls.push("internal"),
    )?.(event);

    expect(calls).toEqual(["consumer", "internal"]);
  });

  it("skips the internal handler when the consumer prevents default", () => {
    const internal = jest.fn();
    const event = createEvent();

    composeEventHandlers<TestEvent>(
      (nextEvent) => nextEvent.preventDefault(),
      internal,
    )?.(event);

    expect(internal).not.toHaveBeenCalled();
  });

  it("does not swallow consumer exceptions", () => {
    const internal = jest.fn();
    const error = new Error("consumer failure");

    expect(() =>
      composeEventHandlers<TestEvent>(() => {
        throw error;
      }, internal)?.(createEvent()),
    ).toThrow(error);
    expect(internal).not.toHaveBeenCalled();
  });

  it("accepts representative React synthetic event types", () => {
    const keyboard = composeEventHandlers<React.KeyboardEvent<HTMLElement>>();
    const mouse = composeEventHandlers<React.MouseEvent<HTMLElement>>();
    const pointer = composeEventHandlers<React.PointerEvent<HTMLElement>>();
    const focus = composeEventHandlers<React.FocusEvent<HTMLElement>>();
    const form = composeEventHandlers<React.FormEvent<HTMLFormElement>>();
    const change = composeEventHandlers<React.ChangeEvent<HTMLInputElement>>();

    expect([keyboard, mouse, pointer, focus, form, change]).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });
});
