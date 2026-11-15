import {test,expect,type Page,type Locator} from "@playwright/test";
import {writeFile} from "node:fs/promises";
import {contrastMeasurements} from "./contrast.measurements";

async function visit(page:Page,variant:string) {
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto(`/__tests__/browser/index.html?mode=audit-fixes&variant=${variant}`);
  await expect(page.getByRole("heading",{name:"DevTools fix regressions"})).toBeVisible();
  // These checks measure steady-state colors; animation coverage is separate.
  await page.addStyleTag({content:"*,*::before,*::after{animation:none!important;transition:none!important}"});
}
async function setScenario(page:Page,args:Record<string,unknown>) {
  await page.evaluate(args=>(window as unknown as {auditSet:(a:Record<string,unknown>)=>void}).auditSet(args),args);
  const root=page.getByTestId("audit-root");
  if(args.schemeIndex!==undefined)await expect(root).toHaveAttribute("data-scheme",String(args.schemeIndex));
  if(args.surface)await expect(root).toHaveAttribute("data-surface",String(args.surface));
  if("state" in args)await expect(root).toHaveAttribute("data-state",String(args.state??"default"));
  if(args.theme)await expect(root).toHaveAttribute("data-component-theme",String(args.theme));
  await page.evaluate(()=>new Promise(requestAnimationFrame));
}
async function activeVisible(owner:Locator) {
  return owner.evaluate(el=>{
    const option=document.getElementById(el.getAttribute("aria-activedescendant")!);
    const list=option?.closest<HTMLElement>('[role="listbox"]');
    if(!option||!list)return {visible:false,scrollTop:0};
    const r=option.getBoundingClientRect(),b=list.getBoundingClientRect();
    return {visible:r.top>=b.top+list.clientTop-1&&r.bottom<=b.top+list.clientTop+list.clientHeight+1,scrollTop:list.scrollTop};
  });
}
for(const variant of ["core","next","server"]) {
  test(`${variant}: audit text contrast across schemes, variants, states and theme props`,async({page},testInfo)=>{
    await visit(page,variant);
    const schemes=await page.evaluate(()=>(window as unknown as {auditSchemes:string[]}).auditSchemes);
    const failures:unknown[]=[]; const forest:unknown[]=[];
    const check=async(scenario:Record<string,unknown>)=>{
      await setScenario(page,scenario);
      const measurements=await contrastMeasurements(page);
      const bad=measurements.filter(m=>m.ratio<m.minimum);
      if(bad.length)failures.push({scenario,failures:bad});
      if(scenario.schemeIndex===schemes.indexOf("Forest Dusk"))forest.push({scenario,measurements});
    };
    for(let schemeIndex=0;schemeIndex<schemes.length;schemeIndex++) {
      for(const surface of ["solid","outline","glass","glassOutline"])await check({schemeIndex,surface,state:null,theme:"primary"});
    }
    for(const state of ["success","warning","error","info"])for(const surface of ["solid","outline","glass","glassOutline"])
      await check({schemeIndex:schemes.indexOf("Forest Dusk"),state,surface,theme:"primary"});
    for(const theme of ["secondary","tertiary","quaternary","clear"])for(const surface of ["solid","outline","glass","glassOutline"])
      await check({schemeIndex:schemes.indexOf("Forest Dusk"),state:null,surface,theme});
    const path=testInfo.outputPath("audit-contrast.json");await writeFile(path,JSON.stringify({schemes,failures,forest},null,2));
    await testInfo.attach("audit-contrast.json",{path,contentType:"application/json"});
    expect(failures).toEqual([]);
  });
}
for(const variant of ["core","next"]) {
  test(`${variant}: long keyboard lists scroll within their container and retain focus`,async({page})=>{
    await visit(page,variant);
    for(const [label,searchable] of [["Long searchable",true],["Long non-searchable",false]] as const) {
      const trigger=page.getByTestId("multi-select-trigger").filter({hasText:"Select options"}).first();
      const target=searchable?trigger:page.getByRole("combobox",{name:label,exact:true});
      await target.evaluate(el=>el.scrollIntoView({block:"start"}));
      await target.focus();await page.keyboard.press("ArrowDown");
      const owner=searchable?page.getByRole("combobox",{name:"Filter options"}):target;
      await expect(owner).toBeFocused(); const scroll=await page.evaluate(()=>window.scrollY);
      await page.keyboard.press("End");await expect.poll(async()=>(await activeVisible(owner)).visible).toBe(true);
      expect((await activeVisible(owner)).scrollTop).toBeGreaterThan(0);
      await page.getByRole("listbox").evaluate(el=>{el.scrollTop=0;});
      await page.keyboard.press("End");await expect.poll(async()=>(await activeVisible(owner)).visible).toBe(true);
      await expect(owner).toBeFocused();expect(await page.evaluate(()=>window.scrollY)).toBe(scroll);
      await page.keyboard.press("Home");expect((await activeVisible(owner)).scrollTop).toBe(0);
      if(searchable) {await owner.fill("Option 40");await expect.poll(async()=>(await activeVisible(owner)).visible).toBe(true);}
      await page.keyboard.press("Escape");await expect(target).toBeFocused();
    }
    const combo=page.getByRole("combobox",{name:"Long ComboBox"});
    await combo.evaluate(el=>el.scrollIntoView({block:"start"}));await combo.focus();
    const scroll=await page.evaluate(()=>window.scrollY);
    for(let i=0;i<30;i++)await page.keyboard.press("ArrowDown");
    await expect.poll(async()=>(await activeVisible(combo)).visible).toBe(true);
    expect((await activeVisible(combo)).scrollTop).toBeGreaterThan(0);
    await expect(combo).toBeFocused();expect(await page.evaluate(()=>window.scrollY)).toBe(scroll);
    for(let i=0;i<15;i++)await page.keyboard.press("ArrowDown");
    await page.getByRole("listbox").evaluate(el=>{el.scrollTop=0;});
    await page.keyboard.press("ArrowDown");
    await expect.poll(async()=>(await activeVisible(combo)).visible).toBe(true);
    await combo.fill("Option 40");await expect.poll(async()=>(await activeVisible(combo)).visible).toBe(true);
    await page.keyboard.press("Enter");await expect(combo).toHaveValue("Option 40");
  });
  test(`${variant}: mobile navigation, MultiSelect visible names and all Rating target sizes`,async({page})=>{
    await page.setViewportSize({width:390,height:844});await visit(page,variant);
    const nav=page.getByRole("navigation",{name:"Audit navigation"});
    await expect(nav.getByRole("link",{name:"Home",exact:true})).toBeVisible();
    await expect(nav.getByRole("link",{name:"Reports",exact:true})).toBeVisible();
    await setScenario(page,{customNames:true});
    await expect(nav.getByRole("link",{name:"Open Home",exact:true})).toBeVisible();
    await expect(page.getByRole("button",{name:"Long searchable Select options",exact:true})).toBeVisible();
    await expect(page.getByRole("button",{name:"Named selections Option 1 Option 2",exact:true})).toBeVisible();
    await expect(page.getByRole("button",{name:"Explicit picker Select options",exact:true})).toBeVisible();
    const measurements=await page.getByRole("radiogroup").evaluateAll(groups=>groups.map(group=>({
      label:group.getAttribute("aria-labelledby"),targets:[...group.querySelectorAll('[role="radio"]')].map(el=>{const r=el.getBoundingClientRect();return {width:r.width,height:r.height};})
    })));
    expect(measurements).toHaveLength(5);
    for(const group of measurements)for(const target of group.targets){expect(target.width).toBeGreaterThanOrEqual(24);expect(target.height).toBeGreaterThanOrEqual(24);}
    await page.addScriptTag({url:"/node_modules/axe-core/axe.min.js"});
    const violations=await page.evaluate(async()=>{
      const axe=(window as unknown as {axe:{run:(root:Element,options:unknown)=>Promise<{violations:unknown[]}>}}).axe;
      return (await axe.run(document.querySelector('aside')!,{runOnly:{type:"rule",values:["label-content-name-mismatch","target-size","link-name","nested-interactive"]}})).violations;
    });
    expect(violations).toEqual([]);
  });
  test(`${variant}: PopOver asChild example has one native trigger and graphic color overrides survive`,async({page})=>{
    await visit(page,variant);
    const trigger=page.getByRole("button",{name:"Open audit popover",exact:true});
    expect(await trigger.locator("button").count()).toBe(0);
    await trigger.click();await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");await expect(trigger).toBeFocused();
    const surface=page.getByTestId("consumer-surface");
    await expect(surface.getByTestId("line-chart-line")).toHaveAttribute("stroke","#ff8800");
    await expect(surface.getByTestId("sparkline-line")).toHaveAttribute("stroke","#ff8800");
    await expect(surface.getByTestId("line-chart-label")).toHaveCSS("color","rgb(255, 255, 255)");
  });
}
