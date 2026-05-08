import BaseRadioGroup from "../RadioGroupBase";
import "./RadioButton.scss";
import { RadioGroupProps } from "../RadioButton.types";
import { classes } from "./RadioButton";

const RadioGroup = (props: RadioGroupProps) => (
  <BaseRadioGroup {...props} classMap={classes} />
);

RadioGroup.displayName = "RadioGroup";
export default RadioGroup;
