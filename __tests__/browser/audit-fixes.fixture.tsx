import React, {useState} from "react";
import {buildThemeVariables} from "../../src/context/themeRuntime";
import {defaultColorSchemes} from "../../src/styles/Themes";
import type {StateType, ThemeType, VariantType} from "../../src/types/types";
import coreBarChart from "../../src/core/BarChart";
import coreDonutChart from "../../src/core/DonutChart";
import coreLineChart from "../../src/core/LineChart";
import coreSparkline from "../../src/core/Sparkline";
import coreLegend from "../../src/core/Legend";
import coreBreadcrumbs from "../../src/core/Breadcrumbs";
import corePageHeader from "../../src/core/PageHeader";
import coreBreadCrumbPageHeader from "../../src/core/BreadCrumbPageHeader";
import coreTimeline from "../../src/core/Timeline";
import coreTreeView from "../../src/core/TreeView";
import coreNavBar from "../../src/core/NavBar";
import coreMultiSelect from "../../src/core/MultiSelect";
import coreComboBox from "../../src/core/ComboBox";
import coreRating from "../../src/core/Rating";
import corePopOver from "../../src/core/PopOver";
import coreButton from "../../src/core/Button";
import nextBarChart from "../../src/next/BarChart";
import nextDonutChart from "../../src/next/DonutChart";
import nextLineChart from "../../src/next/LineChart";
import nextSparkline from "../../src/next/Sparkline";
import nextLegend from "../../src/next/Legend";
import nextBreadcrumbs from "../../src/next/Breadcrumbs";
import nextPageHeader from "../../src/next/PageHeader";
import nextBreadCrumbPageHeader from "../../src/next/BreadCrumbPageHeader";
import nextTimeline from "../../src/next/Timeline";
import nextTreeView from "../../src/next/TreeView";
import nextNavBar from "../../src/next/NavBar";
import nextMultiSelect from "../../src/next/MultiSelect";
import nextComboBox from "../../src/next/ComboBox";
import nextRating from "../../src/next/Rating";
import nextPopOver from "../../src/next/PopOver";
import nextButton from "../../src/next/Button";
import serverBarChart from "../../src/next/server/BarChart";
import serverLineChart from "../../src/next/server/LineChart";
import serverSparkline from "../../src/next/server/Sparkline";
import serverLegend from "../../src/next/server/Legend";
import serverBreadcrumbs from "../../src/next/server/Breadcrumbs";
import serverPageHeader from "../../src/next/server/PageHeader";
import serverBreadCrumbPageHeader from "../../src/next/server/BreadCrumbPageHeader";
import serverTimeline from "../../src/next/server/Timeline";

const data=[{label:"Jan",value:12},{label:"Feb",value:18},{label:"Mar",value:9}];
const legendItems=[{label:"Desktop",color:"#2563eb",value:"60%"},{label:"Mobile",color:"#16a34a",value:"32%"}];
const crumbs=[{label:"Home",href:"#home"},{label:"Data"}];
const longOptions=Array.from({length:40},(_,i)=>({value:String(i),label:`Option ${i+1}`}));
const charts={core:{BarChart:coreBarChart,LineChart:coreLineChart,Sparkline:coreSparkline,Legend:coreLegend,Breadcrumbs:coreBreadcrumbs,PageHeader:corePageHeader,BreadCrumbPageHeader:coreBreadCrumbPageHeader,Timeline:coreTimeline},next:{BarChart:nextBarChart,LineChart:nextLineChart,Sparkline:nextSparkline,Legend:nextLegend,Breadcrumbs:nextBreadcrumbs,PageHeader:nextPageHeader,BreadCrumbPageHeader:nextBreadCrumbPageHeader,Timeline:nextTimeline},server:{BarChart:serverBarChart,LineChart:serverLineChart,Sparkline:serverSparkline,Legend:serverLegend,Breadcrumbs:serverBreadcrumbs,PageHeader:serverPageHeader,BreadCrumbPageHeader:serverBreadCrumbPageHeader,Timeline:serverTimeline}};

