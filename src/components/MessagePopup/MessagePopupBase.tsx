import React, {
  useEffect,
  useRef,
  useState,
  useId,
  useCallback,
  KeyboardEvent,
} from "react";
import ReactDOM from "react-dom";
import { CloseIcon } from "../../Icons";
import { BaseMessagePopupProps } from "./MessagePopup.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
} from "../../config/boreal-style-config";

const BaseMessagePopup: React.FC<BaseMessagePopupProps> = ({
  message,
  title,
  onClose,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  className,
  contentClassName,
  headerClassName,
  titleClassName,
  closeButtonClassName,
  bodyClassName,
  messageClassName,
  actionsClassName,
  confirmButtonClassName,
  cancelButtonClassName,
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  dialogRole = "dialog",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-live": ariaLive,
  "aria-label-close-button": ariaLabelCloseButton = "Close",
  "data-testid": dataTestId,
  testId = dataTestId ?? "message-popup",
  Button,
  IconButton,
  classMap,
}) => {
  const uid = useId();
  const titleId = `${uid}-title`;
  const messageId = `${uid}-message`;

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const focusablesRef = useRef<HTMLElement[]>([]);

  const hasConfirm = typeof onConfirm === "function";
  const hasCancel = typeof onCancel === "function";

  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    openerRef.current = (document.activeElement as HTMLElement) ?? null;

    const portalId = "popup-portal";
    let portal = document.getElementById(portalId);
    if (!portal) {
      portal = document.createElement("div");
      portal.id = portalId;
      document.body.appendChild(portal);
    }
    setPortalElement(portal);

    document.body.classList.add("no-scroll");

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
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", handleEsc);
      hidden.forEach((el) => el.removeAttribute("aria-hidden"));
      openerRef.current?.focus?.();
    };
  }, [handleClose]);

  useEffect(() => {
    if (!dialogRef.current) return;

    focusablesRef.current = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

    if (hasConfirm && confirmBtnRef.current) {
      (confirmBtnRef.current as HTMLElement).focus();
    } else if (hasCancel && cancelBtnRef.current) {
      (cancelBtnRef.current as HTMLElement).focus();
    } else if (closeBtnRef.current) {
      (closeBtnRef.current as HTMLElement).focus();
    }
  }, [hasConfirm, hasCancel, portalElement]);

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

  const resolvedAriaLabelledBy = ariaLabel
    ? undefined
    : (ariaLabelledBy ?? (title ? titleId : messageId));

  const resolvedAriaDescribedBy = ariaDescribedBy ?? messageId;

  const wrapperClassName = combineClassNames(
    classMap.wrapper,
    shadow && classMap[`shadow${capitalize(shadow)}`],
    rounding && classMap[`round${capitalize(rounding)}`],
    className,
  );

  const dialogClassName = combineClassNames(classMap.content, contentClassName);

  if (!portalElement) return null;

  const closeButton = (
    <IconButton
      ref={closeBtnRef}
      className={combineClassNames(classMap.close, closeButtonClassName)}
      icon={CloseIcon}
      aria-label={ariaLabelCloseButton}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        handleClose();
      }}
      data-testid={`${testId}-close`}
      type="button"
    />
  );

  return ReactDOM.createPortal(
    // The non-interactive overlay only observes pointer events to dismiss the dialog.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={wrapperClassName}
      onMouseDown={handleClose}
      data-testid={testId}
    >
      {/* The dialog stops overlay dismissal; keyboard behavior is handled below. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        ref={dialogRef}
        className={dialogClassName}
        onMouseDown={(e) => e.stopPropagation()}
        role={dialogRole}
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
        aria-describedby={resolvedAriaDescribedBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        data-testid={`${testId}-dialog`}
      >
        {title ? (
          <div
            className={combineClassNames(classMap.header, headerClassName)}
            data-testid={`${testId}-header`}
          >
            <h2
              id={titleId}
              className={combineClassNames(classMap.title, titleClassName)}
              data-testid={`${testId}-title`}
            >
              {title}
            </h2>
            {closeButton}
          </div>
        ) : (
          closeButton
        )}

        <div
          className={combineClassNames(classMap.body, bodyClassName)}
          data-testid={`${testId}-body`}
        >
          <p
            id={messageId}
            className={combineClassNames(classMap.message, messageClassName)}
            aria-live={ariaLive}
            data-testid={`${testId}-message`}
          >
            {message}
          </p>
        </div>

        {(hasConfirm || hasCancel) && (
          <div
            className={combineClassNames(classMap.actions, actionsClassName)}
            data-testid={`${testId}-actions`}
          >
            {hasConfirm && (
              <Button
                ref={confirmBtnRef}
                className={combineClassNames(
                  classMap.confirm,
                  confirmButtonClassName,
                )}
                onClick={() => onConfirm?.()}
                data-testid={`${testId}-confirm`}
                type="button"
              >
                {confirmText}
              </Button>
            )}
            {hasCancel && (
              <Button
                ref={cancelBtnRef}
                className={combineClassNames(
                  classMap.cancel,
                  cancelButtonClassName,
                )}
                onClick={() => onCancel?.()}
                data-testid={`${testId}-cancel`}
                type="button"
              >
                {cancelText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>,
    portalElement,
  );
};

BaseMessagePopup.displayName = "BaseMessagePopup";
export default BaseMessagePopup;
