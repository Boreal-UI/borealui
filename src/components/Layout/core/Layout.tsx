import { expandClassMap } from "@/utils/propAliases";
import LayoutBase from "../LayoutBase";
import {
  BentoBoxItemProps,
  BentoBoxProps,
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
  bentoBox: "layout_bento_box",
  bentoGrid: "layout_bento_grid",
  bentoBoxItem: "layout_bento_item",
  dense: "layout_bento_dense",
  columns1: "layout_bento_columns1",
  columns2: "layout_bento_columns2",
  columns3: "layout_bento_columns3",
  columns4: "layout_bento_columns4",
  columns5: "layout_bento_columns5",
  columns6: "layout_bento_columns6",
  columnSpan1: "layout_bento_item_columnSpan1",
  columnSpan2: "layout_bento_item_columnSpan2",
  columnSpan3: "layout_bento_item_columnSpan3",
  columnSpan4: "layout_bento_item_columnSpan4",
  columnSpan5: "layout_bento_item_columnSpan5",
  columnSpan6: "layout_bento_item_columnSpan6",
  columnSpanFull: "layout_bento_item_columnSpanFull",
  rowSpan1: "layout_bento_item_rowSpan1",
  rowSpan2: "layout_bento_item_rowSpan2",
  rowSpan3: "layout_bento_item_rowSpan3",
  rowSpan4: "layout_bento_item_rowSpan4",
  rowSpan5: "layout_bento_item_rowSpan5",
  rowSpan6: "layout_bento_item_rowSpan6",
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

export const BentoBox = (props: BentoBoxProps) => (
  <LayoutBase {...props} variant="bentoBox" classMap={classMap} />
);

export const BentoBoxItem = (props: BentoBoxItemProps) => (
  <LayoutBase {...props} variant="bentoBoxItem" classMap={classMap} />
);

export const Section = (props: SectionProps) => (
  <LayoutBase {...props} variant="section" classMap={classMap} />
);
