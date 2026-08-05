/// <reference types="cypress" />

import React from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";
import type { IconType } from "react-icons";

type BadgeComponent = React.ComponentType<any>;

const TestIcon: IconType = ({ className, ...props }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    width="16"
    height="16"
    {...props}
  >
    <circle cx="8" cy="8" r="6" />
  </svg>
);

const mountBadge = (
  Badge: BadgeComponent,
  props: Record<string, unknown> = {},
  wrapperStyle: React.CSSProperties = {},
) => {
  cy.mount(
    <div
      data-cy="badge-test-root"
      style={{
        minHeight: 180,
        padding: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "relative",
        ...wrapperStyle,
      }}
    >
      <Badge data-testid="badge" {...props}>
        {props.children ?? "New"}
      </Badge>
    </div>,
  );
};

const getBadge = (testId = "badge") => cy.get(`[data-testid="${testId}-main"]`);

const getBadgeIcon = (testId = "badge") =>
  cy.get(`[data-testid="${testId}-icon"]`);

const runSharedBadgeTests = (
  flavor: "core" | "next",
  Badge: BadgeComponent,
) => {
  describe(`${flavor} Badge shared behavior`, () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    it("renders text content as a status span by default", () => {
      mountBadge(Badge, {
        children: "Beta",
      });

      getBadge()
        .should("exist")
        .and("match", "span")
        .and("have.attr", "role", "status")
        .and("have.attr", "aria-label", "Beta")
        .and("have.attr", "title", "Beta")
        .and("contain.text", "Beta");
    });

    it("does not render when children and icon are both missing", () => {
      cy.mount(
        <div data-cy="badge-test-root">
          <Badge data-testid="badge" />
        </div>,
      );

      getBadge().should("not.exist");
    });

    it("renders icon-only badges when an accessible label is provided", () => {
      mountBadge(Badge, {
        children: null,
        icon: TestIcon,
        "aria-label": "Unread notifications",
      });

      getBadge()
        .should("exist")
        .and("have.attr", "aria-label", "Unread notifications");

      getBadgeIcon()
        .should("exist")
        .and("have.attr", "aria-hidden", "true")
        .and("have.attr", "focusable", "false");
    });

    it("renders an icon beside content", () => {
      mountBadge(Badge, {
        children: "Featured",
        icon: TestIcon,
      });

      getBadge().should("contain.text", "Featured");
      getBadgeIcon().should("exist");
    });

    it("uses aria-label over text content for the accessible label and title fallback", () => {
      mountBadge(Badge, {
        children: "99+",
        "aria-label": "99 unread messages",
      });

      getBadge()
        .should("have.attr", "aria-label", "99 unread messages")
        .and("have.attr", "title", "99 unread messages");
    });

    it("uses explicit title over accessible label for the title attribute", () => {
      mountBadge(Badge, {
        children: "99+",
        "aria-label": "99 unread messages",
        title: "Messages",
      });

      getBadge()
        .should("have.attr", "aria-label", "99 unread messages")
        .and("have.attr", "title", "Messages");
    });

    it("supports aria-labelledby and aria-describedby", () => {
      cy.mount(
        <div data-cy="badge-test-root">
          <span id="badge-label">External badge label</span>
          <span id="badge-description">External badge description</span>

          <Badge
            data-testid="badge"
            aria-labelledby="badge-label"
            aria-describedby="badge-description"
          >
            Beta
          </Badge>
        </div>,
      );

      getBadge()
        .should("have.attr", "aria-labelledby", "badge-label")
        .and("have.attr", "aria-describedby", "badge-description");
    });

    it("supports aria-live and aria-atomic for dynamic badge updates", () => {
      mountBadge(Badge, {
        children: "Saving",
        "aria-live": "polite",
        "aria-atomic": true,
      });

      getBadge()
        .should("have.attr", "aria-live", "polite")
        .and("have.attr", "aria-atomic", "true");
    });

    it("allows overriding the default role", () => {
      mountBadge(Badge, {
        children: "Important note",
        role: "note",
      });

      getBadge().should("have.attr", "role", "note");
    });

    it("supports custom tabIndex on non-interactive badges", () => {
      mountBadge(Badge, {
        children: "Focusable badge",
        tabIndex: 0,
      });

      getBadge().should("have.attr", "tabindex", "0");
    });

    it("renders as a button when onClick is provided", () => {
      const onClick = cy.stub().as("onClick");

      mountBadge(Badge, {
        children: "Click me",
        onClick,
      });

      getBadge().should("match", "button").and("have.attr", "type", "button");

      getBadge().click();

      cy.get("@onClick").should("have.been.calledOnce");
    });

    it("disables button badges and prevents click handlers", () => {
      const onClick = cy.stub().as("onClick");

      mountBadge(Badge, {
        children: "Disabled",
        disabled: true,
        onClick,
      });

      getBadge().should("match", "button").and("be.disabled");

      getBadge().click({ force: true });

      cy.get("@onClick").should("not.have.been.called");
    });

    it("renders as an internal link when href is provided", () => {
      const onClick = cy.stub().as("onClick");

      mountBadge(Badge, {
        children: "Docs",
        href: "/docs",
        onClick: (
          event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
        ) => {
          event.preventDefault();
          onClick(event);
        },
      });

      getBadge().should(($badge) => {
        expect($badge[0].tagName.toLowerCase()).to.equal("a");
        expect($badge).to.have.attr("href", "/docs");
        expect($badge).not.to.have.attr("target");
        expect($badge).not.to.have.attr("rel");
      });

      getBadge().click();

      cy.get("@onClick").should("have.been.calledOnce");
    });

    it("renders external links with safe defaults", () => {
      mountBadge(Badge, {
        children: "Website",
        href: "https://example.com",
      });

      getBadge()
        .should("match", "a")
        .and("have.attr", "href", "https://example.com")
        .and("have.attr", "target", "_blank")
        .and("have.attr", "rel", "noopener noreferrer");
    });

    it("respects explicit target and rel values for links", () => {
      mountBadge(Badge, {
        children: "External",
        href: "https://example.com",
        target: "_self",
        rel: "nofollow",
      });

      getBadge()
        .should("have.attr", "target", "_self")
        .and("have.attr", "rel", "nofollow");
    });

    it("marks disabled links as aria-disabled, removes href, and prevents click handlers", () => {
      const onClick = cy.stub().as("onClick");

      mountBadge(Badge, {
        children: "Disabled link",
        href: "/docs",
        disabled: true,
        onClick,
      });

      getBadge().should(($badge) => {
        expect($badge[0].tagName.toLowerCase()).to.equal("a");
        expect($badge).not.to.have.attr("href");
        expect($badge).to.have.attr("aria-disabled", "true");
        expect($badge).to.have.attr("tabindex", "-1");
        expect($badge).not.to.have.attr("target");
        expect($badge).not.to.have.attr("rel");
      });

      getBadge().click({ force: true });

      cy.get("@onClick").should("not.have.been.called");
    });

    it("supports custom testId", () => {
      cy.mount(
        <div data-cy="badge-test-root">
          <Badge testId="custom-badge">Custom</Badge>
        </div>,
      );

      getBadge("custom-badge").should("exist").and("contain.text", "Custom");
    });

    it("supports data-testid as a backward-compatible test id alias", () => {
      mountBadge(Badge, {
        "data-testid": "data-badge",
        children: "Alias",
      });

      cy.get('[data-testid="data-badge-main"]')
        .should("exist")
        .and("contain.text", "Alias");
    });

    it("applies a custom className to the rendered element", () => {
      mountBadge(Badge, {
        children: "Styled",
        className: "custom-badge-class",
      });

      getBadge().should("have.class", "custom-badge-class");
    });

    it("supports all theme variants", () => {
      const themes = [
        "primary",
        "secondary",
        "tertiary",
        "quaternary",
        "clear",
      ] as const;

      cy.mount(
        <div data-cy="badge-test-root">
          {themes.map((theme) => (
            <Badge key={theme} theme={theme} testId={`badge-${theme}`}>
              {theme}
            </Badge>
          ))}
        </div>,
      );

      themes.forEach((theme) => {
        getBadge(`badge-${theme}`).should("exist").and("contain.text", theme);
      });
    });

    it("supports all state variants", () => {
      const states = ["success", "error", "warning"] as const;

      cy.mount(
        <div data-cy="badge-test-root">
          {states.map((state) => (
            <Badge key={state} state={state} testId={`badge-${state}`}>
              {state}
            </Badge>
          ))}
        </div>,
      );

      states.forEach((state) => {
        getBadge(`badge-${state}`).should("exist").and("contain.text", state);
      });
    });

    it("supports all size variants", () => {
      const sizes = ["xs", "small", "medium", "large", "xl"] as const;

      cy.mount(
        <div data-cy="badge-test-root">
          {sizes.map((size) => (
            <Badge key={size} size={size} testId={`badge-${size}`}>
              {size}
            </Badge>
          ))}
        </div>,
      );

      sizes.forEach((size) => {
        getBadge(`badge-${size}`).should("exist").and("contain.text", size);
      });
    });

    it("supports all rounding variants", () => {
      const roundings = ["none", "small", "medium", "large", "full"] as const;

      cy.mount(
        <div data-cy="badge-test-root">
          {roundings.map((rounding) => (
            <Badge
              key={rounding}
              rounding={rounding}
              testId={`badge-${rounding}`}
            >
              {rounding}
            </Badge>
          ))}
        </div>,
      );

      roundings.forEach((rounding) => {
        getBadge(`badge-${rounding}`)
          .should("exist")
          .and("contain.text", rounding);
      });
    });

    it("supports all shadow variants", () => {
      const shadows = ["none", "light", "medium", "strong", "intense"] as const;

      cy.mount(
        <div data-cy="badge-test-root">
          {shadows.map((shadow) => (
            <Badge key={shadow} shadow={shadow} testId={`badge-${shadow}`}>
              {shadow}
            </Badge>
          ))}
        </div>,
      );

      shadows.forEach((shadow) => {
        getBadge(`badge-${shadow}`).should("exist").and("contain.text", shadow);
      });
    });

    it("supports visual props without breaking interaction", () => {
      const onClick = cy.stub().as("onClick");

      mountBadge(Badge, {
        children: "Interactive",
        theme: "secondary",
        state: "success",
        size: "large",
        rounding: "large",
        shadow: "strong",
        variant: "glassOutline",
        onClick,
      });

      getBadge().click();

      cy.get("@onClick").should("have.been.calledOnce");
      getBadge().should("contain.text", "Interactive");
    });

    it("passes through valid native span attributes", () => {
      mountBadge(Badge, {
        children: "Native",
        id: "native-badge",
        "data-custom": "custom-value",
      });

      getBadge()
        .should("have.attr", "id", "native-badge")
        .and("have.attr", "data-custom", "custom-value");
    });

    it("passes through valid native button attributes", () => {
      mountBadge(Badge, {
        children: "Submit",
        onClick: cy.stub(),
        name: "badge-button",
        value: "badge-value",
      });

      getBadge()
        .should("match", "button")
        .and("have.attr", "name", "badge-button")
        .and("have.attr", "value", "badge-value");
    });

    it("passes through valid native anchor attributes", () => {
      mountBadge(Badge, {
        children: "Download",
        href: "/download",
        download: true,
      });

      getBadge().should("match", "a").and("have.attr", "download");
    });
  });
};

