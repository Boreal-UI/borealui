import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  act,
} from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom";

import CommandPaletteBase from "@/components/CommandPalette/CommandPaletteBase";
import { DummyTextInput } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

type CommandItem = {
  id?: string;
  label: string;
  action: jest.Mock;
  icon?: React.ReactNode;
  "aria-label"?: string;
  "aria-description"?: string;
  disabled?: boolean;
  keywords?: string[];
};

const createMockCommands = (): CommandItem[] => [
  { id: "settings", label: "Open Settings", action: jest.fn() },
  { id: "search", label: "Search Files", action: jest.fn() },
  { id: "quit", label: "Quit", action: jest.fn() },
];

const classMap: Record<string, string> = {
  overlay: "overlay",
  command_palette: "palette",
  primary: "theme-primary",
  secondary: "theme-secondary",
  success: "state-success",
  disabled: "disabled",
  input: "input",
  label: "label",
  list: "list",
  item: "item",
  itemLabel: "itemLabel",
  active: "active",
  icon: "icon",
  empty: "empty",
  srOnly: "srOnly",
  shadowLight: "shadowLight",
  shadowNone: "shadowNone",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  glass: "glass",
};

type RenderPaletteOptions = {
  open?: boolean;
  commands?: CommandItem[];
  onClose?: jest.Mock;
  asyncSearch?: (query: string) => Promise<CommandItem[]>;
  debounceMs?: number;
  placeholder?: string;
  theme?: "primary" | "secondary";
  rounding?: "medium" | "large";
  shadow?: "light" | "none";
  state?: "" | "success";
  className?: string;
  variant?: "solid" | "outline" | "glass" | "glassOutline";
  testId?: string;

  paletteId?: string;
  inputId?: string;
  listboxId?: string;

  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;

  inputAriaLabel?: string;
  inputAriaLabelledBy?: string;
  inputAriaDescribedBy?: string;
  inputLabel?: string;

  listAriaLabel?: string;
  emptyMessage?: string;
  resultsAnnouncement?: string;
  modal?: boolean;
  trapFocus?: boolean;
  restoreFocusOnClose?: boolean;
};

const setupPortal = (): HTMLDivElement => {
  const portal = document.createElement("div");
  portal.id = "widget-portal";
  document.body.appendChild(portal);
  return portal;
};

