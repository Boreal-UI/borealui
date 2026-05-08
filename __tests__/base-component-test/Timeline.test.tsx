import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import TimelineBase from "@/components/Timeline/TimelineBase";
import { FaCheck } from "react-icons/fa";

expect.extend(toHaveNoViolations);

const mockStyles = {
  timeline: "timeline",
  item: "item",
  marker: "marker",
  icon: "icon",
  dot: "dot",
  content: "content",
  title: "title",
  date: "date",
  description: "description",
  vertical: "vertical",
  horizontal: "horizontal",
  primary: "primary",
  secondary: "secondary",
  glass: "glass",
  roundNone: "roundNone",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  roundFull: "roundFull",
  shadowNone: "shadowNone",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowStrong: "shadowStrong",
  shadowIntense: "shadowIntense",
};

const items = [
  {
    title: "Project Kickoff",
    date: "Jan 1, 2023",
    description: "Initial meeting with stakeholders.",
    icon: FaCheck,
  },
  {
    title: "Design Phase",
    date: "Feb 15, 2023",
    description: "Wireframes and mockups created.",
  },
];

describe("TimelineBase", () => {
  it("renders the timeline root with default accessible label", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    const timeline = screen.getByRole("list", { name: "Timeline" });

    expect(timeline).toBeInTheDocument();
    expect(timeline).toHaveAttribute("data-testid", "timeline");
  });

  it("renders all timeline items with correct structure", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(items.length);

    expect(screen.getByText("Project Kickoff")).toBeInTheDocument();
    expect(screen.getByText("Design Phase")).toBeInTheDocument();
    expect(
      screen.getByText("Initial meeting with stakeholders."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Wireframes and mockups created."),
    ).toBeInTheDocument();
  });

  it("applies the default test id and nested item test ids", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    expect(screen.getByTestId("timeline")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-0")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-0-marker")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-0-content")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-0-title")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-0-date")).toBeInTheDocument();
    expect(
      screen.getByTestId("timeline-item-0-description"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("timeline-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-1-marker")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-1-content")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-1-title")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-1-date")).toBeInTheDocument();
    expect(
      screen.getByTestId("timeline-item-1-description"),
    ).toBeInTheDocument();
  });

  it("supports a custom data-testid", () => {
    render(
      <TimelineBase
        items={items}
        classMap={mockStyles}
        data-testid="custom-timeline"
      />,
    );

    expect(screen.getByTestId("custom-timeline")).toBeInTheDocument();
    expect(screen.getByTestId("custom-timeline-item-0")).toBeInTheDocument();
    expect(
      screen.getByTestId("custom-timeline-item-1-content"),
    ).toBeInTheDocument();
  });

  it("applies default vertical and primary classes to the root", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    const timeline = screen.getByTestId("timeline");
    expect(timeline).toHaveClass("timeline");
    expect(timeline).toHaveClass("vertical");
    expect(timeline).toHaveClass("primary");
  });

  it("applies horizontal orientation classes when provided", () => {
    render(
      <TimelineBase
        items={items}
        classMap={mockStyles}
        orientation="horizontal"
      />,
    );

    const timeline = screen.getByTestId("timeline");
    expect(timeline).toHaveClass("horizontal");

    expect(screen.getByTestId("timeline-item-0")).toHaveClass("horizontal");
    expect(screen.getByTestId("timeline-item-1")).toHaveClass("horizontal");
  });

  it("applies theme, rounding, shadow, and glass classes", () => {
    render(
      <TimelineBase
        items={items}
        classMap={mockStyles}
        theme="secondary"
        glass
        rounding="large"
        shadow="strong"
      />,
    );

    expect(screen.getByTestId("timeline")).toHaveClass("secondary");
    expect(screen.getByTestId("timeline")).toHaveClass("glass");

    expect(screen.getByTestId("timeline-item-0-marker")).toHaveClass(
      "shadowStrong",
    );
    expect(screen.getByTestId("timeline-item-0-marker")).toHaveClass("glass");
    expect(screen.getByTestId("timeline-item-0-content")).toHaveClass("glass");
    expect(screen.getByTestId("timeline-item-0-content")).toHaveClass(
      "roundLarge",
    );
    expect(screen.getByTestId("timeline-item-0-content")).toHaveClass(
      "shadowStrong",
    );
  });

  it("renders an icon when an item includes one", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    expect(screen.getByTestId("timeline-item-0-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("timeline-item-0-dot")).not.toBeInTheDocument();
  });

  it("renders a dot when an item does not include an icon", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    expect(screen.getByTestId("timeline-item-1-dot")).toBeInTheDocument();
    expect(
      screen.queryByTestId("timeline-item-1-icon"),
    ).not.toBeInTheDocument();
  });

  it("marks decorative marker content as aria-hidden", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    expect(screen.getByTestId("timeline-item-0-marker")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByTestId("timeline-item-0-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByTestId("timeline-item-1-marker")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByTestId("timeline-item-1-dot")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("uses aria-labelledby for items with titles", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    const firstItem = screen.getByTestId("timeline-item-0");
    const title = screen.getByTestId("timeline-item-0-title");

    expect(title).toHaveAttribute("id", "timeline-item-0-title");
    expect(firstItem).toHaveAttribute(
      "aria-labelledby",
      "timeline-item-0-title",
    );
    expect(firstItem).not.toHaveAttribute("aria-label");
  });

  it("links item descriptions and dates through aria-describedby", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    expect(screen.getByTestId("timeline-item-0-date")).toHaveAttribute(
      "id",
      "timeline-item-0-date",
    );
    expect(screen.getByTestId("timeline-item-0-description")).toHaveAttribute(
      "id",
      "timeline-item-0-description",
    );
    expect(screen.getByTestId("timeline-item-0")).toHaveAttribute(
      "aria-describedby",
      "timeline-item-0-date timeline-item-0-description",
    );
  });

  it("applies aria-posinset and aria-setsize to each item", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    expect(screen.getByTestId("timeline-item-0")).toHaveAttribute(
      "aria-posinset",
      "1",
    );
    expect(screen.getByTestId("timeline-item-0")).toHaveAttribute(
      "aria-setsize",
      "2",
    );

    expect(screen.getByTestId("timeline-item-1")).toHaveAttribute(
      "aria-posinset",
      "2",
    );
    expect(screen.getByTestId("timeline-item-1")).toHaveAttribute(
      "aria-setsize",
      "2",
    );
  });

  it("renders a valid datetime attribute when the date is parseable", () => {
    render(<TimelineBase items={items} classMap={mockStyles} />);

    const time = screen
      .getByTestId("timeline-item-0-date")
      .querySelector("time");

    expect(time).toBeInTheDocument();
    expect(time).toHaveAttribute("dateTime");
    expect(time?.getAttribute("dateTime")).toContain("2023-01-01");
  });

  it("renders the date text even when the date string is not parseable", () => {
    const invalidDateItems = [
      {
        title: "Unknown date event",
        date: "Sometime soon",
        description: "Date cannot be parsed.",
      },
    ];

    render(<TimelineBase items={invalidDateItems} classMap={mockStyles} />);

    const time = screen
      .getByTestId("timeline-item-0-date")
      .querySelector("time");

    expect(screen.getByText("Sometime soon")).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(time).not.toHaveAttribute("dateTime", "Invalid Date");
  });

  it("prefers aria-labelledby over ariaLabel on the root when both are provided", () => {
    render(
      <>
        <h2 id="external-timeline-label">Project timeline</h2>
        <TimelineBase
          items={items}
          classMap={mockStyles}
          aria-label="Hidden timeline label"
          aria-labelledby="external-timeline-label"
        />
      </>,
    );

    const timeline = screen.getByRole("list", { name: "Project timeline" });

    expect(timeline).toBeInTheDocument();
    expect(timeline).toHaveAttribute(
      "aria-labelledby",
      "external-timeline-label",
    );
    expect(timeline).not.toHaveAttribute("aria-label", "Hidden timeline label");
  });

  it("supports aria-describedby on the root", () => {
    render(
      <>
        <p id="timeline-help">Ordered list of project milestones.</p>
        <TimelineBase
          items={items}
          classMap={mockStyles}
          aria-describedby="timeline-help"
        />
      </>,
    );

    expect(screen.getByRole("list", { name: "Timeline" })).toHaveAttribute(
      "aria-describedby",
      "timeline-help",
    );
  });

  it("supports a custom root role", () => {
    render(
      <TimelineBase
        items={items}
        classMap={mockStyles}
        role="region"
        aria-label="Timeline region"
      />,
    );

    expect(
      screen.getByRole("region", { name: "Timeline region" }),
    ).toBeInTheDocument();
  });

  it("passes through additional HTML attributes to the root element", () => {
    render(
      <TimelineBase
        items={items}
        classMap={mockStyles}
        id="project-timeline"
        tabIndex={0}
      />,
    );

    const timeline = screen.getByTestId("timeline");
    expect(timeline).toHaveAttribute("id", "project-timeline");
    expect(timeline).toHaveAttribute("tabIndex", "0");
  });

  it("supports custom className on the root", () => {
    render(
      <TimelineBase
        items={items}
        classMap={mockStyles}
        className="customTimeline"
      />,
    );

    expect(screen.getByTestId("timeline")).toHaveClass("customTimeline");
  });

  it("renders items with only a title", () => {
    const titleOnlyItems = [{ title: "Started" }];

    render(<TimelineBase items={titleOnlyItems} classMap={mockStyles} />);

    expect(screen.getByText("Started")).toBeInTheDocument();
    expect(
      screen.queryByTestId("timeline-item-0-date"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("timeline-item-0-description"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("timeline-item-0")).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("renders items with description only and falls back to aria-label", () => {
    const descriptionOnlyItems = [
      {
        title: "",
        description: "This event has no visible title.",
      },
    ];

    render(<TimelineBase items={descriptionOnlyItems} classMap={mockStyles} />);

    const item = screen.getByTestId("timeline-item-0");

    expect(item).toHaveAttribute("aria-label", "Timeline item 1");
    expect(item).not.toHaveAttribute("aria-labelledby");
    expect(
      screen.getByTestId("timeline-item-0-description"),
    ).toBeInTheDocument();
  });

  it("renders an empty timeline when no items are provided", () => {
    render(<TimelineBase items={[]} classMap={mockStyles} />);

    const timeline = screen.getByRole("list", { name: "Timeline" });
    expect(timeline).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("is accessible", async () => {
    const { container } = render(
      <TimelineBase items={items} classMap={mockStyles} />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("is accessible with external labeling", async () => {
    const { container } = render(
      <>
        <h2 id="timeline-heading">Release timeline</h2>
        <TimelineBase
          items={items}
          classMap={mockStyles}
          aria-labelledby="timeline-heading"
        />
      </>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
