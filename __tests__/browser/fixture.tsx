import { ReleaseDefects } from "./release-defects.fixture";
import { ControlContracts } from "./control-contracts.fixture";
import { AdvancedControls } from "./advanced-controls.fixture";
import { TableForms } from "./table-forms.fixture";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { defaultColorSchemes } from "../../src/styles/Themes";
import { buildThemeVariables } from "../../src/context/themeRuntime";
import "../../src/styles/globals.scss";
import coreSelect from "../../src/core/Select";
import coreComboBox from "../../src/core/ComboBox";
import coreFileUpload from "../../src/core/FileUpload";
import coreDateRangePicker from "../../src/core/DateRangePicker";
import coreNavBar from "../../src/core/NavBar";
import coreSidebar from "../../src/core/Sidebar";
import coreTabs from "../../src/core/Tabs";
import coreAccordion from "../../src/core/Accordion";
import coreDataTable from "../../src/core/DataTable";
import corePager from "../../src/core/Pager";
import coreMultiSelect from "../../src/core/MultiSelect";
import coreNumberInput from "../../src/core/NumberInput";
import nextSelect from "../../src/next/Select";
import nextComboBox from "../../src/next/ComboBox";
import nextFileUpload from "../../src/next/FileUpload";
import nextDateRangePicker from "../../src/next/DateRangePicker";
import nextNavBar from "../../src/next/NavBar";
import nextSidebar from "../../src/next/Sidebar";
import nextTabs from "../../src/next/Tabs";
import nextAccordion from "../../src/next/Accordion";
import nextDataTable from "../../src/next/DataTable";
import nextPager from "../../src/next/Pager";
import nextMultiSelect from "../../src/next/MultiSelect";
import nextNumberInput from "../../src/next/NumberInput";
import CoreInputGroup from "../../src/core/InputGroup";
import NextInputGroup from "../../src/next/InputGroup";
import CoreDateTimePicker from "../../src/core/DateTimePicker";
import NextDateTimePicker from "../../src/next/DateTimePicker";
import CoreRating from "../../src/core/Rating";
import NextRating from "../../src/next/Rating";
import { InteractionRegressionExamples } from "../../shared-story-assets/InteractionRegressionExamples";
import { AuditFixFixture } from "./audit-fixes.fixture";
const InputGroup = new URLSearchParams(location.search).get("variant") === "next" ? NextInputGroup : CoreInputGroup;
const DateTimePicker = new URLSearchParams(location.search).get("variant") === "next" ? NextDateTimePicker : CoreDateTimePicker;
const next = new URLSearchParams(location.search).get("variant") === "next";
const { Select, ComboBox, FileUpload, DateRangePicker, NavBar, Sidebar, Tabs, Accordion, DataTable, Pager, MultiSelect, NumberInput } = next ? { Select: nextSelect, ComboBox: nextComboBox, FileUpload: nextFileUpload, DateRangePicker: nextDateRangePicker, NavBar: nextNavBar, Sidebar: nextSidebar, Tabs: nextTabs, Accordion: nextAccordion, DataTable: nextDataTable, Pager: nextPager, MultiSelect: nextMultiSelect, NumberInput: nextNumberInput } : { Select: coreSelect, ComboBox: coreComboBox, FileUpload: coreFileUpload, DateRangePicker: coreDateRangePicker, NavBar: coreNavBar, Sidebar: coreSidebar, Tabs: coreTabs, Accordion: coreAccordion, DataTable: coreDataTable, Pager: corePager, MultiSelect: coreMultiSelect, NumberInput: coreNumberInput };
function Fixture() {
  const [scheme, setScheme] = useState(0);
  const [risk, setRisk] = useState<number | "">(10);
  Object.assign(window, { themes: defaultColorSchemes.map(s => s.name), selectTheme: setScheme });
  const options = [{ value: "one", label: "Selected choice" }, { value: "two", label: "Other choice" }];
  return <main style={{...buildThemeVariables(defaultColorSchemes[scheme]), background: "var(--background-color)", color: "var(--text-color)", padding: 24}}>
    <h1>Regression fixtures</h1>
    <NumberInput label="Risk" value={risk} onChange={setRisk} min={0} max={50} />
    <div style={{width: 320}}>
      <DataTable testId="wide-table" toolbarTitle="Publications" filterable pagination itemsPerPage={2}
        columns={[{key:"name",label:"Name",minWidth:"400px"},{key:"details",label:"Details",minWidth:"600px"}]}
        data={[{name:"Aurora",details:"Far right content"},{name:"Borealis",details:"More content"},{name:"Forest",details:"Third row"}]} />
    </div>
    {([undefined, "success", "warning", "error", "info"] as const).map((state) => <section key={state ?? "default"} data-state={state ?? "default"}>
      {(["solid", "outline", "glass", "glassOutline"] as const).map(variant => <div key={variant} data-variant={variant}>
        <Sidebar variant={variant} state={state} links={[{label:"Settings", href:"/active"}]} isLinkActive={() => true} />
        <InputGroup variant={variant} state={state} label="Amount" prefix="$" suffix="USD"><input aria-label="Amount value" defaultValue="125" /></InputGroup>
        <DateTimePicker variant={variant} state={state} label="Appointment" type="datetime-local" value="2026-11-14T12:30" onChange={() => {}} />
        <DateTimePicker variant={variant} state={state} label="Read-only appointment" type="datetime-local" value="2026-11-14T12:30" readOnly />
        <DateTimePicker variant={variant} state={state} label="Disabled appointment" type="datetime-local" value="2026-11-14T12:30" disabled />
      </div>)}
      <InputGroup theme="clear" state={state} label="Clear amount" prefix="$" suffix="USD"><input aria-label="Clear amount value" defaultValue="125" /></InputGroup>
      <DateTimePicker theme="clear" state={state} label="Clear appointment" type="datetime-local" value="2026-11-14T12:30" readOnly />
      <Select label="Select" options={options} defaultValue="one" state={state} />
      <ComboBox label="ComboBox" options={options} value="one" onChange={() => {}} state={state} />
      <FileUpload onSubmit={() => {}} label="Upload" state={state} />
      <DateRangePicker label="Dates" value={{start:"2026-11-01",end:"2026-11-13"}} onChange={() => {}} state={state} />
      <NavBar items={[{label:"Navigation", path:"/active", icon: null}]} isItemActive={() => true} />
      <Sidebar isLinkActive={link => link.href === "/active"} links={[{ id:"a", label:"Reports", children:[{label:"First",href:"/first"}] }, { id:"b", label:"Reports",children:[{label:"Second",href:"/second"}] }, {label:"Active section", children:[{label:"Selected link",href:"/active"}]}, {label:"Disabled reports", "aria-disabled":true, children:[{label:"Disabled child",href:"/disabled"}]}]} state={state} />
      <Tabs tabs={[{label:"Selected tab"},{label:"Other tab"}]} state={state} />
      <Accordion defaultExpanded title="Accordion" state={state}>Content</Accordion>
      <DataTable selectableRows rowKey={row => row.name} defaultSelectedRowKeys={["Record"]} columns={[{key:"name",label:"Name"}]} data={[{name:"Record"}]} state={state} />
      <Pager totalItems={30} itemsPerPage={10} currentPage={2} onPageChange={() => {}} state={state} />
      <MultiSelect label="MultiSelect" options={options} defaultValue={["one"]} state={state} />
    </section>)}
  </main>;
}
createRoot(document.getElementById("root")!).render(
  new URLSearchParams(location.search).get("mode") === "control-contracts"
    ? <ControlContracts />
    : new URLSearchParams(location.search).get("mode") === "table-forms"
    ? <TableForms />
    : new URLSearchParams(location.search).get("mode") === "advanced-controls"
    ? <AdvancedControls />
    : new URLSearchParams(location.search).get("mode") === "release-defects"
    ? <ReleaseDefects />
    : new URLSearchParams(location.search).get("mode") === "audit-fixes"
    ? <AuditFixFixture variant={new URLSearchParams(location.search).get("variant")==="server"?"server":next?"next":"core"} />
    : new URLSearchParams(location.search).get("mode") === "interactions"
    ? <InteractionRegressionExamples MultiSelect={MultiSelect} ComboBox={ComboBox} Rating={next ? NextRating : CoreRating} />
    : <Fixture />,
);
