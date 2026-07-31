/// <reference types="cypress" />

import React from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type ComponentLibrary = typeof Core & Record<string, any>;
type Flavor = "core" | "next";

type BehaviorCase = {
  name: string;
  run: (library: ComponentLibrary, flavor: Flavor) => void;
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

const mountInFrame = (node: React.ReactNode) => {
  cy.mount(
    <div style={{ minHeight: 360, padding: 24, maxWidth: 900 }}>{node}</div>,
  );
};

const basicOptions = [
  { value: "alpha", label: "Alpha" },
  { value: "beta", label: "Beta" },
];

const behaviorCases: BehaviorCase[] = [
  {
    name: "Breadcrumbs",
    run: ({ Breadcrumbs }) => {
      mountInFrame(
        <Breadcrumbs
          data-testid="breadcrumbs"
          items={[
            { label: "Home", href: "/" },
            { label: "Components", href: "/components" },
          ]}
        />,
      );

      cy.get('[data-testid="breadcrumbs-nav-container"]').within(() => {
        cy.contains("a", "Home").should("have.attr", "href", "/");
        cy.contains(
          '[data-testid="breadcrumbs-nav-item-current"]',
          "Components",
        ).should("have.attr", "aria-current", "page");
      });
    },
  },
  {
    name: "Button",
    run: ({ Button }) => {
      const onClick = cy.stub().as("buttonClick");

      mountInFrame(
        <Button onClick={onClick} data-testid="button">
          Save
        </Button>,
      );

      cy.get('[data-testid="button"]').click();
      cy.get("@buttonClick").should("have.been.calledOnce");
    },
  },
  {
    name: "Card",
    run: ({ Card }) => {
      const onAction = cy.stub().as("cardAction");

      mountInFrame(
        <Card
          title="Deploy"
          description="Ready to publish"
          actionButtons={[{ label: "Run", onClick: onAction }]}
          data-testid="card"
        />,
      );

      cy.get('[data-testid="card"]').should("contain.text", "Deploy");
      cy.contains("button", "Run").click();
      cy.get("@cardAction").should("have.been.calledOnce");
    },
  },
  {
    name: "CheckBox",
    run: ({ CheckBox }) => {
      const onChange = cy.stub().as("checkboxChange");

      mountInFrame(
        <CheckBox
          label="Accept terms"
          checked={false}
          onChange={onChange}
          data-testid="checkbox"
        />,
      );

      cy.get('[data-testid="checkbox-wrapper"] input[type="checkbox"]').check({
        force: true,
      });
      cy.get("@checkboxChange").should("have.been.calledWith", true);
    },
  },
  {
    name: "Chip",
    run: ({ Chip }) => {
      cy.clock();
      const onClose = cy.stub().as("chipClose");

      mountInFrame(
        <Chip
          message="Saved"
          visible
          autoClose={false}
          usePortal={false}
          onClose={onClose}
          data-testid="chip"
        />,
      );

      cy.get('[data-testid="chip-message"]').should("contain.text", "Saved");
      cy.get('[data-testid="chip-chip-close"]').click();
      cy.tick(300);
      cy.get("@chipClose").should("have.been.calledOnce");
    },
  },
  {
    name: "ChipGroup",
    run: ({ ChipGroup }) => {
      const onRemove = cy.stub().as("chipGroupRemove");

      mountInFrame(
        <ChipGroup
          data-testid="chip-group"
          onRemove={onRemove}
          chips={[
            {
              id: "saved",
              message: "Saved",
              visible: true,
              autoClose: false,
              usePortal: false,
              "data-testid": "saved-chip",
            },
          ]}
        />,
      );

      cy.get('[data-testid="chip-group"]').should("contain.text", "Saved");
      cy.get('[data-testid="saved-chip-chip-close"]').click();
      cy.wait(320);
      cy.get("@chipGroupRemove").should("have.been.calledWith", "saved");
    },
  },
  {
    name: "CircularProgress",
    run: ({ CircularProgress }) => {
      mountInFrame(
        <CircularProgress
          value={60}
          aria-label="Upload progress"
          data-testid="circular-progress"
        />,
      );

      cy.get('[data-testid="circular-progress"]')
        .should("have.attr", "role", "progressbar")
        .and("have.attr", "aria-valuenow", "60");
    },
  },
  {
    name: "ColorPicker",
    run: ({ ColorPicker }) => {
      const onChange = cy.stub().as("colorChange");

      mountInFrame(
        <ColorPicker
          label="Accent"
          colors={[
            { label: "Red", value: "#ff0000" },
            { label: "Blue", value: "#0000ff" },
          ]}
          selected="#ff0000"
          onChange={onChange}
          data-testid="color-picker"
        />,
      );

      cy.get('[data-testid="color-picker-option-#0000ff"]').click();
      cy.get("@colorChange").should("have.been.calledWith", "#0000ff");
    },
  },
  {
    name: "CommandPalette",
    run: ({ CommandPalette }) => {
      const onClose = cy.stub().as("commandClose");
      const action = cy.stub().as("commandAction");

      mountInFrame(
        <CommandPalette
          isOpen
          onClose={onClose}
          inputAriaLabel="Search commands"
          commands={[
            { label: "Open project", action, keywords: ["project"] },
            { label: "Close panel", action: cy.stub() },
          ]}
          data-testid="command-palette"
        />,
      );

      cy.get('[data-testid="command-palette-option-0"]').click();
      cy.get("@commandAction").should("have.been.calledOnce");
      cy.get("@commandClose").should("have.been.calledOnce");
    },
  },
  {
    name: "DataTable",
    run: ({ DataTable }) => {
      const onSortChange = cy.stub().as("tableSort");

      mountInFrame(
        <DataTable
          columns={[
            { key: "name", label: "Name", sortable: true },
            { key: "status", label: "Status" },
          ]}
          data={[
            { name: "Boreal", status: "Stable" },
            { name: "Aurora", status: "Ready" },
          ]}
          serverSort
          onSortChange={onSortChange}
          data-testid="data-table"
        />,
      );

      cy.get('[data-testid="data-table-sort-name"]').click();
      cy.get("@tableSort").should("have.been.calledWith", "name", "asc");
    },
  },
  {
    name: "DateTimePicker",
    run: ({ DateTimePicker }) => {
      const onChange = cy.stub().as("dateTimeChange");

      mountInFrame(
        <DateTimePicker
          label="Starts"
          value="2026-05-12T10:00"
          onChange={onChange}
          data-testid="date-time-picker"
        />,
      );

      cy.get('[data-testid="date-time-picker-input"]')
        .clear()
        .type("2026-05-13T11:30");
      cy.get("@dateTimeChange").should("have.been.called");
    },
  },
  {
    name: "Divider",
    run: ({ Divider }) => {
      mountInFrame(
        <Divider decorative={false} label="Details" data-testid="divider" />,
      );

      cy.get('[data-testid="divider"]')
        .should("have.attr", "role", "separator")
        .and("have.attr", "aria-label", "Details");
    },
  },
  {
    name: "EmptyState",
    run: ({ EmptyState }) => {
      const onAction = cy.stub().as("emptyAction");

      mountInFrame(
        <EmptyState
          title="No results"
          message="Try another filter"
          actionLabel="Reset"
          onActionClick={onAction}
          data-testid="empty-state"
        />,
      );

      cy.contains("button", "Reset").click();
      cy.get("@emptyAction").should("have.been.calledOnce");
    },
  },
  {
    name: "FileUpload",
    run: ({ FileUpload }) => {
      const onFilesChange = cy.stub().as("filesChanged");
      const onSubmit = cy.stub().as("filesSubmitted");

      mountInFrame(
        <FileUpload
          label="Upload"
          onFilesChange={onFilesChange}
          onSubmit={onSubmit}
          data-testid="file-upload"
        />,
      );

      cy.get('[data-testid="file-upload-input"]').selectFile(
        {
          contents: Cypress.Buffer.from("hello"),
          fileName: "hello.txt",
          mimeType: "text/plain",
        },
        { force: true },
      );
      cy.get("@filesChanged").should("have.been.called");
      cy.contains("hello.txt").should("exist");
    },
  },
  {
    name: "Footer",
    run: ({ Footer }) => {
      mountInFrame(
        <Footer
          links={[{ label: "Docs", href: "/docs" }]}
          data-testid="footer"
        />,
      );

      cy.get('[data-testid="footer"]').within(() => {
        cy.contains("a", "Docs").should("have.attr", "href", "/docs");
      });
    },
  },
  {
    name: "FormGroup",
    run: ({ FormGroup, TextInput }) => {
      mountInFrame(
        <FormGroup label="Profile" description="Public display name">
          <TextInput
            label="Name"
            value="Ada"
            onChange={() => undefined}
            data-testid="form-name"
          />
        </FormGroup>,
      );

      cy.contains("Profile").should("exist");
      cy.contains("Public display name").should("exist");
      cy.get('[data-testid="form-name-input"]').should("have.value", "Ada");
    },
  },
  {
    name: "IconButton",
    run: ({ IconButton }) => {
      const onClick = cy.stub().as("iconButtonClick");

      mountInFrame(
        <IconButton
          icon={TestIcon}
          aria-label="Refresh"
          onClick={onClick}
          data-testid="icon-button"
        />,
      );

      cy.get('[data-testid="icon-button"]').click();
      cy.get("@iconButtonClick").should("have.been.calledOnce");
    },
  },
  {
    name: "MarkdownRenderer",
    run: ({ MarkdownRenderer }) => {
      mountInFrame(
        <MarkdownRenderer
          content={"# Release notes\n\n- Added tests"}
          data-testid="markdown"
        />,
      );

      cy.get('[data-testid="markdown"] h1').should(
        "contain.text",
        "Release notes",
      );
      cy.get('[data-testid="markdown"] li').should(
        "contain.text",
        "Added tests",
      );
    },
  },
  {
    name: "Menu",
    run: ({ Menu }) => {
      const onRename = cy.stub().as("menuRename");
      const onArchive = cy.stub().as("menuArchive");
      const onDeepArchive = cy.stub().as("menuDeepArchive");
      const DialogMenuHarness = () => {
        const [dialogOpen, setDialogOpen] = React.useState(false);

        return (
          <>
            <Menu
              data-testid="click-menu"
              aria-label="Action menu"
              activation="click"
              items={[
                {
                  label: "Open dialog",
                  onClick: () => setDialogOpen(true),
                  "data-testid": "click-menu-open-dialog",
                },
              ]}
            >
              <button type="button">Open actions</button>
            </Menu>
            {dialogOpen && (
              <div
                role="dialog"
                aria-label="Confirm action"
                data-testid="menu-dialog"
              >
                <button
                  type="button"
                  data-testid="menu-dialog-confirm"
                  onClick={() => setDialogOpen(false)}
                >
                  Confirm
                </button>
              </div>
            )}
          </>
        );
      };

      mountInFrame(
        <Menu
          data-testid="menu"
          aria-label="Project menu"
          items={[
            { label: "Rename", onClick: onRename, "data-testid": "menu-rename" },
            {
              label: "Move to",
              "data-testid": "menu-move",
              items: [
                {
                  label: "Folder",
                  "data-testid": "menu-folder",
                  items: [
                    {
                      label: "Deep archive",
                      onClick: onDeepArchive,
                      "data-testid": "menu-deep-archive",
                    },
                  ],
                },
                {
                  label: "Archive",
                  onClick: onArchive,
                  "data-testid": "menu-archive",
                },
              ],
            },
          ]}
        >
          <div>Project card</div>
        </Menu>,
      );

      cy.get('[data-testid="menu-target"]').rightclick();
      cy.get('[data-testid="menu-rename"]').should("exist").click({
        force: true,
      });
      cy.get("@menuRename").should("have.been.calledOnce");

      cy.get('[data-testid="menu-target"]').rightclick();
      cy.get('[data-testid="menu-move"]').trigger("mouseover");
      cy.get('[data-testid="menu-move-submenu"]').should("exist");
      cy.get('[data-testid="menu-rename"]').trigger("mouseover");
      cy.get('[data-testid="menu-move-submenu"]').should("not.exist");
      cy.get('[data-testid="menu-move"]').trigger("mouseover");
      cy.get('[data-testid="menu-move-submenu"]').should("exist");
      cy.get('[data-testid="menu-folder"]').trigger("mouseover");
      cy.get('[data-testid="menu-folder-submenu"]').should("exist");
      cy.get('[data-testid="menu-folder-submenu"]').trigger("mouseover");
      cy.get('[data-testid="menu-move-submenu"]').should("exist");
      cy.get('[data-testid="menu-folder-submenu"]').should("exist");
      cy.get('[data-testid="menu-move"]').trigger("mouseover");
      cy.get('[data-testid="menu-move-submenu"]').should("exist");
      cy.get('[data-testid="menu-folder-submenu"]').should("not.exist");
      cy.get('[data-testid="menu-folder"]').trigger("mouseover");
      cy.get('[data-testid="menu-folder-submenu"]').should("exist");
      cy.get('[data-testid="menu-deep-archive"]').should("exist").click({
        force: true,
      });
      cy.get("@menuDeepArchive").should("have.been.calledOnce");

      cy.get('[data-testid="menu-target"]').rightclick();
      cy.get('[data-testid="menu-move"]').trigger("mouseover");
      cy.get('[data-testid="menu-move-submenu"]').should("exist");
      cy.get('[data-testid="menu-archive"]').should("exist").click({
        force: true,
      });
      cy.get("@menuArchive").should("have.been.calledOnce");

      mountInFrame(<DialogMenuHarness />);

      cy.get('[data-testid="click-menu-target"]').click();
      cy.get('[data-testid="click-menu-menu"]').should("exist");
      cy.get('[data-testid="click-menu-open-dialog"]').click({ force: true });
      cy.get('[data-testid="click-menu-menu"]').should("not.exist");
      cy.get('[data-testid="menu-dialog"]').should("exist");
      cy.get('[data-testid="menu-dialog-confirm"]').click();
      cy.get('[data-testid="menu-dialog"]').should("not.exist");
      cy.get('[data-testid="click-menu-menu"]').should("not.exist");
    },
  },
  {
    name: "MessagePopup",
    run: ({ MessagePopup }) => {
      const onClose = cy.stub().as("popupClose");
      const onConfirm = cy.stub().as("popupConfirm");

      mountInFrame(
        <MessagePopup
          title="Confirm"
          message="Continue?"
          onClose={onClose}
          onConfirm={onConfirm}
          data-testid="message-popup"
        />,
      );

      cy.contains("button", "Confirm").click();
      cy.get("@popupConfirm").should("have.been.calledOnce");
    },
  },
  {
    name: "MetricBox",
    run: ({ MetricBox }) => {
      mountInFrame(
        <MetricBox
          title="Coverage"
          value="98%"
          subtext="Statements"
          data-testid="metric-box"
        />,
      );

      cy.get('[data-testid="metric-box"]').should("contain.text", "98%");
      cy.contains("Statements").should("exist");
    },
  },
  {
    name: "Modal",
    run: ({ Modal }) => {
      const onClose = cy.stub().as("modalClose");

      mountInFrame(
        <Modal open title="Confirm" onClose={onClose} data-testid="modal">
          <p>Modal body</p>
        </Modal>,
      );

      cy.get('[data-testid="modal-content"]').should("be.visible");
      cy.get('[data-testid="modal-close"]').click();
      cy.get("@modalClose").should("have.been.calledOnce");
    },
  },
  {
    name: "NavBar",
    run: ({ NavBar }) => {
      mountInFrame(
        <NavBar
          items={[{ icon: <TestIcon />, label: "Home", path: "/home" }]}
          data-testid="navbar"
        />,
      );

      cy.get('[data-testid="navbar-nav-bar"]').within(() => {
        cy.contains("a", "Home").should("have.attr", "href", "/home");
      });
    },
  },
  {
    name: "NotificationCenter",
    run: ({ NotificationCenter }) => {
      const onRemove = cy.stub().as("notificationRemove");
      const onClearAll = cy.stub().as("notificationClearAll");

      mountInFrame(
        <NotificationCenter
          notifications={[{ id: "one", message: "Build complete" }]}
          onRemove={onRemove}
          onClearAll={onClearAll}
          data-testid="notification-center"
        />,
      );

      cy.get('[data-testid="notification-center-item-one-dismiss"]').click();
      cy.get("@notificationRemove").should("have.been.calledWith", "one");
      cy.get('[data-testid="notification-center-clear-all"]').click();
      cy.get("@notificationClearAll").should("have.been.calledOnce");
    },
  },
  {
    name: "Pager",
    run: ({ Pager }) => {
      const onPageChange = cy.stub().as("pageChange");

      mountInFrame(
        <Pager
          totalItems={30}
          itemsPerPage={10}
          currentPage={1}
          onPageChange={onPageChange}
          data-testid="pager"
        />,
      );

      cy.get('[data-testid="pager-next"]').click();
      cy.get("@pageChange").should("have.been.calledWith", 2);
    },
  },
  {
    name: "PopOver",
    run: ({ PopOver }) => {
      mountInFrame(
        <PopOver
          trigger="More info"
          content="PopOver content"
          data-testid="popover"
        />,
      );

      cy.get('[data-testid="popover-trigger"]').click();
      cy.get('[data-testid="popover-content"]').should(
        "contain.text",
        "PopOver content",
      );
    },
  },
  {
    name: "ProgressBar",
    run: ({ ProgressBar }) => {
      mountInFrame(
        <ProgressBar value={70} aria-label="Upload" data-testid="progress" />,
      );

      cy.get('[data-testid="progress"]')
        .should("have.attr", "role", "progressbar")
        .and("have.attr", "aria-valuenow", "70");
    },
  },
  {
    name: "RadioButton",
    run: ({ RadioButton }) => {
      const onChange = cy.stub().as("radioChange");

      mountInFrame(
        <RadioButton
          label="Choice A"
          name="choice"
          value="a"
          checked={false}
          onChange={onChange}
          data-testid="radio"
        />,
      );

      cy.get('[data-testid="radio"]').check({ force: true });
      cy.get("@radioChange").should("have.been.calledWith", "a");
    },
  },
  {
    name: "RadioGroup",
    run: ({ RadioGroup }) => {
      const onChange = cy.stub().as("radioGroupChange");

      mountInFrame(
        <RadioGroup
          name="group"
          label="Choose"
          value="alpha"
          onChange={onChange}
          options={basicOptions}
          data-testid="radio-group"
        />,
      );

      cy.get('[data-testid="radio-group-beta"]').check({ force: true });
      cy.get("@radioGroupChange").should("have.been.calledWith", "beta");
    },
  },
  {
    name: "Rating",
    run: ({ Rating }) => {
      const onChange = cy.stub().as("ratingChange");

      mountInFrame(
        <Rating
          label="Quality"
          value={2}
          onChange={onChange}
          data-testid="rating"
        />,
      );

      cy.get('[data-testid="rating-star-4"]').click();
      cy.get("@ratingChange").should("have.been.calledWith", 4);
    },
  },
  {
    name: "ScrollToTop",
    run: ({ ScrollToTop }) => {
      cy.window().then((win) => {
        cy.stub(win, "scrollTo").as("scrollToTop");
      });

      mountInFrame(
        <>
          <div style={{ height: 1200 }} />
          <ScrollToTop offset={-1} data-testid="scroll-top" />
        </>,
      );

      cy.get('[data-testid="scroll-top-button"]').should("be.visible").click();
      cy.get("@scrollToTop").should("have.been.calledWith", {
        top: 0,
        behavior: "smooth",
      });
    },
  },
  {
    name: "Select",
    run: ({ Select }) => {
      const onChange = cy.stub().as("selectChange");

      mountInFrame(
        <Select
          label="Plan"
          value="alpha"
          options={basicOptions}
          onChange={onChange}
          data-testid="select"
        />,
      );

      cy.get('[data-testid="select-input"]').select("beta");
      cy.get("@selectChange").should("have.been.calledWith", "beta");
    },
  },
  {
    name: "Sidebar",
    run: ({ Sidebar }) => {
      mountInFrame(
        <Sidebar
          links={[
            {
              label: "Projects",
              children: [{ label: "Active", href: "/projects/active" }],
            },
          ]}
          data-testid="sidebar"
        />,
      );

      cy.contains("button", "Projects").click();
      cy.contains("a", "Active").should(
        "have.attr",
        "href",
        "/projects/active",
      );
    },
  },
  {
    name: "Skeleton",
    run: ({ Skeleton }) => {
      mountInFrame(
        <Skeleton
          width="12rem"
          height="2rem"
          label="Loading card"
          data-testid="skeleton"
        />,
      );

      cy.get('[data-testid="skeleton"]')
        .should("have.attr", "aria-busy", "true")
        .and("have.attr", "role", "status");
      cy.get('[data-testid="skeleton-description"]').should(
        "contain.text",
        "Loading card",
      );
    },
  },
  {
    name: "Slider",
    run: ({ Slider }) => {
      const onChange = cy.stub().as("sliderChange");

      mountInFrame(
        <Slider
          label="Volume"
          value={20}
          onChange={onChange}
          data-testid="slider"
        />,
      );

      cy.get('[data-testid="slider"]').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        const nativeValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;

        nativeValueSetter?.call(input, "45");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      cy.get("@sliderChange").should("have.been.called");
    },
  },
  {
    name: "Spinner",
    run: ({ Spinner }) => {
      mountInFrame(<Spinner aria-label="Loading" data-testid="spinner" />);

      cy.get('[data-testid="spinner"]').should("have.attr", "role", "status");
    },
  },
  {
    name: "Stepper",
    run: ({ Stepper }) => {
      mountInFrame(
        <Stepper
          steps={[{ label: "Details" }, { label: "Confirm" }]}
          activeStep={1}
          data-testid="stepper"
        />,
      );

      cy.get('[data-testid="stepper"]').should("contain.text", "Confirm");
      cy.get('[data-testid="stepper-step-1-icon"]').should(
        "have.attr",
        "aria-current",
        "step",
      );
    },
  },
  {
    name: "Tabs",
    run: ({ Tabs }) => {
      const onChange = cy.stub().as("tabsChange");

      mountInFrame(
        <Tabs
          tabs={[{ label: "Overview" }, { label: "Usage" }]}
          onChange={onChange}
          data-testid="tabs"
        />,
      );

      cy.get('[data-testid="tabs-tab-1"]').click();
      cy.get("@tabsChange").should("have.been.calledWith", 1);
    },
  },
  {
    name: "TagInput",
    run: ({ TagInput }) => {
      const onChange = cy.stub().as("tagChange");

      mountInFrame(
        <TagInput
          tags={["React"]}
          onChange={onChange}
          suggestions={["Next"]}
          data-testid="tag-input"
        />,
      );

      cy.get('[data-testid="tag-input-input"]').type("Next{enter}");
      cy.get("@tagChange").should("have.been.called");
    },
  },
  {
    name: "TextArea",
    run: ({ TextArea }) => {
      const onChange = cy.stub().as("textAreaChange");

      mountInFrame(
        <TextArea
          label="Notes"
          value=""
          onChange={onChange}
          data-testid="text-area"
        />,
      );

      cy.get('[data-testid="text-area-input"]').type("Hello");
      cy.get("@textAreaChange").should("have.been.called");
    },
  },
  {
    name: "TextInput",
    run: ({ TextInput }) => {
      const onChange = cy.stub().as("textInputChange");

      mountInFrame(
        <TextInput
          label="Name"
          value=""
          onChange={onChange}
          data-testid="text-input"
        />,
      );

      cy.get('[data-testid="text-input-input"]').type("Ada");
      cy.get("@textInputChange").should("have.been.called");
    },
  },
  {
    name: "ThemeProvider",
    run: ({ ThemeProvider }) => {
      mountInFrame(
        <ThemeProvider initialSchemeName="Ocean Breeze">
          <div data-testid="theme-child">Themed child</div>
        </ThemeProvider>,
      );

      cy.get('[data-testid="theme-child"]').should(
        "contain.text",
        "Themed child",
      );
      cy.document()
        .its("documentElement.dataset.borealTheme")
        .should("eq", "Ocean Breeze");
    },
  },
  {
    name: "ThemeSelect",
    run: ({ ThemeProvider, ThemeSelect }) => {
      mountInFrame(
        <ThemeProvider initialSchemeName="Ocean Breeze">
          <ThemeSelect label="Theme" data-testid="theme-select" />
        </ThemeProvider>,
      );

      cy.get('[data-testid="theme-select-input"]').select("Forest Dusk");
      cy.document()
        .its("documentElement.dataset.borealTheme")
        .should("eq", "Forest Dusk");
    },
  },
  {
    name: "Timeline",
    run: ({ Timeline }) => {
      mountInFrame(
        <Timeline
          items={[
            { title: "Created", description: "Project created" },
            { title: "Shipped", description: "Release published" },
          ]}
          data-testid="timeline"
        />,
      );

      cy.get('[data-testid="timeline"]').should("contain.text", "Shipped");
    },
  },
  {
    name: "Toggle",
    run: ({ Toggle }) => {
      const onChange = cy.stub().as("toggleChange");

      mountInFrame(
        <Toggle
          label="Enabled"
          checked={false}
          onChange={onChange}
          data-testid="toggle"
        />,
      );

      cy.get('[data-testid="toggle"]').click();
      cy.get("@toggleChange").should("have.been.calledWith", true);
    },
  },
  {
    name: "Toolbar",
    run: ({ Toolbar }) => {
      const onAvatarClick = cy.stub().as("toolbarAvatarClick");

      mountInFrame(
        <Toolbar
          title="Editor"
          right={<button type="button">Action</button>}
          avatar={{ name: "Ada Lovelace", onClick: onAvatarClick }}
          data-testid="toolbar"
        />,
      );

      cy.get('[data-testid="toolbar"]').should("contain.text", "Editor");
      cy.contains("button", "AL").click();
      cy.get("@toolbarAvatarClick").should("have.been.calledOnce");
    },
  },
  {
    name: "Tooltip",
    run: ({ Tooltip }) => {
      mountInFrame(
        <Tooltip content="Helpful tooltip" data-testid="tooltip">
          <button type="button">Hover target</button>
        </Tooltip>,
      );

      cy.get('[data-testid="tooltip-trigger"]').focus();
      cy.get('[data-testid="tooltip"]')
        .should("have.attr", "aria-hidden", "false")
        .and("contain.text", "Helpful tooltip")
        .and("have.css", "opacity", "1");
    },
  },
  {
    name: "Typography",
    run: ({ Typography }) => {
      mountInFrame(
        <Typography as="h2" data-testid="typography">
          Section heading
        </Typography>,
      );

      cy.get('[data-testid="typography"]')
        .should("match", "h2")
        .and("contain.text", "Section heading");
    },
  },
];

const libraries: Array<{ flavor: Flavor; library: ComponentLibrary }> = [
  { flavor: "core", library: Core as ComponentLibrary },
  { flavor: "next", library: Next as ComponentLibrary },
];

describe("component behavior across implementations", () => {
  beforeEach(() => {
    cy.viewport(900, 620);
  });

  afterEach(() => {
    cy.document().then((documentRef) => {
      documentRef
        .querySelectorAll("#widget-portal, #popup-portal")
        .forEach((portal) => portal.remove());
      documentRef.body.classList.remove("noScroll", "no-scroll");
    });
  });

  libraries.forEach(({ flavor, library }) => {
    describe(`${flavor} implementation`, () => {
      behaviorCases.forEach((componentCase) => {
        it(`verifies ${componentCase.name} behavior`, () => {
          componentCase.run(library, flavor);
        });
      });
    });
  });
});
