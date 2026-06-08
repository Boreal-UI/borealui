import { combineClassNames } from "@/utils/classNames";
import { expandClassMap } from "@/utils/propAliases";
import { RadioGroupProps } from "../RadioButton.types";
import RadioButton from "./RadioButton";
import styles from "../next/RadioButton.module.scss";

export type ServerRadioGroupProps = Omit<RadioGroupProps, "onChange" | "value"> & {
  value?: string;
  defaultValue?: string;
};

export default function RadioGroup({ legend, name, options, value, defaultValue, orientation = "vertical", theme, glass, state, rounding, shadow, disabled = false, required = false, invalid = false, description, errorMessage, className, optionsClassName, testId, "data-testid": dataTestId, id, ...rest }: ServerRadioGroupProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "radio-group";
  const groupId = id ?? resolvedTestId;
  return <fieldset {...rest} id={groupId} className={combineClassNames(classMap.group, state && classMap[state], disabled && classMap.disabled, invalid && classMap.invalid, className)} disabled={disabled} data-testid={resolvedTestId}>
    {legend ? <legend className={classMap.legend}>{legend}</legend> : null}
    <div className={combineClassNames(classMap.options, classMap[orientation], optionsClassName)}>
      {options.map((option) => <RadioButton key={option.value} label={option.label} value={option.value} name={name} defaultChecked={(value ?? defaultValue) === option.value} disabled={disabled || option.disabled} required={required} theme={theme} glass={glass} state={state} rounding={rounding} shadow={shadow} aria-label={option["aria-label"]} testId={option["data-testid"] ?? `${resolvedTestId}-${option.value}`} />)}
    </div>
    {description ? <div className={classMap.description}>{description}</div> : null}
    {errorMessage ? <div className={classMap.errorMessage}>{errorMessage}</div> : null}
  </fieldset>;
}
