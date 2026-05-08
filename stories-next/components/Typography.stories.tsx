import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Typography } from "../../src/index.next";
import type { TypographyVariant } from "../../src/components/Typography/Typography.types";

const variantOptions: TypographyVariant[] = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "body-lg",
  "body",
  "body-sm",
  "label",
  "caption",
  "overline",
  "code",
];

const meta: Meta<typeof Typography> = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Typography>;

const defaultArgs = {
  children: "The quick brown fox jumps over the lazy dog.",
  variant: "body",
  align: "inherit",
  weight: "inherit",
  theme: "inherit",
  italic: false,
  underline: false,
  truncate: false,
  noWrap: false,
  srOnly: false,
} satisfies React.ComponentProps<typeof Typography>;

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const Heading: Story = {
  args: {
    ...defaultArgs,
    children: "Typography Heading Example",
    variant: "h2",
  },
};

export const BodyLarge: Story = {
  args: {
    ...defaultArgs,
    children:
      "This is a larger body style useful for intro copy, hero supporting text, or emphasized paragraphs.",
    variant: "body-lg",
  },
};

export const Caption: Story = {
  args: {
    ...defaultArgs,
    children: "Last updated 5 minutes ago",
    variant: "caption",
  },
};

export const Overline: Story = {
  args: {
    ...defaultArgs,
    children: "Featured Component",
    variant: "overline",
  },
};

export const CodeText: Story = {
  args: {
    ...defaultArgs,
    children: "npm install boreal-ui",
    variant: "code",
    as: "code",
  },
};

export const Themed: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Typography {...args} theme="primary">
        Primary themed text
      </Typography>
      <Typography {...args} theme="secondary">
        Secondary themed text
      </Typography>
      <Typography {...args} theme="tertiary">
        Tertiary themed text
      </Typography>
      <Typography {...args} theme="quaternary">
        Quaternary themed text
      </Typography>
      <Typography {...args} theme="success">
        Success themed text
      </Typography>
      <Typography {...args} theme="warning">
        Warning themed text
      </Typography>
      <Typography {...args} theme="error">
        Error themed text
      </Typography>
    </div>
  ),
  args: {
    ...defaultArgs,
    variant: "body",
  },
};

export const Weights: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Typography {...args} weight="light">
        Light text weight
      </Typography>
      <Typography {...args} weight="normal">
        Normal text weight
      </Typography>
      <Typography {...args} weight="medium">
        Medium text weight
      </Typography>
      <Typography {...args} weight="bold">
        Bold text weight
      </Typography>
      <Typography {...args} weight="bolder">
        Bolder text weight
      </Typography>
    </div>
  ),
  args: {
    ...defaultArgs,
    variant: "body",
  },
};

export const Alignment: Story = {
  render: (args) => (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Typography {...args} align="left">
        Left aligned text
      </Typography>
      <Typography {...args} align="center">
        Center aligned text
      </Typography>
      <Typography {...args} align="right">
        Right aligned text
      </Typography>
    </div>
  ),
  args: {
    ...defaultArgs,
    variant: "body",
  },
};

export const ItalicAndUnderline: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Typography {...args} italic>
        Italic text example
      </Typography>
      <Typography {...args} underline>
        Underlined text example
      </Typography>
      <Typography {...args} italic underline>
        Italic and underlined text example
      </Typography>
    </div>
  ),
  args: {
    ...defaultArgs,
    variant: "body",
  },
};

export const Truncated: Story = {
  args: {
    ...defaultArgs,
    children:
      "This is a very long line of text intended to demonstrate how truncation works when the container width is constrained.",
    truncate: true,
    style: {
      maxWidth: "280px",
      display: "block",
    },
  },
};

export const NoWrap: Story = {
  args: {
    ...defaultArgs,
    children:
      "This text will stay on one line even if the available width becomes narrow.",
    noWrap: true,
  },
};

export const SemanticOverride: Story = {
  args: {
    ...defaultArgs,
    children: "This looks like a heading but renders as a div.",
    variant: "h3",
    as: "div",
  },
};

export const ScreenReaderOnly: Story = {
  args: {
    ...defaultArgs,
    children: "Screen reader only text",
    srOnly: true,
  },
};

export const VariantScale = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
    {variantOptions.map((variant) => (
      <Typography key={variant} variant={variant as never}>
        {variant}
      </Typography>
    ))}
  </div>
);
