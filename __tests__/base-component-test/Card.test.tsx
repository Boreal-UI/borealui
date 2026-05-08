import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import CardBase from "@/components/Card/CardBase";
import { FaStar } from "react-icons/fa";
import {
  DummyButton,
  DummyIconButton,
  DummyImage,
  DummySkeleton,
} from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const classMap = {
  card: "card",

  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  quaternary: "quaternary",

  success: "success",
  warning: "warning",
  error: "error",
  clear: "clear",

  xs: "xs",
  small: "small",
  medium: "medium",
  large: "large",
  xl: "xl",

  loading: "loading",
  outline: "outline",
  disabled: "disabled",
  selected: "selected",
  selectable: "selectable",

  vertical: "vertical",
  horizontal: "horizontal",

  center: "card-center",
  left: "card-left",
  right: "card-right",

  content: "card-content",
  media: "card-media",
  image: "card-img",
  header: "card-header",
  title: "card-title",
  icon: "card-icon",
  body: "card-body",
  description: "card-desc",
  children: "card-children",
  footer: "card-footer",
  actions: "card-actions",
  action_button: "action-btn",

  shadowNone: "shadowNone",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  shadowIntense: "shadowIntense",

  roundNone: "roundNone",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  roundFull: "roundFull",

  borderNone: "borderNone",
  borderLight: "borderLight",
  borderMedium: "borderMedium",
  borderStrong: "borderStrong",
};

