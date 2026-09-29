/// <reference types="cypress" />

import React from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type ComponentLibrary = {
  Button: typeof Core.Button;
  Dropdown: typeof Core.Dropdown;
};

const TestIcon = ({
  className,
  "aria-hidden": ariaHidden,
  focusable,
}: {
  className?: string;
  "aria-hidden"?: boolean;
  focusable?: boolean;
}) => (
  <svg
    className={className}
    aria-hidden={ariaHidden}
    focusable={focusable}
    viewBox="0 0 16 16"
  >
    <circle cx="8" cy="8" r="6" />
  </svg>
);

const runEventCompositionTests = (
  flavor: "core" | "next",
  library: ComponentLibrary,
) => {
  describe(`${flavor} event composition`, () => {
    it("runs Dropdown consumer key handling without losing navigation", () => {
      const onKeyDown = cy.stub().as(`${flavor}DropdownKeyDown`);
      cy.mount(
        <library.Dropdown
          triggerIcon={TestIcon}
          items={[
            { label: "First", "data-testid": "dropdown-first" },
            { label: "Second", "data-testid": "dropdown-second" },
          ]}
          onKeyDown={onKeyDown}
          aria-label="Actions"
          data-testid="dropdown"
        />,
      );

      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown-first"]').should("be.focused");
      cy.get('[data-testid="dropdown"]').trigger("keydown", {
        key: "ArrowDown",
      });

      cy.get(`@${flavor}DropdownKeyDown`).should("have.been.calledOnce");
      cy.get('[data-testid="dropdown-second"]').should("be.focused");
    });

    it("lets Dropdown consumers cancel Boreal navigation", () => {
      const onKeyDown = cy
        .stub()
        .callsFake((event: React.KeyboardEvent<HTMLDivElement>) => {
          event.preventDefault();
        })
        .as(`${flavor}DropdownCanceledKeyDown`);
      cy.mount(
        <library.Dropdown
          triggerIcon={TestIcon}
          items={[
            { label: "First", "data-testid": "dropdown-first" },
            { label: "Second", "data-testid": "dropdown-second" },
          ]}
          onKeyDown={onKeyDown}
          aria-label="Actions"
          data-testid="dropdown"
        />,
      );

      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown"]').trigger("keydown", {
        key: "ArrowDown",
      });

      cy.get(`@${flavor}DropdownCanceledKeyDown`).should(
        "have.been.calledOnce",
      );
      cy.get('[data-testid="dropdown-first"]').should("be.focused");
    });

    it("composes polymorphic Button Enter and Space activation", () => {
      const onKeyDown = cy.stub().as(`${flavor}ButtonKeyDown`);
      const onClick = cy.stub().as(`${flavor}ButtonClick`);
      cy.mount(
        <library.Button
          as="div"
          onKeyDown={onKeyDown}
          onClick={onClick}
          data-testid="custom-button"
        >
          Custom action
        </library.Button>,
      );

      cy.get('[data-testid="custom-button"]')
        .should("have.attr", "role", "button")
        .focus()
        .trigger("keydown", { key: "Enter" })
        .trigger("keydown", { key: " " });

      cy.get(`@${flavor}ButtonKeyDown`).should("have.callCount", 2);
      cy.get(`@${flavor}ButtonClick`).should("have.callCount", 2);
    });

    it("lets polymorphic Button consumers cancel emulated activation", () => {
      const onClick = cy.stub().as(`${flavor}CanceledButtonClick`);
      const onKeyDown = cy
        .stub()
        .callsFake((event: React.KeyboardEvent<HTMLElement>) => {
          event.preventDefault();
        })
        .as(`${flavor}CanceledButtonKeyDown`);
      cy.mount(
        <library.Button
          as="div"
          onKeyDown={onKeyDown}
          onClick={onClick}
          data-testid="custom-button"
        >
          Custom action
        </library.Button>,
      );

      cy.get('[data-testid="custom-button"]')
        .focus()
        .trigger("keydown", { key: "Enter" });

      cy.get(`@${flavor}CanceledButtonKeyDown`).should("have.been.calledOnce");
      cy.get(`@${flavor}CanceledButtonClick`).should("not.have.been.called");
    });

    it("does not add emulated activation to native buttons", () => {
      const onClick = cy.stub().as(`${flavor}NativeButtonClick`);
      cy.mount(
        <library.Button onClick={onClick} data-testid="native-button">
          Native action
        </library.Button>,
      );

      cy.get('[data-testid="native-button"]')
        .focus()
        .trigger("keydown", { key: "Enter" });
      cy.get(`@${flavor}NativeButtonClick`).should("not.have.been.called");

      cy.get('[data-testid="native-button"]').click();
      cy.get(`@${flavor}NativeButtonClick`).should("have.been.calledOnce");
    });
  });
};

runEventCompositionTests("core", Core);
runEventCompositionTests("next", Next);
