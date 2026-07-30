import { combineClassNames } from "@/utils/classNames";
import { expandClassMap, resolvePropAlias } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import { getDefaultGlass, getDefaultOutline, getDefaultRounding, getDefaultTheme, getShadowClassName } from "@/config/boreal-style-config";
import { TextInputProps } from "../TextInput.types";
import styles from "../next/TextInput.module.scss";

export type ServerTextInputProps = Omit<TextInputProps, "onChange" | "password"> & { password?: false };

export default function TextInput({ label, labelPosition = "top", icon: Icon, placeholder = "Enter text", theme = getDefaultTheme(), glass = getDefaultGlass(), rounding = getDefaultRounding(), shadow, state, disabled = false, outline = getDefaultOutline(), fullWidth = false, className, containerClassName, labelClassName, iconClassName, inputClassName, testId, "data-testid": dataTestId, id, readOnly = true, ...rest }: ServerTextInputProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "text-input";
  const inputId = id ?? `${resolvedTestId}-input`;
  const position = resolvePropAlias(labelPosition);
  return <div className={combineClassNames(classMap.container, classMap[`label${capitalize(position)}`], fullWidth && classMap.fullWidth, containerClassName)} data-testid={resolvedTestId}>
    {label ? <label htmlFor={inputId} className={combineClassNames(classMap.label, labelClassName)}>{label}</label> : null}
    <div className={combineClassNames(classMap.textInput, classMap[theme], state && classMap[state], outline && classMap.outline, glass && classMap.glass, disabled && classMap.disabled, getShadowClassName(classMap, theme, shadow), rounding && classMap[`round${capitalize(rounding)}`], fullWidth && classMap.fullWidth, className)}>
      {Icon ? <div className={combineClassNames(classMap.iconContainer, classMap[theme], iconClassName)} aria-hidden="true"><Icon aria-hidden /></div> : null}
      <input {...rest} id={inputId} placeholder={label ? " " : placeholder} readOnly={readOnly} disabled={disabled} className={combineClassNames(classMap.textInput, inputClassName)} data-testid={`${resolvedTestId}-input`} />
    </div>
  </div>;
}
