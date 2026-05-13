import React, { JSX, useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { FaCode, FaImage, FaMusic } from "react-icons/fa";
import { Tabs } from "../src/index.core";
import type { TabsProps, Tab } from "../src/components/Tabs/Tabs.types";
import { withVariants } from "../.storybook-core/helpers/withVariants";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "./assets/OptionTypes";

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
  defaultIndex = 0,
  value,
  onChange,
  ...args
}: TabsWithPanelProps): JSX.Element {
  const isControlled = typeof value === "number";
  const [active, setActive] = useState<number>(defaultIndex);

  const currentIndex = isControlled ? value : active;

  const handleChange = (index: number): void => {
    if (!isControlled) setActive(index);
    onChange?.(index);
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
        onChange={handleChange}
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
    defaultIndex: 0,
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
            glass
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
            glass
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
      onChange={(index) => {
        args.onChange?.(index);
      }}
    />
  ),
};

export const RoundingVariants = (args: TabsProps) =>
  withVariants(Tabs, { ...args, tabs: tabsWithIcons }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = (args: TabsProps) =>
  withVariants(Tabs, { ...args, tabs: tabsWithIcons }, [
    { propName: "shadow", values: shadowOptions },
  ]);
