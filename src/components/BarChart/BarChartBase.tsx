import { forwardRef } from "react";
import { BarChartBaseProps } from "./BarChart.types";
import {
  defaultChartColors,
  describeData,
  formatDefaultValue,
  formatValueText,
  getValueRange,
} from "../../utils/chartUtils";
import { combineClassNames } from "../../utils/classNames";

const BarChartBase = forwardRef<HTMLDivElement, BarChartBaseProps>(
  (
    {
      data,
      label,
      width = 320,
      height = 180,
      padding = 24,
      gap = 8,
      showGrid = true,
      showLabels = true,
      valueFormatter = formatDefaultValue,
      theme = "primary",
      state,
      loading = false,
      classMap,
      className,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      testId = dataTestId ?? "bar-chart",
      ...rest
    },
    ref,
  ) => {
    const { max } = getValueRange(
      data.map((datum) => datum.value),
      true,
    );
    const chartHeight = Math.max(height - padding * 2, 1);
    const chartWidth = Math.max(width - padding * 2, 1);
    const barWidth = Math.max(
      (chartWidth - gap * (data.length - 1)) / data.length,
      1,
    );
    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(
      (ratio) => padding + ratio * chartHeight,
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
            aria-label={ariaLabel ?? describeData(data, valueFormatter)}
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
            {data.map((datum, index) => {
              const barHeight =
                max === 0 ? 0 : (datum.value / max) * chartHeight;
              const x = padding + index * (barWidth + gap);
              const y = height - padding - barHeight;

              return (
                <g key={datum.label}>
                  <rect
                    className={classMap.bar}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    fill={
                      datum.color ??
                      defaultChartColors[index % defaultChartColors.length]
                    }
                    data-testid={`${testId}-bar-${index}`}
                  >
                    <title>{`${datum.label}: ${formatValueText(
                      datum.value,
                      valueFormatter,
                    )}`}</title>
                  </rect>
                  {showLabels ? (
                    <text
                      className={classMap.axisLabel}
                      x={x + barWidth / 2}
                      y={height - 6}
                      textAnchor="middle"
                    >
                      {datum.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        )}
      </div>
    );
  },
);

BarChartBase.displayName = "BarChartBase";
export default BarChartBase;
