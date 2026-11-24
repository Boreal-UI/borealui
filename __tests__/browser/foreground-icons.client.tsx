import { useState, type SVGProps } from "react";
import { createRoot } from "react-dom/client";
import Core from "../../src/core/MetricBox";
import Next from "../../src/next/MetricBox";
import Server from "../../src/next/server/MetricBox";
import { buildThemeVariables } from "../../src/context/themeRuntime";
import { defaultColorSchemes } from "../../src/styles/Themes";
import "../../src/styles/globals.scss";

function StatusIcon(props: SVGProps<SVGSVGElement>) {
  return <svg {...props} data-contrast-graphic="status" viewBox="0 0 16 16" width="24" height="24"><path fill="currentColor" d="M2 2h12v12H2z" /></svg>;
}
function Fixture() {
  const [state, setState] = useState<"success" | undefined>();
  const [loading, setLoading] = useState(false);
  const [light, setLight] = useState(false);
  Object.assign(window, { updateMetric: (semantic: boolean, busy: boolean, lightMode: boolean) => { setState(semantic ? "success" : undefined); setLoading(busy); setLight(lightMode); } });
  const base = defaultColorSchemes.find(s => s.name === "Forest Dusk")!;
  const vars = buildThemeVariables(light ? { ...base, name: "Light fixture", backgroundColor: "#ffffff", forceTextColor: undefined } : base);
  return <main style={{ ...vars, color: "var(--text-color)", background: "var(--background-color)", padding: 20 }}>
    {([Core, Next, Server] as const).map((MetricBox, index) => <MetricBox key={index} testId={`icon-metric-${index}`} theme="tertiary" state={state} loading={loading} title="API uptime" value="99.98%" subtext="Healthy" icon={StatusIcon} decorativeIcon={false} iconAriaLabel="Service status" />)}
  </main>;
}
createRoot(document.getElementById("root")!).render(<Fixture />);
