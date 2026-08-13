import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import "./Accordion.scss";
import { AccordionBase } from "../AccordionBase";
import type { AccordionProps } from "../Accordion.types";

const classes = {
  accordion: "accordion",
  header: "accordion_header",
  content: "accordion_content",
  contentInner: "accordion_contentInner",
  loading: "accordion_loading",
  icon: "accordion_icon",
  iconLeft: "accordion_iconLeft",
  iconRight: "accordion_iconRight",
  title: "accordion_title",

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
  info: "accordion_info",
  error: "accordion_error",
  warning: "accordion_warning",
  clear: "accordion_clear",

  xs: "accordion_xs",
  small: "accordion_small",
  medium: "accordion_medium",
  large: "accordion_large",
  xl: "accordion_xl",
  glass: "accordion_glass",
  outline: "accordion_outline",
};

const generateUniqueId = (() => {
  let counter = 0;
  return () => `accordion-core-${counter++}`;
})();

const Accordion: React.FC<AccordionProps> = (props) => (
  <AccordionBase
    {...props}
    getUniqueId={generateUniqueId}
    classMap={expandClassMap(classes)}
  />
);
Accordion.displayName = "Accordion";
export default Accordion;
