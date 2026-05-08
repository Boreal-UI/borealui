import { Meta, StoryObj } from "@storybook/react-vite";
import {
  RoundingType,
  ShadowType,
  Sidebar,
  StateType,
  ThemeType,
} from "../src/index.core";
import { SidebarProps } from "../src/components/Sidebar/Sidebar.types";
import { FaBook, FaPaperclip, FaCogs, FaCalendar } from "react-icons/fa";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";

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
    outline: false,
    rounding: "medium",
    shadow: "light",
    showFooter: false,
  },
};

export default meta;
type Story = StoryObj<SidebarProps>;

export const Default: Story = {};

export const OutlineVariants = () => (
  <StoryGrid title="Outline Sidebars">
    {themeOptions.map((theme) => (
      <Sidebar key={theme} theme={theme} outline links={mockLinks} />
    ))}
    {stateOptions.map((state) => (
      <Sidebar key={state} state={state} outline links={mockLinks} />
    ))}
  </StoryGrid>
);

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <Sidebar key={theme} theme={theme} links={mockLinks} />
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <Sidebar key={state} state={state} links={mockLinks} />
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Glass Theme Variants">
    {themeOptions.map((theme) => (
      <Sidebar key={theme} theme={theme} glass links={mockLinks} />
    ))}
  </StoryGrid>
);

export const GlassStateVariants = () => (
  <StoryGrid title="Glass State Variants">
    {stateOptions.map((state) => (
      <Sidebar key={state} state={state} glass links={mockLinks} />
    ))}
  </StoryGrid>
);

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
