import { ElementType, HTMLAttributes, ReactNode } from "react";

export type LayoutGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type LayoutAlign = "start" | "center" | "end" | "stretch";
export type LayoutJustify = "start" | "center" | "end" | "between";
export type BentoBoxColumns = 1 | 2 | 3 | 4 | 5 | 6;
export type BentoBoxColumnSpan = BentoBoxColumns | "full";

export interface LayoutPrimitiveProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "as"
> {
  /**
   * As prop for LayoutPrimitive.
   */
  as?: ElementType;
  /**
   * Content rendered inside the component.
   */
  children?: ReactNode;
  /**
   * Gap.
   * @default "md"
   */
  gap?: LayoutGap;
  /**
   * Align prop for LayoutPrimitive.
   */
  align?: LayoutAlign;
  /**
   * Justify prop for LayoutPrimitive.
   */
  justify?: LayoutJustify;
  /**
   * Additional CSS class names for the component root.
   */
  className?: string;
  /**
   * Test id used to identify the component in tests.
   */
  testId?: string;
  /**
   * Test id used to identify the component in tests.
   */
  "data-testid"?: string;
}

export interface ContainerProps extends LayoutPrimitiveProps {
  /**
   * Size.
   * @default "lg"
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /**
   * Padded.
   * @default false
   */
  padded?: boolean;
}

export type StackProps = LayoutPrimitiveProps;

export interface InlineProps extends LayoutPrimitiveProps {
  /**
   * Wrap.
   * @default true
   */
  wrap?: boolean;
}

export interface GridProps extends LayoutPrimitiveProps {
  /**
   * Min Column Width.
   * @default "16rem"
   */
  minColumnWidth?: string;
}

export interface BentoBoxProps extends LayoutPrimitiveProps {
  /** Number of columns at wide container sizes. @default 4 */
  columns?: BentoBoxColumns;
  /** Minimum height used by each implicit grid row. @default "8rem" */
  minRowHeight?: string;
  /**
   * Backfills open cells when possible. Keep this off when visual order must
   * match reading and focus order.
   * @default false
   */
  dense?: boolean;
  /** Additional class name for the internal grid. */
  gridClassName?: string;
}

export interface BentoBoxItemProps extends Omit<
  LayoutPrimitiveProps,
  "gap" | "align" | "justify"
> {
  /** Number of columns occupied at wide container sizes. @default 1 */
  columnSpan?: BentoBoxColumnSpan;
  /** Number of rows occupied at wide container sizes. @default 1 */
  rowSpan?: BentoBoxColumns;
}

export interface SectionProps extends LayoutPrimitiveProps {
  /**
   * Padded prop for Section.
   */
  padded?: boolean;
  /**
   * Tone.
   * @default "default"
   */
  tone?: "default" | "muted" | "transparent";
}

export interface LayoutBaseProps extends LayoutPrimitiveProps {
  /**
   * Visual variant applied to the component.
   */
  variant:
    | "container"
    | "stack"
    | "inline"
    | "grid"
    | "bentoBox"
    | "bentoBoxItem"
    | "section";
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
  /**
   * Size variant applied to the component.
   */
  size?: ContainerProps["size"];
  /**
   * Padded prop for Layout.
   */
  padded?: boolean;
  /**
   * Wrap prop for Layout.
   */
  wrap?: boolean;
  /**
   * Min Column Width prop for Layout.
   */
  minColumnWidth?: string;
  /** Number of columns used by a BentoBox. */
  columns?: BentoBoxColumns;
  /** Minimum height used by BentoBox rows. */
  minRowHeight?: string;
  /** Enables dense BentoBox placement. */
  dense?: boolean;
  /** Additional class name for the BentoBox grid. */
  gridClassName?: string;
  /** Column span used by a BentoBoxItem. */
  columnSpan?: BentoBoxColumnSpan;
  /** Row span used by a BentoBoxItem. */
  rowSpan?: BentoBoxColumns;
  /**
   * Tone prop for Layout.
   */
  tone?: SectionProps["tone"];
}
