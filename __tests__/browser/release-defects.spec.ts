import { test, expect } from "@playwright/test";

for (const variant of ["core", "next"]) {
  const url = (extra = "") => `/__tests__/browser/index.html?mode=release-defects&variant=${variant}${extra}`;
  test(`${variant}: required selection, bytes, append, removal, reset and callback`, async ({ page }) => {
    await page.goto(url("&multiple"));
    const input = page.getByTestId("file-upload-input");
    const valid = () => page.getByTestId("form").evaluate((form: HTMLFormElement) => form.checkValidity());
    expect(await valid()).toBe(false);
    await input.setInputFiles({ name: "one.txt", mimeType: "text/plain", buffer: Buffer.from("first bytes") });
    expect(await valid()).toBe(true);
    // Real picker activation must permit choosing the same file again.
    const chooserPromise = page.waitForEvent("filechooser");
    await page.getByTestId("file-upload-file-button").click();
    const chooser = await chooserPromise;
    expect(await valid()).toBe(true);
    expect(await input.evaluate((node: HTMLInputElement) => node.files?.[0].name)).toBe("one.txt");
    await chooser.setFiles({ name: "one.txt", mimeType: "text/plain", buffer: Buffer.from("first bytes") });
    await expect(page.getByTestId("selection")).toHaveText("one.txt,one.txt");
    await page.getByTestId("file-upload-remove-0").click();
    await input.setInputFiles({ name: "two.txt", mimeType: "text/plain", buffer: Buffer.from("second bytes") });
    expect(await page.getByTestId("form").evaluate(async (form: HTMLFormElement) => Promise.all(
      new FormData(form).getAll("document").map(async file => ({name: (file as File).name, text: await (file as File).text()}))
    ))).toEqual([{name:"one.txt",text:"first bytes"},{name:"two.txt",text:"second bytes"}]);
    await page.getByTestId("file-upload-upload-button").click();
    await expect(page.getByTestId("uploaded")).toHaveText("one.txt,two.txt");
    await expect(page.getByTestId("file-upload-remove-0")).toBeEnabled();
    await page.getByTestId("file-upload-remove-0").click();
    await expect(page.getByTestId("selection")).toHaveText("two.txt");
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await expect(page.getByTestId("selection")).toHaveText("");
    expect(await valid()).toBe(false);
    expect(await input.evaluate((node: HTMLInputElement) => node.files?.length)).toBe(0);
  });

  test(`${variant}: disabled selection and payload are empty`, async ({ page }) => {
    await page.goto(url("&disabled"));
    await expect(page.getByTestId("file-upload-input")).toBeDisabled();
    const data = await page.evaluateHandle(() => {
      const transfer = new DataTransfer(); transfer.items.add(new File(["x"], "x.txt")); return transfer;
    });
    await page.getByTestId("file-upload-wrapper").dispatchEvent("drop", {dataTransfer:data});
    await expect(page.getByTestId("selection")).toHaveText("");
    expect(await page.getByTestId("form").evaluate((form: HTMLFormElement) => new FormData(form).has("document"))).toBe(false);
  });

  test(`${variant}: multiple-file drop appends and uploads the same selection`, async ({ page }) => {
    await page.goto(url("&multiple"));
    const data = await page.evaluateHandle(() => {
      const transfer = new DataTransfer();
      transfer.items.add(new File(["x"], "x.txt")); transfer.items.add(new File(["y"], "y.txt")); return transfer;
    });
    await page.getByTestId("file-upload-wrapper").dispatchEvent("drop", {dataTransfer:data});
    await expect(page.getByTestId("selection")).toHaveText("x.txt,y.txt");
    await page.getByTestId("file-upload-upload-button").click();
    await expect(page.getByTestId("uploaded")).toHaveText("x.txt,y.txt");
  });

  test(`${variant}: drop single-file policy and native form agree`, async ({ page }) => {
    await page.goto(url());
    const transfer = await page.evaluateHandle(() => {
      const data = new DataTransfer();
      data.items.add(new File(["one"], "one.txt", {type:"text/plain"}));
      data.items.add(new File(["two"], "two.txt", {type:"text/plain"}));
      data.items.add(new File(["image"], "bad.png", {type:"image/png"}));
      return data;
    });
    await page.getByTestId("file-upload-wrapper").dispatchEvent("drop", {dataTransfer:transfer});
    await expect(page.getByTestId("selection")).toHaveText("one.txt");
    await expect(page.getByTestId("file-upload-rejected-files")).toContainText("bad.png");
    await expect(page.getByTestId("file-upload-upload-message")).toContainText("2 files were rejected");
    await expect(page.getByTestId("file-upload-rejected-files")).toContainText("two.txt");
    expect(await page.getByTestId("form").evaluate((form: HTMLFormElement) => (new FormData(form).get("document") as File).name)).toBe("one.txt");
    await page.getByTestId("file-upload-input").setInputFiles({name:"replacement.txt",mimeType:"text/plain",buffer:Buffer.from("new")});
    await expect(page.getByTestId("selection")).toHaveText("replacement.txt");
    await page.getByTestId("file-upload-remove-0").click();
    expect(await page.getByTestId("form").evaluate((form: HTMLFormElement) => form.checkValidity())).toBe(false);
  });

  test(`${variant}: controlled explicit RTL and static geometry`, async ({ page }) => {
    await page.goto(url("&explicit&controlled"));
    const separator = page.getByRole("separator");
    await separator.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(separator).toHaveAttribute("aria-valuenow", "55");
    await expect(page.getByTestId("size")).toHaveText("55");
    const rect = (await separator.boundingBox())!;
    await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);
    await page.mouse.down();
    await expect(separator).toHaveAttribute("aria-valuenow", "55");
    await page.mouse.up();
    for (const flag of ["static", "disabled"]) {
      await page.goto(url(`&${flag}`));
      await expect(separator).toHaveAttribute("aria-disabled", "true");
      await separator.dispatchEvent("keydown", {key:"End"});
      await expect(separator).toHaveAttribute("aria-valuenow", "50");
    }
  });

  for (const unmount of [false, true]) test(`${variant}: tooltip Escape visual state (${unmount})`, async ({ page }) => {
    await page.goto(url(unmount ? "&unmount" : ""));
    const trigger = page.getByTestId("tooltip-trigger");
    const tip = page.getByTestId("tooltip");
    await trigger.hover();
    await expect(tip).toHaveCSS("opacity", "1");
    await page.keyboard.press("Escape");
    if (unmount) await expect(tip).toHaveCount(0);
    else { await expect(tip).toHaveAttribute("aria-hidden", "true"); await expect(tip).toHaveCSS("visibility", "hidden"); }
    await page.mouse.move(0, 0);
    await trigger.hover();
    await expect(tip).toHaveCSS("opacity", "1");
    await tip.hover();
    await expect(tip).toHaveAttribute("aria-hidden", "false");
    await page.keyboard.press("Escape");
    if (unmount) await expect(tip).toHaveCount(0);
    else await expect(tip).toHaveCSS("visibility", "hidden");
    await trigger.focus();
    await page.mouse.move(0, 0);
    await expect(tip).toHaveAttribute("aria-hidden", "false");
    await expect(trigger).toHaveAttribute("aria-describedby", /help .+/);
    await trigger.evaluate((node: HTMLElement) => node.blur());
    if (unmount) await expect(tip).toHaveCount(0);
    else await expect(tip).toHaveCSS("visibility", "hidden");
    await trigger.focus();
    await expect(tip).toHaveCSS("opacity", "1");
  });

  for (const rtl of [false, true]) for (const vertical of [false, true]) test(`${variant}: split geometry rtl=${rtl} vertical=${vertical}`, async ({ page }) => {
    await page.goto(url(`${rtl ? "&rtl" : ""}${vertical ? "&vertical" : ""}`));
    const root = page.getByTestId("split-pane");
    const separator = page.getByRole("separator");
    const rect = (await root.boundingBox())!;
    for (const fraction of [0.25, 0.7, 0.4]) {
      await root.evaluate(async node => {
        await Promise.all(node.getAnimations({subtree:true}).map(animation => animation.finished.catch(() => {})));
      });
      const initial = (await separator.boundingBox())!;
      await page.mouse.move(initial.x + initial.width / 2, initial.y + initial.height / 2);
      await page.mouse.down();
      const x = vertical ? initial.x + initial.width / 2 : rect.x + rect.width * (rtl ? 1-fraction : fraction);
      const y = vertical ? rect.y + rect.height*fraction : initial.y + initial.height / 2;
      await page.mouse.move(x, y);
      await page.mouse.up();
      await expect(separator).toHaveAttribute("aria-valuenow", String(fraction*100));
      await expect.poll(async () => {
        const result = (await separator.boundingBox())!;
        return Math.abs((vertical ? result.y : result.x) - (vertical ? y : x));
      }).toBeLessThan(8);
    }
    await separator.focus();
    await page.keyboard.press("Home"); await expect(separator).toHaveAttribute("aria-valuenow", "10");
    await page.keyboard.press("End"); await expect(separator).toHaveAttribute("aria-valuenow", "90");
    await page.keyboard.press(vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft");
    await expect(separator).toHaveAttribute("aria-valuenow", "85");
  });
}
