import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { LayoutBaseProps } from "./Layout.types";

export default function LayoutBase({
  as,
  children,
  variant,
  gap = "md",
  align,
  justify,
  size = "lg",
  padded = false,
  wrap = true,
  minColumnWidth = "16rem",
  columns = 4,
  minRowHeight = "8rem",
  dense = false,
  gridClassName,
  columnSpan = 1,
  rowSpan = 1,
  tone = "default",
  className,
  testId,
  "data-testid": dataTestId,
  classMap,
  style,
  ...rest
}: LayoutBaseProps) {
  const Component = as ?? (variant === "section" ? "section" : "div");
  const defaultTestId =
    variant === "bentoBox"
      ? "bento-box"
      : variant === "bentoBoxItem"
        ? "bento-box-item"
        : variant;
  const resolvedTestId = testId ?? dataTestId ?? defaultTestId;
  const isBentoBox = variant === "bentoBox";
  const isBentoBoxItem = variant === "bentoBoxItem";
  const layoutClassName = combineClassNames(
    classMap[variant],
    !isBentoBox && !isBentoBoxItem && classMap[`gap${capitalize(gap)}`],
    !isBentoBox &&
      !isBentoBoxItem &&
      align &&
      classMap[`align${capitalize(align)}`],
    !isBentoBox &&
      !isBentoBoxItem &&
      justify &&
      classMap[`justify${capitalize(justify)}`],
    variant === "container" && size && classMap[`size${capitalize(size)}`],
    padded && classMap.padded,
    !isBentoBox && !isBentoBoxItem && wrap && classMap.wrap,
    variant === "section" && classMap[`tone${capitalize(tone)}`],
    isBentoBoxItem &&
      classMap[`columnSpan${columnSpan === "full" ? "Full" : columnSpan}`],
    isBentoBoxItem && classMap[`rowSpan${rowSpan}`],
    className,
  );

  const resolvedStyle =
    variant === "grid"
      ? ({
          ...style,
          "--layout-min-column-width": minColumnWidth,
        } as React.CSSProperties)
      : isBentoBox
        ? ({
            ...style,
            "--layout-bento-min-row-height": minRowHeight,
          } as React.CSSProperties)
        : style;

  if (isBentoBox) {
    return (
      <Component
        className={layoutClassName}
        style={resolvedStyle}
        data-testid={resolvedTestId}
        {...rest}
      >
        <div
          className={combineClassNames(
            classMap.bentoGrid,
            classMap[`columns${columns}`],
            classMap[`gap${capitalize(gap)}`],
            align && classMap[`align${capitalize(align)}`],
            justify && classMap[`justify${capitalize(justify)}`],
            dense && classMap.dense,
            gridClassName,
          )}
          data-testid={`${resolvedTestId}-grid`}
        >
          {children}
        </div>
      </Component>
    );
  }

  return (
    <Component
      className={layoutClassName}
      style={resolvedStyle}
      data-column-span={isBentoBoxItem ? columnSpan : undefined}
      data-row-span={isBentoBoxItem ? rowSpan : undefined}
      data-testid={resolvedTestId}
      {...rest}
    >
      {children}
    </Component>
  );
}
