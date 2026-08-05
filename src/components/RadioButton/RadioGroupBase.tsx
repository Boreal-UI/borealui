import { useId, useMemo } from "react";
import BaseRadioButton from "./RadioButtonBase";
import type { BaseRadioGroupProps } from "./RadioButton.types";
import { combineClassNames } from "../../utils/classNames";

const BaseRadioGroup = ({
  legend,
  name,
  options,
  value,
  onChange,
  orientation = "vertical",
  theme,
  variant,
  state,
  rounding,
  shadow,
  disabled = false,
  required = false,
  invalid = false,
  helperText,
  errorMessage,
  className,
  optionsClassName,
  id,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "radio-group",
  classMap,
  ...props
}: BaseRadioGroupProps) => {
  const uid = useId();
  const groupId = id ?? `${testId}-${uid}`;
  const descriptionId = helperText ? `${groupId}-helperText` : undefined;
  const errorId = errorMessage ? `${groupId}-errorMessage` : undefined;

  const resolvedAriaDescribedBy =
    [ariaDescribedBy, descriptionId, errorId].filter(Boolean).join(" ") ||
    undefined;

  const groupClasses = useMemo(
    () =>
      combineClassNames(
        classMap.group,
        state && classMap[state],
        disabled && classMap.disabled,
        invalid && classMap.invalid,
        className,
      ),
    [classMap, state, disabled, invalid, className],
  );

  const optionsClasses = useMemo(
    () =>
      combineClassNames(
        classMap.options,
        classMap[orientation],
        optionsClassName,
      ),
    [classMap, orientation, optionsClassName],
  );

  return (
    <fieldset
      id={groupId}
      className={groupClasses}
      disabled={disabled}
      aria-describedby={resolvedAriaDescribedBy}
      aria-invalid={invalid || state === "error" ? true : undefined}
      data-testid={testId}
      {...props}
    >
      {legend && (
        <legend
          className={classMap.legend}
          data-testid={testId ? `${testId}-legend` : undefined}
        >
          {legend}
        </legend>
      )}
      <div
        className={optionsClasses}
        data-testid={testId ? `${testId}-options` : undefined}
      >
        {options.map((option) => {
          const optionTestId =
            option["data-testid"] ?? `${testId}-${option.value}`;

          return (
            <BaseRadioButton
              key={option.value}
              label={option.label}
              value={option.value}
              name={name}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled || option.disabled}
              required={required}
              theme={theme}
              variant={variant}
              state={state}
              rounding={rounding}
              shadow={shadow}
              aria-invalid={invalid || state === "error" ? true : undefined}
              aria-label={option["aria-label"]}
              data-testid={optionTestId}
              classMap={classMap}
            />
          );
        })}
      </div>
      {helperText && (
        <div
          id={descriptionId}
          className={classMap.helperText}
          data-testid={testId ? `${testId}-helperText` : undefined}
        >
          {helperText}
        </div>
      )}
      {errorMessage && (
        <div
          id={errorId}
          className={classMap.error}
          data-testid={testId ? `${testId}-errorMessage` : undefined}
        >
          {errorMessage}
        </div>
      )}
    </fieldset>
  );
};

BaseRadioGroup.displayName = "BaseRadioGroup";
export default BaseRadioGroup;
