import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  CheckBox,
  FieldSet,
  Select,
  TextInput,
} from "../src/index.core";
import type { FieldSetProps } from "../src/components/FieldSet/FieldSet.types";
import { StoryGrid } from "../.storybook-core/helpers/StoryGrid";
import {
  roundingOptions,
  shadowOptions,
  stateOptions,
  themeOptions,
} from "../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const ContactOptions = () => (
  <>
    <CheckBox
      theme="secondary"
      label="Email"
      name="Email"
      value="email"
      checked={true}
      onChange={() => ""}
    />
    <CheckBox
      theme="secondary"
      label="Phone"
      name="Phone"
      value="phone"
      checked={false}
      onChange={() => ""}
    />
    <CheckBox
      theme="secondary"
      label="Notification"
      name="Notification"
      value="notification"
      checked={false}
      onChange={() => ""}
    />
  </>
);

const meta: Meta<FieldSetProps> = {
  title: "Components/FieldSet",
  component: FieldSet,
  tags: ["autodocs"],
  args: {
    legend: "Contact preferences",
    helperText: "You can change these preferences at any time.",
    theme: "primary",
    children: <ContactOptions />,
  },
};

export default meta;

type Story = StoryObj<FieldSetProps>;

export const Default: Story = {};

export const GridLayout: Story = {
  args: {
    layout: "grid",
    legend: "Profile details",
    children: (
      <>
        <TextInput theme="secondary" label="First name" name="firstName" />
        <TextInput theme="secondary" label="Last name" name="lastName" />
        <Select
          name="country"
          theme="secondary"
          label="Country"
          value=""
          onChange={() => ""}
          options={[
            { value: "USA", label: "USA" },
            { value: "Canada", label: "Canada" },
            { value: "UK", label: "UK" },
          ]}
        />
      </>
    ),
  },
};

export const InlineLayout: Story = {
  args: {
    layout: "inline",
    legend: "Delivery speed",
    children: (
      <>
        <CheckBox
          theme="secondary"
          label="Email"
          name="Email"
          value="email"
          checked={true}
          onChange={() => ""}
        />
        <CheckBox
          theme="secondary"
          label="Phone"
          name="Phone"
          value="phone"
          checked={false}
          onChange={() => ""}
        />
        <CheckBox
          theme="secondary"
          label="Notification"
          name="Notification"
          value="notification"
          checked={false}
          onChange={() => ""}
        />
      </>
    ),
  },
};

export const Validation: Story = {
  args: {
    required: true,
    state: "error",
    errorMessage: "Select at least one contact method.",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    loadingMessage: "Loading preferences",
  },
};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button state="error" type="button">
          Reset
        </Button>
        <Button state="success" type="button">
          Apply
        </Button>
      </>
    ),
    footer: "Changes are saved to the current workspace.",
  },
};

export const RoundingVariants = () => (
  <StoryGrid title="Rounding Variants">
    {roundingOptions.map((rounding) => (
      <FieldSet key={rounding} legend={rounding} rounding={rounding}>
        <ContactOptions />
      </FieldSet>
    ))}
  </StoryGrid>
);

export const ShadowVariants = () => (
  <StoryGrid title="Shadow Variants">
    {shadowOptions.map((shadow) => (
      <FieldSet key={shadow} legend={shadow} shadow={shadow}>
        <ContactOptions />
      </FieldSet>
    ))}
  </StoryGrid>
);

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: FieldSet, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: FieldSet, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: FieldSet, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: FieldSet, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: FieldSet, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: FieldSet, args }),
};
