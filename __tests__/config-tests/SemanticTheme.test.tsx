import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { useContext } from "react";
import { defaultColorSchemes } from "@/styles/Themes";
import { buildThemeVariables, contrastRatio, getThemeAttributes, getThemeContrastIssues, resolveThemeScheme } from "@/context/themeRuntime";
import ThemeProvider, { ThemeContext } from "@/context/ThemeContext";
import Portal from "@/components/Portal/core/Portal";
import { usePortalHost } from "@/hooks/usePortalHost";
import { SEMANTIC_THEME_TOKENS } from "@/utils/colorSchemeSecurity";
import type { ColorScheme } from "@/types/types";

const light: ColorScheme = { name: "Local light", primaryColor: "#246544", secondaryColor: "#f0c980", tertiaryColor: "#c9ab89", quaternaryColor: "#243b31", backgroundColor: "#ffffff", semanticTokens: { "--background-color-surface": "#f4f6f4", "--text-color-light": "#444444", "--border-color": "#666666", "--focus-outline-color": "#123b2a" } };
const dark: ColorScheme = { ...light, name: "Local dark", backgroundColor: "#14251c", semanticTokens: undefined };
const schemes = [light, dark];

it.each([...defaultColorSchemes])("$name resolves readable semantic combinations deterministically", (scheme) => {
  const vars = buildThemeVariables(scheme);
  expect(getThemeContrastIssues(scheme)).toEqual([]);
  expect(buildThemeVariables(JSON.parse(JSON.stringify(scheme)) as ColorScheme)).toEqual(vars);
  for (const name of ["primary", "secondary", "tertiary", "quaternary", "clear", "success", "warning", "error", "info"]) {
    for (const suffix of ["", "-hover"]) {
      const [r, g, b, alpha] = vars[`--${name}-readable-glass-background${suffix}`].match(/[\d.]+/g)!.map(Number);
      for (const surface of ["--background-color", "--background-color-surface", "--background-color-subtle", "--hover-background", "--active-background", "--selected-background"]) {
        const composite = `#${[r, g, b].map((v, i) => Math.round(v * alpha + parseInt(vars[surface].slice(1 + i * 2, 3 + i * 2), 16) * (1 - alpha)).toString(16).padStart(2, "0")).join("")}`;
        expect(contrastRatio(composite, vars["--text-color"])).toBeGreaterThanOrEqual(4.5);
      }
    }
  }
  for (const token of SEMANTIC_THEME_TOKENS) expect(vars[token]).toMatch(/^#(?:[0-9a-f]{6}|[0-9a-f]{6}ff)$/i);
  for (const surface of ["--background-color", "--background-color-surface", "--background-color-subtle", "--hover-background", "--active-background", "--selected-background"]) {
    expect(contrastRatio(vars[surface], vars["--text-color"])).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(vars[surface], vars["--text-color-light"])).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(vars[surface], vars["--focus-outline-color"])).toBeGreaterThanOrEqual(3);
  }
  expect(contrastRatio(vars["--disabled-background"], vars["--disabled-text-color"])).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio(vars["--background-color"], vars["--border-color"])).toBeGreaterThanOrEqual(3);
  for (const state of ["success", "warning", "error", "info"]) {
    for (const background of [`--${state}-color`, `--${state}-color-hover`]) {
      expect(contrastRatio(vars[background], vars[`--${state}-text-color`])).toBeGreaterThanOrEqual(4.5);
    }
  }
  for (const brand of ["primary", "secondary", "tertiary", "quaternary"]) {
    for (const suffix of ["", "-light", "-hover"]) {
      expect(contrastRatio(vars[`--${brand}-color${suffix}`], vars[`--text-color-${brand}`])).toBeGreaterThanOrEqual(4.5);
    }
  }
});

