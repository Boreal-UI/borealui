import React, { useMemo, useId } from "react";
import { BaseFormGroupProps } from "./FormGroup.types";
import { combineClassNames } from "../../utils/classNames";

const BaseFormGroup: React.FC<BaseFormGroupProps> = ({
  label,
  description,
  error,
  children,
  id,
  required = false,
  className = "",
  layout = "vertical",
  hideLabel = false,
  spacing = "xs",
  controller,
  role = "group",
  labelProps,
  descriptionProps,
  errorProps,
  controlProps,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "form-group",
  classMap,
  ...rest
}) => {
  const auto = useId();
  const baseId = id ?? `${testId}-${auto}`;
  const controlId = controlProps?.id ?? baseId;

  const labelId = label ? `${baseId}-label` : undefined;
  const descriptionId = description ? `${baseId}-description` : undefined;
  const errorId = error ? `${baseId}-error` : undefined;

  const internalDescribedBy =
    [errorId, descriptionId].filter(Boolean).join(" ") || undefined;

  const mergedWrapperLabelledBy = ariaLabelledBy ?? labelId;
  const mergedWrapperDescribedBy = ariaDescribedBy ?? internalDescribedBy;

  const childrenArray = React.Children.toArray(children);

  const wrapperClass = useMemo(
    () =>
      combineClassNames(
        classMap.wrapper,
        classMap[layout],
        classMap[spacing],
        error && classMap.error,
        className,
      ),
    [classMap, layout, spacing, error, className],
  );

  return (
    <div
      className={wrapperClass}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={mergedWrapperLabelledBy}
      aria-describedby={mergedWrapperDescribedBy}
      data-testid={testId}
      {...rest}
    >
      {label && (
        <label
          id={labelId}
          htmlFor={controlId}
          className={combineClassNames(classMap.label, hideLabel && "sr_only")}
          data-testid={`${testId}-label`}
          {...labelProps}
        >
          {label}
          {required && (
            <span
              className={classMap.required}
              aria-hidden="true"
              data-testid={`${testId}-required`}
            >
              *
            </span>
          )}
        </label>
      )}

      {childrenArray.map((child, index) => {
        const clonedChild = React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<Record<string, unknown>>,
              {
                id:
                  (child.props as { id?: string }).id ??
                  (index === 0 ? controlId : `${controlId}-${index}`),
                required:
                  controlProps?.required ??
                  required ??
                  (child.props as { required?: boolean }).required,
                "aria-label":
                  controlProps?.["aria-label"] ??
                  (child.props as { "aria-label"?: string })["aria-label"],
                "aria-labelledby":
                  controlProps?.["aria-labelledby"] ??
                  labelId ??
                  (child.props as { "aria-labelledby"?: string })[
                    "aria-labelledby"
                  ],
                "aria-describedby":
                  controlProps?.["aria-describedby"] ??
                  internalDescribedBy ??
                  (child.props as { "aria-describedby"?: string })[
                    "aria-describedby"
                  ],
                "aria-invalid":
                  controlProps?.["aria-invalid"] ??
                  (!!error || undefined) ??
                  (child.props as { "aria-invalid"?: boolean })["aria-invalid"],
                "aria-errormessage":
                  controlProps?.["aria-errormessage"] ??
                  errorId ??
                  (child.props as { "aria-errormessage"?: string })[
                    "aria-errormessage"
                  ],
                "aria-required":
                  controlProps?.["aria-required"] ??
                  (required || undefined) ??
                  (child.props as { "aria-required"?: boolean })[
                    "aria-required"
                  ],
                ...controlProps,
              },
            )
          : child;

        return (
          <div
            key={index}
            className={classMap.inputWrapper}
            data-testid={`${testId}-wrapper-${index}`}
          >
            <div
              className={classMap.inputField}
              data-testid={`${testId}-input-field-${index}`}
            >
              {clonedChild}
            </div>

            {controller && index === 0 && (
              <div
                className={classMap.controller}
                data-testid={`${testId}-controller`}
              >
                {controller}
              </div>
            )}
          </div>
        );
      })}

      {description && !error && (
        <p
          id={descriptionId}
          className={classMap.description}
          data-testid={`${testId}-description`}
          {...descriptionProps}
        >
          {description}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className={classMap.errorMessage}
          role="alert"
          data-testid={`${testId}-error`}
          {...errorProps}
        >
          {error}
        </p>
      )}
    </div>
  );
};

BaseFormGroup.displayName = "BaseFormGroup";
export default BaseFormGroup;
