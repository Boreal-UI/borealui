"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./Portal.module.scss";
import PortalBase from "../PortalBase";
import { PortalProps } from "../Portal.types";

const Portal = forwardRef<HTMLDivElement, PortalProps>((props, ref) => (
  <PortalBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

Portal.displayName = "Portal";
export default Portal;
