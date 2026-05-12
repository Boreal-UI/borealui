/// <reference types="cypress" />

import React, { forwardRef } from "react";
import * as Core from "../../src/index.core";
import * as Next from "../../src/index.next";

type AvatarComponent = typeof Core.Avatar;

const VALID_AVATAR_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23000'/%3E%3C/svg%3E";

const TestStatusIcon = () => (
  <span data-testid="custom-status-icon" aria-hidden="true">
    ★
  </span>
);

const TestFallback = () => (
  <span data-testid="custom-fallback" aria-hidden="true">
    Fallback
  </span>
);

const TestChildContent = () => (
  <span data-testid="custom-avatar-child">Child content</span>
);

const mountAvatar = (
  Avatar: AvatarComponent,
  props: Partial<React.ComponentProps<AvatarComponent>> = {},
  wrapperStyle: React.CSSProperties = {},
) => {
  cy.mount(
    <div
      data-cy="avatar-test-root"
      style={{
        minHeight: 260,
        padding: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "relative",
        ...wrapperStyle,
      }}
    >
      <Avatar
        name="Ada Lovelace"
        alt="Ada profile photo"
        data-testid="avatar"
        {...props}
      />
    </div>,
  );
};

const getAvatar = (testId = "avatar") =>
  cy.get(`[data-testid="${testId}-main"]`);

const getImage = (testId = "avatar") =>
  cy.get(`[data-testid="${testId}-image"]`);

const getInitials = (testId = "avatar") =>
  cy.get(`[data-testid="${testId}-initials"]`);

const getStatus = (testId = "avatar") =>
  cy.get(`[data-testid="${testId}-status"]`);

const getStatusLabel = (testId = "avatar") =>
  cy.get(`[data-testid="${testId}-status-label"]`);

