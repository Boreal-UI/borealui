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
import MenuIcon from "../../Icons/MenuIcon";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const ROOT_PANEL_PATH = "root";
const VIEWPORT_MARGIN = 8;

type PanelPlacement = "left" | "right";
type PanelStyle = React.CSSProperties & Record<string, string>;
type PanelLayout = {
  placement?: PanelPlacement;
  overflowLeft?: boolean;
  overflowRight?: boolean;
  style: PanelStyle;
};

const getItemPath = (parentPath: string, index: number) =>
  parentPath ? `${parentPath}.${index}` : `${index}`;

const getParentPath = (path: string) => {
  const segments = path.split(".");

  if (segments.length <= 1) return null;

  return segments.slice(0, -1).join(".");
};

const isPathOpen = (openSubmenuPath: string | null, path: string) => {
  return (
    openSubmenuPath === path || openSubmenuPath?.startsWith(`${path}.`) === true
  );
};

const hasSubmenuItems = (item: DropdownItem) =>
  Array.isArray(item.items) && item.items.length > 0;

const isDisabledElement = (element: HTMLElement) => {
  return (
    element.getAttribute("aria-disabled") === "true" ||
    (element instanceof HTMLButtonElement && element.disabled)
  );
};

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  triggerIcon,
  items,
  align = "right",
  className,
  menuClassName,
  "aria-label": ariaLabel = "Dropdown menu",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  menuAriaLabel,
  menuAriaLabelledby,
  menuAriaDescribedby,
  menuId: menuIdProp,
  triggerId,
  focusFirstItemOnOpen = true,
  closeOnSelect = true,
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  toggleRounding = getDefaultRounding(),
  menuRounding = getDefaultRounding(),
  toggleShadow,
  menuShadow,
  toggleOutline = false,
  state,
  title,
  triggerProps,
  menuProps,
  "data-testid": dataTestId,
  testId = dataTestId ?? "dropdown",
  IconButton,
  classMap,
  ...rest
}: BaseDropdownProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [openSubmenuPath, setOpenSubmenuPath] = useState<string | null>(null);
  const [panelLayouts, setPanelLayouts] = useState<
    Record<string, PanelLayout>
  >({});

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

  const updatePanelLayouts = useCallback((includeRootPanel = true) => {
    if (!open || !menuRef.current) {
      setPanelLayouts({});
      return;
    }

    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;
    const maxHeight = `${Math.max(120, viewportHeight - VIEWPORT_MARGIN * 2)}px`;
    const maxWidth = `${Math.max(160, viewportWidth - VIEWPORT_MARGIN * 2)}px`;
    const panels = [
      menuRef.current,
      ...Array.from(
        menuRef.current.querySelectorAll<HTMLElement>("[data-dropdown-panel]"),
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
          nextLayouts[path] = {
            overflowLeft: rect.left < VIEWPORT_MARGIN,
            overflowRight: rect.right > viewportWidth - VIEWPORT_MARGIN,
            style,
          };
          return;
        }

        const wrapper = panel.closest<HTMLElement>(
          '[data-dropdown-item-wrapper="true"]',
        );
        const wrapperRect = wrapper?.getBoundingClientRect();
        const panelWidth = Math.max(rect.width, panel.offsetWidth, 160);
        const rightSpace = wrapperRect
          ? viewportWidth - wrapperRect.right - VIEWPORT_MARGIN
          : viewportWidth - rect.right - VIEWPORT_MARGIN;
        const leftSpace = wrapperRect
          ? wrapperRect.left - VIEWPORT_MARGIN
          : rect.left - VIEWPORT_MARGIN;
        const placement: PanelPlacement =
          rightSpace >= panelWidth || rightSpace >= leftSpace ? "right" : "left";
        let offsetY = 0;

        if (rect.bottom > viewportHeight - VIEWPORT_MARGIN) {
          offsetY -= rect.bottom - (viewportHeight - VIEWPORT_MARGIN);
        }

        if (rect.top + offsetY < VIEWPORT_MARGIN) {
          offsetY += VIEWPORT_MARGIN - (rect.top + offsetY);
        }

        style["--dropdown-panel-offset-y"] = `${Math.round(offsetY)}px`;

        nextLayouts[path] = {
          placement,
          style,
        };
      });

      return nextLayouts;
    });
  }, [open]);

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

    const handleViewportChange = (event?: Event) => {
      const target = event?.target;

      if (
        event?.type === "scroll" &&
        target instanceof Node &&
        menuRef.current?.contains(target)
      ) {
        return;
      }

      updatePanelLayouts(true);
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, updatePanelLayouts]);

  useEffect(() => {
    if (!open) return;

    if (!focusFirstItemOnOpen) return;

    focusFirstItemInPanel(menuRef.current);
  }, [focusFirstItemInPanel, focusFirstItemOnOpen, open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!open) return;

      const activeElement =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const currentPanel =
        (activeElement?.closest("[data-dropdown-panel]") as HTMLElement | null) ??
        menuRef.current;

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

      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusItemInPanel(currentPanel, currentIndex + 1);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        focusItemInPanel(
          currentPanel,
          currentIndex < 0 ? enabledItems.length - 1 : currentIndex - 1,
        );
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        focusItemInPanel(currentPanel, 0);
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        focusItemInPanel(currentPanel, enabledItems.length - 1);
        return;
      }

      if (e.key === "ArrowRight") {
        const submenuPath = activeElement?.dataset.dropdownItemPath;
        const submenuId = activeElement?.getAttribute("aria-controls");

        if (
          activeElement?.dataset.dropdownHasSubmenu === "true" &&
          submenuPath &&
          submenuId
        ) {
          e.preventDefault();
          openSubmenu(submenuPath);
          focusSubmenuPanel(submenuId);
        }

        return;
      }

      if (e.key === "ArrowLeft") {
        const panelPath = currentPanel?.dataset.dropdownPanelPath;

        if (panelPath && panelPath !== ROOT_PANEL_PATH) {
          e.preventDefault();
          const parentPath = getParentPath(panelPath);
          setOpenSubmenuPath(parentPath);

          const parentTrigger = dropdownRef.current?.querySelector<HTMLElement>(
            `[data-dropdown-item-path="${panelPath}"][data-dropdown-menu-item="true"]`,
          );
          parentTrigger?.focus();
        }

        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        const activeItem =
          activeElement?.dataset.dropdownMenuItem === "true"
            ? activeElement
            : null;

        if (!activeItem || isDisabledElement(activeItem)) return;

        e.preventDefault();

        if (activeItem.dataset.dropdownHasSubmenu === "true") {
          const submenuPath = activeItem.dataset.dropdownItemPath;
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
        align === "right" ? classMap.alignRight : classMap.alignLeft,
        classMap[theme],
        state && classMap[state],
        glass && classMap.glass,
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
      glass,
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
      glass && classMap.glass,
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
        event: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>,
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
          ) : item.href ? (
            <a
              href={item.disabled ? undefined : item.href}
              target={item.disabled ? undefined : item.target}
              rel={
                item.rel ??
                (item.target === "_blank" ? "noopener noreferrer" : undefined)
              }
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
                itemTestId ? `${itemTestId}-submenu` : `${testId}-${itemPath}-submenu`
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
      role="presentation"
      onKeyDown={handleKeyDown}
      data-testid={testId}
      {...rest}
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
        outline={toggleOutline}
        glass={glass}
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
            menuAriaLabelledby ? undefined : (menuAriaLabel ?? ariaLabel)
          }
          aria-labelledby={menuAriaLabelledby}
          aria-describedby={menuAriaDescribedby}
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