const runCoreOnlyBadgeTests = (Badge: BadgeComponent) => {
  describe("core Badge implementation-specific behavior", () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    it("applies expected core BEM classes for visual props", () => {
      mountBadge(Badge, {
        children: "Core",
        theme: "secondary",
        state: "success",
        size: "large",
        rounding: "large",
        shadow: "strong",
        variant: "glassOutline",
        onClick: cy.stub(),
      });

      getBadge()
        .should("have.class", "badge")
        .and("have.class", "badge_secondary")
        .and("have.class", "badge_success")
        .and("have.class", "badge_large")
        .and("have.class", "badge_round-Large")
        .and("have.class", "badge_shadow-Strong")
        .and("have.class", "badge_outline")
        .and("have.class", "badge_glass")
        .and("have.class", "badge_clickable");
    });

    it("applies expected core disabled class", () => {
      mountBadge(Badge, {
        children: "Disabled",
        disabled: true,
      });

      getBadge().should("have.class", "badge_disabled");
    });

    it("applies expected core icon class", () => {
      mountBadge(Badge, {
        children: "Icon",
        icon: TestIcon,
      });

      getBadgeIcon().should("have.class", "badge_icon");
    });

    it("does not apply clickable class for href-only badges unless onClick is provided", () => {
      mountBadge(Badge, {
        children: "Docs",
        href: "/docs",
      });

      getBadge().should("not.have.class", "badge_clickable");
    });

    it("applies clickable class when an onClick handler is provided to a link badge", () => {
      mountBadge(Badge, {
        children: "Docs",
        href: "/docs",
        onClick: cy.stub(),
      });

      getBadge().should("have.class", "badge_clickable");
    });
  });
};

