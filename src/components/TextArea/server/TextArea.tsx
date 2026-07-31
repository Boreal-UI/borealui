import { combineClassNames } from "@/utils/classNames";
import { expandClassMap, resolvePropAlias } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import {
  getDefaultVariant,
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
  const inputId = id ?? `${resolvedTestId}-input`;
  const position = resolvePropAlias(labelPosition);
  return (
    <div
      className={combineClassNames(
        classMap.container,
        classMap[`label${capitalize(position)}`],
        containerClassName,
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
          state && classMap[state],
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
          style={{ height, resize: resizable ? undefined : "none" }}
          className={combineClassNames(classMap.textInput, inputClassName)}
          data-testid={`${resolvedTestId}-input`}
        />
      </div>
      {helperText ? (
        <div
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
          className={combineClassNames(
            classMap.errorMessage,
            errorMessageClassName,
          )}
          role={state === "error" ? "alert" : undefined}
        >
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
