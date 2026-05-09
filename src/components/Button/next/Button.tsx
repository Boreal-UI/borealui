"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import Link from "next/link";
import styles from "./Button.module.scss";
import ButtonBase from "../ButtonBase";
import { ButtonProps } from "../Button.types";

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <ButtonBase {...props} classMap={expandClassMap(styles)} LinkComponent={Link} ref={ref} />
));
Button.displayName = "Button";
export default Button;
