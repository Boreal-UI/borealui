"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import { AccordionBase } from "../AccordionBase";
import type { AccordionProps } from "../Accordion.types";
import styles from "./Accordion.module.scss";

const Accordion: React.FC<AccordionProps> = (props) => (
  <AccordionBase {...props} classMap={expandClassMap(styles)} />
);
Accordion.displayName = "Accordion";
export default Accordion;
