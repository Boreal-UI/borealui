import React from "react";
import { render, screen, within } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom";
import FooterBase from "@/components/Footer/FooterBase";
import { FaGithub, FaTwitter } from "react-icons/fa";
import {
  DummyIconButton,
  DummyThemeSelect,
} from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const classNames = {
  footer: "footerRoot",
  glass: "footerGlass",

  primary: "themePrimary",
  secondary: "themeSecondary",
  tertiary: "themeTertiary",
  quaternary: "themeQuaternary",
  clear: "themeClear",

  layoutColumns: "layoutColumns",

  content: "footerContent",
  left: "footerLeft",
  links: "footerLinks",
  link: "footerLink",
  social: "footerSocial",
  themeToggle: "footerThemeToggle",
  logo: "footerLogo",
  copyright: "footerCopyright",

  shadowNone: "shadowNone",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  shadowIntense: "shadowIntense",

  roundNone: "roundNone",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",

  attachmentStatic: "attachmentStatic",
  attachmentFixed: "attachmentFixed",
  attachmentSticky: "attachmentSticky",

  brand: "footerBrand",
  brandLink: "footerBrandLink",
  brandTitle: "footerBrandTitle",
  brandDescription: "footerBrandDescription",

  sections: "footerSections",
  section: "footerSection",
  sectionTitle: "footerSectionTitle",
  sectionList: "footerSectionList",

  actions: "footerActions",
  actionGroup: "footerActionGroup",

  bottom: "footerBottom",
  bottomCopyright: "footerBottomCopyright",
  bottomEnd: "footerBottomEnd",
};

type DummyLinkWrapperProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
};

const DummyLinkWrapper: React.FC<DummyLinkWrapperProps> = ({
  href,
  children,
  ...rest
}) => (
  <a href={href} {...rest}>
    {children}
  </a>
);

DummyLinkWrapper.displayName = "DummyLinkWrapper";

type CustomImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const CustomImage: React.FC<CustomImageProps> = (props) => (
  <img {...props} data-custom-image="true" alt={props.alt ?? ""} />
);

CustomImage.displayName = "CustomImage";

const defaultLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
];

const defaultSocialLinks = [
  { icon: FaGithub, title: "GitHub", href: "https://github.com" },
  { icon: FaTwitter, title: "Twitter", href: "https://twitter.com" },
];

const defaultSections = [
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Components", href: "/docs/components" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const defaultProps = {
  theme: "primary" as const,
  classMap: classNames,
  IconButton: DummyIconButton,
  ThemeSelect: DummyThemeSelect,
  LinkWrapper: DummyLinkWrapper,
  showThemeSelect: true,
  links: defaultLinks,
  socialLinks: defaultSocialLinks,
  copyright: "© 2025 MyCompany",
};

const renderFooter = (
  props: Partial<React.ComponentProps<typeof FooterBase>> = {},
) => render(<FooterBase {...defaultProps} {...props} />);

