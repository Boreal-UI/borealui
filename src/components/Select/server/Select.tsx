import { combineClassNames } from "@/utils/classNames";
import { expandClassMap, resolvePropAlias } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import { ChevronDownIcon } from "@/Icons";
import { getDefaultGlass, getDefaultOutline, getDefaultRounding, getDefaultTheme, getShadowClassName } from "@/config/boreal-style-config";
import { SelectProps } from "../Select.types";
import styles from "../next/Select.module.scss";

export type ServerSelectProps = Omit<SelectProps, "asyncOptions" | "onChange" | "pollInterval" | "value"> & {
  value?: string;
  defaultValue?: string;
};

export default function Select({ options, value, defaultValue, placeholder = "Select an option", label, labelPosition = "top", theme = getDefaultTheme(), glass = getDefaultGlass(), rounding = getDefaultRounding(), shadow, state, disabled = false, outline = getDefaultOutline(), className, layoutClassName, labelClassName, selectClassName, iconClassName, testId, "data-testid": dataTestId, id, ...rest }: ServerSelectProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "select";
  const selectId = id ?? `${resolvedTestId}-input`;
  const position = resolvePropAlias(labelPosition);
  const labelNode = label ? <label htmlFor={selectId} className={combineClassNames(classMap.label, classMap.labelOverlay, labelClassName)}>{label}</label> : null;
  return <div className={combineClassNames(classMap.layout, classMap[`label${capitalize(position)}`], layoutClassName)} data-testid={`${resolvedTestId}-layout`}>
    {(position === "top" || position === "left") && labelNode}
    <div className={combineClassNames(classMap.wrapper, classMap[theme], state && classMap[state], glass && classMap.glass, getShadowClassName(classMap, theme, shadow), rounding && classMap[`round${capitalize(rounding)}`], outline && classMap.outline, disabled && classMap.disabled, className)} data-testid={resolvedTestId}>
      <select {...rest} id={selectId} defaultValue={value ?? defaultValue ?? ""} disabled={disabled} className={combineClassNames(classMap.select, outline && classMap.outline, selectClassName)} data-testid={`${resolvedTestId}-input`}>
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
      </select>
      <div className={combineClassNames(classMap.icon, classMap[theme], iconClassName)} aria-hidden="true"><ChevronDownIcon aria-hidden /></div>
    </div>
    {(position === "bottom" || position === "right") && labelNode}
  </div>;
}
