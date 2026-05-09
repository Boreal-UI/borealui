"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import Link from "next/link";
import styles from "./IconButton.module.scss";
import IconButtonBase from "../IconButtonBase";
import type { IconButtonProps } from "../IconButton.types";

const IconButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IconButtonProps
>((props, ref) => (
  <IconButtonBase ref={ref} {...props} classMap={expandClassMap(styles)} LinkComponent={Link} />
));

IconButton.displayName = "IconButton";
export default IconButton;
