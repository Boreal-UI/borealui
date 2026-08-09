# Generated Prop Docs and Types

Boreal UI publishes TypeScript types and generated prop metadata so consumers can build typed apps, documentation pages, playgrounds, and design-system references.

## Public Types

Component declarations work automatically through `@boreal-ui/core` and `@boreal-ui/next`. When application code imports shared declarations directly from `@boreal-ui/types`, declare that package as a dev dependency:

```bash
npm install -D @boreal-ui/types
```

```ts
import type {
  BorderType,
  ColorScheme,
  RoundingType,
  RoundableRoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "@boreal-ui/types";
```

You can also import individual shared types from the same entry point.

```ts
import type { SizeType, ThemeType } from "@boreal-ui/types";
```

Common shared types:

| Type                    | Canonical values                                                | Accepted aliases                    |
| ----------------------- | --------------------------------------------------------------- | ----------------------------------- |
| `ThemeType`             | `primary`, `secondary`, `tertiary`, `quaternary`, `clear`       | `p`, `s`, `t`, `q`, `c`             |
| `StateType`             | `success`, `error`, `warning`, `info`, `disabled`, empty string | None                                |
| `SizeType`              | `xs`, `small`, `medium`, `large`, `xl`                          | `sm`, `md`, `lg`                    |
| `RoundingType`          | `none`, `small`, `medium`, `large`                              | `sm`, `md`, `lg`                    |
| `RoundableRoundingType` | `RoundingType` plus `full`                                      | The aliases accepted by `RoundingType` |
| `ShadowType`            | `none`, `light`, `medium`, `strong`, `intense`                  | `lt`, `sm`, `md`, `str`, `lg`, `xl` |
| `BorderType`            | `none`, `xs`, `small`, `medium`, `large`, `xl`                  | `sm`, `md`, `lg`                    |
| `ColorScheme`           | Named color scheme object used by theming APIs.                 | Not applicable                      |

## Component Types

Component prop types are available through component entry points.

```ts
import type { ButtonProps } from "@boreal-ui/types/core/Button";
import type { DataTableProps, Column } from "@boreal-ui/types/core/DataTable";
import type { NumberInputProps } from "@boreal-ui/types/core/NumberInput";
import type { SparklineProps } from "@boreal-ui/types/core/Sparkline";
```

For Next.js consumers:

```ts
import type { ButtonProps } from "@boreal-ui/types/next/Button";
import type { Column } from "@boreal-ui/types/next/DataTable";
```

Use these types when wrapping Boreal components in app-specific components.

```tsx
import { Button } from "@boreal-ui/core";
import type { ButtonProps } from "@boreal-ui/types/core/Button";

type SaveButtonProps = Omit<ButtonProps, "type" | "children"> & {
  label?: string;
};

export function SaveButton({ label = "Save", ...props }: SaveButtonProps) {
  return (
    <Button type="submit" theme="primary" {...props}>
      {label}
    </Button>
  );
}
```

## Generated Prop Metadata

Generated prop docs are exported from the optional docs package so component packages do not install or load documentation metadata.

```ts
import {
  buttonPropDocs,
  cardPropDocs,
  dataTablePropDocs,
  numberInputPropDocs,
  sparklinePropDocs,
  validationSummaryPropDocs,
  radioGroupPropDocs,
  themeSelectPropDocs,
  type GeneratedComponentDoc,
  type GeneratedPropDoc,
} from "@boreal-ui/docs";
```

Each component doc object follows this shape:

```ts
type GeneratedComponentDoc = {
  name: string;
  interfaceName: string;
  description: string;
  sourcePath: string;
  props: GeneratedPropDoc[];
};

type GeneratedPropDoc = {
  name: string;
  type: string;
  description: string;
  required: boolean;
  inherited: boolean;
  category: string;
  defaultValue?: string;
};
```

`defaultValue` is included when the generator can read a default from the component implementation. Configurable Boreal style defaults, such as theme or size, include their built-in fallback value.

The metadata lists Boreal's component-specific public props and inherited Boreal prop groups. It intentionally does not expand React's complete native HTML attribute interfaces or internal renderer/prop-bag injection points. The declarations shipped by `@boreal-ui/core`, `@boreal-ui/next`, and `@boreal-ui/types` remain the exhaustive type source.

## Rendering a Prop Table

```tsx
import { buttonPropDocs } from "@boreal-ui/docs";

export function ButtonPropTable() {
  return (
    <table>
      <caption>{buttonPropDocs.name} props</caption>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col">Default</th>
          <th scope="col">Required</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        {buttonPropDocs.props.map((prop) => (
          <tr key={prop.name}>
            <th scope="row">{prop.name}</th>
            <td>
              <code>{prop.type}</code>
            </td>
            <td>
              {prop.defaultValue ? <code>{prop.defaultValue}</code> : "-"}
            </td>
            <td>{prop.required ? "Yes" : "No"}</td>
            <td>{prop.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Building a Component Picker

```ts
import {
  buttonPropDocs,
  cardPropDocs,
  dataTablePropDocs,
  numberInputPropDocs,
  radioGroupPropDocs,
  sparklinePropDocs,
  themeSelectPropDocs,
  validationSummaryPropDocs,
  type GeneratedComponentDoc,
} from "@boreal-ui/docs";

const docs: GeneratedComponentDoc[] = [
  buttonPropDocs,
  cardPropDocs,
  dataTablePropDocs,
  numberInputPropDocs,
  sparklinePropDocs,
  validationSummaryPropDocs,
  radioGroupPropDocs,
  themeSelectPropDocs,
];

export const componentNames = docs.map((doc) => doc.name);
```

The docs package exports metadata for every component represented by the generated component-type catalog, including components that share a type file such as `RadioButton`/`RadioGroup`, `Select`/`ThemeSelect`, and the seven `Layout` exports (`Container`, `Stack`, `Inline`, `Grid`, `Section`, `BentoBox`, and `BentoBoxItem`). Theme-provider APIs are documented separately in [Styling and Theming](./styling-and-theming.md).

## Keeping Docs Current

Prop metadata is generated from source types. In the Boreal UI repo, run:

```bash
npm run gen:docs
```

Consumers of the package do not need to run this command. They can import the generated metadata shipped with the package.
