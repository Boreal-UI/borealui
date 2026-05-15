import { forwardRef } from "react";
import { LegendBaseProps } from "./Legend.types";
import { combineClassNames } from "../../utils/classNames";

const LegendBase = forwardRef<HTMLDivElement, LegendBaseProps>(
  (
    {
      items,
      label,
      orientation = "horizontal",
      theme = "primary",
      state,
      loading = false,
      classMap,
      className,
      "data-testid": dataTestId,
      testId = dataTestId ?? "legend",
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={combineClassNames(
        classMap.root,
        classMap[theme],
        state && classMap[state],
        classMap[orientation],
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
        <ul
          className={classMap.list}
          aria-label={typeof label === "string" ? label : "Legend"}
          data-testid={`${testId}-list`}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className={classMap.item}
              data-testid={`${testId}-item-${index}`}
            >
              <span
                className={classMap.swatch}
                style={{ background: item.color }}
                aria-hidden="true"
              />
              <span className={classMap.text}>{item.label}</span>
              {item.value ? (
                <span className={classMap.value}>{item.value}</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  ),
);

LegendBase.displayName = "LegendBase";
export default LegendBase;
