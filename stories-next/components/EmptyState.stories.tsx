import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EmptyState } from "../../src/index.next";
import type { EmptyStateProps } from "../../src/components/EmptyState/EmptyState.types";
import { FaInbox, FaBug, FaFolderOpen } from "../../shared-story-assets/icons";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";
import {
  roundingOptions,
  shadowOptions,
  sizeOptions,
} from "../../shared-story-assets/OptionTypes";

const meta: Meta<EmptyStateProps> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "Nothing to Show",
    message: "This section doesn't have any content yet.",
    theme: "primary",
    size: "medium",
    actionLabel: "Take Action",
    onActionClick: () => alert("Action button clicked!"),
  },
};

export default meta;

type Story = StoryObj<EmptyStateProps>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    icon: FaInbox,
  },
};

export const CustomMessageAndTitle: Story = {
  args: {
    title: "No Results Found",
    message: "Try adjusting your filters or search term.",
    icon: FaFolderOpen,
  },
};

export const WithActionButton: Story = {
  args: {
    icon: FaBug,
    title: "Oops, something went wrong!",
    message: "Please try again or contact support.",
    actionLabel: "Retry",
    onActionClick: () => alert("Retry clicked"),
  },
};

export const SizeVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {sizeOptions.map((size) => (
        <EmptyState
          key={`size-${size}`}
          size={size}
          title={`${size.charAt(0).toUpperCase() + size.slice(1)} Size`}
          message={`This is a ${size} variant.`}
        />
      ))}
    </div>
  ),
};

export const RoundingVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {roundingOptions.map((rounding) => (
        <EmptyState
          key={`rounding-${rounding}`}
          rounding={rounding}
          title={`${rounding.charAt(0).toUpperCase() + rounding.slice(1)} Rounding`}
          message={`Rounding ${rounding}.`}
        />
      ))}
    </div>
  ),
};

export const ShadowVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {shadowOptions.map((shadow) => (
        <EmptyState
          key={`shadow-${shadow}`}
          shadow={shadow}
          title={`${shadow.charAt(0).toUpperCase() + shadow.slice(1)} Shadow`}
          message={`Shadow ${shadow}.`}
        />
      ))}
    </div>
  ),
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: EmptyState, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: EmptyState, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: EmptyState, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: EmptyState, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: EmptyState, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: EmptyState, args }),
};