describe("FooterBase", () => {
  describe("inline layout", () => {
    it("applies custom class names to inline layout regions", () => {
      renderFooter({
        logo: <svg data-testid="inline-logo-svg" />,
        contentClassName: "customContent",
        leftClassName: "customLeft",
        linksClassName: "customLinks",
        linkClassName: "customInlineLink",
        logoClassName: "customLogo",
        socialClassName: "customSocial",
        themeToggleClassName: "customThemeToggle",
        copyrightClassName: "customCopyright",
      });

      const footer = screen.getByTestId("footer");
      const content = footer.firstElementChild;

      expect(content).toHaveClass("footerContent");
      expect(content).toHaveClass("customContent");

      expect(screen.getByTestId("footer-left")).toHaveClass("footerLeft");
      expect(screen.getByTestId("footer-left")).toHaveClass("customLeft");

      expect(screen.getByTestId("footer-nav")).toHaveClass("footerLinks");
      expect(screen.getByTestId("footer-nav")).toHaveClass("customLinks");

      expect(screen.getByTestId("footer-link-home")).toHaveClass("footerLink");
      expect(screen.getByTestId("footer-link-home")).toHaveClass(
        "customInlineLink",
      );

      expect(screen.getByTestId("footer-logo")).toHaveClass("footerLogo");
      expect(screen.getByTestId("footer-logo")).toHaveClass("customLogo");

      expect(screen.getByTestId("footer-social")).toHaveClass("footerSocial");
      expect(screen.getByTestId("footer-social")).toHaveClass("customSocial");

      expect(screen.getByTestId("footer-theme-select")).toHaveClass(
        "footerThemeToggle",
      );
      expect(screen.getByTestId("footer-theme-select")).toHaveClass(
        "customThemeToggle",
      );

      expect(screen.getByTestId("footer-copyright")).toHaveClass(
        "footerCopyright",
      );
      expect(screen.getByTestId("footer-copyright")).toHaveClass(
        "customCopyright",
      );
    });

    it("renders the footer landmark and core regions", () => {
      renderFooter();

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute("data-testid", "footer");

      expect(screen.getByTestId("footer-left")).toBeInTheDocument();
      expect(screen.getByTestId("footer-nav")).toBeInTheDocument();
      expect(screen.getByTestId("footer-social")).toBeInTheDocument();
      expect(screen.getByTestId("footer-theme-select")).toBeInTheDocument();
      expect(screen.getByTestId("footer-copyright")).toBeInTheDocument();
    });

    it("applies footer, theme, and inline layout classes", () => {
      renderFooter({ glass: true });

      const footer = screen.getByTestId("footer");

      expect(footer).toHaveClass("footerRoot");
      expect(footer).toHaveClass("themePrimary");
      expect(footer).toHaveClass("footerGlass");
      expect(footer).not.toHaveClass("layoutColumns");

      expect(screen.getByTestId("footer-left")).toHaveClass("footerLeft");
      expect(screen.getByTestId("footer-nav")).toHaveClass("footerLinks");
      expect(screen.getByTestId("footer-social")).toHaveClass("footerSocial");
      expect(screen.getByTestId("footer-theme-select")).toHaveClass(
        "footerThemeToggle",
      );
    });

    it("applies optional shadow, rounding, attachment, and custom className", () => {
      renderFooter({
        shadow: "medium",
        rounding: "large",
        attachment: "fixed",
        className: "customFooterClass",
      });

      const footer = screen.getByTestId("footer");

      expect(footer).toHaveClass("footerRoot");
      expect(footer).toHaveClass("themePrimary");
      expect(footer).toHaveClass("shadowMedium");
      expect(footer).toHaveClass("roundLarge");
      expect(footer).toHaveClass("attachmentFixed");
      expect(footer).toHaveClass("customFooterClass");
    });

    it("applies footer aria attributes", () => {
      renderFooter({
        "aria-label": "Site footer",
        "aria-describedby": "footer-description",
      });

      const footer = screen.getByRole("contentinfo", { name: "Site footer" });
      expect(footer).toHaveAttribute("aria-describedby", "footer-description");
    });

    it("uses labelId as aria-labelledby when provided", () => {
      renderFooter({ labelId: "footer-label" });

      const footer = screen.getByRole("contentinfo");
      expect(footer).toHaveAttribute("aria-labelledby", "footer-label");

      const copyrightText = screen.getByText("© 2025 MyCompany");
      expect(copyrightText).toHaveAttribute("id", "footer-label");
    });

    it("prefers explicit aria-labelledby over labelId", () => {
      renderFooter({
        labelId: "footer-label",
        "aria-labelledby": "external-footer-label",
      });

      const footer = screen.getByRole("contentinfo");
      expect(footer).toHaveAttribute(
        "aria-labelledby",
        "external-footer-label",
      );
    });

    it("renders footer site links with expected hrefs and classes", () => {
      renderFooter();

      const nav = screen.getByRole("navigation", {
        name: /footer site links/i,
      });

      expect(nav).toBeInTheDocument();

      const homeLink = screen.getByTestId("footer-link-home");
      const aboutLink = screen.getByTestId("footer-link-about-us");

      expect(homeLink).toHaveTextContent("Home");
      expect(homeLink).toHaveAttribute("href", "/");
      expect(homeLink).toHaveClass("footerLink");

      expect(aboutLink).toHaveTextContent("About Us");
      expect(aboutLink).toHaveAttribute("href", "/about");
      expect(aboutLink).toHaveClass("footerLink");

      const listItems = within(nav).getAllByRole("listitem");
      expect(listItems).toHaveLength(2);
    });

    it("uses a custom nav aria label when provided", () => {
      renderFooter({ navAriaLabel: "Footer navigation links" });

      expect(
        screen.getByRole("navigation", { name: "Footer navigation links" }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("navigation", { name: /footer site links/i }),
      ).not.toBeInTheDocument();
    });

    it("passes link accessibility props through to the link wrapper", () => {
      renderFooter({
        links: [
          {
            label: "Docs",
            href: "/docs",
            "aria-label": "Documentation",
            "aria-current": "page",
            title: "View docs",
            target: "_blank",
            rel: "noreferrer",
          },
        ],
      });

      const link = screen.getByTestId("footer-link-docs");

      expect(link).toHaveAttribute("href", "/docs");
      expect(link).toHaveAttribute("aria-label", "Documentation");
      expect(link).toHaveAttribute("aria-current", "page");
      expect(link).toHaveAttribute("title", "View docs");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });

    it("renders disabled footer links as non-interactive text", () => {
      renderFooter({
        links: [
          {
            label: "Unavailable",
            href: "/unavailable",
            disabled: true,
          },
        ],
      });

      const disabledItem = screen.getByTestId("footer-link-unavailable");

      expect(disabledItem.tagName).toBe("SPAN");
      expect(disabledItem).toHaveTextContent("Unavailable");
      expect(disabledItem).toHaveAttribute("aria-disabled", "true");
      expect(disabledItem).not.toHaveAttribute("href");
    });

    it("renders social navigation with accessible icon links", () => {
      renderFooter();

      const socialNav = screen.getByRole("navigation", {
        name: /social media/i,
      });

      expect(socialNav).toBeInTheDocument();

      const github = screen.getByLabelText("GitHub");
      const twitter = screen.getByLabelText("Twitter");

      expect(github).toHaveAttribute("href", "https://github.com");
      expect(github).toHaveAttribute("title", "GitHub");
      expect(github).toHaveAttribute("data-glass", "false");

      expect(twitter).toHaveAttribute("href", "https://twitter.com");
      expect(twitter).toHaveAttribute("title", "Twitter");

      expect(screen.getByTestId("footer-social-github")).toBeInTheDocument();
      expect(screen.getByTestId("footer-social-twitter")).toBeInTheDocument();
    });

    it("uses custom social nav aria label", () => {
      renderFooter({ socialNavAriaLabel: "Footer social links" });

      expect(
        screen.getByRole("navigation", { name: "Footer social links" }),
      ).toBeInTheDocument();
    });

    it("passes social link accessibility props through to IconButton", () => {
      renderFooter({
        glass: true,
        socialLinks: [
          {
            icon: FaGithub,
            title: "GitHub",
            href: "https://github.com",
            "aria-label": "Open GitHub",
            tooltip: "GitHub profile",
            target: "_blank",
            rel: "noreferrer",
            disabled: false,
          },
        ],
      });

      const github = screen.getByLabelText("Open GitHub");

      expect(github).toHaveAttribute("href", "https://github.com");
      expect(github).toHaveAttribute("title", "GitHub profile");
      expect(github).toHaveAttribute("target", "_blank");
      expect(github).toHaveAttribute("rel", "noreferrer");
      expect(github).toHaveAttribute("data-glass", "true");
    });

    it("renders theme select only when showThemeSelect is true", () => {
      const { rerender } = render(
        <FooterBase {...defaultProps} showThemeSelect={false} />,
      );

      expect(
        screen.queryByTestId("footer-theme-select"),
      ).not.toBeInTheDocument();

      rerender(<FooterBase {...defaultProps} showThemeSelect />);

      expect(screen.getByTestId("footer-theme-select")).toBeInTheDocument();
    });

    it("uses custom theme select aria label", () => {
      renderFooter({ themeSelectAriaLabel: "Choose footer theme" });

      expect(screen.getByTestId("footer-theme-select")).toHaveAttribute(
        "aria-label",
        "Choose footer theme",
      );
    });

    it("renders no nav when there are no links", () => {
      renderFooter({ links: [] });

      expect(screen.queryByTestId("footer-nav")).not.toBeInTheDocument();
    });

    it("renders no social nav when there are no social links", () => {
      renderFooter({ socialLinks: [] });

      expect(screen.queryByTestId("footer-social")).not.toBeInTheDocument();
    });

    it("renders a string logo with the default img element", () => {
      renderFooter({
        logo: "/logo.svg",
        logoAriaLabel: "Company logo",
      });

      const logo = screen.getByTestId("footer-logo");

      expect(logo.tagName).toBe("IMG");
      expect(logo).toHaveAttribute("src", "/logo.svg");
      expect(logo).toHaveAttribute("alt", "Company logo");
    });

    it("renders an object logo with a custom image component", () => {
      renderFooter({
        logo: {
          src: "/logo.svg",
          width: 40,
          height: 40,
        },
        logoAriaLabel: "Company logo",
        ImageComponent: CustomImage,
      });

      const logo = screen.getByTestId("footer-logo");

      expect(logo.tagName).toBe("IMG");
      expect(logo).toHaveAttribute("data-custom-image", "true");
      expect(logo).toHaveAttribute("src", "/logo.svg");
      expect(logo).toHaveAttribute("width", "40");
      expect(logo).toHaveAttribute("height", "40");
      expect(logo).toHaveAttribute("alt", "Company logo");
    });

    it("renders a ReactNode logo with img role by default", () => {
      renderFooter({
        logo: <svg data-testid="custom-logo-svg" />,
        logoAriaLabel: "Custom logo",
      });

      const logo = screen.getByTestId("footer-logo");

      expect(logo).toHaveAttribute("role", "img");
      expect(logo).toHaveAttribute("aria-label", "Custom logo");
      expect(screen.getByTestId("custom-logo-svg")).toBeInTheDocument();
    });

    it("can render a decorative logo", () => {
      renderFooter({
        logo: <svg data-testid="decorative-logo-svg" />,
        logoDecorative: true,
      });

      const logo = screen.getByTestId("footer-logo");

      expect(logo).toHaveAttribute("aria-hidden", "true");
      expect(logo).not.toHaveAttribute("role");
      expect(logo).not.toHaveAttribute("aria-label");
    });
  });

  describe("columns layout", () => {
    it("applies custom class names to column layout regions", () => {
      renderFooter({
        layout: "columns",
        logo: <svg data-testid="columns-logo-svg" />,
        brandTitle: "Boreal UI",
        brandDescription: "Accessible components for modern interfaces.",
        brandHref: "/",
        sections: defaultSections,
        socialLinks: defaultSocialLinks,
        showThemeSelect: true,
        bottomEnd: "Secure Environment",

        contentClassName: "customColumnsContent",
        logoClassName: "customColumnsLogo",
        brandClassName: "customBrand",
        brandLinkClassName: "customBrandLink",
        brandTitleClassName: "customBrandTitle",
        brandDescriptionClassName: "customBrandDescription",
        sectionsClassName: "customSections",
        actionsClassName: "customActions",
        actionGroupClassName: "customActionGroup",
        socialClassName: "customColumnsSocial",
        themeToggleClassName: "customColumnsThemeToggle",
        bottomClassName: "customBottom",
        bottomCopyrightClassName: "customBottomCopyright",
        bottomEndClassName: "customBottomEnd",
      });

      const footer = screen.getByTestId("footer");
      const content = footer.firstElementChild;

      expect(content).toHaveClass("footerContent");
      expect(content).toHaveClass("customColumnsContent");

      expect(screen.getByTestId("footer-logo")).toHaveClass("footerLogo");
      expect(screen.getByTestId("footer-logo")).toHaveClass(
        "customColumnsLogo",
      );

      expect(screen.getByTestId("footer-brand")).toHaveClass("footerBrand");
      expect(screen.getByTestId("footer-brand")).toHaveClass("customBrand");

      const brandLink = screen.getByRole("link", { name: "Boreal UI" });
      expect(brandLink).toHaveClass("footerBrandLink");
      expect(brandLink).toHaveClass("customBrandLink");

      expect(screen.getByTestId("footer-brand-title")).toHaveClass(
        "footerBrandTitle",
      );
      expect(screen.getByTestId("footer-brand-title")).toHaveClass(
        "customBrandTitle",
      );

      expect(screen.getByTestId("footer-brand-description")).toHaveClass(
        "footerBrandDescription",
      );
      expect(screen.getByTestId("footer-brand-description")).toHaveClass(
        "customBrandDescription",
      );

      expect(screen.getByTestId("footer-sections")).toHaveClass(
        "footerSections",
      );
      expect(screen.getByTestId("footer-sections")).toHaveClass(
        "customSections",
      );

      expect(screen.getByTestId("footer-actions")).toHaveClass("footerActions");
      expect(screen.getByTestId("footer-actions")).toHaveClass("customActions");

      const actionGroup = screen.getByText("Connect").closest("div");
      expect(actionGroup).toHaveClass("footerActionGroup");
      expect(actionGroup).toHaveClass("customActionGroup");

      expect(screen.getByTestId("footer-social")).toHaveClass("footerSocial");
      expect(screen.getByTestId("footer-social")).toHaveClass(
        "customColumnsSocial",
      );

      expect(screen.getByTestId("footer-theme-select")).toHaveClass(
        "footerThemeToggle",
      );
      expect(screen.getByTestId("footer-theme-select")).toHaveClass(
        "customColumnsThemeToggle",
      );

      expect(screen.getByTestId("footer-bottom")).toHaveClass("footerBottom");
      expect(screen.getByTestId("footer-bottom")).toHaveClass("customBottom");

      expect(screen.getByTestId("footer-copyright")).toHaveClass(
        "footerBottomCopyright",
      );
      expect(screen.getByTestId("footer-copyright")).toHaveClass(
        "customBottomCopyright",
      );

      expect(screen.getByTestId("footer-bottom-end")).toHaveClass(
        "footerBottomEnd",
      );
      expect(screen.getByTestId("footer-bottom-end")).toHaveClass(
        "customBottomEnd",
      );
    });

    it("applies global sectionTitleClassName to section titles and action group title", () => {
      renderFooter({
        layout: "columns",
        sections: defaultSections,
        socialLinks: defaultSocialLinks,
        showThemeSelect: false,
        sectionTitleClassName: "customGlobalSectionTitle",
      });

      expect(screen.getByText("Resources")).toHaveClass("footerSectionTitle");
      expect(screen.getByText("Resources")).toHaveClass(
        "customGlobalSectionTitle",
      );

      expect(screen.getByText("Legal")).toHaveClass("footerSectionTitle");
      expect(screen.getByText("Legal")).toHaveClass("customGlobalSectionTitle");

      expect(screen.getByText("Connect")).toHaveClass("footerSectionTitle");
      expect(screen.getByText("Connect")).toHaveClass(
        "customGlobalSectionTitle",
      );
    });

    it("renders the column layout root, brand, sections, actions, and bottom bar", () => {
      renderFooter({
        layout: "columns",
        theme: "clear",
        logo: <svg data-testid="brand-logo-svg" />,
        logoDecorative: true,
        brandTitle: "Boreal UI",
        brandDescription:
          "Engineered for precision. Built for accessible interfaces.",
        brandHref: "/",
        sections: defaultSections,
        bottomEnd: "Secure Environment",
      });

      const footer = screen.getByTestId("footer");

      expect(footer).toHaveClass("footerRoot");
      expect(footer).toHaveClass("themeClear");
      expect(footer).toHaveClass("layoutColumns");

      expect(screen.getByTestId("footer-brand")).toHaveClass("footerBrand");
      expect(screen.getByTestId("footer-brand-title")).toHaveClass(
        "footerBrandTitle",
      );
      expect(screen.getByTestId("footer-brand-description")).toHaveClass(
        "footerBrandDescription",
      );

      expect(screen.getByText("Boreal UI")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Engineered for precision. Built for accessible interfaces.",
        ),
      ).toBeInTheDocument();

      expect(screen.getByTestId("footer-sections")).toHaveClass(
        "footerSections",
      );
      expect(screen.getByTestId("footer-actions")).toHaveClass("footerActions");
      expect(screen.getByTestId("footer-bottom")).toHaveClass("footerBottom");
      expect(screen.getByTestId("footer-bottom-end")).toHaveTextContent(
        "Secure Environment",
      );
    });

    it("renders brand as a link when brandHref is provided", () => {
      renderFooter({
        layout: "columns",
        logo: <svg />,
        brandTitle: "Boreal UI",
        brandHref: "/",
        sections: [],
        socialLinks: [],
        showThemeSelect: false,
      });

      const brandLink = screen.getByRole("link", { name: "Boreal UI" });

      expect(brandLink).toHaveAttribute("href", "/");
      expect(brandLink).toHaveClass("footerBrandLink");
    });

    it("applies target and rel to the brand link", () => {
      renderFooter({
        layout: "columns",
        logo: <svg />,
        brandTitle: "Boreal UI",
        brandHref: "/",
        brandTarget: "_blank",
        brandRel: "external",
        sections: [],
        socialLinks: [],
        showThemeSelect: false,
      });

      const brandLink = screen.getByRole("link", { name: "Boreal UI" });
      expect(brandLink).toHaveAttribute("target", "_blank");
      expect(brandLink).toHaveAttribute("rel", "external");
    });

    it("renders brand as non-link content when brandHref is omitted", () => {
      renderFooter({
        layout: "columns",
        logo: <svg />,
        brandTitle: "Boreal UI",
        sections: [],
        socialLinks: [],
        showThemeSelect: false,
      });

      expect(
        screen.queryByRole("link", { name: "Boreal UI" }),
      ).not.toBeInTheDocument();

      expect(screen.getByTestId("footer-brand")).toBeInTheDocument();
      expect(screen.getByTestId("footer-brand-title")).toHaveTextContent(
        "Boreal UI",
      );
    });

    it("renders grouped footer sections with section headings and links", () => {
      renderFooter({
        layout: "columns",
        sections: defaultSections,
        socialLinks: [],
        showThemeSelect: false,
      });

      const resourcesNav = screen.getByRole("navigation", {
        name: "Resources links",
      });
      const legalNav = screen.getByRole("navigation", {
        name: "Legal links",
      });

      expect(resourcesNav).toBeInTheDocument();
      expect(legalNav).toBeInTheDocument();

      expect(within(resourcesNav).getByText("Resources")).toHaveClass(
        "footerSectionTitle",
      );
      expect(within(resourcesNav).getByTestId("footer-link-docs")).toHaveClass(
        "footerLink",
      );
      expect(
        within(resourcesNav).getByTestId("footer-link-docs"),
      ).toHaveAttribute("href", "/docs");

      expect(
        within(legalNav).getByTestId("footer-link-privacy"),
      ).toHaveAttribute("href", "/privacy");
      expect(within(legalNav).getAllByRole("listitem")).toHaveLength(2);
    });

    it("uses a custom section aria-label when provided", () => {
      renderFooter({
        layout: "columns",
        sections: [
          {
            title: "Resources",
            "aria-label": "Helpful resources",
            links: [{ label: "Docs", href: "/docs" }],
          },
        ],
        socialLinks: [],
        showThemeSelect: false,
      });

      expect(
        screen.getByRole("navigation", { name: "Helpful resources" }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole("navigation", { name: "Resources links" }),
      ).not.toBeInTheDocument();
    });

    it("uses the existing links prop as a fallback section when sections are omitted", () => {
      renderFooter({
        layout: "columns",
        sections: undefined,
        links: defaultLinks,
        socialLinks: [],
        showThemeSelect: false,
      });

      expect(screen.getByTestId("footer-sections")).toBeInTheDocument();

      const fallbackNav = screen.getByRole("navigation", {
        name: /footer site links/i,
      });

      expect(fallbackNav).toBeInTheDocument();
      expect(
        within(fallbackNav).getByTestId("footer-link-home"),
      ).toHaveAttribute("href", "/");
      expect(
        within(fallbackNav).getByTestId("footer-link-about-us"),
      ).toHaveTextContent("About Us");
    });

    it("does not render sections when sections and links are empty", () => {
      renderFooter({
        layout: "columns",
        sections: [],
        links: [],
        socialLinks: [],
        showThemeSelect: false,
      });

      expect(screen.queryByTestId("footer-sections")).not.toBeInTheDocument();
    });

    it("renders social links and theme select inside the actions region", () => {
      renderFooter({
        layout: "columns",
        sections: defaultSections,
        socialLinks: defaultSocialLinks,
        showThemeSelect: true,
      });

      const actions = screen.getByTestId("footer-actions");

      expect(actions).toHaveClass("footerActions");
      expect(within(actions).getByText("Connect")).toHaveClass(
        "footerSectionTitle",
      );
      expect(within(actions).getByTestId("footer-social")).toHaveClass(
        "footerSocial",
      );
      expect(within(actions).getByTestId("footer-theme-select")).toHaveClass(
        "footerThemeToggle",
      );
    });

    it("does not render the actions region when social links and theme select are omitted", () => {
      renderFooter({
        layout: "columns",
        sections: defaultSections,
        socialLinks: [],
        showThemeSelect: false,
      });

      expect(screen.queryByTestId("footer-actions")).not.toBeInTheDocument();
    });

    it("renders copyright in the bottom bar by default for columns layout", () => {
      renderFooter({
        layout: "columns",
        sections: defaultSections,
        socialLinks: [],
        showThemeSelect: false,
      });

      const bottom = screen.getByTestId("footer-bottom");
      const copyright = screen.getByTestId("footer-copyright");

      expect(bottom).toBeInTheDocument();
      expect(copyright).toHaveClass("footerBottomCopyright");
      expect(copyright).toHaveTextContent("© 2025 MyCompany");
    });

    it("can render copyright in the brand column when copyrightInBottom is false", () => {
      renderFooter({
        layout: "columns",
        logo: <svg />,
        brandTitle: "Boreal UI",
        copyrightInBottom: false,
        sections: [],
        socialLinks: [],
        showThemeSelect: false,
        bottomEnd: "Secure Environment",
      });

      const brand = screen.getByTestId("footer-brand");
      const copyright = screen.getByTestId("footer-copyright");

      expect(within(brand).getByText("© 2025 MyCompany")).toBeInTheDocument();
      expect(copyright).toHaveClass("footerCopyright");
      expect(screen.getByTestId("footer-bottom")).toBeInTheDocument();
      expect(screen.getByTestId("footer-bottom-end")).toHaveTextContent(
        "Secure Environment",
      );
    });

    it("does not render the bottom bar when copyright and bottomEnd are omitted", () => {
      renderFooter({
        layout: "columns",
        copyright: undefined,
        bottomEnd: undefined,
        sections: defaultSections,
        socialLinks: [],
        showThemeSelect: false,
      });

      expect(screen.queryByTestId("footer-bottom")).not.toBeInTheDocument();
    });

    it("uses labelId on bottom copyright in columns layout", () => {
      renderFooter({
        layout: "columns",
        labelId: "columns-footer-label",
        sections: defaultSections,
        socialLinks: [],
        showThemeSelect: false,
      });

      const footer = screen.getByRole("contentinfo");
      const copyright = screen.getByTestId("footer-copyright");

      expect(footer).toHaveAttribute("aria-labelledby", "columns-footer-label");
      expect(copyright).toHaveAttribute("id", "columns-footer-label");
    });
  });

  describe("accessibility", () => {
    it("has no axe violations in the inline layout", async () => {
      const { container } = renderFooter({
        "aria-label": "Footer",
        logo: <svg />,
        logoDecorative: true,
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no axe violations in the columns layout", async () => {
      const { container } = renderFooter({
        layout: "columns",
        "aria-label": "Footer",
        logo: <svg />,
        logoDecorative: true,
        brandTitle: "Boreal UI",
        brandDescription:
          "Accessible components for React and Next.js applications.",
        brandHref: "/",
        sections: defaultSections,
        bottomEnd: "Secure Environment",
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
