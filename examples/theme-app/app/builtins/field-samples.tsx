"use client";

import CoreInput from "../../../../src/components/TextInput/core/TextInput";
import CoreArea from "../../../../src/components/TextArea/core/TextArea";
import NextInput from "../../../../src/components/TextInput/next/TextInput";
import NextArea from "../../../../src/components/TextArea/next/TextArea";
import CoreButton from "../../../../src/components/Button/core/Button";
import NextButton from "../../../../src/components/Button/next/Button";
import MenuIcon from "../../../../src/Icons/MenuIcon";

export default function FieldSamples() {
  return <>{([["core", CoreInput, CoreArea, CoreButton], ["next", NextInput, NextArea, NextButton]] as const).map(([implementation, Input, Area, Button]) => (
    <div key={implementation}>
      <Input icon={MenuIcon} label={`${implementation} disabled input`} rootClassName="disabled-field" className="disabled-control" disabled defaultValue="Readable disabled input" />
      <Area icon={MenuIcon} label={`${implementation} disabled area`} rootClassName="disabled-field" className="disabled-control" disabled defaultValue="Readable disabled area" />
      <Input label={`${implementation} placeholder input`} className="placeholder-control" placeholder="Readable input placeholder" />
      <Area label={`${implementation} placeholder area`} className="placeholder-control" placeholder="Readable area placeholder" />
      {(["solid", "outline", "glass", "glassOutline"] as const).map((variant) => <div key={variant}>
        <Button disabled variant={variant} className="disabled-button">{implementation} {variant} unavailable</Button>
        <Button loading variant={variant} className="disabled-button">{implementation} {variant} pending</Button>
        <Area label={`${implementation} ${variant} disabled area`} variant={variant} rootClassName="disabled-field" className="disabled-control" disabled defaultValue="Readable disabled variant" />
      </div>)}
    </div>
  ))}</>;
}
