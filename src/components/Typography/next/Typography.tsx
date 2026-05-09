"use client";

import { expandClassMap } from "@/utils/propAliases";
import { JSX } from "react";
import TypographyBase from "../TypographyBase";
import { TypographyProps } from "../Typography.types";
import { combineClassNames } from "@/utils/classNames";
import styles from "./Typography.module.scss";

export default function Typography(props: TypographyProps): JSX.Element {
  return (
    <TypographyBase
      {...props}
      classMap={expandClassMap(styles)}
      combineClassNames={combineClassNames}
    />
  );
}
