"use client";

import { expandClassMap } from "@/utils/propAliases";
import React, { useMemo } from "react";
import Image from "next/image";
import Button from "../../Button/next/Button";
import IconButton from "../../IconButton/next/IconButton";
import Skeleton from "../../Skeleton/next/Skeleton";
import styles from "./Card.module.scss";
import CardBase from "../CardBase";
import { CardImageComponentProps, CardProps } from "../Card.types";

const NextImageWrapper: React.FC<CardImageComponentProps> = ({
  src,
  alt,
  className,
  width,
  height,
  fill,
}) => {
  if (typeof src === "string" && src.toLowerCase().endsWith(".svg")) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      {...(fill
        ? { fill, sizes: "100vw" }
        : { width: width ?? 640, height: height ?? 360 })}
    />
  );
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
      classMap={expandClassMap(styles)}
      SkeletonComponent={Skeleton}
      ImageComponent={NextImageWrapper}
    />
  );
};
Card.displayName = "Card";
export default Card;
