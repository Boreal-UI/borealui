import { forwardRef, useMemo } from "react";
import { DonutChartBaseProps } from "./DonutChart.types";
import {
  defaultChartColors,
  describeData,
  formatDefaultValue,
  formatValueText,
} from "../chartUtils";
import { combineClassNames } from "../../utils/classNames";

const polarToCartesian = (
  center: number,
  radius: number,
  angleInDegrees: number,
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(angleInRadians),
    y: center + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (
  center: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(center, radius, endAngle);
  const end = polarToCartesian(center, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
};

const DonutChartBase = forwardRef<HTMLDivElement, DonutChartBaseProps>(
  (
    {
      data,
      label,
      size = 180,
      thickness = 28,
      centerLabel,
      showLegend = false,
      valueFormatter = formatDefaultValue,
      theme = "primary",
      state,
      loading = false,
      classMap,
      className,
      "aria-label": ariaLabel,
      "data-testid": dataTestId,
      testId = dataTestId ?? "donut-chart",
      ...rest
    },
    ref,
  ) => {
    const total = useMemo(
      () => data.reduce((sum, datum) => sum + Math.max(datum.value, 0), 0),
      [data],
    );
    const center = size / 2;
    const radius = Math.max(center - thickness / 2, 1);
    let currentAngle = 0;

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
          <>
            <div className={classMap.chart} data-testid={`${testId}-chart`}>
              <svg
                className={classMap.svg}
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                role="img"
                aria-label={ariaLabel ?? describeData(data, valueFormatter)}
              >
                <circle
                  className={classMap.track}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  strokeWidth={thickness}
                />
                {data.map((datum, index) => {
                  const sweep = total
                    ? (Math.max(datum.value, 0) / total) * 360
                    : 0;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + sweep;
                  currentAngle = endAngle;

                  return (
                    <path
                      key={datum.label}
                      className={classMap.segment}
                      d={describeArc(center, radius, startAngle, endAngle)}
                      fill="none"
                      stroke={
                        datum.color ??
                        defaultChartColors[index % defaultChartColors.length]
                      }
                      strokeWidth={thickness}
                      data-testid={`${testId}-segment-${index}`}
                    >
                      <title>{`${datum.label}: ${formatValueText(
                        datum.value,
                        valueFormatter,
                      )}`}</title>
                    </path>
                  );
                })}
              </svg>
              {centerLabel ? (
                <div
                  className={classMap.center}
                  data-testid={`${testId}-center`}
                >
                  {centerLabel}
                </div>
              ) : null}
            </div>
            {showLegend ? (
              <ul className={classMap.legend} data-testid={`${testId}-legend`}>
                {data.map((datum, index) => (
                  <li key={datum.label} className={classMap.legendItem}>
                    <span
                      className={classMap.swatch}
                      style={{
                        background:
                          datum.color ??
                          defaultChartColors[index % defaultChartColors.length],
                      }}
                      aria-hidden="true"
                    />
                    <span>{datum.label}</span>
                    <span className={classMap.value}>
                      {valueFormatter(datum.value)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </div>
    );
  },
);

DonutChartBase.displayName = "DonutChartBase";
export default DonutChartBase;
