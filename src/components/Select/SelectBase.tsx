import {
  forwardRef,
  ChangeEvent,
  useId,
  useMemo,
  useEffect,
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
      state = "",
      outline = getDefaultOutline(),
      rounding = getDefaultRounding(),
      shadow = getDefaultShadow(),
      options,
      value,
      onChange,
      placeholder = "Select an option",
      disabled = false,
      className = "",
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

    const hasLabel = Boolean(label);

    const layoutClasses = useMemo(() => {
      const posClass = hasLabel
        ? classMap[`label${capitalize(resolvedLabelPosition)}`]
        : undefined;

      return combineClassNames(classMap.layout, posClass);
    }, [classMap, hasLabel, resolvedLabelPosition]);

    const labelClasses = useMemo(
      () => combineClassNames(classMap.label, classMap.labelOverlay),
      [classMap],
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

    const wrapperClasses = useMemo(
      () =>
        combineClassNames(
          classMap.wrapper,
          classMap[theme],
          classMap[state],
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
      () => combineClassNames(classMap.select, outline && classMap.outline),
      [classMap, outline],
    );

    const iconClasses = useMemo(
      () =>
        combineClassNames(
          classMap.icon,
          classMap[theme],
          disabled && classMap.disabled,
        ),
      [classMap, theme, disabled],
    );

    const opts = asyncOptions ? internalOptions : options;

    return (
      <div className={layoutClasses} data-testid={`${testId}-layout`}>
        {(resolvedLabelPosition === "top" ||
          resolvedLabelPosition === "left") &&
          labelNode}

        <div className={wrapperClasses} data-testid={testId}>
          <select
            ref={ref}
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
              className="sr_only"
              data-testid={`${testId}-description`}
            >
              {ariaDescription}
            </span>
          )}

          {loading && (
            <span
              className={classMap.loading}
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
