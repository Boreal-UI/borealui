import { expect, test, type Locator } from "@playwright/test";

const sizes = { xs: 28, small: 32, medium: 36, large: 44, xl: 52 };

async function expectFits(buttons: Locator, dimension: number) {
  const measurements = await buttons.evaluateAll(elements => elements.map(element => {
    const button = element as HTMLElement;
    const style = getComputedStyle(button);
    const label = button.querySelector("span");
    const range = document.createRange();
    if (label) range.selectNodeContents(label);
    const text = label ? range.getBoundingClientRect() : null;
    const labelRect = label?.getBoundingClientRect();
    return {
      width: button.offsetWidth, height: button.offsetHeight,
      minHeight: parseFloat(style.minHeight),
      padding: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft],
      clipped: label ? label.scrollWidth > label.clientWidth || label.scrollHeight > label.clientHeight ||
        text!.width > labelRect!.width + 1 || text!.height > labelRect!.height + 1 : false,
    };
  }));
  expect(measurements.length).toBeGreaterThan(0);
  for (const measurement of measurements) {
    expect(measurement).toEqual({ width: dimension, height: dimension, minHeight: dimension,
      padding: ["0px", "0px", "0px", "0px"], clipped: false });
  }
}

for (const entry of ["core", "next"]) {
  for (const width of [320, 1280]) {
    for (const order of ["pager-first", "pager-last"]) {
      test(`${entry} Pager labels fit at ${width}px with ${order}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/__tests__/browser/pager.html?entry=${entry}`);
        await expect(page.getByTestId("pager-medium-button-10")).toBeVisible();
        // Reorder actual Vite-compiled styles, including CSS Modules, without
        // depending on generated selectors or replacing production CSS.
        const reordered = await page.evaluate(order => {
          const styles = [...document.querySelectorAll<HTMLStyleElement>("style[data-vite-dev-id]")];
          const pager = styles.filter(style => /\/Pager\/(core|next)\//.test(style.dataset.viteDevId ?? ""));
          const buttons = styles.filter(style => /\/(Button|IconButton)\/(core|next)\//.test(style.dataset.viteDevId ?? ""));
          for (const style of order === "pager-first" ? [...pager, ...buttons] : [...buttons, ...pager]) {
            document.head.append(style);
          }
          return { pager: pager.length, buttons: buttons.length };
        }, order);
        expect(reordered.pager).toBeGreaterThan(0);
        expect(reordered.buttons).toBeGreaterThan(0);

        for (const [size, dimension] of Object.entries(sizes)) {
          const pager = page.getByTestId(`pager-${size}`);
          await expectFits(pager.getByRole("button"), dimension);
          await expectFits(page.getByTestId(`server-${size}`).getByRole("button"), dimension);
          await expectFits(page.getByTestId(`disabled-${size}`).getByRole("button"), dimension);
          await expect(pager.getByRole("button", { name: "Current page, page 10", exact: true })).toBeDisabled();
          await pager.getByRole("button", { name: "Go to next page", exact: true }).click();
          await expect(pager.getByRole("button", { name: "Current page, page 11", exact: true })).toBeDisabled();
          await pager.getByRole("button", { name: "Go to page 12", exact: true }).click();
          await expect(pager.getByRole("button", { name: "Go to next page", exact: true })).toBeDisabled();
          await pager.getByRole("button", { name: "Go to previous page", exact: true }).click();
          await expect(pager.getByRole("button", { name: "Current page, page 11", exact: true })).toBeDisabled();
          await pager.getByRole("button", { name: "Go to page 1", exact: true }).click();
          await expect(pager.getByRole("button", { name: "Go to previous page", exact: true })).toBeDisabled();
          await expectFits(pager.getByRole("button"), dimension);
          const ordinaryPadding = await page.getByTestId(`ordinary-${size}`).evaluate(el => parseFloat(getComputedStyle(el).paddingInlineStart));
          expect(ordinaryPadding).toBeGreaterThan(0);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      });
    }
  }
}
