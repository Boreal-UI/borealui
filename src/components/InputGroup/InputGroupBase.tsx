import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useMemo,
  HTMLAttributes,
  ReactElement,
} from "react";
import { InputGroupBaseProps } from "./InputGroup.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

type ChildProps = Record<string, unknown> & {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
  "aria-required"?: boolean;
};

const shouldDisableChild = (child: ReactElement<ChildProps>) =>
  typeof child.type !== "string" ||
  ["button", "input", "select", "textarea"].includes(child.type);

const InputGroupBase = forwardRef<HTMLDivElement, InputGroupBaseProps>(
  (
    {
      children,
      label,
      helperText,
      errorMessage,
      required = false,
      optionalText = "Optional",
      prefix,
      suffix,
      startAddon,
      endAddon,
      labelPosition = "top",
      fullWidth = true,
      theme = getDefaultTheme(),
      state,
      variant = getDefaultVariant(),
      rounding = getDefaultRounding(),
      shadow,
      disabled = false,
      loading = false,
      loadingMessage = "Loading",
      classMap,
      className,
      containerClassName,
      labelClassName,
      descriptionClassName,
      frameClassName,
      contentClassName,
      prefixClassName,
      suffixClassName,
      startAddonClassName,
      endAddonClassName,
      helperTextClassName,
      errorClassName,
      srOnlyText,
      srOnlyClassName,
      "data-testid": dataTestId,
      testId = dataTestId ?? "input-group",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const resolvedLabelPosition = resolvePropAlias(labelPosition);
    const childArray = Children.toArray(children);
    const firstElement = childArray.find(isValidElement) as
      | ReactElement<ChildProps>
      | undefined;

    const {
      id: idProp,
      role: roleProp,
      "aria-describedby": ariaDescribedBy,
      ...restRoot
    } = rest as HTMLAttributes<HTMLDivElement> & {
      "aria-describedby"?: string;
    };

    const controlId =
      idProp ??
      (typeof firstElement?.props.id === "string"
        ? firstElement.props.id
        : undefined) ??
      `${testId}-${generatedId}-control`;
    const rootId = `${controlId}-group`;
    const labelId = label ? `${controlId}-label` : undefined;
    const helperTextId = helperText ? `${controlId}-helperText` : undefined;
    const errorId = errorMessage ? `${controlId}-errorMessage` : undefined;
    const srDescriptionId = srOnlyText
      ? `${controlId}-sr-helperText`
      : undefined;
    const resolvedState = errorMessage ? "error" : state;
    const hasAddons = Boolean(startAddon || endAddon);
    const hasInlineAddons = Boolean(prefix || suffix);

    const computedAriaDescribedBy =
      [ariaDescribedBy, helperTextId, errorId, srDescriptionId]
        .filter(Boolean)
        .join(" ") || undefined;

    const enhancedChildren = useMemo(() => {
      let primaryControlAssigned = false;

      return childArray.map((child) => {
        if (!isValidElement<ChildProps>(child)) return child;

        const isPrimaryControl = !primaryControlAssigned;
        primaryControlAssigned = true;
        const childDescribedBy =
          [child.props["aria-describedby"], computedAriaDescribedBy]
            .filter(Boolean)
            .join(" ") || undefined;
        const nextProps: ChildProps = {};

        if (isPrimaryControl) {
          nextProps.id = child.props.id ?? controlId;
          nextProps.required = child.props.required ?? required;
          nextProps["aria-required"] =
            child.props["aria-required"] ?? (required || undefined);
          nextProps["aria-invalid"] =
            child.props["aria-invalid"] ?? (Boolean(errorMessage) || undefined);
          nextProps["aria-describedby"] = childDescribedBy;
        }

        if (disabled && shouldDisableChild(child)) {
          nextProps.disabled = child.props.disabled ?? true;
        }

        return cloneElement(child, nextProps);
      });
    }, [
      childArray,
      computedAriaDescribedBy,
      controlId,
      disabled,
      errorMessage,
      required,
    ]);

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
          resolvedState && classMap[resolvedState],
          (variant === "outline" || variant === "glassOutline") &&
            classMap.outline,
          (variant === "glass" || variant === "glassOutline") && classMap.glass,
          disabled && classMap.disabled,
          loading && classMap.loading,
          hasAddons && classMap.withAddons,
          hasInlineAddons && classMap.withInlineAddons,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        theme,
        resolvedState,
        variant,
        disabled,
        loading,
        hasAddons,
        hasInlineAddons,
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
            htmlFor={controlId}
            className={combineClassNames(classMap.label, labelClassName)}
            data-testid={`${testId}-label`}
          >
            <span>{label}</span>
            {!required && optionalText ? (
              <span
                className={classMap.optional}
                data-testid={`${testId}-optional`}
              >
                {optionalText}
              </span>
            ) : null}
          </label>
        ) : null}

        {helperText ? (
          <div
            id={helperTextId}
            className={combineClassNames(
              classMap.helperText,
              descriptionClassName,
              helperTextClassName,
            )}
            data-testid={`${testId}-helperText`}
          >
            {helperText}
          </div>
        ) : null}

        <div
          ref={ref}
          id={rootId}
          className={rootClass}
          role={roleProp ?? "group"}
          aria-busy={loading || undefined}
          aria-disabled={disabled || undefined}
          aria-describedby={computedAriaDescribedBy}
          data-testid={`${testId}-root`}
          {...restRoot}
        >
          {startAddon ? (
            <div
              className={combineClassNames(
                classMap.addon,
                classMap.startAddon,
                startAddonClassName,
              )}
              data-testid={`${testId}-start-addon`}
            >
              {startAddon}
            </div>
          ) : null}

          <div
            className={combineClassNames(classMap.frame, frameClassName)}
            data-testid={`${testId}-frame`}
          >
            {prefix ? (
              <span
                className={combineClassNames(classMap.prefix, prefixClassName)}
                data-testid={`${testId}-prefix`}
              >
                {prefix}
              </span>
            ) : null}

            <div
              className={combineClassNames(classMap.content, contentClassName)}
              data-testid={`${testId}-content`}
            >
              {enhancedChildren}
            </div>

            {suffix ? (
              <span
                className={combineClassNames(classMap.suffix, suffixClassName)}
                data-testid={`${testId}-suffix`}
              >
                {suffix}
              </span>
            ) : null}
          </div>

          {endAddon ? (
            <div
              className={combineClassNames(
                classMap.addon,
                classMap.endAddon,
                endAddonClassName,
              )}
              data-testid={`${testId}-end-addon`}
            >
              {endAddon}
            </div>
          ) : null}

          {loading ? (
            <div
              className={classMap.loadingContainer}
              data-testid={`${testId}-loader-container`}
            >
              <span
                className={classMap.loader}
                aria-hidden="true"
                data-testid={`${testId}-loader`}
              />
              <span className={classMap.loadingMessage} role="status">
                {loadingMessage}
              </span>
            </div>
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
        </div>

        {errorMessage ? (
          <div
            id={errorId}
            className={combineClassNames(classMap.errorText, errorClassName)}
            role="alert"
            data-testid={`${testId}-errorMessage`}
          >
            {errorMessage}
          </div>
        ) : null}
      </div>
    );
  },
);

InputGroupBase.displayName = "InputGroupBase";
export default InputGroupBase;
