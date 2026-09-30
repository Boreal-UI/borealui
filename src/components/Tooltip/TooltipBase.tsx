import React, {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useState,
  isValidElement,
  cloneElement,
} from "react";
import { combineClassNames } from "../../utils/classNames";
import { composeEventHandlers } from "../../utils/eventHandlers";
import { TooltipProps, TriggerElementProps } from "./Tooltip.types";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

function mergeIds(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ") || undefined;
}

const TooltipBase = forwardRef<
  HTMLDivElement,
  TooltipProps & { classMap: Record<string, string> }
>(function TooltipBase(
  {
    content,
    placement = "top",
    theme = getDefaultTheme(),
    variant = getDefaultVariant(),
    rounding = getDefaultRounding(),
    shadow,
    state,
    children,
    className,
    id,
    triggerId,
    triggerAriaLabel,
    triggerAriaLabelledBy,
    triggerAriaDescribedBy,
    keepMountedWhenHidden = true,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "data-testid": dataTestId,
    testId = dataTestId ?? "tooltip",
    classMap,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const tooltipId = id ?? generatedId;

  const [visible, setVisible] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  useEffect(() => {
    if (!visible) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible]);

  const toolTipClassName = useMemo(
    () =>
      combineClassNames(
        classMap.tooltip,
        classMap[placement],
        classMap[theme],
        state && classMap[state],
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        visible && classMap.visible,
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
      ),
    [classMap, placement, theme, state, variant, visible, shadow, rounding],
  );

  let trigger: React.ReactNode;

  if (isValidElement(children)) {
    const child = children as React.ReactElement<TriggerElementProps>;
    const childProps = child.props;

    const isNaturallyFocusable =
      typeof child.type === "string" &&
      ["a", "button", "input", "textarea", "select"].includes(child.type);

    const maybeTabIndex =
      isNaturallyFocusable || childProps.tabIndex !== undefined
        ? {}
        : { tabIndex: 0 };

    const mergedAriaDescribedBy = mergeIds(
      childProps["aria-describedby"],
      triggerAriaDescribedBy,
      visible ? tooltipId : undefined,
    );

    trigger = cloneElement(child, {
      ...maybeTabIndex,
      id: triggerId ?? childProps.id,
      "aria-label": triggerAriaLabel ?? childProps["aria-label"],
      "aria-labelledby": triggerAriaLabelledBy ?? childProps["aria-labelledby"],
      "aria-describedby": mergedAriaDescribedBy,
      "data-testid": `${testId}-trigger`,
      onMouseEnter: composeEventHandlers<React.MouseEvent<HTMLElement>>(
        childProps.onMouseEnter,
        show,
      ),
      onMouseLeave: composeEventHandlers<React.MouseEvent<HTMLElement>>(
        childProps.onMouseLeave,
        hide,
      ),
      onFocus: composeEventHandlers<React.FocusEvent<HTMLElement>>(
        childProps.onFocus,
        show,
      ),
      onBlur: composeEventHandlers<React.FocusEvent<HTMLElement>>(
        childProps.onBlur,
        hide,
      ),
    });
  } else {
    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-tabindex -- A text tooltip needs a neutral, focusable discovery target, not a false interactive role. */
    trigger = (
      <span
        id={triggerId}
        tabIndex={0}
        className={classMap.triggerWrapper}
        aria-label={triggerAriaLabel}
        aria-labelledby={triggerAriaLabelledBy}
        aria-describedby={mergeIds(
          triggerAriaDescribedBy,
          visible ? tooltipId : undefined,
        )}
        data-testid={`${testId}-trigger`}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-tabindex */
  }

  const shouldRenderTooltip = keepMountedWhenHidden || visible;

  return (
    <div
      className={combineClassNames(classMap.container, className)}
      data-testid={`${testId}-container`}
    >
      {trigger}

      {shouldRenderTooltip && (
        <div
          {...rest}
          ref={ref}
          id={tooltipId}
          className={toolTipClassName}
          role="tooltip"
          aria-hidden={!visible}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-testid={testId}
        >
          {content}
        </div>
      )}
    </div>
  );
});

TooltipBase.displayName = "TooltipBase";
export default TooltipBase;
