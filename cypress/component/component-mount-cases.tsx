/// <reference types="cypress" />

import React from "react";
import { defaultColorSchemes } from "../../src/styles/Themes";
import { buildThemeVariables } from "../../src/context/themeRuntime";

type LibraryComponent = React.ComponentType<Record<string, unknown>>;

type ComponentLibrary = Record<string, LibraryComponent>;
type VariantProps = Record<string, unknown>;

type SmokeCase = {
  name: string;
  render: (library: ComponentLibrary, testId: string) => React.ReactNode;
  renderA11y?: (library: ComponentLibrary, testId: string) => React.ReactNode;
  assert?: (testId: string, cy: any) => void;
  a11ySelector?: (testId: string) => string;
  waitForA11y?: (testId: string, cy: any) => void;
  a11yWrapperStyle?: React.CSSProperties;
};

const terminalLog = (violations: any[]) => {
  cy.task(
    "log",
    violations.map(({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.map((node: any) => ({
        target: node.target,
        failureSummary: node.failureSummary,
      })),
    })),
  );
};

const themedA11yOptions = {
  rules: {
    "color-contrast": { enabled: false },
    "landmark-unique": { enabled: false },
    "landmark-no-duplicate-contentinfo": { enabled: false },
  },
};

const TestIcon = ({
  className,
  "aria-hidden": ariaHidden,
  focusable,
}: {
  className?: string;
  "aria-hidden"?: boolean;
  focusable?: boolean;
}) => (
  <svg
    className={className}
    aria-hidden={ariaHidden}
    focusable={focusable}
    viewBox="0 0 16 16"
  >
    <circle cx="8" cy="8" r="6" />
  </svg>
);

const basicOptions = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
];

const tableColumns = [
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
];

const tableData = [
  { name: "Aurora", status: "Ready" },
  { name: "Boreal", status: "Stable" },
];

const notificationItems = [
  { id: "one", message: "Build completed", type: "success" as const },
];

const noop = () => undefined;

const componentThemeVariants = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "clear",
] as const;

const componentStateVariants = ["success", "error", "warning"] as const;

const appThemeSchemes = defaultColorSchemes;

const themeVariantComponents = new Set([
  "Accordion",
  "Avatar",
  "Badge",
  "Breadcrumbs",
  "Button",
  "Card",
  "CheckBox",
  "Chip",
  "CircularProgress",
  "CommandPalette",
  "DataTable",
  "DateTimePicker",
  "Divider",
  "Dropdown",
  "EmptyState",
  "FileUpload",
  "Footer",
  "IconButton",
  "MetricBox",
  "NavBar",
  "Pager",
  "PopOver",
  "ProgressBar",
  "RadioButton",
  "RadioGroup",
  "Rating",
  "Select",
  "Sidebar",
  "Slider",
  "Spinner",
  "Stepper",
  "Tabs",
  "TagInput",
  "TextArea",
  "TextInput",
  "Timeline",
  "Toggle",
  "Toolbar",
  "Tooltip",
  "Typography",
]);

const stateVariantComponents = new Set([
  "Accordion",
  "Avatar",
  "Badge",
  "Breadcrumbs",
  "Button",
  "Card",
  "CheckBox",
  "Chip",
  "CircularProgress",
  "CommandPalette",
  "DataTable",
  "DateTimePicker",
  "Divider",
  "Dropdown",
  "EmptyState",
  "FileUpload",
  "IconButton",
  "MetricBox",
  "Pager",
  "PopOver",
  "ProgressBar",
  "RadioButton",
  "RadioGroup",
  "Rating",
  "Select",
  "Sidebar",
  "Slider",
  "Spinner",
  "Stepper",
  "Tabs",
  "TagInput",
  "TextArea",
  "TextInput",
  "Toggle",
  "Tooltip",
]);

const outlineVariantComponents = new Set([
  "Accordion",
  "Avatar",
  "Badge",
  "Breadcrumbs",
  "Button",
  "Card",
  "DataTable",
  "DateTimePicker",
  "EmptyState",
  "FileUpload",
  "IconButton",
  "MetricBox",
  "Select",
  "Sidebar",
  "TextArea",
  "TextInput",
]);

const schemeTestId = (schemeName: string) =>
  schemeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getScopedSchemeStyle = (scheme: (typeof appThemeSchemes)[number]) =>
  ({
    ...buildThemeVariables(scheme),
    backgroundColor: "var(--background-color)",
    color: "var(--text-color)",
  }) as React.CSSProperties;

