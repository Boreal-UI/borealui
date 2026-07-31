"use client";

import { expandClassMap } from "@/utils/propAliases";
import { forwardRef } from "react";
import styles from "./SearchInput.module.scss";
import SearchInputBase from "../SearchInputBase";
import { SearchInputProps } from "../SearchInput.types";

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (props, ref) => (
    <SearchInputBase {...props} ref={ref} classMap={expandClassMap(styles)} />
  ),
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
