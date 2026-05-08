import React, { useMemo } from "react";
import {
  BaseFooterProps,
  FooterLink,
  FooterSection,
  LogoSource,
} from "./Footer.types";
import { combineClassNames } from "../../utils/classNames";
import { getDefaultTheme } from "../../config/boreal-style-config";
import { capitalize } from "@/utils/capitalize";
import { resolvePropAlias } from "@/utils/propAliases";

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, "-");

const FooterBase: React.FC<BaseFooterProps> = ({
  theme = getDefaultTheme(),
  glass = false,
  attachment = "static",
  shadow = "none",
  rounding = "none",
  layout = "inline",
  className = "",
  "data-testid": dataTestId,
  testId = dataTestId ?? "footer",

  copyright,
  copyrightInBottom,
  links = [],
  sections,
  logo,
  brandTitle,
  brandDescription,
  brandHref,

  socialLinks = [],
  showThemeSelect = false,
  bottomEnd,

  contentClassName,
  leftClassName,
  linksClassName,
  linkClassName,
  logoClassName,
  socialClassName,
  themeToggleClassName,

  brandClassName,
  brandLinkClassName,
  brandTitleClassName,
  brandDescriptionClassName,

  sectionsClassName,
  sectionTitleClassName,
  actionsClassName,
  actionGroupClassName,

  bottomClassName,
  bottomCopyrightClassName,
  bottomEndClassName,
  copyrightClassName,

  IconButton,
  ImageComponent = "img",
  ThemeSelect,
  classMap,
  LinkWrapper = ({ href, children, ...rest }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),

  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  navAriaLabel = "Footer site links",
  socialNavAriaLabel = "Social media",
  themeSelectAriaLabel = "Theme selector",
  logoAriaLabel = "Logo",
  logoDecorative = false,
  labelId,
  ...rest
}) => {
  const resolvedAttachment = resolvePropAlias(attachment);

  const footerClass = useMemo(
    () =>
      combineClassNames(
        classMap.footer,
        classMap[theme],
        glass && classMap.glass,
        layout !== "inline" && classMap[`layout${capitalize(layout)}`],
        shadow !== "none" && classMap[`shadow${capitalize(shadow)}`],
        rounding !== "none" && classMap[`round${capitalize(rounding)}`],
        classMap[`attachment${capitalize(resolvedAttachment)}`],
        className,
      ),
    [
      classMap,
      theme,
      glass,
      layout,
      shadow,
      rounding,
      resolvedAttachment,
      className,
    ],
  );

  const isLogoImage = (
    value: unknown,
  ): value is { src: string; width?: number; height?: number } =>
    typeof value === "object" &&
    value !== null &&
    "src" in (value as Record<string, unknown>);

  const isImgLike = typeof logo === "string" || isLogoImage(logo);

  const imgLogo = isImgLike
    ? typeof logo === "string"
      ? { src: logo }
      : logo
    : undefined;

  const logoSrc = imgLogo?.src;
  const logoW = imgLogo?.width ?? 20;
  const logoH = imgLogo?.height ?? 20;

  const normalizedSections: FooterSection[] =
    sections && sections.length > 0
      ? sections
      : links.length > 0
        ? [
            {
              title: "Links",
              links,
              "aria-label": navAriaLabel,
              testId: "links",
            },
          ]
        : [];

  const shouldRenderCopyrightInBottom =
    copyrightInBottom ?? layout === "columns";

  const renderLogo = () => {
    if (isImgLike && logoSrc) {
      if (typeof ImageComponent === "string") {
        return (
          <img
            className={combineClassNames(classMap.logo, logoClassName)}
            data-testid={`${testId}-logo`}
            loading="lazy"
            src={logoSrc}
            alt={logoDecorative ? "" : logoAriaLabel}
            aria-hidden={logoDecorative ? true : undefined}
            height={logoH}
            width={logoW}
          />
        );
      }

      return (
        <ImageComponent
          className={combineClassNames(classMap.logo, logoClassName)}
          data-testid={`${testId}-logo`}
          src={logoSrc}
          alt={logoDecorative ? "" : logoAriaLabel}
          aria-hidden={logoDecorative ? true : undefined}
          height={logoH}
          width={logoW}
        />
      );
    }

    if (!logo) {
      return null;
    }

    return (
      <span
        className={combineClassNames(classMap.logo, logoClassName)}
        role={logoDecorative ? undefined : "img"}
        aria-label={logoDecorative ? undefined : logoAriaLabel}
        aria-hidden={logoDecorative ? true : undefined}
        data-testid={`${testId}-logo`}
      >
        {
          logo as Exclude<
            LogoSource,
            string | { src: string; width?: number; height?: number }
          >
        }
      </span>
    );
  };

  const renderFooterLink = (
    link: FooterLink,
    index: number,
    customLinkClassName?: string,
  ) => {
    const slug = slugify(link.label || link.href || `link-${index}`);
    const key = `${link.href ?? slug}-${index}`;
    const resolvedLinkClassName = combineClassNames(
      classMap.link,
      customLinkClassName,
    );

    if (link.disabled) {
      return (
        <li key={key}>
          <span
            className={resolvedLinkClassName}
            data-testid={`${testId}-link-${slug}`}
            aria-disabled="true"
            title={link.title}
          >
            {link.label}
          </span>
        </li>
      );
    }

    return (
      <li key={key}>
        <LinkWrapper
          href={link.href}
          className={resolvedLinkClassName}
          data-testid={`${testId}-link-${slug}`}
          aria-label={link["aria-label"]}
          aria-current={link["aria-current"]}
          title={link.title}
          rel={link.rel}
          target={link.target}
        >
          {link.label}
        </LinkWrapper>
      </li>
    );
  };

  const renderSocialLinks = () => {
    if (socialLinks.length === 0) {
      return null;
    }

    return (
      <nav
        className={combineClassNames(classMap.social, socialClassName)}
        aria-label={socialNavAriaLabel}
        data-testid={`${testId}-social`}
      >
        {socialLinks.map((social, index) => (
          <IconButton
            key={`${social.href ?? social.title}-${index}`}
            icon={social.icon}
            href={social.href}
            isExternal={social.isExternal ?? true}
            shadow="none"
            aria-label={social["aria-label"] ?? social.title}
            title={social.tooltip ?? social.title}
            theme="clear"
            glass={glass}
            disabled={social.disabled}
            rel={social.rel}
            target={social.target}
            data-testid={`${testId}-social-${slugify(social.title)}`}
          />
        ))}
      </nav>
    );
  };

  const renderThemeSelect = () => {
    if (!showThemeSelect) {
      return null;
    }

    return (
      <div
        className={combineClassNames(
          classMap.themeToggle,
          themeToggleClassName,
        )}
        data-testid={`${testId}-theme-select`}
        aria-label={themeSelectAriaLabel}
      >
        <ThemeSelect
          theme="clear"
          label={brandDescription}
          shadow="none"
          aria-label={themeSelectAriaLabel}
        />
      </div>
    );
  };

  const renderBrand = () => {
    const brandContent = (
      <>
        {renderLogo()}

        {brandTitle && (
          <span
            className={combineClassNames(
              classMap.brandTitle,
              brandTitleClassName,
            )}
            data-testid={`${testId}-brand-title`}
          >
            {brandTitle}
          </span>
        )}
      </>
    );

    return (
      <div
        className={combineClassNames(classMap.brand, brandClassName)}
        data-testid={`${testId}-brand`}
      >
        {brandHref ? (
          <LinkWrapper
            href={brandHref}
            className={combineClassNames(
              classMap.brandLink,
              brandLinkClassName,
            )}
            aria-label={
              typeof brandTitle === "string" ? brandTitle : logoAriaLabel
            }
          >
            {brandContent}
          </LinkWrapper>
        ) : (
          <div
            className={combineClassNames(
              classMap.brandLink,
              brandLinkClassName,
            )}
          >
            {brandContent}
          </div>
        )}

        {brandDescription && (
          <p
            className={combineClassNames(
              classMap.brandDescription,
              brandDescriptionClassName,
            )}
            data-testid={`${testId}-brand-description`}
          >
            {brandDescription}
          </p>
        )}

        {copyright && !shouldRenderCopyrightInBottom && (
          <div
            className={combineClassNames(
              classMap.copyright,
              copyrightClassName,
            )}
            data-testid={`${testId}-copyright`}
          >
            <p id={labelId}>{copyright}</p>
          </div>
        )}
      </div>
    );
  };

  const renderSections = () => {
    if (normalizedSections.length === 0) {
      return null;
    }

    return (
      <div
        className={combineClassNames(classMap.sections, sectionsClassName)}
        data-testid={`${testId}-sections`}
      >
        {normalizedSections.map((section, sectionIndex) => {
          const titleText =
            typeof section.title === "string"
              ? section.title
              : `section-${sectionIndex + 1}`;

          const sectionSlug = section.testId ?? slugify(titleText);

          return (
            <nav
              key={sectionSlug}
              className={combineClassNames(classMap.section, section.className)}
              aria-label={section["aria-label"] ?? `${titleText} links`}
              data-testid={`${testId}-section-${sectionSlug}`}
            >
              <h2
                className={combineClassNames(
                  classMap.sectionTitle,
                  sectionTitleClassName,
                  section.titleClassName,
                )}
              >
                {section.title}
              </h2>

              <ul
                className={combineClassNames(
                  classMap.sectionList,
                  section.listClassName,
                )}
              >
                {section.links.map((link, index) =>
                  renderFooterLink(link, index, section.linkClassName),
                )}
              </ul>
            </nav>
          );
        })}
      </div>
    );
  };

  if (layout === "columns") {
    return (
      <footer
        className={footerClass}
        data-testid={testId}
        role="contentinfo"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? labelId}
        aria-describedby={ariaDescribedBy}
        {...rest}
      >
        <div className={combineClassNames(classMap.content, contentClassName)}>
          {renderBrand()}

          {renderSections()}

          {(socialLinks.length > 0 || showThemeSelect) && (
            <div
              className={combineClassNames(classMap.actions, actionsClassName)}
              data-testid={`${testId}-actions`}
            >
              {socialLinks.length > 0 && (
                <div
                  className={combineClassNames(
                    classMap.actionGroup,
                    actionGroupClassName,
                  )}
                >
                  <h2
                    className={combineClassNames(
                      classMap.sectionTitle,
                      sectionTitleClassName,
                    )}
                  >
                    Connect
                  </h2>
                  {renderSocialLinks()}
                </div>
              )}

              {renderThemeSelect()}
            </div>
          )}
        </div>

        {(copyright || bottomEnd) && (
          <div
            className={combineClassNames(classMap.bottom, bottomClassName)}
            data-testid={`${testId}-bottom`}
          >
            {copyright && shouldRenderCopyrightInBottom && (
              <p
                id={labelId}
                className={combineClassNames(
                  classMap.bottomCopyright,
                  bottomCopyrightClassName,
                )}
                data-testid={`${testId}-copyright`}
              >
                {copyright}
              </p>
            )}

            {bottomEnd && (
              <div
                className={combineClassNames(
                  classMap.bottomEnd,
                  bottomEndClassName,
                )}
                data-testid={`${testId}-bottom-end`}
              >
                {bottomEnd}
              </div>
            )}
          </div>
        )}
      </footer>
    );
  }

  return (
    <footer
      className={footerClass}
      data-testid={testId}
      role="contentinfo"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy ?? labelId}
      aria-describedby={ariaDescribedBy}
      {...rest}
    >
      <div className={combineClassNames(classMap.content, contentClassName)}>
        <div
          className={combineClassNames(classMap.left, leftClassName)}
          data-testid={`${testId}-left`}
        >
          {renderLogo()}

          {copyright && (
            <div
              className={
                combineClassNames(classMap.copyright, copyrightClassName) ??
                combineClassNames(classMap.left, leftClassName)
              }
              data-testid={`${testId}-copyright`}
            >
              <p id={labelId}>{copyright}</p>
            </div>
          )}
        </div>

        {links.length > 0 && (
          <nav
            className={combineClassNames(classMap.links, linksClassName)}
            aria-label={navAriaLabel}
            data-testid={`${testId}-nav`}
          >
            <ul>
              {links.map((link, index) =>
                renderFooterLink(link, index, linkClassName),
              )}
            </ul>
          </nav>
        )}

        {renderThemeSelect()}
        {renderSocialLinks()}
      </div>
    </footer>
  );
};

FooterBase.displayName = "FooterBase";
export default FooterBase;
