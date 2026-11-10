import { createRoot } from "react-dom/client";
import { FieldCompositionExamples } from "../../shared-story-assets/FieldCompositionExamples";
import CoreInput from "../../src/components/TextInput/core/TextInput";
import CoreArea from "../../src/components/TextArea/core/TextArea";
import CoreSelect from "../../src/components/Select/core/Select";
import CoreButton from "../../src/components/Button/core/Button";
import CoreTable from "../../src/components/DataTable/core/DataTable";
import NextInput from "../../src/components/TextInput/next/TextInput";
import NextArea from "../../src/components/TextArea/next/TextArea";
import NextSelect from "../../src/components/Select/next/Select";
import NextButton from "../../src/components/Button/next/Button";
import NextTable from "../../src/components/DataTable/next/DataTable";
import "../../src/styles/globals.scss";

const isNext = new URLSearchParams(location.search).get("implementation") === "next";
createRoot(document.getElementById("root")!).render(
  <FieldCompositionExamples TextInput={isNext ? NextInput : CoreInput} TextArea={isNext ? NextArea : CoreArea}
    Select={isNext ? NextSelect : CoreSelect} Button={isNext ? NextButton : CoreButton} DataTable={isNext ? NextTable : CoreTable} />,
);
