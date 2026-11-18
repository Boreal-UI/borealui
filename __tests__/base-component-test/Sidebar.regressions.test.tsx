import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Core from "../../src/core/Sidebar";
import Next from "../../src/next/Sidebar";
import type { SidebarLink } from "../../src/components/Sidebar/Sidebar.types";
jest.mock("next/navigation", () => ({ usePathname: () => "/none" }));
jest.mock("next/link", () => ({ __esModule: true, default: "a" }));
const group = (label: string, id?: string): SidebarLink => ({ id, label, children: [{ label: `${id ?? label} child`, href: `/${id ?? label}` }] });

describe.each([["Core", Core], ["Next", Next]] as const)("%s Sidebar identity", (_name, Sidebar) => {
  it("keeps duplicate labels independent and stable when keyed items reorder", async () => {
    const a = group("Reports", "first"), b = group("Reports", "second");
    const { container, rerender } = render(<Sidebar links={[a,b]} />);
    let buttons = screen.getAllByRole("button", { name: "Reports" });
    const ids = buttons.map(b => b.id);
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
    buttons[1].focus(); await userEvent.keyboard("{Enter}");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard(" "); expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
    rerender(<Sidebar links={[{...b}, {...a}]} />);
    buttons = screen.getAllByRole("button", { name: "Reports" });
    expect(buttons.map(b => b.id)).toEqual([ids[1], ids[0]]);
    expect(buttons[1]).toHaveAttribute("aria-expanded", "true");
    for (const button of buttons) expect(document.getElementById(button.getAttribute("aria-controls")!)).toHaveAttribute("aria-labelledby", button.id);
    const allIds = Array.from(container.querySelectorAll("[id]")).map(e => e.id);
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it("supports unkeyed duplicates, nested repeats, slug collisions and active descendants", () => {
    const links: SidebarLink[] = [group("Reports"), group("Reports"), group("A B"), group("A-B"),
      { label: "Branch", children: [{ label: "Reports", children: [{ label: "Deep", href: "/active" }] }] }];
    const { container, rerender } = render(<Sidebar links={links} isLinkActive={n => n.href === "/active"} />);
    const first = screen.getAllByRole("button", { name: "Reports" })[0];
    fireEvent.click(first); expect(first).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("button", { name: "Reports" })[1]).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("link", { name: "Deep" })).toBeVisible();
    const ids = Array.from(container.querySelectorAll("[id]")).map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    rerender(<Sidebar links={links.map(n => ({...n}))} />);
    expect(first).toHaveAttribute("aria-expanded", "true");
  });

  it("preserves an explicit consumer active-descendant override", () => {
    render(<Sidebar links={[group("Reports", "first")]} isLinkActive={() => true} hasActiveChild={() => false} />);
    expect(screen.getByRole("button", { name: "Reports" })).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps disabled parents discoverable but guards pointer, Enter and Space", async () => {
    render(<Sidebar links={[{ ...group("Disabled"), "aria-disabled": true }, { label: "Outer", children: [{...group("Nested disabled"), "aria-disabled": true}, { label: "Leaf", href: "/bad", "aria-disabled": true }] }]} />);
    const button = screen.getByRole("button", { name: "Disabled" });
    fireEvent.click(button); button.focus(); expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter} ");
    expect(button).toHaveAttribute("aria-disabled", "true"); expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(screen.getByRole("button", { name: "Outer" }));
    const nested = screen.getByRole("button", { name: "Nested disabled" });
    nested.focus(); await userEvent.keyboard("{Enter} "); fireEvent.click(nested);
    expect(nested).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Leaf" })).toBeNull();
  });
});
