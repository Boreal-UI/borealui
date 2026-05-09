import React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "../../Icons";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultSize,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { BasePagerProps } from "./Pager.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";

const BasePager: React.FC<BasePagerProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  serverControlled = false,
  onPageChange,
  className = "",
  size = getDefaultSize(),
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  state = "",
  "aria-label": ariaLabel = "Pagination",
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  "page-list-aria-label": pageListAriaLabel = "Page list",
  "previous-button-aria-label": previousButtonAriaLabel = "Go to previous page",
  "next-button-aria-label": nextButtonAriaLabel = "Go to next page",
  getPageAriaLabel = (pageNumber, isActive) =>
    isActive ? `Current page, page ${pageNumber}` : `Go to page ${pageNumber}`,
  getLiveRegionMessage = (activePage, totalPages) =>
    `Page ${activePage} of ${totalPages}`,
  liveRegionAriaLive = "polite",
  "data-testid": dataTestId,
  testId = dataTestId ?? "pager",
  Button,
  IconButton,
  classMap,
}) => {
  const perPage = Math.max(1, itemsPerPage || 1);
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const page = Math.min(Math.max(1, currentPage || 1), totalPages);

  const pages = serverControlled
    ? []
    : Array.from({ length: totalPages }, (_, i) => i + 1);

  const goTo = (p: number) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    if (clamped !== page) onPageChange(clamped);
  };

  const wrapperClass = combineClassNames(
    classMap.wrapper,
    classMap[theme],
    state && classMap[state],
    className,
  );

  const buttonBaseClass = combineClassNames(
    classMap.button,
    shadow && classMap[`shadow${capitalize(shadow)}`],
    rounding && classMap[`round${capitalize(rounding)}`],
  );

  const liveRegionId = `${testId}-status`;

  return (
    <nav
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy ?? liveRegionId}
      className={wrapperClass}
      data-testid={testId}
    >
      <p
        id={liveRegionId}
        className="sr_only"
        aria-live={liveRegionAriaLive}
        aria-atomic="true"
        data-testid={`${testId}-status`}
      >
        {getLiveRegionMessage(page, totalPages)}
      </p>

      <div className={classMap.controls}>
        <IconButton
          icon={ArrowLeftIcon}
          theme={theme}
          state={state}
          glass={glass}
          size={size}
          shadow={shadow}
          rounding={rounding}
          className={classMap.controlButton}
          disabled={page <= 1}
          aria-label={previousButtonAriaLabel}
          title="Previous page"
          onClick={() => goTo(page - 1)}
          aria-controls={pageListAriaLabel ? `${testId}-page-list` : undefined}
          data-testid={`${testId}-prev`}
          type="button"
        />
      </div>

      <ul
        id={`${testId}-page-list`}
        className={classMap.controls}
        aria-label={pageListAriaLabel}
        data-testid={`${testId}-page-list`}
      >
        {serverControlled ? (
          <li
            className={classMap.buttonWrapper}
            data-testid={`${testId}-page-${page}`}
          >
            <Button
              theme={theme}
              state={state}
              glass={glass}
              size={size}
              rounding={rounding}
              shadow={shadow}
              onClick={() => goTo(page)}
              aria-label={getPageAriaLabel(page, true)}
              aria-current="page"
              aria-describedby={liveRegionId}
              disabled
              className={combineClassNames(buttonBaseClass, classMap.active)}
              data-testid={`${testId}-button-${page}`}
              type="button"
            >
              {page}
            </Button>
          </li>
        ) : (
          pages.map((p) => {
            const isActive = p === page;

            return (
              <li
                key={p}
                className={classMap.buttonWrapper}
                data-testid={`${testId}-page-${p}`}
              >
                <Button
                  theme={theme}
                  state={state}
                  glass={glass}
                  size={size}
                  rounding={rounding}
                  shadow={shadow}
                  onClick={() => goTo(p)}
                  aria-label={getPageAriaLabel(p, isActive)}
                  aria-current={isActive ? "page" : undefined}
                  aria-describedby={isActive ? liveRegionId : undefined}
                  disabled={isActive}
                  className={combineClassNames(
                    buttonBaseClass,
                    isActive && classMap.active,
                  )}
                  data-testid={`${testId}-button-${p}`}
                  type="button"
                >
                  {p}
                </Button>
              </li>
            );
          })
        )}
      </ul>

      <div className={classMap.controls}>
        <IconButton
          icon={ArrowRightIcon}
          theme={theme}
          state={state}
          glass={glass}
          rounding={rounding}
          shadow={shadow}
          size={size}
          className={classMap.controlButton}
          disabled={page >= totalPages}
          aria-label={nextButtonAriaLabel}
          title="Next page"
          onClick={() => goTo(page + 1)}
          aria-controls={pageListAriaLabel ? `${testId}-page-list` : undefined}
          data-testid={`${testId}-next`}
          type="button"
        />
      </div>
    </nav>
  );
};

BasePager.displayName = "BasePager";
export default BasePager;
