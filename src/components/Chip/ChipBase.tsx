import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChipBaseProps } from "./Chip.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const ChipBase: React.FC<ChipBaseProps> = ({
  id,
  message,
  visible,
  onClose,
  icon: Icon,
  iconDecorative = true,
  iconAriaLabel,
  size = getDefaultSize(),
  theme = getDefaultTheme(),
  glass = false,
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  state = "",
  position = "topCenter",
  usePortal = true,
  className = "",
  autoClose = true,
  duration = 3000,
  closeIcon: CloseIcon,
  IconButtonComponent,
  classMap,
  stackIndex,
  role = "alert",
  closeButtonAriaLabel = "Close notification",
  messageId,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-live": ariaLive,
  "aria-atomic": ariaAtomic,
  "aria-relevant": ariaRelevant,
  "aria-hidden": ariaHidden,
  "data-testid": testId = "chip",
  ...rest
}) => {
  const [closing, setClosing] = useState(false);

  const resolvedMessageId = useMemo(
    () => messageId ?? `${id || testId}-message`,
    [messageId, id, testId],
  );

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => onClose?.(), 300);
  }, [onClose]);

  useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => handleClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, visible, handleClose]);

  useEffect(() => {
    if (visible) setClosing(false);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, handleClose]);

  if (!visible && !closing) return null;

  const chipClassName = combineClassNames(
    classMap.chip,
    classMap[theme],
    classMap[state],
    classMap[size],
    classMap[position],
    glass && classMap.glass,
    shadow && classMap[`shadow${capitalize(shadow)}`],
    rounding && classMap[`round${capitalize(rounding)}`],
    closing && classMap.fadeout,
    usePortal && classMap.fixed,
    className,
  );

  const portalEl =
    typeof window !== "undefined"
      ? document.getElementById("widget-portal")
      : null;

  const chipElement = (
    <div
      key={id}
      id={id}
      className={chipClassName}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-live={ariaLive ?? (role === "alert" ? "assertive" : "polite")}
      aria-atomic={ariaAtomic ?? true}
      aria-relevant={ariaRelevant}
      aria-hidden={ariaHidden}
      data-testid={testId}
      style={stackIndex != null ? { zIndex: stackIndex } : undefined}
      {...rest}
    >
      {Icon && (
        <span
          className={classMap.icon}
          aria-hidden={iconDecorative ? "true" : undefined}
          aria-label={!iconDecorative ? iconAriaLabel : undefined}
          data-testid={`${testId}-icon`}
        >
          <Icon className={classMap.inner_icon} />
        </span>
      )}

      <span
        className={classMap.message}
        id={resolvedMessageId}
        data-testid={`${testId}-message`}
      >
        {message}
      </span>

      <IconButtonComponent
        icon={CloseIcon}
        size={size}
        theme="clear"
        aria-label={closeButtonAriaLabel}
        aria-controls={resolvedMessageId}
        className={classMap.close}
        onClick={handleClose}
        shadow="none"
        data-testid={`${testId}-chip-close`}
      />
    </div>
  );

  if (usePortal && portalEl) {
    return createPortal(chipElement, portalEl);
  }

  return chipElement;
};

ChipBase.displayName = "ChipBase";
export default ChipBase;
