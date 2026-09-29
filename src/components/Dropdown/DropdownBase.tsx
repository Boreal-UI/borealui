import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  useId,
  JSX,
  useMemo,
  useLayoutEffect,
} from "react";
import {
  BaseDropdownProps,
  DropdownItem,
  IconButtonLikeRef,
} from "./Dropdown.types";
import { combineClassNames } from "../../utils/classNames";
import { composeEventHandlers } from "../../utils/eventHandlers";
import { mergeSafeRel, sanitizeNavigationHref } from "../../utils/navigationSecurity";
import MenuIcon from "../../Icons/MenuIcon";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import {
  getMenuItemPath as getItemPath,
  getParentMenuPath as getParentPath,
  isDisabledMenuElement as isDisabledElement,
  isMenuPathOpen as isPathOpen,
  MENU_VIEWPORT_MARGIN as VIEWPORT_MARGIN,
  resolveMenuNavigationIntent,
  ROOT_MENU_PANEL_PATH as ROOT_PANEL_PATH,
} from "../../utils/menuNavigation";
import { useFloatingPanelSync } from "../../hooks/useFloatingPanelSync";
import { useOutsideInteraction } from "../../hooks/useOutsideInteraction";
import {
  getFloatingPanelHorizontalOverflow,
  getFloatingPanelSizeLimits,
  readFloatingPanelViewport,
  resolveNestedPanelLayout,
} from "../../utils/floatingPanelGeometry";

type PanelPlacement = "left" | "right";
type PanelStyle = React.CSSProperties & Record<string, string>;
type PanelLayout = {
  placement?: PanelPlacement;
  overflowLeft?: boolean;
  overflowRight?: boolean;
  style: PanelStyle;
};

