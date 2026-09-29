import React from "react";
import { renderToString } from "react-dom/server";
import DropdownBase from "@/components/Dropdown/DropdownBase";
import MenuBase from "@/components/Menu/MenuBase";
import PopOverBase from "@/components/PopOver/PopOverBase";
import { DummyIconButton } from "./test-utils/dummyComponents";

const classMap: Record<string, string> = {};
const TestIcon = () => <svg aria-hidden="true" />;

describe("floating panel SSR safety", () => {
  it("renders Menu, Dropdown, and PopOver without reading browser geometry", () => {
    expect(() =>
      renderToString(
        <>
          <MenuBase
            activation="manual"
            defaultOpen
            position={{ x: 20, y: 20 }}
            items={[{ label: "Menu item" }]}
            classMap={classMap}
          />
          <DropdownBase
            triggerIcon={TestIcon}
            items={[{ label: "Dropdown item" }]}
            IconButton={DummyIconButton}
            classMap={classMap}
          />
          <PopOverBase
            trigger="Details"
            content="PopOver content"
            classMap={classMap}
          />
        </>,
      ),
    ).not.toThrow();
  });
});
