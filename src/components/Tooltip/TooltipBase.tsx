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
import { TooltipProps, TriggerElementProps } from "./Tooltip.types";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

function mergeIds(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ") || undefined;
}

function callAll<E>(...handlers: Array<((event: E) => void) | undefined>) {
  return (event: E) => {
    handlers.forEach((handler) => handler?.(event));
  };
}

const TooltipBase = forwardRef<
  HTMLDivElement,
  TooltipProps & { classMap: Record<string, string> }
>(function TooltipBase(
  {
    content,
    position = "top",
    theme = getDefaultTheme(),
    glass = getDefaultGlass(),
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
        classMap[position],
        classMap[theme],
        state && classMap[state],
        glass && classMap.glass,
        visible && classMap.visible,
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
      ),
    [classMap, position, theme, state, glass, visible, shadow, rounding],
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
      onMouseEnter: callAll<React.MouseEvent<HTMLElement>>(
        childProps.onMouseEnter,
        show,
      ),
      onMouseLeave: callAll<React.MouseEvent<HTMLElement>>(
        childProps.onMouseLeave,
        hide,
      ),
      onFocus: callAll<React.FocusEvent<HTMLElement>>(childProps.onFocus, show),
      onBlur: callAll<React.FocusEvent<HTMLElement>>(childProps.onBlur, hide),
    });
  } else {
    trigger = (
      <span
        id={triggerId}
        role="button"
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
          ref={ref}
          id={tooltipId}
          className={toolTipClassName}
          role="tooltip"
          aria-hidden={!visible}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-testid={testId}
          {...rest}
        >
          {content}
        </div>
      )}
    </div>
  );
});

TooltipBase.displayName = "TooltipBase";
export default TooltipBase;
