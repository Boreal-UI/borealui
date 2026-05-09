import { expandClassMap } from "@/utils/propAliases";
import BaseRadioGroup from "../RadioGroupBase";
import "./RadioButton.scss";
import { RadioGroupProps } from "../RadioButton.types";
import { classes } from "./RadioButton";

const RadioGroup = (props: RadioGroupProps) => (
  <BaseRadioGroup {...props} classMap={expandClassMap(classes)} />
);

RadioGroup.displayName = "RadioGroup";
export default RadioGroup;
