import { render, screen, fireEvent } from "@testing-library/react";
import BasePager from "@/components/Pager/PagerBase";
import { axe, toHaveNoViolations } from "jest-axe";
import { DummyButton, DummyIconButton } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const classNames = {
  wrapper: "pagerWrapper",
  glass: "pagerGlass",
  controls: "pagerControls",
  controlButton: "pagerControlButton",
  buttonWrapper: "pagerButtonWrapper",
  button: "pagerButton",
  active: "activePage",
  primary: "themePrimary",
  success: "stateSuccess",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
};

describe("BasePager", () => {
  it("renders the navigation landmark with default accessible labeling", () => {
    render(
      <BasePager
        totalItems={50}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    const nav = screen.getByRole("navigation", { name: /pagination/i });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("data-testid", "pager");
  });

  it("renders the correct number of page buttons in client mode", () => {
    render(
      <BasePager
        totalItems={50}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`pager-button-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`pager-page-${i}`)).toBeInTheDocument();
    }

    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("renders only the current page in server controlled mode", () => {
    render(
      <BasePager
        totalItems={200}
        itemsPerPage={10}
        currentPage={7}
        serverControlled
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager-button-7")).toBeInTheDocument();
    expect(screen.queryByTestId("pager-button-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pager-button-6")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pager-button-8")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("calls onPageChange with the next page when next is clicked", () => {
    const onPageChange = jest.fn();

    render(
      <BasePager
        totalItems={30}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={onPageChange}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    fireEvent.click(screen.getByTestId("pager-next"));
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with the previous page when prev is clicked", () => {
    const onPageChange = jest.fn();

    render(
      <BasePager
        totalItems={30}
        itemsPerPage={10}
        currentPage={3}
        onPageChange={onPageChange}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    fireEvent.click(screen.getByTestId("pager-prev"));
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with the selected page when a page button is clicked", () => {
    const onPageChange = jest.fn();

    render(
      <BasePager
        totalItems={50}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={onPageChange}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    fireEvent.click(screen.getByTestId("pager-button-4"));
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("does not call onPageChange when the current page button is clicked because it is disabled", () => {
    const onPageChange = jest.fn();

    render(
      <BasePager
        totalItems={50}
        itemsPerPage={10}
        currentPage={3}
        onPageChange={onPageChange}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    const activeButton = screen.getByTestId("pager-button-3");
    expect(activeButton).toBeDisabled();

    fireEvent.click(activeButton);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("disables the previous button on the first page", () => {
    render(
      <BasePager
        totalItems={30}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager-prev")).toBeDisabled();
    expect(screen.getByTestId("pager-next")).not.toBeDisabled();
  });

  it("disables the next button on the last page", () => {
    render(
      <BasePager
        totalItems={30}
        itemsPerPage={10}
        currentPage={3}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager-next")).toBeDisabled();
    expect(screen.getByTestId("pager-prev")).not.toBeDisabled();
  });

  it("sets aria-current to page on the active page button", () => {
    render(
      <BasePager
        totalItems={30}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager-button-2")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByTestId("pager-button-1")).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("applies the active class to the current page button", () => {
    render(
      <BasePager
        totalItems={30}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager-button-2")).toHaveClass("activePage");
    expect(screen.getByTestId("pager-button-1")).not.toHaveClass("activePage");
  });

  it("renders the live region with the default page status message", () => {
    render(
      <BasePager
        totalItems={50}
        itemsPerPage={10}
        currentPage={3}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    const status = screen.getByTestId("pager-status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
    expect(status).toHaveTextContent("Page 3 of 5");
  });

  it("supports a custom live region message and live region politeness", () => {
    render(
      <BasePager
        totalItems={50}
        itemsPerPage={10}
        currentPage={4}
        onPageChange={jest.fn()}
        getLiveRegionMessage={(page, totalPages) =>
          `Viewing results page ${page} out of ${totalPages}`
        }
        liveRegionAriaLive="assertive"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    const status = screen.getByTestId("pager-status");
    expect(status).toHaveTextContent("Viewing results page 4 out of 5");
    expect(status).toHaveAttribute("aria-live", "assertive");
  });

  it("supports a custom aria-label on the navigation landmark", () => {
    render(
      <BasePager
        totalItems={50}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={jest.fn()}
        aria-label="Search results pagination"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(
      screen.getByRole("navigation", { name: /search results pagination/i }),
    ).toBeInTheDocument();
  });

  it("supports aria-labelledby on the navigation landmark and does not rely on aria-label when provided", () => {
    render(
      <div>
        <h2 id="pager-heading">Custom Pager Heading</h2>
        <BasePager
          totalItems={50}
          itemsPerPage={10}
          currentPage={1}
          onPageChange={jest.fn()}
          aria-label="Fallback Pagination Label"
          aria-labelledby="pager-heading"
          Button={DummyButton}
          IconButton={DummyIconButton}
          classMap={classNames}
          data-testid="pager"
        />
      </div>,
    );

    const nav = screen.getByRole("navigation", {
      name: /custom pager heading/i,
    });

    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("aria-labelledby", "pager-heading");
    expect(nav).not.toHaveAttribute("aria-label", "Fallback Pagination Label");
  });

  it("supports aria-describedby on the navigation landmark", () => {
    render(
      <div>
        <p id="pager-description">Navigate between result pages</p>
        <BasePager
          totalItems={50}
          itemsPerPage={10}
          currentPage={1}
          onPageChange={jest.fn()}
          aria-describedby="pager-description"
          Button={DummyButton}
          IconButton={DummyIconButton}
          classMap={classNames}
          data-testid="pager"
        />
      </div>,
    );

    expect(screen.getByTestId("pager")).toHaveAttribute(
      "aria-describedby",
      "pager-description",
    );
  });

  it("defaults the navigation aria-describedby to the live region id when no custom description is provided", () => {
    render(
      <BasePager
        totalItems={50}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager")).toHaveAttribute(
      "aria-describedby",
      "pager-status",
    );
  });

  it("renders the page list with the default accessible label", () => {
    render(
      <BasePager
        totalItems={40}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    const pageList = screen.getByRole("list", { name: /page list/i });
    expect(pageList).toBeInTheDocument();
    expect(pageList).toHaveAttribute("id", "pager-page-list");
  });

  it("supports a custom accessible label for the page list", () => {
    render(
      <BasePager
        totalItems={40}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        page-list-aria-label="Available pages"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(
      screen.getByRole("list", { name: /available pages/i }),
    ).toBeInTheDocument();
  });

  it("renders previous and next buttons with their default accessible labels", () => {
    render(
      <BasePager
        totalItems={40}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(
      screen.getByRole("button", { name: /go to previous page/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /go to next page/i }),
    ).toBeInTheDocument();
  });

  it("supports custom accessible labels for previous and next buttons", () => {
    render(
      <BasePager
        totalItems={40}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        previous-button-aria-label="Previous results page"
        next-button-aria-label="Next results page"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(
      screen.getByRole("button", { name: /previous results page/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /next results page/i }),
    ).toBeInTheDocument();
  });

  it("applies aria-controls from prev and next buttons to the page list", () => {
    render(
      <BasePager
        totalItems={40}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager-prev")).toHaveAttribute(
      "aria-controls",
      "pager-page-list",
    );
    expect(screen.getByTestId("pager-next")).toHaveAttribute(
      "aria-controls",
      "pager-page-list",
    );
  });

  it("uses the default page button accessible labels", () => {
    render(
      <BasePager
        totalItems={40}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(
      screen.getByRole("button", { name: /go to page 1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /current page, page 2/i }),
    ).toBeInTheDocument();
  });

  it("supports custom page button accessible labels", () => {
    render(
      <BasePager
        totalItems={40}
        itemsPerPage={10}
        currentPage={3}
        onPageChange={jest.fn()}
        getPageAriaLabel={(page, isActive) =>
          isActive ? `Selected page ${page}` : `Open page ${page}`
        }
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(
      screen.getByRole("button", { name: /open page 1/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /selected page 3/i }),
    ).toBeInTheDocument();
  });

  it("adds aria-describedby to the active page button pointing at the live region", () => {
    render(
      <BasePager
        totalItems={40}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager-button-2")).toHaveAttribute(
      "aria-describedby",
      "pager-status",
    );
    expect(screen.getByTestId("pager-button-1")).not.toHaveAttribute(
      "aria-describedby",
    );
  });

  it("clamps an out of range currentPage that is greater than total pages", () => {
    render(
      <BasePager
        totalItems={30}
        itemsPerPage={10}
        currentPage={999}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager-button-3")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByTestId("pager-next")).toBeDisabled();
  });

  it("clamps an out of range currentPage that is less than 1", () => {
    render(
      <BasePager
        totalItems={30}
        itemsPerPage={10}
        currentPage={0}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager-button-1")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByTestId("pager-prev")).toBeDisabled();
  });

  it("treats itemsPerPage values less than or equal to zero as 1", () => {
    render(
      <BasePager
        totalItems={3}
        itemsPerPage={0}
        currentPage={1}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager-button-1")).toBeInTheDocument();
    expect(screen.getByTestId("pager-button-2")).toBeInTheDocument();
    expect(screen.getByTestId("pager-button-3")).toBeInTheDocument();
  });

  it("applies wrapper, control, button, rounding, and shadow classes", () => {
    render(
      <BasePager
        totalItems={30}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        className="customPager"
        theme="primary"
        state="success"
        glass
        rounding="medium"
        shadow="light"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    expect(screen.getByTestId("pager")).toHaveClass(
      "pagerWrapper",
      "themePrimary",
      "stateSuccess",
      "customPager",
    );

    expect(screen.getByTestId("pager-prev")).toHaveClass("pagerControlButton");
    expect(screen.getByTestId("pager-next")).toHaveClass("pagerControlButton");

    expect(screen.getByTestId("pager-button-1")).toHaveClass(
      "pagerButton",
      "roundMedium",
      "shadowLight",
    );
    expect(screen.getByTestId("pager-button-1")).toHaveAttribute(
      "data-glass",
      "true",
    );
    expect(screen.getByTestId("pager-prev")).toHaveAttribute(
      "data-glass",
      "true",
    );
  });

  it("renders custom data-testid values consistently across sub-elements", () => {
    render(
      <BasePager
        totalItems={20}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={jest.fn()}
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="results-pager"
      />,
    );

    expect(screen.getByTestId("results-pager")).toBeInTheDocument();
    expect(screen.getByTestId("results-pager-status")).toBeInTheDocument();
    expect(screen.getByTestId("results-pager-page-list")).toBeInTheDocument();
    expect(screen.getByTestId("results-pager-prev")).toBeInTheDocument();
    expect(screen.getByTestId("results-pager-next")).toBeInTheDocument();
    expect(screen.getByTestId("results-pager-button-1")).toBeInTheDocument();
    expect(screen.getByTestId("results-pager-page-1")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BasePager
        totalItems={50}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={jest.fn()}
        aria-label="Results pagination"
        page-list-aria-label="Available pages"
        previous-button-aria-label="Previous results page"
        next-button-aria-label="Next results page"
        Button={DummyButton}
        IconButton={DummyIconButton}
        classMap={classNames}
        data-testid="pager"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
