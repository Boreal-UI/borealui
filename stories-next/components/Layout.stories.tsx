import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  BentoBox,
  BentoBoxItem,
  Card,
  Container,
  Grid,
  Inline,
  Section,
  Stack,
} from "../../src/index.next";

import styles from "./Layout.stories.module.scss";

const meta: Meta = {
  title: "Components/Layout",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Layout primitives for composing responsive page sections, containers, stacks, inline groups, grids, and container-adaptive bento layouts.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Primitives: Story = {
  render: () => (
    <Section tone="muted" padded>
      <Container>
        <Stack gap="md">
          <Inline justify="between" align="center">
            <strong>Layout primitives</strong>
            <span>Inline actions</span>
          </Inline>

          <Grid minColumnWidth="12rem">
            <Card title="Container" className={styles.demoCard}>
              Responsive max-width.
            </Card>
            <Card title="Stack" className={styles.demoCard}>
              Vertical rhythm.
            </Card>
            <Card title="Grid" className={styles.demoCard}>
              Auto-fit columns.
            </Card>
          </Grid>
        </Stack>
      </Container>
    </Section>
  ),
};

export const ContainerSizes: Story = {
  render: () => (
    <Section tone="muted" padded>
      <Stack gap="lg">
        <Container size="sm">
          <Card title="Small container" className={styles.demoCard}>
            Useful for narrow reading layouts.
          </Card>
        </Container>

        <Container size="md">
          <Card title="Medium container" className={styles.demoCard}>
            Good for forms and focused content.
          </Card>
        </Container>

        <Container size="lg">
          <Card title="Large container" className={styles.demoCard}>
            Default page content width.
          </Card>
        </Container>

        <Container size="xl">
          <Card title="Extra large container" className={styles.demoCard}>
            Best for dashboards, grids, and wide content.
          </Card>
        </Container>
      </Stack>
    </Section>
  ),
};

export const SectionTones: Story = {
  render: () => (
    <Stack gap="md">
      <Section tone="default" padded>
        <Container>
          <Card title="Default section" className={styles.demoCard}>
            Standard page background.
          </Card>
        </Container>
      </Section>

      <Section tone="muted" padded>
        <Container>
          <Card title="Muted section" className={styles.demoCard}>
            Soft section contrast.
          </Card>
        </Container>
      </Section>

      <Section tone="transparent" padded>
        <Container>
          <Card title="Transparent section" className={styles.demoCard}>
            Highlighted content area.
          </Card>
        </Container>
      </Section>
    </Stack>
  ),
};

export const StackSpacing: Story = {
  render: () => (
    <Section tone="muted" padded>
      <Container>
        <Stack gap="lg">
          <Card title="Large gap" className={styles.demoCard}>
            First stacked item.
          </Card>
          <Card title="Large gap" className={styles.demoCard}>
            Second stacked item.
          </Card>
          <Card title="Large gap" className={styles.demoCard}>
            Third stacked item.
          </Card>
        </Stack>
      </Container>
    </Section>
  ),
};

export const InlineAlignment: Story = {
  render: () => (
    <Section tone="muted" padded>
      <Container>
        <Stack gap="md">
          <Inline justify="start" align="center" gap="sm">
            <Card title="Start" className={styles.demoCard}>
              Item one.
            </Card>
            <Card title="Start" className={styles.demoCard}>
              Item two.
            </Card>
          </Inline>

          <Inline justify="center" align="center" gap="sm">
            <Card title="Center" className={styles.demoCard}>
              Item one.
            </Card>
            <Card title="Center" className={styles.demoCard}>
              Item two.
            </Card>
          </Inline>

          <Inline justify="between" align="center" gap="sm">
            <Card title="Between" className={styles.demoCard}>
              Item one.
            </Card>
            <Card title="Between" className={styles.demoCard}>
              Item two.
            </Card>
          </Inline>
        </Stack>
      </Container>
    </Section>
  ),
};

export const ResponsiveGrid: Story = {
  render: () => (
    <Section tone="muted" padded>
      <Container size="xl">
        <Stack gap="md">
          <Inline justify="between" align="center">
            <strong>Responsive grid</strong>
            <span>Resize the viewport</span>
          </Inline>

          <Grid minColumnWidth="14rem" gap="md">
            <Card title="Card one" className={styles.demoCard}>
              Grid columns auto-fit based on the available space.
            </Card>
            <Card title="Card two" className={styles.demoCard}>
              Each card keeps a readable minimum width.
            </Card>
            <Card title="Card three" className={styles.demoCard}>
              The layout stacks naturally on small screens.
            </Card>
            <Card title="Card four" className={styles.demoCard}>
              Useful for dashboards and feature sections.
            </Card>
          </Grid>
        </Stack>
      </Container>
    </Section>
  ),
};

export const NestedLayout: Story = {
  render: () => (
    <Section tone="muted" padded>
      <Container size="lg">
        <Stack gap="lg">
          <Inline justify="between" align="center" wrap>
            <Stack gap="xs">
              <strong>Project overview</strong>
              <span>Nested primitives for page composition.</span>
            </Stack>

            <Inline gap="sm" align="center">
              <span>Status: Active</span>
              <span>Version: 0.0.89</span>
            </Inline>
          </Inline>

          <Grid minColumnWidth="16rem" gap="md">
            <Card title="Documentation" className={styles.demoCard}>
              Organize examples, usage notes, and component guidance.
            </Card>
            <Card title="Testing" className={styles.demoCard}>
              Pair layout primitives with accessible UI patterns.
            </Card>
            <Card title="Theming" className={styles.demoCard}>
              Compose layouts across different theme tones.
            </Card>
          </Grid>
        </Stack>
      </Container>
    </Section>
  ),
};

export const ResponsiveBentoBox: Story = {
  render: () => (
    <Section tone="muted" padded>
      <Container size="xl">
        <Stack gap="lg">
          <strong>BentoBox layout subtype</strong>
          <BentoBox aria-label="Dashboard overview">
            <BentoBoxItem columnSpan={2} rowSpan={2}>
              <Card title="Revenue" className={styles.bentoCard}>
                A prominent metric or chart can occupy two columns and two rows.
              </Card>
            </BentoBoxItem>
            <BentoBoxItem>
              <Card title="Customers" className={styles.bentoCard}>
                2,418 active
              </Card>
            </BentoBoxItem>
            <BentoBoxItem>
              <Card title="Conversion" className={styles.bentoCard}>
                8.4 percent
              </Card>
            </BentoBoxItem>
            <BentoBoxItem columnSpan={2}>
              <Card title="Recent activity" className={styles.bentoCard}>
                Wider supporting content adapts with its container.
              </Card>
            </BentoBoxItem>
            <BentoBoxItem columnSpan="full">
              <Card title="Summary" className={styles.bentoCard}>
                Full-width items remain full width at every container size.
              </Card>
            </BentoBoxItem>
          </BentoBox>
        </Stack>
      </Container>
    </Section>
  ),
};
