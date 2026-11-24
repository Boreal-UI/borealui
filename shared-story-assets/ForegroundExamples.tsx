import type { ComponentType } from "react";
import type { TypographyProps } from "../src/components/Typography/Typography.types";
import type { BadgeProps } from "../src/components/Badge/Badge.types";
import type { AlertProps } from "../src/components/Alert/Alert.types";
import type { MetricBoxProps } from "../src/components/MetricBox/MetricBox.types";

export function ForegroundExamples({ Typography, Badge, Alert, MetricBox }: {
  Typography: ComponentType<TypographyProps>;
  Badge: ComponentType<BadgeProps>;
  Alert: ComponentType<AlertProps>;
  MetricBox: ComponentType<MetricBoxProps>;
}) {
  return <div data-testid="foreground-examples" style={{ display: "grid", gap: 16 }}>
    <Badge state="success" size="small" rounding="none">
      <Typography as="span" textStyle="caption" weight="bold" theme="inherit">Essential</Typography>
    </Badge>
    <Alert state="warning" variant="soft" title="Usage review needed">
      Three accounts are trending above their contracted limits.
    </Alert>
    <MetricBox title="API uptime" value="99.98%" subtext="Overview monitors healthy" theme="tertiary" state="success" align="start" />
  </div>;
}
