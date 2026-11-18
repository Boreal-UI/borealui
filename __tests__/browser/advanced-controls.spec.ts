import { test, expect } from "@playwright/test";

for (const variant of ["core", "next"]) {
  const url = (extra = "") => `/__tests__/browser/index.html?mode=advanced-controls&variant=${variant}${extra}`;
  test(`${variant}: keyboard active options stay visible without moving focus or page`, async ({ page }) => {
    await page.goto(url());
    const input = page.getByRole("combobox");
    const list = page.getByRole("listbox");
    const visible = async () => {
      await expect.poll(() => input.getAttribute("aria-activedescendant")).toBeTruthy();
      const id = await input.getAttribute("aria-activedescendant");
      expect(id).toBeTruthy();
      const geometry = await list.evaluate((list, id) => {
        const option = document.getElementById(id!);
        const bounds = option!.getBoundingClientRect();
        const viewport = list.getBoundingClientRect();
        return { top: bounds.top, bottom: bounds.bottom, listTop: viewport.top + list.clientTop, listBottom: viewport.top + list.clientTop + list.clientHeight };
      }, id);
      expect(geometry.top).toBeGreaterThanOrEqual(geometry.listTop - 1);
      expect(geometry.bottom).toBeLessThanOrEqual(geometry.listBottom + 1);
      await expect(input).toBeFocused();
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
    };
    await input.press("End"); await visible();
    expect(await list.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
    const beforeHover = await list.evaluate(node => node.scrollTop);
    await page.getByTestId("command-palette-option-0").dispatchEvent("mouseover");
    expect(await list.evaluate(node => node.scrollTop)).toBe(beforeHover);
    await input.press("End"); await visible();
    await list.evaluate(node => { node.scrollTop = 0; });
    await input.press("F2");
    expect(await list.evaluate(node => node.scrollTop)).toBe(0);
    await input.press("End"); await visible();
    await input.press("ArrowUp"); await visible();
    await expect(page.getByRole("option", { selected: true })).toHaveText("Command 37");
    await input.press("Home"); await visible();
    await input.press("ArrowUp"); await visible();
    await input.press("ArrowDown"); await visible();
    for (let index = 0; index < 30; index++) await input.press("ArrowDown");
    await visible();
    const scroll = await list.evaluate(node => node.scrollTop);
    await input.press("F2");
    expect(await list.evaluate(node => node.scrollTop)).toBe(scroll);
    await page.setViewportSize({ width: 480, height: 500 });
    await expect.poll(async () => {
      const id = await input.getAttribute("aria-activedescendant");
      return list.evaluate((node, id) => {
        const option = document.getElementById(id!)!.getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        return option.top >= rect.top - 1 && option.bottom <= rect.top + node.clientHeight + 1;
      }, id);
    }).toBe(true);
    await input.fill("Command 39"); await visible();
    await input.press("Escape");
    await expect(page.getByTestId("date-range-picker-start-input")).toHaveAccessibleName("Departure");
    await expect(page.getByTestId("date-range-picker-end-input")).toHaveAccessibleName("Return");
    await expect(page.getByRole("button", { name: "Open date picker for Departure" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Open date picker for Return" })).toBeVisible();
    await page.locator("label").filter({ hasText: "Departure" }).click();
    await expect(page.getByTestId("date-range-picker-start-input")).toBeFocused();
  });
  test(`${variant}: async pending results cannot activate and replacement is visible`, async ({ page }) => {
    await page.goto(url("&async"));
    const input = page.getByRole("combobox");
    await input.fill("old");
    await expect(page.getByRole("option", { name: "old command 39", exact: true })).toBeVisible();
    await input.press("End");
    await input.fill("pending");
    await expect(page.getByText("Searching…")).toBeVisible();
    await expect(input).not.toHaveAttribute("aria-activedescendant");
    await input.press("Enter");
    await expect(input).toBeVisible();
    await expect(page.getByTestId("actions")).toHaveText("0");
    await input.fill("new");
    await expect(page.getByRole("option", { name: "new command 0", exact: true })).toBeVisible();
    await expect.poll(() => input.evaluate(node => !!document.getElementById(node.getAttribute("aria-activedescendant") ?? ""))).toBe(true);
    await input.press("Enter");
    await expect(page.getByTestId("actions")).toHaveText("1");
  });
  test(`${variant}: native time validity agrees with ARIA across midnight and precision`, async ({ page }) => {
    const scenarios: [string, boolean][] = [["", true], ["&controlled", true], ["&value=22:00", true], ["&value=02:00", true], ["&value=00:30", true], ["&value=12:00", false], ["&controlled&value=12:00", false], ["&value=02:01", false], ["&value=", true], ["&value=&required", false], ["&value=22:00:00.500&step=0.5", true], ["&value=22:00:00.500&step=1", false], ["&min=08:00&max=17:00&value=09:00", true], ["&min=12:00&max=12:00&value=12:01", false]];
    for (const [extra, expectedValid] of scenarios) {
      await page.goto(url(extra));
      await page.getByRole("combobox").press("Escape");
      const input = page.getByLabel("Night");
      const native = await input.evaluate((node: HTMLInputElement) => ({ type: node.type, valid: node.validity.valid }));
      expect(await input.getAttribute("aria-invalid"), extra).toBe(expectedValid ? null : "true");
      if (native.type === "time") expect(native.valid, extra).toBe(expectedValid);
      else if (!extra) test.info().annotations.push({ type: "compatibility", description: "This engine falls back to text for time inputs. Library constraint presentation is verified; native periodic/step validation is unavailable." });
    }
    await page.goto(url());
    await page.getByRole("combobox").press("Escape");
    const input = page.getByLabel("Night");
    await input.fill("12:00");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await page.getByRole("button", { name: "Reset time" }).click();
    await expect(input).toHaveValue("23:00");
    await expect(input).not.toHaveAttribute("aria-invalid");
  });
}