it("keeps palette-only themes compatible and gives explicit roles precedence", () => {
  const vars = buildThemeVariables(light);
  expect(vars["--background-color-surface"]).toBe("#f4f6f4");
  expect(vars["--focus-outline-color"]).toBe("#123b2a");
  expect(buildThemeVariables(dark)["--primary-color"]).toBe(dark.primaryColor);
  expect(() => buildThemeVariables({ ...dark, backgroundColor: "#123f" })).not.toThrow();
  expect(() => buildThemeVariables({ ...light, semanticTokens: { "--text-color": "url(unsafe)" } })).toThrow();
  expect(getThemeContrastIssues({ ...light, semanticTokens: { "--text-color": "#ffffff" } }).length).toBeGreaterThan(0);
});

it("resolves missing/unknown request preferences without sharing mutable request state", () => {
  const options = { customSchemes: schemes, useOnlyCustomSchemes: true, fallbackSchemeName: light.name };
  expect(resolveThemeScheme(undefined, options)).toBe(light);
  expect(resolveThemeScheme("removed theme", options)).toBe(light);
  const first = getThemeAttributes(resolveThemeScheme(dark.name, options));
  const second = getThemeAttributes(resolveThemeScheme(light.name, options));
  expect(first["data-boreal-theme"]).toBe(dark.name);
  expect(second["data-boreal-theme"]).toBe(light.name);
  expect(first.style["--background-color"]).not.toBe(second.style["--background-color"]);
});

function ChangeTheme() {
  const theme = useContext(ThemeContext)!;
  return <button onClick={() => theme.setSelectedSchemeName(dark.name)}>Change local theme</button>;
}
function Hosted() {
  const host = usePortalHost("shared-theme-host");
  return host ? createPortal(<span>Hosted overlay</span>, host) : null;
}

it("carries separate scopes through shared hosts, nested portals and explicit containers without touching the document", async () => {
  const original = document.documentElement.getAttribute("style");
  const target = document.createElement("div"); target.id = "explicit-target"; document.body.append(target);
  const view = render(<>
    <ThemeProvider scope="local" customSchemes={schemes} useOnlyCustomSchemes initialSchemeName={light.name}>
      <ChangeTheme /><Hosted />
      <Portal container="#explicit-target"><span>Explicit portal</span><Portal><span>Nested portal</span></Portal></Portal>
    </ThemeProvider>
    <ThemeProvider scope="local" customSchemes={schemes} useOnlyCustomSchemes initialSchemeName={light.name}>
      <Portal><span>Independent region</span></Portal>
    </ThemeProvider>
  </>);
  await screen.findByText("Hosted overlay");
  expect(screen.getByText("Hosted overlay").parentElement).toHaveAttribute("data-boreal-theme", light.name);
  expect(target).toContainElement(screen.getByText("Explicit portal"));
  const nested = await screen.findByText("Nested portal");
  expect(nested.parentElement?.style.getPropertyValue("--background-color-surface")).toBe("#f4f6f4");
  fireEvent.click(screen.getByText("Change local theme"));
  await waitFor(() => expect(nested.parentElement).toHaveAttribute("data-boreal-theme", dark.name));
  expect(screen.getByText("Hosted overlay").parentElement).toHaveAttribute("data-boreal-theme", dark.name);
  expect(screen.getByText("Independent region").parentElement).toHaveAttribute("data-boreal-theme", light.name);
  expect(document.documentElement.getAttribute("style")).toBe(original);
  view.unmount();
  expect(document.getElementById("shared-theme-host")).toBeNull();
  expect(target.children).toHaveLength(0); target.remove();
});

it("renders a local custom theme before hydration and retains identical attributes", async () => {
  const ui = <ThemeProvider scope="local" customSchemes={schemes} useOnlyCustomSchemes initialSchemeName={light.name}><p>Server content</p></ThemeProvider>;
  const host = document.createElement("div"); host.innerHTML = renderToString(ui); document.body.append(host);
  const scope = host.querySelector("[data-boreal-theme]")!;
  expect(scope).toHaveAttribute("data-boreal-theme", light.name);
  const style = scope.getAttribute("style");
  const onRecoverableError = jest.fn(); let root: ReturnType<typeof hydrateRoot>;
  await act(async () => { root = hydrateRoot(host, ui, { onRecoverableError }); await Promise.resolve(); });
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(scope.getAttribute("style")).toBe(style);
  act(() => root!.unmount()); host.remove();
});
