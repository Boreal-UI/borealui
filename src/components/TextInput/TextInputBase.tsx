import {
  forwardRef,
  useState,
  useId,
  InputHTMLAttributes,
  useMemo,
} from "react";
import { EyeIcon, EyeSlashIcon } from "../../Icons";
import { TextInputBaseProps } from "./TextInput.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import { resolveFieldPresentation } from "../../utils/fieldPresentation";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultSize,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const TextInputBase = forwardRef<HTMLInputElement, TextInputBaseProps>(
  (
    {
      icon: Icon,
      label,
      labelPosition = "top",
      placeholder = "Enter text",
      password = false,
      readOnly = false,
      theme = getDefaultTheme(),
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      onChange,
      fullWidth = false,
      state,
      disabled = false,
      autoComplete,
      size = getDefaultSize(),
      invalid = false,
      helperText,
      errorMessage,
      rootClassName,
      controlClassName,
      descriptionClassName,
      errorClassName,
      errorLive = "off",
      classMap,
      IconButton,
      className,
      containerClassName,
      labelClassName,
      iconClassName,
      inputClassName,
      togglePasswordClassName,
      helperTextClassName,
      errorMessageClassName,
      srOnlyClassName,
      srOnlyText,
      "data-testid": dataTestId,
      testId = dataTestId ?? "text-input",
      ...rest
    },
    ref,
  ) => {
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const [showPassword, setShowPassword] = useState(false);

    const autoId = useId();

    const {
      id: idProp,
      required,
      type: typeProp,
      role,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      "aria-readonly": ariaReadOnly,
      "aria-disabled": ariaDisabled,
      "aria-description": ariaDescription,
      "aria-activedescendant": ariaActiveDescendant,
      "aria-haspopup": ariaHasPopup,
      "aria-expanded": ariaExpanded,
      "aria-controls": ariaControls,
      ...restInput
    } = rest as InputHTMLAttributes<HTMLInputElement> & {
      role?: React.AriaRole;
      "aria-label"?: string;
      "aria-labelledby"?: string;
      "aria-describedby"?: string;
      "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
      "aria-required"?: boolean;
      "aria-readonly"?: boolean;
      "aria-disabled"?: boolean;
      "aria-description"?: string;
      "aria-activedescendant"?: string;
      "aria-haspopup"?:
        | boolean
        | "false"
        | "true"
        | "menu"
        | "listbox"
        | "tree"
        | "grid"
        | "dialog";
      "aria-expanded"?: boolean;
      "aria-controls"?: string;
    };

    const inputId = idProp || autoId;
    const hasLabel = Boolean(label);

    const generatedDescriptionId = srOnlyText
      ? `${inputId}-sr-description`
      : undefined;
    const presentation = resolveFieldPresentation({
      id: inputId, helperText, errorMessage, invalid, state, ariaInvalid,
      describedBy: [ariaDescribedBy, generatedDescriptionId],
    });
    const { helperTextId, errorMessageId } = presentation;

    const computedAriaLabel = hasLabel
      ? undefined
      : ariaLabel || placeholder || "Text input";

    const computedPlaceholder = hasLabel ? " " : placeholder;

    const inputType = password
      ? showPassword
        ? "text"
        : "password"
      : typeProp || "text";

    const isError = presentation.state === "error";

    const computedAutoComplete = autoComplete;

    const computedAriaInvalid =
      presentation.ariaInvalid;
    const computedAriaRequired = ariaRequired ?? (required || undefined);
    const computedAriaReadOnly = ariaReadOnly ?? (readOnly || undefined);
    const computedAriaDisabled = ariaDisabled ?? (disabled || undefined);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const containerClass = useMemo(
      () =>
        combineClassNames(
          classMap.container,
          classMap[`label${capitalize(resolvedLabelPosition)}`],
          fullWidth && classMap.fullWidth,
          containerClassName,
          rootClassName,
        ),
      [classMap, resolvedLabelPosition, fullWidth, containerClassName, rootClassName],
    );

    const wrapperClass = useMemo(
      () =>
        combineClassNames(
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
        ),
      [
        classMap,
        theme,
        size,
        presentation.state,
        variant,
        disabled,
        shadow,
        rounding,
        fullWidth,
        className,
      ],
    );

    const inputClasses = classMap.input;

    const iconClasses = useMemo(
      () =>
        combineClassNames(
          classMap.iconContainer,
          classMap[theme],
          disabled && classMap.disabled,
          iconClassName,
        ),
      [classMap, theme, disabled, iconClassName],
    );

    return (
      <div
        className={containerClass}
        data-state={isError ? "error" : state || undefined}
        data-disabled={disabled || undefined}
        data-testid={testId}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={combineClassNames(classMap.label, labelClassName)}
            data-testid={`${testId}-label`}
          >
            {label}
          </label>
        )}

        <div className={wrapperClass} data-testid={`${testId}-wrapper`}>
          {Icon && (
            <div
              className={iconClasses}
              aria-hidden="true"
              data-testid={`${testId}-icon`}
            >
              <Icon aria-hidden={true} />
            </div>
          )}
          <input
            {...restInput}
            ref={ref}
            id={inputId}
            type={inputType}
            className={combineClassNames(inputClasses, inputClassName, controlClassName)}
            placeholder={computedPlaceholder}
            role={role}
            aria-label={computedAriaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={presentation.describedBy}
            aria-invalid={computedAriaInvalid}
            aria-required={computedAriaRequired}
            aria-readonly={computedAriaReadOnly}
            aria-disabled={computedAriaDisabled}
            aria-description={ariaDescription}
            aria-activedescendant={ariaActiveDescendant}
            aria-haspopup={ariaHasPopup}
            aria-expanded={ariaExpanded}
            aria-controls={ariaControls}
            autoComplete={computedAutoComplete}
            onChange={(e) => onChange?.(e.currentTarget.value, e)}
            readOnly={readOnly}
            disabled={disabled}
            required={required}
            data-testid={`${testId}-input`}
          />

          {password && (
            <IconButton
              type="button"
              className={combineClassNames(
                classMap.togglePassword,
                togglePasswordClassName,
              )}
              onClick={togglePasswordVisibility}
              theme="clear"
              shadow="none"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              data-testid={`${testId}-password-toggle`}
              icon={showPassword ? EyeSlashIcon : EyeIcon}
            />
          )}

          {srOnlyText && (
            <span
              id={generatedDescriptionId}
              className={combineClassNames(
                "sr_only",
                srOnlyClassName,
              )}
              data-testid={`${testId}-sr-only-text`}
            >
              {srOnlyText}
            </span>
          )}
        </div>
        {helperText && (
          <div
            id={helperTextId}
            className={combineClassNames(
              classMap.helperText,
              helperTextClassName,
              descriptionClassName,
            )}
            data-testid={`${testId}-helper-text`}
          >
            {helperText}
          </div>
        )}
        {errorMessage && (
          <div
            id={errorMessageId}
            className={combineClassNames(
              classMap.errorMessage,
              errorMessageClassName,
              errorClassName,
            )}
            aria-live={errorLive === "off" ? undefined : errorLive}
            data-testid={`${testId}-error-message`}
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

TextInputBase.displayName = "TextInputBase";

export default TextInputBase;
