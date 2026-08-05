import { combineClassNames } from "@/utils/classNames";
import { capitalize } from "@/utils/capitalize";
import { expandClassMap } from "@/utils/propAliases";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultSize,
  getDefaultTheme,
  getShadowClassName,
} from "@/config/boreal-style-config";
import Skeleton from "../../Skeleton/server/Skeleton";
import { MetricBoxProps } from "../MetricBox.types";
import styles from "../next/MetricBox.module.scss";

export type ServerMetricBoxProps = MetricBoxProps;

export default function MetricBox({
  title,
  value,
  units,
  icon: Icon,
  subtext,
  loading = false,
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
  shadow,
  rounding = getDefaultRounding(),
  state,
  align = "center",
  size = getDefaultSize(),
  className,
  iconClassName,
  contentClassName,
  titleClassName,
  valueClassName,
  subtextClassName,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-live": ariaLive,
  "aria-atomic": ariaAtomic,
  decorativeIcon = true,
  iconAriaLabel,
  "data-testid": dataTestId,
  testId = dataTestId ?? "metric-box",
}: ServerMetricBoxProps) {
  const classMap = expandClassMap(styles);
  const titleId = title ? `${testId}-title` : undefined;
  const subtextId = subtext ? `${testId}-subtext` : undefined;
  const displayValue = units ? `${value} ${units}` : String(value ?? "");
  const classes = combineClassNames(
    classMap.wrapper,
    (variant === "outline" || variant === "glassOutline") && classMap.outline,
    classMap[theme],
    state && classMap[state],
    classMap[size],
    classMap[align],
    (variant === "glass" || variant === "glassOutline") && classMap.glass,
    loading && classMap.loading,
    getShadowClassName(classMap, theme, shadow),
    rounding && classMap[`round${capitalize(rounding)}`],
    className,
  );

  return (
    <div
      className={classes}
      role={role ?? "region"}
      aria-label={ariaLabel ?? (loading ? title : undefined)}
      aria-labelledby={
        ariaLabel
          ? undefined
          : (ariaLabelledBy ?? (!loading ? titleId : undefined))
      }
      aria-describedby={ariaDescribedBy ?? (!loading ? subtextId : undefined)}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      aria-busy={loading || undefined}
      data-testid={testId}
    >
      {loading ? (
        <Skeleton
          width="100%"
          height="100%"
          aria-hidden
          className={classMap.loadingSkeleton}
          testId={`${testId}-skeleton`}
        />
      ) : (
        <>
          {Icon ? (
            <div
              className={combineClassNames(classMap.icon, iconClassName)}
              aria-hidden={decorativeIcon || undefined}
              data-testid={`${testId}-icon`}
            >
              <Icon
                aria-hidden={decorativeIcon || undefined}
                aria-label={!decorativeIcon ? iconAriaLabel : undefined}
                focusable={false}
              />
            </div>
          ) : null}
          <div
            className={combineClassNames(classMap.content, contentClassName)}
          >
            <h3
              id={titleId}
              className={combineClassNames(classMap.title, titleClassName)}
              data-testid={`${testId}-title`}
            >
              {title}
            </h3>
            <div
              className={combineClassNames(classMap.value, valueClassName)}
              aria-label={`${displayValue} ${title}`}
              data-testid={`${testId}-value`}
            >
              {displayValue}
            </div>
            {subtext ? (
              <div
                id={subtextId}
                className={combineClassNames(
                  classMap.subtext,
                  subtextClassName,
                )}
                data-testid={`${testId}-subtext`}
              >
                {subtext}
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
