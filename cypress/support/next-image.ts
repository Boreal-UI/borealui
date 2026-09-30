import type { ElementType } from "react";
import * as NextImageModule from "next/dist/shared/lib/image-external";

const moduleDefault = NextImageModule.default as unknown;

// Cypress/Vite exposes Next 16's CommonJS image entrypoint as a nested default.
const NextImage = (
  moduleDefault &&
  typeof moduleDefault === "object" &&
  "default" in moduleDefault
    ? moduleDefault.default
    : moduleDefault
) as ElementType;

export default NextImage;