const runSharedAvatarTests = (
  flavor: "core" | "next",
  Avatar: AvatarComponent,
) => {
  describe(`${flavor} Avatar shared behavior`, () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    it("applies a custom className to the root element", () => {
      mountAvatar(Avatar, {
        className: "custom-avatar-class",
      });

      getAvatar().should("have.class", "custom-avatar-class");
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
        <div data-cy="avatar-test-root">
          {themes.map((theme) => (
            <Avatar
              key={theme}
              name="Ada Lovelace"
              theme={theme}
              testId={`avatar-${theme}`}
            />
          ))}
        </div>,
      );

      themes.forEach((theme) => {
        getAvatar(`avatar-${theme}`).should("exist");
      });
    });

    it("supports all state variants", () => {
      const states = ["success", "error", "warning"] as const;

      cy.mount(
        <div data-cy="avatar-test-root">
          {states.map((state) => (
            <Avatar
              key={state}
              name="Ada Lovelace"
              state={state}
              testId={`avatar-${state}`}
            />
          ))}
        </div>,
      );

      states.forEach((state) => {
        getAvatar(`avatar-${state}`).should("exist");
      });
    });

    it("supports all shadow variants", () => {
      const shadows = ["none", "light", "medium", "strong", "intense"] as const;

      cy.mount(
        <div data-cy="avatar-test-root">
          {shadows.map((shadow) => (
            <Avatar
              key={shadow}
              name="Ada Lovelace"
              shadow={shadow}
              testId={`avatar-${shadow}`}
            />
          ))}
        </div>,
      );

      shadows.forEach((shadow) => {
        getAvatar(`avatar-${shadow}`).should("exist");
      });
    });

    it("renders as a button by default with an accessible name", () => {
      mountAvatar(Avatar);

      getAvatar()
        .should("exist")
        .and("match", "button")
        .and("have.attr", "type", "button")
        .and("have.attr", "aria-label", "Ada profile photo");

      getInitials()
        .should("exist")
        .and("have.attr", "title", "Ada profile photo")
        .and("have.text", "AL");
    });

    it("uses label before alt and name for computed labeling", () => {
      mountAvatar(Avatar, {
        label: "Profile avatar",
        alt: "Alt avatar",
        name: "Ada Lovelace",
      });

      getAvatar().should("have.attr", "aria-label", "Profile avatar");
      getInitials().should("have.attr", "title", "Profile avatar");
    });

    it("uses alt before name for computed labeling", () => {
      mountAvatar(Avatar, {
        alt: "Open Ada profile",
        name: "Ada Lovelace",
      });

      getAvatar().should("have.attr", "aria-label", "Open Ada profile");

      getInitials()
        .should("have.attr", "title", "Open Ada profile")
        .and("have.text", "AL");
    });

    it("uses aria-label when provided", () => {
      mountAvatar(Avatar, {
        "aria-label": "Custom avatar label",
      });

      getAvatar().should("have.attr", "aria-label", "Custom avatar label");
    });

    it("lets aria-labelledby take precedence over aria-label", () => {
      cy.mount(
        <div data-cy="avatar-test-root">
          <span id="avatar-label">External avatar label</span>

          <Avatar
            name="Ada Lovelace"
            aria-label="Ignored label"
            aria-labelledby="avatar-label"
            data-testid="avatar"
          />
        </div>,
      );

      getAvatar()
        .should("have.attr", "aria-labelledby", "avatar-label")
        .and("not.have.attr", "aria-label");
    });

    it("supports aria-describedby", () => {
      cy.mount(
        <div data-cy="avatar-test-root">
          <span id="avatar-description">External avatar description</span>

          <Avatar
            name="Ada Lovelace"
            aria-describedby="avatar-description"
            data-testid="avatar"
          />
        </div>,
      );

      getAvatar().should("have.attr", "aria-describedby", "avatar-description");
    });

    it("supports aria-current", () => {
      mountAvatar(Avatar, {
        href: "/profile",
        "aria-current": "page",
      });

      getAvatar().should("have.attr", "aria-current", "page");
    });

    it("supports a role override", () => {
      mountAvatar(Avatar, {
        role: "menuitem",
      });

      getAvatar().should("have.attr", "role", "menuitem");
    });

    it("renders an image when src is provided", () => {
      mountAvatar(Avatar, {
        src: VALID_AVATAR_SRC,
        alt: "Ada avatar image",
      });

      getImage()
        .should("exist")
        .and("have.attr", "alt", "Ada avatar image")
        .and("have.attr", "loading", "lazy");

      getInitials().should("not.exist");
    });

    it("uses eager image loading when priority is true", () => {
      mountAvatar(Avatar, {
        src: VALID_AVATAR_SRC,
        priority: true,
      });

      getImage().should("have.attr", "loading", "eager");
    });

    it("falls back to initials when the image errors", () => {
      mountAvatar(Avatar, {
        src: VALID_AVATAR_SRC,
        name: "Ada Lovelace",
        alt: "Broken avatar image",
      });

      getImage().then(($img) => {
        const image = $img[0] as HTMLImageElement;

        image.dispatchEvent(
          new Event("error", {
            bubbles: false,
            cancelable: true,
          }),
        );
      });

      getInitials()
        .should("exist")
        .and("have.attr", "title", "Broken avatar image")
        .and("have.text", "AL");

      getImage().should("not.exist");
    });

    it("renders custom fallback content when no image is available", () => {
      mountAvatar(Avatar, {
        name: "",
        alt: "",
        label: "Fallback avatar",
        fallback: <TestFallback />,
      });

      getInitials().should("exist");
      cy.get('[data-testid="custom-fallback"]').should("exist");
    });

    it("renders the default fallback icon when name, image, and fallback are missing", () => {
      mountAvatar(Avatar, {
        name: "",
        alt: "",
        label: "",
      });

      getAvatar().should("have.attr", "aria-label", "User avatar");
      getInitials().should("exist").and("have.attr", "title", "User avatar");
    });

    it("renders children instead of image or fallback content", () => {
      mountAvatar(Avatar, {
        src: VALID_AVATAR_SRC,
        children: <TestChildContent />,
      });

      cy.get('[data-testid="custom-avatar-child"]').should("exist");
      getImage().should("not.exist");
      getInitials().should("not.exist");
    });

    it("calls onClick when enabled", () => {
      const onClick = cy.stub().as("onClick");

      mountAvatar(Avatar, {
        onClick,
      });

      getAvatar().click();

      cy.get("@onClick").should("have.been.calledOnce");
    });

    it("does not call onClick when disabled as a button", () => {
      const onClick = cy.stub().as("onClick");

      mountAvatar(Avatar, {
        disabled: true,
        onClick,
      });

      getAvatar().should("be.disabled");

      getAvatar().click({ force: true });

      cy.get("@onClick").should("not.have.been.called");
    });

    it("renders as an internal link when href is provided", () => {
      mountAvatar(Avatar, {
        href: "/profile",
        label: "Open profile",
      });

      getAvatar().should("match", "a");

      getAvatar().invoke("attr", "href").should("include", "/profile");

      getAvatar().should("have.attr", "aria-label", "Open profile");
      getAvatar().should("have.attr", "tabindex", "0");
      getAvatar().should("not.have.attr", "target");
      getAvatar().should("not.have.attr", "rel");
    });

    it("renders external links with target blank and safe rel by default", () => {
      mountAvatar(Avatar, {
        href: "https://example.com/profile",
      });

      getAvatar().should("match", "a");

      getAvatar()
        .invoke("attr", "href")
        .should("include", "https://example.com/profile");

      getAvatar()
        .should("have.attr", "target", "_blank")
        .and("have.attr", "rel", "noopener noreferrer");
    });

    it("respects explicit target and rel props for links", () => {
      mountAvatar(Avatar, {
        href: "https://example.com/profile",
        target: "_self",
        rel: "author",
      });

      getAvatar()
        .should("have.attr", "target", "_self")
        .and("have.attr", "rel", "author");
    });

    it("calls onClick for enabled links without navigating during the test", () => {
      const onClick = cy
        .stub()
        .callsFake((event: React.MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();
        })
        .as("onClick");

      mountAvatar(Avatar, {
        href: "/profile",
        onClick,
      });

      getAvatar().click();

      cy.get("@onClick").should("have.been.calledOnce");
    });

    it("renders a status dot when status is provided", () => {
      mountAvatar(Avatar, {
        status: "online",
      });

      getStatus().should("exist").and("have.attr", "aria-hidden", "true");

      getStatusLabel().should("not.exist");
    });

    it("renders a custom status icon when statusIcon is provided", () => {
      mountAvatar(Avatar, {
        statusIcon: <TestStatusIcon />,
      });

      getStatus().should("exist").and("have.attr", "aria-hidden", "true");

      cy.get('[data-testid="custom-status-icon"]').should("exist");
    });

    it("adds the status label id to aria-describedby when statusLabel and status are provided", () => {
      mountAvatar(Avatar, {
        status: "online",
        statusLabel: "Online",
      });

      getStatusLabel()
        .should("exist")
        .and("have.text", "Online")
        .invoke("attr", "id")
        .then((statusLabelId) => {
          getAvatar().should("have.attr", "aria-describedby", statusLabelId);
        });
    });

    it("combines external aria-describedby with generated status label id", () => {
      cy.mount(
        <div data-cy="avatar-test-root">
          <span id="external-description">External description</span>

          <Avatar
            name="Ada Lovelace"
            status="online"
            statusLabel="Online"
            aria-describedby="external-description"
            data-testid="avatar"
          />
        </div>,
      );

      getStatusLabel()
        .invoke("attr", "id")
        .then((statusLabelId) => {
          getAvatar()
            .invoke("attr", "aria-describedby")
            .should("include", "external-description")
            .and("include", statusLabelId as string);
        });
    });

    it("does not add generated status description when statusLabel is missing", () => {
      mountAvatar(Avatar, {
        status: "online",
      });

      getAvatar().should("not.have.attr", "aria-describedby");
      getStatusLabel().should("not.exist");
    });

    it("does not render status when neither status nor statusIcon is provided", () => {
      mountAvatar(Avatar);

      getStatus().should("not.exist");
      getStatusLabel().should("not.exist");
    });

    it("supports all status values", () => {
      const statuses = ["online", "offline", "busy", "away"] as const;

      cy.mount(
        <div data-cy="avatar-test-root">
          {statuses.map((status) => (
            <Avatar
              key={status}
              name="Ada Lovelace"
              status={status}
              testId={`avatar-${status}`}
            />
          ))}
        </div>,
      );

      statuses.forEach((status) => {
        getAvatar(`avatar-${status}`).should("exist");
        getStatus(`avatar-${status}`).should("exist");
      });
    });

    it("supports all status positions", () => {
      const positions = [
        "topLeft",
        "topRight",
        "bottomLeft",
        "bottomRight",
      ] as const;

      cy.mount(
        <div data-cy="avatar-test-root">
          {positions.map((statusPosition) => (
            <Avatar
              key={statusPosition}
              name="Ada Lovelace"
              status="online"
              statusPosition={statusPosition}
              testId={`avatar-${statusPosition}`}
            />
          ))}
        </div>,
      );

      positions.forEach((statusPosition) => {
        getAvatar(`avatar-${statusPosition}`).should("exist");
        getStatus(`avatar-${statusPosition}`).should("exist");
      });
    });

    it("supports custom testId prop", () => {
      cy.mount(
        <div data-cy="avatar-test-root">
          <Avatar name="Ada Lovelace" testId="custom-avatar" />
        </div>,
      );

      cy.get('[data-testid="custom-avatar-main"]').should("exist");
      cy.get('[data-testid="custom-avatar-initials"]').should("exist");
    });

    it("supports data-testid as a backward-compatible test id alias", () => {
      mountAvatar(Avatar, {
        "data-testid": "data-avatar",
      });

      cy.get('[data-testid="data-avatar-main"]').should("exist");
      cy.get('[data-testid="data-avatar-initials"]').should("exist");
    });

    it("forwards refs to the rendered button element", () => {
      const RefHarness = () => {
        const buttonRef = React.useRef<HTMLButtonElement | null>(null);

        return (
          <div data-cy="avatar-test-root">
            <Avatar ref={buttonRef} name="Ada Lovelace" data-testid="avatar" />

            <button
              type="button"
              data-testid="read-ref"
              onClick={() => {
                buttonRef.current?.setAttribute("data-ref-current", "true");
              }}
            >
              Read ref
            </button>
          </div>
        );
      };

      cy.mount(<RefHarness />);

      cy.get('[data-testid="read-ref"]').click();

      getAvatar().should("have.attr", "data-ref-current", "true");
    });

    it("forwards refs to the rendered anchor element", () => {
      const RefHarness = () => {
        const anchorRef = React.useRef<HTMLAnchorElement | null>(null);

        return (
          <div data-cy="avatar-test-root">
            <Avatar
              ref={anchorRef}
              name="Ada Lovelace"
              href="/profile"
              data-testid="avatar"
            />

            <button
              type="button"
              data-testid="read-ref"
              onClick={() => {
                anchorRef.current?.setAttribute("data-ref-current", "true");
              }}
            >
              Read ref
            </button>
          </div>
        );
      };

      cy.mount(<RefHarness />);

      cy.get('[data-testid="read-ref"]').click();

      getAvatar().should("have.attr", "data-ref-current", "true");
    });

    it("supports visual props without breaking interaction", () => {
      const onClick = cy.stub().as("onClick");

      mountAvatar(Avatar, {
        theme: "secondary",
        state: "success",
        size: "large",
        shape: "rounded",
        shadow: "strong",
        outline: true,
        glass: true,
        onClick,
      });

      getAvatar().click();

      cy.get("@onClick").should("have.been.calledOnce");
      getInitials().should("have.text", "AL");
    });

    it("supports all shape variants", () => {
      const shapes = ["circle", "square", "rounded"] as const;

      cy.mount(
        <div data-cy="avatar-test-root">
          {shapes.map((shape) => (
            <Avatar
              key={shape}
              name="Ada Lovelace"
              shape={shape}
              testId={`avatar-${shape}`}
            />
          ))}
        </div>,
      );

      shapes.forEach((shape) => {
        getAvatar(`avatar-${shape}`).should("exist");
        getInitials(`avatar-${shape}`).should("have.text", "AL");
      });
    });

    it("supports all size variants", () => {
      const sizes = ["xs", "small", "medium", "large", "xl"] as const;

      cy.mount(
        <div data-cy="avatar-test-root">
          {sizes.map((size) => (
            <Avatar
              key={size}
              name="Ada Lovelace"
              size={size}
              testId={`avatar-${size}`}
            />
          ))}
        </div>,
      );

      sizes.forEach((size) => {
        getAvatar(`avatar-${size}`).should("exist");
        getInitials(`avatar-${size}`).should("have.text", "AL");
      });
    });

    it("supports multiple avatars without status description id collisions", () => {
      cy.mount(
        <div data-cy="avatar-test-root">
          <Avatar
            name="Ada Lovelace"
            status="online"
            statusLabel="Ada online"
            testId="first-avatar"
          />

          <Avatar
            name="Grace Hopper"
            status="offline"
            statusLabel="Grace offline"
            testId="second-avatar"
          />
        </div>,
      );

      getStatusLabel("first-avatar")
        .invoke("attr", "id")
        .then((firstStatusId) => {
          getStatusLabel("second-avatar")
            .invoke("attr", "id")
            .should("not.equal", firstStatusId);
        });

      getAvatar("first-avatar").should("contain.text", "AL");
      getAvatar("second-avatar").should("contain.text", "GH");
    });

  });
};

