import type { Meta } from "@storybook/nextjs-vite";
import { TextInput, TextArea, Select, Button, DataTable } from "../../src/index.next";
import { FieldCompositionExamples } from "../../shared-story-assets/FieldCompositionExamples";

export default { title: "Recipes/Fields, actions and tables" } satisfies Meta;
export const ResponsiveComposition = {
  render: () => <FieldCompositionExamples {...{ TextInput, TextArea, Select, Button, DataTable }} />,
};
