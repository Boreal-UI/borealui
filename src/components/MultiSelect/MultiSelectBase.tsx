import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, CloseIcon } from "../../Icons";
import { MultiSelectBaseProps, MultiSelectOption } from "./MultiSelect.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const getOptionText = (option: MultiSelectOption): string => {
  if (option.searchText) return option.searchText;
  return typeof option.label === "string" ? option.label : option.value;
};

const MultiSelectBase = forwardRef<HTMLDivElement, MultiSelectBaseProps>(
  (
    {
      options,
      value,
      defaultValue = [],
      onChange,
      label,
      labelPosition = "top",
      placeholder = "Select options",
      emptyMessage = "No options found",
      loadingMessage = "Loading options",
      searchable = true,
      searchPlaceholder = "Filter options",
      clearable = true,
      clearAriaLabel = "Clear selected options",
      toggleAriaLabel,
      maxSelected,
      name,
      required = false,
      theme = getDefaultTheme(),
      state,
      outline = getDefaultOutline(),
      glass = getDefaultGlass(),
      rounding = getDefaultRounding(),
      shadow = getDefaultShadow(),
      disabled = false,
      loading = false,
      classMap,
      className,
      containerClassName,
      labelClassName,
      triggerClassName,
      valueListClassName,
      chipClassName,
      popoverClassName,
      searchInputClassName,
      listboxClassName,
      optionClassName,
      srOnlyText,
      srOnlyClassName,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      "data-testid": dataTestId,
      testId = dataTestId ?? "multi-select",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selectedValues = isControlled ? value : internalValue;
    const selectedSet = useMemo(
      () => new Set(selectedValues),
      [selectedValues],
    );
    const optionByValue = useMemo(
      () => new Map(options.map((option) => [option.value, option])),
      [options],
    );
    const selectedOptions = useMemo(
      () =>
        selectedValues
          .map((selectedValue) => optionByValue.get(selectedValue))
          .filter((option): option is MultiSelectOption => Boolean(option)),
      [optionByValue, selectedValues],
    );

    const rootId = id ?? `${testId}-${generatedId}`;
    const labelId = label ? `${rootId}-label` : undefined;
    const listboxId = `${rootId}-listbox`;
    const srDescriptionId = srOnlyText ? `${rootId}-sr-description` : undefined;
    const computedAriaDescribedBy =
      [ariaDescribedBy, srDescriptionId].filter(Boolean).join(" ") || undefined;
    const computedAriaLabelledBy =
      [ariaLabelledBy, labelId].filter(Boolean).join(" ") || undefined;
    const computedAriaLabel = computedAriaLabelledBy
      ? undefined
      : toggleAriaLabel || ariaLabel || placeholder;
    const isInvalid = ariaInvalid ?? (state === "error" || undefined);
    const isRequired = ariaRequired ?? (required || undefined);

    const filteredOptions = useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) return options;
      return options.filter((option) =>
        getOptionText(option).toLowerCase().includes(normalizedQuery),
      );
    }, [options, query]);

    const selectableFilteredOptions = filteredOptions.filter(
      (option) => !option.disabled,
    );
    const activeOption = filteredOptions[activeIndex];
    const reachedMax =
      typeof maxSelected === "number" && selectedValues.length >= maxSelected;
    const summary =
      selectedOptions.length > 0
        ? selectedOptions.map(getOptionText).join(", ")
        : placeholder;

    useEffect(() => {
      setActiveIndex(0);
    }, [query, options]);

    useEffect(() => {
      if (!open) return;

      const handlePointerDown = (event: PointerEvent) => {
        if (
          event.target instanceof Node &&
          !rootRef.current?.contains(event.target)
        ) {
          setOpen(false);
        }
      };

      const handleFocusIn = (event: FocusEvent) => {
        if (
          event.target instanceof Node &&
          !rootRef.current?.contains(event.target)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("focusin", handleFocusIn);

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
        document.removeEventListener("focusin", handleFocusIn);
      };
    }, [open]);

    useEffect(() => {
      if (open && searchable) {
        window.requestAnimationFrame(() => searchRef.current?.focus());
      }
    }, [open, searchable]);

    const emitChange = (nextValues: string[]) => {
      if (!isControlled) setInternalValue(nextValues);
      onChange?.(
        nextValues,
        nextValues
          .map((nextValue) => optionByValue.get(nextValue))
          .filter((option): option is MultiSelectOption => Boolean(option)),
      );
    };

    const toggleOption = (option: MultiSelectOption) => {
      if (disabled || loading || option.disabled) return;

      const isSelected = selectedSet.has(option.value);
      if (!isSelected && reachedMax) return;

      const nextValues = isSelected
        ? selectedValues.filter(
            (selectedValue) => selectedValue !== option.value,
          )
        : [...selectedValues, option.value];

      emitChange(nextValues);
    };

    const clearValues = () => {
      if (disabled || loading || selectedValues.length === 0) return;
      emitChange([]);
      setQuery("");
    };

    const handleTriggerKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement>,
    ) => {
      if (disabled || loading) return;

      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(
          event.key === "ArrowUp" ? filteredOptions.length - 1 : 0,
        );
      }
    };

    const handleListKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>,
    ) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true);
        setActiveIndex((index) =>
          Math.min(index + 1, Math.max(filteredOptions.length - 1, 0)),
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      } else if (event.key === "Enter" && activeOption) {
        event.preventDefault();
        toggleOption(activeOption);
      }
    };

    const containerClass = useMemo(
      () =>
        combineClassNames(
          classMap.container,
          classMap[`label${capitalize(resolvedLabelPosition)}`],
          containerClassName,
        ),
      [classMap, resolvedLabelPosition, containerClassName],
    );

    const rootClass = useMemo(
      () =>
        combineClassNames(
          classMap.root,
          classMap[theme],
          state && classMap[state],
          outline && classMap.outline,
          glass && classMap.glass,
          disabled && classMap.disabled,
          loading && classMap.loading,
          open && classMap.open,
          shadow && classMap[`shadow${capitalize(shadow)}`],
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        theme,
        state,
        outline,
        glass,
        disabled,
        loading,
        open,
        shadow,
        rounding,
        className,
      ],
    );

    return (
      <div className={containerClass} data-testid={testId}>
        {label ? (
          <label
            id={labelId}
            className={combineClassNames(classMap.label, labelClassName)}
            data-testid={`${testId}-label`}
          >
            {label}
          </label>
        ) : null}

        <div
          ref={(node) => {
            rootRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          id={rootId}
          className={rootClass}
          aria-busy={loading || undefined}
          data-testid={`${testId}-root`}
          {...rest}
        >
          <button
            type="button"
            className={combineClassNames(classMap.trigger, triggerClassName)}
            aria-label={computedAriaLabel}
            aria-labelledby={computedAriaLabelledBy}
            aria-describedby={computedAriaDescribedBy}
            aria-controls={listboxId}
            aria-expanded={open}
            aria-haspopup="listbox"
            data-invalid={isInvalid || undefined}
            data-required={isRequired || undefined}
            disabled={disabled || loading}
            onClick={() => setOpen((isOpen) => !isOpen)}
            onKeyDown={handleTriggerKeyDown}
            data-testid={`${testId}-trigger`}
          >
            <span
              className={combineClassNames(
                classMap.valueList,
                valueListClassName,
              )}
              data-testid={`${testId}-values`}
            >
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className={combineClassNames(classMap.chip, chipClassName)}
                    data-testid={`${testId}-chip-${option.value}`}
                  >
                    <span className={classMap.chipLabel}>
                      {getOptionText(option)}
                    </span>
                  </span>
                ))
              ) : (
                <span className={classMap.placeholder}>{placeholder}</span>
              )}
            </span>
            <span className={classMap.summary} aria-hidden="true">
              {summary}
            </span>
            <ChevronDownIcon
              className={classMap.icon}
              aria-hidden="true"
              focusable={false}
            />
          </button>

          {clearable && selectedValues.length > 0 ? (
            <button
              type="button"
              className={classMap.clearButton}
              aria-label={clearAriaLabel}
              disabled={disabled || loading}
              onClick={clearValues}
              data-testid={`${testId}-clear`}
            >
              <CloseIcon aria-hidden="true" focusable={false} />
            </button>
          ) : null}

          {loading ? (
            <span
              className={classMap.loader}
              aria-hidden="true"
              data-testid={`${testId}-loader`}
            />
          ) : null}

          {open ? (
            <div
              className={combineClassNames(classMap.popover, popoverClassName)}
              data-testid={`${testId}-popover`}
            >
              {searchable ? (
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  onKeyDown={handleListKeyDown}
                  className={combineClassNames(
                    classMap.searchInput,
                    searchInputClassName,
                  )}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  data-testid={`${testId}-search`}
                />
              ) : null}

              {loading ? (
                <div
                  className={classMap.status}
                  role="status"
                  aria-live="polite"
                  data-testid={`${testId}-status`}
                >
                  {loadingMessage}
                </div>
              ) : filteredOptions.length === 0 ? (
                <div
                  className={classMap.status}
                  role="status"
                  aria-live="polite"
                  data-testid={`${testId}-empty`}
                >
                  {emptyMessage}
                </div>
              ) : (
                <div
                  id={listboxId}
                  role="listbox"
                  title="Options"
                  aria-multiselectable="true"
                  className={combineClassNames(
                    classMap.listbox,
                    listboxClassName,
                  )}
                  onKeyDown={handleListKeyDown}
                  tabIndex={-1}
                  data-testid={`${testId}-listbox`}
                >
                  {filteredOptions.map((option, index) => {
                    const selected = selectedSet.has(option.value);
                    const disabledOption =
                      option.disabled || (!selected && reachedMax);

                    return (
                      <button
                        key={option.value}
                        id={`${rootId}-option-${index}`}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        disabled={disabledOption}
                        className={combineClassNames(
                          classMap.option,
                          selected && classMap.selected,
                          index === activeIndex && classMap.active,
                          disabledOption && classMap.optionDisabled,
                          optionClassName,
                        )}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => toggleOption(option)}
                        data-testid={`${testId}-option-${option.value}`}
                      >
                        <span className={classMap.checkbox} aria-hidden="true">
                          {selected ? "✓" : ""}
                        </span>
                        <span className={classMap.optionText}>
                          <span>{option.label}</span>
                          {option.description ? (
                            <small className={classMap.description}>
                              {option.description}
                            </small>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : null}

          {name
            ? selectedValues.map((selectedValue) => (
                <input
                  key={selectedValue}
                  type="hidden"
                  name={name}
                  value={selectedValue}
                  data-testid={`${testId}-hidden-${selectedValue}`}
                />
              ))
            : null}

          {required && selectedValues.length === 0 ? (
            <input
              className={classMap.nativeRequired}
              tabIndex={-1}
              aria-hidden="true"
              required
              value=""
              onChange={() => undefined}
              data-testid={`${testId}-required-input`}
            />
          ) : null}

          {srOnlyText ? (
            <span
              id={srDescriptionId}
              className={combineClassNames(
                classMap.srOnly ?? "sr_only",
                srOnlyClassName,
              )}
              data-testid={`${testId}-sr-only-text`}
            >
              {srOnlyText}
            </span>
          ) : null}

          {selectableFilteredOptions.length === 0 ? null : (
            <span className={classMap.srOnly ?? "sr_only"} aria-live="polite">
              {selectedValues.length} selected
            </span>
          )}
        </div>
      </div>
    );
  },
);

MultiSelectBase.displayName = "MultiSelectBase";
export default MultiSelectBase;
