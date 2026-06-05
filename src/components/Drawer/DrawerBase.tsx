import { useEffect, useId, useMemo, useRef } from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
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
  glass = getDefaultGlass(),
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

  useEffect(() => {
    if (!open) return;
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
  }, [open, closeOnEscape, onClose]);

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
        glass && classMap.glass,
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        state && classMap[state],
        panelClassName,
      ),
    [classMap, theme, glass, shadow, rounding, panelClassName, state],
  );

  if (!open) return null;

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
