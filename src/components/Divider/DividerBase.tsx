import React, { forwardRef } from "react";
import { DividerBaseProps } from "./Divider.types";
import { combineClassNames } from "../../utils/classNames";
import { getDefaultTheme } from "../../config/boreal-style-config";

const DividerBase = forwardRef<HTMLElement, DividerBaseProps>(
  (
    {
      orientation = "horizontal",
      thickness = "1px",
      length = "100%",
      className = "",
      dashed = false,
      theme = getDefaultTheme(),
      glass = false,
      state = "",
      as = "div",
      decorative = true,
      label,
      labelledBy,
      classMap,
      "data-testid": testId = "divider",
      style,
      ...rest
    },
    ref,
  ) => {
    const isVertical = orientation === "vertical";
    const ComponentTag = as;

    const isHr = ComponentTag === "hr";

    const computedRole = decorative
      ? undefined
      : isHr && !isVertical
        ? undefined
        : "separator";

    const computedStyle: React.CSSProperties = isHr
      ? {
          border: 0,
          margin: 0,
          ...(isVertical
            ? {
                width: 0,
                height: length,
                borderLeft: `${thickness} ${dashed ? "dashed" : "solid"} currentColor`,
              }
            : {
                height: 0,
                width: length,
                borderTop: `${thickness} ${dashed ? "dashed" : "solid"} currentColor`,
              }),
          ...style,
        }
      : {
          width: isVertical ? thickness : length,
          height: isVertical ? length : thickness,
          backgroundColor: dashed ? "transparent" : undefined,
          ...style,
        };

    return (
      <ComponentTag
        ref={ref as never}
        className={combineClassNames(
          classMap.divider,
          classMap[orientation],
          theme && classMap[theme],
          state && classMap[state],
          dashed && classMap.dashed,
          glass && classMap.glass,
          className,
        )}
        role={computedRole}
        aria-hidden={decorative ? true : undefined}
        aria-orientation={!decorative && isVertical ? "vertical" : undefined}
        aria-label={!decorative ? label : undefined}
        aria-labelledby={!decorative ? labelledBy : undefined}
        data-orientation={orientation}
        style={computedStyle}
        data-testid={testId}
        {...rest}
      />
    );
  },
);

DividerBase.displayName = "DividerBase";

export default DividerBase;
