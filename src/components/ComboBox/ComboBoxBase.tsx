import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { ComboBoxBaseProps, ComboBoxOption } from "./ComboBox.types";

export default function ComboBoxBase({
  options,
  value,
  inputValue,
  onChange,
  onInputChange,
  label,
  labelPosition = "top",
  placeholder = "Search options",
  emptyMessage = "No options found",
  loading = false,
  loadingMessage = "Loading options",
  disabled = false,
  required = false,
  name,
  id,
  theme = getDefaultTheme(),
  state,
  outline = getDefaultOutline(),
  glass = getDefaultGlass(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  className,
  layoutClassName,
  labelClassName,
  inputClassName,
  listboxClassName,
  optionClassName,
  helperText,
  error,
  helperTextClassName,
  errorClassName,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  testId,
  "data-testid": dataTestId,
  classMap,
}: ComboBoxBaseProps) {
  const generatedId = useId();
  const resolvedId = id ?? `${generatedId}-combobox`;
  const resolvedTestId = testId ?? dataTestId ?? "combobox";
  const listboxId = `${resolvedId}-listbox`;
  const helperId = helperText ? `${resolvedId}-helper` : undefined;
  const errorId = error ? `${resolvedId}-error` : undefined;
  const [open, setOpen] = useState(false);
  const [internalInput, setInternalInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const textValue = inputValue ?? internalInput;

  useEffect(() => {
    if (inputValue !== undefined) return;
    setInternalInput(selectedOption?.label ?? "");
  }, [inputValue, selectedOption]);

  const filteredOptions = useMemo(() => {
    const query = textValue.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, textValue]);

  const activeOption = filteredOptions[activeIndex];
  const describedBy = [ariaDescribedBy, helperId, errorId]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (!open) return;

    const isOutsideComboBox = (target: EventTarget | null) => {
      return target instanceof Node && !rootRef.current?.contains(target);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (isOutsideComboBox(event.target)) {
        setOpen(false);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (isOutsideComboBox(event.target)) {
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

  const rootClassName = useMemo(
    () =>
      combineClassNames(
        classMap.comboBox,
        classMap[theme],
        state && classMap[state],
        outline && classMap.outline,
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        disabled && classMap.disabled,
        className,
      ),
    [
      classMap,
      theme,
      state,
      outline,
      glass,
      shadow,
      rounding,
      disabled,
      className,
    ],
  );

  const setInput = (nextValue: string) => {
    if (inputValue === undefined) setInternalInput(nextValue);
    onInputChange?.(nextValue);
  };

  const selectOption = (option: ComboBoxOption) => {
    if (option.disabled) return;
    setInput(option.label);
    setOpen(false);
    onChange?.(option.value, option);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    setOpen(true);
    setActiveIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        Math.min(index + 1, Math.max(filteredOptions.length - 1, 0)),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && activeOption) {
      event.preventDefault();
      selectOption(activeOption);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={combineClassNames(
        classMap.layout,
        classMap[`label${capitalize(labelPosition)}`],
        layoutClassName,
      )}
      data-testid={resolvedTestId}
    >
      {label ? (
        <label
          htmlFor={resolvedId}
          className={combineClassNames(classMap.label, labelClassName)}
        >
          {label}
        </label>
      ) : null}
      <div className={rootClassName}>
        <input
          ref={inputRef}
          id={resolvedId}
          name={name}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && activeOption
              ? `${resolvedId}-option-${activeIndex}`
              : undefined
          }
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error) || state === "error" || undefined}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={textValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={combineClassNames(classMap.input, inputClassName)}
          data-testid={`${resolvedTestId}-input`}
        />
        <button
          type="button"
          className={classMap.toggle}
          aria-label={open ? "Close options" : "Open options"}
          aria-controls={listboxId}
          aria-expanded={open}
          disabled={disabled}
          onClick={() => {
            setOpen((isOpen) => !isOpen);
            inputRef.current?.focus();
          }}
          data-testid={`${resolvedTestId}-toggle`}
        >
          ▾
        </button>
        {open ? (
          <>
            {loading ? (
              <div
                className={classMap.status}
                role="status"
                aria-live="polite"
                data-testid={`${resolvedTestId}-status`}
              >
                {loadingMessage}
              </div>
            ) : filteredOptions.length === 0 ? (
              <div
                className={classMap.status}
                role="status"
                aria-live="polite"
                data-testid={`${resolvedTestId}-empty`}
              >
                {emptyMessage}
              </div>
            ) : (
              <div
                id={listboxId}
                role="listbox"
                className={combineClassNames(
                  classMap.listbox,
                  listboxClassName,
                )}
                data-testid={`${resolvedTestId}-listbox`}
              >
                {filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    id={`${resolvedId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    disabled={option.disabled}
                    className={combineClassNames(
                      classMap.option,
                      index === activeIndex && classMap.active,
                      option.value === value && classMap.selected,
                      option.disabled && classMap.disabled,
                      optionClassName,
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                    data-testid={`${resolvedTestId}-option-${option.value}`}
                  >
                    <span>{option.label}</span>
                    {option.description ? (
                      <small className={classMap.description}>
                        {option.description}
                      </small>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
      {helperText ? (
        <div
          id={helperId}
          className={combineClassNames(
            classMap.helperText,
            helperTextClassName,
          )}
        >
          {helperText}
        </div>
      ) : null}
      {error ? (
        <div
          id={errorId}
          className={combineClassNames(classMap.errorText, errorClassName)}
          role="alert"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
