"use client";

import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import styles from "./Toolbar.module.scss";
import Avatar from "../../Avatar/next/Avatar";
import ToolbarBase from "../ToolbarBase";
import { ToolbarProps } from "../Toolbar.types";

const Toolbar: React.FC<ToolbarProps> = (props) => (
  <ToolbarBase
    {...props}
    AvatarComponent={Avatar}
    classMap={expandClassMap(styles)}
  />
);
Toolbar.displayName = "Toolbar";
export default Toolbar;
