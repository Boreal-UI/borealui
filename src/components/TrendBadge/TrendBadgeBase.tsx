import { forwardRef, useMemo } from "react";
import { TrendBadgeBaseProps } from "./TrendBadge.types";
import { formatDefaultValue, formatValueText } from "../chartUtils";
import { combineClassNames } from "../../utils/classNames";

const TrendBadgeBase = forwardRef<HTMLDivElement, TrendBadgeBaseProps>(
  (
    {
      value,
      previousValue,
      direction,
      label,
      positiveIsUp = true,
      showDelta = true,
      prefix,
      suffix,
      valueFormatter = formatDefaultValue,
      theme = "primary",
      state,
      loading = false,
      classMap,
      className,
      "data-testid": dataTestId,
      testId = dataTestId ?? "trend-badge",
      ...rest
    },
    ref,
  ) => {
    const delta = previousValue === undefined ? 0 : value - previousValue;
    const resolvedDirection = useMemo(() => {
      if (direction) return direction;
      if (delta > 0) return "up";
      if (delta < 0) return "down";
      return "flat";
    }, [delta, direction]);
    const isPositive =
      resolvedDirection === "flat" ||
      (positiveIsUp
        ? resolvedDirection === "up"
        : resolvedDirection === "down");
    const displayValue = showDelta ? delta : value;
    const icon =
      resolvedDirection === "up"
        ? "^"
        : resolvedDirection === "down"
          ? "v"
          : "-";
    const directionLabel = `${resolvedDirection} trend`;
    const accessibleLabelPrefix = typeof label === "string" ? `${label}: ` : "";
    const accessibleValue = formatValueText(displayValue, valueFormatter);

    return (
      <div
        ref={ref}
        className={combineClassNames(
          classMap.root,
          classMap[theme],
          state && classMap[state],
          classMap[resolvedDirection],
          classMap[isPositive ? "positive" : "negative"],
          loading && classMap.loading,
          className,
        )}
        aria-label={`${accessibleLabelPrefix}${directionLabel}, ${accessibleValue}`}
        data-testid={testId}
        {...rest}
      >
        {loading ? (
          <span
            className={classMap.loader}
            aria-hidden="true"
            data-testid={`${testId}-loader`}
          />
        ) : (
          <>
            {label ? (
              <span className={classMap.label} data-testid={`${testId}-label`}>
                {label}
              </span>
            ) : null}
            <span
              className={classMap.icon}
              aria-hidden="true"
              data-testid={`${testId}-icon`}
            >
              {icon}
            </span>
            <span className={classMap.value} data-testid={`${testId}-value`}>
              {prefix}
              {valueFormatter(displayValue)}
              {suffix}
            </span>
          </>
        )}
      </div>
    );
  },
);

TrendBadgeBase.displayName = "TrendBadgeBase";
export default TrendBadgeBase;
