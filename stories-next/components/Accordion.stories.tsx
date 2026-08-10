import { useState } from "react";
import "../../src/components/Accordion/next/Accordion.module.scss";
import { Accordion } from "../../src/index.next";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { withVariants } from "../../.storybook-core/helpers/withVariants";
import {
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "../../src/types/types";
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

Accordion.displayName = "Accordion";

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
        onExpandedChange={(nextExpanded) => setOpen(nextExpanded)}
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
    defaultExpanded: false,
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
    defaultExpanded: false,
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
    defaultExpanded: false,
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
    defaultExpanded: true,
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
    defaultExpanded: true,
    disableCollapse: true,
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
    defaultExpanded: false,
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

export const ThemeVariants: Story = {
  render: (args) =>
    renderThemeVariants({
      component: Accordion,
      args: { ...defaultArgs, ...args },
    }),
};

export const StateVariants: Story = {
  render: (args) =>
    renderStateVariants({
      component: Accordion,
      args: { ...defaultArgs, ...args },
    }),
};

export const OutlineVariants: Story = {
  render: (args) =>
    renderOutlineVariants({
      component: Accordion,
      args: { ...defaultArgs, ...args },
    }),
};

export const GlassVariants: Story = {
  render: (args) =>
    renderGlassVariants({
      component: Accordion,
      args: { ...defaultArgs, ...args },
    }),
};

export const GlassOutlineVariants: Story = {
  render: (args) =>
    renderGlassOutlineVariants({
      component: Accordion,
      args: { ...defaultArgs, ...args },
    }),
};

export const StateOutlineVariants: Story = {
  render: (args) =>
    renderStateOutlineVariants({
      component: Accordion,
      args: { ...defaultArgs, ...args },
    }),
};
