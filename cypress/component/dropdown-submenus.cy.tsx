/// <reference types="cypress" />

import React from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type DropdownComponent = typeof Core.Dropdown;

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

const mountDropdown = (
  Dropdown: DropdownComponent,
  props: Partial<React.ComponentProps<DropdownComponent>> = {},
  wrapperStyle: React.CSSProperties = {},
) => {
  const defaultItems: React.ComponentProps<DropdownComponent>["items"] = [
    {
      label: "Profile",
      "data-testid": "dropdown-profile",
      onClick: cy.stub().as("profileClick"),
    },
    {
      label: "Settings",
      "data-testid": "dropdown-settings",
      submenuAriaLabel: "Settings sections",
      items: [
        {
          label: "Account settings",
          "data-testid": "dropdown-account-settings",
          onClick: cy.stub().as("accountClick"),
        },
        {
          label: "Workspace settings",
          "data-testid": "dropdown-workspace-settings",
          onClick: cy.stub().as("workspaceClick"),
        },
        {
          label: "Advanced",
          "data-testid": "dropdown-advanced",
          submenuAriaLabel: "Advanced settings",
          items: [
            {
              label: "API access",
              "data-testid": "dropdown-api-access",
              onClick: cy.stub().as("apiClick"),
            },
            {
              label: "Audit log",
              "data-testid": "dropdown-audit-log",
              onClick: cy.stub().as("auditClick"),
            },
          ],
        },
      ],
    },
    {
      label: "Logout",
      "data-testid": "dropdown-logout",
      onClick: cy.stub().as("logoutClick"),
    },
  ];

  cy.mount(
    <div
      style={{
        minHeight: 360,
        padding: 24,
        ...wrapperStyle,
      }}
    >
      <Dropdown
        triggerIcon={TestIcon}
        items={defaultItems}
        aria-label="Project actions"
        data-testid="dropdown"
        {...props}
      />
    </div>,
  );
};

const assertWithinViewport = (selector: string) => {
  cy.get(selector).then(($element) => {
    const rect = $element[0].getBoundingClientRect();
    const elementWindow = $element[0].ownerDocument.defaultView;
    const viewportWidth =
      elementWindow?.innerWidth ?? Cypress.config("viewportWidth");
    const viewportHeight =
      elementWindow?.innerHeight ?? Cypress.config("viewportHeight");

    expect(rect.left).to.be.at.least(0);
    expect(rect.top).to.be.at.least(0);
    expect(rect.right).to.be.at.most(viewportWidth);
    expect(rect.bottom).to.be.at.most(viewportHeight);
  });
};

