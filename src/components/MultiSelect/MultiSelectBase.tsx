import { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, CloseIcon } from "../../Icons";
import { useFormReset } from "../../hooks/useFormReset";
import { MultiSelectBaseProps, MultiSelectOption } from "./MultiSelect.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { composeEventHandlers } from "../../utils/eventHandlers";
import { resolvePropAlias } from "../../utils/propAliases";
import { scrollActiveOptionIntoView } from "../../utils/scrollActiveOptionIntoView";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultSize,
  getShadowClassName,
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
      form,
      required = false,
      theme = getDefaultTheme(),
      state,
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      size = getDefaultSize(),
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
      onKeyDown,
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
    const [activeValue, setActiveValue] = useState<string | undefined>(undefined);
    const rootRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    useFormReset(triggerRef, () => {
      if (!isControlled) setInternalValue(defaultValue);
      setOpen(false);
      setQuery("");
      setActiveValue(undefined);
    });
    const popupOpen = open && !disabled && !loading;

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
    const valueListId = `${rootId}-displayed-value`;
    const srDescriptionId = srOnlyText ? `${rootId}-sr-description` : undefined;
    const computedAriaDescribedBy =
      [ariaDescribedBy, srDescriptionId].filter(Boolean).join(" ") || undefined;
    const computedAriaLabelledBy = ariaLabelledBy ||
      (!toggleAriaLabel && !ariaLabel ? labelId : undefined);
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
    const reachedMax =
      typeof maxSelected === "number" && selectedValues.length >= maxSelected;
    const enabledIndices = filteredOptions.flatMap((option, index) =>
      option.disabled || (reachedMax && !selectedSet.has(option.value)) ? [] : [index],
    );
    const activeIndex = filteredOptions.findIndex(option => option.value === activeValue);
    const resolvedActiveIndex = enabledIndices.includes(activeIndex)
      ? activeIndex : enabledIndices[0] ?? -1;
    const activeOption = filteredOptions[resolvedActiveIndex];
    const resolvedActiveValue = activeOption?.value;
    // Retain identity when controlled parents recreate or reorder the options.
    const setActiveIndex = (index: number) => {
      setActiveValue(filteredOptions[index]?.value);
      scrollActiveOptionIntoView(document.getElementById(`${rootId}-option-${index}`));
    };
    const activeOptionId = popupOpen && activeOption
      ? `${rootId}-option-${resolvedActiveIndex}` : undefined;
    const summary =
      selectedOptions.length > 0
        ? selectedOptions.map(getOptionText).join(", ")
        : placeholder;
    const hasCustomTriggerName = Boolean(toggleAriaLabel || ariaLabel || ariaLabelledBy);
    const triggerLabelledBy = searchable && !hasCustomTriggerName
      ? [computedAriaLabelledBy, valueListId].filter(Boolean).join(" ")
      : computedAriaLabelledBy;

    useEffect(() => {
      if (activeOptionId) scrollActiveOptionIntoView(document.getElementById(activeOptionId));
    }, [activeOptionId]);

    useEffect(() => {
      setActiveValue(resolvedActiveValue);
    }, [resolvedActiveValue]);

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
      if (!popupOpen || !searchable) return;
      const frame = window.requestAnimationFrame(() => searchRef.current?.focus());
      return () => window.cancelAnimationFrame(frame);
    }, [popupOpen, searchable]);

    useEffect(() => {
      if (disabled || loading) setOpen(false);
    }, [disabled, loading]);

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
      setActiveValue(undefined);
    };

    const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      if (disabled || loading) return;
      if (popupOpen) {
        handleListKeyDown(event);
        return;
      }

      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(
          (event.key === "ArrowUp" ? enabledIndices.at(-1) : enabledIndices[0]) ?? -1,
        );
      }
    };

    const handleListKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      if (disabled || loading) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
        const position = enabledIndices.indexOf(resolvedActiveIndex);
        const next = Math.max(0, Math.min(enabledIndices.length - 1,
          position + (event.key === "ArrowDown" ? 1 : -1)));
        setActiveIndex(enabledIndices[next] ?? -1);
      } else if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        setActiveIndex((event.key === "Home" ? enabledIndices[0] : enabledIndices.at(-1)) ?? -1);
      } else if (event.key === "Enter" || (event.key === " " && event.target !== searchRef.current)) {
        event.preventDefault();
        if (activeOption) toggleOption(activeOption);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.dataset.multiSelectTrigger === "true") {
        handleTriggerKeyDown(event);
        return;
      }

      if (
        target === searchRef.current ||
        target.closest('[role="listbox"]')
      ) {
        handleListKeyDown(event);
      }
    };

    const rootEventHandlers = {
      onKeyDown: composeEventHandlers(onKeyDown, handleKeyDown),
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
          classMap[size],
          classMap[theme],
          state && classMap[state],
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          disabled && classMap.disabled,
          loading && classMap.loading,
          open && classMap.open,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        size,
        theme,
        state,
        variant,
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
          {...rest}
          {...rootEventHandlers}
          ref={(node) => {
            rootRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          id={rootId}
          className={rootClass}
          aria-busy={loading || undefined}
          data-testid={`${testId}-root`}
        >
          <button
            ref={triggerRef}
            form={form}
            type="button"
            role={searchable ? undefined : "combobox"}
            className={combineClassNames(classMap.trigger, triggerClassName)}
            aria-label={triggerLabelledBy ? undefined : computedAriaLabel}
            aria-labelledby={triggerLabelledBy}
            aria-describedby={computedAriaDescribedBy}
            aria-controls={popupOpen ? listboxId : undefined}
            aria-expanded={popupOpen}
            aria-activedescendant={!searchable ? activeOptionId : undefined}
            aria-haspopup="listbox"
            data-invalid={isInvalid || undefined}
            data-required={isRequired || undefined}
            disabled={disabled || loading}
            onClick={() => setOpen((isOpen) => !isOpen)}
            data-multi-select-trigger="true"
            data-testid={`${testId}-trigger`}
          >
            <span
              id={valueListId}
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
            <>
              <span
                className={classMap.loader}
                aria-hidden="true"
                data-testid={`${testId}-loader`}
              />
              <span role="status" className="sr_only">{loadingMessage}</span>
            </>
          ) : null}

          {popupOpen ? (
            <div
              className={combineClassNames(classMap.popover, popoverClassName)}
              data-testid={`${testId}-popover`}
            >
              {searchable ? (
                <input
                  ref={searchRef}
                  type="text"
                  role="combobox"
                  aria-expanded={popupOpen}
                  aria-controls={listboxId}
                  aria-activedescendant={activeOptionId}
                  aria-autocomplete="list"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.currentTarget.value);
                    setActiveValue(undefined);
                  }}
                  className={combineClassNames(
                    classMap.searchInput,
                    searchInputClassName,
                  )}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  data-testid={`${testId}-search`}
                />
              ) : null}

              {filteredOptions.length === 0 ? (
                <>
                  <div
                    className={classMap.status}
                    role="status"
                    aria-live="polite"
                    data-testid={`${testId}-empty`}
                  >
                    {emptyMessage}
                  </div>
                  <div id={listboxId} role="listbox" aria-label="Options" aria-multiselectable="true" />
                </>
              ) : (
                <div
                  id={listboxId}
                  role="listbox"
                  aria-label={typeof label === "string" ? label : computedAriaLabel ?? "Options"}
                  title="Options"
                  aria-multiselectable="true"
                  className={combineClassNames(
                    classMap.listbox,
                    listboxClassName,
                  )}
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
                        tabIndex={-1}
                        aria-selected={selected}
                        disabled={disabledOption}
                        className={combineClassNames(
                          classMap.option,
                          selected && classMap.selected,
                          index === resolvedActiveIndex && classMap.active,
                          disabledOption && classMap.optionDisabled,
                          optionClassName,
                        )}
                        onMouseEnter={() => { if (!disabledOption) setActiveIndex(index); }}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => toggleOption(option)}
                        data-testid={`${testId}-option-${option.value}`}
                      >
                        <span className={classMap.checkbox} aria-hidden="true">
                          {selected ? "✓" : ""}
                        </span>
                        <span className={classMap.optionText}>
                          <span className={classMap.optionLabel}>
                            {option.label}
                          </span>
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
                  form={form}
                  disabled={disabled}
                  name={name}
                  value={selectedValue}
                  data-testid={`${testId}-hidden-${selectedValue}`}
                />
              ))
            : null}

          {required && selectedValues.length === 0 ? (
            <input
              className={classMap.nativeRequired}
              form={form}
              tabIndex={-1}
              aria-hidden="true"
              required
              disabled={disabled}
              value=""
              onChange={() => undefined}
              data-testid={`${testId}-required-input`}
            />
          ) : null}

          {srOnlyText ? (
            <span
              id={srDescriptionId}
              className={combineClassNames(
                "sr_only",
                srOnlyClassName,
              )}
              data-testid={`${testId}-sr-only-text`}
            >
              {srOnlyText}
            </span>
          ) : null}

          {selectableFilteredOptions.length === 0 ? null : (
            <span className="sr_only" aria-live="polite">
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
