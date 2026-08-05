import { combineClassNames } from "@/utils/classNames";
import { expandClassMap } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import {
  getDefaultBorder,
  getDefaultVariant,
  getDefaultRounding,
  getDefaultSize,
  getDefaultTheme,
  getShadowClassName,
} from "@/config/boreal-style-config";
import { CardProps } from "../Card.types";
import Skeleton from "../../Skeleton/server/Skeleton";
import styles from "../next/Card.module.scss";

export type ServerCardProps = Omit<
  CardProps,
  | "actionButtons"
  | "renderHeader"
  | "renderContent"
  | "renderFooter"
  | "selectable"
  | "selected"
  | "useIconButtons"
  | "onClick"
  | "onKeyDown"
> & {
  footer?: React.ReactNode;
};

export default function Card({
  title,
  description,
  cardIcon: Icon,
  children,
  footer,
  imageUrl,
  imageAlt,
  imageWidth = 640,
  imageHeight = 360,
  imageInset = "none",
  imageDecorative = false,
  loading = false,
  disabled = false,
  theme = getDefaultTheme(),
  state,
  size = getDefaultSize(),
  shadow,
  rounding = getDefaultRounding(),
  border = getDefaultBorder(),
  variant = getDefaultVariant(),
  layout = "vertical",
  align = "center",
  className,
  contentClassName,
  imageClassName,
  headerClassName,
  titleClassName,
  iconClassName,
  bodyClassName,
  descriptionClassName,
  childrenClassName,
  footerClassName,
  testId,
  "data-testid": dataTestId,
  id,
  role,
  ...rest
}: ServerCardProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "card";
  const src = typeof imageUrl === "string" ? imageUrl : imageUrl?.src;
  const classes = combineClassNames(
    classMap.card,
    classMap[layout],
    classMap[align],
    classMap[theme],
    state && classMap[state],
    classMap[size],
    getShadowClassName(classMap, theme, shadow),
    rounding && classMap[`round${capitalize(rounding)}`],
    border && classMap[`border${capitalize(border)}`],
    (variant === "outline" || variant === "glassOutline") && classMap.outline,
    (variant === "glass" || variant === "glassOutline") && classMap.glass,
    loading && classMap.loading,
    disabled && classMap.disabled,
    className,
  );
  const imageClasses = combineClassNames(
    classMap.image,
    classMap[`inset${capitalize(imageInset)}`],
    imageInset !== "none" &&
      rounding &&
      classMap[`imageRound${capitalize(rounding)}`],
    imageClassName,
  );
  return (
    <div
      {...rest}
      id={id}
      role={role ?? (title ? "region" : undefined)}
      className={classes}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      data-testid={resolvedTestId}
    >
      {loading ? (
        <Skeleton
          width="250px"
          height="250px"
          testId={`${resolvedTestId}-skeleton`}
        />
      ) : (
        <div className={combineClassNames(classMap.content, contentClassName)}>
          {src ? (
            <img
              src={src}
              alt={
                imageDecorative ? "" : imageAlt || `${title || "Card"} image`
              }
              width={imageWidth}
              height={imageHeight}
              className={imageClasses}
            />
          ) : null}
          <div>
            {title ? (
              <div
                className={combineClassNames(classMap.header, headerClassName)}
              >
                <h2
                  className={combineClassNames(classMap.title, titleClassName)}
                >
                  {Icon ? (
                    <span
                      className={combineClassNames(
                        classMap.icon,
                        iconClassName,
                      )}
                      aria-hidden="true"
                    >
                      <Icon />
                    </span>
                  ) : null}
                  {title}
                </h2>
              </div>
            ) : null}
            <div className={combineClassNames(classMap.body, bodyClassName)}>
              {description ? (
                <p
                  className={combineClassNames(
                    classMap.description,
                    descriptionClassName,
                  )}
                >
                  {description}
                </p>
              ) : null}
              {children ? (
                <div
                  className={combineClassNames(
                    classMap.children,
                    childrenClassName,
                  )}
                >
                  {children}
                </div>
              ) : null}
            </div>
            {footer ? (
              <div
                className={combineClassNames(classMap.footer, footerClassName)}
              >
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
