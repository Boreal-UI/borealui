import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Core from "../../src/core/NumberInput";
import Next from "../../src/next/NumberInput";
import type { NumberInputProps } from "../../src/components/NumberInput/NumberInput.types";

describe.each([["Core", Core], ["Next", Next]] as const)("%s NumberInput commits", (_name, Input) => {
  it.each(["onChange", "onValueChange", "both", "uncontrolled"])("delivers all edits with %s", (mode) => {
    const changes = jest.fn(); const numbers = jest.fn();
    function Example() {
      const [value, setValue] = useState<number | "">(10);
      const props: NumberInputProps = { label: "Risk", min: 0, max: 50 };
      if (mode === "uncontrolled") props.defaultValue = 10;
      else props.value = value;
      if (mode !== "onValueChange") props.onChange = (next, event) => { changes(next, event.type, event.currentTarget.tagName); setValue(next); };
      if (mode !== "onChange") props.onValueChange = (next) => { numbers(next); setValue(next); };
      return <Input {...props} />;
    }
    render(<Example />);
    const input = screen.getByRole("spinbutton");
    fireEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(input).toHaveValue(11);
    fireEvent.click(screen.getByRole("button", { name: "Decrease value" }));
    expect(input).toHaveValue(10);
    fireEvent.change(input, { target: { value: "60" } });
    fireEvent.blur(input);
    expect(input).toHaveValue(50);
    if (mode !== "onValueChange") expect(changes.mock.calls).toEqual([[11, "click", "BUTTON"], [10, "click", "BUTTON"], [60, "change", "INPUT"], [50, "blur", "INPUT"]]);
    if (mode !== "onChange") expect(numbers.mock.calls).toEqual([[11], [10], [60], [50]]);
    fireEvent.change(input, { target: { value: "" } });
    expect(input).toHaveValue(mode === "onValueChange" ? 50 : null);
    if (mode !== "onChange") expect(numbers).toHaveBeenCalledTimes(4);
    if (mode !== "onValueChange") expect(changes).toHaveBeenLastCalledWith("", "change", "INPUT");
  });

  it.each([
    [0, 1.5, 1, 2, 1.5], [-1.5, 0, 1, -2, -1.5],
    [0, 5, 1, 1.25, 1.25], [0, 1, 0.01, 0.123, 0.123],
    [0, 0.0000015, 1e-7, 0.000002, 0.0000015],
  ])("commits bounded values (%s, %s, step %s)", (min, max, step, entered, expected) => {
    render(<Input label="Amount" defaultValue={min} min={min} max={max} step={step} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: String(entered) } }); fireEvent.blur(input);
    expect(input).toHaveValue(expected);
    expect(Number((input as HTMLInputElement).value)).toBeGreaterThanOrEqual(min);
    expect(Number((input as HTMLInputElement).value)).toBeLessThanOrEqual(max);
  });

  it("preserves fractional initial values and removes step arithmetic noise", () => {
    render(<Input label="Amount" defaultValue={0.15} step={0.1} min={0} max={0.3} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.blur(input); expect(input).toHaveValue(0.15);
    fireEvent.click(screen.getByRole("button", { name: "Increase value" })); expect(input).toHaveValue(0.25);
    fireEvent.click(screen.getByRole("button", { name: "Increase value" })); expect(input).toHaveValue(0.3);
    expect(screen.getByRole("button", { name: "Increase value" })).toBeDisabled();
  });

  it("commits fractional bounds through controlled onChange and exponent steps", () => {
    const changes = jest.fn();
    function Example() {
      const [value, setValue] = useState<number | "">(0.0000014);
      return <Input label="Amount" value={value} min={-0.0000015} max={0.0000015} step={1e-7}
        onChange={(next) => { changes(next); setValue(next); }} />;
    }
    render(<Example />);
    const input = screen.getByRole("spinbutton");
    fireEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(input).toHaveValue(0.0000015);
    fireEvent.change(input, { target: { value: "-0.000002" } });
    fireEvent.blur(input);
    expect(input).toHaveValue(-0.0000015);
    expect(Number((input as HTMLInputElement).value)).toBeGreaterThanOrEqual(-0.0000015);
    expect(Number((input as HTMLInputElement).value)).toBeLessThanOrEqual(0.0000015);
    expect(changes.mock.calls).toEqual([[0.0000015], [-0.000002], [-0.0000015]]);
  });

  it.each(["disabled", "readOnly"] as const)("does not commit when %s", (flag) => {
    const onChange = jest.fn(); const onValueChange = jest.fn();
    render(<Input label="Amount" defaultValue={2} max={1.5} {...{ [flag]: true }} onChange={onChange} onValueChange={onValueChange} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "3" } }); fireEvent.blur(input);
    fireEvent.click(screen.getByRole("button", { name: "Increase value" }));
    expect(onChange).not.toHaveBeenCalled(); expect(onValueChange).not.toHaveBeenCalled();
  });
});
