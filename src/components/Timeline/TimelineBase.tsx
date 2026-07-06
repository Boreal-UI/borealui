import React from "react";
import { TimelineBaseProps } from "./Timeline.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const FallbackSkeleton: TimelineBaseProps["SkeletonComponent"] = ({
  width,
  height,
  className,
  "data-testid": testId,
  "aria-hidden": ariaHidden,
}) => (
  <div
    className={className}
    style={{ width, height }}
    data-testid={testId}
    aria-hidden={ariaHidden}
  />
);

const TimelineBase: React.FC<TimelineBaseProps> = ({
  items,
  orientation = "vertical",
  loading = false,
  "aria-label": ariaLabel = "Timeline",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  role = "list",
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  rounding = getDefaultRounding(),
  shadow,
  classMap,
  SkeletonComponent = FallbackSkeleton,
  className,
  "data-testid": dataTestId,
  testId = dataTestId ?? "timeline",
  ...rest
}) => {
  const outerWrapper = combineClassNames(
    classMap.timeline,
    classMap[orientation],
    classMap[theme],
    glass && classMap.glass,
    loading && classMap.loading,
    className,
  );

  const itemClassName = combineClassNames(
    classMap.item,
    classMap[orientation],
    classMap[theme],
    glass && classMap.glass,
    loading && classMap.loadingItem,
  );

  const markerClassName = combineClassNames(
    classMap.marker,
    classMap[theme],
    classMap[orientation],
    glass && classMap.glass,
    getShadowClassName(classMap, theme, shadow),
  );

  const contentClassName = combineClassNames(
    classMap.content,
    classMap[orientation],
    classMap[theme],
    glass && classMap.glass,
    loading && classMap.loadingContent,
    getShadowClassName(classMap, theme, shadow),
    rounding && classMap[`round${capitalize(rounding)}`],
  );

  const setSize = items.length;

  return (
    <ul
      className={outerWrapper}
      data-testid={testId}
      role={role}
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading || undefined}
      {...rest}
    >
      {items.map((item, index) => {
        const IconComponent = item.icon;
        const itemTestId = `${testId}-item-${index}`;
        const labelId = `${itemTestId}-title`;
        const descriptionId = item.description
          ? `${itemTestId}-description`
          : undefined;
        const dateId = item.date ? `${itemTestId}-date` : undefined;
        const hasTitle = Boolean(item.title);

        let dateTimeAttr: string | undefined;
        if (item.date) {
          const dateObj = new Date(item.date);
          if (!isNaN(dateObj.getTime())) {
            dateTimeAttr = dateObj.toISOString();
          }
        }

        const describedBy = loading
          ? undefined
          : [dateId, descriptionId].filter(Boolean).join(" ") || undefined;

        return (
          <li
            key={index}
            className={itemClassName}
            data-testid={itemTestId}
            aria-labelledby={!loading && hasTitle ? labelId : undefined}
            aria-label={
              loading
                ? `Timeline item ${index + 1} loading`
                : !hasTitle
                  ? `Timeline item ${index + 1}`
                  : undefined
            }
            aria-describedby={describedBy}
            aria-posinset={index + 1}
            aria-setsize={setSize}
          >
            <div
              className={markerClassName}
              data-testid={`${itemTestId}-marker`}
              aria-hidden={true}
            >
              {IconComponent ? (
                <div
                  className={classMap.icon}
                  data-testid={`${itemTestId}-icon`}
                  aria-hidden={true}
                >
                  <IconComponent aria-hidden={true} />
                </div>
              ) : (
                <div
                  className={classMap.dot}
                  data-testid={`${itemTestId}-dot`}
                  aria-hidden={true}
                />
              )}
            </div>

            <div
              className={contentClassName}
              data-testid={`${itemTestId}-content`}
            >
              {loading ? (
                <SkeletonComponent
                  width="100%"
                  height="100%"
                  className={classMap.skeleton}
                  aria-hidden={true}
                  data-testid={`${itemTestId}-skeleton`}
                />
              ) : (
                <>
                  {hasTitle && (
                    <h3
                      id={labelId}
                      className={classMap.title}
                      data-testid={`${itemTestId}-title`}
                    >
                      {item.title}
                    </h3>
                  )}

                  {item.date && (
                    <p
                      id={dateId}
                      className={classMap.date}
                      data-testid={`${itemTestId}-date`}
                    >
                      <time dateTime={dateTimeAttr}>{item.date}</time>
                    </p>
                  )}

                  {item.description && (
                    <p
                      id={descriptionId}
                      className={classMap.description}
                      data-testid={`${itemTestId}-description`}
                    >
                      {item.description}
                    </p>
                  )}
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

TimelineBase.displayName = "TimelineBase";
export default TimelineBase;
