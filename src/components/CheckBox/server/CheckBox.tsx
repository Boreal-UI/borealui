import { combineClassNames } from "@/utils/classNames";
import { expandClassMap, resolvePropAlias } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import { getDefaultGlass, getDefaultRounding, getDefaultSize, getDefaultTheme, getShadowClassName } from "@/config/boreal-style-config";
import { CheckBoxProps } from "../CheckBox.types";
import styles from "../next/CheckBox.module.scss";

export type ServerCheckBoxProps = Omit<CheckBoxProps, "checked" | "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
};

export default function CheckBox({ checked, defaultChecked, indeterminate = false, label, description, errorMessage, labelPosition = "right", theme = getDefaultTheme(), glass = getDefaultGlass(), rounding = getDefaultRounding(), size = getDefaultSize(), shadow, state, disabled = false, invalid = false, className, labelWrapperClassName, inputClassName, boxClassName, labelClassName, descriptionClassName, errorMessageClassName, testId, "data-testid": dataTestId, id, ...rest }: ServerCheckBoxProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "checkbox";
  const inputId = id ?? `${resolvedTestId}-input`;
  const position = resolvePropAlias(labelPosition);
  return <div className={combineClassNames(classMap.checkbox, classMap[theme], state && classMap[state], classMap[position], classMap[size], getShadowClassName(classMap, theme, shadow), rounding && classMap[`round${capitalize(rounding)}`], disabled && classMap.disabled, invalid && classMap.invalid, glass && classMap.glass, className)} data-testid={`${resolvedTestId}-wrapper`}>
    <label htmlFor={inputId} className={combineClassNames(classMap.labelWrapper, labelWrapperClassName)}>
      {label && position === "left" ? <span className={combineClassNames(classMap.label, labelClassName)}>{label}</span> : null}
      <input {...rest} id={inputId} type="checkbox" defaultChecked={checked ?? defaultChecked} disabled={disabled} className={combineClassNames(classMap.input, inputClassName)} aria-checked={indeterminate ? "mixed" : undefined} />
      <span className={combineClassNames(classMap.box, indeterminate && classMap.indeterminate, boxClassName)} aria-hidden="true" />
      {label && position === "right" ? <span className={combineClassNames(classMap.label, labelClassName)}>{label}</span> : null}
    </label>
    {description ? <div className={combineClassNames(classMap.description, descriptionClassName)}>{description}</div> : null}
    {errorMessage ? <div className={combineClassNames(classMap.errorMessage, errorMessageClassName)}>{errorMessage}</div> : null}
  </div>;
}
