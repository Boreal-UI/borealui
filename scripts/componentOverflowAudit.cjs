#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");

const DEFAULT_WIDTHS = [900, 600, 420, 320];
const DEFAULT_ROUTES = [
  "accordion", "alert", "appshell", "avatar", "badge", "barchart",
  "bentobox", "breadcrumbpageheader", "breadcrumbs", "button", "card",
  "checkbox", "chip", "chipgroup", "circularprogress", "colorpicker",
  "combobox", "container", "commandpalette", "datatable", "datepicker",
  "daterangepicker", "datetimepicker", "divider", "donutchart", "drawer",
  "dropdown", "emptystate", "fieldset", "fileupload", "footer", "formfield",
  "formgroup", "grid", "iconbutton", "inputgroup", "inline", "legend",
  "linechart", "markdownrenderer", "menu", "messagepopup", "metricbox",
  "modal", "multiselect", "navbar", "notificationcenter", "numberinput",
  "pageheader", "pager", "popover", "portal", "progressbar", "radiobutton",
  "radiogroup", "rating", "scrolltotop", "searchinput", "segmentedcontrol",
  "section", "select", "sidebar", "skeleton", "slider", "sparkline",
  "spinner", "splitpane", "stack", "stepper", "tabs", "taginput",
  "textarea", "textinput", "themeselect", "timeline", "timepicker", "toast",
  "toggle", "toolbar", "tooltip", "treeview", "typography",
  "validationsummary",
];

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000",
    output: "output/playwright/component-overflow-audit.json",
    historical: null,
    playwrightRoot: process.cwd(),
    widths: DEFAULT_WIDTHS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    const next = argv[index + 1];
    if (value === "--base-url") args.baseUrl = next;
    else if (value === "--output") args.output = next;
    else if (value === "--historical") args.historical = next;
    else if (value === "--playwright-root") args.playwrightRoot = next;
    else if (value === "--widths") {
      args.widths = next.split(",").map(Number).filter(Number.isFinite);
    } else continue;
    index += 1;
  }

  return args;
}

function loadPlaywright(playwrightRoot) {
  try {
    return require("playwright");
  } catch {
    const rootRequire = createRequire(path.resolve(playwrightRoot, "package.json"));
    return rootRequire("playwright");
  }
}

