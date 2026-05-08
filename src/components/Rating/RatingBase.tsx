import React, { useState, KeyboardEvent, useMemo, useId } from "react";
import { StarIcon } from "../../Icons";
import { combineClassNames } from "../../utils/classNames";
import {
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { BaseRatingProps } from "./Rating.types";

const BaseRating: React.FC<BaseRatingProps> = ({
  id,
  value,
  onChange,
  max = 5,
  size = getDefaultSize(),
  interactive = true,
  theme = getDefaultTheme(),
  glass = false,
  state = "",
  className = "",
  label,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  starAriaLabelPrefix = "Rate",
  required = false,
  readOnly = false,
  "data-testid": dataTestId,
  testId = dataTestId ?? "rating",
  classMap,
}) => {
  const uid = useId();
  const safeMax = Math.max(1, Math.floor(max || 1));
  const clampedValue = Math.min(safeMax, Math.max(0, Math.floor(value || 0)));
  const [hover, setHover] = useState<number | null>(null);

  const ratingId = id || `${uid}-rating`;
  const labelId = label ? `${ratingId}-label` : undefined;
  const isDisabled = !interactive || state === "disabled";
  const isReadOnly = readOnly;
  const canInteract = interactive && !isReadOnly && !isDisabled;

  const resolvedAriaLabelledBy = ariaLabelledBy || labelId;
  const resolvedAriaLabel = !resolvedAriaLabelledBy
    ? ariaLabel || "Rating"
    : undefined;

  const handleClick = (index: number) => {
    if (canInteract && onChange) onChange(index + 1);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLSpanElement>,
    index: number,
  ) => {
    if (!canInteract) return;

    const commit = (v: number) => onChange?.(v);

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        commit(index + 1);
        break;
      case "ArrowRight":
      case "ArrowUp": {
        event.preventDefault();
        const next = Math.min(safeMax, clampedValue + 1) || 1;
        commit(next);
        break;
      }
      case "ArrowLeft":
      case "ArrowDown": {
        event.preventDefault();
        const prev = Math.max(1, clampedValue - 1);
        commit(prev);
        break;
      }
      case "Home":
        event.preventDefault();
        commit(1);
        break;
      case "End":
        event.preventDefault();
        commit(safeMax);
        break;
    }
  };

  const wrapperClass = useMemo(
    () =>
      combineClassNames(
        classMap.wrapper,
        classMap[theme],
        classMap[state],
        classMap[size],
        glass && classMap.glass,
        canInteract && classMap.interactive,
        className,
      ),
    [classMap, theme, state, size, glass, canInteract, className],
  );

  return (
    <div className={classMap.container || ""}>
      {label && (
        <span
          id={labelId}
          className={classMap.label}
          data-testid={`${testId}-label`}
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </span>
      )}

      <div
        id={ratingId}
        className={wrapperClass}
        role="radiogroup"
        aria-label={resolvedAriaLabel}
        aria-labelledby={resolvedAriaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-disabled={isDisabled || undefined}
        aria-readonly={isReadOnly || undefined}
        aria-required={required || undefined}
        data-testid={testId}
      >
        {Array.from({ length: safeMax }).map((_, index) => {
          const starValue = index + 1;
          const active = index < (hover ?? clampedValue);
          const isChecked = clampedValue === starValue;
          const isTabbable =
            canInteract && (isChecked || (clampedValue === 0 && index === 0));

          return (
            <span
              key={starValue}
              id={`${ratingId}-star-${starValue}`}
              className={combineClassNames(
                classMap.star,
                active && classMap.active,
              )}
              onClick={() => handleClick(index)}
              onMouseEnter={() => canInteract && setHover(starValue)}
              onMouseLeave={() => canInteract && setHover(null)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="radio"
              aria-checked={isChecked}
              aria-setsize={safeMax}
              aria-posinset={starValue}
              aria-label={`${starAriaLabelPrefix} ${starValue} of ${safeMax}${
                isChecked ? ", selected" : ""
              }`}
              tabIndex={isTabbable ? 0 : -1}
              data-testid={`${testId}-star-${starValue}`}
            >
              <StarIcon aria-hidden="true" focusable="false" />
            </span>
          );
        })}
      </div>
    </div>
  );
};

BaseRating.displayName = "BaseRating";
export default BaseRating;
