import { JSX } from "react";
import { combineClassNames } from "@/utils/classNames";
import { expandClassMap } from "@/utils/propAliases";
import TypographyBase from "../TypographyBase";
import { TypographyProps } from "../Typography.types";
import styles from "../next/Typography.module.scss";

export default function Typography(props: TypographyProps): JSX.Element {
  return (
    <TypographyBase
      {...props}
      classMap={expandClassMap(styles)}
      combineClassNames={combineClassNames}
    />
  );
}
