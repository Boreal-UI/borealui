import { test, expect } from "@playwright/test";
test.use({ locale: "en-US", timezoneId: "America/Toronto" });
for (const variant of ["core", "next"]) {
  test(`${variant}: notification hydration across server/browser locale and zone`, async ({ page, request }) => {
    const url = `/__tests__/browser/notifications?variant=${variant}`;
    const html = await (await request.get(url)).text();
    expect(html).toContain("12:00 UTC");
    expect(html).toContain("2026-11-13T12:00:00.000Z");
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(url);
    await expect(page.locator("time").first()).toHaveText("07:00 AM");
    await expect(page.locator("time").nth(1)).toHaveText("08:00 AM");
    await expect(page.locator("time")).toHaveCount(2);
    expect(await page.evaluate(() => (window as unknown as { hydrationErrors: string[] }).hydrationErrors)).toEqual([]);
    expect(errors).toEqual([]);
    const relations = await page.locator("li").evaluateAll(items => items.map(item => ({ description: item.getAttribute("aria-describedby"), ids: Array.from(item.querySelectorAll("time, [data-testid$='-description']")).map(e => e.id) })));
    expect(relations[0].description).toBe(relations[0].ids.join(" "));
    expect(relations[1].description).toBe(relations[1].ids.join(" "));
    expect(relations[2].description).toBeNull();
  });
}
