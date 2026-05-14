import React, { useEffect, useState, useMemo } from "react";
import { capitalize } from "../../utils/capitalize";
import { combineClassNames } from "../../utils/classNames";
import {
  getDefaultRounding,
  getDefaultShadow,
} from "../../config/boreal-style-config";
import { ScrollToTopBaseProps } from "./ScrollToTop.types";

const ScrollToTopBase: React.FC<ScrollToTopBaseProps> = ({
  classMap,
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  IconComponent,
  offset = 300,
  className,
  "aria-label": ariaLabel = "Scroll to top",
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  title,
  role,
  wrapperAriaLabel,
  id,
  "data-testid": dataTestId,
  testId = dataTestId ?? "scroll",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;

    const update = () => {
      setIsVisible(window.scrollY > offset);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  const scrollToTop = () => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  const buttonClass = useMemo(
    () =>
      combineClassNames(
        classMap.button,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
      ),
    [classMap, shadow, rounding],
  );

  const iconClass = useMemo(() => combineClassNames(classMap.icon), [classMap]);

  return (
    <div
      id={id}
      className={combineClassNames(classMap.wrapper, className)}
      data-testid={testId}
      role={role}
      aria-label={role && wrapperAriaLabel ? wrapperAriaLabel : undefined}
    >
      {isVisible && (
        <button
          type="button"
          onClick={scrollToTop}
          className={buttonClass}
          aria-label={ariaLabelledBy ? undefined : ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          title={title ?? ariaLabel}
          data-testid={`${testId}-button`}
        >
          <IconComponent
            className={iconClass}
            aria-hidden="true"
            focusable={false}
          />
        </button>
      )}
    </div>
  );
};

ScrollToTopBase.displayName = "ScrollToTopBase";
export default ScrollToTopBase;
