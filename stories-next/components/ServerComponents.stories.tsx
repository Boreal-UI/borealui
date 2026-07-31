import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Alert,
  Avatar,
  Badge,
  BarChart,
  BreadCrumbPageHeader,
  Breadcrumbs,
  Button,
  Card,
  CheckBox,
  Container,
  Divider,
  EmptyState,
  Footer,
  Grid,
  Inline,
  Legend,
  LineChart,
  MetricBox,
  PageHeader,
  ProgressBar,
  RadioButton,
  RadioGroup,
  Section,
  Select,
  Skeleton,
  Sparkline,
  Stack,
  TextArea,
  TextInput,
  Timeline,
  Toolbar,
  Typography,
  ValidationSummary,
} from "../../src/next/server";
import { FaChartLine, FaEnvelope, FaFileAlt, FaServer } from "react-icons/fa";
import testImageJpg from "../assets/test_pattern.jpg";

const chartData = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 18 },
  { label: "Mar", value: 9 },
  { label: "Apr", value: 22 },
  { label: "May", value: 16 },
];

const meta: Meta = {
  title: "Server Components/Overview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "React Server Component entries for the Next package. These examples use stripped static variants that avoid client directives, hooks, browser APIs, and callback props.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const StaticPageComposition: Story = {
  render: () => (
    <Section tone="muted" padded>
      <Container size="xl">
        <Stack gap="lg">
          <Breadcrumbs
            items={[
              { label: "Docs", href: "/docs" },
              { label: "Next", href: "/docs/next" },
              { label: "Server Components" },
            ]}
          />

          <PageHeader
            eyebrow="Next package"
            title="Server rendered Boreal UI"
            subtitle="Static UI, charts, and native form state without client component boundaries."
            actions={
              <Inline gap="sm" wrap>
                <Button href="/docs" icon={FaFileAlt} theme="secondary">
                  Read docs
                </Button>
                <Button href="/examples" theme="tertiary" variant="outline">
                  View examples
                </Button>
              </Inline>
            }
          />

          <Alert title="Server component note" state="success">
            These entries intentionally omit callbacks and interactive client
            behavior. Use the standard Next components when the UI needs state,
            effects, or browser events.
          </Alert>

          <Grid minColumnWidth="17rem" gap="md">
            <Card
              title="Static card"
              description="Cards can render headings, content, images, icons, and static footers."
              cardIcon={FaServer}
              imageUrl={testImageJpg}
              imageAlt="Pattern preview"
              footer={<Badge state="success">No client hooks</Badge>}
            />
            <Card
              title="Profile summary"
              description="Avatar, badge, and link-style button examples in a server-rendered block."
              footer={
                <Inline gap="sm" align="center" wrap>
                  <Avatar
                    name="Ada Lovelace"
                    status="online"
                    theme="secondary"
                  />
                  <Badge theme="tertiary">Maintainer</Badge>
                  <Button
                    href="https://example.com"
                    size="small"
                    theme="tertiary"
                    variant="outline"
                  >
                    External profile
                  </Button>
                </Inline>
              }
            />
            <Card
              title="Progress snapshot"
              description="Status components remain useful when the values are known at render time."
              footer={
                <Stack gap="sm">
                  <ProgressBar
                    value={72}
                    label="Build health"
                    theme="secondary"
                  />
                  <Legend
                    items={[
                      { label: "Stable", value: "72%", color: "#22c55e" },
                      { label: "Watching", value: "18%", color: "#f59e0b" },
                    ]}
                  />
                </Stack>
              }
            />
          </Grid>
        </Stack>
      </Container>
    </Section>
  ),
};

export const NativeFormState: Story = {
  render: () => (
    <Container size="md">
      <Stack gap="lg">
        <Stack gap="xs">
          <Typography as="h2" textStyle="h3">
            Native form controls
          </Typography>
          <Typography as="p">
            Server form controls render read-only text fields or native initial
            state. They do not receive `onChange` callbacks.
          </Typography>
        </Stack>

        <Card
          title="Plan request"
          theme="secondary"
          description="This is a static form preview suitable for server-rendered pages."
          footer={<Badge state="warning">Initial state only</Badge>}
        >
          <Stack gap="md">
            <TextInput
              label="Name"
              defaultValue="Ada Lovelace"
              icon={FaEnvelope}
            />
            <TextArea
              label="Notes"
              defaultValue="Prepare the server-rendered dashboard shell."
              helperText="Read-only by default in the server entry."
              height="7rem"
            />
            <Select
              label="Plan"
              defaultValue="pro"
              options={[
                { label: "Free", value: "free" },
                { label: "Pro", value: "pro" },
                { label: "Enterprise", value: "enterprise" },
              ]}
            />
            <CheckBox label="Include accessibility checklist" checked />
            <RadioButton
              label="One-off export"
              name="server-story-mode"
              value="one-off"
              checked
            />
            <RadioGroup
              legend="Theme preference"
              name="server-story-theme"
              value="dark"
              orientation="horizontal"
              options={[
                { label: "Light", value: "light" },
                { label: "Dark", value: "dark" },
                { label: "System", value: "system" },
              ]}
            />
          </Stack>
        </Card>
      </Stack>
    </Container>
  ),
};

export const DataDisplay: Story = {
  render: () => (
    <Container size="xl">
      <Stack gap="lg">
        <PageHeader
          eyebrow="Static data"
          title="Charts and loading states"
          subtitle="SVG charts and structural primitives are good fits for server rendering."
        />

        <Grid minColumnWidth="18rem" gap="md">
          <Card
            title="Monthly bars"
            description="Bar chart rendered from known data."
            cardIcon={FaChartLine}
          >
            <BarChart data={chartData} label="Monthly revenue" units="k USD" />
          </Card>
          <Card
            title="Trend line"
            description="Line chart without client state."
          >
            <LineChart data={chartData} label="Monthly signups" units="k" />
          </Card>
          <Card title="Compact sparkline" description="Small trend display.">
            <Sparkline data={chartData} label="Pipeline trend" />
          </Card>
        </Grid>

        <Divider label="Skeleton and status" />

        <Grid minColumnWidth="14rem" gap="md">
          <Skeleton height="6rem" />
          <ProgressBar value={48} label="Documentation coverage" />
          <Legend
            items={[
              { label: "Server ready", value: "22", color: "#38bdf8" },
              { label: "Client only", value: "Remaining", color: "#a855f7" },
            ]}
          />
        </Grid>
      </Stack>
    </Container>
  ),
};

export const PageAndStatusCompositions: Story = {
  render: () => (
    <Section tone="muted" padded>
      <Container size="xl">
        <Stack gap="lg">
          <BreadCrumbPageHeader
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Operations" },
            ]}
            title="Operations overview"
            subtitle="A server-rendered page shell with static actions and status."
            actions={<Button href="/reports">View reports</Button>}
          />

          <Toolbar
            title="Current environment"
            left={<Badge state="success">Healthy</Badge>}
            right={<Button href="/settings">Settings</Button>}
            avatar={{ name: "Ada Lovelace", theme: "secondary" }}
          />

          <Grid minColumnWidth="14rem" gap="md">
            <MetricBox
              title="Requests"
              value="12.4"
              units="k"
              subtext="Today"
            />
            <MetricBox
              title="Availability"
              value="99.99"
              units="%"
              state="success"
              subtext="Last 30 days"
            />
            <MetricBox title="Open issues" value={3} state="warning" />
          </Grid>

          <Grid minColumnWidth="18rem" gap="md">
            <EmptyState
              icon={FaFileAlt}
              title="No pending reports"
              message="All scheduled reports have completed."
              actionLabel="Browse reports"
              actionHref="/reports"
            />
            <ValidationSummary
              title="Review these fields"
              description="These links can navigate to server-rendered form fields."
              items={[
                { message: "Name is required", fieldId: "name" },
                { message: "Choose a plan", fieldId: "plan" },
              ]}
            />
          </Grid>

          <Card title="Deployment timeline">
            <Timeline
              items={[
                {
                  title: "Build completed",
                  date: "09:15",
                  description: "Production assets were generated.",
                },
                {
                  title: "Deployment ready",
                  date: "09:18",
                  description: "All static checks passed.",
                },
              ]}
            />
          </Card>

          <Footer
            layout="columns"
            brandTitle="Boreal UI"
            brandDescription="Accessible components for React and Next.js."
            sections={[
              {
                title: "Resources",
                links: [
                  { label: "Documentation", href: "/docs" },
                  { label: "Examples", href: "/examples" },
                ],
              },
            ]}
            copyright="Boreal UI"
            copyrightInBottom
            bottomEnd="Server rendered"
          />
        </Stack>
      </Container>
    </Section>
  ),
};

