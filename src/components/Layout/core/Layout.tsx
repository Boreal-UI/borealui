import { expandClassMap } from "@/utils/propAliases";
import LayoutBase from "../LayoutBase";
import {
  ContainerProps,
  GridProps,
  InlineProps,
  SectionProps,
  StackProps,
} from "../Layout.types";
import "./Layout.scss";

const classes = {
  container: "layout_container",
  stack: "layout_stack",
  inline: "layout_inline",
  grid: "layout_grid",
  section: "layout_section",
  padded: "layout_padded",
  wrap: "layout_wrap",
  gapNone: "layout_gap_none",
  gapXs: "layout_gap_xs",
  gapSm: "layout_gap_sm",
  gapMd: "layout_gap_md",
  gapLg: "layout_gap_lg",
  gapXl: "layout_gap_xl",
  alignStart: "layout_align_start",
  alignCenter: "layout_align_center",
  alignEnd: "layout_align_end",
  alignStretch: "layout_align_stretch",
  justifyStart: "layout_justify_start",
  justifyCenter: "layout_justify_center",
  justifyEnd: "layout_justify_end",
  justifyBetween: "layout_justify_between",
  sizeSm: "layout_size_sm",
  sizeMd: "layout_size_md",
  sizeLg: "layout_size_lg",
  sizeXl: "layout_size_xl",
  sizeFull: "layout_size_full",
  toneDefault: "layout_tone_default",
  toneMuted: "layout_tone_muted",
  toneTransparent: "layout_tone_transparent",
};

const classMap = expandClassMap(classes);

export const Container = (props: ContainerProps) => (
  <LayoutBase {...props} variant="container" classMap={classMap} />
);

export const Stack = (props: StackProps) => (
  <LayoutBase {...props} variant="stack" classMap={classMap} />
);

export const Inline = (props: InlineProps) => (
  <LayoutBase {...props} variant="inline" classMap={classMap} />
);

export const Grid = (props: GridProps) => (
  <LayoutBase {...props} variant="grid" classMap={classMap} />
);

export const Section = (props: SectionProps) => (
  <LayoutBase {...props} variant="section" classMap={classMap} />
);
