import React, { useState } from "react";
import { defaultColorSchemes } from "../../src/styles/Themes";
import { buildThemeVariables } from "../../src/context/themeRuntime";
import { ForegroundExamples } from "../../shared-story-assets/ForegroundExamples";
import CoreTypography from "../../src/core/Typography";
import CoreBadge from "../../src/core/Badge";
import CoreAlert from "../../src/core/Alert";
import CoreMetricBox from "../../src/core/MetricBox";
import CoreButton from "../../src/core/Button";
import NextTypography from "../../src/next/Typography";
import NextBadge from "../../src/next/Badge";
import NextAlert from "../../src/next/Alert";
import NextMetricBox from "../../src/next/MetricBox";
import NextButton from "../../src/next/Button";
import ServerTypography from "../../src/next/server/Typography";
import ServerBadge from "../../src/next/server/Badge";
import ServerAlert from "../../src/next/server/Alert";
import ServerMetricBox from "../../src/next/server/MetricBox";

export function ForegroundFixture({ entry = "core" }: { entry?: string }) {
  const [scheme, setScheme] = useState(0);
  const [state, setState] = useState<"success" | undefined>();
  const [loading, setLoading] = useState(false);
  const Typography = entry === "core" ? CoreTypography : entry === "server" ? ServerTypography : NextTypography;
  const Badge = entry === "core" ? CoreBadge : entry === "server" ? ServerBadge : NextBadge;
  const Alert = entry === "core" ? CoreAlert : entry === "server" ? ServerAlert : NextAlert;
  const MetricBox = entry === "core" ? CoreMetricBox : entry === "server" ? ServerMetricBox : NextMetricBox;
  const Button = entry === "core" ? CoreButton : NextButton;
  if (typeof window !== "undefined") Object.assign(window, { themes: defaultColorSchemes.map(s => s.name), selectTheme: setScheme, semantic: () => setState("success"), setLoading });
  return <main style={{ ...buildThemeVariables(defaultColorSchemes[scheme]), background: "var(--background-color)", color: "var(--text-color)", padding: 24 }}>
    <h1>Foreground fixtures</h1>
    <ForegroundExamples {...{ Typography, Badge, Alert, MetricBox }} />
    <div style={{ color: "#123456", background: "#ffffff" }} data-testid="parent">
      <Typography testId="inherited">Inherited text <Typography as="span">Nested text</Typography></Typography>
      <Typography as="a" testId="inherited-link">Inherited link</Typography>
      <Typography theme="warning" testId="explicit">Explicit theme</Typography>
    </div>
    <Button state="success"><Typography as="span">Button label</Typography></Button>
    <MetricBox testId="changing" theme="tertiary" state={state} loading={loading} title="Changing" value="99.98%" subtext="Healthy" />
    {["background-color", "background-color-surface", "background-color-subtle", "hover-background", "active-background", "selected-background"].map(surface => <section key={surface} data-surface={surface} style={{ background: `var(--${surface})`, padding: 8 }}>
      {(["primary", "secondary", "tertiary", "quaternary", "clear"] as const).map(theme => <div key={theme} data-theme={theme}>
        {([undefined, "success", "warning", "error", "info"] as const).map(state => <div key={state ?? "neutral"} data-state={state ?? "neutral"}>
          {(["solid", "soft", "outline", "glass", "glassOutline"] as const).map(variant => <div key={variant} data-variant={variant}>
            <Alert theme={theme} state={state} variant={variant} title="Review" dismissible={entry !== "server"} icon={<span>!</span>} actions={<a href="#details">Details</a>}>
              <Typography as="span">Message</Typography>
            </Alert>
            {variant !== "soft" && <MetricBox theme={theme} state={state} variant={variant} title="Uptime" value="99.98%" subtext="Healthy" />}
          </div>)}
        </div>)}
      </div>)}
    </section>)}
  </main>;
}