function loadHistorical(filePath) {
  if (!filePath) return null;
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function historicalRoutes(report) {
  if (!report) return DEFAULT_ROUTES;
  const routes = [...new Set(report.rows.map((row) => row.slug))];
  if (routes.length !== report.routes) {
    throw new Error(
      `Historical route count mismatch: declared ${report.routes}, found ${routes.length}`,
    );
  }
  return routes;
}

function summarize(rows) {
  return rows.flatMap((row) => {
    const failures = row.examples.filter((example) => example.overflow);
    return failures.length
      ? [{ slug: row.slug, width: row.width, count: row.examples.length, failures }]
      : [];
  });
}

async function measureExample(page, index) {
  return page.evaluate(async (exampleIndex) => {
    const previews = Array.from(
      document.querySelectorAll('[class*="examplePreview"]'),
    );
    const preview = previews[exampleIndex];
    if (!preview) return null;

    const host = document.createElement("div");
    host.dataset.borealOverflowAuditHost = "true";
    Object.assign(host.style, {
      position: "absolute",
      insetInline: "10px",
      top: "0",
      boxSizing: "border-box",
      minWidth: "0",
      maxWidth: "calc(100vw - 20px)",
      overflow: "visible",
      visibility: "hidden",
    });
    document.body.append(host);
    host.append(preview.cloneNode(true));

    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const tolerance = 1;
    const hostRect = host.getBoundingClientRect();
    const describe = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        cls: typeof element.className === "string" ? element.className : "",
        role: element.getAttribute("role"),
        width: Math.round(rect.width),
        leftBy: Math.round(hostRect.left - rect.left),
        rightBy: Math.round(rect.right - hostRect.right),
        overflowX: style.overflowX,
        position: style.position,
        whiteSpace: style.whiteSpace,
      };
    };

    const isScrollable = (element) => {
      const style = getComputedStyle(element);
      return /^(auto|scroll)$/.test(style.overflowX) &&
        element.scrollWidth > element.clientWidth + tolerance;
    };

    const overlayRoot = (element) => {
      let current = element;
      while (current && current !== host) {
        const style = getComputedStyle(current);
        if (["absolute", "fixed"].includes(style.position)) return current;
        if (
          current.matches?.(
            '[popover]:popover-open, [data-radix-popper-content-wrapper], [data-floating-ui-portal]',
          )
        ) return current;
        current = current.parentElement;
      }
      return null;
    };

    const containedByScroller = (element) => {
      let current = element.parentElement;
      while (current && current !== host) {
        if (isScrollable(current)) {
          const rect = current.getBoundingClientRect();
          if (
            rect.left >= hostRect.left - tolerance &&
            rect.right <= hostRect.right + tolerance
          ) return current;
        }
        current = current.parentElement;
      }
      return null;
    };

    const candidates = Array.from(host.querySelectorAll("*"));
    const crossing = candidates.filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.left < hostRect.left - tolerance || rect.right > hostRect.right + tolerance;
    });

    const ignored = [];
    const actionable = [];
    const ignoredRoots = new Set();
    for (const element of crossing) {
      const overlay = overlayRoot(element);
      const scroller = containedByScroller(element);
      if (overlay || scroller) {
        const reason = overlay ? "fixed-or-overlay" : "intentional-local-scroll";
        ignored.push({ ...describe(element), reason });
        if (overlay) ignoredRoots.add(overlay);
      } else {
        actionable.push(describe(element));
      }
    }

    const clientWidth = host.clientWidth;
    const scrollWidth = host.scrollWidth;
    const hidden = [];
    for (const root of ignoredRoots) {
      hidden.push([root, root.style.display]);
      root.style.display = "none";
    }
    const effectiveScrollWidth = host.scrollWidth;
    for (const [root, display] of hidden) root.style.display = display;

    const result = {
      index: exampleIndex,
      heading: `Example ${exampleIndex + 1}`,
      clientWidth,
      scrollWidth,
      overflow:
        effectiveScrollWidth > clientWidth + tolerance && actionable.length > 0,
      offenders: actionable.slice(0, 8),
      ...(ignored.length ? { ignoredOffenders: ignored.slice(0, 8) } : {}),
    };
    host.remove();
    return result;
  }, index);
}

async function audit({ baseUrl, routes, widths, playwright }) {
  const consoleErrors = [];
  const rows = [];
  const browser = await playwright.chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: widths[0], height: 900 },
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push({ url: page.url(), text: message.text() });
      }
    });
    page.on("pageerror", (error) => {
      consoleErrors.push({ url: page.url(), text: error.toString() });
    });

    for (const slug of routes) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const url = `${baseUrl.replace(/\/$/, "")}/docs/components/${slug}`;
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
        await page.locator('[class*="examplePreview"]').first().waitFor({
          state: "attached",
          timeout: 30_000,
        });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        });
        const exampleCount = await page.locator('[class*="examplePreview"]').count();
        const examples = [];
        for (let index = 0; index < exampleCount; index += 1) {
          const result = await measureExample(page, index);
          if (result) examples.push(result);
        }
        rows.push({ slug, width, examples });
        process.stdout.write(
          `${slug.padEnd(24)} ${String(width).padStart(3)}px  ${examples.filter((item) => item.overflow).length}/${examples.length}\n`,
        );
      }
    }
    await context.close();
  } finally {
    await browser.close();
  }

  return {
    generatedAt: new Date().toISOString(),
    routes: routes.length,
    rows,
    summary: summarize(rows),
    consoleErrors,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const historical = loadHistorical(args.historical);
  const routes = historicalRoutes(historical);
  const playwright = loadPlaywright(args.playwrightRoot);
  const report = await audit({ ...args, routes, playwright });
  const outputPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  const failures = report.summary.reduce(
    (total, row) => total + row.failures.length,
    0,
  );
  console.log(`Wrote ${outputPath}`);
  console.log(`${report.routes} routes, ${report.rows.length} rows, ${failures} overflows`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