const getVariantProps = (componentName: string) => {
  const variants: Array<{ label: string; props: VariantProps }> = [
    { label: "base", props: {} },
  ];

  if (themeVariantComponents.has(componentName)) {
    componentThemeVariants.forEach((theme) => {
      variants.push({
        label: `theme-${theme}`,
        props: { theme },
      });
    });
  }

  if (stateVariantComponents.has(componentName)) {
    componentStateVariants.forEach((state) => {
      variants.push({
        label: `state-${state}`,
        props: { state },
      });
    });
  }

  if (outlineVariantComponents.has(componentName)) {
    if (themeVariantComponents.has(componentName)) {
      componentThemeVariants.forEach((theme) => {
        variants.push({
          label: `outline-${theme}`,
          props: { theme, outline: true },
        });
      });
    } else {
      variants.push({
        label: "outline",
        props: { outline: true },
      });
    }
  }

  return variants;
};

const applyVariantProps = (node: React.ReactNode, props: VariantProps) => {
  if (!Object.keys(props).length || !React.isValidElement(node)) {
    return node;
  }

  if (node.type === React.Fragment) {
    return node;
  }

  return React.cloneElement(
    node as React.ReactElement<Record<string, unknown>>,
    props,
  );
};

const renderA11yCase = (
  componentCase: SmokeCase,
  library: ComponentLibrary,
  testId: string,
  props: VariantProps = {},
) => {
  const node = (componentCase.renderA11y ?? componentCase.render)(
    library,
    testId,
  );

  return applyVariantProps(node, props);
};

