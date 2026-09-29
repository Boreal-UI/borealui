import React from "react";
import { render, screen } from "@testing-library/react";
import AppShellBase from "@/components/AppShell/AppShellBase";
import CheckBoxBase from "@/components/CheckBox/CheckBoxBase";
import CircularProgressBase from "@/components/CircularProgress/CircularProgressBase";
import DividerBase from "@/components/Divider/DividerBase";

const classMap: Record<string, string> = {};

describe("protected semantic props", () => {
  it("keeps checkbox type and managed checked state authoritative", () => {
    const conflictingProps = {
      type: "text",
      "aria-checked": false,
    } as unknown as React.ComponentProps<typeof CheckBoxBase>;

    render(
      <CheckBoxBase
        {...conflictingProps}
        checked
        indeterminate
        onChange={jest.fn()}
        classMap={classMap}
        testId="protected-checkbox"
      />,
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("type", "checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
  });

  it("keeps progress role and managed range values authoritative", () => {
    render(
      <CircularProgressBase
        value={40}
        min={0}
        max={80}
        role="presentation"
        aria-valuenow={999}
        classMap={classMap}
        testId="protected-progress"
      />,
    );

    const progress = screen.getByTestId("protected-progress");
    expect(progress).toHaveAttribute("role", "progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "40");
  });

  it("keeps decorative divider semantics authoritative", () => {
    render(
      <DividerBase
        decorative
        aria-hidden={false}
        aria-orientation="vertical"
        classMap={classMap}
        testId="protected-divider"
      />,
    );

    const divider = screen.getByTestId("protected-divider");
    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).not.toHaveAttribute("aria-orientation");
  });

  it("keeps component loading and disabled state authoritative", () => {
    render(
      <AppShellBase
        loading
        disabled
        aria-busy={false}
        aria-disabled={false}
        classMap={classMap}
        testId="protected-shell"
      >
        Content
      </AppShellBase>,
    );

    const shell = screen.getByTestId("protected-shell");
    expect(shell).toHaveAttribute("aria-busy", "true");
    expect(shell).toHaveAttribute("aria-disabled", "true");
  });
});
