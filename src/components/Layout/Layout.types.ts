import { ElementType, HTMLAttributes, ReactNode } from "react";

export type LayoutGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type LayoutAlign = "start" | "center" | "end" | "stretch";
export type LayoutJustify = "start" | "center" | "end" | "between";

export interface LayoutPrimitiveProps
  extends Omit<HTMLAttributes<HTMLElement>, "as"> {
  as?: ElementType;
  children?: ReactNode;
  gap?: LayoutGap;
  align?: LayoutAlign;
  justify?: LayoutJustify;
  className?: string;
  testId?: string;
  "data-testid"?: string;
}

export interface ContainerProps extends LayoutPrimitiveProps {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padded?: boolean;
}

export type StackProps = LayoutPrimitiveProps;

export interface InlineProps extends LayoutPrimitiveProps {
  wrap?: boolean;
}

export interface GridProps extends LayoutPrimitiveProps {
  minColumnWidth?: string;
}

export interface SectionProps extends LayoutPrimitiveProps {
  padded?: boolean;
  tone?: "default" | "muted" | "transparent";
}

export interface LayoutBaseProps extends LayoutPrimitiveProps {
  variant: "container" | "stack" | "inline" | "grid" | "section";
  classMap: Record<string, string>;
  size?: ContainerProps["size"];
  padded?: boolean;
  wrap?: boolean;
  minColumnWidth?: string;
  tone?: SectionProps["tone"];
}
