import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { FaCommentDots } from "../../shared-story-assets/icons";
import TextAreaBase from "@/components/TextArea/TextAreaBase";

expect.extend(toHaveNoViolations);

const mockStyles = {
  large: "large",
  container: "container",
  labelTop: "labelTop",
  labelLeft: "labelLeft",
  labelRight: "labelRight",
  labelBottom: "labelBottom",
  label: "label",
  textArea: "textArea",
  textInput: "textInput",
  iconContainer: "iconContainer",
  customResizeHandle: "customResizeHandle",
  helperText: "helperText",
  errorMessage: "errorMessage",
  disabled: "disabled",
  primary: "primary",
  secondary: "secondary",
  error: "error",
  warning: "warning",
  success: "success",
  shadowLight: "shadowLight",
  shadowMedium: "shadowMedium",
  shadowLarge: "shadowLarge",
  roundSmall: "roundSmall",
  roundMedium: "roundMedium",
  roundLarge: "roundLarge",
  glass: "glass",
  outline: "outline",
};

describe("TextAreaBase", () => {
  it("applies the selected size class", () => {
    render(<TextAreaBase classMap={mockStyles} size="large" />);
    expect(screen.getByTestId("text-area-wrapper")).toHaveClass("large");
  });

  it("renders a basic textarea", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Type your message"
        aria-label="Message input"
      />,
    );

    expect(
      screen.getByPlaceholderText("Type your message"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("text-area-input")).toBeInTheDocument();
  });

  it("renders with an icon", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Comment"
        icon={FaCommentDots}
      />,
    );

    expect(screen.getByTestId("text-area-icon")).toBeInTheDocument();
  });

  it("renders a visible label and associates it to the textarea", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        label="Message"
        placeholder="Type here"
      />,
    );

    const label = screen.getByTestId("text-area-label");
    const input = screen.getByTestId("text-area-input");

    expect(label).toBeInTheDocument();
    expect(input).toHaveAccessibleName("Message");
    expect(label).toHaveAttribute("for", input.getAttribute("id"));
  });

  it("uses aria-label when no visible label exists", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Type your message"
        aria-label="Custom message field"
      />,
    );

    expect(
      screen.getByRole("textbox", { name: "Custom message field" }),
    ).toBeInTheDocument();
  });

  it("falls back to the placeholder as the accessible name when no label or aria-label is provided", () => {
    render(<TextAreaBase classMap={mockStyles} placeholder="Fallback name" />);

    expect(
      screen.getByRole("textbox", { name: "Fallback name" }),
    ).toBeInTheDocument();
  });

  it("prefers aria-labelledby over aria-label when both are provided", () => {
    render(
      <>
        <span id="external-textarea-label">External textarea label</span>
        <TextAreaBase
          classMap={mockStyles}
          placeholder="Type here"
          aria-label="Internal label"
          aria-labelledby="external-textarea-label"
        />
      </>,
    );

    const input = screen.getByRole("textbox", {
      name: "External textarea label",
    });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-labelledby", "external-textarea-label");
  });

  it("includes an accessible description", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Describe yourself"
        aria-description="Please describe your skills and experience"
      />,
    );

    const input = screen.getByPlaceholderText("Describe yourself");
    const desc = screen.getByTestId("text-area-description");

    expect(desc).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-describedby", desc.id);
  });

  it("renders helper text and associates it through aria-describedby", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Message"
        helperText="Maximum 500 characters"
      />,
    );

    const input = screen.getByTestId("text-area-input");
    const helper = screen.getByTestId("text-area-helper-text");

    expect(helper).toBeInTheDocument();
    expect(helper).toHaveTextContent("Maximum 500 characters");
    expect(input).toHaveAttribute("aria-describedby", helper.id);
  });

  it("merges describedBy, aria-describedby, aria-description, helper text, and error message ids", () => {
    render(
      <>
        <div id="external-help">External help text</div>
        <TextAreaBase
          classMap={mockStyles}
          placeholder="Detailed message"
          state="error"
          aria-describedby="external-a11y-description"
          describedBy="external-help"
          aria-description="Hidden description"
          helperText="Visible helper text"
          errorMessage="This field is required"
        />
        <div id="external-a11y-description">External ARIA description</div>
      </>,
    );

    const input = screen.getByTestId("text-area-input");
    const description = screen.getByTestId("text-area-description");
    const helper = screen.getByTestId("text-area-helper-text");
    const error = screen.getByTestId("text-area-error-message");

    expect(description).toBeInTheDocument();
    expect(helper).toBeInTheDocument();
    expect(error).toBeInTheDocument();

    expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("external-a11y-description"),
    );
    expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("external-help"),
    );
    expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(description.id),
    );
    expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(helper.id),
    );
    expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining(error.id),
    );
  });

  it("renders an error message, marks the field invalid, and links aria-errormessage when in error state", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Enter feedback"
        state="error"
        errorMessage="Feedback is required"
      />,
    );

    const input = screen.getByTestId("text-area-input");
    const error = screen.getByTestId("text-area-error-message");

    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent("Feedback is required");
    expect(error).toHaveAttribute("role", "alert");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", error.id);
  });

  it("does not apply aria-errormessage when not in error state", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Enter feedback"
        errorMessage="This exists but is not an active error"
      />,
    );

    const input = screen.getByTestId("text-area-input");
    const error = screen.getByTestId("text-area-error-message");

    expect(error).toBeInTheDocument();
    expect(error).not.toHaveAttribute("role", "alert");
    expect(input).not.toHaveAttribute("aria-errormessage");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("uses an external aria-errormessage id when provided in error state", () => {
    render(
      <>
        <div id="external-error-id">External error</div>
        <TextAreaBase
          classMap={mockStyles}
          placeholder="Message"
          state="error"
          aria-errormessage="external-error-id"
          errorMessage="Internal error"
        />
      </>,
    );

    const input = screen.getByTestId("text-area-input");

    expect(input).toHaveAttribute("aria-errormessage", "external-error-id");
  });

  it("calls onChange with the updated string value and event", () => {
    const handleChange = jest.fn();

    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Type a message"
        onChange={handleChange}
      />,
    );

    const input = screen.getByTestId("text-area-input");

    fireEvent.change(input, {
      target: { value: "Hello world" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);

    const [value, event] = handleChange.mock.calls[0];

    expect(value).toBe("Hello world");
    expect(event).toBeDefined();
    expect(event.type).toBe("change");
    expect(event.target).toBe(input);
    expect((event.target as HTMLTextAreaElement).value).toBe("Hello world");
  });
  it("calls onChange with the updated string value and event", () => {
    const handleChange = jest.fn();

    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Type a message"
        onChange={handleChange}
      />,
    );

    const input = screen.getByTestId("text-area-input");

    fireEvent.change(input, {
      target: { value: "Hello world" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);

    const [value, event] = handleChange.mock.calls[0];

    expect(value).toBe("Hello world");
    expect(event).toBeDefined();
    expect(event.type).toBe("change");
    expect(event.target).toBe(input);
    expect((event.target as HTMLTextAreaElement).value).toBe("Hello world");
  });

  it("supports disabled state and accessibility attributes", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Disabled message"
        disabled
      />,
    );

    const input = screen.getByTestId("text-area-input");

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByTestId("text-area-wrapper")).toHaveClass("disabled");
  });

  it("supports readOnly state and accessibility attributes", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Read only message"
        readOnly
      />,
    );

    const input = screen.getByTestId("text-area-input");

    expect(input).toHaveAttribute("readonly");
    expect(input).toHaveAttribute("aria-readonly", "true");
  });

  it("supports required state and accessibility attributes", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Required message"
        required
      />,
    );

    const input = screen.getByTestId("text-area-input");

    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("leaves autocomplete unset by default and accepts native values", () => {
    const { rerender } = render(
      <TextAreaBase classMap={mockStyles} placeholder="Message" />,
    );

    expect(screen.getByTestId("text-area-input")).not.toHaveAttribute(
      "autocomplete",
    );

    rerender(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Message"
        autoComplete="on"
      />,
    );

    expect(screen.getByTestId("text-area-input")).toHaveAttribute(
      "autoComplete",
      "on",
    );
  });

  it("applies resize styling when resizable is false", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Resizable message"
        resizable={false}
      />,
    );

    expect(screen.getByTestId("text-area-input")).toHaveStyle({
      resize: "none",
    });
  });

  it("applies a custom height style", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Sized message"
        height="180px"
      />,
    );

    expect(screen.getByTestId("text-area-input")).toHaveStyle({
      height: "180px",
    });
  });

  it("renders the custom resize handle", () => {
    render(<TextAreaBase classMap={mockStyles} placeholder="Resize handle" />);

    expect(screen.getByTestId("text-area-resize-handle")).toBeInTheDocument();
    expect(screen.getByTestId("text-area-resize-handle")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("applies theme, state, outline, rounding, shadow, and custom className to the wrapper", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        placeholder="Styled message"
        theme="primary"
        state="error"
        variant="glassOutline"
        rounding="medium"
        shadow="light"
        className="customClass"
      />,
    );

    expect(screen.getByTestId("text-area-wrapper")).toHaveClass(
      "textArea",
      "primary",
      "error",
      "outline",
      "glass",
      "roundMedium",
      "shadowLight",
      "customClass",
    );
  });

  it("applies the correct label position class to the container", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        label="Comment"
        labelPosition="left"
      />,
    );

    expect(screen.getByTestId("text-area")).toHaveClass(
      "container",
      "labelLeft",
    );
  });

  it("applies custom class names to text area sections", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        label="Comment"
        icon={FaCommentDots}
        helperText="Helpful text"
        state="error"
        errorMessage="Required"
        aria-description="Hidden description"
        containerClassName="custom-container"
        labelClassName="custom-label"
        iconClassName="custom-icon"
        inputClassName="custom-input"
        resizeHandleClassName="custom-resize"
        helperTextClassName="custom-helper"
        errorMessageClassName="custom-error"
        srOnlyClassName="custom-sr-only"
      />,
    );

    expect(screen.getByTestId("text-area")).toHaveClass(
      "container",
      "custom-container",
    );
    expect(screen.getByTestId("text-area-label")).toHaveClass(
      "label",
      "custom-label",
    );
    expect(screen.getByTestId("text-area-icon")).toHaveClass(
      "iconContainer",
      "custom-icon",
    );
    expect(screen.getByTestId("text-area-input")).toHaveClass(
      "textInput",
      "custom-input",
    );
    expect(screen.getByTestId("text-area-resize-handle")).toHaveClass(
      "customResizeHandle",
      "custom-resize",
    );
    expect(screen.getByTestId("text-area-helper-text")).toHaveClass(
      "helperText",
      "custom-helper",
    );
    expect(screen.getByTestId("text-area-error-message")).toHaveClass(
      "errorMessage",
      "custom-error",
    );
    expect(screen.getByTestId("text-area-description")).toHaveClass(
      "sr_only",
      "custom-sr-only",
    );
  });

  it("supports a custom test id consistently", () => {
    render(
      <TextAreaBase
        classMap={mockStyles}
        label="Bio"
        data-testid="bio-area"
        helperText="Tell us about yourself"
      />,
    );

    expect(screen.getByTestId("bio-area")).toBeInTheDocument();
    expect(screen.getByTestId("bio-area-label")).toBeInTheDocument();
    expect(screen.getByTestId("bio-area-wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("bio-area-input")).toBeInTheDocument();
    expect(screen.getByTestId("bio-area-resize-handle")).toBeInTheDocument();
    expect(screen.getByTestId("bio-area-helper-text")).toBeInTheDocument();
  });

  it("is accessible with axe", async () => {
    const { container } = render(
      <TextAreaBase
        classMap={mockStyles}
        label="Message"
        helperText="Provide a short summary"
        placeholder="Write something"
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
