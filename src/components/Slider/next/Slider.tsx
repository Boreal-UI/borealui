"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import styles from "./Slider.module.scss";
import { SliderProps } from "../Slider.types";
import SliderBase from "../SliderBase";

const Slider: React.FC<SliderProps> = (props) => {
  return <SliderBase {...props} classMap={expandClassMap(styles)} />;
};
Slider.displayName = "Slider";
export default Slider;
