import React, { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import CoreMultiSelect from "@/core/MultiSelect";
import NextMultiSelect from "@/next/MultiSelect";
import CoreRating from "@/core/Rating";
import NextRating from "@/next/Rating";
import CoreComboBox from "@/core/ComboBox";
import NextComboBox from "@/next/ComboBox";

const options = [{value:"a",label:"Alpha"},{value:"off",label:"Unavailable",disabled:true},{value:"b",label:"Beta"}];
function expectActive(owner: HTMLElement, label: string) {
  const id = owner.getAttribute("aria-activedescendant");
  expect(id).toBeTruthy();
  expect(document.getElementById(id!)).toHaveAttribute("role", "option");
  expect(document.getElementById(id!)).toHaveTextContent(label);
}

describe.each([
  ["Core", CoreMultiSelect, CoreRating, CoreComboBox],
  ["Next", NextMultiSelect, NextRating, NextComboBox],
] as const)("%s public interaction entries", (_, MultiSelect, Rating, ComboBox) => {
  it.each([true, false])("navigates, toggles and restores focus with searchable=%s", async searchable => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    function Controlled() {
      const [value, setValue] = useState<string[]>([]);
      return <MultiSelect label="Keyboard options" searchable={searchable} options={options.map(option=>({...option}))} value={value}
        onChange={next => {setValue(next); onChange(next);}} />;
    }
    const {container} = render(<Controlled />);
    const trigger = screen.getByTestId("multi-select-trigger");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    const owner = searchable ? screen.getByRole("combobox", {name:"Filter options"}) : trigger;
    await waitFor(() => expect(owner).toHaveFocus());
    expectActive(owner, "Alpha");
    await user.keyboard("{ArrowDown}{Enter}");
    expectActive(owner, "Beta");
    expect(onChange).toHaveBeenLastCalledWith(["b"]);
    expect(owner).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith([]);
    await user.keyboard("{End}{Enter}{Escape}");
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.keyboard("{ArrowUp}");
    await waitFor(() => expect(searchable ? screen.getByTestId("multi-select-search") : trigger).toHaveFocus());
    expect(screen.getByRole("option", {name:/Beta/})).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("option", {name:/Alpha/}));
    expect(onChange).toHaveBeenLastCalledWith(["b", "a"]);
    expect(await axe(container)).toHaveNoViolations();
  });

  it.each([true, false])("supports uncontrolled selection with searchable=%s and empty/disabled results", async searchable => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const {rerender} = render(<MultiSelect searchable={searchable} label="Choices" options={options} onChange={onChange} />);
    const trigger = screen.getByTestId("multi-select-trigger");
    trigger.focus(); await user.keyboard("{ArrowDown}");
    const owner = searchable ? screen.getByTestId("multi-select-search") : trigger;
    await waitFor(() => expect(owner).toHaveFocus());
    await user.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByTestId("multi-select-chip-b")).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.queryByTestId("multi-select-chip-b")).not.toBeInTheDocument();
    rerender(<MultiSelect searchable={searchable} label="Choices" options={options.map(o=>({...o,disabled:true}))} onChange={onChange} />);
    onChange.mockClear();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(owner).not.toHaveAttribute("aria-activedescendant");
    expect(onChange).not.toHaveBeenCalled();
    rerender(<MultiSelect searchable={searchable} label="Choices" options={[]} onChange={onChange} />);
    expect(screen.getByRole("status")).toHaveTextContent("No options found");
    expect(document.getElementById(owner.getAttribute("aria-controls")!)).toHaveAttribute("role", "listbox");
    await user.keyboard("{Enter}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it.each([true, false])("preserves %s controlled form values across disabled toggles", controlled => {
    const props = controlled ? {value:["a","b"]} : {defaultValue:["a","b"]};
    const view = (disabled: boolean) => <form data-testid="form"><MultiSelect {...props} required disabled={disabled} name="selection" options={options} /></form>;
    const {rerender} = render(view(true));
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(new FormData(form).getAll("selection")).toEqual([]);
    expect(form.checkValidity()).toBe(true);
    rerender(view(false));
    expect(new FormData(form).getAll("selection")).toEqual(["a","b"]);
    expect(form.checkValidity()).toBe(true);
    rerender(view(true)); rerender(view(false));
    expect(new FormData(form).getAll("selection")).toEqual(["a","b"]);
  });

  it("retains active identity when options reorder, and closes during loading/disabled transitions", async () => {
    const user=userEvent.setup();
    const view=(items=options,loading=false,disabled=false)=><form data-testid="form"><MultiSelect label="Choices" searchable={false} options={items}
      name="selection" defaultValue={["a"]} loading={loading} disabled={disabled} /></form>;
    const {rerender}=render(view()); const trigger=screen.getByRole("combobox");
    trigger.focus(); await user.keyboard("{ArrowDown}{ArrowDown}"); expectActive(trigger,"Beta");
    rerender(view([...options].reverse())); expectActive(trigger,"Beta");
    await user.keyboard("{Enter}");
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).getAll("selection")).toEqual(["a","b"]);
    rerender(view(options,true)); expect(trigger).toBeDisabled(); expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(new FormData(screen.getByTestId("form") as HTMLFormElement).getAll("selection")).toEqual(["a","b"]);
    rerender(view(options,false,true)); expect(new FormData(screen.getByTestId("form") as HTMLFormElement).getAll("selection")).toEqual([]);
    rerender(view()); expect(trigger).toHaveAttribute("aria-expanded","false");
  });

  it("exempts disabled required controls and fieldsets, but keeps loading validation deliberate", () => {
    const view = (disabled=false, loading=false, fieldset=false) => <form data-testid="form"><fieldset disabled={fieldset}>
      <MultiSelect required disabled={disabled} loading={loading} name="selection" options={options} />
    </fieldset></form>;
    const {rerender} = render(view());
    const form = screen.getByTestId("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    rerender(view(true)); expect(form.checkValidity()).toBe(true);
    rerender(view(false,true)); expect(form.checkValidity()).toBe(false);
    rerender(view(false,false,true)); expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).getAll("selection")).toEqual([]);
  });

  it("keeps Rating focus, checked state and tab stop together and wraps directional keys", async () => {
    const user = userEvent.setup();
    function Controlled() {const [value,setValue]=useState(2);return <Rating label="Rating probe" value={value} onChange={setValue} />;}
    const {container} = render(<Controlled />);
    screen.getByRole("radio", {name:/Rate 2 of/}).focus();
    for (const [key,value] of [["ArrowRight",3],["Enter",3],["ArrowUp",2],["ArrowDown",3],["ArrowLeft",2],["Home",1],["ArrowLeft",5],["End",5],["ArrowRight",1],[" ",1]] as const) {
      await user.keyboard(key === " " ? " " : `{${key}}`);
      const radio = screen.getByTestId(`rating-star-${value}`);
      expect(radio).toHaveFocus(); expect(radio).toHaveAttribute("aria-checked","true");
      expect(radio).toHaveAttribute("tabindex","0");
    }
    expect(await axe(container)).toHaveNoViolations();
  });

  it("enters zero Rating at the first star and external updates never steal focus", async () => {
    const user=userEvent.setup(); const onChange=jest.fn();
    const view=(value:number)=><><button>Outside</button><Rating value={value} onChange={onChange} label="Rating" /></>;
    const {rerender}=render(view(0));
    screen.getByRole("button",{name:"Outside"}).focus(); await user.tab();
    expect(screen.getByTestId("rating-star-1")).toHaveFocus();
    screen.getByRole("button",{name:"Outside"}).focus(); rerender(view(4));
    expect(screen.getByRole("button",{name:"Outside"})).toHaveFocus();
    expect(screen.getByTestId("rating-star-4")).toHaveAttribute("tabindex","0");
  });

  it.each([{readOnly:true},{interactive:false},{state:"disabled" as const}])("does not activate inactive Rating %j", props => {
    const onChange=jest.fn(); render(<Rating value={2} onChange={onChange} {...props} />);
    const radio=screen.getByTestId("rating-star-2");
    fireEvent.keyDown(radio,{key:"ArrowRight"}); fireEvent.click(radio);
    expect(onChange).not.toHaveBeenCalled(); expect(radio).toHaveAttribute("tabindex","-1");
  });

  it("blocks stale ComboBox options, then restores valid relationships on ready/empty/disabled transitions", async () => {
    const user=userEvent.setup(); const onChange=jest.fn();
    const view=(loading:boolean, disabled=false, items=options)=><ComboBox label="Loading probe" loading={loading} disabled={disabled} options={items} onChange={onChange} />;
    const {rerender,container}=render(view(true));
    const input=screen.getByRole("combobox"); await user.click(input);
    await user.keyboard("{ArrowDown}{Enter}{ArrowUp}");
    expect(onChange).not.toHaveBeenCalled(); expect(input).toHaveAttribute("aria-expanded","false");
    expect(input).not.toHaveAttribute("aria-controls"); expect(input).not.toHaveAttribute("aria-activedescendant");
    expect(screen.getByRole("status")).toHaveTextContent("Loading options");
    rerender(view(false));
    expect(input).toHaveFocus(); expect(input).toHaveAttribute("aria-expanded","true");
    expect(document.getElementById(input.getAttribute("aria-controls")!)).toHaveAttribute("role","listbox");
    expectActive(input,"Alpha"); await user.keyboard("{ArrowDown}"); expectActive(input,"Beta");
    rerender(view(true)); await user.keyboard("{Enter}"); expect(onChange).not.toHaveBeenCalled();
    expect(input).not.toHaveAttribute("aria-activedescendant");
    rerender(view(false)); await user.click(screen.getByRole("option",{name:"Alpha"}));
    expect(onChange).toHaveBeenLastCalledWith("a",expect.objectContaining({value:"a"}));
    await user.clear(input); await user.type(input,"no match");
    expect(input).not.toHaveAttribute("aria-activedescendant"); expect(input).not.toHaveAttribute("aria-controls");
    rerender(view(true,false,[])); await user.keyboard("{Enter}"); expect(onChange).toHaveBeenCalledTimes(1);
    rerender(view(false,true)); expect(input).toBeDisabled(); expect(input).toHaveAttribute("aria-expanded","false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
