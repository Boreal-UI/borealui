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
import {
  getDefaultOutline,
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { BaseSelectProps } from "./Select.types";

const BaseSelect = forwardRef<HTMLSelectElement, BaseSelectProps>(
  (
    {
      theme = getDefaultTheme(),
      glass = getDefaultGlass(),
      state,
      outline = getDefaultOutline(),
      rounding = getDefaultRounding(),
      shadow = getDefaultShadow(),
      options,
      value,
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

      return combineClassNames(classMap.layout, posClass, layoutClassName);
    }, [classMap, hasLabel, resolvedLabelPosition, layoutClassName]);

    const labelClasses = useMemo(
      () =>
        combineClassNames(
          classMap.label,
          classMap.labelOverlay,
          labelClassName,
        ),
      [classMap, labelClassName],
    );

    const computedDescribedBy = useMemo(() => {
      const ids = [ariaDescribedBy, internalDescriptionId].filter(Boolean);
      return ids.length > 0 ? ids.join(" ") : undefined;
    }, [ariaDescribedBy, internalDescriptionId]);

    const computedAriaLabel = ariaLabelledBy
      ? undefined
      : ariaLabel || placeholder;

    const labelNode = hasLabel ? (
      <div className={labelClasses} data-testid={`${testId}-label`}>
        {label}
      </div>
    ) : null;

    useEffect(() => {
      if (!asyncOptions) return;

      let isMounted = true;

      const load = async () => {
        try {
          setLoading(true);
          const fetched = await asyncOptions("");
          if (isMounted) setInternalOptions(fetched);
        } catch (err) {
          console.error("Failed to load options:", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      void load();

      if (pollInterval > 0) {
        const intervalId = setInterval(() => {
          void load();
        }, pollInterval);
        return () => {
          clearInterval(intervalId);
          isMounted = false;
        };
      }

      return () => {
        isMounted = false;
      };
    }, [asyncOptions, pollInterval]);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value);
    };

    const handleWrapperClick = (event: MouseEvent<HTMLDivElement>) => {
      if (disabled || event.target === selectRef.current) return;

      selectRef.current?.focus();
      selectRef.current?.click();
    };

    const wrapperClasses = useMemo(
      () =>
        combineClassNames(
          classMap.wrapper,
          classMap[theme],
          state && classMap[state],
          glass && classMap.glass,
          className,
          shadow && classMap[`shadow${capitalize(shadow)}`],
          rounding && classMap[`round${capitalize(rounding)}`],
          outline && classMap.outline,
          disabled && classMap.disabled,
        ),
      [
        classMap,
        theme,
        state,
        glass,
        className,
        shadow,
        rounding,
        outline,
        disabled,
      ],
    );

    const selectClasses = useMemo(
      () =>
        combineClassNames(
          classMap.select,
          outline && classMap.outline,
          selectClassName,
        ),
      [classMap, outline, selectClassName],
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

    return (
      <div className={layoutClasses} data-testid={`${testId}-layout`}>
        {(resolvedLabelPosition === "top" ||
          resolvedLabelPosition === "left") &&
          labelNode}

        <div
          className={wrapperClasses}
          data-testid={testId}
          onClick={handleWrapperClick}
        >
          <select
            ref={selectRef}
            id={selectId}
            name={name}
            form={form}
            autoComplete={autoComplete}
            role={role}
            tabIndex={tabIndex}
            value={value ?? ""}
            onChange={handleChange}
            className={selectClasses}
            aria-label={computedAriaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-description={ariaDescription}
            aria-describedby={computedDescribedBy}
            aria-disabled={disabled || undefined}
            aria-invalid={ariaInvalid ?? (state === "error" || undefined)}
            aria-required={ariaRequired ?? (required || undefined)}
            aria-busy={ariaBusy ?? (loading || undefined)}
            disabled={disabled}
            required={required}
            data-testid={`${testId}-input`}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>

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
      </div>
    );
  },
);

BaseSelect.displayName = "BaseSelect";
export default BaseSelect;
