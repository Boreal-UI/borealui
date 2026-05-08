"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import FooterBase from "../FooterBase";
import { FooterProps } from "../Footer.types";
import IconButton from "../../IconButton/next/IconButton";
import ThemeSelect from "../../Select/ThemeSelect/next/ThemeSelect";

import styles from "./Footer.module.scss";

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <FooterBase
      {...props}
      IconButton={IconButton}
      ImageComponent={Image}
      ThemeSelect={ThemeSelect}
      LinkWrapper={({ href, children, className, ...rest }) => (
        <Link href={href} className={className} {...rest}>
          {children}
        </Link>
      )}
      classMap={styles}
    />
  );
};

Footer.displayName = "Footer";

export default Footer;
