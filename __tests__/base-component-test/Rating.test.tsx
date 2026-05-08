import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BaseRating from "@/components/Rating/RatingBase";

expect.extend(toHaveNoViolations);

const mockClassNames = {
  container: "ratingContainer",
  wrapper: "wrapper",
  star: "star",
  active: "active",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  warning: "warning",
  disabled: "disabled",
  glass: "glass",
  medium: "medium",
  large: "large",
  interactive: "interactive",
  label: "label",
};

describe("BaseRating", () => {
  const defaultProps = {
    value: 3,
    onChange: jest.fn(),
    max: 5,
    theme: "primary" as const,
    size: "medium" as const,
    classMap: mockClassNames,
    "data-testid": "rating",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the rating group and correct number of stars", () => {
    render(<BaseRating {...defaultProps} />);

    expect(screen.getByTestId("rating")).toBeInTheDocument();

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`rating-star-${i}`)).toBeInTheDocument();
    }
  });

  it("renders one star when max is less than 1", () => {
    render(<BaseRating {...defaultProps} max={0} />);

    expect(screen.getByTestId("rating-star-1")).toBeInTheDocument();
    expect(screen.queryByTestId("rating-star-2")).not.toBeInTheDocument();
  });

  it("floors max and value to safe integers", () => {
    render(<BaseRating {...defaultProps} max={5.9} value={3.8} />);

    const star3 = screen.getByTestId("rating-star-3");
    const star4 = screen.getByTestId("rating-star-4");

    expect(star3).toHaveAttribute("aria-checked", "true");
    expect(star4).toHaveAttribute("aria-checked", "false");
  });

  it("clamps value to the max", () => {
    render(<BaseRating {...defaultProps} value={999} max={4} />);

    expect(screen.getByTestId("rating-star-4")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("clamps negative value to 0", () => {
    render(<BaseRating {...defaultProps} value={-2} />);

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`rating-star-${i}`)).toHaveAttribute(
        "aria-checked",
        "false",
      );
    }
  });

  it("applies wrapper styling classes", () => {
    render(
      <BaseRating
        {...defaultProps}
        theme="secondary"
        size="large"
        state="warning"
        glass
        className="customClass"
      />,
    );

    const group = screen.getByTestId("rating");
    expect(group).toHaveClass("wrapper");
    expect(group).toHaveClass("secondary");
    expect(group).toHaveClass("large");
    expect(group).toHaveClass("warning");
    expect(group).toHaveClass("glass");
    expect(group).toHaveClass("interactive");
    expect(group).toHaveClass("customClass");
  });

  it("renders a visible label when provided", () => {
    render(<BaseRating {...defaultProps} label="Rating Label" />);

    expect(screen.getByTestId("rating-label")).toBeInTheDocument();
    expect(screen.getByText("Rating Label")).toBeInTheDocument();
  });

  it("associates the radiogroup with the rendered label via aria-labelledby", () => {
    render(
      <BaseRating {...defaultProps} id="movie-rating" label="Movie Rating" />,
    );

    const group = screen.getByRole("radiogroup");
    const label = screen.getByTestId("rating-label");

    expect(label).toHaveAttribute("id", "movie-rating-label");
    expect(group).toHaveAttribute("aria-labelledby", "movie-rating-label");
  });

  it("uses a custom aria-label when no visible label is provided", () => {
    render(<BaseRating {...defaultProps} aria-label="Product rating" />);

    expect(
      screen.getByRole("radiogroup", { name: "Product rating" }),
    ).toBeInTheDocument();
  });

  it('falls back to "Rating" aria-label when no label or aria-label is provided', () => {
    render(<BaseRating {...defaultProps} />);

    expect(
      screen.getByRole("radiogroup", { name: "Rating" }),
    ).toBeInTheDocument();
  });

  it("prefers aria-labelledby over aria-label when both are provided", () => {
    render(
      <>
        <span id="external-rating-label">External Rating Label</span>
        <BaseRating
          {...defaultProps}
          aria-label="Hidden Label"
          aria-labelledby="external-rating-label"
        />
      </>,
    );

    const group = screen.getByRole("radiogroup", {
      name: "External Rating Label",
    });

    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute("aria-labelledby", "external-rating-label");
    expect(group).not.toHaveAttribute("aria-label");
  });

  it("applies aria-describedby when provided", () => {
    render(
      <>
        <p id="rating-help">Choose a rating from one to five.</p>
        <BaseRating {...defaultProps} aria-describedby="rating-help" />
      </>,
    );

    expect(screen.getByTestId("rating")).toHaveAttribute(
      "aria-describedby",
      "rating-help",
    );
  });

  it("applies aria-required when required is true", () => {
    render(<BaseRating {...defaultProps} required />);

    expect(screen.getByTestId("rating")).toHaveAttribute(
      "aria-required",
      "true",
    );
  });

  it("does not apply aria-required when required is false", () => {
    render(<BaseRating {...defaultProps} required={false} />);

    expect(screen.getByTestId("rating")).not.toHaveAttribute("aria-required");
  });

  it("renders a required asterisk when required is true", () => {
    render(<BaseRating {...defaultProps} label="Required Rating" required />);

    expect(screen.getByText("Required Rating")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("marks the selected star with aria-checked true", () => {
    render(<BaseRating {...defaultProps} value={4} />);

    expect(screen.getByTestId("rating-star-4")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByTestId("rating-star-3")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("applies active class to stars up to the selected value", () => {
    render(<BaseRating {...defaultProps} value={3} />);

    expect(screen.getByTestId("rating-star-1")).toHaveClass("active");
    expect(screen.getByTestId("rating-star-2")).toHaveClass("active");
    expect(screen.getByTestId("rating-star-3")).toHaveClass("active");
    expect(screen.getByTestId("rating-star-4")).not.toHaveClass("active");
    expect(screen.getByTestId("rating-star-5")).not.toHaveClass("active");
  });

  it("updates active classes on hover and restores them on mouse leave", () => {
    render(<BaseRating {...defaultProps} value={2} />);

    const star4 = screen.getByTestId("rating-star-4");

    fireEvent.mouseEnter(star4);

    expect(screen.getByTestId("rating-star-1")).toHaveClass("active");
    expect(screen.getByTestId("rating-star-2")).toHaveClass("active");
    expect(screen.getByTestId("rating-star-3")).toHaveClass("active");
    expect(screen.getByTestId("rating-star-4")).toHaveClass("active");
    expect(screen.getByTestId("rating-star-5")).not.toHaveClass("active");

    fireEvent.mouseLeave(star4);

    expect(screen.getByTestId("rating-star-1")).toHaveClass("active");
    expect(screen.getByTestId("rating-star-2")).toHaveClass("active");
    expect(screen.getByTestId("rating-star-3")).not.toHaveClass("active");
    expect(screen.getByTestId("rating-star-4")).not.toHaveClass("active");
  });

  it("calls onChange with the clicked star value", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} value={2} onChange={handleChange} />);

    fireEvent.click(screen.getByTestId("rating-star-4"));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("does not throw when clicked without onChange", () => {
    render(<BaseRating {...defaultProps} onChange={undefined} />);

    expect(() => {
      fireEvent.click(screen.getByTestId("rating-star-4"));
    }).not.toThrow();
  });

  it("calls onChange when Enter key is pressed", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} value={2} onChange={handleChange} />);

    const star = screen.getByTestId("rating-star-2");
    fireEvent.keyDown(star, { key: "Enter" });

    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("calls onChange when Space key is pressed", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} value={1} onChange={handleChange} />);

    const star = screen.getByTestId("rating-star-1");
    fireEvent.keyDown(star, { key: " " });

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("calls onChange with the next value on ArrowRight", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} value={3} onChange={handleChange} />);

    fireEvent.keyDown(screen.getByTestId("rating-star-3"), {
      key: "ArrowRight",
    });

    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("calls onChange with the next value on ArrowUp", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} value={3} onChange={handleChange} />);

    fireEvent.keyDown(screen.getByTestId("rating-star-3"), {
      key: "ArrowUp",
    });

    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("calls onChange with the previous value on ArrowLeft", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} value={3} onChange={handleChange} />);

    fireEvent.keyDown(screen.getByTestId("rating-star-3"), {
      key: "ArrowLeft",
    });

    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("calls onChange with the previous value on ArrowDown", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} value={3} onChange={handleChange} />);

    fireEvent.keyDown(screen.getByTestId("rating-star-3"), {
      key: "ArrowDown",
    });

    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("calls onChange with 1 when Home is pressed", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} value={4} onChange={handleChange} />);

    fireEvent.keyDown(screen.getByTestId("rating-star-4"), {
      key: "Home",
    });

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("calls onChange with max when End is pressed", () => {
    const handleChange = jest.fn();

    render(
      <BaseRating
        {...defaultProps}
        value={2}
        max={6}
        onChange={handleChange}
      />,
    );

    fireEvent.keyDown(screen.getByTestId("rating-star-2"), {
      key: "End",
    });

    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it("does nothing for unsupported keys", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} onChange={handleChange} />);

    fireEvent.keyDown(screen.getByTestId("rating-star-3"), {
      key: "Escape",
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not go past the max value on ArrowRight", () => {
    const handleChange = jest.fn();

    render(
      <BaseRating
        {...defaultProps}
        value={5}
        max={5}
        onChange={handleChange}
      />,
    );

    fireEvent.keyDown(screen.getByTestId("rating-star-5"), {
      key: "ArrowRight",
    });

    expect(handleChange).toHaveBeenCalledWith(5);
  });

  it("does not go below 1 on ArrowLeft", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} value={1} onChange={handleChange} />);

    fireEvent.keyDown(screen.getByTestId("rating-star-1"), {
      key: "ArrowLeft",
    });

    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it("makes only the selected star tabbable when value is greater than 0", () => {
    render(<BaseRating {...defaultProps} value={3} />);

    expect(screen.getByTestId("rating-star-1")).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByTestId("rating-star-2")).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByTestId("rating-star-3")).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByTestId("rating-star-4")).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByTestId("rating-star-5")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("makes the first star tabbable when value is 0", () => {
    render(<BaseRating {...defaultProps} value={0} />);

    expect(screen.getByTestId("rating-star-1")).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByTestId("rating-star-2")).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByTestId("rating-star-3")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("sets all stars to tabIndex -1 when not interactive", () => {
    render(<BaseRating {...defaultProps} interactive={false} />);

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`rating-star-${i}`)).toHaveAttribute(
        "tabindex",
        "-1",
      );
    }
  });

  it("does not call onChange when clicked if interactive is false", () => {
    const handleChange = jest.fn();

    render(
      <BaseRating
        {...defaultProps}
        interactive={false}
        onChange={handleChange}
      />,
    );

    fireEvent.click(screen.getByTestId("rating-star-4"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not call onChange on keydown if interactive is false", () => {
    const handleChange = jest.fn();

    render(
      <BaseRating
        {...defaultProps}
        interactive={false}
        onChange={handleChange}
      />,
    );

    fireEvent.keyDown(screen.getByTestId("rating-star-3"), {
      key: "Enter",
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("sets aria-disabled on the radiogroup when interactive is false", () => {
    render(<BaseRating {...defaultProps} interactive={false} />);

    expect(screen.getByTestId("rating")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it('sets aria-disabled on the radiogroup when state is "disabled"', () => {
    render(<BaseRating {...defaultProps} state="disabled" />);

    expect(screen.getByTestId("rating")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("does not apply the interactive class when interaction is not allowed", () => {
    render(<BaseRating {...defaultProps} interactive={false} />);

    expect(screen.getByTestId("rating")).not.toHaveClass("interactive");
  });

  it("does not call onChange when readOnly is true", () => {
    const handleChange = jest.fn();

    render(<BaseRating {...defaultProps} readOnly onChange={handleChange} />);

    fireEvent.click(screen.getByTestId("rating-star-4"));
    fireEvent.keyDown(screen.getByTestId("rating-star-3"), { key: "Enter" });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("sets aria-readonly when readOnly is true", () => {
    render(<BaseRating {...defaultProps} readOnly />);

    expect(screen.getByTestId("rating")).toHaveAttribute(
      "aria-readonly",
      "true",
    );
  });

  it("does not set aria-readonly when readOnly is false", () => {
    render(<BaseRating {...defaultProps} readOnly={false} />);

    expect(screen.getByTestId("rating")).not.toHaveAttribute("aria-readonly");
  });

  it("uses a custom star aria-label prefix", () => {
    render(<BaseRating {...defaultProps} starAriaLabelPrefix="Review score" />);

    expect(screen.getByTestId("rating-star-3")).toHaveAttribute(
      "aria-label",
      "Review score 3 of 5, selected",
    );
  });

  it("sets correct aria-posinset and aria-setsize on each star", () => {
    render(<BaseRating {...defaultProps} max={4} value={2} />);

    for (let i = 1; i <= 4; i++) {
      const star = screen.getByTestId(`rating-star-${i}`);
      expect(star).toHaveAttribute("aria-posinset", String(i));
      expect(star).toHaveAttribute("aria-setsize", "4");
    }
  });

  it("renders with a custom id", () => {
    render(
      <BaseRating {...defaultProps} id="custom-rating-id" label="Score" />,
    );

    expect(screen.getByTestId("rating")).toHaveAttribute(
      "id",
      "custom-rating-id",
    );
    expect(screen.getByTestId("rating-label")).toHaveAttribute(
      "id",
      "custom-rating-id-label",
    );
  });

  it("applies the star base class to every star", () => {
    render(<BaseRating {...defaultProps} />);

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`rating-star-${i}`)).toHaveClass("star");
    }
  });

  it("renders stars with role radio inside a radiogroup", () => {
    render(<BaseRating {...defaultProps} label="Rate this product" />);

    expect(
      screen.getByRole("radiogroup", { name: "Rate this product" }),
    ).toBeInTheDocument();

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BaseRating
        value={3}
        onChange={() => {}}
        label="Rate this"
        classMap={mockClassNames}
        data-testid="rating"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
