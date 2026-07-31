"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AvatarProps } from "../Avatar.types";
import { AvatarBase } from "../AvatarBase";
import styles from "./Avatar.module.scss";

const Avatar = forwardRef<HTMLAnchorElement | HTMLButtonElement, AvatarProps>(
  (props, ref) => (
    <AvatarBase
      {...props}
      imageFill={props.imageFill ?? true}
      ImageComponent={Image}
      LinkComponent={Link}
      classMap={expandClassMap(styles)}
      ref={ref}
    />
  ),
);
Avatar.displayName = "Avatar";
export default Avatar;
