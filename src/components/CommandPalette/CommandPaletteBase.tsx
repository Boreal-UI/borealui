import React, {
  useEffect,
  useId,
  useRef,
  useState,
  useCallback,
  useMemo,
  KeyboardEvent,
} from "react";
import ReactDOM from "react-dom";
import { combineClassNames } from "../../utils/classNames";
import type {
  CommandPaletteBaseProps,
  CommandItem,
} from "./CommandPalette.types";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { useModalLayer } from "../../hooks/useModalLayer";
import { usePortalHost } from "../../hooks/usePortalHost";
import { getFocusableElements } from "../../utils/modalLayerManager";
import { composeEventHandlers } from "../../utils/eventHandlers";

const CommandPaletteBase: React.FC<CommandPaletteBaseProps> = ({
  commands,
  placeholder = "Search...",
  open,
  onClose,
  asyncSearch,
  debounceMs = 300,
  theme = getDefaultTheme(),
  rounding = getDefaultRounding(),
  shadow,
  state,
  variant = getDefaultVariant(),
  classMap,
  TextInputComponent,
  inputAriaLabel,
  inputAriaLabelledBy,
  inputAriaDescribedBy,
  inputLabel,
  inputId,
  listboxId,
  paletteId,
  listAriaLabel = "Command suggestions",
  emptyMessage = "No matching results",
  resultsAnnouncement = "results available",
  modal = true,
  trapFocus = false,
  restoreFocusOnClose = true,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-controls": ariaControls,
  "aria-expanded": ariaExpanded,
  "aria-activedescendant": ariaActiveDescendant,
  "data-testid": dataTestId,
  testId = dataTestId ?? "command-palette",
  className,
  onKeyDown,
  ...rest
}) => {
  const reactId = useId();
  const resolvedPaletteId = paletteId ?? `${testId}-${reactId}-dialog`;
  const resolvedInputId = inputId ?? `${testId}-${reactId}-input`;
  const resolvedListboxId = listboxId ?? `${testId}-${reactId}-listbox`;
  const resolvedLabelId = `${resolvedInputId}-label`;
  const resolvedStatusId = `${resolvedPaletteId}-status`;

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const portalElement = usePortalHost("widget-portal", open);
  const [asyncResults, setAsyncResults] = useState<CommandItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRequestRef = useRef(0);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    if (asyncSearch) return asyncResults;

    const q = query.toLowerCase();
    if (!q) return commands;

    return commands.filter((cmd) => {
      const labelMatch = cmd.label.toLowerCase().includes(q);
      const keywordMatch = cmd.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(q),
      );

      return labelMatch || Boolean(keywordMatch);
    });
  }, [asyncResults, asyncSearch, commands, query]);

  useEffect(() => {
    if (filtered.length === 0) {
      setActiveIndex(-1);
    } else if (
      activeIndex < 0 ||
      activeIndex >= filtered.length ||
      filtered[activeIndex]?.disabled
    ) {
      const firstEnabledIndex = filtered.findIndex((item) => !item.disabled);
      setActiveIndex(firstEnabledIndex);
    }
  }, [filtered, activeIndex]);

  useEffect(() => {
    if (!asyncSearch) return;

    const requestId = ++searchRequestRef.current;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();
    if (!q) {
      setAsyncResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(() => {
      asyncSearch(q)
        .then((results) => {
          if (searchRequestRef.current !== requestId) return;
          setAsyncResults(results);
          setIsLoading(false);
        })
        .catch(() => {
          if (searchRequestRef.current !== requestId) return;
          setAsyncResults([]);
          setIsLoading(false);
        });
    }, debounceMs);

    return () => {
      searchRequestRef.current += 1;
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, asyncSearch, debounceMs]);

  useEffect(() => {
    if (!open) return;

    setMounted(true);
    prevFocusRef.current = document.activeElement as HTMLElement | null;

    return () => {
      setQuery("");
      setActiveIndex(-1);
      setMounted(false);

      if (!modal && restoreFocusOnClose) {
        prevFocusRef.current?.focus?.();
      }
    };
  }, [open, restoreFocusOnClose, modal]);

  useModalLayer({
    active: open && mounted && portalElement !== null && modal,
    layerRef: overlayRef,
    focusScopeRef: containerRef,
    onEscape: onClose,
    restoreFocus: restoreFocusOnClose,
  });

  useEffect(() => {
    if (open && mounted && portalElement && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open, mounted, portalElement]);

  const getItemId = useCallback(
    (cmd: CommandItem, index: number) =>
      cmd.id
        ? `${resolvedListboxId}-option-${cmd.id}`
        : `${resolvedListboxId}-option-${index}`,
    [resolvedListboxId],
  );

  const getNextEnabledIndex = useCallback(
    (startIndex: number, direction: 1 | -1) => {
      if (filtered.length === 0) return -1;

      let nextIndex = startIndex;

      for (let i = 0; i < filtered.length; i += 1) {
        nextIndex = (nextIndex + direction + filtered.length) % filtered.length;
        if (!filtered[nextIndex]?.disabled) {
          return nextIndex;
        }
      }

      return -1;
    },
    [filtered],
  );

  const activateCommand = useCallback(
    (cmd: CommandItem | undefined) => {
      if (!cmd || cmd.disabled) return;
      cmd.action();
      onClose();
    },
    [onClose],
  );

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "ArrowDown") {
        if (filtered.length === 0) return true;
        e.preventDefault();
        setActiveIndex((prev) => getNextEnabledIndex(prev < 0 ? -1 : prev, 1));
      } else if (e.key === "ArrowUp") {
        if (filtered.length === 0) return true;
        e.preventDefault();
        setActiveIndex((prev) => getNextEnabledIndex(prev < 0 ? 0 : prev, -1));
      } else if (e.key === "Enter") {
        if (activeIndex >= 0) {
          e.preventDefault();
          activateCommand(filtered[activeIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      } else if (e.key === "Home") {
        e.preventDefault();
        const firstEnabledIndex = filtered.findIndex((item) => !item.disabled);
        setActiveIndex(firstEnabledIndex);
      } else if (e.key === "End") {
        e.preventDefault();
        const reversedIndex = [...filtered]
          .reverse()
          .findIndex((item) => !item.disabled);

        if (reversedIndex >= 0) {
          setActiveIndex(filtered.length - 1 - reversedIndex);
        }
      } else return false;

      return true;
    },
    [filtered, activeIndex, getNextEnabledIndex, activateCommand, onClose],
  );

  const handleContainerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!modal && e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (!modal && trapFocus && e.key === "Tab") {
        const container = containerRef.current;
        if (!container) return;

        const focusable = getFocusableElements(container);

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    },
    [modal, onClose, trapFocus],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const target = event.target;

      if (target === inputRef.current && handleInputKeyDown(event)) return;

      if (target instanceof Element) {
        const option = target.closest<HTMLElement>(
          "[data-command-palette-option-index]",
        );

        if (
          option &&
          containerRef.current?.contains(option) &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          const optionIndex = Number(
            option.dataset.commandPaletteOptionIndex,
          );
          activateCommand(filtered[optionIndex]);
          return;
        }
      }

      handleContainerKeyDown(event);
    },
    [activateCommand, filtered, handleContainerKeyDown, handleInputKeyDown],
  );

  if (!open || !mounted || !portalElement) return null;

  const activeItem =
    activeIndex >= 0 && filtered[activeIndex]
      ? filtered[activeIndex]
      : undefined;

  const computedActiveDescendant =
    ariaActiveDescendant ??
    (activeItem ? getItemId(activeItem, activeIndex) : undefined);

  const computedAriaExpanded =
    typeof ariaExpanded === "boolean" ? ariaExpanded : open;

  const dialogRole = modal ? "dialog" : "region";

  const liveMessage = isLoading
    ? "Searching commands"
    : filtered.length === 0
      ? emptyMessage
      : `${filtered.length} ${resultsAnnouncement}`;

  return ReactDOM.createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={overlayRef}
      className={classMap.overlay}
      onMouseDown={onClose}
      data-testid={`${testId}-overlay`}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        {...rest}
        id={resolvedPaletteId}
        ref={containerRef}
        className={combineClassNames(
          classMap.command_palette,
          classMap[theme],
          state && classMap[state],
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          className,
        )}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
        role={dialogRole}
        aria-modal={modal ? true : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-controls={ariaControls}
        data-testid={testId}
      >
        {inputLabel && (
          <label
            id={resolvedLabelId}
            htmlFor={resolvedInputId}
            className={classMap.label}
            data-testid={`${testId}-input-label`}
          >
            {inputLabel}
          </label>
        )}

        <TextInputComponent
          ref={inputRef}
          id={resolvedInputId}
          type="text"
          value={query}
          onChange={(
            valueOrEvent: string | React.ChangeEvent<HTMLInputElement>,
            event?: React.ChangeEvent<HTMLInputElement>,
          ) => {
            if (typeof valueOrEvent === "string") {
              setQuery(valueOrEvent);
              return;
            }

            setQuery(valueOrEvent.target.value ?? event?.target.value ?? "");
          }}
          placeholder={placeholder}
          theme={theme}
          state={state}
          variant={variant}
          shadow={"none"}
          rounding={rounding}
          className={classMap.input}
          data-testid={`${testId}-input`}
          role="combobox"
          aria-label={inputAriaLabel}
          aria-labelledby={
            inputAriaLabelledBy ??
            (!inputAriaLabel && inputLabel ? resolvedLabelId : undefined)
          }
          aria-describedby={inputAriaDescribedBy}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={computedAriaExpanded}
          aria-controls={resolvedListboxId}
          aria-activedescendant={computedActiveDescendant}
        />

        <div
          id={resolvedStatusId}
          className="sr_only"
          aria-live="polite"
          aria-atomic="true"
          data-testid={`${testId}-live-region`}
        >
          {liveMessage}
        </div>

        <div
          id={resolvedListboxId}
          className={classMap.list}
          role="listbox"
          aria-label={!ariaLabelledBy ? listAriaLabel : undefined}
          aria-labelledby={ariaLabelledBy}
          aria-busy={isLoading || undefined}
          data-testid={`${testId}-listbox`}
        >
          {isLoading ? (
            <div
              className={combineClassNames(classMap.item, classMap.empty)}
              role="option"
              aria-disabled="true"
              aria-selected="false"
              data-testid={`${testId}-loading`}
            >
              Searching…
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((cmd, index) => {
              const isActive = index === activeIndex;
              const isDisabled = Boolean(cmd.disabled);
              const itemId = getItemId(cmd, index);
              const descriptionId = cmd["aria-description"]
                ? `${itemId}-description`
                : undefined;

              return (
                // Keyboard activation is delegated to the composed palette handler.
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  key={cmd.id ?? `${cmd.label}-${index}`}
                  id={itemId}
                  role="option"
                  aria-label={cmd["aria-label"]}
                  aria-describedby={descriptionId}
                  aria-disabled={isDisabled || undefined}
                  aria-selected={isActive}
                  className={combineClassNames(
                    classMap.item,
                    classMap[theme],
                    isActive && classMap.active,
                    isDisabled && classMap.disabled,
                  )}
                  onClick={() => activateCommand(cmd)}
                  onMouseEnter={() => {
                    if (!isDisabled) setActiveIndex(index);
                  }}
                  tabIndex={-1}
                  data-command-palette-option-index={index}
                  data-testid={`${testId}-option-${index}`}
                >
                  {cmd.icon && (
                    <span className={classMap.icon} aria-hidden="true">
                      {cmd.icon}
                    </span>
                  )}

                  <span
                    className={classMap.itemLabel}
                    data-testid={`${testId}-option-label-${index}`}
                  >
                    {cmd.label}
                  </span>

                  {cmd["aria-description"] && (
                    <span
                      id={descriptionId}
                      className="sr_only"
                      data-testid={`${testId}-option-description-${index}`}
                    >
                      {cmd["aria-description"]}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div
              role="option"
              aria-selected="false"
              aria-disabled="true"
              className={combineClassNames(classMap.item, classMap.empty)}
              data-testid={`${testId}-empty`}
            >
              {emptyMessage}
            </div>
          )}
        </div>
      </div>
    </div>,
    portalElement,
  );
};

CommandPaletteBase.displayName = "CommandPaletteBase";

export default CommandPaletteBase;
