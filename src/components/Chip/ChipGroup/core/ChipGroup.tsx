import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import ChipGroupBase from "../ChipGroupBase";
import Chip from "../../core/Chip";
import "./ChipGroup.scss";
import { ChipGroupProps, ChipGroupRef } from "../ChipGroup.types";

const classMap = {
  container: "chip_group",
  list: "chip_group_list",
  topCenter: "chip_group_topCenter",
  bottomCenter: "chip_group_bottomCenter",
  topLeft: "chip_group_topLeft",
  topRight: "chip_group_topRight",
  bottomLeft: "chip_group_bottomLeft",
  bottomRight: "chip_group_bottomRight",
};

const ChipGroup = forwardRef<ChipGroupRef, ChipGroupProps>((props, ref) => (
  <ChipGroupBase
    {...props}
    ref={ref}
    ChipComponent={Chip}
    classMap={expandClassMap(classMap)}
  />
));
ChipGroup.displayName = "ChipGroup";
export default ChipGroup;
