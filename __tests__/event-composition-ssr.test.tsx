import React from "react";
import { renderToString } from "react-dom/server";
import ButtonBase from "@/components/Button/ButtonBase";
import DropdownBase from "@/components/Dropdown/DropdownBase";
import TooltipBase from "@/components/Tooltip/TooltipBase";
import TreeViewBase from "@/components/TreeView/TreeViewBase";
import { DummyIconButton } from "./test-utils/dummyComponents";

const classMap: Record<string, string> = {};
const TestIcon = () => <svg aria-hidden="true" />;

describe("event composition SSR", () => {
  it("renders composed interaction paths without DOM globals", () => {
    expect(() =>
      renderToString(
        <>
          <ButtonBase
            as="div"
            classMap={classMap}
            onKeyDown={jest.fn()}
            onClick={jest.fn()}
          >
            Action
          </ButtonBase>
          <DropdownBase
            triggerIcon={TestIcon}
            items={[{ label: "Item" }]}
            IconButton={DummyIconButton}
            classMap={classMap}
            onKeyDown={jest.fn()}
          />
          <TooltipBase content="Help" classMap={classMap}>
            <button type="button" onFocus={jest.fn()}>
              Trigger
            </button>
          </TooltipBase>
          <TreeViewBase
            items={[{ id: "item", label: "Item" }]}
            classMap={classMap}
            onBlurCapture={jest.fn()}
          />
        </>,
      ),
    ).not.toThrow();
  });
});
