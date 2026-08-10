import React, { useMemo, useId } from "react";
import type { BaseEmptyStateProps } from "./EmptyState.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const BaseEmptyState: React.FC<BaseEmptyStateProps> = ({
  icon: Icon,
  title = "Nothing Here Yet",
  message = "There’s no content to display.",
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
  state,
  size = getDefaultSize(),
  rounding = getDefaultRounding(),
  shadow,
  actionLabel,
  onActionClick,
  className,
  iconClassName,
  titleClassName,
  messageClassName,
  actionButtonClassName,
  id,
  role,
  iconDecorative = true,
  iconAriaLabel,
  actionAriaLabel,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "empty-state",
  Button,
  classMap,
  ...rest
}) => {
  const uid = useId();

  const titleId =
    title && !ariaLabelledBy ? `${testId}-title-${uid}` : undefined;
  const messageId =
    message && !ariaDescribedBy ? `${testId}-message-${uid}` : undefined;

  const resolvedRole = role ?? (title ? "region" : undefined);

  const resolvedAriaLabelledBy =
    ariaLabelledBy ?? (!ariaLabel && titleId ? titleId : undefined);

  const resolvedAriaDescribedBy = ariaDescribedBy ?? messageId;

  const sectionClassNames = useMemo(
    () =>
      combineClassNames(
        classMap.empty_state,
        classMap[theme],
        state && classMap[state],
        classMap[size],
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        (variant === "outline" || variant === "glassOutline") &&
          classMap.outline,
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        className,
      ),
    [classMap, rounding, shadow, size, state, theme, variant, className],
  );

  const resolvedActionAriaLabel =
    actionAriaLabel ??
    (typeof actionLabel === "string" ? undefined : "Perform action");

  return (
    <section
      id={id}
      className={sectionClassNames}
      role={resolvedRole}
      aria-label={ariaLabel}
      aria-labelledby={resolvedAriaLabelledBy}
      aria-describedby={resolvedAriaDescribedBy}
      data-testid={testId}
      {...rest}
    >
      {Icon && (
        <div
          className={combineClassNames(classMap.icon, iconClassName)}
          data-testid={`${testId}-icon`}
          aria-hidden={iconDecorative ? true : undefined}
        >
          <Icon
            aria-hidden={iconDecorative ? true : undefined}
            aria-label={!iconDecorative ? iconAriaLabel : undefined}
            focusable={false}
          />
        </div>
      )}

      {title && (
        <h2
          id={titleId}
          className={combineClassNames(classMap.title, titleClassName)}
          data-testid={`${testId}-title`}
        >
          {title}
        </h2>
      )}

      {message && (
        <p
          id={messageId}
          className={combineClassNames(classMap.message, messageClassName)}
          data-testid={`${testId}-message`}
        >
          {message}
        </p>
      )}

      {actionLabel && onActionClick && (
        <Button
          theme="clear"
          variant={variant}
          onClick={onActionClick}
          aria-label={resolvedActionAriaLabel}
          className={combineClassNames(
            classMap.actionBtn,
            actionButtonClassName,
          )}
          data-testid={`${testId}-action`}
        >
          {actionLabel}
        </Button>
      )}
    </section>
  );
};

BaseEmptyState.displayName = "BaseEmptyState";
export default BaseEmptyState;
