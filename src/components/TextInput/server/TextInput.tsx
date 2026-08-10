import { combineClassNames } from "@/utils/classNames";
import { expandClassMap, resolvePropAlias } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultTheme,
  getShadowClassName,
} from "@/config/boreal-style-config";
import { TextInputProps } from "../TextInput.types";
import styles from "../next/TextInput.module.scss";

export type ServerTextInputProps = Omit<
  TextInputProps,
  "onChange" | "password"
> & { password?: false };

export default function TextInput({
  label,
  labelPosition = "top",
  icon: Icon,
  placeholder = "Enter text",
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
  rounding = getDefaultRounding(),
  shadow,
  state,
  disabled = false,
  fullWidth = false,
  className,
  containerClassName,
  labelClassName,
  iconClassName,
  inputClassName,
  helperTextClassName,
  errorMessageClassName,
  testId,
  "data-testid": dataTestId,
  id,
  readOnly = true,
  size,
  invalid,
  helperText,
  errorMessage,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: ServerTextInputProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "text-input";
  const inputId = id ?? `${resolvedTestId}-input`;
  const helperTextId = helperText ? `${inputId}-helper-text` : undefined;
  const errorMessageId = errorMessage ? `${inputId}-error-message` : undefined;
  const describedBy =
    [ariaDescribedBy, helperTextId, errorMessageId]
      .filter(Boolean)
      .join(" ") || undefined;
  const position = resolvePropAlias(labelPosition);
  return (
    <div
      className={combineClassNames(
        classMap.container,
        classMap[`label${capitalize(position)}`],
        fullWidth && classMap.fullWidth,
        containerClassName,
      )}
      data-state={errorMessage ? "error" : state || undefined}
      data-disabled={disabled || undefined}
      data-testid={resolvedTestId}
    >
      {label ? (
        <label
          htmlFor={inputId}
          className={combineClassNames(classMap.label, labelClassName)}
        >
          {label}
        </label>
      ) : null}
      <div
        className={combineClassNames(
          classMap.textInput,
          classMap[theme],
          size && classMap[size],
          state && classMap[state],
          invalid && classMap.error,
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          disabled && classMap.disabled,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          fullWidth && classMap.fullWidth,
          className,
        )}
      >
        {Icon ? (
          <div
            className={combineClassNames(
              classMap.iconContainer,
              classMap[theme],
              iconClassName,
            )}
            aria-hidden="true"
          >
            <Icon aria-hidden />
          </div>
        ) : null}
        <input
          {...rest}
          id={inputId}
          placeholder={label ? " " : placeholder}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={
            invalid || state === "error" || Boolean(errorMessage) || undefined
          }
          aria-describedby={describedBy}
          className={combineClassNames(classMap.input, inputClassName)}
          data-testid={`${resolvedTestId}-input`}
        />
      </div>
      {helperText ? (
        <div
          id={helperTextId}
          className={combineClassNames(
            classMap.helperText,
            helperTextClassName,
          )}
        >
          {helperText}
        </div>
      ) : null}
      {errorMessage ? (
        <div
          id={errorMessageId}
          className={combineClassNames(
            classMap.errorMessage,
            errorMessageClassName,
          )}
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