export const componentSmokeCases: SmokeCase[] = [
  {
    name: "Accordion",
    render: ({ Accordion }, testId) => (
      <Accordion title="Release notes" initiallyExpanded data-testid={testId}>
        Component content
      </Accordion>
    ),
    assert: () => cy.contains("Component content").should("be.visible"),
  },
  {
    name: "Avatar",
    render: ({ Avatar }, testId) => (
      <Avatar
        name="Ada Lovelace"
        aria-label="Ada Lovelace"
        data-testid={testId}
      />
    ),
  },
  {
    name: "Badge",
    render: ({ Badge }, testId) => <Badge data-testid={testId}>Stable</Badge>,
  },
  {
    name: "Breadcrumbs",
    render: ({ Breadcrumbs }, testId) => (
      <Breadcrumbs
        data-testid={testId}
        items={[
          { label: "Home", href: "/" },
          { label: "Components", href: "/components" },
        ]}
      />
    ),
    renderA11y: ({ Breadcrumbs }, testId) => (
      <Breadcrumbs
        data-testid={testId}
        theme="clear"
        items={[
          { label: "Home", href: "/" },
          { label: "Components", href: "/components" },
        ]}
      />
    ),
    assert: () => cy.contains("Components").should("be.visible"),
    a11yWrapperStyle: {
      backgroundColor: "var(--background-color)",
      color: "var(--text-color-primary)",
    },
  },
  {
    name: "Button",
    render: ({ Button }, testId) => <Button data-testid={testId}>Save</Button>,
  },
  {
    name: "Card",
    render: ({ Card }, testId) => (
      <Card
        title="Card title"
        description="Card description"
        data-testid={testId}
      >
        Card body
      </Card>
    ),
    assert: () => cy.contains("Card title").should("be.visible"),
  },
  {
    name: "CheckBox",
    render: ({ CheckBox }, testId) => (
      <CheckBox
        label="Accept terms"
        checked={false}
        onChange={noop}
        data-testid={testId}
      />
    ),
  },
  {
    name: "Chip",
    render: ({ Chip }, testId) => (
      <Chip
        message="Saved"
        visible
        usePortal={false}
        autoClose={false}
        data-testid={testId}
      />
    ),
    renderA11y: ({ Chip }, testId) => (
      <Chip
        message="Saved"
        visible
        usePortal={false}
        autoClose={false}
        theme="clear"
        glass={false}
        data-testid={testId}
      />
    ),
    assert: () => cy.contains("Saved").should("be.visible"),
    waitForA11y: (testId) => {
      cy.get(`[data-testid="${testId}-message"]`).should("be.visible");
      cy.wait(350);
    },
    a11yWrapperStyle: {
      backgroundColor: "var(--background-color)",
      color: "var(--text-color-primary)",
    },
  },
  {
    name: "ChipGroup",
    render: ({ ChipGroup }, testId) => (
      <ChipGroup data-testid={testId}>
        <span>Grouped chip</span>
      </ChipGroup>
    ),
    assert: () => cy.contains("Grouped chip").should("be.visible"),
  },
  {
    name: "CircularProgress",
    render: ({ CircularProgress }, testId) => (
      <CircularProgress
        value={65}
        aria-label="Loading progress"
        data-testid={testId}
      />
    ),
  },
  {
    name: "ColorPicker",
    render: ({ ColorPicker }, testId) => (
      <ColorPicker
        colors={[
          { label: "Red", value: "#f00" },
          { label: "Blue", value: "#00f" },
        ]}
        selected="#f00"
        onChange={noop}
        data-testid={testId}
      />
    ),
  },
  {
    name: "CommandPalette",
    render: ({ CommandPalette }, testId) => (
      <CommandPalette
        isOpen
        commands={[{ label: "Open Settings", action: noop }]}
        onClose={noop}
        data-testid={testId}
        inputAriaLabel="Search commands"
      />
    ),
    assert: () => cy.contains("Open Settings").should("be.visible"),
  },
  {
    name: "DataTable",
    render: ({ DataTable }, testId) => (
      <DataTable columns={tableColumns} data={tableData} data-testid={testId} />
    ),
    assert: () => cy.contains("Aurora").should("be.visible"),
  },
  {
    name: "DateTimePicker",
    render: ({ DateTimePicker }, testId) => (
      <DateTimePicker
        label="Start time"
        value="2026-05-10T09:00"
        onChange={noop}
        data-testid={testId}
      />
    ),
  },
  {
    name: "Divider",
    render: ({ Divider }, testId) => <Divider data-testid={testId} />,
  },
  {
    name: "Dropdown",
    render: ({ Dropdown }, testId) => (
      <Dropdown
        triggerIcon={TestIcon}
        items={[{ label: "Profile", onClick: noop }]}
        aria-label="Account menu"
        data-testid={testId}
      />
    ),
  },
  {
    name: "EmptyState",
    render: ({ EmptyState }, testId) => (
      <EmptyState
        title="No records"
        description="Create your first record."
        data-testid={testId}
      />
    ),
    assert: () => cy.contains("No records").should("be.visible"),
  },
  {
    name: "FileUpload",
    render: ({ FileUpload }, testId) => (
      <FileUpload label="Upload file" onSubmit={noop} data-testid={testId} />
    ),
  },
  {
    name: "Footer",
    render: ({ Footer }, testId) => (
      <Footer
        copyright="Boreal UI"
        links={[{ label: "Docs", href: "/docs" }]}
        data-testid={testId}
      />
    ),
    assert: () => cy.contains("Boreal UI").should("be.visible"),
  },
  {
    name: "FormGroup",
    render: ({ FormGroup }, testId) => (
      <FormGroup id="email" label="Email" data-testid={testId}>
        <input type="email" title="email" />
      </FormGroup>
    ),
  },
  {
    name: "IconButton",
    render: ({ IconButton }, testId) => (
      <IconButton icon={TestIcon} aria-label="Refresh" data-testid={testId} />
    ),
  },
  {
    name: "MarkdownRenderer",
    render: ({ MarkdownRenderer }, testId) => (
      <MarkdownRenderer content="**Markdown content**" data-testid={testId} />
    ),
    assert: () => cy.contains("Markdown content").should("be.visible"),
  },
  {
    name: "MessagePopup",
    render: ({ MessagePopup }, testId) => (
      <MessagePopup
        message="Message sent"
        visible
        onClose={noop}
        data-testid={testId}
      />
    ),
    assert: () => cy.contains("Message sent").should("be.visible"),
  },
  {
    name: "MetricBox",
    render: ({ MetricBox }, testId) => (
      <MetricBox
        title="Coverage"
        value="98%"
        subtext="Statements"
        data-testid={testId}
      />
    ),
    renderA11y: ({ MetricBox }, testId) => (
      <MetricBox
        title="Coverage"
        value="98%"
        subtext="Statements"
        theme="clear"
        data-testid={testId}
      />
    ),
    a11yWrapperStyle: {
      backgroundColor: "var(--background-color)",
      color: "var(--text-color-primary)",
    },
  },
  {
    name: "Modal",
    render: ({ Modal }, testId) => (
      <Modal open title="Confirm" onClose={noop} data-testid={testId}>
        <p>Modal body</p>
      </Modal>
    ),
    renderA11y: ({ Modal }, testId) => (
      <>
        <style>
          {`
            [data-testid="${testId}"],
            [data-testid="${testId}-content"] {
              opacity: 1 !important;
              pointer-events: auto !important;
              transform: none !important;
            }
          `}
        </style>
        <Modal open title="Confirm" onClose={noop} data-testid={testId}>
          <p>Modal body</p>
        </Modal>
      </>
    ),
    assert: () => cy.contains("Modal body").should("be.visible"),
    a11ySelector: (testId) => `[data-testid="${testId}"]`,
    waitForA11y: (testId) => {
      cy.get(`[data-testid="${testId}-content"]`).should("be.visible");
    },
  },
  {
    name: "NavBar",
    render: ({ NavBar }, testId) => (
      <NavBar items={[{ label: "Home", path: "/" }]} data-testid={testId} />
    ),
    renderA11y: ({ NavBar }, testId) => (
      <NavBar
        items={[{ label: "Home", path: "/" }]}
        theme="clear"
        glass={false}
        data-testid={testId}
      />
    ),
    assert: () => cy.contains("Home").should("be.visible"),
    a11yWrapperStyle: {
      backgroundColor: "var(--background-color)",
      color: "var(--text-color-primary)",
    },
  },
  {
    name: "NotificationCenter",
    render: ({ NotificationCenter }, testId) => (
      <NotificationCenter
        notifications={notificationItems}
        onRemove={noop}
        onClearAll={noop}
        showClearAll
        data-testid={testId}
      />
    ),
    renderA11y: ({ NotificationCenter }, testId) => (
      <NotificationCenter
        notifications={notificationItems}
        onRemove={noop}
        onClearAll={noop}
        showClearAll={false}
        data-testid={testId}
      />
    ),
    assert: () => cy.contains("Build completed").should("be.visible"),
    waitForA11y: (testId) => {
      cy.get(`[data-testid="${testId}-item-one-message"]`).should("be.visible");
      cy.wait(350);
    },
  },
  {
    name: "Pager",
    render: ({ Pager }, testId) => (
      <Pager
        totalItems={30}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={noop}
        data-testid={testId}
      />
    ),
  },
  {
    name: "PopOver",
    render: ({ PopOver }, testId) => (
      <PopOver
        trigger="More info"
        content="PopOver content"
        data-testid={testId}
      />
    ),
    renderA11y: ({ PopOver }, testId) => (
      <PopOver
        trigger="More info"
        content="PopOver content"
        theme="clear"
        glass={false}
        data-testid={testId}
      />
    ),
    waitForA11y: (testId) => {
      cy.get(`[data-testid="${testId}-trigger"]`).click();
      cy.get(`[data-testid="${testId}-content"]`).should("exist");
      cy.wait(300);
    },
    a11yWrapperStyle: {
      backgroundColor: "var(--background-color)",
      color: "var(--text-color-primary)",
    },
  },
  {
    name: "ProgressBar",
    render: ({ ProgressBar }, testId) => (
      <ProgressBar
        value={70}
        aria-label="Upload progress"
        data-testid={testId}
      />
    ),
  },
  {
    name: "RadioButton",
    render: ({ RadioButton }, testId) => (
      <RadioButton
        label="Choice A"
        name="choice"
        value="a"
        checked={false}
        onChange={noop}
        data-testid={testId}
      />
    ),
  },
  {
    name: "RadioGroup",
    render: ({ RadioGroup }, testId) => (
      <RadioGroup
        name="group"
        label="Choose one"
        value="a"
        onChange={noop}
        options={basicOptions}
        data-testid={testId}
      />
    ),
  },
  {
    name: "Rating",
    render: ({ Rating }, testId) => (
      <Rating label="Quality" value={3} onChange={noop} data-testid={testId} />
    ),
  },
  {
    name: "ScrollToTop",
    render: ({ ScrollToTop }, testId) => (
      <ScrollToTop aria-label="Scroll to top" data-testid={testId} />
    ),
  },
  {
    name: "Select",
    render: ({ Select }, testId) => (
      <Select
        label="Plan"
        value="alpha"
        options={basicOptions}
        onChange={noop}
        data-testid={testId}
      />
    ),
  },
  {
    name: "Sidebar",
    render: ({ Sidebar }, testId) => (
      <Sidebar
        links={[{ label: "Dashboard", href: "/dashboard" }]}
        data-testid={testId}
      />
    ),
    assert: () => cy.contains("Dashboard").should("be.visible"),
  },
  {
    name: "Skeleton",
    render: ({ Skeleton }, testId) => (
      <Skeleton
        width="12rem"
        height="2rem"
        aria-label="Loading card"
        data-testid={testId}
      />
    ),
  },
  {
    name: "Slider",
    render: ({ Slider }, testId) => (
      <Slider label="Volume" value={40} onChange={noop} data-testid={testId} />
    ),
  },
  {
    name: "Spinner",
    render: ({ Spinner }, testId) => (
      <Spinner aria-label="Loading content" data-testid={testId} />
    ),
  },
  {
    name: "Stepper",
    render: ({ Stepper }, testId) => (
      <Stepper
        steps={[{ label: "Details" }, { label: "Confirm" }]}
        activeStep={0}
        data-testid={testId}
      />
    ),
  },
  {
    name: "Tabs",
    render: ({ Tabs }, testId) => (
      <Tabs
        tabs={[{ label: "Overview" }, { label: "Usage" }]}
        data-testid={testId}
      />
    ),
  },
  {
    name: "TagInput",
    render: ({ TagInput }, testId) => (
      <TagInput tags={["React", "Next"]} onChange={noop} data-testid={testId} />
    ),
  },
  {
    name: "TextArea",
    render: ({ TextArea }, testId) => (
      <TextArea
        label="Notes"
        value="Sample notes"
        onChange={noop}
        data-testid={testId}
      />
    ),
  },
  {
    name: "TextInput",
    render: ({ TextInput }, testId) => (
      <TextInput
        label="Name"
        value="Boreal"
        onChange={noop}
        data-testid={testId}
      />
    ),
  },
  {
    name: "ThemeProvider",
    render: ({ ThemeProvider }, testId) => (
      <ThemeProvider>
        <div data-testid={testId}>Theme provider child</div>
      </ThemeProvider>
    ),
  },
  {
    name: "ThemeSelect",
    render: ({ ThemeProvider, ThemeSelect }, testId) => (
      <ThemeProvider>
        <ThemeSelect label="Theme" data-testid={testId} />
      </ThemeProvider>
    ),
  },
  {
    name: "Timeline",
    render: ({ Timeline }, testId) => (
      <Timeline
        items={[{ title: "Created", description: "Project created" }]}
        data-testid={testId}
      />
    ),
  },
  {
    name: "Toggle",
    render: ({ Toggle }, testId) => (
      <Toggle
        label="Enabled"
        checked={true}
        onChange={noop}
        data-testid={testId}
      />
    ),
  },
  {
    name: "Toolbar",
    render: ({ Toolbar }, testId) => (
      <Toolbar title="Editor" data-testid={testId}>
        <button type="button">Action</button>
      </Toolbar>
    ),
  },
  {
    name: "Tooltip",
    render: ({ Tooltip }, testId) => (
      <Tooltip text="Helpful tooltip" data-testid={testId}>
        <button type="button">Hover target</button>
      </Tooltip>
    ),
    assert: () => cy.contains("Hover target").should("be.visible"),
  },
  {
    name: "Typography",
    render: ({ Typography }, testId) => (
      <Typography data-testid={testId}>Readable text</Typography>
    ),
  },
];

