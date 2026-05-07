import React from "react";
import FooterBase from "../FooterBase";
import { FooterProps } from "../Footer.types";
import IconButton from "../../IconButton/core/IconButton";
import ThemeSelect from "../../Select/ThemeSelect/core/ThemeSelect";
import "./Footer.scss";

const classes = {
  footer: "footer",
  glass: "footer_glass",

  primary: "footer_primary",
  secondary: "footer_secondary",
  tertiary: "footer_tertiary",
  quaternary: "footer_quaternary",
  clear: "footer_clear",

  layoutColumns: "footer_layout-columns",

  shadowNone: "footer_shadow-None",
  shadowLight: "footer_shadow-Light",
  shadowMedium: "footer_shadow-Medium",
  shadowStrong: "footer_shadow-Strong",
  shadowIntense: "footer_shadow-Intense",

  roundNone: "footer_round-None",
  roundSmall: "footer_round-Small",
  roundMedium: "footer_round-Medium",
  roundLarge: "footer_round-Large",

  attachmentStatic: "footer_attachment-static",
  attachmentFixed: "footer_attachment-fixed",
  attachmentSticky: "footer_attachment-sticky",

  content: "footer_content",

  // Existing inline layout
  logo: "footer_logo",
  left: "footer_left",
  links: "footer_links",
  link: "footer_link",
  social: "footer_social",
  themeToggle: "footer_theme-toggle",
  copyright: "footer_copyright",

  // New column layout
  brand: "footer_brand",
  brandLink: "footer_brand-link",
  brandTitle: "footer_brand-title",
  brandDescription: "footer_brand-description",

  sections: "footer_sections",
  section: "footer_section",
  sectionTitle: "footer_section-title",
  sectionList: "footer_section-list",

  actions: "footer_actions",
  actionGroup: "footer_action-group",

  bottom: "footer_bottom",
  bottomCopyright: "footer_bottom-copyright",
  bottomEnd: "footer_bottom-end",
};

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <FooterBase
      {...props}
      IconButton={IconButton}
      ThemeSelect={ThemeSelect}
      classMap={classes}
    />
  );
};

Footer.displayName = "Footer";

export default Footer;
