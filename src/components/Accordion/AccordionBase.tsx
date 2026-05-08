import React, { useMemo, useState, KeyboardEvent, useEffect } from "react";
import { AccordionProps } from "./Accordion.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

export interface AccordionBaseProps extends AccordionProps {
  getUniqueId: () => string;
  classMap: Record<string, string>;
}

export const AccordionBase: React.FC<AccordionBaseProps> = ({
  title,
  id,
  children,
  lazyLoad = false,
  iconPosition = "right",
  isToggleable = true,
  asyncContent = false,
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  description,
  size = getDefaultSize(),
  theme = getDefaultTheme(),
  state = "",
  outline = false,
  glass = false,
  expanded,
  disabled,
  customCollapsedIcon,
  customExpandedIcon,
  onToggle,
  initiallyExpanded = false,
  className = "",
  getUniqueId,
  classMap,
  regionAriaLabel,
  regionAriaLabelledBy,
  regionAriaDescribedBy,
  loadingAriaLabel,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": testId = "accordion",
  ...rest
}) => {
  const isControlled = expanded !== undefined;
  const internalId = useMemo(getUniqueId, []);
  const [internalExpanded, setInternalExpanded] = useState(initiallyExpanded);
  const [hasBeenExpanded, setHasBeenExpanded] = useState(initiallyExpanded);
  const [isLoading, setIsLoading] = useState(asyncContent && initiallyExpanded);

  const isExpanded = isControlled ? expanded : internalExpanded;

  const baseId = id || internalId;
  const contentId = `${baseId}-content`;
  const buttonId = `${baseId}-button`;
  const descId = description ? `${baseId}-desc` : undefined;
  const loadingId = `${baseId}-loading`;

  const buttonDescribedBy =
    [descId, ariaDescribedBy].filter(Boolean).join(" ") || undefined;

  const regionLabelledBy =
    regionAriaLabelledBy || (!regionAriaLabel ? buttonId : undefined);

  const regionDescribedBy =
    [
      regionAriaDescribedBy,
      asyncContent && isExpanded && isLoading ? loadingId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const toggleAccordion = () => {
    if (disabled) return;
    if (!isToggleable && isExpanded) return;

    if (isControlled) {
      onToggle?.(!expanded);
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleAccordion();
    }
  };

  useEffect(() => {
    if (isExpanded && !hasBeenExpanded) {
      setHasBeenExpanded(true);
    }
  }, [isExpanded, hasBeenExpanded]);

  useEffect(() => {
    if (asyncContent && isExpanded) {
      setIsLoading(true);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [asyncContent, isExpanded]);

  const renderedIcon = isExpanded
    ? (customExpandedIcon ?? "−")
    : (customCollapsedIcon ?? "+");

  const wrapperClassName = useMemo(
    () =>
      combineClassNames(
        classMap.accordion,
        classMap[size],
        classMap[state],
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        disabled && classMap.disabled,
        isExpanded && classMap.expanded,
        className,
      ),
    [
      classMap,
      size,
      state,
      glass,
      shadow,
      rounding,
      disabled,
      isExpanded,
      className,
    ],
  );

  const headerClassName = useMemo(
    () =>
      combineClassNames(
        classMap.header,
        classMap[theme],
        classMap[state],
        outline && classMap.outline,
        glass && classMap.glass,
        disabled && classMap.disabled,
        isExpanded && classMap.expanded,
      ),
    [classMap, theme, state, outline, glass, disabled, isExpanded],
  );

  const contentClassName = useMemo(
    () =>
      combineClassNames(
        classMap.content,
        glass && classMap[theme],
        glass && classMap[state],
        glass && classMap.glass,
        isExpanded && classMap.expanded,
      ),
    [classMap, glass, theme, state, isExpanded],
  );

  const iconClassName = useMemo(
    () => combineClassNames(classMap.icon, isExpanded && classMap.expanded),
    [classMap, isExpanded],
  );

  return (
    <div {...rest} className={wrapperClassName}>
      <button
        id={buttonId}
        className={headerClassName}
        onClick={toggleAccordion}
        onKeyDown={handleKeyDown}
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={buttonDescribedBy}
        tabIndex={disabled ? -1 : 0}
        disabled={disabled}
        data-testid={testId ? `${testId}-accordion-toggle` : undefined}
      >
        {iconPosition === "left" && (
          <span
            className={iconClassName}
            aria-hidden="true"
            data-testid={testId ? `${testId}-icon` : undefined}
          >
            {renderedIcon}
          </span>
        )}

        <span
          className={classMap.accordionTitle}
          data-testid={testId ? `${testId}-title` : undefined}
        >
          {title}
        </span>

        {iconPosition === "right" && (
          <span
            className={iconClassName}
            aria-hidden="true"
            data-testid={testId ? `${testId}-icon` : undefined}
          >
            {renderedIcon}
          </span>
        )}
      </button>

      {description && (
        <span
          id={descId}
          className="sr_only"
          data-testid={testId ? `${testId}-description` : undefined}
        >
          {description}
        </span>
      )}

      <div
        id={contentId}
        role="region"
        aria-label={regionAriaLabel}
        aria-labelledby={regionLabelledBy}
        aria-describedby={regionDescribedBy}
        aria-busy={asyncContent && isExpanded && isLoading ? true : undefined}
        className={contentClassName}
        data-state={isExpanded ? "open" : "collapsed"}
        data-testid={testId ? `${testId}-content` : undefined}
      >
        {isExpanded && asyncContent && isLoading && (
          <div
            id={loadingId}
            className={classMap.loading}
            aria-live="polite"
            aria-atomic="true"
            data-testid={testId ? `${testId}-loading` : undefined}
          >
            {loadingAriaLabel || "Loading content"}
          </div>
        )}

        {(!lazyLoad || hasBeenExpanded) &&
          (!asyncContent || !isLoading) &&
          children}
      </div>
    </div>
  );
};

AccordionBase.displayName = "AccordionBase";
