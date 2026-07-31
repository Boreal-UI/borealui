import { render, screen } from "@testing-library/react";
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
  Legend,
  LineChart,
  MetricBox,
  PageHeader,
  ProgressBar,
  RadioButton,
  RadioGroup,
  Select,
  Skeleton,
  Sparkline,
  TextArea,
  TextInput,
  Timeline,
  Toolbar,
  Typography,
  ValidationSummary,
} from "@/next/server";

const chartData = [
  { label: "Jan", value: 10 },
  { label: "Feb", value: 20 },
];

describe("Next server component entries", () => {
  it("renders static layout and data-display components", () => {
    render(
      <Container testId="server-layout">
        <Typography testId="server-typography">Server rendered</Typography>
        <Divider testId="server-divider" />
        <Legend
          testId="server-legend"
          items={[{ label: "Revenue", color: "#0f0", value: "$20" }]}
        />
        <ProgressBar testId="server-progress" value={75} />
        <Skeleton testId="server-skeleton" />
      </Container>,
    );

    expect(screen.getByTestId("server-layout")).toBeInTheDocument();
    expect(screen.getByTestId("server-typography")).toHaveTextContent(
      "Server rendered",
    );
    expect(screen.getByTestId("server-divider")).toBeInTheDocument();
    expect(screen.getByTestId("server-legend")).toHaveTextContent("Revenue");
    expect(screen.getByTestId("server-progress")).toHaveAttribute(
      "aria-valuenow",
      "75",
    );
    expect(screen.getByTestId("server-skeleton")).toBeInTheDocument();
  });

  it("renders chart SVGs without client behavior", () => {
    render(
      <>
        <BarChart data={chartData} testId="server-bar-chart" />
        <LineChart data={chartData} testId="server-line-chart" />
        <Sparkline data={chartData} testId="server-sparkline" />
      </>,
    );

    expect(screen.getByTestId("server-bar-chart-chart")).toBeInTheDocument();
    expect(screen.getByTestId("server-line-chart-chart")).toBeInTheDocument();
    expect(screen.getByTestId("server-sparkline-chart")).toBeInTheDocument();
  });

  it("renders stripped server display components", () => {
    render(
      <>
        <Button href="/docs">Docs</Button>
        <Badge>New</Badge>
        <Alert title="Saved">Your changes are available.</Alert>
        <Avatar name="Ada Lovelace" />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Docs", href: "/docs" },
            { label: "Current" },
          ]}
        />
        <PageHeader title="Dashboard" subtitle="Server content" />
        <Card title="Summary" description="Static card" />
      </>,
    );

    expect(screen.getAllByRole("link", { name: /docs/i })).toHaveLength(2);
    expect(screen.getByTestId("badge-main")).toHaveTextContent("New");
    expect(screen.getByTestId("alert")).toHaveTextContent("Saved");
    expect(screen.getByTestId("avatar-main")).toHaveTextContent("AL");
    expect(screen.getByLabelText("Breadcrumbs")).toHaveTextContent("Current");
    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("card")).toHaveTextContent("Static card");
  });

  it("renders stripped server form controls with native state", () => {
    render(
      <>
        <TextInput label="Name" defaultValue="Ada" />
        <TextArea label="Notes" defaultValue="Readonly note" />
        <Select
          label="Plan"
          defaultValue="pro"
          options={[
            { label: "Free", value: "free" },
            { label: "Pro", value: "pro" },
          ]}
        />
        <CheckBox label="Enabled" checked />
        <RadioButton label="Solo" name="mode" value="solo" checked />
        <RadioGroup
          legend="Theme"
          name="theme"
          value="dark"
          options={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
          ]}
        />
      </>,
    );

    expect(screen.getByLabelText("Name")).toHaveValue("Ada");
    expect(screen.getByLabelText("Notes")).toHaveValue("Readonly note");
    expect(screen.getByLabelText("Plan")).toHaveValue("pro");
    expect(screen.getByLabelText("Enabled")).toBeChecked();
    expect(screen.getByLabelText("Solo")).toBeChecked();
    expect(screen.getByLabelText("Dark")).toBeChecked();
  });

  it("does not forward the TextInput fullWidth prop to the native input", () => {
    render(<TextInput label="Name" fullWidth testId="server-text-input" />);

    const input = screen.getByLabelText("Name");

    expect(input).not.toHaveAttribute("fullWidth");
    expect(input).not.toHaveAttribute("fullwidth");
  });

  it("renders additional server page and status compositions", () => {
    render(
      <>
        <BreadCrumbPageHeader
          title="Settings"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }]}
        />
        <EmptyState
          title="No results"
          message="Try another query"
          actionLabel="Go back"
          actionHref="/back"
        />
        <MetricBox title="Revenue" value={42} units="k" subtext="This month" />
        <Timeline
          items={[
            {
              title: "Created",
              date: "June 8, 2026",
              description: "Project started",
            },
          ]}
        />
        <Toolbar title="Server toolbar" avatar={{ name: "Ada Lovelace" }} />
        <ValidationSummary
          items={[{ message: "Name is required", fieldId: "name" }]}
        />
        <Footer
          copyright="Boreal UI"
          links={[{ label: "Docs", href: "/docs" }]}
        />
      </>,
    );

    expect(screen.getByTestId("bread-crumb-page-header")).toHaveTextContent(
      "Settings",
    );
    expect(screen.getByRole("link", { name: "Go back" })).toHaveAttribute(
      "href",
      "/back",
    );
    expect(screen.getByTestId("metric-box-value")).toHaveTextContent("42 k");
    expect(screen.getByLabelText("Timeline")).toHaveTextContent("Created");
    expect(
      screen.getByRole("heading", { name: "Server toolbar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Name is required" }),
    ).toHaveAttribute("href", "#name");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Boreal UI");
  });
});
