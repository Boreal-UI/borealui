import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MetricBox } from "../../src/index.next";
import type { MetricBoxProps } from "../../src/components/MetricBox/MetricBox.types";
import { FaChartLine, FaCheckCircle } from "../../shared-story-assets/icons";
import { withVariants } from "../../.storybook-core/helpers/withVariants";
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
} from "../../shared-story-assets/OptionTypes";

const meta: Meta<MetricBoxProps> = {
  title: "Components/MetricBox",
  component: MetricBox,
  tags: ["autodocs"],
  args: {
    title: "Users Online",
    value: "1,234",
    theme: "primary",
    align: "start",
    size: "medium",
    icon: FaChartLine,
    subtext: "Up 12% since last week",
  },
};

export default meta;

type Story = StoryObj<MetricBoxProps>;

export const Default: Story = {};

const defaultArgs: MetricBoxProps = {
  title: "Users Online",
  value: "1,234",
  theme: "primary",
  align: "center",
  size: "medium",
  icon: FaChartLine,
  subtext: "Up 12% since last week",
};

export const WithIcon: Story = {
  args: {
    icon: FaChartLine,
  },
};

export const WithSubtext: Story = {
  args: {
    icon: FaCheckCircle,
    subtext: "Up 12% since last week",
  },
};

export const WithUnits: Story = {
  args: {
    title: "Storage Used",
    value: 42,
    units: "GB",
    subtext: "Across active workspaces",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const AlignmentVariants: Story = {
  render: () => {
    const alignments = ["start", "center", "end"] as const;
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {alignments.map((align) => (
          <MetricBox
            key={align}
            title={`${align.charAt(0).toUpperCase() + align.slice(1)} Aligned`}
            value="91%"
            align={align}
          />
        ))}
      </div>
    );
  },
};

export const SizeVariants: Story = {
  render: () => {
    const sizes = ["xs", "small", "medium", "large", "xl"] as const;
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {sizes.map((size) => (
          <MetricBox key={size} {...defaultArgs} size={size} />
        ))}
      </div>
    );
  },
};

export const RoundingVariants = () =>
  withVariants(MetricBox, { ...defaultArgs }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = () =>
  withVariants(MetricBox, { ...defaultArgs }, [
    { propName: "shadow", values: shadowOptions },
  ]);

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: MetricBox, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: MetricBox, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: MetricBox, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: MetricBox, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: MetricBox, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: MetricBox, args }),
};
