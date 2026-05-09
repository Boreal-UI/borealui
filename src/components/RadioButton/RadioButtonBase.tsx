import React, { forwardRef, useMemo, useId } from "react";
import { BaseRadioButtonProps } from "./RadioButton.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const BaseRadioButton = forwardRef<HTMLInputElement, BaseRadioButtonProps>(
  (
    {
      label,
      labelPosition = "left",
      value,
      checked,
      onChange,
      name,
      theme = getDefaultTheme(),
      glass = getDefaultGlass(),
      rounding = getDefaultRounding(),
      shadow = getDefaultShadow(),
      state = "",
      disabled = false,
      className = "",
      id,
      "data-testid": dataTestId,
      testId = dataTestId ?? "radio-button",
      classMap,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      required,
      ...props
    },
    ref,
  ) => {
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const uid = useId();
    const inputId = id ?? `${testId}-input-${uid}`;
    const labelId = `${testId}-label-${uid}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.target.checked) onChange(e.target.value);
    };

    const wrapperClasses = useMemo(
      () =>
        combineClassNames(
          classMap.wrapper,
          classMap[theme],
          classMap[state],
          glass && classMap.glass,
          disabled && classMap.disabled,
          className,
        ),
      [classMap, theme, state, glass, disabled, className],
    );

    const radioClasses = useMemo(
      () =>
        combineClassNames(
          classMap.circle,
          glass && classMap.glassCircle,
          shadow && classMap[`shadow${capitalize(shadow)}`],
          rounding && classMap[`round${capitalize(rounding)}`],
        ),
      [classMap, glass, rounding, shadow],
    );

    const resolvedAriaLabelledBy =
      ariaLabelledBy ?? (label ? labelId : undefined);

    return (
      <div
        className={wrapperClasses}
        data-testid={testId ? `${testId}-root` : undefined}
      >
        <label
          className={classMap.labelWrapper}
          data-testid={testId ? `${testId}-label-wrapper` : undefined}
          htmlFor={inputId}
        >
          {label && resolvedLabelPosition === "left" && (
            <span
              className={classMap.label}
              id={labelId}
              data-testid={testId ? `${testId}-label` : undefined}
            >
              {label}
            </span>
          )}
          <input
            ref={ref}
            type="radio"
            id={inputId}
            name={name}
            className={classMap.input}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            aria-label={ariaLabel}
            aria-labelledby={resolvedAriaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            aria-required={ariaRequired ?? required}
            data-testid={testId}
            {...props}
          />
          <span
            className={radioClasses}
            aria-hidden="true"
            data-testid={`${testId}-circle`}
          />
          {label && resolvedLabelPosition === "right" && (
            <span
              className={classMap.label}
              id={labelId}
              data-testid={testId ? `${testId}-label` : undefined}
            >
              {label}
            </span>
          )}
        </label>
      </div>
    );
  },
);

BaseRadioButton.displayName = "BaseRadioButton";
export default BaseRadioButton;
