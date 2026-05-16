import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import PortalBase from "@/components/Portal/PortalBase";

expect.extend(toHaveNoViolations);

const classMap = { root: "root", srOnly: "srOnly" };

describe("PortalBase", () => {
  it("renders children into document.body by default", async () => {
    render(
      <PortalBase classMap={classMap} data-testid="portal">
        Portaled content
      </PortalBase>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("portal")).toHaveTextContent(
        "Portaled content",
      );
    });
  });

  it("can render inline when disabled", () => {
    const { container } = render(
      <PortalBase classMap={classMap} disabled data-testid="portal">
        Inline content
      </PortalBase>,
    );

    expect(container).toHaveTextContent("Inline content");
  });

  it("supports custom containers and screen-reader text", async () => {
    const target = document.createElement("div");
    document.body.appendChild(target);

    render(
      <PortalBase
        classMap={classMap}
        container={target}
        srOnlyText="Assistive context"
        data-testid="portal"
      >
        Custom target
      </PortalBase>,
    );

    await waitFor(() => {
      expect(target).toHaveTextContent("Custom target");
    });
    expect(screen.getByTestId("portal-sr-only-text")).toHaveTextContent(
      "Assistive context",
    );
  });

  it("forwards refs to the portal wrapper", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <PortalBase classMap={classMap} disabled ref={ref} data-testid="portal">
        Inline content
      </PortalBase>,
    );

    expect(ref.current).toBe(screen.getByTestId("portal"));
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <PortalBase classMap={classMap} disabled>
        Inline content
      </PortalBase>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
