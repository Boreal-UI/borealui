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

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const visible = (hovered || focused) && !dismissed;
  const show = () => {
    setFocused(true);
    setDismissed(false);
  };
  const hide = () => setFocused(false);

  useEffect(() => {
    if (!visible) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDismissed(true);
        // Unmounted content may disappear before the browser emits mouseleave.
        setHovered(false);
      }
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
        (variant === "outline" || variant === "glassOutline") && classMap.outline,
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
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- Hover containment keeps tooltip content reachable; the child owns keyboard semantics.
    <div
      className={combineClassNames(classMap.container, className)}
      onMouseEnter={() => {
        setHovered(true);
        setDismissed(false);
      }}
      onMouseLeave={() => setHovered(false)}
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
