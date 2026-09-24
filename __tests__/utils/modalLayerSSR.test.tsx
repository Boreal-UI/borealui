import React from "react";
import { renderToString } from "react-dom/server";
import CommandPaletteBase from "@/components/CommandPalette/CommandPaletteBase";
import DrawerBase from "@/components/Drawer/DrawerBase";
import BaseMessagePopup from "@/components/MessagePopup/MessagePopupBase";
import BaseModal from "@/components/Modal/ModalBase";
import {
  DummyButton,
  DummyIconButton,
  DummyTextInput,
} from "../test-utils/dummyComponents";

const classMap = new Proxy<Record<string, string>>(
  {},
  { get: (_, property) => String(property) },
);

describe("modal layer SSR safety", () => {
  it("renders affected base components without DOM globals during render", () => {
    expect(() =>
      renderToString(
        <>
          <BaseModal
            open
            onClose={() => undefined}
            IconButton={DummyIconButton}
            classMap={classMap}
          >
            <p>Modal</p>
          </BaseModal>
          <BaseMessagePopup
            message="Popup"
            onClose={() => undefined}
            Button={DummyButton}
            IconButton={DummyIconButton}
            classMap={classMap}
          />
          <DrawerBase open onClose={() => undefined} classMap={classMap}>
            Drawer
          </DrawerBase>
          <CommandPaletteBase
            open
            commands={[]}
            onClose={() => undefined}
            TextInputComponent={DummyTextInput}
            classMap={classMap}
          />
        </>,
      ),
    ).not.toThrow();
  });
});
