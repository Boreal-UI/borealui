"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import ScrollToTopBase from "../ScrollToTopBase";
import { ArrowUpIcon } from "@/Icons";
import styles from "./ScrollToTop.module.scss";
import { ScrollToTopProps } from "../ScrollToTop.types";

const ScrollToTopButton: React.FC<ScrollToTopProps> = (props) => (
  <ScrollToTopBase
    {...props}
    classMap={expandClassMap(styles)}
    IconComponent={ArrowUpIcon}
  />
);
ScrollToTopButton.displayName = "ScrollToTopButton";
export default ScrollToTopButton;