const renderPalette = ({
  open = true,
  commands = createMockCommands(),
  onClose = jest.fn(),
  asyncSearch,
  debounceMs = 300,
  placeholder = "Search...",
  theme = "primary",
  rounding = "medium",
  shadow = "light",
  state = "",
  className,
  variant = "solid",
  testId = "command-palette",
  paletteId,
  inputId,
  listboxId,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  inputAriaLabel,
  inputAriaLabelledBy,
  inputAriaDescribedBy,
  inputLabel,
  listAriaLabel,
  emptyMessage,
  resultsAnnouncement,
  modal,
  trapFocus,
  restoreFocusOnClose,
}: RenderPaletteOptions = {}) => {
  return {
    ...render(
      <CommandPaletteBase
        open={open}
        commands={commands}
        onClose={onClose}
        asyncSearch={asyncSearch}
        debounceMs={debounceMs}
        placeholder={placeholder}
        theme={theme}
        rounding={rounding}
        shadow={shadow}
        state={state}
        TextInputComponent={DummyTextInput}
        classMap={classMap}
        className={className}
        data-testid={testId}
        paletteId={paletteId}
        inputId={inputId}
        listboxId={listboxId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        inputAriaLabel={inputAriaLabel}
        inputAriaLabelledBy={inputAriaLabelledBy}
        inputAriaDescribedBy={inputAriaDescribedBy}
        inputLabel={inputLabel}
        listAriaLabel={listAriaLabel}
        emptyMessage={emptyMessage}
        resultsAnnouncement={resultsAnnouncement}
        modal={modal}
        trapFocus={trapFocus}
        restoreFocusOnClose={restoreFocusOnClose}
        variant={variant}
      />,
    ),
    commands,
    onClose,
  };
};

describe("CommandPaletteBase", () => {
  beforeEach(() => {
    setupPortal();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("renders nothing when closed", () => {
    renderPalette({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("renders dialog, combobox, and all command options when open", () => {
    const commands = createMockCommands();

    renderPalette({ commands });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(commands.length);
    expect(screen.getByText("Open Settings")).toBeInTheDocument();
    expect(screen.getByText("Search Files")).toBeInTheDocument();
    expect(screen.getByText("Quit")).toBeInTheDocument();
  });

  it("renders inside the portal", () => {
    const portal = document.getElementById("widget-portal");
    renderPalette();

    expect(portal).toContainElement(screen.getByRole("dialog"));
  });

  it("applies default, glass, and custom classes to the palette container", () => {
    renderPalette({
      className: "custom-class",
      theme: "primary",
      rounding: "medium",
      shadow: "light",
      state: "success",
      variant: "glassOutline",
    });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("palette");
    expect(dialog).toHaveClass("theme-primary");
    expect(dialog).toHaveClass("state-success");
    expect(dialog).toHaveClass("glass");
    expect(dialog).toHaveClass("shadowLight");
    expect(dialog).toHaveClass("roundMedium");
    expect(dialog).toHaveClass("custom-class");
  });

  it("passes glass styling to the nested text input", () => {
    renderPalette({ variant: "glassOutline" });

    expect(screen.getByRole("combobox")).toHaveAttribute("data-glass", "true");
  });

  it("uses a custom placeholder", () => {
    renderPalette({ placeholder: "Type a command" });

    expect(screen.getByPlaceholderText("Type a command")).toBeInTheDocument();
  });

  it("uses the provided test id", () => {
    renderPalette({ testId: "custom-command-palette" });

    expect(screen.getByTestId("custom-command-palette")).toBeInTheDocument();
    expect(
      screen.getByTestId("custom-command-palette-overlay"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("custom-command-palette-input"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("custom-command-palette-listbox"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("custom-command-palette-live-region"),
    ).toBeInTheDocument();
  });

  it("attempts to focus the input when opened", () => {
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");

    renderPalette();

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it("adds noScroll class to body while open", () => {
    renderPalette();

    expect(document.body).toHaveClass("noScroll");
  });

  it("filters commands based on input value", () => {
    renderPalette();

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Search" } });

    expect(screen.getByText("Search Files")).toBeInTheDocument();
    expect(screen.queryByText("Open Settings")).not.toBeInTheDocument();
    expect(screen.queryByText("Quit")).not.toBeInTheDocument();
  });

  it("filters commands case-insensitively", () => {
    renderPalette();

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "search" } });

    expect(screen.getByText("Search Files")).toBeInTheDocument();
    expect(screen.queryByText("Open Settings")).not.toBeInTheDocument();
  });

  it("filters commands by keywords", () => {
    const commands: CommandItem[] = [
      {
        label: "Open Settings",
        action: jest.fn(),
        keywords: ["preferences", "config"],
      },
      {
        label: "Quit",
        action: jest.fn(),
      },
    ];

    renderPalette({ commands });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "preferences" },
    });

    expect(screen.getByText("Open Settings")).toBeInTheDocument();
    expect(screen.queryByText("Quit")).not.toBeInTheDocument();
  });

  it("renders custom empty message if no matches exist", () => {
    renderPalette({ emptyMessage: "Nothing found" });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Nonexistent" } });

    const emptyOption = screen.getByTestId("command-palette-empty");
    expect(emptyOption).toBeInTheDocument();
    expect(emptyOption).toHaveTextContent("Nothing found");
    expect(emptyOption).toHaveAttribute("aria-disabled", "true");
  });

  it("sets the first enabled filtered option as active by default", () => {
    renderPalette();

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });

  it("skips disabled options when setting the initial active item", () => {
    const commands: CommandItem[] = [
      { label: "Disabled", action: jest.fn(), disabled: true },
      { label: "Enabled", action: jest.fn() },
    ];

    renderPalette({ commands });

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "false");
    expect(options[0]).toHaveClass("disabled");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
  });

  it("updates active option with arrow keys", () => {
    renderPalette();

    const input = screen.getByRole("combobox");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    let options = screen.getAllByRole("option");
    expect(options[1]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    options = screen.getAllByRole("option");
    expect(options[2]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    options = screen.getAllByRole("option");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
  });

  it("skips disabled items during keyboard navigation", () => {
    const commands: CommandItem[] = [
      { label: "First", action: jest.fn() },
      { label: "Second", action: jest.fn(), disabled: true },
      { label: "Third", action: jest.fn() },
    ];

    renderPalette({ commands });

    const input = screen.getByRole("combobox");

    fireEvent.keyDown(input, { key: "ArrowDown" });

    const options = screen.getAllByRole("option");
    expect(options[2]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-disabled", "true");
  });

  it("supports Home and End keys", () => {
    renderPalette();

    const input = screen.getByRole("combobox");

    fireEvent.keyDown(input, { key: "End" });
    let options = screen.getAllByRole("option");
    expect(options[2]).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(input, { key: "Home" });
    options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });

  it("wraps navigation from last to first with ArrowDown", () => {
    renderPalette();

    const input = screen.getByRole("combobox");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
  });

  it("wraps navigation from first to last with ArrowUp", () => {
    renderPalette();

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowUp" });

    const options = screen.getAllByRole("option");
    expect(options[2]).toHaveAttribute("aria-selected", "true");
  });

  it("does not change selection with arrow keys when there are no matches", () => {
    renderPalette();

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "zzz" } });

    const option = screen.getByRole("option");
    expect(option).toHaveTextContent("No matching results");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(option).toHaveAttribute("aria-selected", "false");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(option).toHaveAttribute("aria-selected", "false");
  });

  it("calls the active command action and closes on Enter", () => {
    const commands = createMockCommands();
    const onClose = jest.fn();

    renderPalette({ commands, onClose });

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(commands[0].action).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls the currently selected command on Enter after keyboard navigation", () => {
    const commands = createMockCommands();
    const onClose = jest.fn();

    renderPalette({ commands, onClose });

    const input = screen.getByRole("combobox");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(commands[0].action).not.toHaveBeenCalled();
    expect(commands[1].action).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not execute disabled commands on Enter", () => {
    const commands: CommandItem[] = [
      { label: "Disabled", action: jest.fn(), disabled: true },
      { label: "Enabled", action: jest.fn() },
    ];
    const onClose = jest.fn();

    renderPalette({ commands, onClose });

    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });

    expect(commands[0].action).not.toHaveBeenCalled();
    expect(commands[1].action).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does nothing on Enter when no active command exists", () => {
    const commands = createMockCommands();
    const onClose = jest.fn();

    renderPalette({ commands, onClose });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "nothing" } });
    fireEvent.keyDown(input, { key: "Enter" });

    commands.forEach((command) => {
      expect(command.action).not.toHaveBeenCalled();
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls action and closes when a command is clicked", () => {
    const commands = createMockCommands();
    const onClose = jest.fn();

    renderPalette({ commands, onClose });

    fireEvent.click(screen.getByText("Quit"));

    expect(commands[2].action).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call action when a disabled command is clicked", () => {
    const commands: CommandItem[] = [
      { label: "Disabled", action: jest.fn(), disabled: true },
    ];
    const onClose = jest.fn();

    renderPalette({ commands, onClose });

    fireEvent.click(screen.getByText("Disabled"));

    expect(commands[0].action).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("updates the active item on mouse enter for enabled items", () => {
    const commands: CommandItem[] = [
      { label: "First", action: jest.fn() },
      { label: "Second", action: jest.fn() },
    ];

    renderPalette({ commands });

    fireEvent.mouseEnter(screen.getByTestId("command-palette-option-1"));

    const options = screen.getAllByRole("option");
    expect(options[1]).toHaveAttribute("aria-selected", "true");
  });

  it("does not update the active item on mouse enter for disabled items", () => {
    const commands: CommandItem[] = [
      { label: "First", action: jest.fn() },
      { label: "Second", action: jest.fn(), disabled: true },
    ];

    renderPalette({ commands });

    fireEvent.mouseEnter(screen.getByTestId("command-palette-option-1"));

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });

  it("closes when the overlay is pressed", () => {
    const onClose = jest.fn();

    renderPalette({ onClose });

    fireEvent.mouseDown(screen.getByTestId("command-palette-overlay"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking inside the dialog", () => {
    const onClose = jest.fn();

    renderPalette({ onClose });

    fireEvent.click(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes when Escape is pressed on the input", () => {
    const onClose = jest.fn();

    renderPalette({ onClose });

    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("closes when Escape is pressed on the dialog container", () => {
    const onClose = jest.fn();

    renderPalette({ onClose });

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("passes accessibility attributes to the combobox and listbox", () => {
    renderPalette({
      testId: "palette-a11y",
      inputId: "palette-input",
      listboxId: "palette-listbox",
      listAriaLabel: "Palette results",
    });

    const input = screen.getByRole("combobox");
    const listbox = screen.getByRole("listbox");

    expect(input).toHaveAttribute("id", "palette-input");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-haspopup", "listbox");
    expect(input).toHaveAttribute("aria-controls", "palette-listbox");
    expect(listbox).toHaveAttribute("id", "palette-listbox");
    expect(listbox).toHaveAttribute("aria-label", "Palette results");
  });

  it("uses the provided palette accessibility attributes", () => {
    render(
      <>
        <h2 id="palette-heading">Command Menu</h2>
        <p id="palette-description">Search and run a command.</p>
        <CommandPaletteBase
          open
          commands={createMockCommands()}
          onClose={jest.fn()}
          TextInputComponent={DummyTextInput}
          classMap={classMap}
          aria-labelledby="palette-heading"
          aria-describedby="palette-description"
          data-testid="command-palette"
        />
      </>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "palette-heading");
    expect(dialog).toHaveAttribute("aria-describedby", "palette-description");
  });

  it("uses a visible input label when provided", () => {
    renderPalette({ inputLabel: "Search commands" });

    const label = screen.getByTestId("command-palette-input-label");
    const input = screen.getByRole("combobox");

    expect(label).toHaveTextContent("Search commands");
    expect(input).toHaveAttribute("aria-labelledby", label.id);
  });

  it("uses inputAriaLabel when provided", () => {
    renderPalette({ inputAriaLabel: "Command search field" });

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-label",
      "Command search field",
    );
  });

  it("uses inputAriaLabelledBy when provided", () => {
    render(
      <>
        <span id="external-label">External command search label</span>
        <CommandPaletteBase
          open
          commands={createMockCommands()}
          onClose={jest.fn()}
          TextInputComponent={DummyTextInput}
          classMap={classMap}
          inputAriaLabelledBy="external-label"
          data-testid="command-palette"
        />
      </>,
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-labelledby",
      "external-label",
    );
  });

  it("uses inputAriaDescribedBy when provided", () => {
    render(
      <>
        <span id="input-description">Type to filter commands</span>
        <CommandPaletteBase
          open
          commands={createMockCommands()}
          onClose={jest.fn()}
          TextInputComponent={DummyTextInput}
          classMap={classMap}
          inputAriaDescribedBy="input-description"
          data-testid="command-palette"
        />
      </>,
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-describedby",
      "input-description",
    );
  });

  it("updates aria-activedescendant to match the active option id", () => {
    renderPalette({
      listboxId: "palette-listbox",
      commands: [
        { id: "settings", label: "Open Settings", action: jest.fn() },
        { id: "search", label: "Search Files", action: jest.fn() },
      ],
    });

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      "palette-listbox-option-settings",
    );

    fireEvent.keyDown(input, { key: "ArrowDown" });

    expect(input).toHaveAttribute(
      "aria-activedescendant",
      "palette-listbox-option-search",
    );
  });

  it("respects a provided aria-activedescendant override", () => {
    render(
      <CommandPaletteBase
        open
        commands={createMockCommands()}
        onClose={jest.fn()}
        TextInputComponent={DummyTextInput}
        classMap={classMap}
        aria-activedescendant="custom-active-descendant"
        data-testid="command-palette"
      />,
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-activedescendant",
      "custom-active-descendant",
    );
  });

  it("sets aria-expanded to true when open", () => {
    renderPalette();

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("respects a provided aria-expanded override", () => {
    render(
      <CommandPaletteBase
        open
        commands={createMockCommands()}
        onClose={jest.fn()}
        TextInputComponent={DummyTextInput}
        classMap={classMap}
        aria-expanded={false}
        data-testid="command-palette"
      />,
    );

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("renders icons for commands when provided", () => {
    const commands: CommandItem[] = [
      {
        label: "With Icon",
        action: jest.fn(),
        icon: <span data-testid="command-icon">⭐</span>,
      },
    ];

    renderPalette({ commands });

    expect(screen.getByTestId("command-icon")).toBeInTheDocument();
  });

  it("passes aria-label and aria-description to command options", () => {
    const commands: CommandItem[] = [
      {
        id: "announce",
        label: "Announce",
        action: jest.fn(),
        "aria-label": "Announce command",
        "aria-description": "Sends a message to all users",
      },
    ];

    renderPalette({ commands, listboxId: "palette-list" });

    const option = screen.getByRole("option");
    expect(option).toHaveAttribute("aria-label", "Announce command");
    expect(option).toHaveAttribute(
      "aria-describedby",
      "palette-list-option-announce-description",
    );

    expect(
      screen.getByTestId("command-palette-option-description-0"),
    ).toHaveTextContent("Sends a message to all users");
  });

  it("supports async search and shows loading state", async () => {
    jest.useFakeTimers();

    const asyncResults: CommandItem[] = [
      { label: "Remote Command", action: jest.fn() },
    ];

    const asyncSearch = jest
      .fn<Promise<CommandItem[]>, [string]>()
      .mockResolvedValue(asyncResults);

    renderPalette({
      commands: [],
      asyncSearch,
      debounceMs: 200,
    });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "remote" } });

    expect(screen.getByText("Searching…")).toBeInTheDocument();
    expect(screen.getByTestId("command-palette-live-region")).toHaveTextContent(
      "Searching commands",
    );

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(asyncSearch).toHaveBeenCalledWith("remote");
    });

    await waitFor(() => {
      expect(screen.getByText("Remote Command")).toBeInTheDocument();
    });

    expect(screen.queryByText("Searching…")).not.toBeInTheDocument();
  });

  it("uses only async results when asyncSearch is provided", async () => {
    jest.useFakeTimers();

    const commands = createMockCommands();
    const asyncResults: CommandItem[] = [
      { label: "Async Result", action: jest.fn() },
    ];

    const asyncSearch = jest
      .fn<Promise<CommandItem[]>, [string]>()
      .mockResolvedValue(asyncResults);

    renderPalette({
      commands,
      asyncSearch,
      debounceMs: 100,
    });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "anything" } });

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(screen.getByText("Async Result")).toBeInTheDocument();
    });

    expect(screen.queryByText("Open Settings")).not.toBeInTheDocument();
  });

  it("shows empty results after async search failure", async () => {
    jest.useFakeTimers();

    const asyncSearch = jest
      .fn<Promise<CommandItem[]>, [string]>()
      .mockRejectedValue(new Error("Search failed"));

    renderPalette({
      commands: [],
      asyncSearch,
      debounceMs: 100,
    });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "broken" } });

    expect(screen.getByText("Searching…")).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(asyncSearch).toHaveBeenCalledWith("broken");
    });

    await waitFor(() => {
      expect(screen.getByTestId("command-palette-empty")).toHaveTextContent(
        "No matching results",
      );
    });

    expect(screen.getByTestId("command-palette-empty")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("does not call asyncSearch when query is empty or whitespace", async () => {
    jest.useFakeTimers();

    const asyncSearch = jest
      .fn<Promise<CommandItem[]>, [string]>()
      .mockResolvedValue([]);

    renderPalette({
      commands: [],
      asyncSearch,
      debounceMs: 100,
    });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "   " } });

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    expect(asyncSearch).not.toHaveBeenCalled();
    expect(screen.getByTestId("command-palette-empty")).toHaveTextContent(
      "No matching results",
    );
  });

  it("debounces asyncSearch calls", async () => {
    jest.useFakeTimers();

    const asyncSearch = jest
      .fn<Promise<CommandItem[]>, [string]>()
      .mockResolvedValue([]);

    renderPalette({
      commands: [],
      asyncSearch,
      debounceMs: 300,
    });

    const input = screen.getByRole("combobox");

    fireEvent.change(input, { target: { value: "r" } });
    fireEvent.change(input, { target: { value: "re" } });
    fireEvent.change(input, { target: { value: "rem" } });

    await act(async () => {
      jest.advanceTimersByTime(299);
    });

    expect(asyncSearch).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    await waitFor(() => {
      expect(asyncSearch).toHaveBeenCalledTimes(1);
    });

    expect(asyncSearch).toHaveBeenCalledWith("rem");
  });

  it("marks the listbox busy while async search is loading", () => {
    jest.useFakeTimers();

    const asyncSearch = jest
      .fn<Promise<CommandItem[]>, [string]>()
      .mockImplementation(
        () =>
          new Promise<CommandItem[]>((resolve) => {
            setTimeout(() => resolve([]), 500);
          }),
      );

    renderPalette({
      commands: [],
      asyncSearch,
      debounceMs: 100,
    });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "loading" } });

    const listbox = screen.getByRole("listbox");
    expect(listbox).toHaveAttribute("aria-busy", "true");
  });

  it("announces the result count in the live region", () => {
    renderPalette({
      resultsAnnouncement: "commands found",
    });

    expect(screen.getByTestId("command-palette-live-region")).toHaveTextContent(
      "3 commands found",
    );
  });

  it("announces the empty message in the live region when no results remain", () => {
    renderPalette({ emptyMessage: "Nothing found" });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "zzz" },
    });

    expect(screen.getByTestId("command-palette-live-region")).toHaveTextContent(
      "Nothing found",
    );
  });

  it("restores focus to the previously focused element when closed", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open palette";
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = renderPalette();

    unmount();

    expect(trigger).toHaveFocus();
  });

  it("does not restore focus when restoreFocusOnClose is false", () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open palette";
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = renderPalette({ restoreFocusOnClose: false });

    unmount();

    expect(trigger).not.toHaveFocus();
  });

  it("uses region role instead of dialog when modal is false", () => {
    renderPalette({ modal: false, ariaLabel: "Command palette region" });

    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("traps focus with Tab when trapFocus is true", () => {
    renderPalette({ trapFocus: true });

    const dialog = screen.getByRole("dialog");
    const input = screen.getByRole("combobox");

    input.focus();
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });

    expect(input).toHaveFocus();
  });

  it("renders the combobox when opened", () => {
    renderPalette();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("has no accessibility violations when open", async () => {
    const { container } = renderPalette({
      ariaLabel: "Command palette",
      inputAriaLabel: "Search commands",
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when showing an empty state", async () => {
    const { container } = renderPalette({
      ariaLabel: "Command palette",
      inputAriaLabel: "Search commands",
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "nope" },
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
