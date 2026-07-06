import React, { JSX } from "react";
import { combineClassNames } from "../../utils/classNames";
import { ToolbarBaseProps } from "./Toolbar.types";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultGlass,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const ToolbarBase: React.FC<ToolbarBaseProps> = ({
  title,
  titleId,
  left,
  center,
  right,
  avatar,
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  attachment = "static",
  shadow,
  rounding = getDefaultRounding(),
  className,
  titleClassName,
  leftClassName,
  centerClassName,
  rightClassName,
  leftSectionClassName,
  centerSectionClassName,
  rightSectionClassName,
  leftContentClassName,
  centerContentClassName,
  rightContentClassName,
  avatarWrapperClassName,
  avatarClassName,
  "data-testid": dataTestId,
  testId = dataTestId ?? "toolbar",
  "aria-label": ariaLabel = "Toolbar",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  leftAriaLabel = "Toolbar left section",
  centerAriaLabel = "Toolbar center section",
  rightAriaLabel = "Toolbar right section",
  AvatarComponent,
  classMap,
  headingLevel = 1,
}): JSX.Element => {
  const safeHeading = Math.min(6, Math.max(1, headingLevel));
  const TitleTag = `h${safeHeading}` as keyof JSX.IntrinsicElements;

  const toolbarClass = combineClassNames(
    classMap.toolbar,
    classMap[theme],
    glass && classMap.glass,
    classMap[attachment],
    className,
    getShadowClassName(classMap, theme, shadow),
    rounding && classMap[`round${capitalize(rounding)}`],
  );

  const resolvedAriaLabel = ariaLabelledBy ? undefined : ariaLabel;

  const avatarAriaHidden =
    avatar && !avatar.name && !avatar.onClick && !avatar["aria-label"]
      ? true
      : undefined;

  const resolvedTitleId = title ? (titleId ?? `${testId}-title`) : undefined;

  return (
    <div
      className={toolbarClass}
      role="toolbar"
      aria-orientation="horizontal"
      aria-label={resolvedAriaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
    >
      <div
        className={combineClassNames(
          classMap.section,
          classMap.leftSection,
          leftClassName,
          leftSectionClassName,
        )}
        role="group"
        aria-label={leftAriaLabel}
        data-testid={`${testId}-left`}
      >
        <div
          className={combineClassNames(
            classMap.sectionContent,
            classMap.leftContent,
            leftContentClassName,
          )}
          data-testid={`${testId}-left-content`}
        >
          {left}
        </div>
      </div>

      <div
        className={combineClassNames(
          classMap.section,
          classMap.centerSection,
          centerClassName,
          centerSectionClassName,
        )}
        role="group"
        aria-label={centerAriaLabel}
        data-testid={`${testId}-center`}
      >
        <div
          className={combineClassNames(
            classMap.sectionContent,
            classMap.centerContent,
            centerContentClassName,
          )}
          data-testid={`${testId}-center-content`}
        >
          {title && (
            <TitleTag
              id={resolvedTitleId}
              className={combineClassNames(classMap.title, titleClassName)}
              data-testid={`${testId}-title`}
            >
              {title}
            </TitleTag>
          )}
          {center}
        </div>
      </div>

      <div
        className={combineClassNames(
          classMap.section,
          classMap.rightSection,
          rightClassName,
          rightSectionClassName,
        )}
        role="group"
        aria-label={rightAriaLabel}
        data-testid={`${testId}-right`}
      >
        <div
          className={combineClassNames(
            classMap.sectionContent,
            classMap.rightContent,
            rightContentClassName,
          )}
          data-testid={`${testId}-right-content`}
        >
          {right}
        </div>
        {avatar && (
          <div
            className={combineClassNames(
              classMap.avatarWrapper,
              avatarWrapperClassName,
            )}
            data-testid={`${testId}-avatar`}
          >
            <AvatarComponent
              className={avatarClassName}
              name={avatar.name}
              src={avatar.src}
              size={avatar.size || "medium"}
              shape={avatar.shape || "circle"}
              theme={avatar.theme}
              outline={avatar.outline}
              glass={avatar.glass ?? glass}
              onClick={avatar.onClick}
              aria-label={avatar["aria-label"]}
              aria-hidden={avatarAriaHidden}
            />
          </div>
        )}
      </div>
    </div>
  );
};

ToolbarBase.displayName = "ToolbarBase";
export default ToolbarBase;
