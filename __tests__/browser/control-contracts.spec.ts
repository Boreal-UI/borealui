import { test, expect, type Page } from "@playwright/test";
const freezeClock = async (page: Page) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 10000));
};
const configure = async (page: Page, config: Record<string, unknown>) => {
  await page.evaluate(config => window.controlConfig(config), config);
  await page.evaluate(() => new Promise(requestAnimationFrame));
};
const data = (page: Page) => page.getByTestId("contract-form").evaluate(
  node => Array.from(new FormData(node as HTMLFormElement).entries()));
const resolve = (page: Page, query: string, result: string[] | null) =>
  page.evaluate(({ query, result }) => window.resolveTags(query, result), { query, result });
const drop = (page: Page, name = "photo.png", type = "image/png") =>
  page.getByTestId("file-upload-wrapper").evaluate((node, { name, type }) => {
    const transfer = new DataTransfer();
    transfer.items.add(new File(["hello"], name, { type }));
    node.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: transfer }));
  }, { name, type });

for (const variant of ["core", "next"]) {
  const open = async (page: Page, control: string, config = {}) => {
    await page.goto("/__tests__/browser/index.html?mode=control-contracts&variant=" + variant +
      "&control=" + control + "&config=" + encodeURIComponent(JSON.stringify(config)));
    await expect(page.getByRole("button", { name: "Before", exact: true })).toBeVisible();
  };
  test.describe(variant + " control contracts", () => {
    test("1: current-query suggestions, dismissal, rejection and latest response", async ({ page }) => {
      await open(page, "tags");
      const input = page.getByRole("combobox");
      await input.fill("alpha"); await resolve(page, "alpha", ["Alpha result"]);
      await expect(page.getByRole("option")).toHaveText("Alpha result");
      await input.fill("beta");
      await expect(page.getByRole("option")).toHaveCount(0);
      await expect(input).not.toHaveAttribute("aria-activedescendant");
      await input.press("Enter");
      await expect(page.getByTestId("events")).toHaveText('[["beta"]]');
      await resolve(page, "beta", ["Beta result"]);
      await expect(input).toHaveAttribute("aria-expanded", "false");
      await input.fill("gamma"); await input.press("Escape"); await resolve(page, "gamma", ["Gamma"]);
      await expect(page.getByRole("option")).toHaveCount(0);
      await input.fill("blur"); await page.getByRole("button", { name: "After", exact: true }).focus();
      await resolve(page, "blur", ["Blur"]); await expect(page.getByRole("option")).toHaveCount(0);
      await input.fill("old"); await input.fill("new");
      await resolve(page, "new", ["New"]); await resolve(page, "old", ["Old"]);
      await expect(page.getByRole("option")).toHaveText("New");
      const active = await input.getAttribute("aria-activedescendant");
      expect(await page.locator('[id="' + active + '"]').count()).toBe(1);
      await page.getByRole("option").click();
      await expect(page.getByTestId("events")).toHaveText('[["beta"],["beta","New"]]');
      await input.fill("empty"); await resolve(page, "empty", []);
      await expect(input).toHaveAttribute("aria-expanded", "false");
      await input.fill("reject"); await resolve(page, "reject", null);
      await expect(input).not.toHaveAttribute("aria-activedescendant");
    });
    test("1,14: debounce invalidates old pointer targets and composition preserves draft", async ({ page }) => {
      await open(page, "tags", { debounce: 100 });
      await freezeClock(page);
      const input = page.getByRole("combobox");
      await input.fill("alpha"); await page.clock.runFor(101); await resolve(page, "alpha", ["Alpha"]);
      await input.fill("beta"); await expect(page.getByRole("option")).toHaveCount(0);
      await input.press("Escape"); await page.clock.runFor(101);
      await expect(input).toHaveAttribute("aria-expanded", "false");
      await input.fill("日本");
      await input.dispatchEvent("compositionstart");
      for (const key of ["Enter", ",", "Backspace", "ArrowDown"]) {
        await input.dispatchEvent("keydown", { key, isComposing: true, keyCode: 229, bubbles: true });
      }
      await expect(input).toHaveValue("日本"); await expect(page.getByTestId("events")).toHaveText("[]");
      await input.dispatchEvent("compositionend");
      await input.press("Enter"); await expect(page.getByTestId("events")).toHaveText('[["日本"]]');
      await input.fill("suggest"); await page.clock.runFor(101); await resolve(page, "suggest", ["Suggested"]);
      await input.dispatchEvent("keydown", { key: "Enter", isComposing: true });
      await expect(input).toHaveValue("suggest");
      await input.press("Enter"); await expect(page.getByTestId("events")).toHaveText('[["日本"],["日本","Suggested"]]');
    });
    test("2: range output, ARIA and FormData match native normalization", async ({ page }) => {
      await open(page, "slider");
      const input = page.getByRole("slider");
      for (const config of [
        { value: 3, min: 0, max: 10, step: 2 },
        { value: 9.9, min: 0, max: 9, step: 2 },
        { value: 0.4, min: 0.1, max: 1, step: 0.2 },
        { value: -0.2, min: -0.3, max: 1, step: 0.2 },
        { value: -100, min: 2, max: 10, step: 3 },
        { value: 100, min: 2, max: 10, step: 3 },
      ]) {
        await configure(page, config);
        const expected = await page.evaluate(config => {
          const native = document.createElement("input"); native.type = "range";
          native.min = String(config.min); native.max = String(config.max); native.step = String(config.step);
          native.value = String(config.value); return native.value;
        }, config);
        await expect(input).toHaveValue(expected);
        await expect(input).toHaveAttribute("aria-valuenow", expected);
        await expect(page.getByTestId("slider-value")).toHaveText(expected);
        expect(await data(page)).toEqual([["amount", expected]]);
      }
      await configure(page, { value: 3, min: 0, max: 10, step: 2 });
      await input.focus(); await input.press("ArrowRight");
      await expect(input).toHaveValue("6"); await expect(page.getByTestId("slider-value")).toHaveText("6");
      await expect(page.getByTestId("events")).toHaveText("[6]");
    });
    test("3,8: native required selection, invalid focus, reset and disabled forms", async ({ page }) => {
      await open(page, "segments");
      const form = page.getByTestId("contract-form");
      expect(await form.evaluate(node => (node as HTMLFormElement).checkValidity())).toBe(false);
      expect(await form.evaluate(node => (node as HTMLFormElement).reportValidity())).toBe(false);
      await expect(page.getByRole("radio", { name: "Alpha" })).toBeFocused();
      await page.getByRole("button", { name: "Submit", exact: true }).click();
      await expect(page.getByTestId("submits")).toHaveText("0");
      await page.getByRole("radio", { name: "Beta" }).click();
      expect(await data(page)).toEqual([["segment", "b"]]);
      await page.getByRole("button", { name: "Submit", exact: true }).click();
      await expect(page.getByTestId("submits")).toHaveText("1");
      await page.getByRole("button", { name: "Reset", exact: true }).click();
      await expect.poll(() => form.evaluate(node => (node as HTMLFormElement).checkValidity())).toBe(false);
      await configure(page, { required: false });
      expect(await form.evaluate(node => (node as HTMLFormElement).checkValidity())).toBe(true);
      await configure(page, { required: true, fieldset: true });
      expect(await form.evaluate(node => (node as HTMLFormElement).checkValidity())).toBe(true);
      expect(await data(page)).toEqual([]);
      await configure(page, { fieldset: false, empty: true });
      expect(await form.evaluate(node => (node as HTMLFormElement).reportValidity())).toBe(false);
      await expect(page.getByRole("radiogroup")).toBeFocused();
    });
    test("4: disabled and removed selections retain real Tab entry without callbacks", async ({ page }) => {
      await open(page, "segments", { defaultValue: "a" });
      const a = page.getByRole("radio", { name: "Alpha" }), b = page.getByRole("radio", { name: "Beta" });
      await a.focus(); await configure(page, { disableA: true });
      await expect(b).toBeFocused();
      await page.getByRole("button", { name: "Before", exact: true }).focus(); await page.keyboard.press("Tab");
      await expect(b).toBeFocused(); await page.keyboard.press("Tab"); await page.keyboard.press("Shift+Tab");
      await expect(b).toBeFocused(); await expect(page.getByTestId("events")).toHaveText("[]");
      await configure(page, { disableA: false, reverse: true }); await a.focus();
      await configure(page, { removeA: true }); await expect(b).toBeFocused();
      await configure(page, { allDisabled: true }); await expect(page.getByRole("radiogroup")).toBeFocused();
      await configure(page, { allDisabled: false });
      await page.getByRole("button", { name: "Before", exact: true }).focus(); await page.keyboard.press("Tab");
      await expect(b).toBeFocused();
      await configure(page, { loading: true }); await expect(page.getByRole("radiogroup")).toBeFocused();
      await configure(page, { loading: false, controlled: true, value: "missing" });
      await page.getByRole("button", { name: "Before", exact: true }).focus(); await page.keyboard.press("Tab");
      await expect(b).toBeFocused(); await expect(page.getByTestId("events")).toHaveText("[]");
    });
    test("6–9: resets restore defaults, respect cancellation and preserve controlled ownership", async ({ page }) => {
      await open(page, "forms");
      const form = page.getByTestId("contract-form");
      const initial = [["number", "2"], ["search", "original"], ["segment", "a"], ["multi", "a"]];
      for (let cycle = 0; cycle < 2; cycle++) {
        await page.getByRole("spinbutton").fill("7");
        await page.getByRole("searchbox").fill("edited");
        await page.getByRole("radio", { name: "Beta" }).click();
        await page.getByRole("button", { name: "Clear selected options" }).click();
        const events = await page.getByTestId("events").textContent();
        await configure(page, { preventReset: true });
        await page.getByRole("button", { name: "Reset", exact: true }).click();
        expect(await data(page)).toEqual([["number", "7"], ["search", "edited"], ["segment", "b"]]);
        await configure(page, { preventReset: false });
        if (cycle) await form.evaluate(node => (node as HTMLFormElement).reset());
        else await page.getByRole("button", { name: "Reset", exact: true }).click();
        await expect(page.getByRole("spinbutton")).toHaveValue("2");
        await expect(page.getByRole("searchbox")).toHaveValue("original");
        await expect(page.getByRole("radio", { name: "Alpha" })).toHaveAttribute("aria-checked", "true");
        expect(await data(page)).toEqual(initial);
        await expect(page.getByTestId("events")).toHaveText(events!);
      }
      await configure(page, { defaultValue: "b" }); await form.evaluate(node => (node as HTMLFormElement).reset());
      await expect(page.getByRole("radio", { name: "Beta" })).toHaveAttribute("aria-checked", "true");
      expect((await data(page)).filter(([name]) => name === "multi")).toEqual([["multi", "b"]]);
      await configure(page, { controlled: true, value: 8 });
      await form.evaluate(node => (node as HTMLFormElement).reset());
      await expect(page.getByRole("spinbutton")).toHaveValue("8"); await expect(page.getByRole("searchbox")).toHaveValue("8");
    });
    test("6,7,9: external form association and remount cleanup", async ({ page }) => {
      await open(page, "forms", { external: true });
      await page.getByRole("spinbutton").fill("7"); await page.getByRole("searchbox").fill("edited");
      await page.getByRole("button", { name: "Clear selected options" }).click();
      await page.getByTestId("contract-form").evaluate(node => (node as HTMLFormElement).reset());
      await expect(page.getByRole("spinbutton")).toHaveValue("2"); await expect(page.getByRole("searchbox")).toHaveValue("original");
      await expect.poll(() => data(page)).toEqual([["number", "2"], ["search", "original"], ["multi", "a"]]);
      await page.getByRole("button", { name: "Toggle mount" }).click();
      await page.getByRole("button", { name: "Toggle mount" }).click();
      await page.getByRole("searchbox").fill("again"); await page.getByRole("button", { name: "Reset", exact: true }).click();
      await expect(page.getByRole("searchbox")).toHaveValue("original");
    });
    test("10: custom step buttons match native keyboard steps and recover validity", async ({ page }) => {
      for (const config of [
        { defaultValue: 3, min: 0, max: 10, step: 2 },
        { defaultValue: 0.4, min: 0.1, max: 2, step: 0.2 },
        { defaultValue: "", min: 2, max: 10, step: 2 },
        { defaultValue: 0.15, min: 0, max: 0.3, step: 0.1 },
        { defaultValue: 3, step: 2 },
      ]) {
        for (const direction of ["Increase", "Decrease"]) {
          await open(page, "number", config);
          const input = page.getByRole("spinbutton");
          await input.focus(); await input.press(direction === "Increase" ? "ArrowUp" : "ArrowDown");
          const expected = await input.inputValue();
          await open(page, "number", config);
          await page.getByRole("button", { name: direction + " value" }).click();
          await expect(page.getByRole("spinbutton")).toHaveValue(expected);
          expect(await page.getByRole("spinbutton").evaluate(node => (node as HTMLInputElement).validity.valid)).toBe(true);
          expect(await data(page)).toEqual([["number", expected]]);
        }
      }
    });
    test("11,12: wildcard picker/drop validation and effective fieldset disabling", async ({ page }) => {
      await open(page, "files");
      const input = page.getByTestId("file-upload-input");
      await input.setInputFiles({ name: "photo.png", mimeType: "image/png", buffer: Buffer.from("hello") });
      expect(await input.evaluate(node => (node as HTMLInputElement).checkValidity())).toBe(true);
      await expect(page.getByTestId("events")).toHaveText('[["photo.png"]]');
      await configure(page, { fieldset: true }); await drop(page, "other.png");
      await page.getByTestId("file-upload-remove-0").dispatchEvent("click");
      await expect(page.getByTestId("events")).toHaveText('[["photo.png"]]');
      expect(await input.evaluate(node => (node as HTMLInputElement).files?.[0]?.name)).toBe("photo.png");
      await configure(page, { fieldset: false });
      for (const [wildcard, type, name] of [["audio/*", "audio/mpeg", "song.mp3"], ["video/*", "video/mp4", "movie.mp4"], [".PNG", "", "photo.png"]]) {
        await configure(page, { types: [wildcard] }); await drop(page, name, type);
        expect(await input.evaluate(node => (node as HTMLInputElement).files?.[0]?.name)).toBe(name);
        expect(await input.evaluate(node => (node as HTMLInputElement).checkValidity())).toBe(true);
      }
      await configure(page, { types: ["image/*"], maxSize: 1 }); await drop(page);
      expect(await input.evaluate(node => (node as HTMLInputElement).files?.length)).toBe(0);
      expect(await input.evaluate(node => (node as HTMLInputElement).checkValidity())).toBe(false);
      await configure(page, { maxSize: 100, fieldset: true, legend: true }); await drop(page);
      expect(await input.evaluate(node => (node as HTMLInputElement).files?.length)).toBe(1);
      await configure(page, { disabled: true }); const before = await page.getByTestId("events").textContent();
      await drop(page); await expect(page.getByTestId("events")).toHaveText(before!);
    });
    test("13: collapsed content stays mounted but leaves Tab and accessibility navigation", async ({ page }) => {
      await open(page, "accordion", { lazy: true });
      const header = page.getByTestId("accordion-accordion-toggle");
      await header.focus(); await page.keyboard.press("Tab");
      await expect(page.getByRole("button", { name: "Submit", exact: true })).toBeFocused();
      await header.click(); const inside = page.getByRole("button", { name: "Inside section" });
      await header.focus(); await page.keyboard.press("Tab"); await expect(inside).toBeFocused();
      await configure(page, { expanded: false }); await expect(header).toBeFocused();
      await expect(page.getByRole("region")).toHaveCount(0);
      expect(await page.locator("main").ariaSnapshot()).not.toContain("Inside section");
      await expect(page.getByTestId("accordion-content").locator("button")).toHaveCount(1);
      await page.keyboard.press("Tab"); await page.keyboard.press("Shift+Tab"); await expect(header).toBeFocused();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await configure(page, { expanded: true }); await inside.focus(); await expect(inside).toBeFocused();
      await configure(page, { expanded: false }); await expect(header).toBeFocused();
    });
    test("5: overlapping toast pause reasons preserve remaining time and replacement", async ({ page }) => {
      await open(page, "toast"); await freezeClock(page);
      await page.getByRole("button", { name: "Add toast" }).click();
      const toast = page.getByTestId("toast-provider-toast-sample");
      await page.clock.runFor(200);
      await toast.getByRole("button", { name: "Dismiss notification" }).focus();
      await toast.hover(); await page.mouse.move(0, 0); await page.clock.runFor(1000);
      await expect(toast).toBeVisible(); await expect(toast).not.toHaveAttribute("aria-hidden");
      await toast.getByRole("button", { name: "Toast action" }).focus(); await page.clock.runFor(1000);
      await expect(toast).not.toHaveAttribute("aria-hidden");
      await toast.hover(); await page.getByRole("button", { name: "After", exact: true }).focus();
      await page.clock.runFor(1000); await expect(toast).not.toHaveAttribute("aria-hidden");
      await page.evaluate(() => window.toastAction("add")); await page.clock.runFor(1000);
      await expect(toast).not.toHaveAttribute("aria-hidden");
      await page.mouse.move(0, 0); await page.clock.runFor(499); await expect(toast).not.toHaveAttribute("aria-hidden");
      await page.clock.runFor(2); await expect(toast).toHaveAttribute("aria-hidden", "true");
      await page.clock.runFor(160); await expect(toast).toHaveCount(0);
      await page.evaluate(() => window.toastAction("add")); await page.clock.runFor(200);
      await toast.getByRole("button", { name: "Toast action" }).focus(); await page.clock.runFor(1000);
      await page.getByRole("button", { name: "After", exact: true }).focus();
      await page.clock.runFor(299); await expect(toast).not.toHaveAttribute("aria-hidden");
      await page.clock.runFor(2); await expect(toast).toHaveAttribute("aria-hidden", "true");
    });
    test("5: visibility and cancelled swipe cannot clear another pause reason", async ({ page }) => {
      await open(page, "toast"); await freezeClock(page);
      await page.evaluate(() => window.toastAction("add"));
      const toast = page.getByTestId("toast-provider-toast-sample");
      await toast.getByRole("button", { name: "Toast action" }).focus();
      await page.evaluate(() => {
        Object.defineProperty(document, "hidden", { configurable: true, value: true });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await page.getByRole("button", { name: "After", exact: true }).focus();
      await page.clock.runFor(1000); await expect(toast).not.toHaveAttribute("aria-hidden");
      await toast.getByRole("button", { name: "Toast action" }).focus();
      await page.evaluate(() => {
        Object.defineProperty(document, "hidden", { configurable: true, value: false });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await toast.evaluate(node => {
        node.setPointerCapture = () => {};
        node.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, pointerType: "touch", clientX: 0 }));
        node.dispatchEvent(new PointerEvent("pointercancel", { bubbles: true, pointerId: 1, pointerType: "touch", clientX: 10 }));
      });
      await page.clock.runFor(1000); await expect(toast).not.toHaveAttribute("aria-hidden");
      await page.evaluate(() => window.toastAction("clear")); await page.clock.runFor(161); await expect(toast).toHaveCount(0);
      await page.evaluate(() => {
        Object.defineProperty(document, "hidden", { configurable: true, value: true });
        window.toastAction("add");
      });
      await page.evaluate(() => window.toastAction("persistent"));
      await page.evaluate(() => {
        Object.defineProperty(document, "hidden", { configurable: true, value: false });
        document.dispatchEvent(new Event("visibilitychange"));
      });
      await page.evaluate(() => window.toastAction("add"));
      await page.clock.runFor(501); await expect(toast).toHaveAttribute("aria-hidden", "true");
      await page.clock.runFor(161); await expect(toast).toHaveCount(0);
      await page.evaluate(() => window.toastAction("add"));
      await page.getByRole("button", { name: "Toggle mount" }).click(); await page.clock.runFor(1000);
      await expect(toast).toHaveCount(0);
    });
  });
}
