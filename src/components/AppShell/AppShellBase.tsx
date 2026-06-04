import { CSSProperties, forwardRef, useMemo } from "react";
import { AppShellBaseProps } from "./AppShell.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultOutline,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const AppShellBase = forwardRef<HTMLDivElement, AppShellBaseProps>(
  (
    {
      header,
      label,
      sidebar,
      aside,
      footer,
      children,
      sidebarCollapsed = false,
      sidebarWidth = "16rem",
      asideWidth = "18rem",
      stickyHeader = false,
      theme = getDefaultTheme(),
      state,
      outline = getDefaultOutline(),
      glass = getDefaultGlass(),
      rounding = getDefaultRounding(),
      shadow,
      disabled = false,
      loading = false,
      classMap,
      className,
      contentClassName,
      mainClassName,
      srOnlyText,
      srOnlyClassName,
      style,
      "data-testid": dataTestId,
      testId = dataTestId ?? "app-shell",
      ...rest
    },
    ref,
  ) => {
    const rootClass = useMemo(
      () =>
        combineClassNames(
          classMap.root,
          classMap[theme],
          state && classMap[state],
          outline && classMap.outline,
          glass && classMap.glass,
          disabled && classMap.disabled,
          loading && classMap.loading,
          sidebarCollapsed && classMap.sidebarCollapsed,
          stickyHeader && classMap.stickyHeader,
          getShadowClassName(classMap, theme, shadow),
          rounding && classMap[`round${capitalize(rounding)}`],
          className,
        ),
      [
        classMap,
        theme,
        state,
        outline,
        glass,
        disabled,
        loading,
        sidebarCollapsed,
        stickyHeader,
        shadow,
        rounding,
        className,
      ],
    );

    const shellStyle = {
      ...style,
      "--app-shell-sidebar-width": sidebarCollapsed ? "0rem" : sidebarWidth,
      "--app-shell-aside-width": aside ? asideWidth : "0rem",
    } as CSSProperties;

    return (
      <div
        ref={ref}
        className={rootClass}
        style={shellStyle}
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
        {header || label ? (
          <header className={classMap.header} data-testid={`${testId}-header`}>
            {header ?? label}
          </header>
        ) : null}
        <div className={classMap.body} data-testid={`${testId}-body`}>
          {sidebar ? (
            <aside
              className={classMap.sidebar}
              aria-hidden={sidebarCollapsed || undefined}
              data-testid={`${testId}-sidebar`}
            >
              {sidebar}
            </aside>
          ) : null}
          <main
            className={combineClassNames(
              classMap.main,
              mainClassName,
              contentClassName,
            )}
            data-testid={`${testId}-main`}
          >
            {children}
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
          </main>
          {aside ? (
            <aside className={classMap.aside} data-testid={`${testId}-aside`}>
              {aside}
            </aside>
          ) : null}
        </div>
        {footer ? (
          <footer className={classMap.footer} data-testid={`${testId}-footer`}>
            {footer}
          </footer>
        ) : null}
      </div>
    );
  },
);

AppShellBase.displayName = "AppShellBase";
export default AppShellBase;
