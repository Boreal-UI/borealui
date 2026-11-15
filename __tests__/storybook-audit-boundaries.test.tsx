import React from "react";
import {render} from "@testing-library/react";
import {axe} from "jest-axe";
import {readdirSync,readFileSync} from "node:fs";
import path from "node:path";
import ts from "typescript";
import CorePopOver from "@/core/PopOver";
import NextPopOver from "@/next/PopOver";
import coreMeta,{Default as CoreDefault} from "../stories-core/PopOver.stories";
import nextMeta,{Default as NextDefault} from "../stories-next/components/PopOver.stories";

// Keep this story regression isolated from unrelated barrel dependencies while
// rendering the actual public PopOver/Button implementations used by each story.
jest.mock("@/index.core",()=>({PopOver:require("@/core/PopOver").default,Button:require("@/core/Button").default}));
jest.mock("@/index.next",()=>({PopOver:require("@/next/PopOver").default,Button:require("@/next/Button").default}));

it("keeps runtime Core components out of Next stories",()=>{
  const directory=path.join(process.cwd(),"stories-next/components");
  const violations:string[]=[];
  for(const file of readdirSync(directory).filter(name=>name.endsWith(".stories.tsx"))) {
    const source=ts.createSourceFile(file,readFileSync(path.join(directory,file),"utf8"),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    for(const statement of source.statements) {
      if(!ts.isImportDeclaration(statement)||!ts.isStringLiteral(statement.moduleSpecifier))continue;
      const clause=statement.importClause;
      const bindings=clause?.namedBindings;
      const runtime=!clause?.isTypeOnly&&(!clause||!!clause.name||!!bindings&&(ts.isNamespaceImport(bindings)||bindings.elements.some(e=>!e.isTypeOnly)));
      if(runtime&&/src\/(index\.core|core\/|components\/[^/]+\/core\/)/.test(statement.moduleSpecifier.text))violations.push(`${file}: ${statement.moduleSpecifier.text}`);
    }
  }
  expect(violations).toEqual([]);
});

it.each([["Core",CorePopOver,coreMeta,CoreDefault],["Next",NextPopOver,nextMeta,NextDefault]] as const)("%s default PopOver story composes one native button without accessibility violations",async(_,PopOver,meta,story)=>{
  const {container}=render(<PopOver {...meta.args} trigger={story.args?.trigger} content={story.args?.content} />);
  expect(container.querySelectorAll("button")).toHaveLength(1);
  expect(container.querySelector("button button")).toBeNull();
  expect(await axe(container)).toHaveNoViolations();
});
