import {test,expect,type Locator,type Page} from "@playwright/test";

async function expectActive(owner: Locator, name: string) {
  const target = await owner.getAttribute("aria-activedescendant");
  expect(target).toBeTruthy();
  expect(await owner.evaluate((el,id)=>{
    const option=document.getElementById(id!);
    const controls=document.getElementById(el.getAttribute("aria-controls")!);
    return {role:option?.getAttribute("role"),text:option?.textContent,inside:!!option&&!!controls?.contains(option)};
  },target)).toMatchObject({role:"option",text:expect.stringContaining(name),inside:true});
}
async function visit(page:Page,variant:string) {
  await page.goto(`/__tests__/browser/index.html?variant=${variant}&mode=interactions`);
  await expect(page.getByRole("heading",{name:"Interaction regression examples"})).toBeVisible();
}
for(const variant of ["core","next"]) {
  test(`${variant}: non-searchable MultiSelect arrows toggle options and retain accessible focus`,async({page})=>{
    await visit(page,variant);
    const trigger=page.getByRole("combobox",{name:"Keyboard options"});
    await trigger.focus(); await page.keyboard.press("ArrowDown");
    await expectActive(trigger,"Alpha");
    await page.keyboard.press("ArrowDown"); await expectActive(trigger,"Beta");
    await page.keyboard.press("Enter");
    await expect(trigger).toBeFocused();
    await expect(page.getByRole("option",{name:/Beta/})).toHaveAttribute("aria-selected","true");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("option",{name:/Beta/})).toHaveAttribute("aria-selected","false");
    await page.keyboard.press("Space"); await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused(); await expect(trigger).toHaveAttribute("aria-expanded","false");
    await page.keyboard.press("ArrowUp"); await expectActive(trigger,"Beta");
    await expect(page.getByRole("option",{name:/Beta/})).toHaveAttribute("aria-selected","true");
    await page.getByRole("option",{name:/Alpha/}).click();
    await expect(trigger).toBeFocused();
    await expect(page.getByRole("option",{name:/Alpha/})).toHaveAttribute("aria-selected","true");
  });
  test(`${variant}: searchable controlled MultiSelect keeps input focus and valid empty relationships`,async({page})=>{
    await visit(page,variant);
    await page.getByRole("button",{name:/^Searchable options /}).click();
    const search=page.getByRole("combobox",{name:"Filter options"});
    await expect(search).toBeFocused(); await page.keyboard.press("ArrowDown");
    await expectActive(search,"Beta"); await page.keyboard.press("Enter");
    await expect(search).toBeFocused();
    await expect(page.getByRole("option",{name:/Beta/})).toHaveAttribute("aria-selected","true");
    await page.keyboard.press("Enter");
    await expectActive(search,"Beta");
    await expect(page.getByRole("option",{name:/Beta/})).toHaveAttribute("aria-selected","false");
    await search.fill("nothing"); await page.keyboard.press("Enter");
    await expect(search).not.toHaveAttribute("aria-activedescendant");
    expect(await search.evaluate(el=>!!document.getElementById(el.getAttribute("aria-controls")!))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button",{name:/^Searchable options /})).toBeFocused();
  });
  test(`${variant}: MultiSelect handles selection limits and zero options`,async({page})=>{
    await visit(page,variant);
    const trigger=page.getByRole("combobox",{name:"Limited options"});
    await trigger.focus(); await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown"); await expectActive(trigger,"Alpha");
    await expect(page.getByRole("option",{name:/Beta/})).toBeDisabled();
    await page.keyboard.press("Enter"); await expect(page.getByRole("option",{name:/Beta/})).toBeEnabled();
    const empty=page.getByRole("combobox",{name:"No options"});
    await empty.focus(); await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter");
    await expect(empty).not.toHaveAttribute("aria-activedescendant");
    await expect(page.getByTestId("multi-select-empty")).toHaveText("No options found");
  });
  for(const controlled of [false,true]) {
    test(`${variant}: ${controlled?"controlled":"uncontrolled"} MultiSelect native form submission and validation`,async({page})=>{
      await visit(page,variant);
      const section=page.getByRole("region",{name:controlled?"Controlled form":"Uncontrolled form",exact:true});
      const form=section.locator("form");
      const values=()=>form.evaluate(el=>new FormData(el as HTMLFormElement).getAll("selection"));
      const valid=()=>form.evaluate(el=>(el as HTMLFormElement).checkValidity());
      expect(await values()).toEqual([]); expect(await valid()).toBe(true);
      await section.getByRole("button",{name:"Submit selection"}).click();
      await expect(section.getByLabel("Submission count")).toHaveText("1");
      await section.getByLabel("Disabled selection",{exact:true}).uncheck();
      expect(await values()).toEqual(["a","b"]);
      await section.getByRole("button",{name:"Submit selection"}).click();
      await expect(section.getByLabel("Submitted values")).toHaveText('["a","b"]');
      await section.getByLabel("Loading selection").check();
      expect(await values()).toEqual(["a","b"]); expect(await valid()).toBe(true);
      await section.getByLabel("Loading selection").uncheck();
      await section.getByLabel("Disabled fieldset").check();
      expect(await values()).toEqual([]); expect(await valid()).toBe(true);
      await section.getByLabel("Disabled fieldset").uncheck();
      expect(await values()).toEqual(["a","b"]);
      await section.getByRole("button",{name:"Clear selected options"}).click();
      expect(await valid()).toBe(false);
      await section.getByRole("button",{name:"Submit selection"}).click();
      await expect(section.getByLabel("Submission count")).toHaveText("2");
      await section.getByLabel("Disabled selection",{exact:true}).check();
      expect(await valid()).toBe(true);
      await section.getByRole("button",{name:"Submit selection"}).click();
      await expect(section.getByLabel("Submission count")).toHaveText("3");
    });
  }
  test(`${variant}: Rating moves real focus with checked state, wraps and preserves external focus`,async({page})=>{
    await visit(page,variant);
    const group=page.getByRole("radiogroup",{name:"Rating probe",exact:true});
    await group.getByRole("radio").nth(1).focus();
    for(const [key,star] of [["ArrowRight",3],["Enter",3],["ArrowUp",2],["ArrowDown",3],["Home",1],["ArrowLeft",5],["End",5],["ArrowRight",1],["Space",1]] as const) {
      await page.keyboard.press(key); const radio=group.getByRole("radio").nth(star-1);
      await expect(radio).toBeFocused(); await expect(radio).toHaveAttribute("aria-checked","true");
      await expect(radio).toHaveAttribute("tabindex","0");
    }
    const external=page.getByRole("button",{name:"Set external rating"});
    await external.focus(); await page.keyboard.press("Enter"); await expect(external).toBeFocused();
    await expect(group.getByRole("radio").nth(3)).toHaveAttribute("aria-checked","true");
    for(const label of ["Read-only rating","Disabled rating","Display rating"]) {
      const radio=page.getByRole("radiogroup",{name:label,exact:true}).getByRole("radio").nth(2);
      await radio.focus(); await page.keyboard.press("ArrowRight");
      await expect(radio).toHaveAttribute("aria-checked","true"); await expect(radio).toHaveAttribute("tabindex","-1");
    }
  });
  test(`${variant}: ComboBox never activates stale options while loading and restores valid popup references`,async({page})=>{
    await visit(page,variant);
    const input=page.getByRole("combobox",{name:"Loading probe"});
    await input.focus(); await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter");
    await expect(input).toHaveAttribute("aria-expanded","false");
    await expect(input).not.toHaveAttribute("aria-controls"); await expect(input).not.toHaveAttribute("aria-activedescendant");
    await expect(page.getByLabel("ComboBox selection")).toHaveText("none");
    await page.getByLabel("Load ComboBox",{exact:true}).uncheck();
    await input.focus(); await expectActive(input,"Alpha"); await page.keyboard.press("ArrowDown");
    await expectActive(input,"Beta");
    await page.getByLabel("Load ComboBox",{exact:true}).check(); await input.focus(); await page.keyboard.press("Enter");
    await expect(page.getByLabel("ComboBox selection")).toHaveText("none");
    await page.getByLabel("Empty ComboBox options").check(); await input.focus(); await page.keyboard.press("Enter");
    await expect(input).not.toHaveAttribute("aria-activedescendant");
    await page.getByLabel("Load ComboBox",{exact:true}).uncheck(); await input.focus();
    await expect(input).toHaveAttribute("aria-expanded","false");
    await page.getByLabel("Empty ComboBox options").uncheck(); await input.focus();
    await expectActive(input,"Alpha"); await page.keyboard.press("Enter");
    await expect(page.getByLabel("ComboBox selection")).toHaveText("a"); await expect(input).toHaveValue("Alpha");
    await input.fill("no match"); await expect(input).toHaveAttribute("aria-expanded","false");
    await expect(input).not.toHaveAttribute("aria-controls"); await expect(input).not.toHaveAttribute("aria-activedescendant");
    await page.getByLabel("Disable ComboBox").check(); await expect(input).toBeDisabled();
  });
}
