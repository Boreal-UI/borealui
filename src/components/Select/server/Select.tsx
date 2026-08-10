import { combineClassNames } from "@/utils/classNames";
import { expandClassMap, resolvePropAlias } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import { ChevronDownIcon } from "@/Icons";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultTheme,
  getShadowClassName,
} from "@/config/boreal-style-config";
import { SelectProps } from "../Select.types";
import styles from "../next/Select.module.scss";

export type ServerSelectProps = Omit<
  SelectProps,
  "asyncOptions" | "onChange" | "pollInterval" | "value"
> & {
  value?: string;
  defaultValue?: string;
};

export default function Select({
  options,
  value,
  defaultValue,
  placeholder = "Select an option",
  label,
  labelPosition = "top",
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
  rounding = getDefaultRounding(),
  shadow,
  state,
  disabled = false,
  className,
  layoutClassName,
  labelClassName,
  selectClassName,
  iconClassName,
  testId,
  "data-testid": dataTestId,
  id,
  size,
  invalid,
  helperText,
  errorMessage,
  ...rest
}: ServerSelectProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "select";
  const selectId = id ?? `${resolvedTestId}-input`;
  const helperTextId = helperText ? `${selectId}-helper-text` : undefined;
  const errorMessageId = errorMessage ? `${selectId}-error-message` : undefined;
  const describedBy =
    [helperTextId, errorMessageId].filter(Boolean).join(" ") || undefined;
  const position = resolvePropAlias(labelPosition);
  const labelNode = label ? (
    <label
      htmlFor={selectId}
      className={combineClassNames(
        classMap.label,
        classMap.labelOverlay,
        labelClassName,
      )}
    >
      {label}
    </label>
  ) : null;
  return (
    <div
      className={combineClassNames(
        classMap.layout,
        classMap[`label${capitalize(position)}`],
        layoutClassName,
      )}
      data-testid={`${resolvedTestId}-layout`}
    >
      {(position === "top" || position === "left") && labelNode}
      <div
        className={combineClassNames(
          classMap.wrapper,
          classMap[theme],
          size && classMap[size],
          state && classMap[state],
          invalid && classMap.error,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          disabled && classMap.disabled,
          className,
        )}
        data-testid={resolvedTestId}
      >
        <select
          {...rest}
          id={selectId}
          defaultValue={value ?? defaultValue ?? ""}
          disabled={disabled}
          aria-invalid={invalid || state === "error" || undefined}
          aria-describedby={describedBy}
          className={combineClassNames(
            classMap.select,
            (variant === "outline" || variant === "glassOutline") &&
              classMap.outline,
            selectClassName,
          )}
          data-testid={`${resolvedTestId}-input`}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div
          className={combineClassNames(
            classMap.icon,
            classMap[theme],
            iconClassName,
          )}
          aria-hidden="true"
        >
          <ChevronDownIcon aria-hidden />
        </div>
      </div>
      {(position === "bottom" || position === "right") && labelNode}
      {helperText ? (
        <div id={helperTextId} className={classMap.helperText}>
          {helperText}
        </div>
      ) : null}
      {errorMessage ? (
        <div id={errorMessageId} className={classMap.errorMessage} role="alert">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
