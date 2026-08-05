import React, { JSX, useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaCode, FaImage, FaMusic } from "../../shared-story-assets/icons";
import { Tabs } from "../../src/index.next";
import type { TabsProps, Tab } from "../../src/components/Tabs/Tabs.types";
import { withVariants } from "../../.storybook-core/helpers/withVariants";

const themeOptions = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
] as const;
const stateOptions = ["success", "error", "warning"] as const;
const roundingOptions = ["none", "small", "medium", "large"] as const;
const shadowOptions = ["none", "light", "medium", "strong", "intense"] as const;

type PanelMap = Record<number, React.ReactNode>;

const tabsWithIcons: Tab[] = [
  { label: "Code", icon: FaCode },
  { label: "Music", icon: FaMusic },
  { label: "Images", icon: FaImage },
];

const tabsWithoutIcons: Tab[] = [
  { label: "Overview" },
  { label: "Details" },
  { label: "Settings" },
];

const panelsWithIcons: PanelMap = {
  0: <div>Code content goes here.</div>,
  1: <div>Music player or list here.</div>,
  2: <div>Gallery or image preview here.</div>,
};

const panelsWithoutIcons: PanelMap = {
  0: <p>Overview content.</p>,
  1: <p>Details content.</p>,
  2: <p>Settings content.</p>,
};

type TabsWithPanelProps = TabsProps & {
  panels: PanelMap;
  idBase?: string;
};

function TabsWithPanel({
  panels,
  idBase = "storybook-tabs",
  defaultValue = 0,
  value,
  onValueChange,
  ...args
}: TabsWithPanelProps): JSX.Element {
  const isControlled = typeof value === "number";
  const [active, setActive] = useState<number>(defaultValue);

  const currentIndex = isControlled ? (value as number) : active;

  const handleChange = (index: number): void => {
    if (!isControlled) setActive(index);
    onValueChange?.(index);
  };

  const panel = useMemo<React.ReactNode>(() => {
    return panels[currentIndex] ?? null;
  }, [panels, currentIndex]);

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <Tabs
        {...args}
        idBase={idBase}
        value={currentIndex}
        onValueChange={handleChange}
      />

      <div
        role="tabpanel"
        id={`${idBase}-panel-${currentIndex}`}
        aria-labelledby={`${idBase}-tab-${currentIndex}`}
        tabIndex={0}
        style={{
          padding: "1rem",
          border: "1px solid rgba(120,120,120,0.25)",
          borderRadius: 12,
        }}
      >
        {panel}
      </div>
    </div>
  );
}

const meta: Meta<TabsProps> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    theme: "primary",
    size: "medium",
    defaultValue: 0,
    tabs: tabsWithIcons,
  },
};

export default meta;

type Story = StoryObj<TabsProps>;

export const Default: Story = {
  render: (args) => (
    <TabsWithPanel
      {...args}
      idBase="tabs-default"
      tabs={tabsWithIcons}
      panels={panelsWithIcons}
    />
  ),
};

export const NoIcons: Story = {
  args: {
    tabs: tabsWithoutIcons,
  },
  render: (args) => (
    <TabsWithPanel
      {...args}
      idBase="tabs-without-icons"
      tabs={tabsWithoutIcons}
      panels={panelsWithoutIcons}
    />
  ),
};

export const ThemeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {themeOptions.map((theme) => (
          <TabsWithPanel
            key={theme}
            {...args}
            idBase={`tabs-theme-${theme}`}
            theme={theme}
            tabs={tabsWithIcons}
            panels={panelsWithIcons}
          />
        ))}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {stateOptions.map((state) => (
          <TabsWithPanel
            key={state}
            {...args}
            idBase={`tabs-state-${state}`}
            state={state}
            tabs={tabsWithIcons}
            panels={panelsWithIcons}
          />
        ))}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {themeOptions.map((theme) => (
          <TabsWithPanel
            key={theme}
            {...args}
            idBase={`tabs-glass-theme-${theme}`}
            theme={theme}
            variant="glass"
            tabs={tabsWithIcons}
            panels={panelsWithIcons}
          />
        ))}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {stateOptions.map((state) => (
          <TabsWithPanel
            key={state}
            {...args}
            idBase={`tabs-glass-state-${state}`}
            state={state}
            variant="glass"
            tabs={tabsWithIcons}
            panels={panelsWithIcons}
          />
        ))}
      </div>
    );
  },
};

export const SizeVariants: Story = {
  render: (args) => {
    const sizes = ["xs", "small", "medium", "large", "xl"] as const;
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {sizes.map((size) => (
          <TabsWithPanel
            key={size}
            {...args}
            idBase={`tabs-size-${size}`}
            size={size}
            tabs={tabsWithIcons}
            panels={panelsWithIcons}
          />
        ))}
      </div>
    );
  },
};

export const WithOnChange: Story = {
  render: (args) => (
    <TabsWithPanel
      {...args}
      idBase="tabs-onchange"
      tabs={tabsWithIcons}
      panels={panelsWithIcons}
      onValueChange={(index) => {
        args.onValueChange?.(index);
      }}
    />
  ),
};

export const RoundingVariants = (args: TabsProps) =>
  withVariants(Tabs, { ...args, tabs: tabsWithIcons }, [
    { propName: "rounding", values: roundingOptions as unknown as string[] },
  ]);

export const ShadowVariants = (args: TabsProps) =>
  withVariants(Tabs, { ...args, tabs: tabsWithIcons }, [
    { propName: "shadow", values: shadowOptions as unknown as string[] },
  ]);
