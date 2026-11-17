import { test, expect } from "@playwright/test";

for (const variant of ["core", "next"]) {
  const url = (extra = "") => `/__tests__/browser/index.html?mode=advanced-controls&variant=${variant}${extra}`;
  test(`${variant}: range bounds and public picker ARIA reach native inputs`, async ({ page }) => {
    await page.goto(url("&range-bounds&range-error&external-aria"));
    await page.getByRole("combobox").press("Escape");
    const start = page.getByTestId("date-range-picker-start-input");
    const end = page.getByTestId("date-range-picker-end-input");
    await expect(start).toHaveAttribute("max", "2026-11-30");
    await expect(end).toHaveAttribute("min", "2026-11-01");
    for (const input of [start, end]) {
      await expect(input).toHaveAttribute("aria-invalid", "true");
      await expect(input).toHaveAttribute("aria-errormessage", "trip-errorMessage");
      const native = await input.evaluate((node: HTMLInputElement) => ({ type: node.type, valid: node.validity.valid }));
      if (native.type === "date") expect(native.valid).toBe(false);
      else test.info().annotations.push({ type: "compatibility", description: "Native date constraints are unavailable in this engine's text fallback." });
    }
    for (const name of ["External date", "External time"]) {
      const input = page.getByLabel(name, { exact: true });
      await expect(input).toHaveAccessibleName(name);
      await expect(input).toHaveAttribute("aria-invalid", "true");
      await expect(input).toHaveAttribute("aria-errormessage", "external-error");
    }
  });
  test(`${variant}: ARIA override cannot announce a different command`, async ({ page }) => {
    await page.goto(url("&override"));
    const input = page.getByRole("combobox");
    const selected = page.getByRole("option", { selected: true });
    await expect(selected).toHaveText("Command 0");
    await expect(input).toHaveAttribute("aria-activedescendant", "probe-option-0");
    await input.press("Enter");
    await expect(page.getByTestId("selected-command")).toHaveText("0");
  });
  test(`${variant}: synchronous provider failure clears loading and subsequent search works`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(url("&async"));
    const input = page.getByRole("combobox");
    await input.fill("throw");
    await expect(page.getByTestId("command-palette-empty")).toBeVisible();
    await expect(input).not.toHaveAttribute("aria-activedescendant");
    await input.press("Enter");
    await expect(input).toBeVisible();
    await expect(page.getByTestId("actions")).toHaveText("0");
    await input.fill("recovered");
    await expect(page.getByRole("option", { name: "recovered command 0", exact: true })).toBeVisible();
    await input.press("Enter");
    await expect(page.getByTestId("actions")).toHaveText("1");
    expect(errors).toEqual([]);
  });
}
