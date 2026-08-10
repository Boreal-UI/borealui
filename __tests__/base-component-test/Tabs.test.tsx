import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import TabsBase from "@/components/Tabs/TabsBase";
import { DummyIcon } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const mockStyles = {
  tabsContainer: "tabsContainer",
  tabs: "tabs",
  tab: "tab",
  active: "active",
  disabled: "disabled",
  content: "content",
  primary: "primary",
  medium: "medium",
  icon: "icon",
  shadowLight: "shadowLight",
  roundMedium: "roundMedium",
  glass: "glass",
};

const tabsMock = [
  { label: "Tab 1", icon: DummyIcon },
  { label: "Tab 2" },
  { label: "Tab 3" },
];

describe("TabsBase", () => {
  it("renders the tablist and all tabs", () => {
    render(
      <TabsBase tabs={tabsMock} classMap={mockStyles} data-testid="tabs" />,
    );

    expect(screen.getByTestId("tabs")).toBeInTheDocument();
    expect(screen.getByRole("tablist", { name: "Tabs" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByTestId("tabs-tab-0")).toHaveTextContent("Tab 1");
    expect(screen.getByTestId("tabs-tab-1")).toHaveTextContent("Tab 2");
    expect(screen.getByTestId("tabs-tab-2")).toHaveTextContent("Tab 3");
  });

  it("marks the first tab selected by default", () => {
    render(
      <TabsBase tabs={tabsMock} classMap={mockStyles} data-testid="tabs" />,
    );

    const tab1 = screen.getByTestId("tabs-tab-0");
    const tab2 = screen.getByTestId("tabs-tab-1");
    const tab3 = screen.getByTestId("tabs-tab-2");

    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(tab2).toHaveAttribute("aria-selected", "false");
    expect(tab3).toHaveAttribute("aria-selected", "false");
    expect(tab1).toHaveAttribute("tabindex", "0");
    expect(tab2).toHaveAttribute("tabindex", "-1");
    expect(tab3).toHaveAttribute("tabindex", "-1");
  });

  it("uses defaultValue for uncontrolled initial selection", () => {
    render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        defaultValue={2}
        data-testid="tabs"
      />,
    );

    expect(screen.getByTestId("tabs-tab-2")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("tabs-tab-2")).toHaveAttribute("tabindex", "0");
  });

  it("switches active tab on click in uncontrolled mode", () => {
    render(
      <TabsBase tabs={tabsMock} classMap={mockStyles} data-testid="tabs" />,
    );

    const tab1 = screen.getByTestId("tabs-tab-0");
    const tab2 = screen.getByTestId("tabs-tab-1");

    fireEvent.click(tab2);

    expect(tab1).toHaveAttribute("aria-selected", "false");
    expect(tab2).toHaveAttribute("aria-selected", "true");
    expect(tab2).toHaveFocus();
  });

  it("calls onValueChange with the clicked tab index", () => {
    const handleChange = jest.fn();

    render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        onValueChange={handleChange}
        data-testid="tabs"
      />,
    );

    fireEvent.click(screen.getByTestId("tabs-tab-1"));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("supports controlled mode", () => {
    const handleChange = jest.fn();

    const { rerender } = render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        value={0}
        onValueChange={handleChange}
        data-testid="tabs"
      />,
    );

    fireEvent.click(screen.getByTestId("tabs-tab-2"));
    expect(handleChange).toHaveBeenCalledWith(2);

    expect(screen.getByTestId("tabs-tab-0")).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByTestId("tabs-tab-2")).toHaveAttribute(
      "aria-selected",
      "false",
    );

    rerender(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        value={2}
        onValueChange={handleChange}
        data-testid="tabs"
      />,
    );

    expect(screen.getByTestId("tabs-tab-2")).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("renders icons when provided", () => {
    render(
      <TabsBase tabs={tabsMock} classMap={mockStyles} data-testid="tabs" />,
    );

    expect(screen.getByTestId("tabs-icon-0")).toBeInTheDocument();
    expect(screen.getByTestId("tabs-tab-0")).toContainElement(
      screen.getByTestId("tabs-icon-0"),
    );
  });

  it("applies active classes to the active tab", () => {
    render(
      <TabsBase tabs={tabsMock} classMap={mockStyles} data-testid="tabs" />,
    );

    expect(screen.getByTestId("tabs-tab-0")).toHaveClass("tab", "active");
    expect(screen.getByTestId("tabs-tab-1")).toHaveClass("tab");
    expect(screen.getByTestId("tabs-tab-1")).not.toHaveClass("active");
  });

  it("applies theme, size, rounding, shadow, and custom className to the container or tabs", () => {
    render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        theme="primary"
        variant="glassOutline"
        size="medium"
        rounding="medium"
        shadow="light"
        className="customTabs"
        data-testid="tabs"
      />,
    );

    expect(screen.getByTestId("tabs")).toHaveClass(
      "tabsContainer",
      "primary",
      "glass",
      "medium",
      "customTabs",
    );

    expect(screen.getByTestId("tabs-tab-0")).toHaveClass(
      "tab",
      "shadowLight",
      "roundMedium",
    );
  });

  it("supports horizontal orientation by default", () => {
    render(
      <TabsBase tabs={tabsMock} classMap={mockStyles} data-testid="tabs" />,
    );

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("supports vertical orientation", () => {
    render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        orientation="vertical"
        data-testid="tabs"
      />,
    );

    expect(screen.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });

  it("supports keyboard arrow navigation in auto activation mode", () => {
    render(
      <TabsBase tabs={tabsMock} classMap={mockStyles} data-testid="tabs" />,
    );

    const tab1 = screen.getByTestId("tabs-tab-0");
    const tab2 = screen.getByTestId("tabs-tab-1");

    tab1.focus();
    fireEvent.keyDown(screen.getByTestId("tabs-tablist"), {
      key: "ArrowRight",
    });

    expect(tab2).toHaveFocus();
    expect(tab2).toHaveAttribute("aria-selected", "true");
    expect(tab1).toHaveAttribute("aria-selected", "false");
  });

  it("supports Home and End keys", () => {
    render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        defaultValue={1}
        data-testid="tabs"
      />,
    );

    const tab1 = screen.getByTestId("tabs-tab-0");
    const tab3 = screen.getByTestId("tabs-tab-2");
    const tablist = screen.getByTestId("tabs-tablist");

    fireEvent.keyDown(tablist, { key: "End" });
    expect(tab3).toHaveFocus();
    expect(tab3).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tablist, { key: "Home" });
    expect(tab1).toHaveFocus();
    expect(tab1).toHaveAttribute("aria-selected", "true");
  });

  it("uses manual activation mode without changing selection on arrow keys", () => {
    render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        activationMode="manual"
        data-testid="tabs"
      />,
    );

    const tab1 = screen.getByTestId("tabs-tab-0");
    const tab2 = screen.getByTestId("tabs-tab-1");
    const tablist = screen.getByTestId("tabs-tablist");

    tab1.focus();
    fireEvent.keyDown(tablist, { key: "ArrowRight" });

    expect(tab2).toHaveFocus();
    expect(tab1).toHaveAttribute("aria-selected", "true");
    expect(tab2).toHaveAttribute("aria-selected", "false");

    fireEvent.keyDown(tablist, { key: "Enter" });

    expect(tab2).toHaveAttribute("aria-selected", "true");
    expect(tab1).toHaveAttribute("aria-selected", "false");
  });

  it("supports Space key for manual activation", () => {
    render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        activationMode="manual"
        data-testid="tabs"
      />,
    );

    const tab2 = screen.getByTestId("tabs-tab-1");
    const tablist = screen.getByTestId("tabs-tablist");

    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(tab2).toHaveFocus();

    fireEvent.keyDown(tablist, { key: " " });
    expect(tab2).toHaveAttribute("aria-selected", "true");
  });

  it("skips disabled tabs during keyboard navigation", () => {
    const disabledTabs = [
      { label: "Tab 1" },
      { label: "Tab 2", disabled: true },
      { label: "Tab 3" },
    ];

    render(
      <TabsBase tabs={disabledTabs} classMap={mockStyles} data-testid="tabs" />,
    );

    const tab1 = screen.getByTestId("tabs-tab-0");
    const tab3 = screen.getByTestId("tabs-tab-2");

    tab1.focus();
    fireEvent.keyDown(screen.getByTestId("tabs-tablist"), {
      key: "ArrowRight",
    });

    expect(tab3).toHaveFocus();
    expect(tab3).toHaveAttribute("aria-selected", "true");
  });

  it("does not activate a disabled tab on click", () => {
    const disabledTabs = [
      { label: "Tab 1" },
      { label: "Tab 2", disabled: true },
      { label: "Tab 3" },
    ];

    const handleChange = jest.fn();

    render(
      <TabsBase
        tabs={disabledTabs}
        classMap={mockStyles}
        onValueChange={handleChange}
        data-testid="tabs"
      />,
    );

    const disabledTab = screen.getByTestId("tabs-tab-1");

    fireEvent.click(disabledTab);

    expect(disabledTab).toHaveAttribute("aria-disabled", "true");
    expect(disabledTab).toHaveClass("disabled");
    expect(disabledTab).toHaveAttribute("aria-selected", "false");
    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("tabs-tab-0")).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("applies tablist accessibility props", () => {
    render(
      <>
        <span id="tabs-heading">Project sections</span>
        <span id="tabs-description">Use arrow keys to switch tabs</span>
        <TabsBase
          tabs={tabsMock}
          classMap={mockStyles}
          tabListId="project-tabs"
          aria-labelledby="tabs-heading"
          aria-describedby="tabs-description"
          aria-live="polite"
          data-testid="tabs"
        />
      </>,
    );

    const tablist = screen.getByRole("tablist", { name: "Project sections" });

    expect(tablist).toHaveAttribute("id", "project-tabs");
    expect(tablist).toHaveAttribute("aria-labelledby", "tabs-heading");
    expect(tablist).toHaveAttribute("aria-describedby", "tabs-description");
    expect(tablist).toHaveAttribute("aria-live", "polite");
    expect(tablist).not.toHaveAttribute("aria-label");
  });

  it("uses aria-label on the tablist when aria-labelledby is not provided", () => {
    render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        aria-label="Settings tabs"
        data-testid="tabs"
      />,
    );

    expect(
      screen.getByRole("tablist", { name: "Settings tabs" }),
    ).toBeInTheDocument();
  });

  it("applies per-tab accessibility props and id overrides", () => {
    const accessibleTabs = [
      {
        label: "Overview",
        "aria-label": "Overview tab",
        "aria-describedby": "overview-help",
        id: "overview-tab",
        panelId: "overview-panel",
      },
      {
        label: "Details",
        id: "details-tab",
        panelId: "details-panel",
      },
    ];

    render(
      <>
        <span id="overview-help">Summary information</span>
        <TabsBase
          tabs={accessibleTabs}
          classMap={mockStyles}
          data-testid="tabs"
        />
      </>,
    );

    const overviewTab = screen.getByTestId("tabs-tab-0");
    const detailsTab = screen.getByTestId("tabs-tab-1");

    expect(overviewTab).toHaveAttribute("id", "overview-tab");
    expect(overviewTab).toHaveAttribute("aria-label", "Overview tab");
    expect(overviewTab).toHaveAttribute("aria-describedby", "overview-help");

    expect(detailsTab).toHaveAttribute("id", "details-tab");
  });

  it("generates stable tab ids from idBase when overrides are not provided", () => {
    render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        idBase="custom-tabs"
        data-testid="tabs"
      />,
    );

    expect(screen.getByTestId("tabs-tab-0")).toHaveAttribute(
      "id",
      "custom-tabs-tab-0",
    );
    expect(screen.getByTestId("tabs-tab-1")).toHaveAttribute(
      "id",
      "custom-tabs-tab-1",
    );
    expect(screen.getByTestId("tabs-tab-2")).toHaveAttribute(
      "id",
      "custom-tabs-tab-2",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <TabsBase
        tabs={tabsMock}
        classMap={mockStyles}
        aria-label="Example tabs"
        data-testid="tabs"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
