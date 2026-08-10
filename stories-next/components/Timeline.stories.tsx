import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaRocket, FaCalendarAlt, FaCheckCircle } from "../../shared-story-assets/icons";
import { ThemeType, Timeline } from "../../src/index.next";
import type { TimelineProps } from "../../src/components/Timeline/Timeline.types";
import { withVariants } from "../../.storybook-core/helpers/withVariants";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const roundingOptions = ["none", "small", "medium", "large"];
const shadowOptions = ["none", "light", "medium", "strong", "intense"];

const sampleEvents = [
  {
    title: "Project Kickoff",
    description: "Initial planning and stakeholder alignment.",
    date: "2025-01-01",
    icon: FaRocket,
  },
  {
    title: "Requirements Finalized",
    description: "All business and technical requirements approved.",
    date: "2025-02-15",
    icon: FaCalendarAlt,
  },
  {
    title: "Development Phase",
    description: "Coding, testing, and QA in progress.",
    date: "2025-04-01",
  },
  {
    title: "Launch",
    description: "Product released to market.",
    date: "2025-06-30",
    icon: FaCheckCircle,
  },
];

const meta: Meta<TimelineProps> = {
  title: "Components/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  args: {
    orientation: "vertical",
    theme: "primary",
    items: sampleEvents,
  },
};

export default meta;
type Story = StoryObj<TimelineProps>;

export const Vertical: Story = {
  args: {
    items: sampleEvents,
    orientation: "vertical",
  },
};

export const Horizontal: Story = {
  args: {
    items: sampleEvents,
    orientation: "horizontal",
  },
};

export const WithoutIcons: Story = {
  args: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    items: sampleEvents.map(({ icon, ...rest }) => rest),
  },
};

export const LoadingVertical: Story = {
  args: {
    items: sampleEvents,
    loading: true,
  },
};

export const LoadingHorizontal: Story = {
  args: {
    items: sampleEvents,
    loading: true,
    orientation: "horizontal",
  },
};

export const ThemeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "2rem" }}>
        {themeOptions.map((theme) => (
          <Timeline key={theme} {...args} theme={theme} items={sampleEvents} />
        ))}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "2rem" }}>
        {themeOptions.map((theme) => (
          <Timeline
            key={`glass-${theme}`}
            {...args}
            theme={theme}
            variant="glass"
            items={sampleEvents}
          />
        ))}
      </div>
    );
  },
};

export const RoundingVariants = (args: React.ComponentProps<typeof Timeline>) =>
  withVariants(Timeline, { ...args }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = (args: React.ComponentProps<typeof Timeline>) =>
  withVariants(Timeline, { ...args }, [
    { propName: "shadow", values: shadowOptions },
  ]);
