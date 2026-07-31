import { useEffect, useId, useMemo, useRef, useState } from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { DrawerBaseProps } from "./Drawer.types";

export default function DrawerBase({
  open = false,
  onClose,
  children,
  title,
  header,
  footer,
  placement = "right",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  theme = getDefaultTheme(),
  state,
  variant = getDefaultVariant(),
  rounding = getDefaultRounding(),
  shadow,
  className,
  overlayClassName,
  panelClassName,
  headerClassName,
  titleClassName,
  bodyClassName,
  footerClassName,
  closeButtonClassName,
  closeButtonAriaLabel = "Close drawer",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  testId,
  "data-testid": dataTestId,
  classMap,
}: DrawerBaseProps) {
  const resolvedTestId = testId ?? dataTestId ?? "drawer";
  const generatedTitleId = useId();
  const titleId = ariaLabelledBy ?? (title ? generatedTitleId : undefined);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isRendered, setIsRendered] = useState(open);

  useEffect(() => {
    if (open) {
      setIsRendered(true);
      return;
    }

    if (!isRendered) return;

    const timer = window.setTimeout(() => setIsRendered(false), 160);
    return () => window.clearTimeout(timer);
  }, [open, isRendered]);

  useEffect(() => {
    if (!open || !isRendered) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [open, isRendered, closeOnEscape, onClose]);

  const rootClassName = useMemo(
    () =>
      combineClassNames(
        classMap.drawer,
        open && classMap.open,
        classMap[placement],
        className,
      ),
    [classMap, open, placement, className],
  );

  const panelClasses = useMemo(
    () =>
      combineClassNames(
        classMap.panel,
        classMap[theme],
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        state && classMap[state],
        panelClassName,
      ),
    [classMap, theme, variant, shadow, rounding, panelClassName, state],
  );

  if (!isRendered) return null;

  return (
    <div className={rootClassName} data-testid={resolvedTestId}>
      <button
        type="button"
        className={combineClassNames(classMap.overlay, overlayClassName)}
        aria-label={closeButtonAriaLabel}
        onClick={closeOnOverlayClick ? onClose : undefined}
        data-testid={`${resolvedTestId}-overlay`}
      />
      <section
        className={panelClasses}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={ariaLabel}
        aria-labelledby={titleId}
        aria-describedby={ariaDescribedBy}
        data-testid={`${resolvedTestId}-panel`}
      >
        <div className={combineClassNames(classMap.header, headerClassName)}>
          <div className={combineClassNames(classMap.headerContent)}>
            {header ??
              (title ? (
                <h2
                  id={titleId}
                  className={combineClassNames(classMap.title, titleClassName)}
                  data-testid={`${resolvedTestId}-title`}
                >
                  {title}
                </h2>
              ) : null)}
          </div>
          <button
            ref={closeRef}
            type="button"
            className={combineClassNames(
              classMap.closeButton,
              closeButtonClassName,
            )}
            aria-label={closeButtonAriaLabel}
            onClick={onClose}
            data-testid={`${resolvedTestId}-close`}
          >
            ×
          </button>
        </div>
        <div
          className={combineClassNames(classMap.body, bodyClassName)}
          data-testid={`${resolvedTestId}-body`}
        >
          {children}
        </div>
        {footer ? (
          <div className={combineClassNames(classMap.footer, footerClassName)}>
            {footer}
          </div>
        ) : null}
      </section>
    </div>
  );
}
