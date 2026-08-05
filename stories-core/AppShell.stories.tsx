import type { Meta, StoryObj } from "@storybook/react-vite";
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
} from "../src/index.core";
import type { AppShellProps } from "../src/components/AppShell/AppShell.types";
import {
  FaBell,
  FaBolt,
  FaCheck,
  FaCircle,
  FaClock,
  FaQuestionCircle,
} from "../shared-story-assets/icons";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const shellDemoStyles = `
  .demo {
    width: 100%;
    min-width: 0;
    min-height: 100%;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md, 1rem);
    min-width: 0;
  }

  .brand-row,
  .actions {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .brand-row {
    gap: var(--spacing-sm, 0.75rem);
  }

  .logo {
    min-width: 0;
    font-size: clamp(1rem, 2vw, 1.35rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    overflow-wrap: anywhere;
  }

  .actions {
    flex: 0 0 auto;
    gap: var(--spacing-xs, 0.5rem);
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md, 1rem);
    width: 100%;
    min-width: 0;
  }

  .sidebar-header {
    min-width: 0;
  }

  .side-nav {
    width: 100%;
    min-width: 0;
  }

  .collapse {
    margin-top: auto;
    padding-top: var(--spacing-md, 1rem);
    border-top: 1px solid color-mix(in srgb, currentcolor 18%, transparent);
  }

  .collapse-button {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-sm, 0.75rem);
    width: 100%;
    min-width: 0;
    padding: 0.7rem 0.9rem;
    border: 0;
    border-radius: var(--border-radius-md, 0.75rem);
    background: transparent;
    color: inherit;
    font: inherit;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
  }

  .collapse-button:hover {
    background: color-mix(in srgb, currentcolor 10%, transparent);
  }

  .main {
    display: grid;
    gap: var(--spacing-xl, 2rem);
    width: 100%;
    min-width: 0;
  }

  .hero {
    display: grid;
    gap: var(--spacing-xs, 0.5rem);
    min-width: 0;
  }

  .hero > * {
    margin: 0;
  }

  .metrics {
    width: 100%;
    min-width: 0;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
  }

  .metricCard {
    height: 100%;
    min-width: 0;
  }

  .panel {
    min-width: 0;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, currentcolor 18%, transparent);
    border-radius: var(--border-radius-lg, 1rem);
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md, 1rem);
    min-width: 0;
    padding: var(--spacing-md, 1rem);
    border-bottom: 1px solid color-mix(in srgb, currentcolor 14%, transparent);
  }

  .panel-header h2 {
    min-width: 0;
    margin: 0;
  }

  .link-button {
    flex: 0 0 auto;
    width: auto;
  }

  .table-wrap {
    width: 100%;
    min-width: 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table {
    min-width: min(42rem, 100%);
  }

  .aside {
    display: grid;
    gap: var(--spacing-md, 1rem);
    align-content: start;
    width: 100%;
    min-width: 0;
  }

  .aside-card {
    min-width: 0;
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
    min-width: 0;
  }

  .footer-links {
    display: flex;
    align-items: center;
    gap: var(--spacing-md, 1rem);
    flex-wrap: wrap;
    min-width: 0;
  }

  .footer-links a {
    color: inherit;
    font-size: 0.85rem;
    font-weight: 700;
    text-decoration: none;
  }

  .footer-links a:hover {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .topbar {
      align-items: flex-start;
      flex-direction: column;
    }

    .actions {
      align-self: flex-start;
    }

    .panel-header,
    .footer {
      align-items: flex-start;
      flex-direction: column;
    }

    .link-button {
      width: 100%;
    }
  }

  @media (hover: none) {
    .collapse-button:hover,
    .footer-links a:hover {
      background: transparent;
      text-decoration: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .demo,
    .demo * {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }

  @media (forced-colors: active) {
    .panel,
    .panel-header,
    .collapse,
    .aside-card {
      border-color: ButtonText;
    }

    .collapse-button {
      color: ButtonText;
      border: 1px solid ButtonText;
    }

    .collapse-button:hover {
      background: Canvas;
    }

    .footer-links a {
      color: LinkText;
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
      <Typography textStyle="h3" as="h2">
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
      <Typography as="h1" textStyle="h1" id="overview">
        Main Content Area
      </Typography>

      <Typography as="p" textStyle="body" className="muted">
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
        <Typography as="h2" textStyle="h3" id="recent-activity">
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
    <Typography as="h2" textStyle="h3">
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
          <Typography as="h1" textStyle="h1">
            Main-only layout
          </Typography>

          <Typography as="p" textStyle="body" className="muted">
            Shell can render a simple main-only application view.
          </Typography>
        </section>
      </div>
    ),
  },
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: AppShell, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: AppShell, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: AppShell, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: AppShell, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: AppShell, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: AppShell, args }),
};
