import {
  forwardRef,
  ChangeEvent,
  MouseEvent,
  useId,
  useMemo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ChevronDownIcon } from "../../Icons";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import { resolveFieldPresentation } from "../../utils/fieldPresentation";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultSize,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { BaseSelectProps } from "./Select.types";

const haveSameOptions = (
  current: BaseSelectProps["options"],
  next: BaseSelectProps["options"],
) =>
  current.length === next.length &&
  current.every(
    (option, index) =>
      option.value === next[index]?.value &&
      option.label === next[index]?.label &&
      option.disabled === next[index]?.disabled,
  );

const BaseSelect = forwardRef<HTMLSelectElement, BaseSelectProps>(
  (
    {
      theme = getDefaultTheme(),
      variant = getDefaultVariant(),
      state,
      rounding = getDefaultRounding(),
      shadow,
      size = getDefaultSize(),
      options,
      value,
      defaultValue,
      onChange,
      placeholder = "Select an option",
      disabled = false,
      className,
      layoutClassName,
      labelClassName,
      selectClassName,
      iconClassName,
      loadingClassName,
      srOnlyClassName,
      classMap,
      asyncOptions,
      pollInterval = 0,
      required,
      name,
      label,
      helperText,
      errorMessage,
      invalid,
      fullWidth = false,
      rootClassName,
      controlClassName,
      descriptionClassName,
      errorClassName,
      helperTextClassName,
      errorMessageClassName,
      errorLive = "off",
      labelPosition = "top",
      id,
      form,
      autoComplete,
      role,
      tabIndex,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-description": ariaDescription,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-required": ariaRequired,
      "aria-busy": ariaBusy,
      "aria-live": ariaLive = "polite",
      "data-testid": dataTestId,
      testId = dataTestId ?? "select",
      ...nativeProps
    },
    ref,
  ) => {
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const generatedId = useId();
    const selectId = id || `${generatedId}-select`;
    const internalDescriptionId = ariaDescription
      ? `${generatedId}-desc`
      : undefined;

    const [internalOptions, setInternalOptions] = useState(options);
    const [loading, setLoading] = useState(false);
    const selectRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement);

    const hasLabel = Boolean(label);

    const layoutClasses = useMemo(() => {
      const posClass = hasLabel
        ? classMap[`label${capitalize(resolvedLabelPosition)}`]
        : undefined;

      return combineClassNames(classMap.layout, posClass, fullWidth && classMap.fullWidth, layoutClassName, rootClassName);
    }, [classMap, hasLabel, resolvedLabelPosition, layoutClassName, rootClassName, fullWidth]);

    const labelClasses = useMemo(
      () =>
        combineClassNames(
          classMap.label,
          classMap.labelOverlay,
          labelClassName,
        ),
      [classMap, labelClassName],
    );

    const presentation = resolveFieldPresentation({
      id: selectId, helperText, errorMessage, invalid, state, ariaInvalid,
      describedBy: [ariaDescribedBy, internalDescriptionId],
    });

    const computedAriaLabel = ariaLabelledBy
      ? undefined
      : ariaLabel || (hasLabel ? undefined : placeholder ?? undefined);

    const labelNode = hasLabel ? (
      <label
        htmlFor={selectId}
        className={labelClasses}
        data-testid={`${testId}-label`}
      >
        {label}
      </label>
    ) : null;

    useEffect(() => {
      if (!asyncOptions) return;

      let isMounted = true;
      let pollTimer: ReturnType<typeof setTimeout> | undefined;
      let isInitialLoad = true;

      const load = async () => {
        try {
          if (isInitialLoad) setLoading(true);
          const fetched = await asyncOptions("");
          if (isMounted) {
            setInternalOptions((current) =>
              haveSameOptions(current, fetched) ? current : fetched,
            );
          }
        } catch (err) {
          console.error("Failed to load options:", err);
        } finally {
          if (isMounted) {
            if (isInitialLoad) setLoading(false);
            isInitialLoad = false;
            if (pollInterval > 0) {
              pollTimer = setTimeout(() => void load(), pollInterval);
            }
          }
        }
      };

      void load();

      return () => {
        isMounted = false;
        if (pollTimer !== undefined) clearTimeout(pollTimer);
      };
    }, [asyncOptions, pollInterval]);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      onChange?.(event.target.value);
    };

    const handleWrapperMouseDown = (event: MouseEvent<HTMLDivElement>) => {
      if (disabled || event.target === selectRef.current) return;

      selectRef.current?.focus();
      selectRef.current?.click();
    };

    const wrapperClasses = useMemo(
      () =>
        combineClassNames(
          classMap.wrapper,
          classMap[size],
          classMap[theme],
          presentation.state && classMap[presentation.state],
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          className,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          disabled && classMap.disabled,
        ),
      [
        classMap,
        size,
        theme,
        presentation.state,
        variant,
        className,
        shadow,
        rounding,
        disabled,
      ],
    );

    const selectClasses = useMemo(
      () =>
        combineClassNames(
          classMap.select,
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          selectClassName,
          controlClassName,
        ),
      [classMap, variant, selectClassName, controlClassName],
    );

    const iconClasses = useMemo(
      () =>
        combineClassNames(
          classMap.icon,
          classMap[theme],
          disabled && classMap.disabled,
          iconClassName,
        ),
      [classMap, theme, disabled, iconClassName],
    );

    const opts = asyncOptions ? internalOptions : options;
    // A real empty option owns the empty value. Never render two empty options.
    const showPlaceholder =
      placeholder !== null && !opts.some((option) => option.value === "");

    useEffect(() => {
      if (value === undefined || !selectRef.current) return;
      // Native reset (including React action resets) restores defaultSelected.
      // Keep that baseline aligned with the controlled value without cancelling reset
      // or emitting a synthetic change. Uncontrolled defaults remain browser-owned.
      const select = selectRef.current;
      const nativeOptions = Array.from(select.options);
      const valueIndex = nativeOptions.findIndex((option) => option.value === value);
      // Derive from props: an action may have reset the DOM before effects flush.
      const selectedIndex = valueIndex >= 0
        ? valueIndex
        : nativeOptions.findIndex((option) => !option.disabled);
      nativeOptions.forEach((option, index) => {
        option.defaultSelected = index === selectedIndex;
      });
    }, [value, opts, showPlaceholder]);

    return (
      <div className={layoutClasses} data-testid={`${testId}-layout`}>
        {(resolvedLabelPosition === "top" ||
          resolvedLabelPosition === "left") &&
          labelNode}

        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          className={wrapperClasses}
          data-testid={testId}
          onMouseDown={handleWrapperMouseDown}
        >
          <select
            {...nativeProps}
            ref={selectRef}
            id={selectId}
            name={name}
            form={form}
            autoComplete={autoComplete}
            role={role}
            tabIndex={tabIndex}
            value={value}
            defaultValue={
              value === undefined
                ? defaultValue ?? (showPlaceholder ? "" : undefined)
                : undefined
            }
            onChange={handleChange}
            className={selectClasses}
            aria-label={computedAriaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-description={ariaDescription}
            aria-describedby={presentation.describedBy}
            aria-disabled={disabled || undefined}
            aria-invalid={presentation.ariaInvalid}
            aria-required={ariaRequired ?? (required || undefined)}
            aria-busy={ariaBusy ?? (loading || undefined)}
            disabled={disabled}
            required={required}
            data-testid={`${testId}-input`}
          >
            {showPlaceholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}

            {opts.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                data-testid={`${testId}-option-${option.value}`}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div
            className={iconClasses}
            aria-hidden="true"
            data-testid={`${testId}-icon`}
          >
            <ChevronDownIcon aria-hidden="true" focusable={false} />
          </div>

          {ariaDescription && (
            <span
              id={internalDescriptionId}
              className={combineClassNames("sr_only", srOnlyClassName)}
              data-testid={`${testId}-description`}
            >
              {ariaDescription}
            </span>
          )}

          {loading && (
            <span
              className={combineClassNames(classMap.loading, loadingClassName)}
              aria-live={ariaLive}
              data-testid={`${testId}-loading`}
            >
              Loading options…
            </span>
          )}
        </div>

        {(resolvedLabelPosition === "bottom" ||
          resolvedLabelPosition === "right") &&
          labelNode}
        {helperText && (
          <div id={presentation.helperTextId}
            className={combineClassNames(classMap.helperText, helperTextClassName, descriptionClassName)}
            data-testid={`${testId}-helper-text`}>{helperText}</div>
        )}
        {errorMessage && (
          <div id={presentation.errorMessageId}
            className={combineClassNames(classMap.errorMessage, errorMessageClassName, errorClassName)}
            aria-live={errorLive === "off" ? undefined : errorLive}
            data-testid={`${testId}-error-message`}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

BaseSelect.displayName = "BaseSelect";
export default BaseSelect;