describe("CardBase", () => {
  const renderCard = (props: Record<string, unknown> = {}) =>
    render(
      <CardBase
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        data-testid="card"
        actionButtons={[]}
        {...props}
      />,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders as a region and uses aria-labelledby when title is present", () => {
    renderCard({
      title: "Card Title",
      description: "Card description",
    });

    const region = screen.getByRole("region");
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute("aria-labelledby");
    expect(region).not.toHaveAttribute("aria-label");
    expect(region).toHaveAttribute("aria-describedby");

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card description")).toBeInTheDocument();
  });

  it("uses aria-label when no title is present", () => {
    renderCard({
      description: "Description only",
    });

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("aria-label", "Description only");
    expect(card).not.toHaveAttribute("aria-labelledby");
    expect(card).not.toHaveAttribute("role");
  });

  it("uses fallback aria-label when no title or description is provided", () => {
    renderCard();

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("aria-label", "Content card");
    expect(card).not.toHaveAttribute("aria-labelledby");
    expect(card).not.toHaveAttribute("role");
  });

  it("uses explicit aria-label when provided", () => {
    renderCard({
      "aria-label": "Explicit card label",
      title: "",
      description: "",
    });

    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-label",
      "Explicit card label",
    );
  });

  it("uses explicit aria-labelledby when provided", () => {
    renderCard({
      title: "Card Title",
      "aria-labelledby": "custom-header-id",
    });

    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-labelledby",
      "custom-header-id",
    );
  });

  it("uses explicit aria-describedby when provided", () => {
    renderCard({
      title: "Card Title",
      description: "Card description",
      "aria-describedby": "external-description-id",
    });

    expect(screen.getByRole("region")).toHaveAttribute(
      "aria-describedby",
      "external-description-id",
    );
  });

  it("uses custom id, headerId, and descriptionId when provided", () => {
    renderCard({
      id: "custom-card-id",
      title: "Custom IDs",
      description: "Custom description",
      headerId: "custom-header-id",
      descriptionId: "custom-description-id",
    });

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("id", "custom-card-id");
    expect(card).toHaveAttribute("aria-labelledby", "custom-header-id");
    expect(card).toHaveAttribute("aria-describedby", "custom-description-id");
    expect(document.getElementById("custom-header-id")).toBeInTheDocument();
    expect(
      document.getElementById("custom-description-id"),
    ).toBeInTheDocument();
  });

  it("renders skeleton and aria-busy when loading is true", () => {
    renderCard({
      loading: true,
      imageUrl: "/img.jpg",
      imageAlt: "Example image",
    });

    const card = screen.getByTestId("card");
    expect(card).toHaveAttribute("aria-busy", "true");
    expect(card).toHaveAttribute("aria-label", "Content card");
    expect(card).not.toHaveAttribute("role");

    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("card-image")).not.toBeInTheDocument();
  });

  it("renders image when not loading", () => {
    renderCard({
      imageUrl: "/img.jpg",
      imageAlt: "Example image",
      title: "Image Card",
    });

    const image = screen.getByTestId("card-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/img.jpg");
    expect(image).toHaveAttribute("alt", "Example image");
    expect(image).toHaveAttribute("width", "640");
    expect(image).toHaveAttribute("height", "360");
  });

  it("renders image with provided width and height", () => {
    renderCard({
      imageUrl: "/img.jpg",
      imageAlt: "Sized image",
      imageWidth: 800,
      imageHeight: 500,
    });

    const image = screen.getByTestId("card-image");
    expect(image).toHaveAttribute("width", "800");
    expect(image).toHaveAttribute("height", "500");
  });

  it("uses fallback image alt text when imageAlt is not provided", () => {
    renderCard({
      imageUrl: "/img.jpg",
      title: "Fallback Alt Card",
    });

    expect(screen.getByAltText("Fallback Alt Card image")).toBeInTheDocument();
  });

  it("uses generic fallback image alt when title is absent", () => {
    renderCard({
      imageUrl: "/img.jpg",
    });

    expect(screen.getByAltText("Card image")).toBeInTheDocument();
  });

  it("uses empty alt text for decorative images", () => {
    renderCard({
      imageUrl: "/img.jpg",
      imageDecorative: true,
      title: "Decorative Card",
    });

    const image = screen.getByTestId("card-image");
    expect(image).toHaveAttribute("alt", "");
  });

  it("supports static image object input", () => {
    renderCard({
      imageUrl: {
        src: "/static.jpg",
        width: 900,
        height: 600,
      },
      imageAlt: "Static image",
    });

    const image = screen.getByTestId("card-image");
    expect(image).toHaveAttribute("src", "/static.jpg");
    expect(image).toHaveAttribute("width", "900");
    expect(image).toHaveAttribute("height", "600");
  });

  it("does not render image when imageUrl is blank", () => {
    renderCard({
      imageUrl: "   ",
      title: "No Image Card",
    });

    expect(screen.queryByTestId("card-image")).not.toBeInTheDocument();
  });

  it("renders imageFill layout inside media wrapper", () => {
    renderCard({
      imageUrl: "/img.jpg",
      imageAlt: "Fill image",
      imageFill: true,
    });

    const image = screen.getByTestId("card-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("data-fill", "true");
    expect(image.parentElement).toHaveClass("card-media");
  });

  it("renders title with card icon", () => {
    renderCard({
      title: "Icon Card",
      cardIcon: FaStar,
    });

    expect(screen.getByText("Icon Card")).toBeInTheDocument();
    expect(screen.getByTestId("card-icon")).toBeInTheDocument();
  });

  it("renders children inside the children container", () => {
    renderCard({
      title: "Child Card",
      children: <div data-testid="custom-children">Inner content</div>,
    });

    expect(screen.getByTestId("custom-children")).toBeInTheDocument();
    expect(screen.getByTestId("custom-children").parentElement).toHaveClass(
      "card-children",
    );
  });

  it("renders custom header when renderHeader is provided", () => {
    renderCard({
      title: "Ignored Title",
      renderHeader: () => <div data-testid="custom-header">Custom Header</div>,
    });

    expect(screen.getByTestId("custom-header")).toBeInTheDocument();
    expect(screen.queryByText("Ignored Title")).not.toBeInTheDocument();
  });

  it("renders custom content when renderContent is provided", () => {
    renderCard({
      description: "Ignored Description",
      renderContent: () => (
        <div data-testid="custom-content">Custom Content</div>
      ),
      children: <div data-testid="default-children">Default Children</div>,
    });

    expect(screen.getByTestId("custom-content")).toBeInTheDocument();
    expect(screen.queryByText("Ignored Description")).not.toBeInTheDocument();
    expect(screen.queryByTestId("default-children")).not.toBeInTheDocument();
  });

  it("renders footer when renderFooter is provided", () => {
    renderCard({
      renderFooter: () => <div data-testid="custom-footer">Footer content</div>,
    });

    expect(screen.getByTestId("custom-footer")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    const onClick = jest.fn();

    render(
      <CardBase
        title="Action Card"
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        data-testid="card"
        actionButtons={[
          {
            label: "Click Me",
            onClick,
            buttonComponent: DummyButton,
            iconButtonComponent: DummyIconButton,
          },
        ]}
      />,
    );

    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("action-btn");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("passes accessible props to standard action buttons", () => {
    render(
      <CardBase
        title="Accessible Action Card"
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        data-testid="card"
        actionButtons={[
          {
            label: "Toggle Details",
            onClick: jest.fn(),
            buttonComponent: DummyButton,
            iconButtonComponent: DummyIconButton,
            ["aria-describedby"]: "action-help",
            ["aria-pressed"]: true,
            ["aria-expanded"]: true,
            ["aria-controls"]: "details-panel",
            ["aria-current"]: "page",
            title: "Open details",
            disabled: true,
          },
        ]}
      />,
    );

    const button = screen.getByRole("button", { name: "Toggle Details" });

    expect(button).toHaveAttribute("aria-describedby", "action-help");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls", "details-panel");
    expect(button).toHaveAttribute("aria-current", "page");
    expect(button).toHaveAttribute("title", "Open details");
    expect(button).toBeDisabled();
  });

  it("renders icon buttons when useIconButtons is true and icon exists", () => {
    const onClick = jest.fn();

    render(
      <CardBase
        title="Icon Action Card"
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        data-testid="card"
        useIconButtons
        actionButtons={[
          {
            label: "Favorite",
            icon: FaStar,
            onClick,
            buttonComponent: DummyButton,
            iconButtonComponent: DummyIconButton,
          },
        ]}
      />,
    );

    const button = screen.getByRole("button", { name: "Favorite" });
    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("passes accessible props to icon action buttons", () => {
    render(
      <CardBase
        title="Accessible Icon Action Card"
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        data-testid="card"
        useIconButtons
        actionButtons={[
          {
            label: "Favorite",
            icon: FaStar,
            onClick: jest.fn(),
            buttonComponent: DummyButton,
            iconButtonComponent: DummyIconButton,
            ["aria-label"]: "Favorite item",
            ["aria-describedby"]: "favorite-help",
            ["aria-labelledby"]: "favorite-label",
            ["aria-pressed"]: true,
            ["aria-expanded"]: false,
            ["aria-controls"]: "favorite-panel",
            ["aria-current"]: "page",
            title: "Favorite this item",
            disabled: true,
          },
        ]}
      />,
    );

    const button = screen.getByRole("button", { name: "Favorite item" });

    expect(button).toHaveAttribute("aria-describedby", "favorite-help");
    expect(button).toHaveAttribute("aria-labelledby", "favorite-label");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "favorite-panel");
    expect(button).toHaveAttribute("aria-current", "page");
    expect(button).toHaveAttribute("title", "Favorite this item");
    expect(button).toBeDisabled();
  });

  it("falls back to normal button when useIconButtons is true but icon is missing", () => {
    render(
      <CardBase
        title="Mixed Action Card"
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        data-testid="card"
        useIconButtons
        actionButtons={[
          {
            label: "Regular Action",
            onClick: jest.fn(),
            buttonComponent: DummyButton,
            iconButtonComponent: DummyIconButton,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Regular Action" }),
    ).toBeInTheDocument();
  });

  it("renders multiple action buttons", () => {
    render(
      <CardBase
        title="Actions Card"
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        data-testid="card"
        actionButtons={[
          {
            label: "One",
            onClick: jest.fn(),
            buttonComponent: DummyButton,
            iconButtonComponent: DummyIconButton,
          },
          {
            label: "Two",
            onClick: jest.fn(),
            buttonComponent: DummyButton,
            iconButtonComponent: DummyIconButton,
          },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "One" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Two" })).toBeInTheDocument();
  });

  it("renders footer wrapper when actions exist", () => {
    render(
      <CardBase
        title="Footer Card"
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        data-testid="card"
        actionButtons={[
          {
            label: "Action",
            onClick: jest.fn(),
            buttonComponent: DummyButton,
            iconButtonComponent: DummyIconButton,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Action" }).closest(".card-footer"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Action" }).closest(".card-actions"),
    ).toBeInTheDocument();
  });

  it("applies theme, state, size, layout, align, shadow, rounding, border, outline, and custom className", () => {
    renderCard({
      title: "Styled Card",
      theme: "primary",
      state: "success",
      size: "medium",
      layout: "vertical",
      align: "center",
      shadow: "light",
      rounding: "small",
      border: "medium",
      outline: true,
      className: "custom-card-class",
    });

    const card = screen.getByTestId("card");

    expect(card).toHaveClass("card");
    expect(card).toHaveClass("vertical");
    expect(card).toHaveClass("card-center");
    expect(card).toHaveClass("primary");
    expect(card).toHaveClass("success");
    expect(card).toHaveClass("medium");
    expect(card).toHaveClass("shadowLight");
    expect(card).toHaveClass("roundSmall");
    expect(card).toHaveClass("borderMedium");
    expect(card).toHaveClass("outline");
    expect(card).toHaveClass("custom-card-class");
  });

  it("applies custom class names to card sections", () => {
    renderCard({
      title: "Class Name Card",
      description: "Body text",
      imageUrl: "/img.jpg",
      imageAlt: "Class name image",
      cardIcon: FaStar,
      contentClassName: "custom-content",
      imageClassName: "custom-image",
      headerClassName: "custom-header",
      titleClassName: "custom-title",
      iconClassName: "custom-icon",
      bodyClassName: "custom-body",
      descriptionClassName: "custom-description",
      childrenClassName: "custom-children",
      footerClassName: "custom-footer",
      actionsClassName: "custom-actions",
      actionButtonClassName: "custom-action-button",
      children: <div data-testid="custom-child-content">Child content</div>,
      actionButtons: [
        {
          label: "Action",
          onClick: jest.fn(),
          buttonComponent: DummyButton,
          iconButtonComponent: DummyIconButton,
        },
      ],
    });

    const image = screen.getByTestId("card-image");
    const title = screen.getByText("Class Name Card");
    const description = screen.getByText("Body text");
    const childContent = screen.getByTestId("custom-child-content");
    const icon = screen.getByTestId("card-icon");
    const action = screen.getByRole("button", { name: "Action" });

    expect(title.closest(".card-content")).toHaveClass("custom-content");

    expect(image).toHaveClass("card-img");
    expect(image).toHaveClass("custom-image");

    expect(title.closest(".card-header")).toHaveClass("custom-header");

    expect(title).toHaveClass("card-title");
    expect(title).toHaveClass("custom-title");

    expect(icon).toHaveClass("card-icon");
    expect(icon).toHaveClass("custom-icon");

    expect(description.closest(".card-body")).toHaveClass("custom-body");

    expect(description).toHaveClass("card-desc");
    expect(description).toHaveClass("custom-description");

    expect(childContent.closest(".card-children")).toHaveClass(
      "custom-children",
    );

    expect(action.closest(".card-footer")).toHaveClass("custom-footer");
    expect(action.closest(".card-actions")).toHaveClass("custom-actions");

    expect(action).toHaveClass("action-btn");
    expect(action).toHaveClass("custom-action-button");
  });

  it("applies custom media class name when imageFill is true", () => {
    renderCard({
      imageUrl: "/img.jpg",
      imageAlt: "Fill image",
      imageFill: true,
      mediaClassName: "custom-media",
    });

    const image = screen.getByTestId("card-image");

    expect(image.parentElement).toHaveClass("card-media");
    expect(image.parentElement).toHaveClass("custom-media");
  });

  it("applies custom action button class name to icon action buttons", () => {
    renderCard({
      title: "Icon Action Class Card",
      useIconButtons: true,
      actionButtonClassName: "custom-icon-action-button",
      actionButtons: [
        {
          label: "Favorite",
          icon: FaStar,
          onClick: jest.fn(),
          buttonComponent: DummyButton,
          iconButtonComponent: DummyIconButton,
        },
      ],
    });

    const button = screen.getByRole("button", { name: "Favorite" });

    expect(button).toHaveClass("action-btn");
    expect(button).toHaveClass("custom-icon-action-button");
  });

  it("applies selectable, selected, and disabled classes when provided", () => {
    renderCard({
      title: "Interactive Card",
      selectable: true,
      selected: true,
      disabled: true,
    });

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("selectable");
    expect(card).toHaveClass("selected");
    expect(card).toHaveClass("disabled");
  });

  it("applies custom class names to internal sections", () => {
    renderCard({
      title: "Class Name Card",
      description: "Body text",
      headerClassName: "custom-header",
      bodyClassName: "custom-body",
      footerClassName: "custom-footer",
      actionButtons: [
        {
          label: "Action",
          onClick: jest.fn(),
          buttonComponent: DummyButton,
          iconButtonComponent: DummyIconButton,
        },
      ],
    });

    expect(
      screen.getByText("Class Name Card").closest(".card-header"),
    ).toHaveClass("custom-header");
    expect(screen.getByText("Body text").closest(".card-body")).toHaveClass(
      "custom-body",
    );
    expect(
      screen.getByRole("button", { name: "Action" }).closest(".card-footer"),
    ).toHaveClass("custom-footer");
  });

  it("sets aria-describedby on the card root when description exists", () => {
    renderCard({
      title: "Accessible Card",
      description: "Detailed description",
    });

    const card = screen.getByRole("region");
    expect(card).toHaveAttribute("aria-describedby");

    const describedId = card.getAttribute("aria-describedby");
    expect(describedId).toBeTruthy();
    expect(document.getElementById(describedId as string)).toHaveTextContent(
      "Detailed description",
    );
  });

  it("does not set aria-describedby on the card root when description is absent", () => {
    renderCard({
      title: "No Description",
    });

    expect(screen.getByRole("region")).not.toHaveAttribute("aria-describedby");
  });

  it("renders as a button when selectable is true", () => {
    renderCard({
      title: "Selectable Card",
      selectable: true,
    });

    const card = screen.getByRole("button", { name: "Selectable Card" });
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("aria-pressed", "false");
  });

  it("sets aria-pressed when selectable and selected are true", () => {
    renderCard({
      title: "Selected Card",
      selectable: true,
      selected: true,
    });

    expect(
      screen.getByRole("button", { name: "Selected Card" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("sets aria-disabled and tabIndex -1 when disabled", () => {
    renderCard({
      title: "Disabled Card",
      disabled: true,
      tabIndex: 0,
    });

    const card = screen.getByRole("region");
    expect(card).toHaveAttribute("aria-disabled", "true");
    expect(card).toHaveAttribute("tabindex", "-1");
  });

  it("uses provided tabIndex when not disabled", () => {
    renderCard({
      title: "Focusable Card",
      tabIndex: 0,
    });

    expect(screen.getByRole("region")).toHaveAttribute("tabindex", "0");
  });

  it("supports explicit role override", () => {
    renderCard({
      title: "Article Card",
      role: "article",
    });

    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("passes aria-expanded, aria-controls, aria-current, aria-live, and aria-atomic to the root", () => {
    renderCard({
      title: "Stateful Card",
      "aria-expanded": true,
      "aria-controls": "details-panel",
      "aria-current": "page",
      "aria-live": "polite",
      "aria-atomic": true,
    });

    const card = screen.getByRole("region");
    expect(card).toHaveAttribute("aria-expanded", "true");
    expect(card).toHaveAttribute("aria-controls", "details-panel");
    expect(card).toHaveAttribute("aria-current", "page");
    expect(card).toHaveAttribute("aria-live", "polite");
    expect(card).toHaveAttribute("aria-atomic", "true");
  });

  it("uses the default test id when none is provided", () => {
    render(
      <CardBase
        title="Default Test Id"
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        actionButtons={[]}
      />,
    );

    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("has no accessibility violations for standard card", async () => {
    const { container } = render(
      <CardBase
        title="Accessible Card"
        description="This card is for accessibility testing"
        imageUrl="/img.jpg"
        imageAlt="Accessible image"
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        actionButtons={[
          {
            label: "Learn More",
            onClick: jest.fn(),
            buttonComponent: DummyButton,
            iconButtonComponent: DummyIconButton,
          },
        ]}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for loading card", async () => {
    const { container } = render(
      <CardBase
        loading
        title="Loading Card"
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        actionButtons={[]}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for custom render card", async () => {
    const { container } = render(
      <CardBase
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        renderHeader={() => <div>Custom Header</div>}
        renderContent={() => <div>Custom Content</div>}
        renderFooter={() => <div>Custom Footer</div>}
        actionButtons={[]}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations for selectable card", async () => {
    const { container } = render(
      <CardBase
        title="Selectable Card"
        selectable
        selected
        classMap={classMap}
        SkeletonComponent={DummySkeleton}
        ImageComponent={DummyImage}
        actionButtons={[]}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
