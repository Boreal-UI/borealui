import { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  AttachmentType,
  IconButton,
  RoundingType,
  ShadowType,
  ThemeType,
  Toolbar,
} from "../../src/index.next";
import { FaBell, FaArrowLeft } from "../../shared-story-assets/icons";
import type { ToolbarBaseProps } from "../../src/components/Toolbar/Toolbar.types";
import { withVariants } from "../../.storybook-core/helpers/withVariants";

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

const attachmentOptions: AttachmentType[] = ["static", "fixed", "sticky"];

const meta: Meta<ToolbarBaseProps> = {
  title: "Components/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  args: {
    title: "Dashboard",
    theme: "primary",
    attachment: "static",
  },
};

export default meta;
type Story = StoryObj<ToolbarBaseProps>;

const leftIcon = (
  <IconButton
    theme="clear"
    shadow="none"
    icon={FaArrowLeft}
    aria-label="Back"
  />
);
const rightIcon = (
  <IconButton
    theme="clear"
    shadow="none"
    icon={FaBell}
    aria-label="Notifications"
  />
);

export const Default: Story = {
  args: {
    left: leftIcon,
    right: rightIcon,
  },
};

export const WithAvatar: Story = {
  args: {
    left: leftIcon,
    right: rightIcon,
    avatar: {
      name: "Davin Chiupka",
      onClick: () => alert("Avatar clicked"),
    },
  },
};

export const CustomClassNames: Story = {
  args: {
    title: "Custom toolbar",
    left: leftIcon,
    center: <span>Workspace</span>,
    right: rightIcon,
    avatar: {
      name: "Davin Chiupka",
    },
    className: "storybook-toolbar",
    leftClassName: "storybook-toolbar-left-alias",
    centerClassName: "storybook-toolbar-center-alias",
    rightClassName: "storybook-toolbar-right-alias",
    leftSectionClassName: "storybook-toolbar-left",
    centerSectionClassName: "storybook-toolbar-center",
    rightSectionClassName: "storybook-toolbar-right",
    leftContentClassName: "storybook-toolbar-left-content",
    centerContentClassName: "storybook-toolbar-center-content",
    rightContentClassName: "storybook-toolbar-right-content",
    titleClassName: "storybook-toolbar-title",
    avatarWrapperClassName: "storybook-toolbar-avatar",
    avatarClassName: "storybook-toolbar-avatar-button",
  },
};

export const ThemedVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <Toolbar
            key={theme}
            {...args}
            theme={theme}
            title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`}
            left={leftIcon}
            right={rightIcon}
          />
        ))}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        {themeOptions.map((theme) => (
          <Toolbar
            key={`glass-${theme}`}
            {...args}
            theme={theme}
            variant="glass"
            title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Glass`}
            left={leftIcon}
            right={rightIcon}
            avatar={{ name: "Davin Chiupka" }}
          />
        ))}
      </div>
    );
  },
};

export const AttachmentVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1rem", minHeight: "200vh" }}>
        {attachmentOptions.map((attachment) => (
          <div key={attachment} style={{ minHeight: "200vh" }}>
            <Toolbar
              {...args}
              attachment={attachment}
              title={`Attachment: ${attachment}`}
              left={leftIcon}
              right={rightIcon}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const RoundingVariants = (args: React.ComponentProps<typeof Toolbar>) =>
  withVariants(Toolbar, { ...args }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = (args: React.ComponentProps<typeof Toolbar>) =>
  withVariants(Toolbar, { ...args }, [
    { propName: "shadow", values: shadowOptions },
  ]);
