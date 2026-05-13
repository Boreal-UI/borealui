import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { TagInput } from "../src/index.core";
import type { TagInputProps } from "../src/components/TagInput/TagInput.types";
import { withVariants } from "../.storybook-core/helpers/withVariants";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "./assets/OptionTypes";

const meta: Meta<TagInputProps> = {
  title: "Components/TagInput",
  component: TagInput,
  tags: ["autodocs"],
  args: {
    placeholder: "Add a tag...",
    theme: "primary",
    size: "medium",
    tags: ["react", "nextjs"],
  },
};

export default meta;

type Story = StoryObj<TagInputProps>;

export const Default: Story = {
  render: (args) => {
    const [tags, setTags] = useState(["react", "storybook"]);
    return <TagInput {...args} tags={tags} onChange={setTags} />;
  },
};

export const Empty: Story = {
  render: (args) => {
    const [tags, setTags] = useState<string[]>([]);
    return <TagInput {...args} tags={tags} onChange={setTags} />;
  },
};

export const SizeVariants: Story = {
  render: (args) => {
    const sizes: TagInputProps["size"][] = [
      "xs",
      "small",
      "medium",
      "large",
      "xl",
    ];
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {sizes.map((size) => {
          const [tags, setTags] = useState(["react", "nextjs"]);
          return (
            <TagInput
              key={size}
              {...args}
              size={size}
              tags={tags}
              onChange={setTags}
              placeholder={`Add ${size} tag...`}
            />
          );
        })}
      </div>
    );
  },
};

export const ThemeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {themeOptions.map((theme) => {
          const [tags, setTags] = useState(["react", "nextjs"]);

          return (
            <TagInput
              key={theme}
              {...args}
              theme={theme}
              tags={tags}
              onChange={setTags}
              placeholder={`Add ${theme} tag...`}
            />
          );
        })}
      </div>
    );
  },
};

export const StateVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {stateOptions.map((state) => {
          const [tags, setTags] = useState(["react", "nextjs"]);

          return (
            <TagInput
              key={state}
              {...args}
              state={state}
              tags={tags}
              onChange={setTags}
              placeholder={`Add ${state} tag...`}
            />
          );
        })}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {themeOptions.map((theme) => {
          const [tags, setTags] = useState(["react", "nextjs"]);

          return (
            <TagInput
              key={`glass-${theme}`}
              {...args}
              theme={theme}
              glass
              tags={tags}
              onChange={setTags}
              placeholder={`Add ${theme} glass tag...`}
            />
          );
        })}
      </div>
    );
  },
};

export const GlassStateVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {stateOptions.map((state) => {
          const [tags, setTags] = useState(["react", "nextjs"]);

          return (
            <TagInput
              key={`glass-${state}`}
              {...args}
              state={state}
              glass
              tags={tags}
              onChange={setTags}
              placeholder={`Add ${state} glass tag...`}
            />
          );
        })}
      </div>
    );
  },
};

export const WithOnChangeAlert: Story = {
  render: (args) => {
    const [tags, setTags] = useState(["typescript"]);
    return (
      <TagInput
        {...args}
        tags={tags}
        onChange={(updated) => {
          setTags(updated);
          alert("Tags updated: " + updated.join(", "));
        }}
      />
    );
  },
};

export const RoundingVariants = (args: React.ComponentProps<typeof TagInput>) =>
  withVariants(TagInput, { ...args }, [
    { propName: "rounding", values: roundingOptions },
  ]);

export const ShadowVariants = (args: React.ComponentProps<typeof TagInput>) =>
  withVariants(TagInput, { ...args }, [
    { propName: "shadow", values: shadowOptions },
  ]);

export const WithSuggestions: Story = {
  render: (args) => {
    const [tags, setTags] = useState<string[]>([]);

    const allSuggestions = [
      "react",
      "nextjs",
      "typescript",
      "storybook",
      "vite",
      "tailwind",
      "graphql",
      "eslint",
      "prettier",
    ];

    const fetchSuggestions = async (query: string): Promise<string[]> => {
      if (!query.trim()) return [];
      await new Promise((res) => setTimeout(res, 200));
      return allSuggestions.filter((tag) =>
        tag.toLowerCase().includes(query.toLowerCase()),
      );
    };

    return (
      <TagInput
        {...args}
        tags={tags}
        onChange={setTags}
        fetchSuggestions={fetchSuggestions}
        debounceMs={400}
        placeholder="Type to get tag suggestions..."
        aria-description="Try typing 'r', 't', or 'g' to see suggestions."
      />
    );
  },
};
