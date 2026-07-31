import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  HTMLAttributes,
} from "react";
import {
  ValidationSummaryBaseProps,
  ValidationSummaryItem,
} from "./ValidationSummary.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const normalizeItem = (
  item: ValidationSummaryItem | string,
): ValidationSummaryItem =>
  typeof item === "string" ? { message: item } : item;

const ValidationSummaryBase = forwardRef<
  HTMLDivElement,
  ValidationSummaryBaseProps
>(
  (
    {
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
      focusOnMount = false,
      hideWhenEmpty = true,
      emptyMessage,
      listLabel = "Validation issues",
      onItemClick,
      theme = getDefaultTheme(),
      state,
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      disabled = false,
      loading = false,
      loadingMessage = "Checking validation",
      classMap,
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
    },
    ref,
  ) => {
    const generatedId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const normalizedItems = useMemo(() => items.map(normalizeItem), [items]);
    const hasItems = normalizedItems.length > 0;
    const hasContent = Boolean(children);
    const hasVisibleContent =
      hasItems || hasContent || Boolean(emptyMessage) || loading;
    const resolvedTitle = title ?? label ?? "There is a problem";
    const shouldRender = !hideWhenEmpty || hasVisibleContent;

    useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

    useEffect(() => {
      if (focusOnMount && hasItems && rootRef.current) {
        rootRef.current.focus();
      }
    }, [focusOnMount, hasItems]);

    const {
      id: idProp,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      tabIndex: tabIndexProp,
      ...restRoot
    } = rest as HTMLAttributes<HTMLDivElement> & {
      "aria-describedby"?: string;
      "aria-labelledby"?: string;
    };

    const rootId = idProp ?? `${testId}-${generatedId}`;
    const titleId = resolvedTitle ? `${rootId}-title` : undefined;
    const descriptionId = description ? `${rootId}-description` : undefined;
    const listId = hasItems ? `${rootId}-list` : undefined;
    const srDescriptionId = srOnlyText ? `${rootId}-sr-description` : undefined;
    const computedAriaDescribedBy =
      [ariaDescribedBy, descriptionId, listId, srDescriptionId]
        .filter(Boolean)
        .join(" ") || undefined;
    const computedAriaLabelledBy =
      [ariaLabelledBy, titleId].filter(Boolean).join(" ") || undefined;
    const tabIndex = focusable ? (tabIndexProp ?? -1) : tabIndexProp;

    const containerClass = useMemo(
      () =>
        combineClassNames(
          classMap.container,
          classMap[`label${capitalize(resolvedLabelPosition)}`],
          containerClassName,
        ),
      [classMap, resolvedLabelPosition, containerClassName],
    );

    const rootClass = useMemo(
      () =>
        combineClassNames(
          classMap.root,
          classMap[theme],
          state && classMap[state],
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          disabled && classMap.disabled,
          loading && classMap.loading,
          !hasItems && classMap.empty,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        theme,
        state,
        variant,
        disabled,
        loading,
        hasItems,
        shadow,
        rounding,
        className,
      ],
    );

    if (!shouldRender) return null;

    return (
      <div className={containerClass} data-testid={testId}>
        <div
          ref={rootRef}
          id={rootId}
          className={rootClass}
          role={role}
          aria-live={role === "alert" ? "assertive" : "polite"}
          aria-busy={loading || undefined}
          aria-disabled={disabled || undefined}
          aria-describedby={computedAriaDescribedBy}
          aria-labelledby={computedAriaLabelledBy}
          tabIndex={tabIndex}
          data-testid={`${testId}-root`}
          {...restRoot}
        >
          {loading ? (
            <div
              className={classMap.loadingRow}
              role="status"
              data-testid={`${testId}-loading`}
            >
              <span
                className={classMap.loader}
                aria-hidden="true"
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
                const itemKey = item.id ?? item.fieldId ?? String(index);
                const href =
                  item.href ?? (item.fieldId ? `#${item.fieldId}` : undefined);
                const handleClick = () => onItemClick?.(item, index);

                return (
                  <li
                    key={itemKey}
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
                        onClick={handleClick}
                        data-testid={`${testId}-item-${index}-link`}
                      >
                        {item.message}
                      </a>
                    ) : (
                      <button
                        className={combineClassNames(
                          classMap.button,
                          linkClassName,
                        )}
                        type="button"
                        disabled={disabled}
                        onClick={handleClick}
                        data-testid={`${testId}-item-${index}-button`}
                      >
                        {item.message}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : emptyMessage ? (
            <p
              className={combineClassNames(
                classMap.emptyMessage,
                emptyClassName,
              )}
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
              className={combineClassNames(
                classMap.srOnly ?? "sr_only",
                srOnlyClassName,
              )}
              data-testid={`${testId}-sr-only-text`}
            >
              {srOnlyText}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);

ValidationSummaryBase.displayName = "ValidationSummaryBase";
export default ValidationSummaryBase;
