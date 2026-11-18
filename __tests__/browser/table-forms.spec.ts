import { test, expect } from "@playwright/test";

for (const variant of ["core", "next"]) {
  const url = (extra = "") => `/__tests__/browser/index.html?mode=table-forms&variant=${variant}${extra}`;
  test(`${variant}: clear emits one value change and optional notification with stable focus`, async ({ page }) => {
    for (const notify of [false, true]) {
      await page.goto(url(notify ? "&notify" : ""));
      const clear = page.getByRole("button", { name: "Clear search", exact: true });
      await clear.focus(); await clear.press("Enter");
      await expect(page.getByRole("searchbox", { name: "Search", exact: true })).toHaveValue("");
      await expect(page.getByRole("searchbox", { name: "Search", exact: true })).toBeFocused();
      await expect(page.getByTestId("search-calls")).toHaveText(notify ? '["change::click","clear"]' : '["change::click"]');
    }
  });
  test(`${variant}: custom and preset colors submit one native value and enforce required`, async ({ page }) => {
    await page.goto(url());
    const form = page.getByTestId("color-form");
    const entries = () => form.evaluate((node: HTMLFormElement) => new FormData(node).getAll("chosen-color"));
    const valid = () => form.evaluate((node: HTMLFormElement) => node.checkValidity());
    expect(await entries()).toEqual(["#123456"]); expect(await valid()).toBe(true);
    await page.getByRole("button", { name: "Set preset", exact: true }).click();
    expect(await entries()).toEqual(["#0000ff"]); expect(await valid()).toBe(true);
    await page.getByRole("button", { name: "Set custom", exact: true }).click();
    expect(await entries()).toEqual(["#654321"]);
    await page.getByRole("button", { name: "Reset colors", exact: true }).click();
    await expect.poll(entries).toEqual(["#654321"]);
    for (const button of ["Clear color", "Set invalid color"]) {
      await page.getByRole("button", { name: button, exact: true }).click();
      expect(await entries()).toEqual([]); expect(await valid()).toBe(false);
    }
    const first = page.getByRole("group", { name: "First palette", exact: true });
    const second = page.getByRole("group", { name: "Second palette", exact: true });
    await page.getByTestId("first-color-option-#0000ff").click();
    await expect(first.getByRole("radio", { name: "Blue", exact: true })).toBeChecked();
    await expect(second.getByRole("radio", { name: "Blue", exact: true })).toBeChecked();
    for (const disabled of ["disabled", "disabled-fieldset"]) {
      await page.goto(url(`&${disabled}`));
      expect(await entries()).toEqual([]); expect(await valid()).toBe(true);
    }
  });
  test(`${variant}: uncontrolled native custom edits reset and unnamed groups remain independent`, async ({ page }) => {
    await page.goto(url("&uncontrolled&color="));
    const form = page.getByTestId("color-form");
    const values = () => form.evaluate((node: HTMLFormElement) => new FormData(node).getAll("chosen-color"));
    expect(await values()).toEqual([]);
    const custom = page.getByLabel("Custom color picker", { exact: true });
    await custom.evaluate((node: HTMLInputElement) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(node, "#123456");
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await expect.poll(values).toEqual(["#123456"]);
    await page.getByRole("button", { name: "Reset colors", exact: true }).click();
    await expect.poll(values).toEqual([]);
    await expect(custom).toHaveValue("#000000");
    const first = page.getByRole("group", { name: "First palette", exact: true });
    const second = page.getByRole("group", { name: "Second palette", exact: true });
    await expect(first.getByRole("radio", { name: "Red", exact: true })).toBeChecked();
    await expect(second.getByRole("radio", { name: "Blue", exact: true })).toBeChecked();
    await first.getByRole("radio", { name: "Red", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(first.getByRole("radio", { name: "Blue", exact: true })).toBeChecked();
    await expect(second.getByRole("radio", { name: "Blue", exact: true })).toBeChecked();
    const entries = await form.evaluate((node: HTMLFormElement) => Array.from(new FormData(node).entries()));
    const names = entries.map(([name]) => name);
    expect(names.length, JSON.stringify(entries)).toBe(2); expect(new Set(names).size).toBe(2);
  });
  test(`${variant}: virtual select-all matches nonvirtual scope and survives scrolling`, async ({ page }) => {
    for (const mode of ["", "&controlled-selection", "&nonvirtual"]) {
      await page.goto(url(mode));
      await page.getByRole("checkbox", { name: "Select all rows", exact: true }).check();
      const expected = JSON.stringify(Array.from({ length: 200 }, (_, id) => id));
      await expect(page.getByTestId("selection-keys")).toHaveText(expected);
      await expect(page.getByTestId("selection-rows")).toHaveText(expected);
      await expect(page.getByTestId("bulk-scope")).toHaveText('{"keys":200,"rows":200}');
      if (!mode.includes("nonvirtual")) {
        await page.getByTestId("data-table-virtual-viewport").evaluate(node => { node.scrollTop = 4000; node.dispatchEvent(new Event("scroll")); });
        await expect(page.getByTestId("data-table-row-83")).toBeVisible();
        await expect(page.getByRole("checkbox", { name: "Select all rows", exact: true })).toBeChecked();
      }
      await page.getByRole("checkbox", { name: "Select all rows", exact: true }).uncheck();
      await expect(page.getByTestId("selection-keys")).toHaveText("[]");
    }
  });
  test(`${variant}: filtering, replacement and page changes reconcile the virtual viewport`, async ({ page }) => {
    for (const mode of ["", "&controlled-filter"]) {
      await page.goto(url(mode));
      const viewport = page.getByTestId("data-table-virtual-viewport");
      const deep = async () => { await viewport.evaluate(node => { node.scrollTop = 4000; node.dispatchEvent(new Event("scroll")); }); await expect(page.getByTestId("data-table-row-83")).toBeVisible(); };
      await deep();
      await page.getByRole("button", { name: "Trim to 100 rows", exact: true }).click();
      expect(await viewport.evaluate(node => node.scrollTop)).toBe(4000);
      await expect(page.getByTestId("data-table-row-83")).toBeVisible();
      await page.getByRole("searchbox", { name: "Filter table rows", exact: true }).fill("Row 000");
      await expect(page.getByTestId("data-table-row-0")).toBeVisible();
      expect(await viewport.evaluate(node => node.scrollTop)).toBe(0);
      await page.getByRole("checkbox", { name: "Select all rows", exact: true }).check();
      await expect(page.getByTestId("selection-keys")).toHaveText("[0]");
      await page.getByRole("searchbox", { name: "Filter table rows", exact: true }).fill("missing");
      await expect(page.getByTestId("data-table-row-0")).toHaveCount(0);
      expect(await viewport.evaluate(node => node.scrollTop)).toBe(0);
      await page.getByRole("searchbox", { name: "Filter table rows", exact: true }).fill("");
      await deep(); await page.getByRole("button", { name: "Shorten rows", exact: true }).click();
      await expect(page.getByTestId("data-table-row-0")).toBeVisible();
      expect(await viewport.evaluate(node => node.scrollTop)).toBe(0);
      await page.getByRole("button", { name: "Restore rows", exact: true }).click();
      await deep();
      await page.getByRole("button", { name: "Load shorter rows", exact: true }).click();
      await expect(page.getByTestId("data-table-row-0")).toBeVisible();
      expect(await viewport.evaluate(node => node.scrollTop)).toBe(0);
    }
    for (const mode of ["&pagination", "&server"]) {
      await page.goto(url(mode));
      await page.getByRole("checkbox", { name: "Select all rows", exact: true }).check();
      await expect(page.getByTestId("selection-keys")).toHaveText(JSON.stringify(Array.from({ length: mode === "&server" ? 8 : 20 }, (_, id) => id)));
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await expect(page.getByTestId(`data-table-row-${mode === "&server" ? 8 : 20}`)).toBeVisible();
      expect(await page.getByTestId("data-table-virtual-viewport").evaluate(node => node.scrollTop)).toBe(0);
      if (mode === "&pagination") {
        await page.getByRole("button", { name: "Use five rows per page", exact: true }).click();
        await expect(page.getByTestId("data-table-row-5")).toBeVisible();
        expect(await page.getByTestId("data-table-virtual-viewport").evaluate(node => node.scrollTop)).toBe(0);
      }
    }
  });
  test(`${variant}: editing and column reordering retain their event contracts`, async ({ page }) => {
    await page.goto(url());
    await page.getByTestId("data-table-row-0").getByRole("button", { name: "Row 000", exact: true }).click();
    await page.getByRole("textbox", { name: "Edit Name", exact: true }).fill("Updated");
    await page.getByRole("textbox", { name: "Edit Name", exact: true }).press("Enter");
    await expect(page.getByTestId("edits")).toHaveText("1");
    await page.getByTestId("data-table-row-0").getByRole("button", { name: "Row 000", exact: true }).click();
    await page.getByRole("textbox", { name: "Edit Name", exact: true }).press("Escape");
    await expect(page.getByTestId("edits")).toHaveText("1");
    await page.getByTestId("data-table-move-id-left").click();
    await expect(page.getByRole("columnheader").nth(1)).toContainText("ID");
  });
}
