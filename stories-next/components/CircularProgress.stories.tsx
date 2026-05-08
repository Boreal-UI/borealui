import { Meta, StoryObj } from "@storybook/nextjs-vite";
import CircularProgress from "../../src/components/CircularProgress/next/CircularProgress";
import type { CircularProgressProps } from "../../src/components/CircularProgress/CircularProgress.types";
import { withVariants } from "../../.storybook-core/helpers/withVariants";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import { StateType, ThemeType } from "@/types";

const sizeOptions = ["xs", "small", "medium", "large", "xl"] as const;

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "error", "warning"];

const shadowOptions = ["none", "light", "medium", "strong", "intense"];

const meta: Meta<CircularProgressProps> = {
  title: "Components/CircularProgress",
  component: CircularProgress,
  tags: ["autodocs"],
  args: {
    value: 75,
    min: 0,
    max: 100,
    label: "Progress",
    shadow: "none",
    showRaw: false,
    size: "medium",
    theme: "primary",
    state: "",
    className: "",
    "data-testid": "circular-progress",
  },
};

export default meta;
type Story = StoryObj<CircularProgressProps>;

const defaultArgs: CircularProgressProps = {
  value: 75,
  label: "Progress Score",
};

export const Default: Story = {};

export const ShowRawScore: Story = {
  args: {
    ...defaultArgs,
    showRaw: true,
  },
};

export const LowScore: Story = {
  args: {
    ...defaultArgs,
    value: 32,
    label: "Low Score",
  },
};

export const WarningZone: Story = {
  args: {
    ...defaultArgs,
    value: 58,
    label: "Warning Score",
  },
};

export const HighScore: Story = {
  args: {
    ...defaultArgs,
    value: 95,
    label: "Excellent Score",
  },
};

export const CustomRange: Story = {
  args: {
    value: 7,
    min: 0,
    max: 10,
    showRaw: true,
    label: "Custom Scale (0–10)",
  },
};

export const SizeVariants = () =>
  withVariants(CircularProgress, defaultArgs, [
    { propName: "size", values: [...sizeOptions] },
  ]);

export const ThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <CircularProgress
        key={theme}
        value={76}
        theme={theme}
        label={`Theme: ${theme}`}
      />
    ))}
  </StoryGrid>
);

export const GlassThemeVariants = () => (
  <StoryGrid title="Theme Variants">
    {themeOptions.map((theme) => (
      <CircularProgress
        key={theme}
        value={76}
        theme={theme}
        glass
        label={`Theme: ${theme}`}
      />
    ))}
  </StoryGrid>
);

export const StateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <CircularProgress
        key={state}
        value={76}
        state={state}
        label={`State: ${state}`}
      />
    ))}
  </StoryGrid>
);

export const GlassStateVariants = () => (
  <StoryGrid title="State Variants">
    {stateOptions.map((state) => (
      <CircularProgress
        key={state}
        value={76}
        state={state}
        glass
        label={`State: ${state}`}
      />
    ))}
  </StoryGrid>
);

export const ScoreRangeVariants = () => (
  <StoryGrid title="Various Scores">
    <CircularProgress value={15} label="Very Low" />
    <CircularProgress value={45} label="Below Avg" />
    <CircularProgress value={70} label="Okay" />
    <CircularProgress value={85} label="Strong" />
    <CircularProgress value={100} label="Perfect!" />
  </StoryGrid>
);

export const WithShowRaw = () => (
  <StoryGrid title="With Raw Value">
    <CircularProgress value={18} showRaw label="Raw: 18" />
    <CircularProgress value={56} showRaw label="Raw: 56" />
    <CircularProgress value={99} showRaw label="Raw: 99" />
  </StoryGrid>
);

export const CustomMinMaxExamples = () => (
  <StoryGrid title="Custom Min/Max">
    <CircularProgress value={3} min={0} max={5} label="Out of 5" showRaw />
    <CircularProgress value={7.5} min={0} max={10} label="Out of 10" showRaw />
    <CircularProgress value={43} min={0} max={50} label="Out of 50" showRaw />
  </StoryGrid>
);

export const ShadowVariants = () =>
  withVariants(CircularProgress, { ...defaultArgs }, [
    { propName: "shadow", values: shadowOptions },
  ]);

export const WithClassName: Story = {
  args: {
    ...defaultArgs,
    className: "storybook-circular-progress",
    value: 88,
    label: "With Custom Class",
  },
};

export const WithDataTestid: Story = {
  args: {
    ...defaultArgs,
    "data-testid": "circular-progress-test-id",
    value: 55,
    label: "With Data Testid",
  },
};
