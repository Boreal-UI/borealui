import * as Next from "@/index.next";
import {
  runComponentAccessibilityTests,
  runComponentSmokeTests,
  runComponentThemedAccessibilityTests,
} from "./component-mount-cases";

runComponentSmokeTests("next", Next);
runComponentAccessibilityTests("next", Next);
runComponentThemedAccessibilityTests("next", Next);
