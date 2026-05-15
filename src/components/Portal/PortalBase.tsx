import { forwardRef, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { PortalBaseProps } from "./Portal.types";
import { combineClassNames } from "../../utils/classNames";

const getContainer = (
  container: PortalBaseProps["container"],
): Element | DocumentFragment | null => {
  if (typeof document === "undefined") return null;
  if (!container) return document.body;
  if (typeof container === "string") return document.querySelector(container);
  return container;
};

const PortalBase = forwardRef<HTMLDivElement, PortalBaseProps>(
  (
    {
      children,
      label: _label,
      labelPosition: _labelPosition,
      container,
      disabled = false,
      theme: _theme,
      state: _state,
      outline: _outline,
      glass: _glass,
      rounding: _rounding,
      shadow: _shadow,
      loading: _loading,
      renderInlineUntilMounted = false,
      classMap,
      className,
      containerClassName: _containerClassName,
      labelClassName: _labelClassName,
      contentClassName: _contentClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "portal",
      ...rest
    },
    ref,
  ) => {
    void _label;
    void _labelPosition;
    void _theme;
    void _state;
    void _outline;
    void _glass;
    void _rounding;
    void _shadow;
    void _loading;
    void _containerClassName;
    void _labelClassName;
    void _contentClassName;

    const [target, setTarget] = useState<Element | DocumentFragment | null>(
      null,
    );

    useEffect(() => {
      setTarget(getContainer(container));
    }, [container]);

    const portalClassName = useMemo(
      () => combineClassNames(classMap.root, className),
      [classMap.root, className],
    );

    const node = (
      <div ref={ref} className={portalClassName} data-testid={testId} {...rest}>
        {children}
        {srOnlyText ? (
          <span
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
    );

    if (disabled) return node;
    if (!target) return renderInlineUntilMounted ? node : null;

    return createPortal(node, target);
  },
);

PortalBase.displayName = "PortalBase";
export default PortalBase;