export function AuditFixFixture({variant}:{variant:"core"|"next"|"server"}) {
  const [schemeIndex,setSchemeIndex]=useState(defaultColorSchemes.findIndex(s=>s.name==="Forest Dusk"));
  const [surface,setSurface]=useState<VariantType>("solid");
  const [state,setState]=useState<StateType|undefined>();
  const [theme,setTheme]=useState<ThemeType>("primary");
  const [customNames,setCustomNames]=useState(false);
  Object.assign(window,{auditSchemes:defaultColorSchemes.map(s=>s.name),auditSet:(args:{schemeIndex?:number;surface?:VariantType;state?:StateType|null;theme?:ThemeType;customNames?:boolean})=>{
    if(args.schemeIndex!==undefined)setSchemeIndex(args.schemeIndex);
    if(args.surface)setSurface(args.surface);
    if("state" in args)setState(args.state??undefined);
    if(args.theme)setTheme(args.theme);
    if(args.customNames!==undefined)setCustomNames(args.customNames);
  }});
  const {BarChart,LineChart,Sparkline,Legend,Breadcrumbs,PageHeader,BreadCrumbPageHeader,Timeline}=charts[variant];
  const DonutChart=variant==="core"?coreDonutChart:variant==="next"?nextDonutChart:undefined;
  const TreeView=variant==="core"?coreTreeView:variant==="next"?nextTreeView:undefined;
  const NavBar=variant==="core"?coreNavBar:nextNavBar;
  const MultiSelect=variant==="core"?coreMultiSelect:nextMultiSelect;
  const ComboBox=variant==="core"?coreComboBox:nextComboBox;
  const Rating=variant==="core"?coreRating:nextRating;
  const PopOver=variant==="core"?corePopOver:nextPopOver;
  const Button=variant==="core"?coreButton:nextButton;
  const common={theme,state};
  return <div data-testid="audit-root" data-scheme={schemeIndex} data-surface={surface} data-state={state??"default"} data-component-theme={theme}
    style={{...buildThemeVariables(defaultColorSchemes[schemeIndex]),background:"var(--background-color)",color:"var(--text-color)",padding:16}}>
    <main>
      <h1>DevTools fix regressions</h1>
      <BarChart {...common} label="Monthly revenue" data={data} />
      {DonutChart&&<DonutChart {...common} label="Device split" data={data} centerLabel="100%" showLegend />}
      <LineChart {...common} label="Traffic" data={data} />
      <Sparkline {...common} label="Revenue" data={[4,8,6,12]} showValue />
      <Legend {...common} label="Segments" items={legendItems} />
      <Breadcrumbs {...common} variant={surface} items={crumbs} />
      <PageHeader {...common} variant={surface} titleAs="h2" title="Audit header" eyebrow="Project Management" />
      <BreadCrumbPageHeader {...common} variant={surface} titleAs="h2" title="Composite header" breadcrumbs={crumbs} />
      <Timeline theme={theme} variant={surface} items={[{title:"Created",description:"Timeline content",date:"2026-11-15"}]} />
      {TreeView&&<TreeView {...common} variant={surface} aria-label="Audit tree" items={[{id:"a",label:"Overview"},{id:"b",label:"Activity"}]} selectedId="a" />}
    </main>
    {variant!=="server"&&<aside aria-label="Interaction probes">
      <NavBar aria-label="Audit navigation" items={[{label:"Home",path:"#home",icon:<span>H</span>},{label:"Reports",path:"#reports",icon:<span>R</span>}]}
        getItemAriaLabel={customNames?item=>`Open ${item.label}`:undefined} />
      <MultiSelect label="Long searchable" options={longOptions} />
      <MultiSelect label="Long non-searchable" searchable={false} options={longOptions} />
      <ComboBox label="Long ComboBox" options={longOptions} />
      <MultiSelect label="Named selections" options={longOptions} defaultValue={["0","1"]} />
      <MultiSelect label="Visible field" aria-label="Explicit picker Select options" options={longOptions} />
      <div style={{marginBlock:8}}>
        {(["xs","small","medium","large","xl"] as const).map(size=><Rating key={size} label={`Rating ${size}`} size={size} value={2} onChange={()=>{}} />)}
      </div>
      <button type="button">Adjacent control</button>
      <PopOver asChild trigger={<Button>Open audit popover</Button>} content={<p>Popover content</p>} />
      <div style={{color:"#ffffff",background:"#112233"}} data-testid="consumer-surface">
        <LineChart label="Custom stroke" data={data} color="#ff8800" style={{color:"#ffffff"}} />
        <Sparkline label="Custom sparkline" data={[1,2,3]} color="#ff8800" showValue />
      </div>
    </aside>}
  </div>;
}

