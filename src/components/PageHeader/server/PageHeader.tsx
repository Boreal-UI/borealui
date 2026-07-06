import { expandClassMap } from "@/utils/propAliases";
import PageHeaderBase from "../PageHeaderBase";
import { PageHeaderProps } from "../PageHeader.types";
import styles from "../next/PageHeader.module.scss";

export type ServerPageHeaderProps = PageHeaderProps;

export default function PageHeader(props: ServerPageHeaderProps) {
  return <PageHeaderBase {...props} classMap={expandClassMap(styles)} />;
}
