import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dropdown, StateType } from "../src/index.core";
import { FaEllipsisV, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import type { DropdownProps } from "../src/components/Dropdown/Dropdown.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";
import {
  renderGlassOutlineVariants,
  renderGlassVariants,
  renderOutlineVariants,
  renderStateOutlineVariants,
  renderStateVariants,
  renderThemeVariants,
} from "../shared-story-assets/VisualVariantStories";

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

export const WithSubmenus: Story = {
  args: {
    "aria-label": "Project actions",
    items: [
      {
        label: "Profile",
        icon: <FaUser />,
        onClick: () => alert("View Profile"),
      },
      {
        label: "Settings",
        icon: <FaCog />,
        submenuAriaLabel: "Settings sections",
        items: [
          {
            label: "Account settings",
            onClick: () => alert("Account settings"),
          },
          {
            label: "Workspace settings",
            onClick: () => alert("Workspace settings"),
          },
          {
            label: "Advanced",
            items: [
              {
                label: "API access",
                onClick: () => alert("API access"),
              },
              {
                label: "Audit log",
                onClick: () => alert("Audit log"),
              },
            ],
          },
        ],
      },
      {
        label: "Logout",
        icon: <FaSignOutAlt />,
        onClick: () => alert("Logged out"),
      },
    ],
  },
};

export const SpaceAwareSubmenus: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        minHeight: "18rem",
        padding: "2rem",
      }}
    >
      <Dropdown
        align="left"
        triggerIcon={FaEllipsisV}
        aria-label="Left edge actions"
        items={[
          {
            label: "Create",
            items: [
              { label: "Document", onClick: () => alert("Document") },
              { label: "Dashboard", onClick: () => alert("Dashboard") },
            ],
          },
          { label: "Archive", onClick: () => alert("Archive") },
        ]}
      />
      <Dropdown
        align="right"
        triggerIcon={FaEllipsisV}
        aria-label="Right edge actions"
        items={[
          {
            label: "Export",
            items: [
              { label: "CSV", onClick: () => alert("CSV") },
              { label: "PDF", onClick: () => alert("PDF") },
              {
                label: "Developer formats",
                items: [
                  { label: "JSON", onClick: () => alert("JSON") },
                  { label: "XML", onClick: () => alert("XML") },
                ],
              },
            ],
          },
          { label: "Delete", onClick: () => alert("Delete") },
        ]}
      />
    </div>
  ),
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

const getVariantArgs = ({
  triggerIcon = FaEllipsisV,
  items = [{ label: "Variant item", onClick: () => {} }],
  ...args
}: DropdownProps): DropdownProps => ({
  ...args,
  triggerIcon,
  items,
});

export const ThemeVariants: Story = {
  render: (args) =>
    renderThemeVariants({ component: Dropdown, args: getVariantArgs(args) }),
};

export const StateVariants: Story = {
  render: (args) =>
    renderStateVariants({ component: Dropdown, args: getVariantArgs(args) }),
};

export const OutlineVariants: Story = {
  render: (args) =>
    renderOutlineVariants({ component: Dropdown, args: getVariantArgs(args) }),
};

export const GlassVariants: Story = {
  render: (args) =>
    renderGlassVariants({ component: Dropdown, args: getVariantArgs(args) }),
};

export const GlassOutlineVariants: Story = {
  render: (args) =>
    renderGlassOutlineVariants({
      component: Dropdown,
      args: getVariantArgs(args),
    }),
};

export const StateOutlineVariants: Story = {
  render: (args) =>
    renderStateOutlineVariants({
      component: Dropdown,
      args: getVariantArgs(args),
    }),
};
