import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
  useId,
  JSX,
  useMemo,
} from "react";
import { BaseDropdownProps, IconButtonLikeRef } from "./Dropdown.types";
import { combineClassNames } from "../../utils/classNames";
import MenuIcon from "../../Icons/MenuIcon";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const BaseDropdown: React.FC<BaseDropdownProps> = ({
  triggerIcon,
  items,
  align = "right",
  className = "",
  menuClassName = "",
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
  toggleShadow = getDefaultShadow(),
  menuShadow = getDefaultShadow(),
  toggleOutline = false,
  state = "",
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
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<IconButtonLikeRef | null>(null);

  const generatedMenuId = useId();
  const resolvedMenuId = menuIdProp ?? generatedMenuId;

  const Icon = triggerIcon ?? MenuIcon;

  const getEnabledItemIndexes = useCallback(() => {
    return items.reduce<number[]>((acc, item, index) => {
      if (!item.disabled) {
        acc.push(index);
      }
      return acc;
    }, []);
  }, [items]);

  const focusItemAtIndex = useCallback((index: number) => {
    const menuItems =
      menuRef.current?.querySelectorAll<HTMLElement>("a, button");

    const target = menuItems?.[index];

    if (target instanceof HTMLButtonElement && target.disabled) {
      return;
    }

    target?.focus();
  }, []);

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    triggerRef.current?.focus?.();
  }, []);

  const handleItemSelect = useCallback(
    (item: BaseDropdownProps["items"][number]) => {
      if (item.disabled) return;

      item.onClick?.();

      if (closeOnSelect) {
        closeDropdown();
      }
    },
    [closeDropdown, closeOnSelect],
  );

  useEffect(() => {
    if (!open) return;

    const enabledIndexes = getEnabledItemIndexes();

    if (!focusFirstItemOnOpen || enabledIndexes.length === 0) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex(enabledIndexes[0] ?? -1);
  }, [open, focusFirstItemOnOpen, getEnabledItemIndexes]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    focusItemAtIndex(activeIndex);
  }, [activeIndex, open, focusItemAtIndex]);

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

    if (open && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const right = rect.right > window.innerWidth;
      const left = rect.left < 0;

      if (right) {
        menuRef.current.setAttribute("data-overflow-right", "true");
        menuRef.current.removeAttribute("data-overflow-left");
      } else if (left) {
        menuRef.current.setAttribute("data-overflow-left", "true");
        menuRef.current.removeAttribute("data-overflow-right");
      } else {
        menuRef.current.removeAttribute("data-overflow-right");
        menuRef.current.removeAttribute("data-overflow-left");
      }
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, closeDropdown]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!open) return;

      const enabledIndexes = getEnabledItemIndexes();
      const hasItems = enabledIndexes.length > 0;

      if (e.key === "Escape") {
        e.preventDefault();
        closeDropdown();
        return;
      }

      if (e.key === "Tab") {
        closeDropdown();
        return;
      }

      if (!hasItems) return;

      const currentEnabledPosition = enabledIndexes.indexOf(activeIndex);

      if (e.key === "ArrowDown") {
        e.preventDefault();

        if (currentEnabledPosition < 0) {
          setActiveIndex(enabledIndexes[0] ?? -1);
        } else {
          const nextPosition =
            (currentEnabledPosition + 1) % enabledIndexes.length;
          setActiveIndex(enabledIndexes[nextPosition] ?? -1);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();

        if (currentEnabledPosition < 0) {
          setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
        } else {
          const prevPosition =
            (currentEnabledPosition - 1 + enabledIndexes.length) %
            enabledIndexes.length;
          setActiveIndex(enabledIndexes[prevPosition] ?? -1);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(enabledIndexes[0] ?? -1);
      } else if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
      } else if ((e.key === "Enter" || e.key === " ") && activeIndex >= 0) {
        e.preventDefault();
        const item = items[activeIndex];
        if (item && !item.disabled) {
          handleItemSelect(item);
        }
      }
    },
    [
      open,
      items,
      activeIndex,
      getEnabledItemIndexes,
      closeDropdown,
      handleItemSelect,
    ],
  );

  const menuClassNames = useMemo(
    () =>
      combineClassNames(
        classMap.menu,
        align === "right" ? classMap.alignRight : classMap.alignLeft,
        classMap[theme],
        classMap[state],
        glass && classMap.glass,
        menuShadow && classMap[`shadow${capitalize(menuShadow)}`],
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

  return (
    <div
      ref={dropdownRef}
      className={combineClassNames(classMap.wrapper, className)}
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
          id={resolvedMenuId}
          ref={menuRef}
          aria-label={
            menuAriaLabelledby ? undefined : (menuAriaLabel ?? ariaLabel)
          }
          aria-labelledby={menuAriaLabelledby}
          aria-describedby={menuAriaDescribedby}
          className={menuClassNames}
          data-testid={`${testId}-menu`}
          {...menuProps}
        >
          {items.map((item, index) => {
            const commonProps = {
              id: item.id,
              className: combineClassNames(
                classMap.item,
                item.disabled ? classMap.disabled : "",
              ),
              "aria-label": item["aria-label"],
              "aria-describedby": item["aria-describedby"],
              "aria-current": item["aria-current"],
              "aria-disabled": item.disabled || undefined,
              title: item.title,
              "data-testid": item["data-testid"],
              onClick: () => handleItemSelect(item),
            };

            if (item.href) {
              const target = item.disabled ? undefined : item.target;
              const rel =
                item.rel ??
                (target === "_blank" ? "noopener noreferrer" : undefined);

              return (
                <a
                  key={item.id ?? index}
                  href={item.disabled ? undefined : item.href}
                  target={target}
                  rel={rel}
                  {...commonProps}
                  onClick={(e) => {
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
                  {item.icon && (
                    <span className={classMap.icon} aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </a>
              );
            }

            return (
              <button
                key={item.id ?? index}
                type="button"
                disabled={item.disabled}
                {...commonProps}
              >
                {item.icon && (
                  <span className={classMap.icon} aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

BaseDropdown.displayName = "BaseDropdown";
export default BaseDropdown;
