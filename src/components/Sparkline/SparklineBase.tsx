import { forwardRef, useMemo } from "react";
import { SparklineBaseProps } from "./Sparkline.types";
import {
  buildPoints,
  describeData,
  formatDefaultValue,
  normalizeData,
  pointsToPath,
} from "../../utils/chartUtils";
import { combineClassNames } from "../../utils/classNames";

const SparklineBase = forwardRef<HTMLDivElement, SparklineBaseProps>(
  (
    {
      data,
      label,
      width = 160,
      height = 48,
      padding = 4,
      color = "currentColor",
      showArea = false,
      showValue = false,
      valueFormatter = formatDefaultValue,
      theme = "primary",
      state,
      loading = false,
      classMap,
      className,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      testId = dataTestId ?? "sparkline",
      ...rest
    },
    ref,
  ) => {
    const normalizedData = useMemo(() => normalizeData(data), [data]);
    const points = useMemo(
      () => buildPoints(normalizedData, width, height, padding, false),
      [height, normalizedData, padding, width],
    );
    const path = pointsToPath(points);
    const lastPoint = points.at(-1);
    const lastValue = normalizedData.at(-1)?.value;
    const areaPath =
      showArea && points.length
        ? `${path} L ${points.at(-1)?.x ?? padding} ${height - padding} L ${
            points[0].x
          } ${height - padding} Z`
        : undefined;
    const description = describeData(normalizedData, valueFormatter);

    return (
      <div
        ref={ref}
        className={combineClassNames(
          classMap.root,
          classMap[theme],
          state && classMap[state],
          loading && classMap.loading,
          className,
        )}
        data-testid={testId}
        {...rest}
      >
        {label ? (
          <div className={classMap.label} data-testid={`${testId}-label`}>
            {label}
          </div>
        ) : null}
        {loading ? (
          <span
            className={classMap.loader}
            aria-hidden="true"
            data-testid={`${testId}-loader`}
          />
        ) : (
          <div className={classMap.chart} data-testid={`${testId}-chart`}>
            <svg
              className={classMap.svg}
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={ariaLabel ?? description}
            >
              {areaPath ? (
                <path
                  className={classMap.area}
                  d={areaPath}
                  fill={color}
                  opacity="0.18"
                />
              ) : null}
              <path
                className={classMap.line}
                d={path}
                fill="none"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                data-testid={`${testId}-line`}
              />
              {lastPoint ? (
                <circle
                  className={classMap.point}
                  cx={lastPoint.x}
                  cy={lastPoint.y}
                  r="3"
                  fill={color}
                  data-testid={`${testId}-last-point`}
                />
              ) : null}
            </svg>
            {showValue && lastValue !== undefined ? (
              <span className={classMap.value} data-testid={`${testId}-value`}>
                {valueFormatter(lastValue)}
              </span>
            ) : null}
          </div>
        )}
      </div>
    );
  },
);

SparklineBase.displayName = "SparklineBase";
export default SparklineBase;
