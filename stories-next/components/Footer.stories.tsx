import { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Footer,
  RoundingType,
  ShadowType,
  ThemeType,
} from "../../src/index.next";
import type { FooterProps } from "../../src/components/Footer/Footer.types";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaNpm,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import ThemeProvider from "../../src/context/ThemeContext";
import image from "../assets/tutorials.svg";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const roundingOptions: RoundingType[] = ["none", "small", "medium", "large"];

const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

const defaultLinks: FooterProps["links"] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const defaultSocialLinks: FooterProps["socialLinks"] = [
  {
    icon: FaGithub,
    href: "https://github.com",
    title: "GitHub",
  },
  {
    icon: FaTwitter,
    href: "https://twitter.com",
    title: "Twitter",
  },
  {
    icon: FaLinkedin,
    href: "https://linkedin.com",
    title: "LinkedIn",
  },
];

const columnSections: FooterProps["sections"] = [
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Components", href: "/docs/components" },
      { label: "Changelog", href: "/changelog" },
      {
        label: "GitHub",
        href: "https://github.com/DaveC6662/borealui",
        target: "_blank",
        rel: "noreferrer",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "License", href: "/license" },
    ],
  },
];

const columnSocialLinks: FooterProps["socialLinks"] = [
  {
    icon: FaGithub,
    href: "https://github.com/DaveC6662/borealui",
    title: "GitHub",
  },
  {
    icon: FaNpm,
    href: "https://www.npmjs.com/package/boreal-ui",
    title: "NPM",
  },
  {
    icon: FaYoutube,
    href: "https://www.youtube.com/@Boreal-UI",
    title: "YouTube",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/borealui/",
    title: "Instagram",
  },
];

const meta: Meta<FooterProps> = {
  title: "Components/Footer",
  component: Footer,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div
          style={{
            minHeight: "40vh",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div style={{ width: "100%" }}>
            <Story />
          </div>
        </div>
      </ThemeProvider>
    ),
  ],
  args: {
    theme: "primary",
    showThemeSelect: false,
    attachment: "static",
    rounding: "none",
    shadow: "none",
  },
  argTypes: {
    theme: {
      control: "select",
      options: themeOptions,
    },
    layout: {
      control: "select",
      options: ["inline", "columns"],
    },
    rounding: {
      control: "select",
      options: roundingOptions,
    },
    shadow: {
      control: "select",
      options: shadowOptions,
    },
    attachment: {
      control: "select",
      options: ["static", "sticky", "fixed"],
    },
    showThemeSelect: {
      control: "boolean",
    },
    copyrightInBottom: {
      control: "boolean",
    },
    logoDecorative: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<FooterProps>;

export const Default: Story = {
  args: {
    copyright: "© 2025 Your Company",
    links: defaultLinks,
    logo: image,
    socialLinks: defaultSocialLinks,
  },
};

export const ColumnsLayout: Story = {
  args: {
    layout: "columns",
    theme: "clear",
    logo: image,
    logoDecorative: true,
    brandHref: "/",
    brandTitle: "Boreal UI",
    brandDescription:
      "Engineered for precision. Built for developers who demand the best in performance and aesthetics.",
    copyright: "© 2026 Davin Chiupka. MIT License.",
    bottomEnd: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span aria-hidden="true">◊</span>
        Secure Environment
      </span>
    ),
    sections: columnSections,
    socialLinks: columnSocialLinks,
  },
};

export const ColumnsWithThemeSelect: Story = {
  args: {
    ...ColumnsLayout.args,
    showThemeSelect: true,
    bottomEnd: "Theme-aware footer",
  },
};

export const ColumnsWithoutSocial: Story = {
  args: {
    ...ColumnsLayout.args,
    socialLinks: [],
    bottomEnd: "No social links",
  },
};

export const ColumnsLinksFallback: Story = {
  args: {
    layout: "columns",
    theme: "secondary",
    logo: image,
    brandTitle: "Fallback Sections",
    brandDescription:
      "When sections are not provided, the existing links prop can still render as a footer section.",
    copyright: "© 2026 Your Company",
    links: defaultLinks,
    bottomEnd: "Uses links prop",
  },
};

export const ThemeSelect: Story = {
  args: {
    ...Default.args,
    showThemeSelect: true,
  },
};

export const Themes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "2rem" }}>
      {themeOptions.map((theme) => (
        <div key={theme} style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <h3 style={{ textTransform: "capitalize" }}>{theme} theme</h3>

          <Footer
            {...args}
            theme={theme}
            copyright={`© 2025 Your Company (${theme})`}
            showThemeSelect
          />
        </div>
      ))}
    </div>
  ),
  args: {
    ...Default.args,
  },
};

export const ColumnThemes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "2rem" }}>
      {themeOptions.map((theme) => (
        <div key={theme} style={{ border: "1px solid #ccc", padding: "1rem" }}>
          <h3 style={{ textTransform: "capitalize" }}>{theme} column theme</h3>

          <Footer
            {...args}
            theme={theme}
            copyright={`© 2026 Boreal UI (${theme})`}
          />
        </div>
      ))}
    </div>
  ),
  args: {
    ...ColumnsLayout.args,
  },
};

export const GlassThemes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "2rem" }}>
      {themeOptions.map((theme) => (
        <Footer
          key={`glass-${theme}`}
          {...args}
          theme={theme}
          variant="glass"
          copyright={`Â© 2025 Your Company (${theme} glass)`}
          showThemeSelect
        />
      ))}
    </div>
  ),
  args: {
    ...Default.args,
  },
};

export const GlassColumnThemes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "2rem" }}>
      {themeOptions.map((theme) => (
        <Footer
          key={`glass-column-${theme}`}
          {...args}
          theme={theme}
          variant="glass"
          copyright={`Â© 2026 Boreal UI (${theme} glass)`}
        />
      ))}
    </div>
  ),
  args: {
    ...ColumnsLayout.args,
  },
};

export const LinksOnly: Story = {
  args: {
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
};

export const SocialOnly: Story = {
  args: {
    socialLinks: [
      {
        icon: FaGithub,
        href: "https://github.com",
        title: "GitHub",
      },
    ],
  },
};

export const BrandOnlyColumns: Story = {
  args: {
    layout: "columns",
    theme: "clear",
    logo: image,
    brandTitle: "Boreal UI",
    brandDescription:
      "A simple brand-focused footer with no sections or social links.",
    copyright: "© 2026 Boreal UI",
  },
};

export const RoundingVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {roundingOptions.map((rounding) => (
        <Footer
          key={`rounding-${rounding}`}
          rounding={rounding}
          copyright={`Rounding ${
            rounding.charAt(0).toUpperCase() + rounding.slice(1)
          }`}
          links={defaultLinks}
        />
      ))}
    </div>
  ),
};

export const ShadowVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {shadowOptions.map((shadow) => (
        <Footer
          key={`shadow-${shadow}`}
          shadow={shadow}
          copyright={`Shadow ${shadow.charAt(0).toUpperCase() + shadow.slice(1)}`}
          links={defaultLinks}
        />
      ))}
    </div>
  ),
};