const runNextOnlyBadgeTests = (Badge: BadgeComponent) => {
  describe("next Badge wrapper behavior", () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    it("mounts the Next Badge wrapper without crashing", () => {
      cy.mount(
        <div data-cy="badge-test-root">
          <Badge testId="badge">Next Badge</Badge>
        </div>,
      );

      getBadge().should("exist").and("contain.text", "Next Badge");
    });

    it("renders a Next Badge link with the expected accessibility attributes", () => {
      cy.mount(
        <div data-cy="badge-test-root">
          <Badge href="/docs" testId="badge" aria-label="Open docs">
            Docs
          </Badge>
        </div>,
      );

      getBadge()
        .should("exist")
        .and("match", "a")
        .and("have.attr", "href", "/docs")
        .and("have.attr", "aria-label", "Open docs");
    });

    it("marks disabled links as aria-disabled and prevents click handlers", () => {
      const onClick = cy.stub().as("onClick");

      cy.mount(
        <div data-cy="badge-test-root">
          <Badge href="/docs" disabled onClick={onClick} testId="badge">
            Disabled docs
          </Badge>
        </div>,
      );

      getBadge().should(($badge) => {
        expect($badge[0].tagName.toLowerCase()).to.equal("a");
        expect($badge).not.to.have.attr("href");
        expect($badge).to.have.attr("aria-disabled", "true");
        expect($badge).to.have.attr("tabindex", "-1");
        expect($badge).not.to.have.attr("target");
        expect($badge).not.to.have.attr("rel");
      });

      getBadge().click({ force: true });

      cy.get("@onClick").should("not.have.been.called");
    });
  });
};

runSharedBadgeTests("core", Core.Badge);
runCoreOnlyBadgeTests(Core.Badge);

runSharedBadgeTests("next", Next.Badge);
runNextOnlyBadgeTests(Next.Badge);
