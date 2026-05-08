import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import TagInputBase from "@/components/TagInput/TagInputBase";
import { DummyIconButton, DummyTextInput } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const mockStyles = {
  tagInput: "tagInput",
  tagContainer: "tagContainer",
  tag: "tag",
  tagLabel: "tagLabel",
  inputWrapper: "inputWrapper",
  input: "input",
  removeButton: "removeButton",
  removeButtonIcon: "removeButtonIcon",
  suggestionList: "suggestionList",
  suggestionItem: "suggestionItem",
  active: "active",
  glass: "glass",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  warning: "warning",
  disabled: "disabled",
  xs: "xs",
  small: "small",
  medium: "medium",
  large: "large",
  xl: "xl",
  shadowNone: "shadowNone",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  shadowIntense: "shadowIntense",
  roundNone: "roundNone",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  roundFull: "roundFull",
};

describe("TagInputBase", () => {
  it("renders with default accessible group labeling", () => {
    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
      />,
    );

    const group = screen.getByRole("group", { name: /tag input/i });
    const input = screen.getByRole("combobox", { name: /add new tag/i });

    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute("data-testid", "tag-input");
    expect(input).toBeInTheDocument();
    expect(screen.getByTestId("tag-input-description")).toBeInTheDocument();
    expect(screen.getByTestId("tag-input-list")).toBeInTheDocument();
  });

  it("renders with custom aria-label on the group", () => {
    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        aria-label="Skills input"
      />,
    );

    expect(
      screen.getByRole("group", { name: /skills input/i }),
    ).toBeInTheDocument();
  });

  it("prefers aria-labelledby over aria-label on the group", () => {
    render(
      <>
        <span id="external-group-label">External Group Label</span>
        <TagInputBase
          classMap={mockStyles}
          TextInput={DummyTextInput}
          IconButton={DummyIconButton}
          aria-label="Hidden Group Label"
          aria-labelledby="external-group-label"
        />
      </>,
    );

    const group = screen.getByRole("group", {
      name: /external group label/i,
    });

    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute("aria-labelledby", "external-group-label");
    expect(group).not.toHaveAttribute("aria-label", "Hidden Group Label");
  });

  it("merges external aria-describedby with internal group description and status", () => {
    render(
      <>
        <p id="external-group-description">External description</p>
        <TagInputBase
          classMap={mockStyles}
          TextInput={DummyTextInput}
          IconButton={DummyIconButton}
          aria-describedby="external-group-description"
          idBase="skills"
        />
      </>,
    );

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute(
      "aria-describedby",
      "skills-desc skills-status external-group-description",
    );
  });

  it("renders the input with a custom inputAriaLabel", () => {
    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        inputAriaLabel="Add technology tag"
      />,
    );

    expect(
      screen.getByRole("combobox", { name: /add technology tag/i }),
    ).toBeInTheDocument();
  });

  it("prefers inputAriaLabelledBy over inputAriaLabel", () => {
    render(
      <>
        <span id="external-input-label">External Input Label</span>
        <TagInputBase
          classMap={mockStyles}
          TextInput={DummyTextInput}
          IconButton={DummyIconButton}
          inputAriaLabel="Hidden Input Label"
          inputAriaLabelledBy="external-input-label"
        />
      </>,
    );

    const input = screen.getByRole("combobox", {
      name: /external input label/i,
    });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-labelledby", "external-input-label");
    expect(input).not.toHaveAttribute("aria-label", "Hidden Input Label");
  });

  it("merges inputAriaDescribedBy with internal input description and status", () => {
    render(
      <>
        <p id="external-input-description">External input description</p>
        <TagInputBase
          classMap={mockStyles}
          TextInput={DummyTextInput}
          IconButton={DummyIconButton}
          inputAriaDescribedBy="external-input-description"
          idBase="skills"
        />
      </>,
    );

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "skills-desc skills-status external-input-description",
    );
  });

  it("uses idBase to generate stable ids", () => {
    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        idBase="custom-tags"
      />,
    );

    const input = screen.getByTestId("tag-input-input");
    const group = screen.getByRole("group");

    expect(input).toHaveAttribute("id", "custom-tags-input");
    expect(group).toHaveAttribute(
      "aria-describedby",
      "custom-tags-desc custom-tags-status",
    );
  });

  it("renders the placeholder only when there are no tags", () => {
    const { rerender } = render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        placeholder="Add a skill..."
      />,
    );

    expect(screen.getByTestId("tag-input-input")).toHaveAttribute(
      "placeholder",
      "Add a skill...",
    );

    rerender(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        placeholder="Add a skill..."
        tags={["React"]}
      />,
    );

    expect(screen.getByTestId("tag-input-input")).toHaveAttribute(
      "placeholder",
      "",
    );
  });

  it("adds a tag when Enter is pressed", () => {
    const handleChange = jest.fn();

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        onChange={handleChange}
      />,
    );

    const input = screen.getByTestId("tag-input-input");

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(handleChange).toHaveBeenCalledWith(["React"]);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("adds a tag when comma is pressed", () => {
    const handleChange = jest.fn();

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        onChange={handleChange}
      />,
    );

    const input = screen.getByTestId("tag-input-input");

    fireEvent.change(input, { target: { value: "TypeScript" } });
    fireEvent.keyDown(input, { key: ",", code: "Comma" });

    expect(handleChange).toHaveBeenCalledWith(["TypeScript"]);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("does not add duplicate tags case-insensitively", () => {
    const handleChange = jest.fn();

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        tags={["React"]}
        onChange={handleChange}
      />,
    );

    const input = screen.getByTestId("tag-input-input");

    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(handleChange).not.toHaveBeenCalledWith(["React", "react"]);
    expect(screen.getAllByText("React")).toHaveLength(1);
  });

  it("does not add an empty tag", () => {
    const handleChange = jest.fn();

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        onChange={handleChange}
      />,
    );

    const input = screen.getByTestId("tag-input-input");

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId("tag-input-tag-0")).not.toBeInTheDocument();
  });

  it("removes a tag using the remove button", () => {
    const handleChange = jest.fn();

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        tags={["JS"]}
        onChange={handleChange}
      />,
    );

    const removeBtn = screen.getByRole("button", { name: /remove tag js/i });
    fireEvent.click(removeBtn);

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it("uses the custom removeTagButtonLabel for remove buttons", () => {
    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        tags={["Vue"]}
        removeTagButtonLabel="Delete tag"
      />,
    );

    expect(
      screen.getByRole("button", { name: /delete tag vue/i }),
    ).toBeInTheDocument();
  });

  it("removes the last tag with Backspace when the input is empty", () => {
    const handleChange = jest.fn();

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        tags={["React", "Vue"]}
        onChange={handleChange}
      />,
    );

    const input = screen.getByTestId("tag-input-input");
    fireEvent.keyDown(input, { key: "Backspace", code: "Backspace" });

    expect(handleChange).toHaveBeenCalledWith(["React"]);
  });

  it("fetches and displays suggestions", async () => {
    jest.useFakeTimers();

    const fetchSuggestions = jest
      .fn()
      .mockResolvedValue(["React", "React Native"]);

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        fetchSuggestions={fetchSuggestions}
        debounceMs={0}
      />,
    );

    const input = screen.getByTestId("tag-input-input");
    fireEvent.change(input, { target: { value: "Re" } });

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(fetchSuggestions).toHaveBeenCalledWith("Re");
    });

    expect(
      await screen.findByRole("listbox", { name: /tag suggestions/i }),
    ).toBeInTheDocument();

    jest.useRealTimers();
  });

  it("uses suggestionsAriaLabel on the listbox", async () => {
    const fetchSuggestions = jest.fn().mockResolvedValue(["React"]);

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        fetchSuggestions={fetchSuggestions}
        debounceMs={0}
        suggestionsAriaLabel="Suggested tags"
      />,
    );

    fireEvent.change(screen.getByTestId("tag-input-input"), {
      target: { value: "Re" },
    });

    expect(
      await screen.findByRole("listbox", { name: /suggested tags/i }),
    ).toBeInTheDocument();
  });

  it("supports keyboard navigation through suggestions and selects with Enter", async () => {
    const handleChange = jest.fn();
    const fetchSuggestions = jest
      .fn()
      .mockResolvedValue(["React", "Vue", "Angular"]);

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        fetchSuggestions={fetchSuggestions}
        debounceMs={0}
        onChange={handleChange}
        idBase="skills"
      />,
    );

    const input = screen.getByTestId("tag-input-input");

    fireEvent.change(input, { target: { value: "r" } });

    await screen.findByRole("listbox");

    fireEvent.keyDown(input, { key: "ArrowDown", code: "ArrowDown" });
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      "skills-listbox-opt-1",
    );

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(handleChange).toHaveBeenCalledWith(["Vue"]);
  });

  it("closes suggestions on Escape", async () => {
    const fetchSuggestions = jest.fn().mockResolvedValue(["React"]);

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        fetchSuggestions={fetchSuggestions}
        debounceMs={0}
      />,
    );

    const input = screen.getByTestId("tag-input-input");
    fireEvent.change(input, { target: { value: "Re" } });

    await screen.findByRole("listbox");

    fireEvent.keyDown(input, { key: "Escape", code: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
  });

  it("selects a suggestion on click", async () => {
    const handleChange = jest.fn();
    const fetchSuggestions = jest.fn().mockResolvedValue(["Svelte"]);

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        fetchSuggestions={fetchSuggestions}
        debounceMs={0}
        onChange={handleChange}
      />,
    );

    const input = screen.getByTestId("tag-input-input");
    fireEvent.change(input, { target: { value: "Sv" } });

    const option = await screen.findByRole("option", { name: "Svelte" });
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith(["Svelte"]);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("announces suggestion availability in the live region", async () => {
    const fetchSuggestions = jest.fn().mockResolvedValue(["React", "Vue"]);

    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        fetchSuggestions={fetchSuggestions}
        debounceMs={0}
        idBase="skills"
      />,
    );

    fireEvent.change(screen.getByTestId("tag-input-input"), {
      target: { value: "r" },
    });

    await screen.findByRole("listbox");

    expect(screen.getByText(/2 suggestions available\./i)).toBeInTheDocument();
    expect(screen.getByText(/2 suggestions available\./i)).toHaveAttribute(
      "id",
      "skills-status",
    );
  });

  it("renders supplied tags from props", () => {
    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        tags={["React", "TypeScript"]}
      />,
    );

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByTestId("tag-input-tag-0")).toBeInTheDocument();
    expect(screen.getByTestId("tag-input-tag-1")).toBeInTheDocument();
  });

  it("updates internal tags when tags prop changes", () => {
    const { rerender } = render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        tags={["React"]}
      />,
    );

    expect(screen.getByText("React")).toBeInTheDocument();

    rerender(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        tags={["Vue"]}
      />,
    );

    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
  });

  it("applies theme, state, and size classes to the wrapper", () => {
    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        theme="primary"
        state="error"
        size="medium"
        glass
      />,
    );

    const wrapper = screen.getByTestId("tag-input");
    expect(wrapper).toHaveClass("tagInput");
    expect(wrapper).toHaveClass("primary");
    expect(wrapper).toHaveClass("error");
    expect(wrapper).toHaveClass("medium");
    expect(wrapper).toHaveClass("glass");
    expect(screen.getByTestId("tag-input-input")).toHaveAttribute(
      "data-glass",
      "true",
    );
  });

  it("applies rounding and shadow classes to each tag", () => {
    render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        tags={["React"]}
        glass
        rounding="medium"
        shadow="light"
      />,
    );

    const tag = screen.getByTestId("tag-input-tag-0");
    expect(tag).toHaveClass("tag");
    expect(tag).toHaveClass("roundMedium");
    expect(tag).toHaveClass("shadowLight");
    expect(screen.getByTestId("tag-input-remove-0")).toHaveAttribute(
      "data-glass",
      "true",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <TagInputBase
        classMap={mockStyles}
        TextInput={DummyTextInput}
        IconButton={DummyIconButton}
        aria-description="Accessible tag input"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