export const LayoutPrimitives: Story = {
  render: () => {
    const squareStyle = {
      width: "2.75rem",
      height: "2.75rem",
      borderRadius: "0.5rem",
      background: "color-mix(in srgb, var(--primary-color) 72%, transparent)",
      border: "1px solid color-mix(in srgb, var(--primary-color) 85%, black)",
    };

    const squareAltStyle = {
      ...squareStyle,
      background: "color-mix(in srgb, var(--secondary-color) 72%, transparent)",
      border: "1px solid color-mix(in srgb, var(--secondary-color) 85%, black)",
    };

    const squareThirdStyle = {
      ...squareStyle,
      background: "color-mix(in srgb, var(--tertiary-color) 72%, transparent)",
      border: "1px solid color-mix(in srgb, var(--tertiary-color) 85%, black)",
    };

    const demoBoxStyle = {
      width: "100%",
      minHeight: "9rem",
      padding: "1rem",
      borderRadius: "0.75rem",
      border:
        "1px dashed color-mix(in srgb, var(--text-color) 32%, transparent)",
      background:
        "color-mix(in srgb, var(--background-color) 88%, var(--text-color))",
    };

    return (
      <Section tone="default" padded>
        <Container size="lg">
          <Stack gap="lg">
            <Inline justify="between" align="center" wrap>
              <Stack gap="xs">
                <Typography as="h2" textStyle="h3">
                  Server layout primitives
                </Typography>
                <Typography as="p">
                  Container, Section, Stack, Inline, and Grid are server-safe
                  layout building blocks.
                </Typography>
              </Stack>
            </Inline>

            <Grid minColumnWidth="16rem" gap="md">
              <Card title="Stack" description="Vertical spacing.">
                <div style={demoBoxStyle}>
                  <Stack gap="sm">
                    <div style={squareStyle} />
                    <div style={squareAltStyle} />
                    <div style={squareThirdStyle} />
                  </Stack>
                </div>
              </Card>

              <Card title="Inline" description="Horizontal alignment.">
                <div style={demoBoxStyle}>
                  <Inline justify="between" align="center" wrap>
                    <div style={squareStyle} />
                    <div style={squareAltStyle} />
                    <div style={squareThirdStyle} />
                  </Inline>
                </div>
              </Card>

              <Card title="Grid" description="Responsive columns.">
                <div style={demoBoxStyle}>
                  <Grid minColumnWidth="3.25rem" gap="sm">
                    <div style={squareStyle} />
                    <div style={squareAltStyle} />
                    <div style={squareThirdStyle} />
                    <div style={squareStyle} />
                    <div style={squareAltStyle} />
                    <div style={squareThirdStyle} />
                  </Grid>
                </div>
              </Card>
            </Grid>
          </Stack>
        </Container>
      </Section>
    );
  },
};
