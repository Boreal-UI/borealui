import { render, screen, fireEvent } from "@testing-library/react";
import ToolbarBase from "@/components/Toolbar/ToolbarBase";
import { axe, toHaveNoViolations } from "jest-axe";
import { jest } from "@jest/globals";
import { DummyAvatar } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const mockStyles = {
  toolbar: "toolbar",
  glass: "glass",
  section: "section",
  title: "title",
  avatarWrapper: "avatarWrapper",
  avatarButton: "avatarButton",

  primary: "primary",
  secondary: "secondary",
  success: "success",
  error: "error",
  warning: "warning",
  clear: "clear",

  static: "static",
  fixed: "fixed",
  sticky: "sticky",

  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  shadowLight: "shadowLight",
  shadowStrong: "shadowStrong",
};

describe("ToolbarBase", () => {
  it("renders left, center, and right sections with correct default roles and labels", () => {
    render(
      <ToolbarBase
        title="Toolbar Title"
        left={<div>Left Section</div>}
        center={<div>Center Content</div>}
        right={<div>Right Section</div>}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    const toolbar = screen.getByRole("toolbar", { name: "Toolbar" });
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveAttribute("aria-orientation", "horizontal");

    expect(
      screen.getByRole("group", { name: "Toolbar left section" }),
    ).toHaveTextContent("Left Section");
    expect(
      screen.getByRole("group", { name: "Toolbar center section" }),
    ).toHaveTextContent("Center Content");
    expect(
      screen.getByRole("group", { name: "Toolbar right section" }),
    ).toHaveTextContent("Right Section");

    const heading = screen.getByRole("heading", { name: "Toolbar Title" });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
    expect(heading).toHaveAttribute("id", "toolbar-title");
  });

  it("renders custom section aria labels when provided", () => {
    render(
      <ToolbarBase
        left={<div>Nav</div>}
        center={<div>Page context</div>}
        right={<div>Actions</div>}
        leftAriaLabel="Navigation controls"
        centerAriaLabel="Page summary"
        rightAriaLabel="Action controls"
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(
      screen.getByRole("group", { name: "Navigation controls" }),
    ).toHaveTextContent("Nav");
    expect(
      screen.getByRole("group", { name: "Page summary" }),
    ).toHaveTextContent("Page context");
    expect(
      screen.getByRole("group", { name: "Action controls" }),
    ).toHaveTextContent("Actions");
  });

  it("uses aria-label when provided", () => {
    render(
      <ToolbarBase
        title="Toolbar"
        aria-label="Main toolbar"
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    const toolbar = screen.getByRole("toolbar", { name: "Main toolbar" });
    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveAttribute("aria-label", "Main toolbar");
    expect(toolbar).not.toHaveAttribute("aria-labelledby");
  });

  it("uses aria-labelledby instead of aria-label when both are provided", () => {
    render(
      <>
        <span id="external-toolbar-label">External toolbar label</span>
        <ToolbarBase
          title="Toolbar"
          aria-label="Fallback label"
          aria-labelledby="external-toolbar-label"
          AvatarComponent={DummyAvatar}
          classMap={mockStyles}
        />
      </>,
    );

    const toolbar = screen.getByRole("toolbar", {
      name: "External toolbar label",
    });

    expect(toolbar).toBeInTheDocument();
    expect(toolbar).toHaveAttribute(
      "aria-labelledby",
      "external-toolbar-label",
    );
    expect(toolbar).not.toHaveAttribute("aria-label");
  });

  it("uses the legacy ariaLabel prop as a fallback accessible name", () => {
    render(
      <ToolbarBase
        title="Toolbar"
        aria-label="Legacy toolbar label"
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(
      screen.getByRole("toolbar", { name: "Legacy toolbar label" }),
    ).toBeInTheDocument();
  });

  it("applies aria-describedby when provided", () => {
    render(
      <>
        <p id="toolbar-help">Use this toolbar to access page actions.</p>
        <ToolbarBase
          aria-label="Editor toolbar"
          aria-describedby="toolbar-help"
          AvatarComponent={DummyAvatar}
          classMap={mockStyles}
        />
      </>,
    );

    expect(
      screen.getByRole("toolbar", { name: "Editor toolbar" }),
    ).toHaveAttribute("aria-describedby", "toolbar-help");
  });

  it("renders avatar when provided", () => {
    render(
      <ToolbarBase
        avatar={{ name: "JD" }}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(screen.getByTestId("toolbar-avatar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "JD" })).toBeInTheDocument();
  });

  it("passes avatar aria-label when provided", () => {
    render(
      <ToolbarBase
        avatar={{
          name: "JD",
          "aria-label": "Open user profile menu",
        }}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Open user profile menu" }),
    ).toBeInTheDocument();
  });

  it("invokes avatar onClick handler", () => {
    const handleClick = jest.fn();

    render(
      <ToolbarBase
        avatar={{ name: "JD", onClick: handleClick }}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "JD" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("marks avatar as aria-hidden when it has no name, no onClick, and no ariaLabel", () => {
    render(
      <ToolbarBase
        avatar={{ src: "/avatar.png" }}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    const avatar = screen.getByTestId("toolbar-avatar").firstChild;
    expect(avatar).toHaveAttribute("aria-hidden", "true");
  });

  it("does not mark avatar as aria-hidden when ariaLabel is provided", () => {
    render(
      <ToolbarBase
        avatar={{ src: "/avatar.png", "aria-label": "User avatar" }}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(
      screen.getByRole("button", { name: "User avatar" }),
    ).toBeInTheDocument();
  });

  it("respects headingLevel prop for title element", () => {
    render(
      <ToolbarBase
        title="Custom Heading"
        headingLevel={2}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    const heading = screen.getByRole("heading", { name: "Custom Heading" });
    expect(heading.tagName).toBe("H2");
    expect(heading).toHaveClass("title");
  });

  it("clamps headingLevel below 1 to h1", () => {
    render(
      <ToolbarBase
        title="Clamped Low"
        headingLevel={0 as 1}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    const heading = screen.getByRole("heading", { name: "Clamped Low" });
    expect(heading.tagName).toBe("H1");
  });

  it("clamps headingLevel above 6 to h6", () => {
    render(
      <ToolbarBase
        title="Clamped High"
        headingLevel={7 as 6}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    const heading = screen.getByRole("heading", { name: "Clamped High" });
    expect(heading.tagName).toBe("H6");
  });

  it("uses a custom titleId when provided", () => {
    render(
      <ToolbarBase
        title="Toolbar Title"
        titleId="custom-toolbar-title"
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Toolbar Title" }),
    ).toHaveAttribute("id", "custom-toolbar-title");
  });

  it("applies theme, glass, attachment, rounding, shadow, and custom class names", () => {
    render(
      <ToolbarBase
        title="Styled"
        theme="secondary"
        glass
        attachment="sticky"
        rounding="large"
        shadow="strong"
        className="customToolbar"
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    const toolbar = screen.getByTestId("toolbar");
    expect(toolbar).toHaveClass("toolbar");
    expect(toolbar).toHaveClass("secondary");
    expect(toolbar).toHaveClass("glass");
    expect(toolbar).toHaveClass("sticky");
    expect(toolbar).toHaveClass("roundLarge");
    expect(toolbar).toHaveClass("shadowStrong");
    expect(toolbar).toHaveClass("customToolbar");
  });

  it("passes glass to the nested avatar by default and allows avatar override", () => {
    const { rerender } = render(
      <ToolbarBase
        glass
        avatar={{ name: "JD" }}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(screen.getByRole("button", { name: "JD" })).toHaveAttribute(
      "data-glass",
      "true",
    );

    rerender(
      <ToolbarBase
        glass
        avatar={{ name: "JD", glass: false }}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(screen.getByRole("button", { name: "JD" })).toHaveAttribute(
      "data-glass",
      "false",
    );
  });

  it("applies static attachment class by default", () => {
    render(
      <ToolbarBase
        title="Styled"
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    const toolbar = screen.getByTestId("toolbar");
    expect(toolbar).toHaveClass("static");
  });

  it("applies fixed attachment class when attachment is fixed", () => {
    render(
      <ToolbarBase
        title="Fixed Toolbar"
        attachment="fixed"
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(screen.getByTestId("toolbar")).toHaveClass("fixed");
  });

  it("applies default round and shadow classes when explicit values are not provided", () => {
    render(
      <ToolbarBase
        title="Styled"
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    const toolbar = screen.getByTestId("toolbar");
    expect(toolbar.className).toContain("roundMedium");
    expect(toolbar.className).toContain("shadowLight");
  });

  it("applies default round and shadow classes when explicit values are not provided", () => {
    render(
      <ToolbarBase
        title="Styled"
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    const toolbar = screen.getByTestId("toolbar");
    expect(toolbar.className).toContain("roundMedium");
    expect(toolbar.className).toContain("shadowLight");
  });

  it("supports a custom data-testid", () => {
    render(
      <ToolbarBase
        title="Custom Test Id"
        data-testid="custom-toolbar"
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(screen.getByTestId("custom-toolbar")).toBeInTheDocument();
    expect(screen.getByTestId("custom-toolbar-left")).toBeInTheDocument();
    expect(screen.getByTestId("custom-toolbar-center")).toBeInTheDocument();
    expect(screen.getByTestId("custom-toolbar-right")).toBeInTheDocument();
    expect(screen.getByTestId("custom-toolbar-title")).toBeInTheDocument();
  });

  it("renders without a title", () => {
    render(
      <ToolbarBase
        center={<div>Center only</div>}
        AvatarComponent={DummyAvatar}
        classMap={mockStyles}
      />,
    );

    expect(screen.queryByTestId("toolbar-title")).not.toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Toolbar center section" }),
    ).toHaveTextContent("Center only");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <>
        <p id="toolbar-description">
          Toolbar with navigation, context, actions, and profile access.
        </p>
        <ToolbarBase
          title="Toolbar Title"
          left={<button type="button">Back</button>}
          center={<div>Center Content</div>}
          right={<button type="button">Save</button>}
          avatar={{
            name: "JD",
            onClick: jest.fn(),
            "aria-label": "Open profile menu",
          }}
          aria-labelledby="toolbar-title"
          aria-describedby="toolbar-description"
          leftAriaLabel="Navigation"
          centerAriaLabel="Page information"
          rightAriaLabel="Actions"
          AvatarComponent={DummyAvatar}
          classMap={mockStyles}
        />
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
