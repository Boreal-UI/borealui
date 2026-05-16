import React, { useMemo } from "react";
import { TimelineProps } from "./Timeline.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const TimelineBase: React.FC<
  TimelineProps & { classMap: Record<string, string> }
> = ({
  items,
  orientation = "vertical",
  "aria-label": ariaLabel = "Timeline",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  role = "list",
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  classMap,
  className,
  "data-testid": dataTestId,
  testId = dataTestId ?? "timeline",
  ...rest
}) => {
  const outerWrapper = useMemo(
    () =>
      combineClassNames(
        classMap.timeline,
        classMap[orientation],
        classMap[theme],
        glass && classMap.glass,
        className,
      ),
    [classMap, orientation, theme, glass, className],
  );

  const itemClassName = useMemo(
    () =>
      combineClassNames(
        classMap.item,
        classMap[orientation],
        classMap[theme],
        glass && classMap.glass,
      ),
    [classMap, orientation, theme, glass],
  );

  const markerClassName = useMemo(
    () =>
      combineClassNames(
        classMap.marker,
        classMap[theme],
        classMap[orientation],
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
      ),
    [classMap, theme, orientation, glass, shadow],
  );

  const contentClassName = useMemo(
    () =>
      combineClassNames(
        classMap.content,
        classMap[orientation],
        classMap[theme],
        glass && classMap.glass,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
      ),
    [classMap, orientation, theme, glass, shadow, rounding],
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

        const describedBy =
          [dateId, descriptionId].filter(Boolean).join(" ") || undefined;

        return (
          <li
            key={index}
            className={itemClassName}
            data-testid={itemTestId}
            aria-labelledby={hasTitle ? labelId : undefined}
            aria-label={!hasTitle ? `Timeline item ${index + 1}` : undefined}
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
            </div>
          </li>
        );
      })}
    </ul>
  );
};

TimelineBase.displayName = "TimelineBase";
export default TimelineBase;
