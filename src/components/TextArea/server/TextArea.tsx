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
import { TextAreaProps } from "../TextArea.types";
import styles from "../next/TextArea.module.scss";

export type ServerTextAreaProps = Omit<TextAreaProps, "onChange">;

export default function TextArea({
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
  resizable = true,
  helperText,
  errorMessage,
  invalid,
  size = getDefaultSize(),
  fullWidth = false,
  rootClassName,
  controlClassName,
  descriptionClassName,
  errorClassName,
  errorLive = "off",
  describedBy,
  srOnlyClassName,
  "aria-description": ariaDescription,
  "aria-describedby": ariaDescribedBy,
  style,
  height,
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
  ...rest
}: ServerTextAreaProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "text-area";
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;
  const descriptionId = ariaDescription ? `${inputId}-description` : undefined;
  const presentation = resolveFieldPresentation({
    id: inputId, helperText, errorMessage, invalid, state,
    ariaInvalid: rest["aria-invalid"],
    describedBy: [ariaDescribedBy, describedBy, descriptionId],
  });
  const position = resolvePropAlias(labelPosition);
  return (
    <div
      className={combineClassNames(
        classMap.container,
        classMap[`label${capitalize(position)}`],
        containerClassName,
        rootClassName,
        fullWidth && classMap.fullWidth,
      )}
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
          classMap.textArea,
          classMap[theme],
          presentation.state && classMap[presentation.state],
          classMap[size],
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          disabled && classMap.disabled,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        )}
      >
        {Icon ? (
          <div
            className={combineClassNames(classMap.iconContainer, iconClassName)}
            aria-hidden="true"
          >
            <Icon aria-hidden />
          </div>
        ) : null}
        <textarea
          {...rest}
          id={inputId}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          style={{ ...style, height: height ?? style?.height, resize: resizable ? style?.resize : "none" }}
          aria-invalid={presentation.ariaInvalid}
          aria-describedby={presentation.describedBy}
          aria-errormessage={presentation.state === "error" ? rest["aria-errormessage"] || presentation.errorMessageId : undefined}
          className={combineClassNames(classMap.textInput, inputClassName, controlClassName)}
          data-testid={`${resolvedTestId}-input`}
        />
      </div>
      {ariaDescription && <span id={descriptionId} className={combineClassNames("sr_only", srOnlyClassName)}>{ariaDescription}</span>}
      {helperText ? (
        <div
          id={presentation.helperTextId}
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
          id={presentation.errorMessageId}
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
