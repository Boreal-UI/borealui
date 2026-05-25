import { useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { AlertBaseProps } from "./Alert.types";

export default function AlertBase({
  children,
  title,
  icon,
  actions,
  theme = getDefaultTheme(),
  state,
  variant = "solid",
  glass = getDefaultGlass(),
  rounding = getDefaultRounding(),
  outline = false,
  shadow = getDefaultShadow(),
  dismissible = false,
  onDismiss,
  role = state === "error" ? "alert" : "status",
  className,
  iconClassName,
  contentClassName,
  titleClassName,
  messageClassName,
  actionsClassName,
  dismissButtonClassName,
  dismissLabel = "Dismiss alert",
  testId,
  "data-testid": dataTestId,
  classMap,
}: AlertBaseProps) {
  const resolvedTestId = testId ?? dataTestId ?? "alert";
  const alertClassName = useMemo(
    () =>
      combineClassNames(
        classMap.alert,
        classMap[theme],
        state && classMap[state],
        classMap[variant],
        outline && classMap.outline,
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        icon ? classMap.hasIcon : null,
        actions ? classMap.hasActions : null,
        dismissible && classMap.dismissible,
        className,
      ),
    [
      classMap,
      theme,
      state,
      variant,
      outline,
      glass,
      shadow,
      rounding,
      icon,
      actions,
      dismissible,
      className,
    ],
  );

  return (
    <div className={alertClassName} role={role} data-testid={resolvedTestId}>
      {icon ? (
        <span
          className={combineClassNames(classMap.icon, iconClassName)}
          aria-hidden="true"
          data-testid={`${resolvedTestId}-icon`}
        >
          {icon}
        </span>
      ) : null}
      <div className={combineClassNames(classMap.content, contentClassName)}>
        {title ? (
          <div
            className={combineClassNames(classMap.title, titleClassName)}
            data-testid={`${resolvedTestId}-title`}
          >
            {title}
          </div>
        ) : null}
        {children ? (
          <div
            className={combineClassNames(classMap.message, messageClassName)}
            data-testid={`${resolvedTestId}-message`}
          >
            {children}
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className={combineClassNames(classMap.actions, actionsClassName)}>
          {actions}
        </div>
      ) : null}
      {dismissible ? (
        <button
          type="button"
          className={combineClassNames(
            classMap.dismissButton,
            dismissButtonClassName,
          )}
          aria-label={dismissLabel}
          onClick={onDismiss}
          data-testid={`${resolvedTestId}-dismiss`}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
