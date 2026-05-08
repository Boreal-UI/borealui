import React from "react";
import CardBase from "../CardBase";
import "./Card.scss";
import Button from "../../Button/core/Button";
import IconButton from "../../IconButton/core/IconButton";
import Skeleton from "../../Skeleton/core/Skeleton";
import { CardProps } from "../Card.types";

const classes = {
  card: "card",

  left: "card_left",
  right: "card_right",
  center: "card_center",

  primary: "card_primary",
  secondary: "card_secondary",
  tertiary: "card_tertiary",
  quaternary: "card_quaternary",

  success: "card_success",
  warning: "card_warning",
  error: "card_error",

  clear: "card_clear",
  glass: "card_glass",

  outline: "card_outline",
  loading: "card_loading",

  content: "card_content",

  xs: "card_xs",
  small: "card_small",
  medium: "card_medium",
  large: "card_large",
  xl: "card_xl",

  shadowNone: "card_shadow-None",
  shadowLight: "card_shadow-Light",
  shadowMedium: "card_shadow-Medium",
  shadowStrong: "card_shadow-Strong",
  shadowIntense: "card_shadow-Intense",

  roundNone: "card_round-None",
  roundSmall: "card_round-Small",
  roundMedium: "card_round-Medium",
  roundLarge: "card_round-Large",

  borderNone: "card_border-None",
  borderXs: "card_border-Xs",
  borderSmall: "card_border-Small",
  borderMedium: "card_border-Medium",
  borderLarge: "card_border-Large",
  borderXl: "card_border-Xl",

  vertical: "card_vertical",
  horizontal: "card_horizontal",

  image: "card_image",
  header: "card_header",
  title: "card_title",
  icon: "card_icon",
  body: "card_body",
  description: "card_description",
  children: "card_children",
  footer: "card_footer",
  actions: "card_actions",
  action_button: "card_action_button",
};

const Card: React.FC<CardProps> = (props) => {
  const wrappedButtons = (props.actionButtons ?? []).map((b) => ({
    ...b,
    buttonComponent: Button,
    iconButtonComponent: IconButton,
  }));

  return (
    <CardBase
      {...props}
      actionButtons={wrappedButtons}
      classMap={classes}
      SkeletonComponent={Skeleton}
    />
  );
};
Card.displayName = "Card";
export default Card;
