import { expandClassMap } from "@/utils/propAliases";
import React, { useMemo } from "react";
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
  info: "card_info",
  warning: "card_warning",
  error: "card_error",

  clear: "card_clear",
  loading: "card_loading",
  disabled: "card_disabled",
  selected: "card_selected",
  selectable: "card_selectable",

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
  roundFull: "card_round-Full",

  borderNone: "card_border-None",
  borderXs: "card_border-Xs",
  borderSmall: "card_border-Small",
  borderMedium: "card_border-Medium",
  borderLarge: "card_border-Large",
  borderXl: "card_border-Xl",

  vertical: "card_vertical",
  horizontal: "card_horizontal",

  image: "card_image",
  media: "card_media",
  insetNone: "card_insetNone",
  insetXs: "card_insetXs",
  insetSmall: "card_insetSmall",
  insetSm: "card_insetSmall",
  insetMedium: "card_insetMedium",
  insetMd: "card_insetMedium",
  insetLarge: "card_insetLarge",
  insetLg: "card_insetLarge",
  insetXl: "card_insetXl",
  imageRoundNone: "card_imageRound-None",
  imageRoundSmall: "card_imageRound-Small",
  imageRoundSm: "card_imageRound-Small",
  imageRoundMedium: "card_imageRound-Medium",
  imageRoundMd: "card_imageRound-Medium",
  imageRoundLarge: "card_imageRound-Large",
  imageRoundLg: "card_imageRound-Large",
  imageRoundFull: "card_imageRound-Full",
  header: "card_header",
  title: "card_title",
  icon: "card_icon",
  body: "card_body",
  description: "card_description",
  children: "card_children",
  footer: "card_footer",
  actions: "card_actions",
  action_button: "card_action_button",
  glass: "card_glass",
  outline: "card_outline",
};

const Card: React.FC<CardProps> = (props) => {
  const wrappedButtons = useMemo(
    () =>
      (props.actionButtons ?? []).map((button) => ({
        ...button,
        buttonComponent: Button,
        iconButtonComponent: IconButton,
      })),
    [props.actionButtons],
  );

  return (
    <CardBase
      {...props}
      actionButtons={wrappedButtons}
      classMap={expandClassMap(classes)}
      SkeletonComponent={Skeleton}
    />
  );
};
Card.displayName = "Card";
export default Card;
