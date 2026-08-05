import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import RadioButton from "../src/components/RadioButton/core/RadioButton";
import RadioGroup from "../src/components/RadioButton/core/RadioGroup";
import CheckBox from "../src/components/CheckBox/core/CheckBox";

const options = [
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
  { label: "Phone", value: "phone" },
];

describe("RadioButton", () => {
  it("only calls onChange when a radio becomes selected", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <RadioButton
        label="Email"
        name="contact"
        value="email"
        checked
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Email" }));

    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe("RadioGroup", () => {
  it("selects one option from a shared value", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <RadioGroup
        legend="Preferred contact"
        name="contact"
        options={options}
        value="email"
        onChange={handleChange}
      />,
    );

    expect(screen.getByRole("radio", { name: "Email" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "SMS" })).not.toBeChecked();

    await user.click(screen.getByRole("radio", { name: "SMS" }));

    expect(handleChange).toHaveBeenCalledWith("sms");
  });

  it("keeps checkbox behavior independent from radio group selection", async () => {
    const user = userEvent.setup();
    const handleRadioChange = jest.fn();
    const handleCheckBoxChange = jest.fn();

    render(
      <>
        <RadioGroup
          legend="Preferred contact"
          name="contact"
          options={options}
          value="email"
          onChange={handleRadioChange}
        />
        <CheckBox
          label="Subscribe to updates"
          checked={false}
          onChange={handleCheckBoxChange}
        />
      </>,
    );

    await user.click(
      screen.getByRole("checkbox", { name: "Subscribe to updates" }),
    );

    expect(handleCheckBoxChange).toHaveBeenCalledWith(true);
    expect(handleRadioChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadioGroup
        legend="Preferred contact"
        name="contact"
        options={options}
        value="email"
        onChange={jest.fn()}
        helperText="Choose one contact method."
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
