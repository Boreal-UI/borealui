import { Typography, Badge, Alert, MetricBox } from "../../src/index.next";
import { ForegroundExamples } from "../../shared-story-assets/ForegroundExamples";

export default { title: "Compositions/Foreground", component: ForegroundExamples };
export const SemanticSurfaces = { render: () => <ForegroundExamples {...{ Typography, Badge, Alert, MetricBox }} /> };
