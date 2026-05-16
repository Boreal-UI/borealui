import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "../src/index.core";
import type { EmptyStateProps } from "../src/components/EmptyState/EmptyState.types";
import { FaInbox, FaBug, FaFolderOpen } from "react-icons/fa";
import {
  roundingOptions,
  shadowOptions,
  sizeOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const meta: Meta<EmptyStateProps> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "Nothing to Show",
    message: "This section doesn't have any content yet.",
    theme: "primary",
    size: "medium",
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

export const ThemeVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {themeOptions.map((theme) => (
        <EmptyState
          key={theme}
          theme={theme}
          title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`}
          message={`This is a standard ${theme} variant.`}
        />
      ))}
    </div>
  ),
};

export const StateVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {stateOptions.map((state) => (
        <EmptyState
          key={state}
          state={state}
          title={`${state.charAt(0).toUpperCase() + state.slice(1)} state`}
          message={`This is a standard ${state} variant.`}
        />
      ))}
    </div>
  ),
};

export const GlassThemeVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {themeOptions.map((theme) => (
        <EmptyState
          key={`glass-${theme}`}
          theme={theme}
          glass
          icon={FaInbox}
          title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Glass`}
          message={`This is a glass ${theme} variant.`}
          actionLabel="Review"
          onActionClick={() => undefined}
        />
      ))}
    </div>
  ),
};

export const GlassStateVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {stateOptions.map((state) => (
        <EmptyState
          key={`glass-${state}`}
          state={state}
          glass
          icon={FaBug}
          title={`${state.charAt(0).toUpperCase() + state.slice(1)} Glass`}
          message={`This is a glass ${state} variant.`}
        />
      ))}
    </div>
  ),
};

export const GlassOutlineVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {themeOptions.map((theme) => (
        <EmptyState
          key={`outline-${theme}`}
          theme={theme}
          glass
          outline
          title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Outline`}
          message={`This is an outlined ${theme} variant.`}
        />
      ))}
      {stateOptions.map((state) => (
        <EmptyState
          key={`outline-${state}`}
          state={state}
          outline
          glass
          title={`${state.charAt(0).toUpperCase() + state.slice(1)} Outline`}
          message={`This is an outlined ${state} variant.`}
        />
      ))}
    </div>
  ),
};

export const OutlineVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {themeOptions.map((theme) => (
        <EmptyState
          key={`outline-${theme}`}
          theme={theme}
          outline
          title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Outline`}
          message={`This is an outlined ${theme} variant.`}
        />
      ))}
      {stateOptions.map((state) => (
        <EmptyState
          key={`outline-${state}`}
          state={state}
          outline
          title={`${state.charAt(0).toUpperCase() + state.slice(1)} Outline`}
          message={`This is an outlined ${state} variant.`}
        />
      ))}
    </div>
  ),
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

export const ThemeMatrix: Story = {
  render: (args) => renderThemeVariants({ component: EmptyState, args }),
};

export const StateMatrix: Story = {
  render: (args) => renderStateVariants({ component: EmptyState, args }),
};

export const OutlineMatrix: Story = {
  render: (args) => renderOutlineVariants({ component: EmptyState, args }),
};

export const GlassMatrix: Story = {
  render: (args) => renderGlassVariants({ component: EmptyState, args }),
};

export const GlassOutlineMatrix: Story = {
  render: (args) => renderGlassOutlineVariants({ component: EmptyState, args }),
};

export const StateOutlineMatrix: Story = {
  render: (args) => renderStateOutlineVariants({ component: EmptyState, args }),
};
