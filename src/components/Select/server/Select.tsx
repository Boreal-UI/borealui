import { useId } from "react";
import { combineClassNames } from "@/utils/classNames";
import { expandClassMap, resolvePropAlias } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import { resolveFieldPresentation } from "@/utils/fieldPresentation";
import { ChevronDownIcon } from "@/Icons";
import {
  getDefaultVariant,
  getDefaultSize,
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
  size = getDefaultSize(),
  invalid,
  helperText,
  errorMessage,
  rootClassName,
  controlClassName,
  descriptionClassName,
  errorClassName,
  helperTextClassName,
  errorMessageClassName,
  fullWidth = false,
  errorLive = "off",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Accepted for compatibility; the server variant has no async loading UI.
  loadingClassName: _loadingClassName,
  srOnlyClassName,
  "aria-description": ariaDescription,
  ...rest
}: ServerSelectProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "select";
  const generatedId = useId();
  const selectId = id ?? `${generatedId}-input`;
  const descriptionId = ariaDescription ? `${selectId}-description` : undefined;
  const presentation = resolveFieldPresentation({
    id: selectId, helperText, errorMessage, invalid, state,
    ariaInvalid: rest["aria-invalid"], describedBy: [rest["aria-describedby"], descriptionId],
  });
  const { helperTextId, errorMessageId } = presentation;
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
        rootClassName,
        fullWidth && classMap.fullWidth,
      )}
      data-testid={`${resolvedTestId}-layout`}
    >
      {(position === "top" || position === "left") && labelNode}
      <div
        className={combineClassNames(
          classMap.wrapper,
          classMap[theme],
          size && classMap[size],
          presentation.state && classMap[presentation.state],
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
          defaultValue={
            value ?? defaultValue ?? (placeholder !== null ? "" : undefined)
          }
          disabled={disabled}
          aria-invalid={presentation.ariaInvalid}
          aria-describedby={presentation.describedBy}
          className={combineClassNames(
            classMap.select,
            (variant === "outline" || variant === "glassOutline") &&
              classMap.outline,
            selectClassName,
            controlClassName,
          )}
          data-testid={`${resolvedTestId}-input`}
        >
          {placeholder !== null && !options.some((option) => option.value === "") && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
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
      {ariaDescription && <span id={descriptionId} className={combineClassNames("sr_only", srOnlyClassName)}>{ariaDescription}</span>}
      {helperText ? (
        <div id={helperTextId} className={combineClassNames(classMap.helperText, helperTextClassName, descriptionClassName)}>
          {helperText}
        </div>
      ) : null}
      {errorMessage ? (
        <div id={errorMessageId} className={combineClassNames(classMap.errorMessage, errorMessageClassName, errorClassName)} aria-live={errorLive === "off" ? undefined : errorLive}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
