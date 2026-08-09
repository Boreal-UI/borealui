import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { Pager } from "../src/index.core";
import type { PaginationProps } from "../src/components/Pager/Pager.types";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
} from "../shared-story-assets/OptionTypes";

const meta: Meta<PaginationProps> = {
  title: "Components/Pager",
  component: Pager,
  tags: ["autodocs"],
  args: {
    totalItems: 20,
    itemsPerPage: 2,
    size: "small",
    theme: "primary",
  },
};

export default meta;

type Story = StoryObj<PaginationProps>;

export const Default: Story = {
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(1);
    const start = (currentPage - 1) * args.itemsPerPage;
    const items = Array.from(
      { length: args.totalItems },
      (_, i) => `Item ${i + 1}`,
    );
    const pageItems = items.slice(start, start + args.itemsPerPage);

    return (
      <div style={{ display: "grid", gap: "1rem", maxWidth: "500px" }}>
        <div>
          {pageItems.map((item) => (
            <div
              key={item}
              style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}
            >
              {item}
            </div>
          ))}
        </div>
        <Pager
          {...args}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  },
};

export const WithManyPages: Story = {
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(6);
    return (
      <Pager
        {...args}
        totalItems={120}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  },
};

export const SizeVariants: Story = {
  render: (args) => {
    const sizes = ["xs", "small", "medium", "large", "xl"] as const;
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {sizes.map((size) => {
          const [page, setPage] = useState(1);
          return (
            <Pager
              key={size}
              {...args}
              size={size}
              currentPage={page}
              onPageChange={setPage}
            />
          );
        })}
      </div>
    );
  },
};

export const ThemeVariants: Story = {
  render: (args) => {
    const themes = [
      "primary",
      "secondary",
      "tertiary",
      "quaternary",
      "clear",
    ] as const;

    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {themes.map((theme) => {
          const [page, setPage] = useState(1);
          return (
            <Pager
              key={theme}
              {...args}
              theme={theme}
              currentPage={page}
              onPageChange={setPage}
            />
          );
        })}
      </div>
    );
  },
};

export const GlassThemeVariants: Story = {
  render: (args) => {
    const themes = [
      "primary",
      "secondary",
      "tertiary",
      "quaternary",
      "clear",
    ] as const;

    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {themes.map((theme) => {
          const [page, setPage] = useState(1);
          return (
            <Pager
              key={`glass-${theme}`}
              {...args}
              theme={theme}
              variant="glass"
              currentPage={page}
              onPageChange={setPage}
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
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {stateOptions.map((state) => {
          const [page, setPage] = useState(1);
          return (
            <Pager
              key={state}
              {...args}
              state={state}
              currentPage={page}
              onPageChange={setPage}
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
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {stateOptions.map((state) => {
          const [page, setPage] = useState(1);
          return (
            <Pager
              key={`glass-${state}`}
              {...args}
              state={state}
              variant="glass"
              currentPage={page}
              onPageChange={setPage}
            />
          );
        })}
      </div>
    );
  },
};

export const RoundingVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {roundingOptions.map((rounding) => {
          const [page, setPage] = useState(1);
          return (
            <Pager
              key={rounding}
              {...args}
              rounding={rounding}
              currentPage={page}
              onPageChange={setPage}
            />
          );
        })}
      </div>
    );
  },
};

export const ShadowVariants: Story = {
  render: (args) => {
    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {shadowOptions.map((shadow) => {
          const [page, setPage] = useState(1);
          return (
            <Pager
              key={shadow}
              {...args}
              shadow={shadow}
              currentPage={page}
              onPageChange={setPage}
            />
          );
        })}
      </div>
    );
  },
};
