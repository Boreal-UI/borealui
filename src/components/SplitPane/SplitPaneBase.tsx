import {
  Children,
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { SplitPaneBaseProps } from "./SplitPane.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(value)));

const SplitPaneBase = forwardRef<HTMLDivElement, SplitPaneBaseProps>(
  (
    {
      startPane,
      endPane,
      children,
      orientation = "horizontal",
      size,
      defaultSize = 50,
      minSize = 10,
      maxSize = 90,
      resizable = true,
      onSizeChange,
      separatorAriaLabel = "Resize panes",
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
      startPaneClassName,
      endPaneClassName,
      srOnlyText,
      srOnlyClassName,
      style,
      "data-testid": dataTestId,
      testId = dataTestId ?? "split-pane",
      ...rest
    },
    ref,
  ) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [internalSize, setInternalSize] = useState(defaultSize);
    const paneSize = clamp(size ?? internalSize, minSize, maxSize);
    const childArray = Children.toArray(children);
    const resolvedStartPane = startPane ?? childArray[0];
    const resolvedEndPane = endPane ?? childArray[1] ?? childArray.slice(1);
    const isResizable = resizable && !disabled && !loading;

    const setRefs = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const commitSize = (nextSize: number) => {
      const next = clamp(nextSize, minSize, maxSize);
      if (size === undefined) setInternalSize(next);
      onSizeChange?.(next);
    };

    const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
      if (!isResizable || !rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const next =
        orientation === "horizontal"
          ? ((event.clientX - rect.left) / rect.width) * 100
          : ((event.clientY - rect.top) / rect.height) * 100;
      commitSize(next);
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
      if (!isResizable) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      updateFromPointer(event);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isResizable) return;
      const decrement =
        orientation === "horizontal"
          ? event.key === "ArrowLeft"
          : event.key === "ArrowUp";
      const increment =
        orientation === "horizontal"
          ? event.key === "ArrowRight"
          : event.key === "ArrowDown";

      if (decrement || increment) {
        event.preventDefault();
        commitSize(paneSize + (increment ? 5 : -5));
      } else if (event.key === "Home") {
        event.preventDefault();
        commitSize(minSize);
      } else if (event.key === "End") {
        event.preventDefault();
        commitSize(maxSize);
      }
    };

    const rootClass = useMemo(
      () =>
        combineClassNames(
          classMap.root,
          classMap[theme],
          state && classMap[state],
          classMap[orientation],
          outline && classMap.outline,
          glass && classMap.glass,
          disabled && classMap.disabled,
          loading && classMap.loading,
          !isResizable && classMap.static,
          shadow && classMap[`shadow${capitalize(shadow)}`],
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        theme,
        state,
        orientation,
        outline,
        glass,
        disabled,
        loading,
        isResizable,
        shadow,
        rounding,
        className,
      ],
    );

    const rootStyle = {
      ...style,
      "--split-pane-size": `${paneSize}%`,
    } as CSSProperties;

    return (
      <div
        ref={setRefs}
        className={rootClass}
        style={rootStyle}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        data-testid={testId}
        {...rest}
      >
        {loading ? (
          <span
            className={classMap.loader}
            aria-hidden="true"
            data-testid={`${testId}-loader`}
          />
        ) : null}
        <section
          className={combineClassNames(classMap.startPane, startPaneClassName)}
          data-testid={`${testId}-start-pane`}
        >
          {resolvedStartPane}
        </section>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          role="separator"
          tabIndex={isResizable ? 0 : -1} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
          aria-label={separatorAriaLabel}
          aria-orientation={
            orientation === "horizontal" ? "vertical" : "horizontal"
          }
          aria-valuemin={minSize}
          aria-valuemax={maxSize}
          aria-valuenow={paneSize}
          aria-disabled={!isResizable || undefined}
          className={classMap.separator}
          onPointerDown={handlePointerDown}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              updateFromPointer(event);
            }
          }}
          onKeyDown={handleKeyDown}
          data-testid={`${testId}-separator`}
        />
        <section
          className={combineClassNames(classMap.endPane, endPaneClassName)}
          data-testid={`${testId}-end-pane`}
        >
          {resolvedEndPane}
          {srOnlyText ? (
            <span
              className={combineClassNames(
                classMap.srOnly ?? "sr_only",
                srOnlyClassName,
              )}
              data-testid={`${testId}-sr-only-text`}
            >
              {srOnlyText}
            </span>
          ) : null}
        </section>
      </div>
    );
  },
);

SplitPaneBase.displayName = "SplitPaneBase";
export default SplitPaneBase;
