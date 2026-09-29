import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { BaseTabsProps, Tab } from "./Tabs.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { resolvePropAlias } from "../../utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";

type Dir = 1 | -1;
type TabIdentity = string | Tab | null;

const getTabIdentity = (tab: Tab): Exclude<TabIdentity, null> => {
  if (tab.id) return `id:${tab.id}`;
  if (tab.panelId) return `panel:${tab.panelId}`;
  return tab;
};

const findEnabledTabIndex = (
  tabs: Tab[],
  identity: TabIdentity,
): number => {
  if (identity === null) return -1;

  return tabs.findIndex(
    (tab) => !tab.disabled && getTabIdentity(tab) === identity,
  );
};

const firstEnabledTabIndex = (tabs: Tab[]): number =>
  tabs.findIndex((tab) => !tab.disabled);

const resolveRovingIndex = (
  tabs: Tab[],
  identity: TabIdentity,
  activeIndex: number,
): number => {
  const identityIndex = findEnabledTabIndex(tabs, identity);
  if (identityIndex >= 0) return identityIndex;
  if (tabs[activeIndex] && !tabs[activeIndex].disabled) return activeIndex;
  return firstEnabledTabIndex(tabs);
};

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
  defaultValue = 0,
  value,
  onValueChange,
  "aria-label": ariaLabel = "Tabs",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-live": ariaLive,
  tabListId,
  rounding = getDefaultRounding(),
  shadow,
  className,
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
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
    useState<number>(defaultValue);

  const activeIndex: number = isControlled
    ? (value as number)
    : uncontrolledIndex;

  const [rovingIdentity, setRovingIdentity] = useState<TabIdentity>(() => {
    const initialActiveIndex = typeof value === "number" ? value : defaultValue;
    const initialIndex = resolveRovingIndex(tabs, null, initialActiveIndex);
    return initialIndex >= 0 ? getTabIdentity(tabs[initialIndex]) : null;
  });

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;
  const rovingIndex = resolveRovingIndex(tabs, rovingIdentity, activeIndex);

  useEffect(() => {
    if (!isControlled) return;

    const currentTabs = tabsRef.current;
    const controlledIndex = resolveRovingIndex(
      currentTabs,
      null,
      activeIndex,
    );
    setRovingIdentity(
      controlledIndex >= 0
        ? getTabIdentity(currentTabs[controlledIndex])
        : null,
    );
  }, [activeIndex, isControlled]);

  useEffect(() => {
    const resolvedIdentity =
      rovingIndex >= 0 ? getTabIdentity(tabs[rovingIndex]) : null;
    setRovingIdentity((currentIdentity) =>
      currentIdentity === resolvedIdentity ? currentIdentity : resolvedIdentity,
    );
    tabRefs.current.length = tabs.length;
  }, [rovingIndex, tabs]);

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
      (variant === "glass" || variant === "glassOutline") && classMap.glass,
      className,
    );
  }, [classMap, theme, state, size, variant, className]);

  const tabBaseClassNames = useMemo(() => {
    const tabClass = getClass(classMap, ["tab", "tabs_tab"]) ?? "";
    const shadowClass = getShadowClassName(classMap, theme, shadow) ?? "";
    const roundingClass = rounding
      ? (classMap[`round${capitalize(rounding)}`] ??
        classMap[`tabs_round-${capitalize(rounding)}`])
      : "";

    return combineClassNames(tabClass, shadowClass, roundingClass);
  }, [classMap, theme, shadow, rounding]);

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

  const isDisabled = (index: number): boolean =>
    index < 0 || index >= tabs.length || Boolean(tabs[index].disabled);

  const nextEnabled = (start: number, dir: Dir): number => {
    const len = tabs.length;
    if (len === 0) return -1;
    let i = start;

    for (let n = 0; n < len; n++) {
      i = (i + dir + len) % len;
      if (!isDisabled(i)) return i;
    }

    return -1;
  };

  const activate = (index: number): void => {
    if (isDisabled(index)) return;

    if (!isControlled) setUncontrolledIndex(index);
    onValueChange?.(index);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const horiz = resolvedOrientation === "horizontal";
    const { key } = event;

    const eventTargetIndex = tabRefs.current.findIndex(
      (tab) => tab === event.target,
    );
    const currentFocusIndex = isDisabled(eventTargetIndex)
      ? rovingIndex
      : eventTargetIndex;
    let newFocus: number;

    if (horiz && key === "ArrowRight") {
      event.preventDefault();
      newFocus = nextEnabled(currentFocusIndex, 1);
    } else if (horiz && key === "ArrowLeft") {
      event.preventDefault();
      newFocus = nextEnabled(currentFocusIndex, -1);
    } else if (!horiz && key === "ArrowDown") {
      event.preventDefault();
      newFocus = nextEnabled(currentFocusIndex, 1);
    } else if (!horiz && key === "ArrowUp") {
      event.preventDefault();
      newFocus = nextEnabled(currentFocusIndex, -1);
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
      if (!isDisabled(currentFocusIndex)) activate(currentFocusIndex);
      return;
    } else {
      return;
    }

    if (newFocus < 0) return;

    setRovingIdentity(getTabIdentity(tabs[newFocus]));
    tabRefs.current[newFocus]?.focus();
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
        tabIndex={-1}
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
              tabIndex={index === rovingIndex ? 0 : -1}
              aria-selected={isActive}
              aria-label={tab["aria-label"]}
              aria-describedby={tab["aria-describedby"]}
              aria-controls={tab.panelId}
              id={tabId}
              aria-disabled={disabled || undefined}
              onFocus={() => {
                if (!disabled) setRovingIdentity(getTabIdentity(tab));
              }}
              onClick={() => {
                if (disabled) return;
                setRovingIdentity(getTabIdentity(tab));
                tabRefs.current[index]?.focus();
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
