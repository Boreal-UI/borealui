"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import Link from "next/link";
import styles from "./Button.module.scss";
import ButtonBase from "../ButtonBase";
import { ButtonElement, ButtonProps } from "../Button.types";

const Button = forwardRef<ButtonElement, ButtonProps>((props, ref) => (
  <ButtonBase
    {...props}
    classMap={expandClassMap(styles)}
    LinkComponent={Link}
    ref={ref}
  />
));
Button.displayName = "Button";
export default Button;