const hasSubmenuItems = (item: DropdownItem) =>
  Array.isArray(item.items) && item.items.length > 0;

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  triggerIcon,
  items,
  align = "end",
  className,
  menuClassName,
  "aria-label": ariaLabel = "Dropdown menu",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  menuAriaLabel,
  menuAriaLabelledBy,
  menuAriaDescribedBy,
  menuId: menuIdProp,
  triggerId,
  focusFirstItemOnOpen = true,
  closeOnSelect = true,
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
  toggleRounding = getDefaultRounding(),
  menuRounding = getDefaultRounding(),
  toggleShadow,
  menuShadow,
  state,
  title,
  triggerProps,
  menuProps,
  "data-testid": dataTestId,
  testId = dataTestId ?? "dropdown",
  IconButton,
  classMap,
  onKeyDown,
  ...rest
}: BaseDropdownProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [openSubmenuPath, setOpenSubmenuPath] = useState<string | null>(null);
  const [panelLayouts, setPanelLayouts] = useState<Record<string, PanelLayout>>(
    {},
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<IconButtonLikeRef | null>(null);

  const generatedMenuId = useId();
  const resolvedMenuId = menuIdProp ?? generatedMenuId;

  const Icon = triggerIcon ?? MenuIcon;

  const getEnabledItemsInPanel = useCallback((panel?: HTMLElement | null) => {
    if (!panel) return [];

    return Array.from(
      panel.querySelectorAll<HTMLElement>('[data-dropdown-menu-item="true"]'),
    ).filter((element) => {
      const ownerPanel = element.closest("[data-dropdown-panel]");
      return ownerPanel === panel && !isDisabledElement(element);
    });
  }, []);

  const focusFirstItemInPanel = useCallback(
    (panel?: HTMLElement | null) => {
      getEnabledItemsInPanel(panel)[0]?.focus();
    },
    [getEnabledItemsInPanel],
  );

  const focusItemInPanel = useCallback(
    (panel: HTMLElement | null, nextIndex: number) => {
      const enabledItems = getEnabledItemsInPanel(panel);

      if (enabledItems.length === 0) return;

      const resolvedIndex =
        (nextIndex + enabledItems.length) % enabledItems.length;
      enabledItems[resolvedIndex]?.focus();
    },
    [getEnabledItemsInPanel],
  );

  const focusSubmenuPanel = useCallback(
    (submenuId: string) => {
      const focusPanel = () => {
        const panel = document.getElementById(submenuId);
        if (panel instanceof HTMLElement) {
          focusFirstItemInPanel(panel);
        }
      };

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(focusPanel);
      } else {
        window.setTimeout(focusPanel);
      }
    },
    [focusFirstItemInPanel],
  );

  const updatePanelLayouts = useCallback(
    (includeRootPanel = true) => {
      if (!open || !menuRef.current) {
        setPanelLayouts({});
        return;
      }

      const viewport = readFloatingPanelViewport();
      const sizeLimits = getFloatingPanelSizeLimits(
        viewport,
        VIEWPORT_MARGIN,
      );
      const maxHeight = `${sizeLimits.maxHeight}px`;
      const maxWidth = `${sizeLimits.maxWidth}px`;
      const panels = [
        menuRef.current,
        ...Array.from(
          menuRef.current.querySelectorAll<HTMLElement>(
            "[data-dropdown-panel]",
          ),
        ),
      ];
      setPanelLayouts((previousLayouts) => {
        const nextLayouts: Record<string, PanelLayout> = includeRootPanel
          ? {}
          : {
              [ROOT_PANEL_PATH]: previousLayouts[ROOT_PANEL_PATH],
            };

        panels.forEach((panel) => {
          const path = panel.dataset.dropdownPanelPath ?? ROOT_PANEL_PATH;

          if (path === ROOT_PANEL_PATH && !includeRootPanel) {
            return;
          }

          const rect = panel.getBoundingClientRect();
          const style: PanelStyle = {
            "--dropdown-panel-max-height": maxHeight,
            "--dropdown-panel-max-width": maxWidth,
          };

          if (path === ROOT_PANEL_PATH) {
            const overflow = getFloatingPanelHorizontalOverflow(
              rect,
              viewport.width,
              VIEWPORT_MARGIN,
            );
            nextLayouts[path] = {
              ...overflow,
              style,
            };
            return;
          }

          const wrapper = panel.closest<HTMLElement>(
            '[data-dropdown-item-wrapper="true"]',
          );
          const wrapperRect = wrapper?.getBoundingClientRect();
          const panelWidth = Math.max(rect.width, panel.offsetWidth, 160);
          const { placement, offsetY } = resolveNestedPanelLayout({
            panelRect: rect,
            anchorRect: wrapperRect,
            panelWidth,
            viewport,
            padding: VIEWPORT_MARGIN,
          });

          style["--dropdown-panel-offset-y"] = `${Math.round(offsetY)}px`;

          nextLayouts[path] = {
            placement,
            style,
          };
        });

        return nextLayouts;
      });
    },
    [open],
  );

  const updateAllPanelLayouts = useCallback(
    () => updatePanelLayouts(true),
    [updatePanelLayouts],
  );
  const shouldUpdatePanelLayouts = useCallback((event: Event) => {
    const target = event.target;

    return !(
      event.type === "scroll" &&
      target instanceof Node &&
      menuRef.current?.contains(target)
    );
  }, []);

  useFloatingPanelSync({
    open,
    updatePosition: updateAllPanelLayouts,
    shouldUpdate: shouldUpdatePanelLayouts,
  });

  const toggleDropdown = () => {
    setOpen((prev) => {
      if (prev) {
        setOpenSubmenuPath(null);
      }

      return !prev;
    });
  };

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setOpenSubmenuPath(null);
    triggerRef.current?.focus?.();
  }, []);

  const openSubmenu = useCallback((path: string) => {
    setOpenSubmenuPath((prev) => {
      if (prev === path || prev?.startsWith(`${path}.`)) return prev;

      return path;
    });
  }, []);

  const toggleSubmenu = useCallback((path: string) => {
    setOpenSubmenuPath((prev) => {
      if (prev === path || prev?.startsWith(`${path}.`)) {
        return getParentPath(path);
      }

      return path;
    });
  }, []);

  const handleItemSelect = useCallback(
    (item: DropdownItem) => {
      if (item.disabled || hasSubmenuItems(item)) return;

      item.onClick?.();

      if (closeOnSelect) {
        closeDropdown();
      }
    },
    [closeDropdown, closeOnSelect],
  );

  useLayoutEffect(() => {
    if (!open) return;

    updatePanelLayouts(true);
  }, [items, open, updatePanelLayouts]);

  useLayoutEffect(() => {
    if (!open || !openSubmenuPath) return;

    updatePanelLayouts(false);
  }, [open, openSubmenuPath, updatePanelLayouts]);

  useEffect(() => {
    if (!open) return;

    if (!focusFirstItemOnOpen) return;

    focusFirstItemInPanel(menuRef.current);
  }, [focusFirstItemInPanel, focusFirstItemOnOpen, open]);

  useOutsideInteraction({
    active: open,
    insideRefs: [dropdownRef],
    onOutsideInteraction: closeDropdown,
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!open) return;

      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const currentPanel =
        (activeElement?.closest(
          "[data-dropdown-panel]",
        ) as HTMLElement | null) ?? menuRef.current;

      if (e.key === "Escape") {
        e.preventDefault();
        closeDropdown();
        return;
      }

      if (e.key === "Tab") {
        closeDropdown();
        return;
      }

      const enabledItems = getEnabledItemsInPanel(currentPanel);
      const currentIndex = activeElement
        ? enabledItems.indexOf(activeElement)
        : -1;
      const activeItem =
        activeElement?.dataset.dropdownMenuItem === "true"
          ? activeElement
          : null;
      const panelPath = currentPanel?.dataset.dropdownPanelPath;
      const submenuPath = activeItem?.dataset.dropdownItemPath;
      const submenuId = activeItem?.getAttribute("aria-controls");
      const intent = resolveMenuNavigationIntent({
        key: e.key,
        currentIndex,
        itemCount: enabledItems.length,
        activeHasSubmenu: activeItem?.dataset.dropdownHasSubmenu === "true",
        activeItemAvailable: Boolean(
          activeItem && !isDisabledElement(activeItem),
        ),
        isSubmenuPanel: Boolean(
          panelPath && panelPath !== ROOT_PANEL_PATH,
        ),
      });

      if (intent.type === "focus") {
        e.preventDefault();
        focusItemInPanel(currentPanel, intent.index);
        return;
      }

      if (intent.type === "open-submenu" && submenuPath && submenuId) {
        e.preventDefault();
        openSubmenu(submenuPath);
        focusSubmenuPanel(submenuId);
        return;
      }

      if (intent.type === "close-submenu" && panelPath) {
        e.preventDefault();
        const parentPath = getParentPath(panelPath);
        setOpenSubmenuPath(parentPath);

        const parentTrigger = dropdownRef.current?.querySelector<HTMLElement>(
          `[data-dropdown-item-path="${panelPath}"][data-dropdown-menu-item="true"]`,
        );
        parentTrigger?.focus();
        return;
      }

      if (intent.type === "activate" && activeItem) {
        e.preventDefault();

        if (activeItem.dataset.dropdownHasSubmenu === "true") {
          if (submenuPath) {
            toggleSubmenu(submenuPath);
          }
          return;
        }

        activeItem.click();
      }
    },
    [
      closeDropdown,
      focusItemInPanel,
      focusSubmenuPanel,
      getEnabledItemsInPanel,
      open,
      openSubmenu,
      toggleSubmenu,
    ],
  );

  const menuClassNames = useMemo(
    () =>
      combineClassNames(
        classMap.menu,
        align === "end" ? classMap.alignRight : classMap.alignLeft,
        classMap[theme],
        state && classMap[state],
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        getShadowClassName(classMap, theme, menuShadow),
        menuRounding && classMap[`round${capitalize(menuRounding)}`],
        menuClassName,
        menuProps?.className,
      ),
    [
      classMap,
      align,
      theme,
      state,
      variant,
      menuShadow,
      menuRounding,
      menuClassName,
      menuProps?.className,
    ],
  );

  const getPanelAttributes = (path: string) => {
    const layout = panelLayouts[path];

    return {
      "data-overflow-left": layout?.overflowLeft ? "true" : undefined,
      "data-overflow-right": layout?.overflowRight ? "true" : undefined,
      "data-placement": layout?.placement,
      style: layout?.style,
    };
  };

  const submenuClassNames = (isOpen: boolean) =>
    combineClassNames(
      classMap.menu,
      classMap.submenu,
      isOpen && classMap.submenuOpen,
      classMap[theme],
      state && classMap[state],
      (variant === "glass" || variant === "glassOutline") && classMap.glass,
      getShadowClassName(classMap, theme, menuShadow),
      menuRounding && classMap[`round${capitalize(menuRounding)}`],
    );

  const renderItemContent = (item: DropdownItem, hasSubmenu: boolean) => (
    <>
      <span className={classMap.itemContent}>
        {item.icon && (
          <span className={classMap.icon} aria-hidden="true">
            {item.icon}
          </span>
        )}
        {item.label}
      </span>

      {hasSubmenu && (
        <span className={classMap.submenuIndicator} aria-hidden="true">
          ›
        </span>
      )}
    </>
  );

  const renderMenuItems = (
    menuItems: DropdownItem[],
    parentPath = "",
  ): React.ReactNode =>
    menuItems.map((item, index) => {
      const itemPath = getItemPath(parentPath, index);
      const hasSubmenu = hasSubmenuItems(item);
      const submenuOpen = hasSubmenu && isPathOpen(openSubmenuPath, itemPath);
      const itemTestId = item["data-testid"] ?? item.testId;
      const submenuId =
        item.submenuId ?? `${resolvedMenuId}-${itemPath}-submenu`;
      const openCurrentSubmenu = () => {
        if (hasSubmenu && !item.disabled) {
          openSubmenu(itemPath);
        }
      };
      const openDirectSubmenu = () => {
        if (hasSubmenu && !item.disabled) {
          setOpenSubmenuPath(itemPath);
        }
      };
      const closeChildSubmenus = () => {
        if (hasSubmenu) return;

        setOpenSubmenuPath((currentPath) => {
          if (!currentPath) return currentPath;
          if (!parentPath) return null;

          return isPathOpen(currentPath, parentPath) ? parentPath : currentPath;
        });
      };
      const handleDirectItemHover = () => {
        if (hasSubmenu) {
          openCurrentSubmenu();
          return;
        }

        closeChildSubmenus();
      };
      const handleSubmenuWrapperOver = (
        event:
          | React.MouseEvent<HTMLDivElement>
          | React.PointerEvent<HTMLDivElement>,
      ) => {
        const target = event.target as HTMLElement;
        const currentPanel = event.currentTarget.closest(
          "[data-dropdown-panel]",
        );
        const targetPanel = target.closest("[data-dropdown-panel]");
        const targetWrapper = target.closest(
          '[data-dropdown-item-wrapper="true"]',
        );

        if (targetPanel && targetPanel !== currentPanel) return;
        if (targetWrapper !== event.currentTarget) return;

        if (hasSubmenu) {
          openDirectSubmenu();
        } else {
          closeChildSubmenus();
        }
      };
      const itemClassName = combineClassNames(
        classMap.item,
        hasSubmenu && classMap.submenuTrigger,
        item.disabled ? classMap.disabled : "",
      );
      const commonProps = {
        id: item.id,
        className: itemClassName,
        "aria-label": item["aria-label"],
        "aria-describedby": item["aria-describedby"],
        "aria-current": item["aria-current"],
        "aria-disabled": item.disabled || undefined,
        "aria-haspopup": hasSubmenu ? ("menu" as const) : undefined,
        "aria-expanded": hasSubmenu ? submenuOpen : undefined,
        "aria-controls": hasSubmenu ? submenuId : undefined,
        title: item.title,
        "data-dropdown-menu-item": "true",
        "data-dropdown-item-path": itemPath,
        "data-dropdown-has-submenu": hasSubmenu ? "true" : undefined,
        "data-testid": itemTestId,
      };
      const safeItemHref = sanitizeNavigationHref(item.href);

      return (
        <div
          key={item.id ?? itemPath}
          className={combineClassNames(
            classMap.itemWrapper,
            hasSubmenu && classMap.hasSubmenu,
          )}
          role="presentation"
          data-dropdown-item-wrapper="true"
          data-dropdown-item-path={itemPath}
          onPointerEnter={handleDirectItemHover}
          onPointerOver={handleSubmenuWrapperOver}
          onMouseEnter={handleDirectItemHover}
          onMouseOver={handleSubmenuWrapperOver}
          onFocus={(event) => {
            if (event.target === event.currentTarget) {
              handleDirectItemHover();
            }
          }}
        >
          {hasSubmenu ? (
            <button
              type="button"
              disabled={item.disabled}
              {...commonProps}
              onPointerEnter={openCurrentSubmenu}
              onPointerOver={openDirectSubmenu}
              onMouseEnter={openCurrentSubmenu}
              onMouseOver={openDirectSubmenu}
              onFocus={() => undefined}
              onClick={(event) => {
                event.stopPropagation();
                openDirectSubmenu();
              }}
            >
              {renderItemContent(item, true)}
            </button>
          ) : safeItemHref ? (
            <a
              href={item.disabled ? undefined : safeItemHref}
              target={item.disabled ? undefined : item.target}
              rel={mergeSafeRel(item.target, item.rel)}
              {...commonProps}
              onClick={(e) => {
                e.stopPropagation();
                if (item.disabled) {
                  e.preventDefault();
                  return;
                }
                item.onClick?.();
                if (closeOnSelect) {
                  closeDropdown();
                }
              }}
            >
              {renderItemContent(item, false)}
            </a>
          ) : (
            <button
              type="button"
              disabled={item.disabled}
              {...commonProps}
              onClick={(event) => {
                event.stopPropagation();
                handleItemSelect(item);
              }}
            >
              {renderItemContent(item, false)}
            </button>
          )}

          {hasSubmenu && submenuOpen && (
            <div
              id={submenuId}
              className={submenuClassNames(submenuOpen)}
              aria-label={item.submenuAriaLabel ?? item.label}
              data-dropdown-panel="true"
              data-dropdown-panel-path={itemPath}
              data-testid={
                itemTestId
                  ? `${itemTestId}-submenu`
                  : `${testId}-${itemPath}-submenu`
              }
              {...getPanelAttributes(itemPath)}
            >
              {renderMenuItems(item.items ?? [], itemPath)}
            </div>
          )}
        </div>
      );
    });

  const rootPanelAttributes = getPanelAttributes(ROOT_PANEL_PATH);

  return (
    <div
      ref={dropdownRef}
      className={combineClassNames(classMap.wrapper, className)}
      {...rest}
      role="presentation"
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      data-testid={testId}
    >
      <IconButton
        ref={triggerRef}
        id={triggerId}
        icon={Icon}
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={resolvedMenuId}
        rounding={toggleRounding}
        shadow={toggleShadow}
        variant={variant}
        theme={theme}
        state={state}
        onClick={toggleDropdown}
        title={title}
        data-testid={`${testId}-trigger`}
        {...triggerProps}
      />

      {open && (
        <div
          {...menuProps}
          id={resolvedMenuId}
          ref={menuRef}
          aria-label={
            menuAriaLabelledBy ? undefined : (menuAriaLabel ?? ariaLabel)
          }
          aria-labelledby={menuAriaLabelledBy}
          aria-describedby={menuAriaDescribedBy}
          className={menuClassNames}
          data-dropdown-panel="true"
          data-dropdown-panel-path={ROOT_PANEL_PATH}
          data-overflow-left={rootPanelAttributes["data-overflow-left"]}
          data-overflow-right={rootPanelAttributes["data-overflow-right"]}
          data-testid={`${testId}-menu`}
          style={{
            ...rootPanelAttributes.style,
            ...menuProps?.style,
          }}
        >
          {renderMenuItems(items)}
        </div>
      )}
    </div>
  );
};

BaseDropdown.displayName = "BaseDropdown";
export default BaseDropdown;
