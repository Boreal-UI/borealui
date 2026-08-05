import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Avatar } from "../../src/index.next";
import { withVariants } from "../../.storybook-core/helpers/withVariants";
import { StoryGrid } from "../../.storybook-core/helpers/StoryGrid";
import {
  SizeType,
  StateType,
  StatusPositionType,
  StatusType,
  ThemeType,
} from "../../src/types/types";
import { FaStar } from "../../shared-story-assets/icons";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../../shared-story-assets/VisualVariantStories";

const themeOptions = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
];
const stateOptions = ["success", "error", "warning"];
const sizeOptions = [...["xs", "small", "medium", "large", "xl"]] as string[];
const shapeOptions = [...["circle", "rounded", "square"]] as string[];
const shadowOptions = ["none", "light", "medium", "strong", "intense"];
const statusOptions = [
  ...["online", "away", "offline", "busy", "custom"],
] as string[];
const statusPositionOptions = [
  ...["topLeft", "topRight", "bottomLeft", "bottomRight"],
] as string[];

const iconMap = {
  custom: <FaStar />,
};

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Avatar>;

const defaultArgs = {
  name: "Davin Chiupka",
  theme: "primary" as ThemeType,
  state: "" as StateType,
  size: "medium" as SizeType,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const WithImage: Story = {
  args: {
    ...defaultArgs,
    src: "https://i.pravatar.cc/150?img=12",
    shape: "circle",
    theme: "secondary",
  },
};

export const WithHref: Story = {
  args: {
    ...defaultArgs,
    href: "https://github.com",
    shape: "square",
    status: "online",
  },
};

export const WithFallback: Story = {
  args: {
    ...defaultArgs,
    name: undefined,
    src: "broken-link.png",
  },
};

export const WithChildren: Story = {
  args: {
    ...defaultArgs,
    children: <strong>👽</strong>,
    theme: "warning" as ThemeType,
    shape: "circle",
  },
};

export const WithStatusIcon: Story = {
  args: {
    ...defaultArgs,
    statusIcon: <span style={{ fontSize: 12 }}>⭐</span>,
    theme: "secondary",
    shape: "square",
    size: "large",
  },
};

export const WithOnClick: Story = {
  args: {
    ...defaultArgs,
    name: "Clickable Avatar",
    shape: "circle",
    theme: "success" as ThemeType,
    onClick: () => alert("Avatar clicked!"),
  },
};

export const StatusPositionVariants = () => (
  <StoryGrid title="Status Positions" columns={4}>
    {statusPositionOptions.map((pos) => (
      <Avatar
        key={pos}
        {...defaultArgs}
        status="online"
        statusPosition={pos as StatusPositionType}
        theme="primary"
        shape="circle"
      />
    ))}
  </StoryGrid>
);

export const ShadowVariants = () =>
  withVariants(
    Avatar,
    {
      ...defaultArgs,
      name: "Shadow Avatar",
      shape: "circle",
    },
    [
      {
        propName: "shadow",
        values: shadowOptions,
      },
    ],
  );

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    disabled: true,
    onClick: () => alert("Avatar clicked!"),
  },
};

export const SizeVariants = () =>
  withVariants(Avatar, { ...defaultArgs }, [
    {
      propName: "size",
      values: sizeOptions,
    },
  ]);

export const ShapeVariants = () =>
  withVariants(
    Avatar,
    {
      name: "Davin Chiupka",
      theme: "primary",
      size: "medium",
      shape: "circle",
    },
    [
      {
        propName: "shape",
        values: shapeOptions,
      },
    ],
  );

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {statusOptions.map((status) => (
        <div key={status} style={{ textAlign: "center" }}>
          <Avatar
            name={status}
            status={status as StatusType}
            statusIcon={iconMap[status as keyof typeof iconMap] ?? undefined}
          />
          <div style={{ fontSize: "0.75rem", marginTop: 4 }}>{status}</div>
        </div>
      ))}
    </div>
  ),
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: Avatar, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: Avatar, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: Avatar, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: Avatar, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: Avatar, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: Avatar, args }),
};
