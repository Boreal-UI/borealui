import { expandClassMap } from "@/utils/propAliases";
import Breadcrumbs from "../../Breadcrumbs/server/Breadcrumbs";
import BreadCrumbPageHeaderBase from "../BreadCrumbPageHeaderBase";
import { BreadCrumbPageHeaderProps } from "../BreadCrumbPageHeader.types";
import styles from "../next/BreadCrumbPageHeader.module.scss";

export type ServerBreadCrumbPageHeaderProps = BreadCrumbPageHeaderProps;

export default function BreadCrumbPageHeader(
  props: ServerBreadCrumbPageHeaderProps,
) {
  return (
    <BreadCrumbPageHeaderBase
      {...props}
      BreadCrumbsComponent={Breadcrumbs}
      classMap={expandClassMap(styles)}
    />
  );
}
