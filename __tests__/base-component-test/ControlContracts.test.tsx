import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import SegmentedControl from "../../src/core/SegmentedControl";
import NextSegments from "../../src/next/SegmentedControl";
import Slider from "../../src/core/Slider";
import NextSlider from "../../src/next/Slider";
import SearchInput from "../../src/core/SearchInput";
import NumberInput from "../../src/core/NumberInput";
import MultiSelect from "../../src/core/MultiSelect";
import Accordion from "../../src/core/Accordion";
import TagInput from "../../src/core/TagInput";

const options = [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }];
const reset = async (form: HTMLFormElement) => {
  await act(async () => {
    form.reset();
    await new Promise(resolve => setTimeout(resolve, 0));
  });
};
describe.each([["core", SegmentedControl, Slider], ["next", NextSegments, NextSlider]] as const)(
  "%s native contracts", (_variant, Segments, Range) => {
    it("requires a nonempty matching selection and restores the latest default silently", async () => {
      const change = jest.fn();
      const view = render(<form><Segments label="Choice" name="choice" required options={options}
        defaultValue="" onValueChange={change} /></form>);
      const form = view.container.querySelector("form")!;
      expect(form.checkValidity()).toBe(false);
      expect(screen.getByRole("radio", { name: "Alpha" })).toHaveFocus();
      fireEvent.click(screen.getByRole("radio", { name: "Beta" }));
      expect(form.checkValidity()).toBe(true);
      expect(new FormData(form).getAll("choice")).toEqual(["b"]);
      view.rerender(<form><Segments label="Choice" name="choice" required options={options}
        defaultValue="a" onValueChange={change} /></form>);
      await reset(form);
      expect(new FormData(form).getAll("choice")).toEqual(["a"]);
      expect(change).toHaveBeenCalledTimes(1);
      expect(await axe(view.container)).toHaveNoViolations();
    });
    it("keeps an enabled roving entry without changing a disabled selected value", () => {
      const change = jest.fn();
      render(<Segments label="Choice" value="a" onValueChange={change}
        options={[{ ...options[0], disabled: true }, options[1]]} />);
      expect(screen.getByRole("radio", { name: "Beta" })).toHaveAttribute("tabindex", "0");
      expect(screen.getByRole("radio", { name: "Alpha" })).toHaveAttribute("aria-checked", "true");
      expect(change).not.toHaveBeenCalled();
    });
    it("treats an empty-string option as missing for required validation", () => {
      const view = render(<form><Segments label="Choice" required value=""
        options={[{ value: "", label: "None" }]} /></form>);
      expect(view.container.querySelector("form")!.checkValidity()).toBe(false);
    });
    it("normalizes range presentation without callbacks and preserves ARIA overrides", () => {
      const change = jest.fn();
      const view = render(<Range value={3} min={0} max={10} step={2} onChange={change} units="kg" />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "4");
      expect(screen.getByTestId("slider-value")).toHaveTextContent("4kg");
      view.rerender(<Range value={Number.NaN} min={0} max={10} step={2} onChange={change} aria-valuenow={7} />);
      expect(screen.getByTestId("slider-value")).toHaveTextContent("6");
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "7");
      expect(change).not.toHaveBeenCalled();
    });
  });

it("resets uncontrolled fields without emitting changes and honors cancellation", async () => {
  const change = jest.fn();
  const view = render(<form>
    <SearchInput name="search" defaultValue="" onChange={change} />
    <NumberInput name="number" defaultValue="" onChange={change} />
    <MultiSelect name="multi" options={options} defaultValue={[]} onChange={change} />
  </form>);
  const form = view.container.querySelector("form")!;
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "edited" } });
  fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "7" } });
  const cancel = (event: Event) => event.preventDefault();
  form.addEventListener("reset", cancel);
  await reset(form);
  expect(screen.getByRole("searchbox")).toHaveValue("edited");
  form.removeEventListener("reset", cancel);
  await reset(form);
  expect(new FormData(form).get("search")).toBe("");
  expect(new FormData(form).get("number")).toBe("");
  expect(new FormData(form).getAll("multi")).toEqual([]);
  expect(change).toHaveBeenCalledTimes(2);
});

it("excludes collapsed content from accessibility navigation and restores header focus", async () => {
  const view = render(<Accordion title="Details" expanded><button>Nested action</button></Accordion>);
  screen.getByRole("button", { name: "Nested action" }).focus();
  view.rerender(<Accordion title="Details" expanded={false}><button>Nested action</button></Accordion>);
  expect(screen.getByRole("button", { name: "Details" })).toHaveFocus();
  expect(screen.queryByRole("region")).toBeNull();
  expect(screen.getByTestId("accordion-content")).toHaveAttribute("inert");
  expect(await axe(view.container)).toHaveNoViolations();
});

it("ignores composition shortcuts until composition ends", () => {
  const change = jest.fn();
  render(<TagInput tags={["kept"]} onChange={change} />);
  const input = screen.getByRole("combobox");
  fireEvent.change(input, { target: { value: "日本" } });
  fireEvent.compositionStart(input);
  for (const key of ["Enter", ",", "Backspace"]) fireEvent.keyDown(input, { key });
  expect(input).toHaveValue("日本");
  expect(change).not.toHaveBeenCalled();
  fireEvent.compositionEnd(input);
  fireEvent.keyDown(input, { key: "Enter" });
  expect(change).toHaveBeenCalledWith(["kept", "日本"]);
});
