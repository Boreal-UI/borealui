import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { axe } from "jest-axe";
import CoreInput from "@/components/TextInput/core/TextInput";
import NextInput from "@/components/TextInput/next/TextInput";
import ServerInput from "@/components/TextInput/server/TextInput";
import CoreArea from "@/components/TextArea/core/TextArea";
import NextArea from "@/components/TextArea/next/TextArea";
import ServerArea from "@/components/TextArea/server/TextArea";
import CoreSelect from "@/components/Select/core/Select";
import NextSelect from "@/components/Select/next/Select";
import ServerSelect from "@/components/Select/server/Select";
import type { ComponentType } from "react";
import type { FieldPresentationProps } from "@/types/fieldPresentation";

// expandClassMap enumerates module keys, so supply real keys rather than hashes.
jest.mock("identity-obj-proxy", () => ({
  __esModule: true,
  default: {
    container: "container", textInput: "textInput", input: "input", textArea: "textArea",
    layout: "layout", wrapper: "wrapper", select: "select", label: "label",
    helperText: "helperText", errorMessage: "errorMessage", error: "error", success: "success",
  },
}));

type TestProps = FieldPresentationProps & {
  label?: string; helperText?: string; errorMessage?: string; invalid?: boolean;
  state?: "success" | "error"; "aria-invalid"?: boolean; "aria-describedby"?: string;
  value?: string; defaultValue?: string; name?: string; required?: boolean;
  onChange?: (value: string) => void; onBlur?: () => void;
  className?: string; labelClassName?: string;
};
const options = [{ value: "", label: "Choose" }, { value: "draft", label: "Draft" }];
const fields: Array<[string, ComponentType<TestProps>, string]> = [
  ["core input", CoreInput, "textbox"], ["next input", NextInput, "textbox"],
  ["core textarea", CoreArea, "textbox"], ["next textarea", NextArea, "textbox"],
  ["core select", (props) => <CoreSelect {...props} options={options} />, "combobox"],
  ["next select", (props) => <NextSelect {...props} options={options} />, "combobox"],
];

describe.each(fields)("%s presentation", (_name, Field, role) => {
  it("associates static feedback, merges description IDs, infers visual error state, and clears errors without losing uncontrolled values", async () => {
    const props = { label: "Field", name: "field", defaultValue: "draft", helperText: "Helpful description", errorMessage: "Server error", "aria-describedby": "external external", className: "legacy-wrapper", rootClassName: "custom-root", controlClassName: "custom-control", labelClassName: "custom-label", descriptionClassName: "custom-help", errorClassName: "custom-error" };
    const view = render(<><span id="external">External hint</span><Field {...props} /></>);
    const control = screen.getByRole(role, { name: "Field" });
    expect(control).toHaveValue("draft");
    expect(control).toHaveClass("custom-control");
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAccessibleDescription("External hint Helpful description Server error");
    expect(control.getAttribute("aria-describedby")!.split(" ")).toHaveLength(3);
    expect(screen.getByText("Server error")).not.toHaveAttribute("role");
    expect(screen.getByText("Server error")).not.toHaveAttribute("aria-live");
    expect(view.container.querySelector(".legacy-wrapper")?.className).toMatch(/error/);
    expect(view.container.querySelector(".custom-root")).toContainElement(control);
    expect(await axe(view.container)).toHaveNoViolations();
    const errorId = screen.getByText("Server error").id;
    const controlId = control.id;
    fireEvent.change(control, { target: { value: "" } });
    view.rerender(<><span id="external">External hint</span><Field {...props} errorMessage={undefined} /></>);
    expect(control.id).toBe(controlId);
    expect(control).toHaveValue("");
    expect(control).not.toHaveAttribute("aria-invalid");
    expect(control.getAttribute("aria-describedby")).not.toContain(errorId);
    expect(screen.queryByText("Server error")).not.toBeInTheDocument();
  });

  it("keeps explicit aria-invalid separate from visual precedence and supports opt-in live feedback", () => {
    render(<Field label="Field" state="success" errorMessage="Invalid entry" aria-invalid={false} errorLive="polite" className="wrapper" />);
    expect(screen.getByRole(role, { name: "Field" })).toHaveAttribute("aria-invalid", "false");
    expect(document.querySelector(".wrapper")?.className).toMatch(/error/);
    expect(document.querySelector(".wrapper")?.className).not.toMatch(/success/);
    expect(screen.getByText("Invalid entry")).toHaveAttribute("aria-live", "polite");
  });

  it("preserves callbacks, blur, required validity, FormData, and controlled value when feedback changes", () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();
    const view = render(<form><Field label="Field" name="field" value="draft" onChange={onChange} onBlur={onBlur} required /></form>);
    const control = screen.getByRole(role, { name: "Field" });
    fireEvent.change(control, { target: { value: "" } });
    if (_name.includes("select")) expect(onChange).toHaveBeenCalledWith("");
    else expect(onChange).toHaveBeenCalledWith("", expect.anything());
    fireEvent.blur(control);
    expect(onBlur).toHaveBeenCalledTimes(1);
    view.rerender(<form><Field label="Field" name="field" value="draft" onChange={onChange} errorMessage="Save failed" required /></form>);
    expect(control).toHaveValue("draft");
    expect(new FormData(control.closest("form")!).get("field")).toBe("draft");
    view.rerender(<form><Field label="Field" value="" onChange={onChange} required /></form>);
    expect((control as HTMLInputElement).checkValidity()).toBe(false);
  });
});

const serverFields: Array<[string, ComponentType<TestProps>]> = [
  ["server input", ServerInput], ["server textarea", ServerArea],
  ["server select", (props) => <ServerSelect {...props} options={options} />],
];
describe.each([...fields.map(([name, Field]) => [name, Field] as const), ...serverFields])("%s SSR", (_name, Field) => {
  it("renders unique associated IDs and hydrates without mismatches", async () => {
    const ui = <><Field label="First" helperText="Description" errorMessage="First error" /><Field label="Second" errorMessage="Second error" /></>;
    const host = document.createElement("div");
    host.innerHTML = renderToString(ui);
    document.body.append(host);
    const controls = host.querySelectorAll("input,textarea,select");
    expect(controls[0].id).not.toBe(controls[1].id);
    for (const control of controls) {
      expect(control).toHaveAttribute("aria-invalid", "true");
      for (const id of control.getAttribute("aria-describedby")!.split(" ")) {
        expect(document.getElementById(id)).toBeInTheDocument();
      }
    }
    const originalIds = [...controls].map((control) => control.id);
    const onRecoverableError = jest.fn();
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => { root = hydrateRoot(host, ui, { onRecoverableError }); await Promise.resolve(); });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect([...host.querySelectorAll("input,textarea,select")].map((control) => control.id)).toEqual(originalIds);
    act(() => root!.unmount());
    host.remove();
  });
});
