# Generated Prop Docs and Types

Boreal UI publishes TypeScript types and generated prop metadata so consumers can build typed apps, documentation pages, playgrounds, and design-system references.

## Public Types

Shared public types are exported from both builds.

```ts
import type {
  BorderType,
  ColorScheme,
  RoundingType,
  ShadowType,
  SizeType,
  StateType,
  ThemeType,
} from "boreal-ui/core";
```

You can also import from the dedicated type entry point.

```ts
import type { ThemeType } from "boreal-ui/core/types";
import type { SizeType } from "boreal-ui/next/types";
```

Common shared types:

| Type | Values |
| --- | --- |
| `ThemeType` | `primary`, `secondary`, `tertiary`, `quaternary`, `clear` |
| `StateType` | `success`, `error`, `warning`, `info`, `disabled`, empty string |
| `SizeType` | `xs`, `small`, `medium`, `large`, `xl` |
| `RoundingType` | `none`, `small`, `medium`, `large`, `full` |
| `ShadowType` | `none`, `light`, `medium`, `strong`, `intense` |
| `BorderType` | `none`, `xs`, `small`, `medium`, `large`, `xl` |
| `ColorScheme` | Named color scheme object used by theming APIs. |

## Component Types

Component prop types are available through component entry points.

```ts
import type { ButtonProps } from "boreal-ui/core/Button";
import type { DataTableProps, Column } from "boreal-ui/core/DataTable";
```

For Next.js consumers:

```ts
import type { ButtonProps } from "boreal-ui/next/Button";
import type { Column } from "boreal-ui/next/DataTable";
```

Use these types when wrapping Boreal components in app-specific components.

```tsx
import { Button } from "boreal-ui/core";
import type { ButtonProps } from "boreal-ui/core/Button";

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

Generated prop docs are exported from `boreal-ui/docs` and from the main build entries.

```ts
import {
  buttonPropDocs,
  cardPropDocs,
  dataTablePropDocs,
  radioGroupPropDocs,
  themeSelectPropDocs,
  type GeneratedComponentDoc,
  type GeneratedPropDoc,
} from "boreal-ui/docs";
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

## Rendering a Prop Table

```tsx
import { buttonPropDocs } from "boreal-ui/docs";

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
            <td>{prop.defaultValue ? <code>{prop.defaultValue}</code> : "-"}</td>
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
  type GeneratedComponentDoc,
} from "boreal-ui/docs";

const docs: GeneratedComponentDoc[] = [
  buttonPropDocs,
  cardPropDocs,
  dataTablePropDocs,
  radioGroupPropDocs,
  themeSelectPropDocs,
];

export const componentNames = docs.map((doc) => doc.name);
```

The docs package currently exports metadata for every documented public component, including public components that share a type file such as `RadioButton`/`RadioGroup` and `Select`/`ThemeSelect`.

## Keeping Docs Current

Prop metadata is generated from source types. In the Boreal UI repo, run:

```bash
npm run generate:docs
```

Consumers of the package do not need to run this command. They can import the generated metadata shipped with the package.
