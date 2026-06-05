import {
  forwardRef,
  useId,
  useMemo,
  useState,
  InputHTMLAttributes,
} from "react";
import { CloseIcon, SearchIcon } from "../../Icons";
import { SearchInputBaseProps } from "./SearchInput.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const SearchInputBase = forwardRef<HTMLInputElement, SearchInputBaseProps>(
  (
    {
      icon: Icon,
      iconPosition = "left",
      value,
      defaultValue = "",
      onChange,
      onSearch,
      onClear,
      label,
      labelPosition = "top",
      placeholder = "Search",
      showClearButton = true,
      showSearchButton = false,
      clearAriaLabel = "Clear search",
      searchAriaLabel = "Search",
      loading = false,
      theme = getDefaultTheme(),
      state,
      outline = getDefaultOutline(),
      glass = getDefaultGlass(),
      rounding = getDefaultRounding(),
      shadow,
      disabled = false,
      readOnly = false,
      required = false,
      autocomplete = false,
      classMap,
      className,
      containerClassName,
      labelClassName,
      inputClassName,
      iconWrapperClassName,
      iconClassName,
      clearButtonClassName,
      searchButtonClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "search-input",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = isControlled ? value : internalValue;

    const {
      id: idProp,
      onKeyDown,
      role,
      autoComplete: autoCompleteProp,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      "aria-readonly": ariaReadOnly,
      "aria-disabled": ariaDisabled,
      "aria-description": ariaDescription,
      "aria-activedescendant": ariaActiveDescendant,
      "aria-haspopup": ariaHasPopup,
      "aria-expanded": ariaExpanded,
      "aria-controls": ariaControls,
      ...restInput
    } = rest as InputHTMLAttributes<HTMLInputElement> & {
      role?: React.AriaRole;
      "aria-label"?: string;
      "aria-labelledby"?: string;
      "aria-describedby"?: string;
      "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
      "aria-required"?: boolean;
      "aria-readonly"?: boolean;
      "aria-disabled"?: boolean;
      "aria-description"?: string;
      "aria-activedescendant"?: string;
      "aria-haspopup"?:
        | boolean
        | "false"
        | "true"
        | "menu"
        | "listbox"
        | "tree"
        | "grid"
        | "dialog";
      "aria-expanded"?: boolean;
      "aria-controls"?: string;
    };

    const inputId = idProp ?? `${testId}-input-${generatedId}`;
    const srDescriptionId = srOnlyText
      ? `${inputId}-sr-description`
      : undefined;
    const computedAriaDescribedBy =
      [ariaDescribedBy, srDescriptionId].filter(Boolean).join(" ") || undefined;
    const computedAriaLabel = label ? undefined : ariaLabel || placeholder;
    const computedAriaInvalid = ariaInvalid ?? (state === "error" || undefined);
    const computedAriaRequired = ariaRequired ?? (required || undefined);
    const computedAriaReadOnly = ariaReadOnly ?? (readOnly || undefined);
    const computedAriaDisabled = ariaDisabled ?? (disabled || undefined);
    const computedAutoComplete =
      autoCompleteProp ?? (autocomplete ? "on" : "off");
    const canInteract = !disabled && !readOnly;
    const hasValue = currentValue.length > 0;

    const setNextValue = (
      nextValue: string,
      event?: React.ChangeEvent<HTMLInputElement>,
    ) => {
      if (!isControlled) setInternalValue(nextValue);
      if (event) onChange?.(nextValue, event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNextValue(event.currentTarget.value, event);
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!canInteract) return;
      if (!isControlled) setInternalValue("");
      onClear?.(event);
    };

    const handleSearch = (
      event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.MouseEvent<HTMLButtonElement>,
    ) => {
      if (!canInteract) return;
      onSearch?.(currentValue, event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (!event.defaultPrevented && event.key === "Enter") {
        handleSearch(event);
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

    const wrapperClass = useMemo(
      () =>
        combineClassNames(
          classMap.searchInput,
          classMap[theme],
          state && classMap[state],
          outline && classMap.outline,
          glass && classMap.glass,
          disabled && classMap.disabled,
          loading && classMap.loading,
          Icon && iconPosition === "left" && classMap.iconLeft,
          Icon && iconPosition === "right" && classMap.iconRight,
          getShadowClassName(classMap, theme, shadow),
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
        Icon,
        iconPosition,
        shadow,
        rounding,
        className,
      ],
    );

    const iconElement = Icon ? (
      <span
        className={combineClassNames(classMap.icon, iconWrapperClassName)}
        aria-hidden="true"
        data-testid={`${testId}-icon`}
      >
        <Icon
          className={combineClassNames(classMap.searchGlyph, iconClassName)}
          aria-hidden={true}
          focusable={false}
        />
      </span>
    ) : null;

    return (
      <div className={containerClass} data-testid={testId}>
        {label ? (
          <label
            htmlFor={inputId}
            className={combineClassNames(classMap.label, labelClassName)}
            data-testid={`${testId}-label`}
          >
            {label}
          </label>
        ) : null}

        <div
          className={wrapperClass}
          aria-busy={loading || undefined}
          data-testid={`${testId}-wrapper`}
        >
          {iconPosition === "left" ? iconElement : null}
          <input
            ref={ref}
            id={inputId}
            type="search"
            className={combineClassNames(classMap.input, inputClassName)}
            value={currentValue}
            placeholder={label ? " " : placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            role={role}
            aria-label={computedAriaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={computedAriaDescribedBy}
            aria-invalid={computedAriaInvalid}
            aria-required={computedAriaRequired}
            aria-readonly={computedAriaReadOnly}
            aria-disabled={computedAriaDisabled}
            aria-description={ariaDescription}
            aria-activedescendant={ariaActiveDescendant}
            aria-haspopup={ariaHasPopup}
            aria-expanded={ariaExpanded}
            aria-controls={ariaControls}
            autoComplete={computedAutoComplete}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            data-testid={`${testId}-input`}
            {...restInput}
          />

          {loading ? (
            <span
              className={classMap.loader}
              aria-hidden="true"
              data-testid={`${testId}-loader`}
            />
          ) : null}

          {showClearButton && hasValue ? (
            <button
              type="button"
              className={combineClassNames(
                classMap.clearButton,
                clearButtonClassName,
              )}
              onClick={handleClear}
              disabled={!canInteract}
              aria-label={clearAriaLabel}
              data-testid={`${testId}-clear`}
            >
              <CloseIcon aria-hidden={true} />
            </button>
          ) : null}

          {showSearchButton ? (
            <button
              type="button"
              className={combineClassNames(
                classMap.searchButton,
                searchButtonClassName,
              )}
              onClick={handleSearch}
              disabled={!canInteract}
              aria-label={searchAriaLabel}
              data-testid={`${testId}-submit`}
            >
              <SearchIcon aria-hidden={true} />
            </button>
          ) : null}

          {iconPosition === "right" ? iconElement : null}

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
        </div>
      </div>
    );
  },
);

SearchInputBase.displayName = "SearchInputBase";
export default SearchInputBase;
