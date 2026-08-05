import {
  forwardRef,
  KeyboardEvent,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  SegmentedControlBaseProps,
  SegmentedControlOption,
} from "./SegmentedControl.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const getEnabledOptionIndexes = (options: SegmentedControlOption[]) =>
  options.reduce<number[]>((indexes, option, index) => {
    if (!option.disabled) indexes.push(index);
    return indexes;
  }, []);

const SegmentedControlBase = forwardRef<
  HTMLDivElement,
  SegmentedControlBaseProps
>(
  (
    {
      children,
      options = [],
      value,
      defaultValue,
      onValueChange,
      name,
      required = false,
      label,
      labelPosition = "top",
      orientation = "horizontal",
      loopNavigation = true,
      fullWidth = false,
      equalWidth = false,
      theme = getDefaultTheme(),
      state,
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      disabled = false,
      loading = false,
      classMap,
      className,
      containerClassName,
      labelClassName,
      contentClassName,
      optionClassName,
      selectedOptionClassName,
      optionIconClassName,
      optionLabelClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "segmented-control",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const enabledOptionIndexes = useMemo(
      () => getEnabledOptionIndexes(options),
      [options],
    );
    const fallbackValue = options[enabledOptionIndexes[0]]?.value;
    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? fallbackValue,
    );
    const selectedValue = value ?? uncontrolledValue;
    const selectedIndex = options.findIndex(
      (option) => option.value === selectedValue,
    );
    const focusIndex =
      selectedIndex >= 0 ? selectedIndex : enabledOptionIndexes[0];

    const {
      id: idProp,
      role: roleProp,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-disabled": ariaDisabled,
      onKeyDown,
      ...restRoot
    } = rest;

    const rootId = idProp ?? `${testId}-${generatedId}`;
    const labelId = label ? `${rootId}-label` : undefined;
    const srDescriptionId = srOnlyText ? `${rootId}-sr-description` : undefined;
    const computedAriaDescribedBy =
      [ariaDescribedBy, srDescriptionId].filter(Boolean).join(" ") || undefined;
    const computedAriaLabelledBy =
      ariaLabelledBy ?? (!ariaLabel ? labelId : undefined);
    const computedAriaDisabled = ariaDisabled ?? (disabled || undefined);
    const isInteractionDisabled = disabled || loading;

    const containerClass = useMemo(
      () =>
        combineClassNames(
          classMap.container,
          classMap[`label${capitalize(resolvedLabelPosition)}`],
          fullWidth && classMap.fullWidth,
          containerClassName,
        ),
      [classMap, resolvedLabelPosition, fullWidth, containerClassName],
    );

    const rootClass = useMemo(
      () =>
        combineClassNames(
          classMap.root,
          classMap[theme],
          state && classMap[state],
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          disabled && classMap.disabled,
          loading && classMap.loading,
          orientation === "vertical" && classMap.vertical,
          fullWidth && classMap.fullWidth,
          equalWidth && classMap.equalWidth,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        theme,
        state,
        variant,
        disabled,
        loading,
        orientation,
        fullWidth,
        equalWidth,
        shadow,
        rounding,
        className,
      ],
    );

    const focusOption = useCallback((index: number) => {
      optionRefs.current[index]?.focus();
    }, []);

    const selectOption = useCallback(
      (option: SegmentedControlOption) => {
        if (isInteractionDisabled || option.disabled) return;

        if (value === undefined) {
          setUncontrolledValue(option.value);
        }

        onValueChange?.(option.value, option);
      },
      [isInteractionDisabled, onValueChange, value],
    );

    const getNextEnabledIndex = useCallback(
      (currentIndex: number, direction: 1 | -1) => {
        if (!enabledOptionIndexes.length) return -1;

        const enabledPosition = enabledOptionIndexes.includes(currentIndex)
          ? enabledOptionIndexes.indexOf(currentIndex)
          : 0;
        const nextPosition = enabledPosition + direction;

        if (loopNavigation) {
          const wrappedPosition =
            (nextPosition + enabledOptionIndexes.length) %
            enabledOptionIndexes.length;
          return enabledOptionIndexes[wrappedPosition];
        }

        if (nextPosition < 0 || nextPosition >= enabledOptionIndexes.length) {
          return currentIndex;
        }

        return enabledOptionIndexes[nextPosition];
      },
      [enabledOptionIndexes, loopNavigation],
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || isInteractionDisabled) return;

      const target = event.target as HTMLElement;
      const optionIndex = Number(target.dataset.segmentedControlIndex);
      if (!Number.isInteger(optionIndex)) return;

      let nextIndex: number | undefined;

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          nextIndex = getNextEnabledIndex(optionIndex, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          nextIndex = getNextEnabledIndex(optionIndex, -1);
          break;
        case "Home":
          nextIndex = enabledOptionIndexes[0];
          break;
        case "End":
          nextIndex = enabledOptionIndexes[enabledOptionIndexes.length - 1];
          break;
        case " ":
        case "Enter":
          event.preventDefault();
          selectOption(options[optionIndex]);
          return;
        default:
          return;
      }

      if (nextIndex === undefined || nextIndex < 0) return;

      event.preventDefault();
      focusOption(nextIndex);
      selectOption(options[nextIndex]);
    };

    return (
      <div className={containerClass} data-testid={testId}>
        {label ? (
          <div
            id={labelId}
            className={combineClassNames(classMap.label, labelClassName)}
            data-testid={`${testId}-label`}
          >
            {label}
          </div>
        ) : null}

        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          ref={ref}
          id={rootId}
          role={roleProp ?? "radiogroup"}
          aria-label={ariaLabel}
          aria-labelledby={computedAriaLabelledBy}
          aria-describedby={computedAriaDescribedBy}
          aria-disabled={computedAriaDisabled}
          aria-busy={loading || undefined}
          aria-orientation={orientation}
          className={rootClass}
          tabIndex={-1}
          data-testid={`${testId}-root`}
          onKeyDown={handleKeyDown}
          {...restRoot}
        >
          {loading ? (
            <span
              className={classMap.loader}
              aria-hidden="true"
              data-testid={`${testId}-loader`}
            />
          ) : null}

          <div
            className={combineClassNames(classMap.content, contentClassName)}
            data-testid={`${testId}-content`}
          >
            {options.length
              ? options.map((option, index) => {
                  const isSelected = option.value === selectedValue;
                  const isOptionDisabled =
                    isInteractionDisabled || option.disabled;

                  return (
                    <button
                      key={option.value}
                      ref={(node) => {
                        optionRefs.current[index] = node;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={option["aria-label"]}
                      disabled={isOptionDisabled}
                      tabIndex={
                        !isOptionDisabled && index === focusIndex ? 0 : -1
                      }
                      data-segmented-control-index={index}
                      data-testid={`${testId}-option-${option.value}`}
                      className={combineClassNames(
                        classMap.option,
                        isSelected && classMap.optionSelected,
                        isOptionDisabled && classMap.optionDisabled,
                        optionClassName,
                        isSelected && selectedOptionClassName,
                        option.className,
                      )}
                      onClick={() => selectOption(option)}
                    >
                      {option.icon ? (
                        <span
                          className={combineClassNames(
                            classMap.optionIcon,
                            optionIconClassName,
                          )}
                          aria-hidden="true"
                          data-testid={`${testId}-option-${option.value}-icon`}
                        >
                          {option.icon}
                        </span>
                      ) : null}
                      <span
                        className={combineClassNames(
                          classMap.optionLabel,
                          optionLabelClassName,
                        )}
                      >
                        {option.label}
                      </span>
                    </button>
                  );
                })
              : children}
          </div>

          {name ? (
            <input
              type="hidden"
              name={name}
              value={selectedValue ?? ""}
              required={required}
              disabled={disabled}
              data-testid={`${testId}-input`}
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
        </div>
      </div>
    );
  },
);

SegmentedControlBase.displayName = "SegmentedControlBase";
export default SegmentedControlBase;
