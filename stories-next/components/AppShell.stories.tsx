import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  AppShell,
  Avatar,
  Button,
  Card,
  DataTable,
  Grid,
  IconButton,
  Inline,
  MetricBox,
  Sidebar,
  Typography,
} from "../../src/index.next";
import type { AppShellProps } from "../../src/components/AppShell/AppShell.types";
import {
  FaBell,
  FaBolt,
  FaCheck,
  FaCircle,
  FaClock,
  FaQuestionCircle,
} from "react-icons/fa";

const shellDemoStyles = `
  .demo {
    min-height: 100%;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md, 1rem);
  }

  .brand-row,
  .actions {
    display: flex;
    align-items: center;
  }

  .brand-row {
    gap: var(--spacing-xl, 2rem);
  }

  .logo {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg, 1.5rem);
  }

  .nav a {
    font-size: 0.9rem;
    font-weight: 700;
    text-decoration: none;
  }

  .nav a[aria-current="page"] {
    padding-bottom: 0.25rem;
  }

  .actions {
    gap: var(--spacing-sm, 0.75rem);
  }


  .sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg, 1.5rem);

  }

  .sidebar-header {
    padding-inline: var(--spacing-xs, 0.5rem);
  }

  .side-nav {
    flex: 1;
    width: 95%;
  }

  .collapse {
    margin-top: auto;
    padding-top: var(--spacing-md, 1rem);
    border-top: 1px solid var(--border);
  }

  .collapse-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm, 0.75rem);
    width: 100%;
    padding: 0.7rem 0.9rem;
    border: 0;
    border-radius: var(--border-radius-md, 0.75rem);
    background: transparent;
    color: var(--muted);
    font: inherit;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
  }

  .collapse-button:hover {
    background: var(--surface-mid);
  }

  .main {
    display: grid;
    gap: var(--spacing-xl, 2rem);
    padding: var(--spacing-xl, 2rem);
  }

  .hero {
    display: grid;
    gap: var(--spacing-xs, 0.5rem);
  }

  .hero > * {
    margin: 0;
  }

  .metrics {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .metricCard {
height: 100%;}

  .panel {
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: var(--border-radius-lg, 1rem);
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md, 1rem);
  }

  .panel-header h2 {
    margin: 0;
  }

  .link-button {
    width: auto;
  }

  .table-wrap {
    overflow-x: auto;
  }

  .table {
    min-width: 42rem;
  }

  .aside {
    display: grid;
    gap: var(--spacing-md, 1rem);
    align-content: start;
    min-height: 100%;
    padding: var(--spacing-lg, 1.5rem);
  }

  .aside-card h3,
  .aside-card p {
    margin: 0;
  }

  .aside-card h3 {
    margin-bottom: var(--spacing-xs, 0.5rem);
  }


  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md, 1rem);
    padding: var(--spacing-md, 1rem) var(--spacing-lg, 1.5rem);
  }


  .footer-links {
    display: flex;
    align-items: center;
    gap: var(--spacing-md, 1rem);
    flex-wrap: wrap;
  }

  .footer-links a {
    font-size: 0.85rem;
    font-weight: 700;
    text-decoration: none;
  }

  @media (max-width: 960px) {
    .nav,
    .aside {
      display: none;
    }

    .metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .topbar,
    .main,
    .footer {
      padding-inline: var(--spacing-md, 1rem);
    }

    .brand-row {
      gap: var(--spacing-md, 1rem);
    }

    .metrics {
      grid-template-columns: 1fr;
    }

    .footer {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;

const Icon = ({ children }: { children: string }) => (
  <span aria-hidden="true">{children}</span>
);

const HeaderDemo = () => (
  <div className="topbar">
    <Inline className="brand-row">
      <span className="logo">Example AppShell</span>

      <nav className="nav" aria-label="Top navigation">
        <a href="#dashboard" aria-current="page">
          Dashboard
        </a>
        <a href="#forms">Forms</a>
        <a href="#reports">Reports</a>
        <a href="#settings">Settings</a>
      </nav>
    </Inline>

    <Inline className="actions">
      <IconButton
        className="icon-button"
        type="button"
        icon={FaBell}
        size="sm"
        aria-label="Notifications"
      />

      <IconButton
        className="icon-button"
        type="button"
        icon={FaQuestionCircle}
        size="sm"
        aria-label="Help"
      />

      <Avatar
        size="sm"
        theme="tertiary"
        className="avatar"
        aria-label="User profile"
      >
        AS
      </Avatar>
    </Inline>
  </div>
);

const SidebarDemo = () => (
  <div className="sidebar">
    <Inline gap="xs" className="sidebar-header">
      <Typography variant="h3" as="h2">
        Sidebar
      </Typography>
    </Inline>

    <Sidebar
      className="side-nav"
      aria-label="Primary navigation"
      theme="clear"
      links={[
        { label: "Overview", href: "#overview" },
        { label: "Validators", href: "#validators" },
        { label: "Transactions", href: "#transactions" },
        { label: "Audit Logs", href: "#audit-logs" },
        { label: "Support", href: "#support" },
      ]}
    />

    <div className="collapse">
      <button className="collapse-button" type="button">
        <Icon>☰</Icon>
        Collapse
      </button>
    </div>
  </div>
);

const MainContentDemo = () => (
  <div className="main" id="dashboard">
    <section className="hero" aria-labelledby="overview">
      <Typography as="h1" variant="h1" id="overview">
        Main Content Area
      </Typography>

      <Typography as="p" variant="body" className="muted">
        Real-time performance telemetry for the example application shell.
      </Typography>
    </section>

    <Grid className="metrics" gap="md" aria-label="Key metrics">
      <MetricBox
        icon={FaCircle}
        subtext="+4%"
        className="metricCard"
        title="Active Nodes"
        value="1,284"
      />

      <MetricBox
        icon={FaCheck}
        subtext="+12%"
        className="metricCard"
        title="Total Validations"
        value="842,910"
      />

      <MetricBox
        icon={FaBolt}
        subtext="Stable"
        className="metricCard"
        title="Success Rate"
        value="99.98%"
      />

      <MetricBox
        icon={FaClock}
        subtext="Online"
        className="metricCard"
        title="System Uptime"
        value="365d 04h"
      />
    </Grid>

    <section className="panel" aria-labelledby="recent-activity">
      <div className="panel-header">
        <Typography as="h2" variant="h3" id="recent-activity">
          Recent Activity
        </Typography>

        <Button className="link-button" type="button" theme="clear">
          View All
        </Button>
      </div>

      <div className="table-wrap">
        <DataTable
          className="table"
          columns={[
            { key: "time", label: "Time" },
            { key: "event", label: "Event" },
            { key: "status", label: "Status" },
          ]}
          data={[
            {
              time: "2026-06-01 12:34:56",
              event: "Validator Node Alpha started",
              status: "Success",
            },
            {
              time: "2026-06-01 12:35:10",
              event: "Validation #842,910 completed",
              status: "Success",
            },
            {
              time: "2026-06-01 12:37:42",
              event: "Node health check completed",
              status: "Stable",
            },
          ]}
        />
      </div>
    </section>
  </div>
);

const AsideDemo = () => (
  <div className="aside" aria-label="System summary">
    <Typography as="h2" variant="h3">
      Aside Content
    </Typography>

    <Card className="aside-card">
      <h3>Usage</h3>
      <p>84% of validation capacity is currently allocated.</p>
    </Card>

    <Card className="aside-card">
      <h3>Security</h3>
      <p>All validator keys passed the most recent audit sweep.</p>
    </Card>

    <Card className="aside-card">
      <h3>Next sync</h3>
      <p>Scheduled in 12 minutes.</p>
    </Card>
  </div>
);

const FooterDemo = () => (
  <div className="footer">
    <div>
      <strong>Footer Content</strong>
      <br />
      <small>Synced just now</small>
    </div>

    <nav className="footer-links" aria-label="Footer navigation">
      <a href="#privacy">Privacy</a>
      <a href="#terms">Terms</a>
      <a href="#security">Security</a>
    </nav>
  </div>
);

const meta: Meta<AppShellProps> = {
  title: "Components/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="demo">
        <style>{shellDemoStyles}</style>
        <Story />
      </div>
    ),
  ],
  args: {
    header: <HeaderDemo />,
    sidebar: <SidebarDemo />,
    aside: <AsideDemo />,
    footer: <FooterDemo />,
    children: <MainContentDemo />,
    theme: "secondary",
  },
};

export default meta;

type Story = StoryObj<AppShellProps>;

export const Default: Story = {};

export const Dashboard: Story = {
  name: "Dashboard",
};

export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
  },
};

export const CollapsedSidebar: Story = {
  args: {
    sidebarCollapsed: true,
  },
};

export const MainOnly: Story = {
  args: {
    header: undefined,
    sidebar: undefined,
    aside: undefined,
    footer: undefined,
    children: (
      <div className="main">
        <section className="hero">
          <Typography as="h1" variant="h1">
            Main-only layout
          </Typography>

          <Typography as="p" variant="body" className="muted">
            Shell can render a simple main-only application view.
          </Typography>
        </section>
      </div>
    ),
  },
};
