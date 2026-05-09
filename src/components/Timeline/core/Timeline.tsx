import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import "./Timeline.scss";
import TimelineBase from "../TimelineBase";
import { TimelineProps } from "../Timeline.types";

const classes = {
  timeline: "timeline",
  item: "timeline_item",
  marker: "timeline_marker",
  icon: "timeline_icon",
  dot: "timeline_dot",
  content: "timeline_content",
  title: "timeline_title",
  date: "timeline_date",
  description: "timeline_description",

  vertical: "timeline_vertical",
  horizontal: "timeline_horizontal",

  primary: "timeline_primary",
  secondary: "timeline_secondary",
  tertiary: "timeline_tertiary",
  quaternary: "timeline_quaternary",

  clear: "timeline_clear",
  glass: "timeline_glass",

  shadowNone: "timeline_shadow-None",
  shadowLight: "timeline_shadow-Light",
  shadowMedium: "timeline_shadow-Medium",
  shadowStrong: "timeline_shadow-Strong",
  shadowIntense: "timeline_shadow-Intense",

  roundNone: "timeline_round-None",
  roundSmall: "timeline_round-Small",
  roundMedium: "timeline_round-Medium",
  roundLarge: "timeline_round-Large",
};

const Timeline: React.FC<TimelineProps> = (props) => {
  return <TimelineBase {...props} classMap={expandClassMap(classes)} />;
};
Timeline.displayName = "Timeline";
export default Timeline;
