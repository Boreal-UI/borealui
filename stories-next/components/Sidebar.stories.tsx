import { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  RoundingType,
  ShadowType,
  Sidebar,
  StateType,
  ThemeType,
} from "../../src/index.next";
import { SidebarProps } from "../../src/components/Sidebar/Sidebar.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import { FaBook, FaCalendar, FaCogs, FaPaperclip } from "react-icons/fa";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];
const stateOptions: StateType[] = ["success", "error", "warning"];

const roundingOptions: RoundingType[] = ["none", "small", "medium", "large"];
const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

const mockLinks = [
  { label: "Dashboard", href: "/Dashboard", icon: <FaBook /> },
  {
    label: "Reports",
    children: [
      { label: "Monthly", icon: <FaCalendar /> },
      { label: "Annual", icon: <FaCalendar /> },
    ],
    icon: <FaPaperclip />,
  },
  { label: "Settings", href: "/Settings", icon: <FaCogs /> },
];

const meta: Meta<SidebarProps> = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  args: {
    links: mockLinks,
    theme: "primary",
    variant: "solid",
    rounding: "medium",
    shadow: "light",
    showFooter: false,
  },
};

export default meta;
type Story = StoryObj<SidebarProps>;

export const Default: Story = {};

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <Sidebar key={rounding} rounding={rounding} links={mockLinks} />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <Sidebar key={shadow} shadow={shadow} links={mockLinks} />
    ))}
  </StoryGrid>
);

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: Sidebar, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: Sidebar, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: Sidebar, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: Sidebar, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: Sidebar, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: Sidebar, args }),
};
