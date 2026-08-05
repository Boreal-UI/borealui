import { HTMLAttributes } from "react";
import { combineClassNames } from "@/utils/classNames";
import { capitalize } from "@/utils/capitalize";
import { expandClassMap, resolvePropAlias } from "@/utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultTheme,
  getShadowClassName,
} from "@/config/boreal-style-config";
import {
  ValidationSummaryItem,
  ValidationSummaryProps,
} from "../ValidationSummary.types";
import styles from "../next/ValidationSummary.module.scss";

export type ServerValidationSummaryProps = Omit<
  ValidationSummaryProps,
  "focusOnMount" | "onItemClick"
>;

const normalizeItem = (
  item: ValidationSummaryItem | string,
): ValidationSummaryItem =>
  typeof item === "string" ? { message: item } : item;

export default function ValidationSummary({
  children,
  items = [],
  label,
  title,
  icon,
  iconAriaLabel,
  headerClassName,
  iconClassName,
  description,
  labelPosition = "top",
  titleAs: TitleTag = "h2",
  role = "alert",
  focusable = true,
  hideWhenEmpty = true,
  emptyMessage,
  listLabel = "Validation issues",
  theme = getDefaultTheme(),
  state,
  variant = getDefaultVariant(),
  rounding = getDefaultRounding(),
  shadow,
  disabled = false,
  loading = false,
  loadingMessage = "Checking validation",
  className,
  containerClassName,
  labelClassName,
  titleClassName,
  descriptionClassName,
  listClassName,
  itemClassName,
  linkClassName,
  contentClassName,
  emptyClassName,
  srOnlyText,
  srOnlyClassName,
  "data-testid": dataTestId,
  testId = dataTestId ?? "validation-summary",
  ...rest
}: ServerValidationSummaryProps) {
  const classMap = expandClassMap(styles);
  const normalizedItems = items.map(normalizeItem);
  const hasItems = normalizedItems.length > 0;
  const hasVisibleContent =
    hasItems || Boolean(children || emptyMessage || loading);
  if (hideWhenEmpty && !hasVisibleContent) return null;

  const {
    id: idProp,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    tabIndex: tabIndexProp,
    ...restRoot
  } = rest as HTMLAttributes<HTMLDivElement>;
  const rootId = idProp ?? testId;
  const resolvedTitle = title ?? label ?? "There is a problem";
  const titleId = resolvedTitle ? `${rootId}-title` : undefined;
  const descriptionId = description ? `${rootId}-description` : undefined;
  const listId = hasItems ? `${rootId}-list` : undefined;
  const srDescriptionId = srOnlyText ? `${rootId}-sr-description` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, listId, srDescriptionId]
      .filter(Boolean)
      .join(" ") || undefined;
  const labelledBy =
    [ariaLabelledBy, titleId].filter(Boolean).join(" ") || undefined;
  const position = resolvePropAlias(labelPosition);
  const containerClass = combineClassNames(
    classMap.container,
    classMap[`label${capitalize(position)}`],
    containerClassName,
  );
  const rootClass = combineClassNames(
    classMap.root,
    classMap[theme],
    state && classMap[state],
    (variant === "outline" || variant === "glassOutline") && classMap.outline,
    (variant === "glass" || variant === "glassOutline") && classMap.glass,
    disabled && classMap.disabled,
    loading && classMap.loading,
    !hasItems && classMap.empty,
    getShadowClassName(classMap, theme, shadow),
    rounding && classMap[`round${capitalize(rounding)}`],
    className,
  );

  return (
    <div className={containerClass} data-testid={testId}>
      <div
        {...restRoot}
        id={rootId}
        className={rootClass}
        role={role}
        aria-live={role === "alert" ? "assertive" : "polite"}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        aria-describedby={describedBy}
        aria-labelledby={labelledBy}
        tabIndex={focusable ? (tabIndexProp ?? -1) : tabIndexProp}
        data-testid={`${testId}-root`}
      >
        {loading ? (
          <div
            className={classMap.loadingRow}
            role="status"
            data-testid={`${testId}-loading`}
          >
            <span
              className={classMap.loader}
              aria-hidden
              data-testid={`${testId}-loader`}
            />
            <span className={classMap.loadingMessage}>{loadingMessage}</span>
          </div>
        ) : null}
        {resolvedTitle || icon ? (
          <div
            className={combineClassNames(classMap.header, headerClassName)}
            data-testid={`${testId}-header`}
          >
            {icon ? (
              <span
                className={combineClassNames(classMap.icon, iconClassName)}
                aria-hidden={iconAriaLabel ? undefined : true}
                aria-label={iconAriaLabel}
                role={iconAriaLabel ? "img" : undefined}
                data-testid={`${testId}-icon`}
              >
                {icon}
              </span>
            ) : null}
            {resolvedTitle ? (
              <TitleTag
                id={titleId}
                className={combineClassNames(
                  classMap.title,
                  classMap.label,
                  labelClassName,
                  titleClassName,
                )}
                data-testid={`${testId}-label`}
              >
                {resolvedTitle}
              </TitleTag>
            ) : null}
          </div>
        ) : null}
        {description ? (
          <p
            id={descriptionId}
            className={combineClassNames(
              classMap.description,
              descriptionClassName,
            )}
            data-testid={`${testId}-description`}
          >
            {description}
          </p>
        ) : null}
        {hasItems ? (
          <ul
            id={listId}
            className={combineClassNames(classMap.list, listClassName)}
            aria-label={listLabel}
            data-testid={`${testId}-list`}
          >
            {normalizedItems.map((item, index) => {
              const href =
                item.href ?? (item.fieldId ? `#${item.fieldId}` : undefined);
              return (
                <li
                  key={item.id ?? item.fieldId ?? String(index)}
                  className={combineClassNames(classMap.item, itemClassName)}
                  data-testid={`${testId}-item-${index}`}
                >
                  {href ? (
                    <a
                      className={combineClassNames(
                        classMap.link,
                        linkClassName,
                      )}
                      href={href}
                      data-testid={`${testId}-item-${index}-link`}
                    >
                      {item.message}
                    </a>
                  ) : (
                    <span
                      className={combineClassNames(
                        classMap.link,
                        linkClassName,
                      )}
                    >
                      {item.message}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : emptyMessage ? (
          <p
            className={combineClassNames(classMap.emptyMessage, emptyClassName)}
            data-testid={`${testId}-empty`}
          >
            {emptyMessage}
          </p>
        ) : null}
        {children ? (
          <div
            className={combineClassNames(classMap.content, contentClassName)}
            data-testid={`${testId}-content`}
          >
            {children}
          </div>
        ) : null}
        {srOnlyText ? (
          <span
            id={srDescriptionId}
            className={combineClassNames("sr_only", srOnlyClassName)}
          >
            {srOnlyText}
          </span>
        ) : null}
      </div>
    </div>
  );
}
