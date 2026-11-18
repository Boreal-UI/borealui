import React from "react";
import {render,screen} from "@testing-library/react";
import {renderToString} from "react-dom/server";
import {axe} from "jest-axe";
import CoreNavBar from "@/core/NavBar";
import NextNavBar from "@/next/NavBar";
import CoreMultiSelect from "@/core/MultiSelect";
import NextMultiSelect from "@/next/MultiSelect";
import ServerBarChart from "@/next/server/BarChart";
import ServerLineChart from "@/next/server/LineChart";
import ServerSparkline from "@/next/server/Sparkline";
import ServerLegend from "@/next/server/Legend";
import ServerBreadcrumbs from "@/next/server/Breadcrumbs";
import ServerPageHeader from "@/next/server/PageHeader";
import ServerBreadCrumbPageHeader from "@/next/server/BreadCrumbPageHeader";
import ServerTimeline from "@/next/server/Timeline";
import {scrollActiveOptionIntoView} from "@/utils/scrollActiveOptionIntoView";

jest.mock("next/navigation",()=>({usePathname:()=>"/"}));
const options=[{value:"a",label:"Alpha"},{value:"b",label:"Beta"}];
describe.each([["Core",CoreNavBar,CoreMultiSelect],["Next",NextNavBar,NextMultiSelect]] as const)("%s audit fixes",(_,NavBar,MultiSelect)=>{
  it("forwards default and custom accessible link names through the public wrapper",async()=>{
    const items=[{label:"Home",path:"/",icon:<span>H</span>},{label:"Reports",path:"/reports",icon:<span>R</span>}];
    const {rerender,container}=render(<NavBar items={items} />);
    expect(screen.getByRole("link",{name:"Home"})).toHaveAttribute("aria-label","Home");
    expect(screen.getByRole("link",{name:"Reports"})).toHaveAttribute("aria-label","Reports");
    rerender(<NavBar items={items} getItemAriaLabel={item=>`Open ${item.label}`} />);
    expect(screen.getByRole("link",{name:"Open Home"})).toHaveAttribute("aria-current","page");
    expect(await axe(container)).toHaveNoViolations();
  });
  it("includes displayed values in default searchable button names while respecting explicit names",()=>{
    const {rerender}=render(<MultiSelect label="Components" options={options} value={[]} />);
    expect(screen.getByRole("button",{name:"Components Select options"})).toBeInTheDocument();
    rerender(<MultiSelect label="Components" options={options} value={["a","b"]} />);
    expect(screen.getByRole("button",{name:"Components Alpha Beta"})).toBeInTheDocument();
    rerender(<MultiSelect label="Components" aria-label="Custom picker" options={options} value={["a"]} />);
    expect(screen.getByRole("button",{name:"Custom picker"})).toBeInTheDocument();
    rerender(<><span id="custom-name">External picker</span><MultiSelect label="Components" aria-labelledby="custom-name" options={options} value={["a"]} /></>);
    expect(screen.getByRole("button",{name:"External picker"})).toBeInTheDocument();
    rerender(<MultiSelect label="Components" toggleAriaLabel="Toggle custom picker" options={options} />);
    expect(screen.getByRole("button",{name:"Toggle custom picker"})).toBeInTheDocument();
  });
  it("keeps select-only combobox naming stable and names unlabeled searchable selections",()=>{
    const {rerender}=render(<MultiSelect label="Components" searchable={false} options={options} value={["a"]} />);
    expect(screen.getByRole("combobox",{name:"Components"})).toBeInTheDocument();
    rerender(<MultiSelect options={options} value={["a"]} />);
    expect(screen.getByRole("button",{name:"Alpha"})).toBeInTheDocument();
  });
});

it("scrolls only a list's overflow and leaves already visible options and focus alone",()=>{
  const list=document.createElement("div");list.setAttribute("role","listbox");
  const option=document.createElement("div");list.append(option);
  const owner=document.createElement("input");document.body.append(owner,list);owner.focus();
  Object.defineProperties(list,{clientHeight:{value:100},clientTop:{value:2}});
  jest.spyOn(list,"getBoundingClientRect").mockReturnValue(new DOMRect(0,10,100,104));
  const rect=jest.spyOn(option,"getBoundingClientRect");
  rect.mockReturnValue(new DOMRect(0,200,80,20));scrollActiveOptionIntoView(option);expect(list.scrollTop).toBe(108);
  rect.mockReturnValue(new DOMRect(0,5,80,20));scrollActiveOptionIntoView(option);expect(list.scrollTop).toBe(101);
  rect.mockReturnValue(new DOMRect(0,40,80,20));scrollActiveOptionIntoView(option);expect(list.scrollTop).toBe(101);
  expect(owner).toHaveFocus();expect(window.scrollY).toBe(0);
  scrollActiveOptionIntoView(null);scrollActiveOptionIntoView(owner);
  owner.remove();list.remove();jest.restoreAllMocks();
});

it("preserves ordinary SSR markup through all applicable public server entries",()=>{
  const data=[{label:"Jan",value:12}]; const crumbs=[{label:"Home",href:"/"},{label:"Data"}];
  const html=renderToString(<>
    <ServerBarChart label="Bar revenue" data={data} />
    <ServerLineChart label="Line revenue" data={data} color="#ff8800" />
    <ServerSparkline label="Trend" data={[1,2]} showValue color="#ff8800" />
    <ServerLegend label="Segments" items={[{label:"Desktop",color:"#ff8800",value:"60%"}]} />
    <ServerBreadcrumbs items={crumbs} />
    <ServerPageHeader title="Server header" titleAs="h2" eyebrow="Project Management" />
    <ServerBreadCrumbPageHeader title="Server composite" titleAs="h2" breadcrumbs={crumbs} />
    <ServerTimeline items={[{title:"Created",date:"2026-11-15"}]} />
  </>);
  const view=document.createElement("div");view.innerHTML=html;
  expect(view.querySelector('[aria-current="page"]')).toHaveTextContent("Data");
  expect(view.querySelector('path[stroke="#ff8800"]')).not.toBeNull();
  expect(view.querySelector('time[datetime]')).toHaveTextContent("2026-11-15");
  expect([...view.querySelectorAll("h2")].map(el=>el.textContent)).toEqual(expect.arrayContaining(["Server header","Server composite"]));
  expect(view).toHaveTextContent("Bar revenue");expect(view).toHaveTextContent("Desktop");
});
