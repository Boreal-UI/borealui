import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./Portal.scss";
import PortalBase from "../PortalBase";
import { PortalProps } from "../Portal.types";

const classes = {
  root: "portal",
};

const Portal = forwardRef<HTMLDivElement, PortalProps>((props, ref) => (
  <PortalBase {...props} ref={ref} classMap={expandClassMap(classes)} />
));

Portal.displayName = "Portal";
export default Portal;
