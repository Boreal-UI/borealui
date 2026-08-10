import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import StepperBase from "@/components/Stepper/StepperBase";
import { StepperBaseProps } from "@/components/Stepper/Stepper.types";
import { DummyIconButton } from "../test-utils/dummyComponents";

expect.extend(toHaveNoViolations);

const mockSteps = [
  { label: "Start", icon: () => <span>1</span> },
  { label: "Details", icon: () => <span>2</span> },
  { label: "Confirm", icon: () => <span>3</span> },
];

const styles = {
  stepper: "stepper",
  horizontal: "horizontal",
  vertical: "vertical",
  primary: "primary",
  secondary: "secondary",
  success: "success",
  medium: "medium",
  large: "large",
  step: "step",
  active: "active",
  completed: "completed",
  clickable: "clickable",
  stepButton: "stepButton",
  stepLabel: "stepLabel",
  connector: "connector",
  glass: "glass",
};

describe("StepperBase", () => {
  const defaultProps: StepperBaseProps = {
    steps: mockSteps,
    activeStep: 1,
    classMap: styles,
    IconButtonComponent: DummyIconButton,
    "data-testid": "stepper",
  };

  it("renders the stepper with a default accessible fallback label", () => {
    render(<StepperBase {...defaultProps} />);

    const stepper = screen.getByRole("list", { name: "Progress Stepper" });

    expect(stepper).toBeInTheDocument();
    expect(stepper).toHaveAttribute("data-testid", "stepper");
    expect(stepper).toHaveAttribute("aria-labelledby", "stepper-label");
    expect(screen.getByText("Progress Stepper")).toBeInTheDocument();
  });

  it("renders all steps and list items", () => {
    render(<StepperBase {...defaultProps} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);

    expect(screen.getByTestId("stepper-step-0")).toBeInTheDocument();
    expect(screen.getByTestId("stepper-step-1")).toBeInTheDocument();
    expect(screen.getByTestId("stepper-step-2")).toBeInTheDocument();

    expect(screen.getByTestId("stepper-step-0-label")).toHaveTextContent(
      "Start",
    );
    expect(screen.getByTestId("stepper-step-1-label")).toHaveTextContent(
      "Details",
    );
    expect(screen.getByTestId("stepper-step-2-label")).toHaveTextContent(
      "Confirm",
    );
  });

  it("marks the active step with aria-current='step'", () => {
    render(<StepperBase {...defaultProps} />);

    expect(screen.getByTestId("stepper-step-1-icon")).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getByTestId("stepper-step-0-icon")).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByTestId("stepper-step-2-icon")).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("applies active, completed, and clickable classes correctly", () => {
    render(<StepperBase {...defaultProps} onStepClick={jest.fn()} />);

    expect(screen.getByTestId("stepper-step-0")).toHaveClass(
      "step",
      "completed",
      "clickable",
    );
    expect(screen.getByTestId("stepper-step-1")).toHaveClass(
      "step",
      "active",
      "clickable",
    );
    expect(screen.getByTestId("stepper-step-2")).toHaveClass(
      "step",
      "clickable",
    );
  });

  it("applies default aria-labels to each step button", () => {
    render(<StepperBase {...defaultProps} />);

    expect(screen.getByTestId("stepper-step-0-icon")).toHaveAttribute(
      "aria-label",
      "Step 1 of 3: Start, completed",
    );
    expect(screen.getByTestId("stepper-step-1-icon")).toHaveAttribute(
      "aria-label",
      "Step 2 of 3: Details, current step",
    );
    expect(screen.getByTestId("stepper-step-2-icon")).toHaveAttribute(
      "aria-label",
      "Step 3 of 3: Confirm",
    );
  });

  it("uses a custom groupLabel when no aria-label or aria-labelledby is provided", () => {
    render(<StepperBase {...defaultProps} groupLabel="Checkout Progress" />);

    expect(
      screen.getByRole("list", { name: "Checkout Progress" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Checkout Progress")).toBeInTheDocument();
  });

  it("uses aria-label on the stepper when provided", () => {
    render(<StepperBase {...defaultProps} aria-label="Order progress" />);

    const stepper = screen.getByRole("list", { name: "Order progress" });

    expect(stepper).toBeInTheDocument();
    expect(stepper).toHaveAttribute("aria-label", "Order progress");
    expect(stepper).not.toHaveAttribute("aria-labelledby", "stepper-label");
    expect(screen.queryByText("Progress Stepper")).not.toBeInTheDocument();
  });

  it("prefers aria-labelledby over aria-label when both are provided", () => {
    render(
      <>
        <h2 id="external-stepper-label">External Stepper Label</h2>
        <StepperBase
          {...defaultProps}
          aria-label="Hidden Stepper Label"
          aria-labelledby="external-stepper-label"
        />
      </>,
    );

    const stepper = screen.getByRole("list", {
      name: "External Stepper Label",
    });

    expect(stepper).toBeInTheDocument();
    expect(stepper).toHaveAttribute(
      "aria-labelledby",
      "external-stepper-label",
    );
    expect(stepper).not.toHaveAttribute("aria-label");
    expect(screen.queryByText("Progress Stepper")).not.toBeInTheDocument();
  });

  it("applies aria-describedby when provided", () => {
    render(
      <>
        <p id="stepper-description">Complete all steps to finish setup.</p>
        <StepperBase {...defaultProps} aria-describedby="stepper-description" />
      </>,
    );

    expect(screen.getByTestId("stepper")).toHaveAttribute(
      "aria-describedby",
      "stepper-description",
    );
  });

  it("uses getStepAriaLabel when provided", () => {
    render(
      <StepperBase
        {...defaultProps}
        getStepAriaLabel={(step, index, total, isActive, isCompleted) =>
          `${step.label} | ${index + 1}/${total} | active=${String(
            isActive,
          )} | completed=${String(isCompleted)}`
        }
      />,
    );

    expect(screen.getByTestId("stepper-step-0-icon")).toHaveAttribute(
      "aria-label",
      "Start | 1/3 | active=false | completed=true",
    );
    expect(screen.getByTestId("stepper-step-1-icon")).toHaveAttribute(
      "aria-label",
      "Details | 2/3 | active=true | completed=false",
    );
    expect(screen.getByTestId("stepper-step-2-icon")).toHaveAttribute(
      "aria-label",
      "Confirm | 3/3 | active=false | completed=false",
    );
  });

  it("fires onStepClick when a step is clicked", () => {
    const handleClick = jest.fn();

    render(<StepperBase {...defaultProps} onStepClick={handleClick} />);

    fireEvent.click(screen.getByTestId("stepper-step-2-icon"));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(2);
  });

  it("fires onStepClick when Enter is pressed on a step", () => {
    const handleClick = jest.fn();

    render(<StepperBase {...defaultProps} onStepClick={handleClick} />);

    fireEvent.keyDown(screen.getByTestId("stepper-step-2-icon"), {
      key: "Enter",
    });

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(2);
  });

  it("fires onStepClick when Space is pressed on a step", () => {
    const handleClick = jest.fn();

    render(<StepperBase {...defaultProps} onStepClick={handleClick} />);

    fireEvent.keyDown(screen.getByTestId("stepper-step-2-icon"), {
      key: " ",
    });

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(2);
  });

  it("does not fire onStepClick for unrelated key presses", () => {
    const handleClick = jest.fn();

    render(<StepperBase {...defaultProps} onStepClick={handleClick} />);

    fireEvent.keyDown(screen.getByTestId("stepper-step-2-icon"), {
      key: "Escape",
    });

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("sets tabIndex to -1 when onStepClick is not provided", () => {
    render(<StepperBase {...defaultProps} />);

    expect(screen.getByTestId("stepper-step-0-icon")).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByTestId("stepper-step-1-icon")).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByTestId("stepper-step-2-icon")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("sets tabIndex to 0 for interactive non-disabled steps", () => {
    render(<StepperBase {...defaultProps} onStepClick={jest.fn()} />);

    expect(screen.getByTestId("stepper-step-0-icon")).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByTestId("stepper-step-1-icon")).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByTestId("stepper-step-2-icon")).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  it("disables backward navigation for previous steps when disableBackNavigation is true", () => {
    render(
      <StepperBase
        {...defaultProps}
        onStepClick={jest.fn()}
        disableBackNavigation={true}
      />,
    );

    const previousStep = screen.getByTestId("stepper-step-0-icon");
    const activeStep = screen.getByTestId("stepper-step-1-icon");
    const futureStep = screen.getByTestId("stepper-step-2-icon");

    expect(previousStep).toBeDisabled();
    expect(previousStep).toHaveAttribute("aria-disabled", "true");
    expect(previousStep).toHaveAttribute("tabindex", "-1");

    expect(activeStep).not.toBeDisabled();
    expect(activeStep).not.toHaveAttribute("aria-disabled");
    expect(activeStep).toHaveAttribute("tabindex", "0");

    expect(futureStep).not.toBeDisabled();
    expect(futureStep).not.toHaveAttribute("aria-disabled");
    expect(futureStep).toHaveAttribute("tabindex", "0");
  });

  it("does not call onStepClick when clicking a disabled previous step", () => {
    const handleClick = jest.fn();

    render(
      <StepperBase
        {...defaultProps}
        onStepClick={handleClick}
        disableBackNavigation={true}
      />,
    );

    fireEvent.click(screen.getByTestId("stepper-step-0-icon"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onStepClick when pressing Enter on a disabled previous step", () => {
    const handleClick = jest.fn();

    render(
      <StepperBase
        {...defaultProps}
        onStepClick={handleClick}
        disableBackNavigation={true}
      />,
    );

    fireEvent.keyDown(screen.getByTestId("stepper-step-0-icon"), {
      key: "Enter",
    });

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("falls back to numeric icon content when no icon is provided", () => {
    render(
      <StepperBase
        {...defaultProps}
        steps={[
          { label: "Account" },
          { label: "Profile" },
          { label: "Finish" },
        ]}
      />,
    );

    expect(screen.getByTestId("stepper-step-0-icon")).toHaveTextContent("1");
    expect(screen.getByTestId("stepper-step-1-icon")).toHaveTextContent("2");
    expect(screen.getByTestId("stepper-step-2-icon")).toHaveTextContent("3");
  });

  it("applies orientation, theme, state, size, and custom className to the root element", () => {
    render(
      <StepperBase
        {...defaultProps}
        orientation="vertical"
        theme="secondary"
        state="success"
        variant="glassOutline"
        size="large"
        className="customStepper"
        onStepClick={jest.fn()}
      />,
    );

    expect(screen.getByTestId("stepper")).toHaveClass(
      "stepper",
      "vertical",
      "secondary",
      "success",
      "glass",
      "large",
      "customStepper",
    );
  });

  it("applies active and completed classes to step buttons based on step state", () => {
    render(<StepperBase {...defaultProps} variant="glassOutline" />);

    expect(screen.getByTestId("stepper-step-0-icon")).toHaveClass(
      "stepButton",
      "completed",
    );
    expect(screen.getByTestId("stepper-step-0-icon")).toHaveAttribute(
      "data-glass",
      "true",
    );
    expect(screen.getByTestId("stepper-step-1-icon")).toHaveClass(
      "stepButton",
      "active",
    );
    expect(screen.getByTestId("stepper-step-2-icon")).toHaveClass("stepButton");

    expect(screen.getByTestId("stepper-step-2-icon")).not.toHaveClass("active");
    expect(screen.getByTestId("stepper-step-2-icon")).not.toHaveClass(
      "completed",
    );
  });

  it("marks completed step buttons with completed class and active step buttons with active class", () => {
    render(<StepperBase {...defaultProps} />);

    expect(screen.getByTestId("stepper-step-0-icon")).toHaveClass(
      "stepButton",
      "completed",
    );
    expect(screen.getByTestId("stepper-step-1-icon")).toHaveClass(
      "stepButton",
      "active",
    );
    expect(screen.getByTestId("stepper-step-2-icon")).toHaveClass("stepButton");
  });

  it("keeps visible step labels aria-hidden", () => {
    render(<StepperBase {...defaultProps} />);

    expect(screen.getByTestId("stepper-step-0-label")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByTestId("stepper-step-1-label")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.getByTestId("stepper-step-2-label")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <StepperBase
        {...defaultProps}
        onStepClick={jest.fn()}
        aria-describedby="stepper-help"
      />,
    );

    const helper = document.createElement("p");
    helper.id = "stepper-help";
    helper.textContent = "Use the stepper to move through the form.";
    document.body.appendChild(helper);

    const results = await axe(container);
    expect(results).toHaveNoViolations();

    helper.remove();
  });
});