export function runComponentSmokeTests(
  flavor: "core" | "next",
  library: ComponentLibrary,
) {
  describe(`${flavor} component smoke tests`, () => {
    componentSmokeCases.forEach((componentCase) => {
      it(`mounts ${componentCase.name}`, () => {
        const testId = `${flavor}-${componentCase.name.toLowerCase()}`;

        cy.mount(
          <div style={{ padding: 24, maxWidth: 900 }}>
            {componentCase.render(library, testId)}
          </div>,
        );

        if (componentCase.assert) {
          componentCase.assert(testId);
          return;
        }

        cy.get("[data-cy-root]").should("not.be.empty");
      });
    });
  });
}

export function runComponentAccessibilityTests(
  flavor: "core" | "next",
  library: ComponentLibrary,
) {
  describe(`${flavor} component accessibility tests`, () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    componentSmokeCases.forEach((componentCase) => {
      it(`has no detectable accessibility violations in ${componentCase.name}`, () => {
        const testId = `${flavor}-${componentCase.name.toLowerCase()}-a11y`;
        const a11ySelector =
          componentCase.a11ySelector?.(testId) ?? `[data-cy="${testId}-root"]`;

        cy.mount(
          <div
            data-cy={`${testId}-root`}
            style={{
              padding: 24,
              maxWidth: 900,
              minHeight: 180,
              ...componentCase.a11yWrapperStyle,
            }}
          >
            {renderA11yCase(componentCase, library, testId)}
          </div>,
        );

        if (componentCase.waitForA11y) {
          componentCase.waitForA11y(testId, cy);
        } else {
          cy.get(a11ySelector).should("exist");
        }

        cy.injectAxe();

        cy.checkA11y(a11ySelector, undefined, terminalLog);
      });
    });
  });
}

