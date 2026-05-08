import React from "react";
import { combineClassNames } from "../../utils/classNames";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { StepperBaseProps } from "./Stepper.types";

const StepperBase: React.FC<StepperBaseProps> = ({
  steps,
  activeStep,
  onStepClick,
  disableBackNavigation = false,
  orientation = "horizontal",
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  state = "",
  size = getDefaultSize(),
  shadow = getDefaultShadow(),
  rounding = getDefaultRounding(),
  "data-testid": dataTestId,
  testId = dataTestId ?? "stepper",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  groupLabel = "Progress Stepper",
  getStepAriaLabel,
  classMap,
  className,
  IconButtonComponent,
}) => {
  const stepCount = steps.length;
  const fallbackGroupLabelId = `${testId}-label`;

  const resolvedAriaLabelledBy = ariaLabelledBy
    ? ariaLabelledBy
    : !ariaLabel
      ? fallbackGroupLabelId
      : undefined;

  return (
    <div
      className={combineClassNames(
        classMap.stepper,
        classMap[orientation],
        classMap[theme],
        classMap[state],
        classMap[size],
        glass && classMap.glass,
        className,
      )}
      role="list"
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={resolvedAriaLabelledBy}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
    >
      {!ariaLabel && !ariaLabelledBy && (
        <span id={fallbackGroupLabelId} className="sr_only">
          {groupLabel}
        </span>
      )}

      {steps.map((step, index) => {
        const Icon = step.icon || (() => <span>{index + 1}</span>);
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;
        const isBefore = index < activeStep;
        const isDisabled = disableBackNavigation && isBefore;
        const isInteractive = !!onStepClick && !isDisabled;
        const stepId = `${testId}-step-${index}`;

        const defaultStepLabel = `Step ${index + 1} of ${stepCount}: ${step.label}${
          isActive ? ", current step" : isCompleted ? ", completed" : ""
        }`;

        const stepAriaLabel = getStepAriaLabel
          ? getStepAriaLabel(step, index, stepCount, isActive, isCompleted)
          : defaultStepLabel;

        return (
          <div
            key={index}
            role="listitem"
            className={combineClassNames(
              classMap.step,
              isActive ? classMap.active : "",
              isCompleted ? classMap.completed : "",
              onStepClick ? classMap.clickable : "",
            )}
            data-testid={stepId}
          >
            <IconButtonComponent
              icon={Icon}
              theme={theme}
              glass={glass}
              state={state}
              className={combineClassNames(
                classMap.stepButton,
                isActive ? classMap.active : "",
                isCompleted ? classMap.completed : "",
              )}
              size={size}
              shadow={shadow}
              rounding={rounding}
              disabled={isDisabled}
              outline={!isActive}
              aria-label={stepAriaLabel}
              aria-current={isActive ? "step" : undefined}
              aria-disabled={isDisabled ? true : undefined}
              data-testid={`${stepId}-icon`}
              tabIndex={isInteractive ? 0 : -1}
              onClick={() => {
                if (!isDisabled) {
                  onStepClick?.(index);
                }
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                  e.preventDefault();
                  onStepClick?.(index);
                }
              }}
            />

            <span
              className={classMap.stepLabel}
              data-testid={`${stepId}-label`}
              aria-hidden="true"
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

StepperBase.displayName = "StepperBase";
export default StepperBase;
