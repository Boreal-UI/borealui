import React, { useState } from "react";
import CoreUpload from "../../src/core/FileUpload";
import NextUpload from "../../src/next/FileUpload";
import CoreTooltip from "../../src/core/Tooltip";
import NextTooltip from "../../src/next/Tooltip";
import CoreSplit from "../../src/core/SplitPane";
import NextSplit from "../../src/next/SplitPane";

export function ReleaseDefects() {
  const query = new URLSearchParams(location.search);
  const next = query.get("variant") === "next";
  const Upload = next ? NextUpload : CoreUpload;
  const Tooltip = next ? NextTooltip : CoreTooltip;
  const Split = next ? NextSplit : CoreSplit;
  const [selection, setSelection] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [size, setSize] = useState(50);
  return <main style={{ padding: 40 }}>
    <form data-testid="form">
      <Upload required multiple={query.has("multiple")} disabled={query.has("disabled")}
        allowedFileTypes={[".txt"]}
        inputProps={{ name: "document" }} onFilesChange={files => setSelection(files.map(f => f.name))}
        onSubmit={files => setUploaded(files.map(f => f.name))} />
      <button type="reset">Reset</button>
    </form>
    <output data-testid="selection">{selection.join(",")}</output>
    <output data-testid="uploaded">{uploaded.join(",")}</output>
    <Tooltip content="Tooltip probe" placement="bottom" keepMountedWhenHidden={!query.has("unmount")}>
      <button aria-describedby="help">Tooltip target</button>
    </Tooltip>
    <p id="help">Help</p>
    <div dir={query.has("rtl") ? "rtl" : "ltr"}>
      <Split startPane="Start" endPane="End" orientation={query.has("vertical") ? "vertical" : "horizontal"}
        size={query.has("controlled") ? size : undefined} onSizeChange={setSize}
        disabled={query.has("disabled")} resizable={!query.has("static")}
        style={{ width: 600, height: 200, direction: query.has("explicit") ? "rtl" : undefined }} />
    </div>
    <output data-testid="size">{size}</output>
  </main>;
}
