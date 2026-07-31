import { ElementType, HTMLAttributes, ReactNode } from "react";

export type LayoutGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type LayoutAlign = "start" | "center" | "end" | "stretch";
export type LayoutJustify = "start" | "center" | "end" | "between";

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
  variant: "container" | "stack" | "inline" | "grid" | "section";
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
  /**
   * Tone prop for Layout.
   */
  tone?: SectionProps["tone"];
}
