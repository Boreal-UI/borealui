import React, {
  useEffect,
  useRef,
  useState,
  useId,
  KeyboardEvent,
  useCallback,
} from "react";
import ReactDOM from "react-dom";
import { CloseIcon } from "../../Icons";
import { BaseModalProps } from "./Modal.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
} from "../../config/boreal-style-config";

const BaseModal: React.FC<BaseModalProps> = ({
  className,
  overlayClassName,
  headerClassName,
  headerContentClassName,
  titleClassName,
  closeButtonClassName,
  bodyClassName,
  footerClassName,
  children,
  title = "Modal Dialog",
  header,
  footer,
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  open,
  onClose,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  closeButtonAriaLabel = "Close modal",
  "data-testid": dataTestId,
  testId = dataTestId ?? "modal",
  IconButton,
  classMap,
  portalId = "widget-portal",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  const isControlled = typeof open === "boolean";
  const shouldBeOpen = isControlled ? open : true;

  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const focusablesRef = useRef<HTMLElement[]>([]);
  const closeTimerRef = useRef<number | null>(null);

  const uid = useId();
  const fallbackLabelId = `${uid}-label`;

  const handleClose = useCallback(() => {
    if (closeTimerRef.current !== null) return;
    setIsVisible(false);
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      onClose();
    }, 200);
  }, [onClose]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isRendered) return;

    openerRef.current = (document.activeElement as HTMLElement) ?? null;

    let portal = document.getElementById(portalId);
    if (!portal) {
      portal = document.createElement("div");
      portal.id = portalId;
      document.body.appendChild(portal);
    }
    setPortalElement(portal);
    document.body.classList.add("noScroll");

    const siblings = Array.from(document.body.children) as HTMLElement[];
    const hidden: HTMLElement[] = [];

    siblings.forEach((el) => {
      if (el !== portal && !el.hasAttribute("aria-hidden")) {
        el.setAttribute("aria-hidden", "true");
        hidden.push(el);
      }
    });

    const handleEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.classList.remove("noScroll");
      document.removeEventListener("keydown", handleEsc);
      hidden.forEach((el) => el.removeAttribute("aria-hidden"));
      openerRef.current?.focus?.();
      setPortalElement(null);
    };
  }, [isRendered, portalId, handleClose]);

  useEffect(() => {
    if (!isRendered) return;

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);

      if (dialogRef.current) {
        focusablesRef.current = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
      }

      (
        focusablesRef.current[0] ??
        closeBtnRef.current ??
        dialogRef.current
      )?.focus?.();
    });

    return () => cancelAnimationFrame(frame);
  }, [isRendered]);

  useEffect(() => {
    if (shouldBeOpen) {
      setIsRendered(true);
    } else if (isControlled) {
      setIsVisible(false);
      const t = window.setTimeout(() => setIsRendered(false), 200);
      return () => window.clearTimeout(t);
    } else {
      setIsRendered(false);
    }
  }, [shouldBeOpen, isControlled]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;

    const list = focusablesRef.current;
    if (!list.length) return;

    const first = list[0];
    const last = list[list.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!isRendered || !portalElement) return null;

  const contentClassName = combineClassNames(
    classMap.content,
    className,
    shadow && classMap[`shadow${capitalize(shadow)}`],
    rounding && classMap[`round${capitalize(rounding)}`],
  );

  const hasHeader = Boolean(header) || Boolean(title);
  const hasFooter = Boolean(footer);

  const resolvedAriaLabelledBy =
    ariaLabelledBy ?? (!ariaLabel && hasHeader ? fallbackLabelId : undefined);

  const shouldRenderFallbackLabel = resolvedAriaLabelledBy === fallbackLabelId;

  return ReactDOM.createPortal(
    <div
      ref={overlayRef}
      className={combineClassNames(
        classMap.overlay,
        isVisible ? classMap.visible : classMap.hidden,
        overlayClassName,
      )}
      onMouseDown={handleClose}
      role="presentation"
      data-testid={testId}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={dialogRef}
        className={contentClassName}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        data-testid={`${testId}-content`}
      >
        {shouldRenderFallbackLabel && (
          <h2 id={fallbackLabelId} className="sr_only">
            {typeof title === "string" ? title : "Modal Dialog"}
          </h2>
        )}

        {hasHeader && (
          <div
            className={combineClassNames(classMap.header, headerClassName)}
            data-testid={`${testId}-header`}
          >
            <div
              className={combineClassNames(
                classMap.headerContent,
                headerContentClassName,
              )}
            >
              {header ?? (
                <div
                  className={combineClassNames(classMap.title, titleClassName)}
                >
                  {title}
                </div>
              )}
            </div>

            <IconButton
              ref={closeBtnRef}
              className={combineClassNames(
                classMap.closeButton,
                closeButtonClassName,
              )}
              state="error"
              size="small"
              icon={CloseIcon}
              aria-label={closeButtonAriaLabel}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleClose();
              }}
              title="Close"
              data-testid={`${testId}-close`}
              type="button"
            />
          </div>
        )}

        {!hasHeader && (
          <IconButton
            ref={closeBtnRef}
            className={combineClassNames(
              classMap.closeButtonFloating ?? classMap.closeButton,
              closeButtonClassName,
            )}
            state="error"
            size="small"
            icon={CloseIcon}
            aria-label={closeButtonAriaLabel}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleClose();
            }}
            title="Close"
            data-testid={`${testId}-close`}
            type="button"
          />
        )}

        <div
          className={combineClassNames(classMap.body, bodyClassName)}
          data-testid={`${testId}-body`}
        >
          {children}
        </div>

        {hasFooter && (
          <div
            className={combineClassNames(classMap.footer, footerClassName)}
            data-testid={`${testId}-footer`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    portalElement,
  );
};

BaseModal.displayName = "BaseModal";
export default BaseModal;
