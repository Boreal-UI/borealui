import { combineClassNames } from "@/utils/classNames";
import { capitalize } from "@/utils/capitalize";
import { expandClassMap } from "@/utils/propAliases";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultSize,
  getDefaultTheme,
  getShadowClassName,
} from "@/config/boreal-style-config";
import { EmptyStateProps } from "../EmptyState.types";
import styles from "../next/EmptyState.module.scss";

export type ServerEmptyStateProps = Omit<EmptyStateProps, "onActionClick"> & {
  actionHref?: string;
};

export default function EmptyState({
  icon: Icon,
  title = "Nothing Here Yet",
  message = "There is no content to display.",
  actionLabel,
  actionHref,
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  state,
  size = getDefaultSize(),
  rounding = getDefaultRounding(),
  shadow,
  outline = getDefaultOutline(),
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
  ...rest
}: ServerEmptyStateProps) {
  const classMap = expandClassMap(styles);
  const titleId = title && !ariaLabelledBy ? `${testId}-title` : undefined;
  const messageId = message && !ariaDescribedBy ? `${testId}-message` : undefined;
  const classes = combineClassNames(
    classMap.empty_state,
    classMap[theme],
    state && classMap[state],
    classMap[size],
    getShadowClassName(classMap, theme, shadow),
    rounding && classMap[`round${capitalize(rounding)}`],
    outline && classMap.outline,
    glass && classMap.glass,
    className,
  );

  return (
    <section
      {...rest}
      id={id}
      className={classes}
      role={role ?? (title ? "region" : undefined)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy ?? (!ariaLabel ? titleId : undefined)}
      aria-describedby={ariaDescribedBy ?? messageId}
      data-testid={testId}
    >
      {Icon ? (
        <div
          className={combineClassNames(classMap.icon, iconClassName)}
          aria-hidden={iconDecorative || undefined}
          data-testid={`${testId}-icon`}
        >
          <Icon
            aria-hidden={iconDecorative || undefined}
            aria-label={!iconDecorative ? iconAriaLabel : undefined}
            focusable={false}
          />
        </div>
      ) : null}
      {title ? (
        <h2
          id={titleId}
          className={combineClassNames(classMap.title, titleClassName)}
          data-testid={`${testId}-title`}
        >
          {title}
        </h2>
      ) : null}
      {message ? (
        <p
          id={messageId}
          className={combineClassNames(classMap.message, messageClassName)}
          data-testid={`${testId}-message`}
        >
          {message}
        </p>
      ) : null}
      {actionLabel && actionHref ? (
        <a
          href={actionHref}
          aria-label={actionAriaLabel}
          className={combineClassNames(classMap.actionBtn, actionButtonClassName)}
          data-testid={`${testId}-action`}
        >
          {actionLabel}
        </a>
      ) : null}
    </section>
  );
}
