import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { usePortalHost } from "@/hooks/usePortalHost";

const Harness = ({
  id,
  active = true,
  label = id,
}: {
  id: string;
  active?: boolean;
  label?: string;
}) => {
  const host = usePortalHost(id, active);
  return <output data-testid={`host-${label}`}>{host?.id ?? "none"}</output>;
};

describe("usePortalHost", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("creates a body host while active and removes it on release", () => {
    const { unmount } = render(<Harness id="managed-portal" />);

    expect(screen.getByTestId("host-managed-portal")).toHaveTextContent(
      "managed-portal",
    );
    expect(document.body.lastElementChild).toHaveAttribute(
      "id",
      "managed-portal",
    );

    unmount();
    expect(document.getElementById("managed-portal")).not.toBeInTheDocument();
  });

  it("shares an internally created host until the final lease releases it", () => {
    const { rerender, unmount } = render(
      <>
        <Harness key="a" id="shared-portal" label="a" />
        <Harness key="b" id="shared-portal" label="b" />
      </>,
    );

    expect(document.querySelectorAll("#shared-portal")).toHaveLength(1);

    rerender(<Harness key="b" id="shared-portal" label="b" />);
    expect(document.getElementById("shared-portal")).toBeInTheDocument();

    unmount();
    expect(document.getElementById("shared-portal")).not.toBeInTheDocument();
  });

  it("reuses and preserves a consumer-owned host", () => {
    const consumerHost = document.createElement("div");
    consumerHost.id = "consumer-portal";
    document.body.appendChild(consumerHost);

    const { unmount } = render(<Harness id="consumer-portal" />);
    expect(document.querySelectorAll("#consumer-portal")).toHaveLength(1);

    unmount();
    expect(document.getElementById("consumer-portal")).toBe(consumerHost);
  });

  it("releases and reacquires hosts across rapid active and id changes", () => {
    const { rerender, unmount } = render(
      <Harness id="first-portal" active={false} />,
    );
    expect(document.getElementById("first-portal")).not.toBeInTheDocument();

    rerender(<Harness id="first-portal" />);
    expect(document.getElementById("first-portal")).toBeInTheDocument();

    rerender(<Harness id="second-portal" />);
    expect(document.getElementById("first-portal")).not.toBeInTheDocument();
    expect(document.getElementById("second-portal")).toBeInTheDocument();

    rerender(<Harness id="second-portal" active={false} />);
    expect(document.getElementById("second-portal")).not.toBeInTheDocument();

    unmount();
  });

  it("balances host ownership through React Strict Mode", () => {
    const { unmount } = render(
      <StrictMode>
        <Harness id="strict-portal" />
      </StrictMode>,
    );

    expect(document.querySelectorAll("#strict-portal")).toHaveLength(1);
    unmount();
    expect(document.getElementById("strict-portal")).not.toBeInTheDocument();
  });

  it("is inert during server rendering", () => {
    expect(() => renderToString(<Harness id="server-portal" />)).not.toThrow();
  });
});
