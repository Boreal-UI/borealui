import React, {
  useState,
  useRef,
  useEffect,
  JSX,
  useMemo,
  useId,
  isValidElement,
  cloneElement,
} from "react";
import { BasePopOverProps, TriggerElementProps } from "./PopOver.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const BasePopOver: React.FC<BasePopOverProps> = ({
  trigger,
  content,
  asChild = false,
  placement = "bottom",
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  state,
  className,
  contentClassName,
  role = "dialog",
  triggerAriaLabel,
  triggerTitle,
  disabled = false,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-modal": ariaModal,
  "data-testid": dataTestId,
  testId = dataTestId ?? "popover",
  classMap,
}): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [dynamicPlacement, setDynamicPlacement] = useState(placement);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const uid = useId();

  const generatedContentId = `${uid}-content`;
  const generatedLabelId = `${uid}-label`;

  const contentId = id ?? generatedContentId;
  const fallbackLabelId = generatedLabelId;

  type PopupRole = "dialog" | "menu" | "tooltip";
  const VALID_ROLES: PopupRole[] = ["dialog", "menu", "tooltip"];

  function asValidRole(r?: string): PopupRole | undefined {
    return (VALID_ROLES as readonly string[]).includes(r ?? "")
      ? (r as PopupRole)
      : undefined;
  }

  const popupRole = asValidRole(role);

  const ariaHasPopup: React.AriaAttributes["aria-haspopup"] =
    role === "dialog" ? "dialog" : role === "menu" ? "menu" : undefined;

  const triggerAria =
    role === "tooltip"
      ? { "aria-describedby": open ? contentId : undefined }
      : {
          ...(ariaHasPopup ? { "aria-haspopup": ariaHasPopup } : {}),
          "aria-expanded": open,
          "aria-controls": contentId,
        };

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const close = () => {
    setOpen(false);
    setDynamicPlacement(placement);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popoverRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      close();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, placement]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const onReflow = () => setDynamicPlacement((prev) => prev);

    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onReflow, { passive: true });
    window.addEventListener("scroll", onReflow, { passive: true });

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow);
    };
  }, [open, placement]);

  useEffect(() => {
    if (!open || !popoverRef.current || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverEl = popoverRef.current;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spaceAbove = triggerRect.top;
    const spaceBelow = vh - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = vw - triggerRect.right;

    popoverEl.style.transform = "";
    popoverEl.style.left = "";
    popoverEl.style.right = "";
    popoverEl.style.top = "";
    popoverEl.style.bottom = "";

    let newPlacement = placement;

    if (placement === "top" && popoverEl.offsetHeight > spaceAbove) {
      newPlacement = "bottom";
    } else if (placement === "bottom" && popoverEl.offsetHeight > spaceBelow) {
      newPlacement = "top";
    } else if (placement === "left" && popoverEl.offsetWidth > spaceLeft) {
      newPlacement = "right";
    } else if (placement === "right" && popoverEl.offsetWidth > spaceRight) {
      newPlacement = "left";
    }

    setDynamicPlacement(newPlacement);

    requestAnimationFrame(() => {
      const rect = popoverEl.getBoundingClientRect();
      let dx = 0;
      let dy = 0;
      const pad = 8;

      if (rect.left < pad) dx = pad - rect.left;
      else if (rect.right > vw - pad) dx = vw - pad - rect.right;

      if (rect.top < pad) dy = pad - rect.top;
      else if (rect.bottom > vh - pad) dy = vh - pad - rect.bottom;

      if (dx !== 0 || dy !== 0) {
        const tx = dx !== 0 ? `translateX(${dx}px)` : "";
        const ty = dy !== 0 ? `translateY(${dy}px)` : "";
        popoverEl.style.transform = `${tx} ${ty}`.trim();
      }
    });
  }, [open, placement, dynamicPlacement]);

  const popoverContentClass = useMemo(
    () =>
      combineClassNames(
        classMap.popover,
        classMap[dynamicPlacement],
        classMap[theme],
        state && classMap[state],
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        contentClassName,
      ),
    [
      classMap,
      dynamicPlacement,
      theme,
      state,
      glass,
      shadow,
      rounding,
      contentClassName,
    ],
  );

  useEffect(() => {
    if (!open || popupRole === "tooltip") return;

    const el = popoverRef.current;
    if (!el) return;

    const focusable = el.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    (focusable ?? el).focus();
  }, [open, popupRole]);

  const computedAriaLabelledBy =
    ariaLabelledBy ?? (!ariaLabel ? fallbackLabelId : undefined);

  const triggerProps: TriggerElementProps = {
    "aria-label": triggerAriaLabel,
    title: triggerTitle,
    disabled,
    "data-testid": `${testId}-trigger`,
    ...triggerAria,
  };

  const renderedTrigger =
    asChild && isValidElement<TriggerElementProps>(trigger) ? (
      (() => {
        const triggerEl = trigger;

        return cloneElement(triggerEl, {
          ...triggerProps,
          ...triggerEl.props,
          onClick: (e: React.MouseEvent) => {
            triggerEl.props.onClick?.(e);
            if (!e.defaultPrevented) {
              toggleOpen();
            }
          },
          ref: (node: HTMLElement | null) => {
            triggerRef.current = node;

            const childRef = (
              triggerEl as React.ReactElement<TriggerElementProps> & {
                ref?: React.Ref<HTMLElement>;
              }
            ).ref;

            if (typeof childRef === "function") {
              childRef(node);
            }
          },
        });
      })()
    ) : (
      <button
        type="button"
        className={classMap.trigger}
        onClick={toggleOpen}
        aria-label={triggerAriaLabel ?? "Toggle popover"}
        title={triggerTitle}
        ref={(node) => {
          triggerRef.current = node;
        }}
        disabled={disabled}
        data-testid={`${testId}-trigger`}
        {...triggerAria}
      >
        {trigger}
      </button>
    );

  return (
    <div
      className={combineClassNames(classMap.container, className)}
      data-testid={testId}
    >
      {renderedTrigger}

      {open && (
        <div
          ref={popoverRef}
          id={contentId}
          role={popupRole}
          aria-label={ariaLabel}
          aria-labelledby={computedAriaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-modal={popupRole === "dialog" ? ariaModal : undefined}
          className={popoverContentClass}
          data-testid={`${testId}-content`}
          tabIndex={popupRole === "tooltip" ? undefined : -1}
        >
          {!ariaLabel && !ariaLabelledBy && (
            <span id={fallbackLabelId} className={classMap.srOnly ?? "sr_only"}>
              PopOver Content
            </span>
          )}
          {content}
        </div>
      )}
    </div>
  );
};

BasePopOver.displayName = "BasePopOver";
export default BasePopOver;
