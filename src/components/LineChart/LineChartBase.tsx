import { forwardRef, useMemo } from "react";
import { LineChartBaseProps } from "./LineChart.types";
import {
  buildPoints,
  describeData,
  formatDefaultValue,
  formatValueText,
  getValueRange,
  pointsToPath,
} from "../../utils/chartUtils";
import { combineClassNames } from "../../utils/classNames";

const LineChartBase = forwardRef<HTMLDivElement, LineChartBaseProps>(
  (
    {
      data,
      label,
      width = 360,
      height = 200,
      padding = 24,
      showGrid = true,
      showPoints = true,
      color = "currentColor",
      valueFormatter = formatDefaultValue,
      units,
      theme = "primary",
      state,
      loading = false,
      classMap,
      className,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      testId = dataTestId ?? "line-chart",
      ...rest
    },
    ref,
  ) => {
    const { points, path, min, max, gridLines } = useMemo(
      () => {
        const nextPoints = buildPoints(data, width, height, padding, true);
        const valueRange = getValueRange(
          data.map((datum) => datum.value),
          true,
        );

        return {
          points: nextPoints,
          path: pointsToPath(nextPoints),
          min: valueRange.min,
          max: valueRange.max,
          gridLines: [0, 0.25, 0.5, 0.75, 1].map(
            (ratio) => padding + ratio * (height - padding * 2),
          ),
        };
      },
      [data, height, padding, width],
    );

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
          <svg
            className={classMap.svg}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label={ariaLabel ?? describeData(data, valueFormatter, units)}
            data-testid={`${testId}-chart`}
          >
            {showGrid
              ? gridLines.map((y) => (
                  <line
                    key={y}
                    className={classMap.gridLine}
                    x1={padding}
                    x2={width - padding}
                    y1={y}
                    y2={y}
                  />
                ))
              : null}
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
            {showPoints
              ? points.map((point, index) => (
                  <circle
                    key={data[index].label}
                    className={classMap.point}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={data[index].color ?? color}
                    data-testid={`${testId}-point-${index}`}
                  >
                    <title>{`${data[index].label}: ${formatValueText(
                      data[index].value,
                      valueFormatter,
                      units,
                    )}`}</title>
                  </circle>
                ))
              : null}
            <text className={classMap.axisLabel} x={padding} y={padding - 8}>
              {formatValueText(max, valueFormatter, units)}
            </text>
            <text
              className={classMap.axisLabel}
              x={padding}
              y={height - padding + 16}
            >
              {formatValueText(min, valueFormatter, units)}
            </text>
          </svg>
        )}
      </div>
    );
  },
);

LineChartBase.displayName = "LineChartBase";
export default LineChartBase;
