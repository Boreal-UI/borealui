import React, {
  useId,
  useState,
  KeyboardEvent,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { TagInputBaseProps } from "./TagInput.types";
import { CloseIcon } from "../../Icons";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const EMPTY_TAGS: string[] = [];

const TagInputBase: React.FC<TagInputBaseProps> = ({
  tags = EMPTY_TAGS,
  "aria-label": ariaLabel = "Tag Input",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-description":
    ariaDescription = "Type a tag and press Enter or comma to add. Use arrow keys to navigate suggestions; Enter to select; Escape to close. Backspace removes the last tag when the field is empty.",
  inputAriaLabel = "Add new tag",
  inputAriaLabelledBy,
  inputAriaDescribedBy,
  suggestionsAriaLabel = "Tag suggestions",
  removeTagButtonLabel = "Remove tag",
  onChange,
  fetchSuggestions,
  debounceMs = 300,
  placeholder = "Add a tag...",
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  state,
  size = getDefaultSize(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  idBase,
  "data-testid": dataTestId,
  testId = dataTestId ?? "tag-input",
  classMap,
  IconButton,
  TextInput,
}) => {
  const uid = useId();
  const baseId = idBase || testId || `tag-input-${uid}`;

  const inputId = `${baseId}-input`;
  const descId = `${baseId}-desc`;
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;
  const statusId = `${baseId}-status`;

  const [inputValue, setInputValue] = useState("");
  const [internalTags, setInternalTags] = useState<string[]>(tags);
  const [lastAction, setLastAction] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInternalTags((prev) => {
      if (
        prev.length === tags.length &&
        prev.every((tag, index) => tag === tags[index])
      ) {
        return prev;
      }

      return tags;
    });
  }, [tags]);

  const tagList = internalTags;

  const hasTag = (val: string) =>
    tagList.some((t) => t.toLowerCase() === val.toLowerCase());

  useEffect(() => {
    if (!fetchSuggestions) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = inputValue.trim();
    if (!query) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    debounceRef.current = setTimeout(() => {
      void (async () => {
        try {
          const result = await fetchSuggestions(query);
          setSuggestions(result || []);
          setOpen((result?.length ?? 0) > 0);
          setActiveIndex((result?.length ?? 0) > 0 ? 0 : -1);
        } catch {
          setSuggestions([]);
          setOpen(false);
          setActiveIndex(-1);
        }
      })();
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, fetchSuggestions, debounceMs]);

  const emitChange = (updated: string[]): void => {
    setInternalTags(updated);
    onChange?.(updated);
  };

  const addTag = (raw: string) => {
    const newTag = raw.trim();
    if (!newTag || hasTag(newTag)) return false;

    const updated = [...tagList, newTag];
    emitChange(updated);
    setLastAction(`Added tag ${newTag}.`);
    return true;
  };

  const removeTag = (tag: string) => {
    const updated = tagList.filter((t) => t !== tag);
    emitChange(updated);
    setLastAction(`Removed tag ${tag}.`);
  };

  const clearSuggestions = (): void => {
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (open && suggestions.length > 0) {
      if (key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((i) => (i + 1) % suggestions.length);
        return;
      }

      if (key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(
          (i) => (i - 1 + suggestions.length) % suggestions.length,
        );
        return;
      }

      if (key === "Enter") {
        event.preventDefault();
        const choice = suggestions[activeIndex];
        if (choice && addTag(choice)) {
          setInputValue("");
        }
        clearSuggestions();
        return;
      }

      if (key === "Escape") {
        event.preventDefault();
        clearSuggestions();
        return;
      }
    }

    if (key === "Enter" || key === ",") {
      event.preventDefault();
      if (addTag(inputValue)) setInputValue("");
      clearSuggestions();
      return;
    }

    if (key === "Backspace" && inputValue === "" && tagList.length > 0) {
      const last = tagList[tagList.length - 1];
      removeTag(last);
    }
  };

  const wrapperClass = useMemo(
    () =>
      combineClassNames(
        classMap.tagInput,
        classMap[theme],
        state && classMap[state],
        classMap[size],
        glass && classMap.glass,
      ),
    [classMap, theme, state, size, glass],
  );

  const tagClass = useMemo(
    () =>
      combineClassNames(
        classMap.tag,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
      ),
    [classMap, shadow, rounding],
  );

  const handleSuggestionClick = (suggestion: string): void => {
    if (addTag(suggestion)) setInputValue("");
    clearSuggestions();
  };

  const activeOptionId =
    open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined;

  const groupDescribedBy = [descId, statusId, ariaDescribedBy]
    .filter(Boolean)
    .join(" ");

  const inputDescribedBy = [descId, statusId, inputAriaDescribedBy]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={wrapperClass}
      role="group"
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy || labelId}
      aria-describedby={groupDescribedBy || undefined}
      data-testid={testId}
    >
      {!ariaLabelledBy && (
        <label id={labelId} className="sr_only">
          {ariaLabel}
        </label>
      )}

      <div
        id={descId}
        className="sr_only"
        data-testid={`${testId}-description`}
      >
        {ariaDescription}
      </div>

      <ul className={classMap.tagContainer} data-testid={`${testId}-list`}>
        {tagList.map((tag, index) => (
          <li
            key={`${tag}-${index}`}
            className={tagClass}
            data-testid={`${testId}-tag-${index}`}
          >
            <span className={classMap.tagLabel}>{tag}</span>
            <IconButton
              type="button"
              aria-label={`${removeTagButtonLabel} ${tag}`}
              className={classMap.removeButton}
              onClick={() => removeTag(tag)}
              data-testid={`${testId}-remove-${index}`}
              icon={CloseIcon}
              rounding="full"
              size="xs"
              state="error"
              glass={glass}
              shadow="none"
              iconClassName={classMap.removeButtonIcon}
              disabled={false}
            />
          </li>
        ))}
      </ul>

      <div className={classMap.inputWrapper}>
        <TextInput
          id={inputId}
          type="text"
          theme={theme}
          glass={glass}
          state={state}
          rounding={rounding}
          shadow={shadow}
          className={classMap.input}
          value={inputValue}
          placeholder={tagList.length === 0 ? placeholder : ""}
          onChange={(val: string) => setInputValue(val)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-label={inputAriaLabelledBy ? undefined : inputAriaLabel}
          aria-labelledby={inputAriaLabelledBy}
          aria-describedby={inputDescribedBy || undefined}
          data-testid={`${testId}-input`}
        />
      </div>

      {open && suggestions.length > 0 && (
        <div
          className={classMap.suggestionList}
          role="listbox"
          id={listboxId}
          aria-label={suggestionsAriaLabel}
          data-testid={`${testId}-suggestions`}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion}-${index}`}
              id={`${listboxId}-opt-${index}`}
              className={combineClassNames(
                classMap.suggestionItem,
                index === activeIndex && classMap.active,
              )}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSuggestionClick(suggestion)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSuggestionClick(suggestion);
                }
              }}
              tabIndex={-1}
              data-testid={`${testId}-suggestion-${index}`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      <div id={statusId} aria-live="polite" className="sr_only">
        {open && suggestions.length > 0
          ? `${suggestions.length} suggestion${suggestions.length === 1 ? "" : "s"} available.`
          : ""}
        {lastAction}
      </div>
    </div>
  );
};

TagInputBase.displayName = "TagInputBase";
export default TagInputBase;