const runCoreOnlyAvatarTests = (Avatar: AvatarComponent) => {
  describe("core Avatar implementation-specific behavior", () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    it("does not leak imageFill as a DOM attribute in the core wrapper", () => {
      mountAvatar(Avatar, {
        src: VALID_AVATAR_SRC,
        imageFill: true,
      });

      getImage().should("exist");
      getImage().should("not.have.attr", "fill");
    });

    it("removes href for disabled links in the core wrapper", () => {
      const onClick = cy.stub().as("onClick");

      mountAvatar(Avatar, {
        href: "/profile",
        disabled: true,
        onClick,
      });

      getAvatar().should("match", "a");
      getAvatar().should("not.have.attr", "href");
      getAvatar().should("have.attr", "aria-disabled", "true");
      getAvatar().should("have.attr", "tabindex", "-1");

      getAvatar().click({ force: true });

      cy.get("@onClick").should("not.have.been.called");
    });

    it("applies expected core BEM classes for visual props", () => {
      mountAvatar(Avatar, {
        theme: "secondary",
        state: "success",
        size: "large",
        shape: "rounded",
        shadow: "strong",
        outline: true,
        glass: true,
        onClick: cy.stub(),
      });

      getAvatar()
        .should("have.class", "avatar")
        .and("have.class", "avatar_secondary")
        .and("have.class", "avatar_success")
        .and("have.class", "avatar_large")
        .and("have.class", "avatar_rounded")
        .and("have.class", "avatar_shadow-Strong")
        .and("have.class", "avatar_outline")
        .and("have.class", "avatar_glass")
        .and("have.class", "avatar_clickable");
    });

    it("applies expected core status classes", () => {
      mountAvatar(Avatar, {
        status: "busy",
        statusPosition: "topLeft",
      });

      getStatus()
        .should("have.class", "avatar_status")
        .and("have.class", "avatar_status_busy")
        .and("have.class", "avatar_status_topLeft");
    });

    it("applies disabled class in core mode", () => {
      mountAvatar(Avatar, {
        disabled: true,
      });

      getAvatar().should("have.class", "avatar_disabled");
    });
  });
};

