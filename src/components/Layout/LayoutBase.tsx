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
  tone = "default",
  className,
  testId,
  "data-testid": dataTestId,
  classMap,
  style,
  ...rest
}: LayoutBaseProps) {
  const Component = as ?? (variant === "section" ? "section" : "div");
  const resolvedTestId = testId ?? dataTestId ?? variant;
  const layoutClassName = combineClassNames(
    classMap[variant],
    classMap[`gap${capitalize(gap)}`],
    align && classMap[`align${capitalize(align)}`],
    justify && classMap[`justify${capitalize(justify)}`],
    variant === "container" && size && classMap[`size${capitalize(size)}`],
    padded && classMap.padded,
    wrap && classMap.wrap,
    variant === "section" && classMap[`tone${capitalize(tone)}`],
    className,
  );

  return (
    <Component
      className={layoutClassName}
      style={
        variant === "grid"
          ? ({
              ...style,
              "--layout-min-column-width": minColumnWidth,
            } as React.CSSProperties)
          : style
      }
      data-testid={resolvedTestId}
      {...rest}
    >
      {children}
    </Component>
  );
}
