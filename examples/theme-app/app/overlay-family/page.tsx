"use client";
import { useState } from "react";
import ThemeProvider from "../../../../src/context/NextThemeProvider";
import Drawer from "../../../../src/components/Drawer/next/Drawer";
import Dropdown from "../../../../src/components/Dropdown/next/Dropdown";
import PopOver from "../../../../src/components/PopOver/next/PopOver";
import Tooltip from "../../../../src/components/Tooltip/next/Tooltip";
import CommandPalette from "../../../../src/components/CommandPalette/next/CommandPalette";
import MessagePopup from "../../../../src/components/MessagePopup/next/MessagePopup";
import Chip from "../../../../src/components/Chip/next/Chip";
import MenuIcon from "../../../../src/Icons/MenuIcon";
import { themeConfig, eveningTheme } from "../../theme";

export default function OverlayFamily() {
  const [open, setOpen] = useState("");
  return <ThemeProvider scope="local" {...themeConfig} initialSchemeName={eveningTheme.name}>
    <main style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
      <h1>Overlay infrastructure inventory</h1>
      <button onClick={() => setOpen("drawer")}>Open drawer sample</button>
      <Drawer open={open === "drawer"} onClose={() => setOpen("")} title="Scoped drawer"><p>Drawer remains in its originating DOM scope.</p></Drawer>
      <Dropdown triggerIcon={MenuIcon} aria-label="Open menu sample" items={[{ label: "Scoped menu item", onClick: () => {} }]} />
      <PopOver trigger="Open popover sample" triggerAriaLabel="Open popover sample" aria-label="Scoped popover" content={<p>Popover inherits its inline scope.</p>} />
      <Tooltip content="Scoped tooltip"><button>Tooltip sample</button></Tooltip>
      <button onClick={() => setOpen("commands")}>Open command sample</button>
      <CommandPalette open={open === "commands"} onClose={() => setOpen("")} aria-label="Scoped commands" commands={[{ label: "Scoped command", action: () => {} }]} />
      <button onClick={() => setOpen("message")}>Open message sample</button>
      {open === "message" && <MessagePopup title="Scoped message" message="Message popup inherits the semantic surface." onClose={() => setOpen("")} />}
      <button onClick={() => setOpen("chip")}>Open chip sample</button>
      <Chip visible={open === "chip"} message="Scoped notification" autoClose={false} onClose={() => setOpen("")} />
    </main>
  </ThemeProvider>;
}
