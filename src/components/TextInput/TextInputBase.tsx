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
import {
  getDefaultOutline,
  getDefaultGlass,
  getDefaultRounding,
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
      glass = getDefaultGlass(),
      rounding = getDefaultRounding(),
      shadow,
      onChange,
      state,
      disabled = false,
      autocomplete = false,
      outline = getDefaultOutline(),
      classMap,
      IconButton,
      className,
      containerClassName,
      labelClassName,
      iconClassName,
      inputClassName,
      togglePasswordClassName,
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
      autoComplete: autoCompleteProp,
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

    const computedAriaDescribedBy =
      [ariaDescribedBy, generatedDescriptionId].filter(Boolean).join(" ") ||
      undefined;

    const computedAriaLabel = hasLabel
      ? undefined
      : ariaLabel || placeholder || "Text input";

    const computedPlaceholder = hasLabel ? " " : placeholder;

    const inputType = password
      ? showPassword
        ? "text"
        : "password"
      : typeProp || "text";

    const isError = state === "error";

    const computedAutoComplete =
      autoCompleteProp ??
      (autocomplete ? (password ? "current-password" : "on") : "off");

    const computedAriaInvalid = ariaInvalid ?? (isError || undefined);
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
          containerClassName,
        ),
      [classMap, resolvedLabelPosition, containerClassName],
    );

    const wrapperClass = useMemo(
      () =>
        combineClassNames(
          classMap.textInput,
          classMap[theme],
          state && classMap[state],
          outline && classMap.outline,
          glass && classMap.glass,
          disabled && classMap.disabled,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        theme,
        state,
        outline,
        glass,
        disabled,
        shadow,
        rounding,
        className,
      ],
    );

    const inputClasses = useMemo(
      () => combineClassNames(classMap.textInput, outline && classMap.outline),
      [classMap, outline],
    );

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
      <div className={containerClass} data-testid={testId}>
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
            ref={ref}
            id={inputId}
            type={inputType}
            className={combineClassNames(inputClasses, inputClassName)}
            placeholder={computedPlaceholder}
            role={role}
            aria-label={computedAriaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={computedAriaDescribedBy}
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
            {...restInput}
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
                classMap.srOnly || "sr_only",
                srOnlyClassName,
              )}
              data-testid={`${testId}-sr-only-text`}
            >
              {srOnlyText}
            </span>
          )}
        </div>
      </div>
    );
  },
);

TextInputBase.displayName = "TextInputBase";

export default TextInputBase;
