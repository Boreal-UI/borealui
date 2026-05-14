import { expandClassMap } from "@/utils/propAliases";
import React from "react";
import "./TagInput.scss";
import IconButton from "../../IconButton/core/IconButton";
import TextInput from "../../TextInput/core/TextInput";
import TagInputBase from "../TagInputBase";
import { TagInputProps } from "../TagInput.types";

const classes = {
  tagInput: "tag_input",
  tagContainer: "tag_input_tag_container",
  tag: "tag_input_tag",
  tagLabel: "tag_input_tag_label",
  removeButton: "tag_input_remove_button",
  removeButtonIcon: "tag_input_remove_button_icon",
  inputWrapper: "tag_input_input_wrapper",
  input: "tag_input_input",
  suggestionList: "tag_input_suggestion_list",
  suggestionItem: "tag_input_suggestion_item",
  active: "tag_input_active",

  primary: "tag_input_primary",
  secondary: "tag_input_secondary",
  tertiary: "tag_input_tertiary",
  quaternary: "tag_input_quaternary",

  success: "tag_input_success",
  info: "tag_input_info",
  warning: "tag_input_warning",
  error: "tag_input_error",

  clear: "tag_input_clear",
  glass: "tag_input_glass",

  xs: "tag_input_xs",
  small: "tag_input_small",
  medium: "tag_input_medium",
  large: "tag_input_large",
  xl: "tag_input_xl",

  shadowNone: "tag_shadow-None",
  shadowLight: "tag_shadow-Light",
  shadowMedium: "tag_shadow-Medium",
  shadowStrong: "tag_shadow-Strong",
  shadowIntense: "tag_shadow-Intense",

  roundNone: "tag_round-None",
  roundSmall: "tag_round-Small",
  roundMedium: "tag_round-Medium",
  roundLarge: "tag_round-Large",
};

const TagInput: React.FC<TagInputProps> = (props) => {
  return (
    <TagInputBase
      {...props}
      classMap={expandClassMap(classes)}
      IconButton={IconButton}
      TextInput={TextInput}
    />
  );
};
TagInput.displayName = "TagInput";
export default TagInput;
