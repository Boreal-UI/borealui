import { createRef } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import CoreSelect from "@/components/Select/core/Select";
import NextSelect from "@/components/Select/next/Select";
import ServerSelect from "@/components/Select/server/Select";

const options = [{ value: "", label: "All statuses" }, { value: "draft", label: "Draft" }, { value: "blocked", label: "Blocked", disabled: true }];

describe.each([CoreSelect, NextSelect])("native Select contract", (Select) => {
  it("submits empty values, supports user selection, controlled updates and native reset", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const ref = createRef<HTMLSelectElement>();
    const view = render(<form><Select ref={ref} label="Status" name="status" options={options} value="draft" onChange={onChange} /></form>);
    const select = screen.getByRole<HTMLSelectElement>("combobox", { name: "Status" });
    const form = select.closest("form")!;
    expect(ref.current).toBe(select);
    await user.selectOptions(select, "");
    expect(onChange).toHaveBeenCalledWith("");
    view.rerender(<form><Select ref={ref} label="Status" name="status" options={options} value="" onChange={onChange} /></form>);
    expect(select).toHaveValue("");
    expect(new FormData(form).get("status")).toBe("");
    view.rerender(<form><Select ref={ref} label="Status" name="status" options={options} value="draft" onChange={onChange} /></form>);
    act(() => form.reset());
    expect(select).toHaveValue("draft");
    expect(new FormData(form).get("status")).toBe("draft");
    expect(form.querySelector('input[type="hidden"]')).toBeNull();
  });

  it("lets the browser own uncontrolled defaults and reset, including an enabled empty option", async () => {
    const user = userEvent.setup();
    render(<form><Select label="Status" name="status" options={options} defaultValue="draft" required helperText="Choose status" errorMessage="Status required" /></form>);
    const select = screen.getByRole<HTMLSelectElement>("combobox", { name: "Status" });
    await user.selectOptions(select, "");
    expect(select).toHaveValue("");
    expect(select.checkValidity()).toBe(false);
    expect(new FormData(select.form!).get("status")).toBe("");
    await user.selectOptions(select, "draft");
    await user.selectOptions(select, "blocked");
    expect(select).toHaveValue("draft");
    await user.selectOptions(select, "");
    expect(select).toHaveValue("");
    act(() => select.form!.reset());
    expect(select).toHaveValue("draft");
    expect(select).toHaveAccessibleDescription("Choose status Status required");
    expect(await axe(select.form!)).toHaveNoViolations();
  });

  it("keeps the legacy placeholder and native disabled submission behavior", () => {
    render(<form><Select label="Format" name="format" options={options.slice(1)} disabled placeholder="Choose format" /></form>);
    const select = screen.getByRole<HTMLSelectElement>("combobox");
    expect(select.options[0]).toHaveTextContent("Choose format");
    expect(select.options[0].disabled).toBe(true);
    expect(select.options[0].hidden).toBe(true);
    expect(new FormData(select.form!).has("format")).toBe(false);
  });

  it("allows explicitly omitting the placeholder and preserves required placeholder validity", () => {
    const view = render(<Select label="Format" options={options.slice(1)} placeholder={null} />);
    expect(screen.getAllByRole("option")).toHaveLength(2);
    expect(screen.getByRole("combobox")).toHaveValue("draft");
    view.unmount();
    render(<Select label="Format" options={options.slice(1)} required />);
    const select = screen.getByRole<HTMLSelectElement>("combobox");
    expect(select).toHaveValue("");
    expect(select.checkValidity()).toBe(false);
  });
});

it("server Select preserves empty options and external descriptions", () => {
  render(<><span id="help">External help</span><ServerSelect options={options} label="Status" name="status" defaultValue="" aria-describedby="help" aria-invalid /></>);
  const select = screen.getByRole<HTMLSelectElement>("combobox");
  expect(select.options).toHaveLength(3);
  expect(select.options[0].disabled).toBe(false);
  expect(select).toHaveAccessibleDescription("External help");
  expect(select).toHaveAttribute("aria-invalid", "true");
});
