import React, {
  KeyboardEvent,
  MouseEvent,
  JSX,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BaseMenuProps, MenuItem, MenuPosition } from "./Menu.types";
import { combineClassNames } from "../../utils/classNames";
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
  ROOT_MENU_PANEL_PATH as ROOT_PANEL_PATH,
} from "../../utils/menuNavigation";
import { useAnimationFrameCallback } from "../../hooks/useAnimationFrameCallback";

const STACKED_MENU_QUERY = "(max-width: 479.98px)";

type PanelStyle = React.CSSProperties & Record<string, string>;
type PanelLayout = {
  placement?: "left" | "right";
  style: PanelStyle;
};

const hasSubmenuItems = (item: MenuItem) =>
  Array.isArray(item.items) && item.items.length > 0;

const isStackedMenuViewport = () =>
  window.innerWidth <= 479.98 ||
  (typeof window.matchMedia === "function" &&
    window.matchMedia(STACKED_MENU_QUERY).matches);

const BaseMenu: React.FC<BaseMenuProps> = ({
  items,
  children,
  trigger,
  open,
  defaultOpen = false,
  position,
  activation = trigger ? "click" : "contextmenu",
  onOpenChange,
  onPositionChange,
  closeOnSelect = true,
  focusFirstItemOnOpen = true,
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
  rounding = getDefaultRounding(),
  shadow,
  state,
  className,
  targetClassName,
  triggerClassName,
  menuClassName,
  itemClassName,
  id,
  menuId,
  "aria-label": ariaLabel = "Context menu",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "menu",
  triggerProps,
  menuProps,
  onKeyDown,
  classMap,
  ...rest
}: BaseMenuProps): JSX.Element => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [internalPosition, setInternalPosition] = useState<MenuPosition>(
    position ?? { x: 0, y: 0 },
  );
  const [openSubmenuPath, setOpenSubmenuPath] = useState<string | null>(null);
  const [panelLayouts, setPanelLayouts] = useState<Record<string, PanelLayout>>(
    {},
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();

  const isControlled = open !== undefined;
  const isOpen = open ?? uncontrolledOpen;
  const resolvedMenuId = menuId ?? `${generatedId}-menu`;
  const resolvedPosition = position ?? internalPosition;
  const hasCustomTriggerContent = React.isValidElement(trigger);

  const setOpenState = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      if (!nextOpen) {
        setOpenSubmenuPath(null);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const setMenuPosition = useCallback(
    (nextPosition: MenuPosition) => {
      if (!position) {
        setInternalPosition(nextPosition);
      }

      onPositionChange?.(nextPosition);
    },
    [onPositionChange, position],
  );

  const openAt = useCallback(
    (nextPosition: MenuPosition) => {
      setMenuPosition(nextPosition);
      setOpenState(true);
    },
    [setMenuPosition, setOpenState],
  );

  const closeMenu = useCallback(() => {
    setOpenState(false);
    triggerRef.current?.focus();
  }, [setOpenState]);

  const getEnabledItemsInPanel = useCallback((panel?: HTMLElement | null) => {
    if (!panel) return [];

    return Array.from(
      panel.querySelectorAll<HTMLElement>('[data-menu-item="true"]'),
    ).filter((element) => {
      const ownerPanel = element.closest("[data-menu-panel]");
      return ownerPanel === panel && !isDisabledElement(element);
    });
  }, []);

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

  const focusFirstItemInPanel = useCallback(
    (panel?: HTMLElement | null) => {
      getEnabledItemsInPanel(panel)[0]?.focus();
    },
    [getEnabledItemsInPanel],
  );

  const updatePanelLayouts = useCallback(() => {
    if (!isOpen || !menuRef.current) {
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
        menuRef.current.querySelectorAll<HTMLElement>("[data-menu-panel]"),
      ),
    ];
    const nextLayouts: Record<string, PanelLayout> = {};

    panels.forEach((panel) => {
      const path = panel.dataset.menuPanelPath ?? ROOT_PANEL_PATH;
      const rect = panel.getBoundingClientRect();
      const style: PanelStyle = {
        "--menu-panel-max-height": maxHeight,
        "--menu-panel-max-width": maxWidth,
      };

      if (path === ROOT_PANEL_PATH) {
        const left = Math.min(
          Math.max(VIEWPORT_MARGIN, resolvedPosition.x),
          Math.max(
            VIEWPORT_MARGIN,
            viewportWidth - rect.width - VIEWPORT_MARGIN,
          ),
        );
        const top = Math.min(
          Math.max(VIEWPORT_MARGIN, resolvedPosition.y),
          Math.max(
            VIEWPORT_MARGIN,
            viewportHeight - rect.height - VIEWPORT_MARGIN,
          ),
        );

        style.left = `${Math.round(left)}px`;
        style.top = `${Math.round(top)}px`;
        nextLayouts[path] = { style };
        return;
      }

      const wrapper = panel.closest<HTMLElement>(
        '[data-menu-item-wrapper="true"]',
      );
      const wrapperRect = wrapper?.getBoundingClientRect();
      const panelWidth = Math.max(rect.width, panel.offsetWidth, 160);
      const rightSpace = wrapperRect
        ? viewportWidth - wrapperRect.right - VIEWPORT_MARGIN
        : viewportWidth - rect.right - VIEWPORT_MARGIN;
      const leftSpace = wrapperRect
        ? wrapperRect.left - VIEWPORT_MARGIN
        : rect.left - VIEWPORT_MARGIN;
      const placement =
        rightSpace >= panelWidth || rightSpace >= leftSpace ? "right" : "left";
      let offsetY = 0;

      if (rect.bottom > viewportHeight - VIEWPORT_MARGIN) {
        offsetY -= rect.bottom - (viewportHeight - VIEWPORT_MARGIN);
      }

      if (rect.top + offsetY < VIEWPORT_MARGIN) {
        offsetY += VIEWPORT_MARGIN - (rect.top + offsetY);
      }

      style["--menu-panel-offset-y"] = `${Math.round(offsetY)}px`;
      nextLayouts[path] = { placement, style };
    });

    setPanelLayouts(nextLayouts);
  }, [isOpen, resolvedPosition.x, resolvedPosition.y]);
  const schedulePanelLayoutUpdate =
    useAnimationFrameCallback(updatePanelLayouts);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePanelLayouts();
  }, [isOpen, items, openSubmenuPath, updatePanelLayouts]);

  useLayoutEffect(() => {
    if (
      !isOpen ||
      !openSubmenuPath ||
      !menuRef.current ||
      !isStackedMenuViewport()
    ) {
      return;
    }

    const scrollOpenedSubmenuIntoView = () => {
      const openedSubmenu = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>("[data-menu-panel]") ??
          [],
      ).find((panel) => panel.dataset.menuPanelPath === openSubmenuPath);

      openedSubmenu?.scrollIntoView?.({ block: "nearest" });
    };

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(scrollOpenedSubmenuIntoView);
    } else {
      window.setTimeout(scrollOpenedSubmenuIntoView);
    }
  }, [isOpen, openSubmenuPath]);

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener("resize", schedulePanelLayoutUpdate);
    window.addEventListener("scroll", schedulePanelLayoutUpdate, true);

    return () => {
      window.removeEventListener("resize", schedulePanelLayoutUpdate);
      window.removeEventListener("scroll", schedulePanelLayoutUpdate, true);
    };
  }, [isOpen, schedulePanelLayoutUpdate]);

  useEffect(() => {
    if (!isOpen || !focusFirstItemOnOpen) return;
    focusFirstItemInPanel(menuRef.current);
  }, [focusFirstItemOnOpen, focusFirstItemInPanel, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (event: globalThis.MouseEvent) => {
      if (wrapperRef.current?.contains(event.target as Node)) return;
      closeMenu();
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [closeMenu, isOpen]);

  const menuClassNames = useMemo(
    () =>
      combineClassNames(
        classMap.menu,
        classMap[theme],
        state && classMap[state],
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        menuClassName,
        menuProps?.className,
      ),
    [
      classMap,
      variant,
      menuClassName,
      menuProps?.className,
      rounding,
      shadow,
      state,
      theme,
    ],
  );

  const submenuClassNames = (isSubmenuOpen: boolean) =>
    combineClassNames(
      classMap.menu,
      classMap.submenu,
      isSubmenuOpen && classMap.submenuOpen,
      classMap[theme],
      state && classMap[state],
      (variant === "glass" || variant === "glassOutline") && classMap.glass,
      getShadowClassName(classMap, theme, shadow),
      rounding && classMap[`round${capitalize(rounding)}`],
    );

  const rootPanelAttributes = panelLayouts[ROOT_PANEL_PATH];

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    rest.onContextMenu?.(event);

    if (
      event.defaultPrevented ||
      !["contextmenu", "both"].includes(activation)
    ) {
      return;
    }

    event.preventDefault();
    openAt({ x: event.clientX, y: event.clientY });
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    rest.onClick?.(event);

    if (event.defaultPrevented || !["click", "both"].includes(activation)) {
      return;
    }

    const eventTarget = event.target as Node;
    if (
      menuRef.current?.contains(eventTarget) ||
      triggerRef.current?.contains(eventTarget)
    ) {
      return;
    }

    const rect = targetRef.current?.getBoundingClientRect();
    openAt({
      x: rect?.left ?? event.clientX,
      y: rect?.bottom ?? event.clientY,
    });
  };

  const handleTriggerClick = (event: MouseEvent<HTMLElement>) => {
    triggerProps?.onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;

    event.stopPropagation();
    const rect = triggerRef.current?.getBoundingClientRect();
    openAt({
      x: rect?.left ?? event.clientX,
      y: rect?.bottom ?? event.clientY,
    });
  };

  const setTriggerNode = useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;

      if (!hasCustomTriggerContent) return;

      const triggerElement = trigger as React.ReactElement<{
        ref?: React.Ref<HTMLElement>;
      }>;
      const triggerElementRef = triggerElement.props.ref;

      if (typeof triggerElementRef === "function") {
        triggerElementRef(node);
      } else if (triggerElementRef && "current" in triggerElementRef) {
        (
          triggerElementRef as React.MutableRefObject<HTMLElement | null>
        ).current = node;
      }
    },
    [hasCustomTriggerContent, trigger],
  );

  const renderTrigger = () => {
    if (!trigger) return null;

    if (hasCustomTriggerContent) {
      const triggerElement = trigger as React.ReactElement<
        {
          className?: string;
          onClick?: (event: MouseEvent<HTMLElement>) => void;
          ref?: React.Ref<HTMLElement>;
        } & Record<string, unknown>
      >;

      return React.cloneElement(triggerElement, {
        ref: setTriggerNode,
        className: combineClassNames(
          triggerElement.props.className,
          triggerClassName,
          triggerProps?.className,
        ),
        "aria-haspopup": "menu",
        "aria-expanded": isOpen,
        "aria-controls": resolvedMenuId,
        "data-testid": `${testId}-trigger`,
        onClick: (event: MouseEvent<HTMLElement>) => {
          triggerElement.props.onClick?.(event);
          if (event.defaultPrevented) return;

          handleTriggerClick(event);
        },
      });
    }

    return (
      <button
        {...triggerProps}
        ref={setTriggerNode}
        type={triggerProps?.type ?? "button"}
        className={combineClassNames(
          classMap.trigger,
          classMap.triggerPlain,
          triggerClassName,
          triggerProps?.className,
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={resolvedMenuId}
        data-testid={`${testId}-trigger`}
        onClick={(event) => handleTriggerClick(event)}
      >
        {trigger}
      </button>
    );
  };

  const handleItemSelect = (
    event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    item: MenuItem,
  ) => {
    event.stopPropagation();

    if (item.disabled || hasSubmenuItems(item)) return;

    item.onSelect?.(event);
    item.onClick?.();

    if (!event.defaultPrevented && closeOnSelect) {
      closeMenu();
    }
  };

  const focusSubmenuPanel = (submenuId: string) => {
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
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (
      !isOpen &&
      (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10"))
    ) {
      event.preventDefault();
      const rect = targetRef.current?.getBoundingClientRect();
      openAt({
        x: rect?.left ?? VIEWPORT_MARGIN,
        y: rect?.bottom ?? VIEWPORT_MARGIN,
      });
      return;
    }

    if (!isOpen) return;

    const activeElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const currentPanel =
      (activeElement?.closest("[data-menu-panel]") as HTMLElement | null) ??
      menuRef.current;
    const enabledItems = getEnabledItemsInPanel(currentPanel);
    const currentIndex = activeElement
      ? enabledItems.indexOf(activeElement)
      : -1;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItemInPanel(currentPanel, currentIndex + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItemInPanel(
        currentPanel,
        currentIndex < 0 ? enabledItems.length - 1 : currentIndex - 1,
      );
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusItemInPanel(currentPanel, 0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusItemInPanel(currentPanel, enabledItems.length - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      const submenuPath = activeElement?.dataset.menuItemPath;
      const submenuId = activeElement?.getAttribute("aria-controls");

      if (
        activeElement?.dataset.menuHasSubmenu === "true" &&
        submenuPath &&
        submenuId
      ) {
        event.preventDefault();
        setOpenSubmenuPath(submenuPath);
        focusSubmenuPanel(submenuId);
      }

      return;
    }

    if (event.key === "ArrowLeft") {
      const panelPath = currentPanel?.dataset.menuPanelPath;
      if (panelPath && panelPath !== ROOT_PANEL_PATH) {
        event.preventDefault();
        const parentPath = getParentPath(panelPath);
        setOpenSubmenuPath(parentPath);
        const parentTrigger = wrapperRef.current?.querySelector<HTMLElement>(
          `[data-menu-item-path="${panelPath}"][data-menu-item="true"]`,
        );
        parentTrigger?.focus();
      }
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      const activeItem =
        activeElement?.dataset.menuItem === "true" ? activeElement : null;
      if (!activeItem || isDisabledElement(activeItem)) return;

      event.preventDefault();
      activeItem.click();
    }
  };

  const renderItemContent = (item: MenuItem, hasSubmenu: boolean) => (
    <>
      <span className={classMap.itemContent}>
        {item.icon && (
          <span className={classMap.icon} aria-hidden="true">
            {item.icon}
          </span>
        )}
        {item.label && <span className={classMap.label}>{item.label}</span>}
      </span>
      {item.shortcut && (
        <span className={classMap.shortcut} aria-hidden="true">
          {item.shortcut}
        </span>
      )}
      {hasSubmenu && (
        <span className={classMap.submenuIndicator} aria-hidden="true">
          {">"}
        </span>
      )}
    </>
  );

  const renderMenuItems = (
    menuItems: MenuItem[],
    parentPath = "",
  ): React.ReactNode =>
    menuItems.map((item, index) => {
      const itemPath = getItemPath(parentPath, index);
      const itemType = item.type ?? "item";
      const itemTestId = item["data-testid"] ?? item.testId;

      if (itemType === "separator") {
        return (
          <div
            key={item.id ?? itemPath}
            role="separator"
            className={classMap.separator}
            data-testid={itemTestId ?? `${testId}-${itemPath}-separator`}
          />
        );
      }

      if (itemType === "label") {
        return (
          <div
            key={item.id ?? itemPath}
            role="none"
            className={combineClassNames(classMap.sectionLabel, item.className)}
            data-testid={itemTestId ?? `${testId}-${itemPath}-label`}
          >
            {item.label}
          </div>
        );
      }

      const hasSubmenu = hasSubmenuItems(item);
      const submenuOpen = hasSubmenu && isPathOpen(openSubmenuPath, itemPath);
      const submenuId =
        item.submenuId ?? `${resolvedMenuId}-${itemPath}-submenu`;
      const role = item.role ?? "menuitem";
      const openSubmenu = (preserveDescendant = true) => {
        if (hasSubmenu && !item.disabled) {
          setOpenSubmenuPath((currentPath) =>
            preserveDescendant &&
            currentPath &&
            isPathOpen(currentPath, itemPath)
              ? currentPath
              : itemPath,
          );
        }
      };
      const openDirectSubmenu = () => openSubmenu(false);
      const closeChildSubmenus = () => {
        if (isStackedMenuViewport()) return;
        if (hasSubmenu) return;

        setOpenSubmenuPath((currentPath) => {
          if (!currentPath) return currentPath;
          if (!parentPath) return null;

          return isPathOpen(currentPath, parentPath) ? parentPath : currentPath;
        });
      };
      const handleDirectItemHover = () => {
        if (isStackedMenuViewport()) return;

        if (hasSubmenu) {
          openSubmenu();
          return;
        }

        closeChildSubmenus();
      };
      const handleSubmenuTriggerEnter = () => {
        if (isStackedMenuViewport()) return;
        openSubmenu();
      };
      const handleSubmenuTriggerOver = () => {
        if (isStackedMenuViewport()) return;
        openDirectSubmenu();
      };
      const handleSubmenuWrapperOver = (
        event:
          | React.MouseEvent<HTMLDivElement>
          | React.PointerEvent<HTMLDivElement>,
      ) => {
        if (isStackedMenuViewport()) return;

        const target = event.target as HTMLElement;
        const currentPanel = event.currentTarget.closest("[data-menu-panel]");
        const targetPanel = target.closest("[data-menu-panel]");
        const targetWrapper = target.closest('[data-menu-item-wrapper="true"]');

        if (targetPanel && targetPanel !== currentPanel) return;
        if (targetWrapper !== event.currentTarget) return;

        if (hasSubmenu) {
          openDirectSubmenu();
        } else {
          closeChildSubmenus();
        }
      };
      const commonProps = {
        id: item.id,
        className: combineClassNames(
          classMap.item,
          item.destructive && classMap.destructive,
          item.inset && classMap.inset,
          hasSubmenu && classMap.submenuTrigger,
          item.disabled && classMap.disabled,
          itemClassName,
          item.className,
        ),
        role,
        title: item.title,
        "aria-label": item["aria-label"],
        "aria-describedby": item["aria-describedby"],
        "aria-current": item["aria-current"],
        "aria-disabled": item.disabled || undefined,
        "aria-checked":
          role === "menuitemcheckbox" || role === "menuitemradio"
            ? item.checked
            : undefined,
        "aria-haspopup": hasSubmenu ? ("menu" as const) : undefined,
        "aria-expanded": hasSubmenu ? submenuOpen : undefined,
        "aria-controls": hasSubmenu ? submenuId : undefined,
        "data-menu-item": "true",
        "data-menu-item-path": itemPath,
        "data-menu-has-submenu": hasSubmenu ? "true" : undefined,
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
          data-menu-item-wrapper="true"
          data-menu-item-path={itemPath}
          onPointerEnter={handleDirectItemHover}
          onPointerOver={handleSubmenuWrapperOver}
          onMouseEnter={handleDirectItemHover}
          onMouseOver={handleSubmenuWrapperOver}
          onFocus={handleDirectItemHover}
        >
          {hasSubmenu ? (
            <button
              type="button"
              disabled={item.disabled}
              {...commonProps}
              onPointerEnter={handleSubmenuTriggerEnter}
              onPointerOver={handleSubmenuTriggerOver}
              onMouseEnter={handleSubmenuTriggerEnter}
              onMouseOver={handleSubmenuTriggerOver}
              onFocus={handleSubmenuTriggerEnter}
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
              onClick={(event) => {
                event.stopPropagation();
                if (item.disabled) {
                  event.preventDefault();
                  return;
                }
                handleItemSelect(event, item);
              }}
            >
              {renderItemContent(item, false)}
            </a>
          ) : (
            <button
              type="button"
              disabled={item.disabled}
              {...commonProps}
              onClick={(event) => handleItemSelect(event, item)}
            >
              {renderItemContent(item, false)}
            </button>
          )}

          {hasSubmenu && submenuOpen && (
            <div
              id={submenuId}
              role="menu"
              aria-label={
                item.submenuAriaLabel ??
                (typeof item.label === "string" ? item.label : undefined)
              }
              className={submenuClassNames(submenuOpen)}
              data-menu-panel="true"
              data-menu-panel-path={itemPath}
              data-placement={panelLayouts[itemPath]?.placement}
              data-testid={
                itemTestId
                  ? `${itemTestId}-submenu`
                  : `${testId}-${itemPath}-submenu`
              }
              style={panelLayouts[itemPath]?.style}
            >
              {renderMenuItems(item.items ?? [], itemPath)}
            </div>
          )}
        </div>
      );
    });

  return (
    <div
      {...rest}
      id={id}
      ref={wrapperRef}
      className={combineClassNames(classMap.wrapper, className)}
      role="presentation"
      data-testid={testId}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {renderTrigger()}

      {children && (
        <div
          ref={targetRef}
          className={combineClassNames(classMap.target, targetClassName)}
          role={activation === "manual" ? undefined : "button"}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={activation === "manual" ? undefined : 0}
          data-testid={`${testId}-target`}
        >
          {children}
        </div>
      )}

      {isOpen && (
        <div
          {...menuProps}
          id={resolvedMenuId}
          ref={menuRef}
          role="menu"
          aria-label={ariaLabelledBy ? undefined : ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          className={menuClassNames}
          data-menu-panel="true"
          data-menu-panel-path={ROOT_PANEL_PATH}
          data-testid={`${testId}-menu`}
          style={{
            ...rootPanelAttributes?.style,
            ...menuProps?.style,
          }}
        >
          {renderMenuItems(items)}
        </div>
      )}
    </div>
  );
};

BaseMenu.displayName = "BaseMenu";
export default BaseMenu;
