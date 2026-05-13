import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { BaseTabsProps } from "./Tabs.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

type Dir = 1 | -1;

const getClass = (
  classMap: Record<string, string>,
  keys: string[],
): string | undefined => {
  for (const k of keys) {
    const v = classMap[k];
    if (typeof v === "string" && v.length > 0) return v;
  }
  return undefined;
};

const TabsBase: React.FC<BaseTabsProps> = ({
  tabs,
  defaultIndex = 0,
  value,
  onChange,
  "aria-label": ariaLabel = "Tabs",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-live": ariaLive,
  tabListId,
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  className,
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  state,
  size = getDefaultSize(),
  orientation = "horizontal",
  activationMode = "auto",
  idBase,
  "data-testid": dataTestId,
  testId = dataTestId ?? "tabs",
  classMap,
}) => {
  const resolvedOrientation = resolvePropAlias(orientation);
  const uid = useId();

  const baseId = useMemo<string>(() => {
    return idBase ?? `${testId}-${uid}`;
  }, [idBase, testId, uid]);

  const isControlled: boolean = typeof value === "number";

  const [uncontrolledIndex, setUncontrolledIndex] =
    useState<number>(defaultIndex);

  const activeIndex: number = isControlled
    ? (value as number)
    : uncontrolledIndex;

  const [focusIndex, setFocusIndex] = useState<number>(defaultIndex);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const current = activationMode === "manual" ? focusIndex : activeIndex;

    tabRefs.current.forEach((el, i) => {
      if (!el) return;
      el.setAttribute("tabindex", i === current ? "0" : "-1");
    });

    tabRefs.current[current]?.focus();
  }, [activeIndex, focusIndex, activationMode]);

  useEffect(() => {
    if (isControlled) setFocusIndex(activeIndex);
  }, [activeIndex, isControlled]);

  const containerClassNames = useMemo(() => {
    const containerClass =
      getClass(classMap, ["container", "tabsContainer", "tabs_container"]) ??
      "";
    const themeClass = classMap[theme] ?? "";
    const stateClass = state ? (classMap[state] ?? "") : "";
    const sizeClass = classMap[size] ?? "";

    return combineClassNames(
      containerClass,
      themeClass,
      stateClass,
      sizeClass,
      glass && classMap.glass,
      className,
    );
  }, [classMap, theme, state, size, glass, className]);

  const tabBaseClassNames = useMemo(() => {
    const tabClass = getClass(classMap, ["tab", "tabs_tab"]) ?? "";
    const shadowClass = shadow
      ? (classMap[`shadow${capitalize(shadow)}`] ??
        classMap[`tabs_shadow-${capitalize(shadow)}`])
      : "";
    const roundingClass = rounding
      ? (classMap[`round${capitalize(rounding)}`] ??
        classMap[`tabs_round-${capitalize(rounding)}`])
      : "";

    return combineClassNames(tabClass, shadowClass, roundingClass);
  }, [classMap, shadow, rounding]);

  const activeClass = useMemo(() => {
    return getClass(classMap, ["active", "tabs_active"]) ?? "";
  }, [classMap]);

  const disabledClass = useMemo(() => {
    return getClass(classMap, ["disabled", "tabs_disabled"]) ?? "";
  }, [classMap]);

  const iconClass = useMemo(() => {
    return getClass(classMap, ["icon", "tabs_icon"]) ?? "";
  }, [classMap]);

  const tabListClass = useMemo(() => {
    return getClass(classMap, ["tabs", "tabs"]) ?? "";
  }, [classMap]);

  const isDisabled = (index: number): boolean => Boolean(tabs[index]?.disabled);

  const nextEnabled = (start: number, dir: Dir): number => {
    const len = tabs.length;
    let i = start;

    for (let n = 0; n < len; n++) {
      i = (i + dir + len) % len;
      if (!isDisabled(i)) return i;
    }

    return start;
  };

  const activate = (index: number): void => {
    if (isDisabled(index)) return;

    if (!isControlled) setUncontrolledIndex(index);
    onChange?.(index);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const horiz = resolvedOrientation === "horizontal";
    const { key } = event;

    let newFocus = focusIndex;

    if (horiz && key === "ArrowRight") {
      event.preventDefault();
      newFocus = nextEnabled(focusIndex, 1);
    } else if (horiz && key === "ArrowLeft") {
      event.preventDefault();
      newFocus = nextEnabled(focusIndex, -1);
    } else if (!horiz && key === "ArrowDown") {
      event.preventDefault();
      newFocus = nextEnabled(focusIndex, 1);
    } else if (!horiz && key === "ArrowUp") {
      event.preventDefault();
      newFocus = nextEnabled(focusIndex, -1);
    } else if (key === "Home") {
      event.preventDefault();
      newFocus = nextEnabled(-1, 1);
    } else if (key === "End") {
      event.preventDefault();
      newFocus = nextEnabled(0, -1);
    } else if (
      activationMode === "manual" &&
      (key === "Enter" || key === " ")
    ) {
      event.preventDefault();
      if (!isDisabled(focusIndex)) activate(focusIndex);
      return;
    } else {
      return;
    }

    setFocusIndex(newFocus);
    if (activationMode === "auto") activate(newFocus);
  };

  return (
    <div className={containerClassNames} data-testid={testId}>
      <div
        id={tabListId}
        className={tabListClass}
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-live={ariaLive}
        role="tablist"
        aria-orientation={resolvedOrientation}
        onKeyDown={onKeyDown}
        data-testid={`${testId}-tablist`}
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = index === activeIndex;
          const disabled = isDisabled(index);
          const generatedTabId = `${baseId}-tab-${index}`;
          const tabId = tab.id ?? generatedTabId;
          return (
            <button
              key={`${tab.label}-${index}`}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              className={combineClassNames(
                tabBaseClassNames,
                isActive && activeClass,
                disabled && disabledClass,
              )}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-label={tab["aria-label"]}
              aria-describedby={tab["aria-describedby"]}
              id={tabId}
              aria-disabled={disabled || undefined}
              onClick={() => {
                if (disabled) return;
                setFocusIndex(index);
                activate(index);
              }}
              data-testid={`${testId}-tab-${index}`}
            >
              {Icon && (
                <span
                  className={iconClass}
                  aria-hidden="true"
                  data-testid={`${testId}-icon-${index}`}
                >
                  <Icon />
                </span>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

TabsBase.displayName = "TabsBase";
export default TabsBase;