const runDropdownSubmenuTests = (
  flavor: "core" | "next",
  Dropdown: DropdownComponent,
) => {
  describe(`${flavor} Dropdown submenu behavior`, () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    it("opens nested submenus, exposes submenu ARIA, and closes after child selection", () => {
      mountDropdown(Dropdown);

      cy.get('[data-testid="dropdown-trigger"]').as("trigger").click();

      cy.get('[data-testid="dropdown-menu"]')
        .should("be.visible")
        .and("have.attr", "aria-label", "Project actions");
      cy.get("@trigger").should("have.attr", "aria-expanded", "true");

      cy.get('[data-testid="dropdown-settings"]')
        .as("settings")
        .should("have.attr", "aria-haspopup", "menu")
        .and("have.attr", "aria-expanded", "false")
        .click();

      cy.get("@settings")
        .should("have.attr", "aria-expanded", "true")
        .invoke("attr", "aria-controls")
        .then((submenuId) => {
          expect(submenuId).to.be.a("string").and.not.be.empty;
          cy.get(`#${submenuId}`)
            .should("be.visible")
            .and("have.attr", "aria-label", "Settings sections");
        });

      cy.get('[data-testid="dropdown-account-settings"]').click();

      cy.get("@accountClick").should("have.been.calledOnce");
      cy.get('[data-testid="dropdown-menu"]').should("not.exist");
      cy.get("@trigger").should("have.attr", "aria-expanded", "false");
    });

    it("supports keyboard navigation into and out of nested submenu panels", () => {
      mountDropdown(Dropdown);

      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown-profile"]').should("be.focused");

      cy.focused().type("{downArrow}");
      cy.get('[data-testid="dropdown-settings"]').should("be.focused");

      cy.focused().type("{rightArrow}");
      cy.get('[data-testid="dropdown-account-settings"]').should("be.focused");

      cy.focused().type("{downArrow}");
      cy.get('[data-testid="dropdown-workspace-settings"]').should(
        "be.focused",
      );

      cy.focused().type("{downArrow}");
      cy.get('[data-testid="dropdown-advanced"]').should("be.focused");

      cy.focused().type("{rightArrow}");
      cy.get('[data-testid="dropdown-api-access"]').should("be.focused");
      cy.get('[data-testid="dropdown-advanced-submenu"]')
        .should("be.visible")
        .and("have.attr", "aria-label", "Advanced settings");

      cy.focused().type("{leftArrow}");
      cy.get('[data-testid="dropdown-advanced"]').should("be.focused");
      cy.get('[data-testid="dropdown-advanced-submenu"]').should("not.exist");

      cy.focused().type("{leftArrow}");
      cy.get('[data-testid="dropdown-settings"]').should("be.focused");
      cy.get('[data-testid="dropdown-settings-submenu"]').should("not.exist");

      cy.focused().type("{esc}");
      cy.get('[data-testid="dropdown-menu"]').should("not.exist");
      cy.get('[data-testid="dropdown-trigger"]').should("be.focused");
    });

    it("keeps disabled submenu triggers inert and selectable siblings working", () => {
      mountDropdown(Dropdown, {
        items: [
          {
            label: "Locked settings",
            disabled: true,
            "data-testid": "dropdown-locked-settings",
            items: [
              {
                label: "Hidden child",
                "data-testid": "dropdown-hidden-child",
                onClick: cy.stub().as("hiddenClick"),
              },
            ],
          },
          {
            label: "Available action",
            "data-testid": "dropdown-available-action",
            onClick: cy.stub().as("availableClick"),
          },
        ],
      });

      cy.get('[data-testid="dropdown-trigger"]').click();

      cy.get('[data-testid="dropdown-locked-settings"]')
        .should("have.attr", "aria-disabled", "true")
        .and("be.disabled")
        .parent('[data-dropdown-item-wrapper="true"]')
        .trigger("mouseenter");

      cy.get('[data-testid="dropdown-hidden-child"]').should("not.exist");

      cy.get('[data-testid="dropdown-available-action"]').click();
      cy.get("@availableClick").should("have.been.calledOnce");
      cy.get("@hiddenClick").should("not.have.been.called");
    });

    it("flips submenus away from the right viewport edge and constrains panel size", () => {
      const viewportWidth = 640;
      const viewportHeight = 480;

      cy.viewport(viewportWidth, viewportHeight);

      mountDropdown(
        Dropdown,
        {
          align: "right",
          focusFirstItemOnOpen: false,
          items: [
            {
              label: "Export",
              "data-testid": "dropdown-export",
              items: [
                {
                  label: "CSV",
                  "data-testid": "dropdown-export-csv",
                  onClick: cy.stub().as("csvClick"),
                },
                {
                  label: "Developer formats",
                  "data-testid": "dropdown-developer-formats",
                  items: [
                    {
                      label: "JSON",
                      "data-testid": "dropdown-export-json",
                      onClick: cy.stub().as("jsonClick"),
                    },
                    {
                      label: "XML",
                      "data-testid": "dropdown-export-xml",
                      onClick: cy.stub().as("xmlClick"),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          position: "fixed",
          top: 16,
          right: 8,
          minHeight: viewportHeight,
          padding: 0,
        },
      );

      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown-menu"]')
        .should("be.visible")
        .and(($menu) => {
          const maxWidth = parseFloat($menu.css("max-width"));
          const maxHeight = parseFloat($menu.css("max-height"));

          expect(maxWidth).to.be.at.least(160);
          expect(maxWidth).to.be.at.most(viewportWidth - 16);
          expect(maxHeight).to.be.at.least(120);
          expect(maxHeight).to.be.at.most(viewportHeight - 16);
        });
      assertWithinViewport('[data-testid="dropdown-menu"]');

      cy.get('[data-testid="dropdown-export"]').click();
      cy.get('[data-testid="dropdown-export-submenu"]')
        .should("be.visible")
        .and("have.attr", "data-placement", "left");
      assertWithinViewport('[data-testid="dropdown-export-submenu"]');

      cy.get('[data-testid="dropdown-developer-formats"]').click();
      cy.get('[data-testid="dropdown-developer-formats-submenu"]')
        .should("be.visible")
        .and("have.attr", "data-placement", "left");
      assertWithinViewport(
        '[data-testid="dropdown-developer-formats-submenu"]',
      );
    });

    it("keeps flipped submenus open while moving from a trigger into child content", () => {
      cy.viewport(640, 480);

      mountDropdown(
        Dropdown,
        {
          align: "right",
          focusFirstItemOnOpen: false,
          items: [
            {
              label: "Export",
              "data-testid": "dropdown-export",
              items: [
                {
                  label: "Developer formats",
                  "data-testid": "dropdown-developer-formats",
                  items: [
                    {
                      label: "JSON",
                      "data-testid": "dropdown-export-json",
                      onClick: cy.stub().as("jsonClick"),
                    },
                  ],
                },
              ],
            },
            {
              label: "Archive",
              "data-testid": "dropdown-archive",
              onClick: cy.stub().as("archiveClick"),
            },
          ],
        },
        {
          position: "fixed",
          top: 16,
          right: 8,
          padding: 0,
        },
      );

      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown-menu"]').then(($menu) => {
        const rect = $menu[0].getBoundingClientRect();
        cy.wrap({ left: rect.left, top: rect.top }).as("rootMenuPosition");
      });

      cy.get('[data-testid="dropdown-export"]')
        .trigger("mouseover")
        .should("have.attr", "aria-expanded", "true");
      cy.get('[data-testid="dropdown-export-submenu"]')
        .should("be.visible")
        .and("have.attr", "data-placement", "left");
      cy.get("@rootMenuPosition").then((position) => {
        const { left, top } = position as unknown as {
          left: number;
          top: number;
        };

        cy.get('[data-testid="dropdown-menu"]').then(($menu) => {
          const rect = $menu[0].getBoundingClientRect();
          expect(rect.left).to.be.closeTo(left, 0.5);
          expect(rect.top).to.be.closeTo(top, 0.5);
        });
      });

      cy.get('[data-testid="dropdown-developer-formats"]')
        .trigger("mouseover")
        .should("have.attr", "aria-expanded", "true");
      cy.get('[data-testid="dropdown-developer-formats-submenu"]')
        .should("be.visible")
        .and("have.attr", "data-placement", "left");
      cy.get("@rootMenuPosition").then((position) => {
        const { left, top } = position as unknown as {
          left: number;
          top: number;
        };

        cy.get('[data-testid="dropdown-menu"]').then(($menu) => {
          const rect = $menu[0].getBoundingClientRect();
          expect(rect.left).to.be.closeTo(left, 0.5);
          expect(rect.top).to.be.closeTo(top, 0.5);
        });
      });

      cy.get('[data-testid="dropdown-developer-formats-submenu"]').trigger(
        "mouseover",
      );
      cy.get('[data-testid="dropdown-export-submenu"]').should("be.visible");
      cy.get('[data-testid="dropdown-developer-formats-submenu"]').should(
        "be.visible",
      );

      cy.get('[data-testid="dropdown-archive"]').trigger("mouseover");
      cy.get('[data-testid="dropdown-export-submenu"]').should("not.exist");

      cy.get('[data-testid="dropdown-export"]')
        .trigger("mouseover")
        .should("have.attr", "aria-expanded", "true");
      cy.get('[data-testid="dropdown-developer-formats"]')
        .trigger("mouseover")
        .should("have.attr", "aria-expanded", "true");
      cy.get('[data-testid="dropdown-developer-formats-submenu"]').should(
        "be.visible",
      );

      cy.get('[data-testid="dropdown-export"]').trigger("mouseover");
      cy.get('[data-testid="dropdown-export-submenu"]').should("be.visible");
      cy.get('[data-testid="dropdown-developer-formats-submenu"]').should(
        "not.exist",
      );

      cy.get('[data-testid="dropdown-developer-formats"]').trigger(
        "mouseover",
      );
      cy.get('[data-testid="dropdown-developer-formats-submenu"]').should(
        "be.visible",
      );

      cy.get('[data-testid="dropdown-export"]').trigger("mouseleave");
      cy.get('[data-testid="dropdown-export-submenu"]').should("be.visible");
      cy.get('[data-testid="dropdown-developer-formats-submenu"]').should(
        "be.visible",
      );

      cy.get('[data-testid="dropdown-export-json"]')
        .should("be.visible")
        .click();

      cy.get("@jsonClick").should("have.been.calledOnce");
      cy.get('[data-testid="dropdown-menu"]').should("not.exist");
    });

    it("uses stacked submenu panels on narrow mobile viewports", () => {
      cy.viewport(390, 520);

      mountDropdown(Dropdown);

      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown-settings"]').click();

      cy.get('[data-testid="dropdown-settings-submenu"]')
        .should("be.visible")
        .and("have.css", "position", "static");

      cy.get('[data-testid="dropdown-advanced"]')
        .scrollIntoView()
        .click({ force: true });
      cy.get('[data-testid="dropdown-advanced-submenu"]')
        .should("be.visible")
        .and("have.css", "position", "static");
    });

    it("keeps stacked mobile menus stable while scrolling nested content", () => {
      cy.viewport(390, 520);

      mountDropdown(
        Dropdown,
        {
          focusFirstItemOnOpen: false,
          items: [
            {
              label: "Settings",
              "data-testid": "dropdown-mobile-settings",
              items: [
                ...Array.from({ length: 14 }, (_, index) => ({
                  label: `Mobile action ${index + 1}`,
                  "data-testid": `dropdown-mobile-action-${index + 1}`,
                  onClick: cy.stub().as(`mobileAction${index + 1}`),
                })),
                {
                  label: "Advanced",
                  "data-testid": "dropdown-mobile-advanced",
                  items: Array.from({ length: 8 }, (_, index) => ({
                    label: `Advanced action ${index + 1}`,
                    "data-testid": `dropdown-mobile-advanced-action-${index + 1}`,
                    onClick: cy.stub().as(`mobileAdvancedAction${index + 1}`),
                  })),
                },
              ],
            },
          ],
        },
        {
          minHeight: 620,
        },
      );

      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown-mobile-settings"]').click();
      cy.get('[data-testid="dropdown-mobile-advanced"]')
        .scrollIntoView()
        .click({ force: true });

      cy.get('[data-testid="dropdown-menu"]').then(($menu) => {
        const rect = $menu[0].getBoundingClientRect();
        cy.wrap({ left: rect.left, top: rect.top }).as("mobileMenuPosition");
      });

      cy.get('[data-testid="dropdown-menu"]').scrollTo("bottom", {
        ensureScrollable: false,
      });

      cy.get("@mobileMenuPosition").then((position) => {
        const { left, top } = position as unknown as {
          left: number;
          top: number;
        };

        cy.get('[data-testid="dropdown-menu"]').then(($menu) => {
          const rect = $menu[0].getBoundingClientRect();
          expect(rect.left).to.be.closeTo(left, 0.5);
          expect(rect.top).to.be.closeTo(top, 0.5);
        });
      });

      cy.get('[data-testid="dropdown-mobile-settings-submenu"]').should(
        "be.visible",
      );
      cy.get('[data-testid="dropdown-mobile-advanced-submenu"]').should(
        "be.visible",
      );
    });

    it("preserves link item behavior inside submenus", () => {
      mountDropdown(Dropdown, {
        closeOnSelect: false,
        items: [
          {
            label: "Resources",
            "data-testid": "dropdown-resources",
            items: [
              {
                label: "Docs",
                href: "/docs",
                target: "_blank",
                "data-testid": "dropdown-docs",
                onClick: cy.stub().as("docsClick"),
              },
            ],
          },
        ],
      });

      cy.get('[data-testid="dropdown-trigger"]').click();
      cy.get('[data-testid="dropdown-resources"]').click();

      cy.get('[data-testid="dropdown-docs"]')
        .should("have.attr", "href", "/docs")
        .and("have.attr", "target", "_blank")
        .and("have.attr", "rel", "noopener noreferrer")
        .then(($link) => {
          $link[0].addEventListener("click", (event) => event.preventDefault());
        });

      cy.get('[data-testid="dropdown-docs"]')
        .scrollIntoView()
        .click({ force: true });

      cy.get("@docsClick").should("have.been.calledOnce");
      cy.get('[data-testid="dropdown-menu"]').should("be.visible");
    });
  });
};

runDropdownSubmenuTests("core", Core.Dropdown);
runDropdownSubmenuTests("next", Next.Dropdown);
