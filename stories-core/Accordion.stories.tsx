import React, { useState } from "react";
import "../src/components/Accordion/core/Accordion.scss";
import { Accordion } from "../src/index.core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { withVariants } from "../.storybook-core/helpers/withVariants";
import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "../src/types/types";

Accordion.displayName = "Accordion";

const themeOptions: ThemeType[] = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];

const stateOptions: StateType[] = ["success", "error", "warning"];
const sizeOptions: SizeType[] = ["xs", "small", "medium", "large", "xl"];
const roundingOptions: RoundingType[] = ["none", "small", "medium", "large"];
const shadowOptions: ShadowType[] = [
  "none",
  "light",
  "medium",
  "strong",
  "intense",
];

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const defaultArgs = {
  title: "Sample Accordion",
  children: <p>This is the content revealed when expanded.</p>,
  size: "medium" as SizeType,
  theme: "primary" as ThemeType,
  state: "" as StateType,
  rounding: "medium" as RoundingType,
  shadow: "medium" as ShadowType,
  "data-testid": "accordion",
};

export const Default: Story = {
  args: {
    ...defaultArgs,
    title: "Default Accordion",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);

    return (
      <Accordion
        {...args}
        expanded={open}
        onToggle={(nextExpanded) => setOpen(nextExpanded)}
        customCollapsedIcon="⏵"
        customExpandedIcon="⏷"
      />
    );
  },
  args: {
    ...defaultArgs,
    title: "Controlled Accordion",
    children: <p>This accordion is fully controlled via external state.</p>,
  },
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    title: "Disabled Accordion",
    disabled: true,
  },
};

export const LazyAndAsync: Story = {
  args: {
    ...defaultArgs,
    title: "Lazy & Async Accordion",
    lazyLoad: true,
    asyncContent: true,
    loadingAriaLabel: "Loading accordion content",
    initiallyExpanded: false,
    children: (
      <div>
        <p>
          This content is both <strong>lazy-loaded</strong> and{" "}
          <strong>async-loaded</strong>.
        </p>
        <p>
          It is not rendered until the accordion is opened, then a simulated
          loading state is shown before the content appears.
        </p>
      </div>
    ),
  },
};

export const LotsOfContent: Story = {
  args: {
    ...defaultArgs,
    title: "Accordion With Lots of Content",
    initiallyExpanded: false,
    children: (
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
          lacinia odio vitae vestibulum vestibulum.
        </p>
        {[...Array(10)].map((_, i) => (
          <p key={i}>
            This is paragraph #{i + 1} of the accordion content. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas.
          </p>
        ))}
        <ul>
          {["Item A", "Item B", "Item C", "Item D", "Item E"].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>End of content.</p>
      </div>
    ),
  },
};

export const LazyLoadContent: Story = {
  args: {
    ...defaultArgs,
    title: "Lazy Loaded Accordion",
    lazyLoad: true,
    initiallyExpanded: false,
    children: (
      <div>
        <p>
          This content is <strong>not rendered</strong> until the accordion is
          expanded.
        </p>
      </div>
    ),
  },
};

export const IconOnLeft: Story = {
  args: {
    ...defaultArgs,
    title: "Icon on the Left",
    iconPosition: "left",
    initiallyExpanded: true,
    customCollapsedIcon: "▶",
    customExpandedIcon: "▼",
    children: (
      <p>
        The expand/collapse icon appears <strong>to the left</strong> of the
        title.
      </p>
    ),
  },
};

export const NonToggleableAccordion: Story = {
  args: {
    ...defaultArgs,
    title: "Non-Toggleable Accordion",
    initiallyExpanded: true,
    isToggleable: false,
    children: (
      <p>
        Once opened, this accordion cannot be closed. This is useful for locked
        or persistent sections.
      </p>
    ),
  },
};

export const WithDescription: Story = {
  args: {
    ...defaultArgs,
    title: "Accordion with Screen Reader Description",
    description: "This section contains tips for screen reader users.",
    initiallyExpanded: false,
    children: (
      <p>
        The description prop is visually hidden but announced to assistive
        technologies.
      </p>
    ),
  },
};

export const AccessibleRegionOverrides: Story = {
  args: {
    ...defaultArgs,
    title: "Accordion with Custom Region Accessibility",
    regionAriaLabel: "Additional details panel",
    regionAriaDescribedBy: "custom-region-help",
    children: (
      <div>
        <p id="custom-region-help">
          This panel uses explicit accessibility metadata for the content
          region.
        </p>
      </div>
    ),
  },
};

export const ThemeVariants = () =>
  withVariants(Accordion, { ...defaultArgs }, [
    { propName: "theme", values: themeOptions },
  ]);

export const GlassThemeVariants = () =>
  withVariants(Accordion, { ...defaultArgs, glass: true }, [
    { propName: "theme", values: themeOptions },
  ]);

export const StateVariants = () =>
  withVariants(Accordion, { ...defaultArgs }, [
    { propName: "state", values: stateOptions },
  ]);

export const GlassStateVariants = () =>
  withVariants(Accordion, { ...defaultArgs, glass: true }, [
    { propName: "state", values: stateOptions },
  ]);

export const SizeVariants = () =>
  withVariants(Accordion, { ...defaultArgs }, [
    { propName: "size", values: sizeOptions },
  ]);

export const RoundingVariants = () =>
  withVariants(Accordion, { ...defaultArgs }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = () =>
  withVariants(Accordion, { ...defaultArgs }, [
    { propName: "shadow", values: shadowOptions },
  ]);

export const OutlineVariants = () =>
  withVariants(
    Accordion,
    {
      ...defaultArgs,
      outline: true,
    },
    [{ propName: "theme", values: themeOptions }],
  );

export const GlassOutlineVariants = () =>
  withVariants(
    Accordion,
    {
      ...defaultArgs,
      outline: true,
      glass: true,
    },
    [{ propName: "theme", values: themeOptions }],
  );
