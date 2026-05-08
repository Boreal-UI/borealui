import { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Dropdown,
  RoundingType,
  ShadowType,
  StateType,
  ThemeType,
} from "../../src/index.next";
import { FaEllipsisV, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import type { DropdownProps } from "../../src/components/Dropdown/Dropdown.types";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";

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

const meta: Meta<DropdownProps> = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  args: {
    theme: "primary",
    align: "right",
  },
};

export default meta;

type Story = StoryObj<DropdownProps>;

export const WithActions: Story = {
  args: {
    items: [
      {
        label: "Profile",
        icon: <FaUser />,
        onClick: () => alert("View Profile"),
      },
      {
        label: "Settings",
        icon: <FaCog />,
        onClick: () => alert("Settings clicked"),
      },
      {
        label: "Logout",
        icon: <FaSignOutAlt />,
        onClick: () => alert("Logged out"),
        "data-testid": "logout-button",
      },
    ],
  },
};

export const WithLinks: Story = {
  args: {
    items: [
      {
        label: "Home",
        href: "/",
        icon: <FaUser />,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: <FaCog />,
      },
    ],
  },
};

export const AlignmentVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <p>Left Aligned</p>
        <Dropdown
          align="left"
          triggerIcon={FaEllipsisV}
          items={[{ label: "Left 1" }, { label: "Left 2" }]}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <p>Right Aligned</p>
        <Dropdown
          align="right"
          triggerIcon={FaEllipsisV}
          items={[{ label: "Right 1" }, { label: "Right 2" }]}
        />
      </div>
    </div>
  ),
};

export const Themed: Story = {
  render: () => {
    return (
      <div style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
        {themeOptions.map((theme) => (
          <div key={theme} style={{ textAlign: "center" }}>
            <p style={{ marginBottom: "0.5rem", textTransform: "capitalize" }}>
              {theme}
            </p>
            <Dropdown
              triggerIcon={FaEllipsisV}
              theme={theme}
              items={[{ label: `Item (${theme})`, onClick: () => {} }]}
            />
          </div>
        ))}
      </div>
    );
  },
};

export const States: Story = {
  render: () => {
    const stateOptions: StateType[] = ["success", "error", "warning"];

    return (
      <StoryGrid title="State Variants">
        {stateOptions.map((state) => (
          <div key={state} style={{ textAlign: "center" }}>
            <p style={{ marginBottom: "0.5rem", textTransform: "capitalize" }}>
              {state}
            </p>
            <Dropdown
              triggerIcon={FaEllipsisV}
              state={state}
              items={[{ label: `Item (${state})`, onClick: () => {} }]}
            />
          </div>
        ))}
      </StoryGrid>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: () => {
    return (
      <StoryGrid title="Glass Theme Variants">
        {themeOptions.map((theme) => (
          <div key={theme} style={{ textAlign: "center" }}>
            <p style={{ marginBottom: "0.5rem", textTransform: "capitalize" }}>
              {theme}
            </p>
            <Dropdown
              triggerIcon={FaEllipsisV}
              theme={theme}
              glass
              items={[{ label: `Glass item (${theme})`, onClick: () => {} }]}
              aria-label={`Glass ${theme} actions`}
            />
          </div>
        ))}
      </StoryGrid>
    );
  },
};

export const GlassStateVariants: Story = {
  render: () => {
    const stateOptions: StateType[] = ["success", "error", "warning"];

    return (
      <StoryGrid title="Glass State Variants">
        {stateOptions.map((state) => (
          <div key={state} style={{ textAlign: "center" }}>
            <p style={{ marginBottom: "0.5rem", textTransform: "capitalize" }}>
              {state}
            </p>
            <Dropdown
              triggerIcon={FaEllipsisV}
              state={state}
              glass
              items={[{ label: `Glass item (${state})`, onClick: () => {} }]}
              aria-label={`Glass ${state} actions`}
            />
          </div>
        ))}
      </StoryGrid>
    );
  },
};

export const MenuRoundingVariants = () => (
  <StoryGrid title="Menu Rounding Variants">
    {roundingOptions.map((rounding) => (
      <div key={rounding} style={{ textAlign: "center" }}>
        <p style={{ marginBottom: "0.5rem", textTransform: "capitalize" }}>
          {rounding}
        </p>
        <Dropdown
          key={rounding}
          menuRounding={rounding}
          toggleRounding={rounding}
          triggerIcon={FaEllipsisV}
          items={[{ label: `Item (${rounding})`, onClick: () => {} }]}
        />
      </div>
    ))}
  </StoryGrid>
);

export const MenuShadowVariants = () => (
  <StoryGrid title="Menu Shadow Variants">
    {shadowOptions.map((shadow) => (
      <div key={shadow} style={{ textAlign: "center" }}>
        <p style={{ marginBottom: "0.5rem", textTransform: "capitalize" }}>
          {shadow}
        </p>
        <Dropdown
          key={shadow}
          menuShadow={shadow}
          toggleShadow={shadow}
          triggerIcon={FaEllipsisV}
          items={[{ label: `Item (${shadow})`, onClick: () => {} }]}
        />
      </div>
    ))}
  </StoryGrid>
);
