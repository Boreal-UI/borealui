import React, { useId, useMemo } from "react";
import { CardBaseProps, CardImageSource, StaticCardImage } from "./Card.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultSize,
  getDefaultTheme,
  getDefaultBorder,
} from "../../config/boreal-style-config";

const CardBase: React.FC<CardBaseProps> = ({
  theme = getDefaultTheme(),
  state,
  cardIcon,
  title,
  border = getDefaultBorder(),
  description,
  rounding = getDefaultRounding(),
  shadow,
  imageUrl,
  imageAlt,
  imageHeight,
  imageWidth,
  imageFill,
  imageInset = "none",
  imageDecorative = false,
  className,
  contentClassName,
  mediaClassName,
  imageClassName,
  headerClassName,
  titleClassName,
  iconClassName,
  bodyClassName,
  descriptionClassName,
  childrenClassName,
  footerClassName,
  actionsClassName,
  actionButtonClassName,
  variant = getDefaultVariant(),
  size = getDefaultSize(),
  align = "center",
  renderHeader,
  renderContent,
  renderFooter,
  actionButtons = [],
  useIconButtons = false,
  layout = "vertical",
  loading = false,
  children,
  id,
  role,
  tabIndex,
  onClick,
  onKeyDown,
  selectable = false,
  selected = false,
  disabled = false,
  "data-testid": dataTestId,
  testId = dataTestId ?? "card",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  "aria-controls": ariaControls,
  "aria-current": ariaCurrent,
  "aria-live": ariaLive,
  "aria-atomic": ariaAtomic,
  headerId,
  descriptionId,
  classMap,
  SkeletonComponent,
  ImageComponent,
}) => {
  const autoId = useId();
  const resolvedHeaderId = headerId || ariaLabelledBy || `${autoId}-header`;
  const resolvedDescriptionId = descriptionId || `${autoId}-description`;
  const hasTitle = Boolean(title);

  const hasDescription = Boolean(description);
  const isInteractive = selectable || Boolean(onClick);

  const derivedAriaLabel = ariaLabel || title || description || "Content card";

  const resolvedRole =
    role ||
    (isInteractive ? "button" : hasTitle || ariaLabel ? "region" : undefined);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    onKeyDown?.(event);
    if (
      event.defaultPrevented ||
      event.target !== event.currentTarget ||
      disabled ||
      !isInteractive
    ) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const FallbackImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt="" {...props} />
  );

  function isStaticCardImage(value: unknown): value is StaticCardImage {
    return (
      typeof value === "object" &&
      value !== null &&
      "src" in value &&
      typeof (value as { src: unknown }).src === "string"
    );
  }

  function normalizeImageSource(
    srcInput: CardImageSource | undefined,
    fallbackWidth?: number,
    fallbackHeight?: number,
  ): { src?: string; width?: number; height?: number } {
    if (!srcInput) {
      return { src: undefined, width: fallbackWidth, height: fallbackHeight };
    }

    if (typeof srcInput === "string") {
      const trimmed = srcInput.trim();
      if (!trimmed) {
        return { src: undefined, width: fallbackWidth, height: fallbackHeight };
      }
      return { src: trimmed, width: fallbackWidth, height: fallbackHeight };
    }

    if (isStaticCardImage(srcInput)) {
      const trimmed = srcInput.src.trim();
      if (!trimmed) {
        return { src: undefined, width: fallbackWidth, height: fallbackHeight };
      }

      return {
        src: trimmed,
        width: srcInput.width ?? fallbackWidth,
        height: srcInput.height ?? fallbackHeight,
      };
    }

    return { src: undefined, width: fallbackWidth, height: fallbackHeight };
  }

  const {
    src: imgSrc,
    width: resolvedWidth,
    height: resolvedHeight,
  } = normalizeImageSource(imageUrl, imageWidth, imageHeight);

  const hasImage = Boolean(imgSrc);
  const imgAlt = imageDecorative ? "" : imageAlt || `${title || "Card"} image`;

  const ImageRenderer = ImageComponent || FallbackImage;
  const isImageInset = imageInset !== "none";
  const resolvedImageClassName = combineClassNames(
    classMap.image,
    imageInset && classMap[`inset${capitalize(imageInset)}`],
    isImageInset && rounding && classMap[`imageRound${capitalize(rounding)}`],
    imageClassName,
  );

  const cardClassName = useMemo(
    () =>
      combineClassNames(
        classMap.card,
        classMap[layout],
        align &&
          classMap[
            align === "start" ? "left" : align === "end" ? "right" : align
          ],
        classMap[theme],
        state && classMap[state],
        classMap[size],
        getShadowClassName(classMap, theme, shadow),
        rounding && classMap[`round${capitalize(rounding)}`],
        border && classMap[`border${capitalize(border)}`],
        (variant === "outline" || variant === "glassOutline") &&
          classMap.outline,
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        loading && classMap.loading,
        disabled && classMap.disabled,
        selected && classMap.selected,
        selectable && classMap.selectable,
        className,
      ),
    [
      classMap,
      layout,
      align,
      theme,
      state,
      size,
      shadow,
      rounding,
      border,
      variant,
      loading,
      disabled,
      selected,
      selectable,
      className,
    ],
  );

  return (
    // The card may contain nested actions, so it cannot always be a native button.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      id={id}
      data-testid={testId}
      className={cardClassName}
      role={resolvedRole}
      tabIndex={disabled ? -1 : isInteractive ? (tabIndex ?? 0) : tabIndex}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      aria-labelledby={
        hasTitle && !ariaLabel ? resolvedHeaderId : ariaLabelledBy
      }
      aria-describedby={
        ariaDescribedBy || (hasDescription ? resolvedDescriptionId : undefined)
      }
      aria-label={!hasTitle || ariaLabel ? derivedAriaLabel : undefined}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      aria-pressed={selectable ? selected : undefined}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-current={ariaCurrent}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
    >
      {loading ? (
        <SkeletonComponent
          width="250px"
          height="250px"
          data-testid={`${testId}-skeleton`}
        />
      ) : (
        <div className={combineClassNames(classMap.content, contentClassName)}>
          {hasImage &&
            imgSrc &&
            (imageFill ? (
              <div
                className={combineClassNames(classMap.media, mediaClassName)}
              >
                <ImageRenderer
                  src={imgSrc}
                  alt={imgAlt}
                  className={resolvedImageClassName}
                  fill
                />
              </div>
            ) : (
              <ImageRenderer
                src={imgSrc}
                alt={imgAlt}
                className={resolvedImageClassName}
                width={resolvedWidth ?? 640}
                height={resolvedHeight ?? 360}
              />
            ))}

          <div>
            {(renderHeader || hasTitle) && (
              <div
                className={combineClassNames(classMap.header, headerClassName)}
                id={resolvedHeaderId}
              >
                {renderHeader ? (
                  renderHeader()
                ) : hasTitle ? (
                  <h2
                    className={combineClassNames(
                      classMap.title,
                      titleClassName,
                    )}
                  >
                    {cardIcon && (
                      <span
                        className={combineClassNames(
                          classMap.icon,
                          iconClassName,
                        )}
                        aria-hidden="true"
                        data-testid={`${testId}-icon`}
                      >
                        {React.createElement(cardIcon)}
                      </span>
                    )}
                    {title}
                  </h2>
                ) : null}
              </div>
            )}

            <div className={combineClassNames(classMap.body, bodyClassName)}>
              {renderContent ? (
                renderContent()
              ) : (
                <>
                  {hasDescription && (
                    <p
                      id={resolvedDescriptionId}
                      className={combineClassNames(
                        classMap.description,
                        descriptionClassName,
                      )}
                    >
                      {description}
                    </p>
                  )}
                  {children && (
                    <div
                      className={combineClassNames(
                        classMap.children,
                        childrenClassName,
                      )}
                    >
                      {children}
                    </div>
                  )}
                </>
              )}
            </div>

            {(actionButtons.length > 0 || renderFooter) && (
              <div
                className={combineClassNames(classMap.footer, footerClassName)}
              >
                {actionButtons.length > 0 && (
                  <div
                    className={combineClassNames(
                      classMap.actions,
                      actionsClassName,
                    )}
                  >
                    {actionButtons.map((button, index) => {
                      const isIconButton = Boolean(
                        useIconButtons && button.icon,
                      );
                      const ActionComponent = isIconButton
                        ? button.iconButtonComponent
                        : button.buttonComponent;

                      return (
                        <ActionComponent
                          key={`${button.label}-${index}`}
                          {...(isIconButton ? { icon: button.icon } : {})}
                          onClick={
                            disabled || button.disabled
                              ? undefined
                              : (event: React.MouseEvent<HTMLElement>) => {
                                  event.stopPropagation();
                                  button.onClick();
                                }
                          }
                          className={combineClassNames(
                            classMap.action_button,
                            actionButtonClassName,
                          )}
                          theme={
                            button.theme ||
                            (isIconButton ? "clear" : "secondary")
                          }
                          state={button.state || ""}
                          href={button.href}
                          target={button.target}
                          rel={button.rel}
                          loading={button.loading}
                          size={button.size || size}
                          rounding={button.rounding}
                          shadow={button.shadow}
                          aria-label={button["aria-label"] || button.label}
                          aria-describedby={button["aria-describedby"]}
                          aria-labelledby={button["aria-labelledby"]}
                          aria-pressed={button["aria-pressed"]}
                          aria-expanded={button["aria-expanded"]}
                          aria-controls={button["aria-controls"]}
                          aria-current={button["aria-current"]}
                          role={button.role}
                          title={button.title}
                          disabled={disabled || button.disabled}
                        >
                          {isIconButton ? undefined : button.label}
                        </ActionComponent>
                      );
                    })}
                  </div>
                )}
                {renderFooter && renderFooter()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

CardBase.displayName = "CardBase";

export default CardBase;
