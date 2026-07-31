import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./TreeView.scss";
import TreeViewBase from "../TreeViewBase";
import { TreeViewProps } from "../TreeView.types";

const classes = {
  root: "treeView",
  list: "treeView_list",
  group: "treeView_group",
  item: "treeView_item",
  node: "treeView_node",
  selected: "treeView_selected",
  nodeDisabled: "treeView_nodeDisabled",
  disclosure: "treeView_disclosure",
  icon: "treeView_icon",
  content: "treeView_content",
  loader: "treeView_loader",
  srOnly: "sr_only",

  primary: "treeView_primary",
  secondary: "treeView_secondary",
  tertiary: "treeView_tertiary",
  quaternary: "treeView_quaternary",

  success: "treeView_success",
  info: "treeView_info",
  warning: "treeView_warning",
  error: "treeView_error",

  clear: "treeView_clear",
  disabled: "treeView_disabled",
  loading: "treeView_loading",

  shadowNone: "treeView_shadow-None",
  shadowLight: "treeView_shadow-Light",
  shadowMedium: "treeView_shadow-Medium",
  shadowStrong: "treeView_shadow-Strong",
  shadowIntense: "treeView_shadow-Intense",

  roundNone: "treeView_round-None",
  roundSmall: "treeView_round-Small",
  roundMedium: "treeView_round-Medium",
  roundLarge: "treeView_round-Large",
  roundFull: "treeView_round-Full",
  glass: "treeView_glass",
  outline: "treeView_outline",
};

const TreeView = forwardRef<HTMLDivElement, TreeViewProps>((props, ref) => (
  <TreeViewBase {...props} ref={ref} classMap={expandClassMap(classes)} />
));

TreeView.displayName = "TreeView";
export default TreeView;
