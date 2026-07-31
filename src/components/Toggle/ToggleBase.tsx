import { forwardRef, KeyboardEvent, useId, useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import { ToggleBaseProps } from "./Toggle.types";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const ToggleBase = forwardRef<HTMLButtonElement, ToggleBaseProps>(
  (
    {
      checked,
      onChange,
      label,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-errormessage": ariaErrorMessage,
      "aria-disabled": ariaDisabled,
      tabIndex,
      theme = getDefaultTheme(),
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      state,
      size = getDefaultSize(),
      disabled = false,
      classMap,
      className,
      "data-testid": dataTestId,
      testId = dataTestId ?? "toggle",
    },
    ref,
  ) => {
    const uid = useId();

    const buttonId = id ?? `${testId}-button-${uid}`;
    const internalLabelId = label ? `${testId}-label-${uid}` : undefined;

    const resolvedAriaLabelledBy =
      ariaLabelledBy || (!ariaLabel && label ? internalLabelId : undefined);

    const resolvedAriaLabel = !resolvedAriaLabelledBy
      ? ariaLabel || (!label ? "Toggle switch" : undefined)
      : undefined;

    const setOn = (next: boolean) => {
      if (!disabled && next !== checked) {
        onChange(next);
      }
    };

    const toggle = () => setOn(!checked);

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;

      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault();
          toggle();
          break;
        case "ArrowRight":
          e.preventDefault();
          setOn(true);
          break;
        case "ArrowLeft":
          e.preventDefault();
          setOn(false);
          break;
      }
    };

    const containerClass = useMemo(
      () =>
        combineClassNames(
          classMap.container,
          classMap[theme],
          state && classMap[state],
          classMap[size],
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          disabled && classMap.disabled,
          className,
        ),
      [classMap, theme, state, size, variant, disabled, className],
    );

    const toggleClass = useMemo(
      () =>
        combineClassNames(
          classMap.toggle,
          (variant === "glass" || variant === "glassOutline") &&
            classMap.glassTrack,
          checked && classMap.active,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
        ),
      [classMap, theme, variant, checked, shadow, rounding],
    );

    return (
      <div className={containerClass} data-testid={`${testId}-wrapper`}>
        <button
          ref={ref}
          id={buttonId}
          className={toggleClass}
          role="switch"
          type="button"
          disabled={disabled}
          aria-checked={checked}
          aria-label={resolvedAriaLabel}
          aria-labelledby={resolvedAriaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          aria-errormessage={ariaErrorMessage}
          aria-disabled={(ariaDisabled ?? disabled) || undefined}
          tabIndex={tabIndex}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          data-testid={testId}
        >
          <span
            className={classMap.slider}
            aria-hidden="true"
            data-testid={`${testId}-slider`}
          />
        </button>

        {label && !ariaLabelledBy && (
          <label
            id={internalLabelId}
            htmlFor={buttonId}
            className={classMap.label}
            data-testid={`${testId}-label`}
          >
            {label}
          </label>
        )}
      </div>
    );
  },
);

ToggleBase.displayName = "ToggleBase";
export default ToggleBase;
