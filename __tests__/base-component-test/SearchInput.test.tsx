import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import SearchInputBase from "@/components/SearchInput/SearchInputBase";

expect.extend(toHaveNoViolations);

const classMap = {
  container: "container",
  label: "label",
  labelTop: "labelTop",
  labelBottom: "labelBottom",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  searchInput: "searchInput",
  input: "input",
  icon: "icon",
  loader: "loader",
  clearButton: "clearButton",
  searchButton: "searchButton",
  searchGlyph: "searchGlyph",
  srOnly: "srOnly",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  clear: "clear",
  outline: "outline",
  glass: "glass",
  disabled: "disabled",
  loading: "loading",
  shadowLight: "shadowLight",
  shadowStrong: "shadowStrong",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
};

const renderSearchInput = (
  props: Partial<React.ComponentProps<typeof SearchInputBase>> = {},
) =>
  render(
    <SearchInputBase
      label="Search docs"
      classMap={classMap}
      {...props}
    />,
  );

describe("SearchInputBase", () => {
  it("renders a labelled native search input", () => {
    renderSearchInput({ value: "tokens" });

    const input = screen.getByRole("searchbox", { name: "Search docs" });
    expect(input).toHaveAttribute("type", "search");
    expect(input).toHaveValue("tokens");
    expect(screen.getByTestId("search-input-label")).toHaveTextContent(
      "Search docs",
    );
  });

  it("emits string values from user input", () => {
    const onChange = jest.fn();
    renderSearchInput({ onChange });

    fireEvent.change(screen.getByTestId("search-input-input"), {
      target: { value: "button" },
    });

    expect(onChange).toHaveBeenCalledWith("button", expect.any(Object));
  });

  it("submits search when Enter is pressed", () => {
    const onSearch = jest.fn();
    renderSearchInput({ defaultValue: "menus", onSearch });

    fireEvent.keyDown(screen.getByTestId("search-input-input"), {
      key: "Enter",
    });

    expect(onSearch).toHaveBeenCalledWith("menus", expect.any(Object));
  });

  it("does not submit search when Enter is prevented", () => {
    const onSearch = jest.fn();
    renderSearchInput({
      defaultValue: "menus",
      onSearch,
      onKeyDown: (event) => event.preventDefault(),
    });

    fireEvent.keyDown(screen.getByTestId("search-input-input"), {
      key: "Enter",
    });

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("clears uncontrolled values with the clear button", () => {
    const onClear = jest.fn();
    renderSearchInput({ defaultValue: "avatar", onClear });

    fireEvent.click(screen.getByTestId("search-input-clear"));

    expect(screen.getByTestId("search-input-input")).toHaveValue("");
    expect(onClear).toHaveBeenCalledWith(expect.any(Object));
  });

  it("can hide the clear button", () => {
    renderSearchInput({ defaultValue: "avatar", showClearButton: false });

    expect(screen.queryByTestId("search-input-clear")).not.toBeInTheDocument();
  });

  it("renders an optional search button", () => {
    const onSearch = jest.fn();
    renderSearchInput({
      defaultValue: "forms",
      showSearchButton: true,
      onSearch,
    });

    fireEvent.click(screen.getByTestId("search-input-submit"));

    expect(onSearch).toHaveBeenCalledWith("forms", expect.any(Object));
  });

  it("uses aria-label when no visible label is provided", () => {
    renderSearchInput({ label: undefined, "aria-label": "Search site" });

    expect(
      screen.getByRole("searchbox", { name: "Search site" }),
    ).toBeInTheDocument();
  });

  it("connects screen-reader-only text with aria-describedby", () => {
    renderSearchInput({
      id: "docs-search",
      srOnlyText: "Search component documentation",
    });

    expect(screen.getByTestId("search-input-sr-only-text")).toHaveTextContent(
      "Search component documentation",
    );
    expect(screen.getByTestId("search-input-input")).toHaveAttribute(
      "aria-describedby",
      "docs-search-sr-description",
    );
  });

  it("applies loading semantics and class names", () => {
    renderSearchInput({ loading: true });

    expect(screen.getByTestId("search-input-wrapper")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByTestId("search-input-wrapper")).toHaveClass("loading");
    expect(screen.getByTestId("search-input-loader")).toBeInTheDocument();
  });

  it("applies theme, state, outline, glass, rounding, and shadow classes", () => {
    renderSearchInput({
      theme: "secondary",
      state: "success",
      outline: true,
      glass: true,
      rounding: "large",
      shadow: "strong",
    });

    const wrapper = screen.getByTestId("search-input-wrapper");
    expect(wrapper).toHaveClass("searchInput");
    expect(wrapper).toHaveClass("secondary");
    expect(wrapper).toHaveClass("success");
    expect(wrapper).toHaveClass("outline");
    expect(wrapper).toHaveClass("glass");
    expect(wrapper).toHaveClass("roundLarge");
    expect(wrapper).toHaveClass("shadowStrong");
  });

  it("applies label position and custom class names", () => {
    renderSearchInput({
      labelPosition: "left",
      containerClassName: "customContainer",
      labelClassName: "customLabel",
      inputClassName: "customInput",
      clearButtonClassName: "customClear",
      defaultValue: "chip",
    });

    expect(screen.getByTestId("search-input")).toHaveClass("labelLeft");
    expect(screen.getByTestId("search-input")).toHaveClass("customContainer");
    expect(screen.getByTestId("search-input-label")).toHaveClass("customLabel");
    expect(screen.getByTestId("search-input-input")).toHaveClass("customInput");
    expect(screen.getByTestId("search-input-clear")).toHaveClass("customClear");
  });

  it("disables the input and actions when disabled", () => {
    renderSearchInput({
      disabled: true,
      defaultValue: "modal",
      showSearchButton: true,
    });

    expect(screen.getByTestId("search-input-wrapper")).toHaveClass("disabled");
    expect(screen.getByTestId("search-input-input")).toBeDisabled();
    expect(screen.getByTestId("search-input-clear")).toBeDisabled();
    expect(screen.getByTestId("search-input-submit")).toBeDisabled();
  });

  it("forwards refs to the input", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <SearchInputBase label="Search docs" classMap={classMap} ref={ref} />,
    );

    expect(ref.current).toBe(screen.getByTestId("search-input-input"));
  });

  it("has no accessibility violations", async () => {
    const { container } = renderSearchInput({
      defaultValue: "accordion",
      showSearchButton: true,
      srOnlyText: "Search all Boreal UI components",
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