const runNextOnlyAvatarTests = (Avatar: AvatarComponent) => {
  describe("next Avatar wrapper behavior", () => {
    beforeEach(() => {
      cy.viewport(900, 620);
    });

    it("marks disabled links as aria-disabled and prevents click handlers", () => {
      const onClick = cy.stub().as("onClick");

      mountAvatar(Avatar, {
        href: "/profile",
        disabled: true,
        onClick,
      });

      getAvatar().should("match", "a");
      getAvatar().should("have.attr", "aria-disabled", "true");
      getAvatar().should("have.attr", "tabindex", "-1");
      getAvatar().should("not.have.attr", "target");
      getAvatar().should("not.have.attr", "rel");

      getAvatar().click({ force: true });

      cy.get("@onClick").should("not.have.been.called");
    });

    it("mounts the Next Avatar wrapper without crashing when no image is used", () => {
      cy.mount(
        <div data-cy="avatar-test-root">
          <Avatar name="Ada Lovelace" testId="avatar" />
        </div>,
      );

      getAvatar().should("exist");
      getInitials().should("have.text", "AL");
    });

    it("renders as a link when href is provided", () => {
      cy.mount(
        <div data-cy="avatar-test-root">
          <Avatar
            name="Ada Lovelace"
            href="/profile"
            testId="avatar"
            aria-label="Open profile"
          />
        </div>,
      );

      getAvatar()
        .should("exist")
        .and("match", "a")
        .and("have.attr", "aria-label", "Open profile");
    });
  });
};

runSharedAvatarTests("core", Core.Avatar);
runCoreOnlyAvatarTests(Core.Avatar);

runSharedAvatarTests("next", Next.Avatar);
runNextOnlyAvatarTests(Next.Avatar);
