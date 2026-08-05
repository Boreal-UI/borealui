import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import "./SearchInput.scss";
import SearchInputBase from "../SearchInputBase";
import { SearchInputProps } from "../SearchInput.types";

const classes = {
  xs: "searchInput_xs",
  small: "searchInput_small",
  medium: "searchInput_medium",
  large: "searchInput_large",
  xl: "searchInput_xl",
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

  primary: "searchInput_primary",
  secondary: "searchInput_secondary",
  tertiary: "searchInput_tertiary",
  quaternary: "searchInput_quaternary",

  success: "searchInput_success",
  info: "searchInput_info",
  warning: "searchInput_warning",
  error: "searchInput_error",

  clear: "searchInput_clear",
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
  glass: "searchInput_glass",
  outline: "searchInput_outline",
};

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => (
    <SearchInputBase {...props} ref={ref} classMap={expandClassMap(classes)} />
  ),
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