export function runComponentThemedAccessibilityTests(
  flavor: "core" | "next",
  library: ComponentLibrary,
) {
  const ThemeProvider = library.ThemeProvider;

  describe(`${flavor} component themed accessibility tests`, () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    componentSmokeCases.forEach((componentCase) => {
      if (componentCase.name === "Modal") {
        appThemeSchemes.forEach((scheme) => {
          const schemeId = schemeTestId(scheme.name);
          it(`has no detectable accessibility violations in Modal with ${scheme.name}`, () => {
            const testId = `${flavor}-modal-${schemeId}-theme-a11y`;
            const a11ySelector =
              componentCase.a11ySelector?.(testId) ??
              `[data-cy="${testId}-root"]`;
            const content = (
              <div
                data-cy={`${testId}-root`}
                style={{
                  ...getScopedSchemeStyle(scheme),
                  padding: 24,
                  maxWidth: 1100,
                  minHeight: 180,
                  ...componentCase.a11yWrapperStyle,
                }}
              >
                {renderA11yCase(componentCase, library, testId)}
              </div>
            );

            cy.mount(
              ThemeProvider ? (
                <ThemeProvider
                  customSchemes={[...appThemeSchemes]}
                  initialSchemeName={scheme.name}
                >
                  {content}
                </ThemeProvider>
              ) : (
                content
              ),
            );

            componentCase.waitForA11y?.(testId, cy);

            cy.injectAxe();

            cy.checkA11y(a11ySelector, themedA11yOptions, terminalLog);
          });
        });

        return;
      }

      it(`has no detectable accessibility violations in ${componentCase.name} variants across app themes`, () => {
        const testId = `${flavor}-${componentCase.name.toLowerCase()}-theme-matrix-a11y`;
        const a11ySelector = `[data-cy="${testId}-root"]`;
        const variants = getVariantProps(componentCase.name);

        cy.mount(
          <div
            data-cy={`${testId}-root`}
            style={{
              display: "grid",
              gap: 16,
              padding: 24,
              maxWidth: 1200,
              minHeight: 180,
              backgroundColor: "var(--background-color)",
              color: "var(--text-color)",
              ...componentCase.a11yWrapperStyle,
            }}
          >
            {appThemeSchemes.map((scheme) => {
              const schemeId = schemeTestId(scheme.name);

              return (
                <section
                  key={scheme.name}
                  data-cy={`${testId}-${schemeId}-scheme`}
                  style={{
                    ...getScopedSchemeStyle(scheme),
                    display: "grid",
                    gap: 12,
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 14rem), 1fr))",
                    padding: 16,
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {variants.map((variant) => {
                    const variantTestId = `${testId}-${schemeId}-${variant.label}`;

                    return (
                      <div
                        key={variant.label}
                        data-cy={`${variantTestId}-variant`}
                      >
                        {renderA11yCase(
                          componentCase,
                          library,
                          variantTestId,
                          variant.props,
                        )}
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>,
        );

        if (componentCase.name === "Chip") {
          cy.wait(350);
        } else if (componentCase.name === "NotificationCenter") {
          cy.wait(350);
        } else if (componentCase.name === "PopOver") {
          const firstSchemeId = schemeTestId(appThemeSchemes[0].name);
          cy.get(
            `[data-testid="${testId}-${firstSchemeId}-base-trigger"]`,
          ).click();
          cy.get(
            `[data-testid="${testId}-${firstSchemeId}-base-content"]`,
          ).should("exist");
          cy.wait(300);
        } else {
          cy.get(a11ySelector).should("exist");
        }

        cy.injectAxe();

        cy.checkA11y(a11ySelector, themedA11yOptions, terminalLog);
      });
    });
  });
}
