import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScrollToTop } from "../../src/index.next";

const meta: Meta = {
  title: "Components/ScrollToTopButton",
  component: ScrollToTop,
  tags: ["autodocs"],
  args: {
    rounding: "large",
    shadow: "light",
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    rounding: "none",
  },

  render: (args) => (
    <div
      style={{
        height: "200vh",
        padding: "2rem",
      }}
    >
      <p style={{ maxWidth: 600 }}>
        Scroll down the page to make the ScrollToTopButton appear. This demo
        uses a tall container to simulate a real scroll environment.
      </p>
      <ScrollToTop {...args} />
    </div>
  ),
};
