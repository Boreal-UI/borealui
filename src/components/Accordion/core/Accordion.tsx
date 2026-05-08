import React from "react";
import "./Accordion.scss";
import { AccordionBase } from "../AccordionBase";
import type { AccordionProps } from "../Accordion.types";

const classes = {
  accordion: "accordion",
  header: "accordion_header",
  content: "accordion_content",
  icon: "accordion_icon",
  accordionTitle: "accordion_title",

  shadowNone: "accordion_shadow-None",
  shadowLight: "accordion_shadow-Light",
  shadowMedium: "accordion_shadow-Medium",
  shadowStrong: "accordion_shadow-Strong",
  shadowIntense: "accordion_shadow-Intense",

  roundNone: "accordion_round-None",
  roundSmall: "accordion_round-Small",
  roundMedium: "accordion_round-Medium",
  roundLarge: "accordion_round-Large",

  disabled: "accordion_disabled",
  expanded: "accordion_expanded",

  primary: "accordion_primary",
  secondary: "accordion_secondary",

  tertiary: "accordion_tertiary",
  quaternary: "accordion_quaternary",

  success: "accordion_success",
  error: "accordion_error",
  warning: "accordion_warning",
  clear: "accordion_clear",
  outline: "accordion_outline",
  glass: "accordion_glass",

  xs: "accordion_xs",
  small: "accordion_small",
  medium: "accordion_medium",
  large: "accordion_large",
  xl: "accordion_xl",
};

const generateUniqueId = (() => {
  let counter = 0;
  return () => `accordion-core-${counter++}`;
})();

const Accordion: React.FC<AccordionProps> = (props) => (
  <AccordionBase {...props} getUniqueId={generateUniqueId} classMap={classes} />
);
Accordion.displayName = "Accordion";
export default Accordion;
