import * as Core from "@/index.core";
import {
  runComponentAccessibilityTests,
  runComponentSmokeTests,
  runComponentThemedAccessibilityTests,
} from "./component-mount-cases";

runComponentSmokeTests("core", Core);
runComponentAccessibilityTests("core", Core);
runComponentThemedAccessibilityTests("core", Core);
