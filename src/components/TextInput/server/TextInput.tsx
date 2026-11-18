import { useId } from "react";
import { combineClassNames } from "@/utils/classNames";
import { expandClassMap, resolvePropAlias } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import { resolveFieldPresentation } from "@/utils/fieldPresentation";
import {
  getDefaultVariant,
  getDefaultSize,
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
  size = getDefaultSize(),
  invalid,
  helperText,
  errorMessage,
  rootClassName,
  controlClassName,
  descriptionClassName,
  errorClassName,
  errorLive = "off",
  srOnlyText,
  srOnlyClassName,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: ServerTextInputProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "text-input";
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;
  const srDescriptionId = srOnlyText ? `${inputId}-sr-description` : undefined;
  const presentation = resolveFieldPresentation({
    id: inputId, helperText, errorMessage, invalid, state,
    ariaInvalid: rest["aria-invalid"], describedBy: [ariaDescribedBy, srDescriptionId],
  });
  const { helperTextId, errorMessageId } = presentation;
  const position = resolvePropAlias(labelPosition);
  return (
    <div
      className={combineClassNames(
        classMap.container,
        classMap[`label${capitalize(position)}`],
        fullWidth && classMap.fullWidth,
        containerClassName,
        rootClassName,
      )}
      data-state={presentation.state || undefined}
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
          presentation.state && classMap[presentation.state],
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
          aria-invalid={presentation.ariaInvalid}
          aria-describedby={presentation.describedBy}
          className={combineClassNames(classMap.input, inputClassName, controlClassName)}
          data-testid={`${resolvedTestId}-input`}
        />
      </div>
      {srOnlyText && <span id={srDescriptionId} className={combineClassNames("sr_only", srOnlyClassName)}>{srOnlyText}</span>}
      {helperText ? (
        <div
          id={helperTextId}
          className={combineClassNames(
            classMap.helperText,
            helperTextClassName,
            descriptionClassName,
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
            errorClassName,
          )}
          aria-live={errorLive === "off" ? undefined : errorLive}
        >
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
