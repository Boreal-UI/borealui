import React, { useMemo } from "react";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
} from "../../config/boreal-style-config";
import { ExtraProps, SkeletonBaseProps } from "./Skeleton.types";

const SkeletonBase: React.FC<SkeletonBaseProps & ExtraProps> = ({
  width = "100%",
  height = "100%",
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  className = "",
  label = "Loading content...",
  announce = true,
  animate = true,
  as: Tag = "div",
  "data-testid": dataTestId,
  testId = dataTestId ?? "skeleton-loader",
  classMap,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-live": ariaLive,
  "aria-busy": ariaBusy,
  "aria-hidden": ariaHidden,
  role,

  ...rest
}) => {
  const descriptionId = `${testId}-desc`;

  const shouldAnnounce = announce && ariaHidden !== true;

  const skeletonClasses = useMemo(
    () =>
      combineClassNames(
        classMap.skeleton,
        animate && classMap.animated,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        className,
      ),
    [classMap, animate, shadow, rounding, className],
  );

  const computedAriaDescribedBy = shouldAnnounce
    ? [
        ariaDescribedBy,
        !ariaLabel && !ariaLabelledBy ? descriptionId : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined
    : undefined;

  const accessibilityProps =
    ariaHidden === true
      ? {
          "aria-hidden": true as const,
        }
      : shouldAnnounce
        ? {
            role: role ?? ("status" as const),
            "aria-busy": ariaBusy ?? true,
            "aria-live": ariaLive ?? ("polite" as const),
            "aria-relevant": "additions text" as const,
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledBy,
            "aria-describedby": computedAriaDescribedBy,
          }
        : {
            "aria-hidden": false,
            role,
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledBy,
            "aria-describedby": ariaDescribedBy,
            "aria-busy": ariaBusy,
          };

  return (
    <Tag
      className={skeletonClasses}
      style={{ width, height }}
      data-testid={testId}
      {...accessibilityProps}
      {...rest}
    >
      {shouldAnnounce && !ariaLabel && !ariaLabelledBy && (
        <span
          id={descriptionId}
          className="sr_only"
          data-testid={`${testId}-description`}
        >
          {label}
        </span>
      )}
    </Tag>
  );
};

SkeletonBase.displayName = "SkeletonBase";
export default SkeletonBase;
