"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./TreeView.module.scss";
import TreeViewBase from "../TreeViewBase";
import { TreeViewProps } from "../TreeView.types";

const TreeView = forwardRef<HTMLDivElement, TreeViewProps>((props, ref) => (
  <TreeViewBase {...props} ref={ref} classMap={expandClassMap(styles)} />
));

TreeView.displayName = "TreeView";
export default TreeView;
