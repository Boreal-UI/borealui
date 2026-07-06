import { expandClassMap } from "@/utils/propAliases";
import LayoutBase from "../LayoutBase";
import {
  ContainerProps,
  GridProps,
  InlineProps,
  SectionProps,
  StackProps,
} from "../Layout.types";
import styles from "../next/Layout.module.scss";

const classMap = expandClassMap(styles);

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
