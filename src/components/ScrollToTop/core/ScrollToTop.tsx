import React from "react";
import ScrollToTopBase from "../ScrollToTopBase";
import "./ScrollToTop.scss";
import { ArrowUpIcon } from "@/Icons";
import { ScrollToTopProps } from "../ScrollToTop.types";

const classes = {
  wrapper: "scrollToTop",
  button: "scrollToTop_button",
  icon: "scrollToTop_icon",

  shadowNone: "scrollToTop_shadow-None",
  shadowLight: "scrollToTop_shadow-Light",
  shadowMedium: "scrollToTop_shadow-Medium",
  shadowStrong: "scrollToTop_shadow-Strong",
  shadowIntense: "scrollToTop_shadow-Intense",

  roundNone: "scrollToTop_round-None",
  roundSmall: "scrollToTop_round-Small",
  roundMedium: "scrollToTop_round-Medium",
  roundLarge: "scrollToTop_round-Large",
};

const ScrollToTopButton: React.FC<ScrollToTopProps> = (props) => (
  <ScrollToTopBase {...props} classMap={classes} IconComponent={ArrowUpIcon} />
);
ScrollToTopButton.displayName = "ScrollToTopButton";
export default ScrollToTopButton;
