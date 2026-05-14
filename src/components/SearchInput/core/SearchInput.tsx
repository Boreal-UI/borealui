import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./SearchInput.scss";
import SearchInputBase from "../SearchInputBase";
import { SearchInputProps } from "../SearchInput.types";

const classes = {
  container: "searchInput_container",
  label: "searchInput_label",
  labelTop: "searchInput_labelTop",
  labelBottom: "searchInput_labelBottom",
  labelLeft: "searchInput_labelLeft",
  labelRight: "searchInput_labelRight",

  searchInput: "searchInput",
  input: "searchInput_input",
  icon: "searchInput_icon",
  iconLeft: "searchInput_icon_left",
  iconRight: "searchInput_icon_right",
  loader: "searchInput_loader",
  clearButton: "searchInput_clearButton",
  searchButton: "searchInput_searchButton",
  searchGlyph: "searchInput_searchGlyph",
  srOnly: "sr_only",

  primary: "searchInput_primary",
  secondary: "searchInput_secondary",
  tertiary: "searchInput_tertiary",
  quaternary: "searchInput_quaternary",

  success: "searchInput_success",
  info: "searchInput_info",
  warning: "searchInput_warning",
  error: "searchInput_error",

  clear: "searchInput_clear",
  outline: "searchInput_outline",
  glass: "searchInput_glass",
  disabled: "searchInput_disabled",
  loading: "searchInput_loading",

  shadowNone: "searchInput_shadow-None",
  shadowLight: "searchInput_shadow-Light",
  shadowMedium: "searchInput_shadow-Medium",
  shadowStrong: "searchInput_shadow-Strong",
  shadowIntense: "searchInput_shadow-Intense",

  roundNone: "searchInput_round-None",
  roundSmall: "searchInput_round-Small",
  roundMedium: "searchInput_round-Medium",
  roundLarge: "searchInput_round-Large",
  roundFull: "searchInput_round-Full",
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => (
    <SearchInputBase {...props} ref={ref} classMap={expandClassMap(classes)} />
  ),
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
