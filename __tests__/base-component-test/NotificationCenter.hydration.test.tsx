import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import Core from "../../src/core/NotificationCenter";
import Next from "../../src/next/NotificationCenter";

describe.each([["Core", Core], ["Next", Next]] as const)("%s NotificationCenter hydration", (_name, Center) => {
  it("uses stable UTC markup then localizes without a recoverable hydration error", async () => {
    const notifications = [
      { id: "one", message: "First", timestamp: new Date("2026-11-13T12:00:00.000Z"), ariaDescription: "Additional context" },
      { id: "two", message: "Second", timestamp: new Date("2026-11-13T13:00:00.000Z") },
      { id: "three", message: "No timestamp" },
    ];
    const format = jest.spyOn(Date.prototype, "toLocaleTimeString").mockReturnValue("12:00 p.m.");
    const server = <Center notifications={notifications} onRemove={() => {}} locale="en-GB" timeZone="UTC" />;
    const html = renderToString(server);
    expect(html).toContain("12:00 UTC");
    expect(format).not.toHaveBeenCalled();
    format.mockRestore();
    const host = document.createElement("div"); document.body.appendChild(host); host.innerHTML = html;
    const ids = Array.from(host.querySelectorAll("time")).map(t => t.id);
    const errors = jest.fn();
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => { root = hydrateRoot(host,
      <Center notifications={notifications} onRemove={() => {}} locale="en-US" timeZone="America/Toronto" />,
      { onRecoverableError: errors }); });
    expect(errors).not.toHaveBeenCalled();
    expect(host.querySelector("time")).toHaveTextContent("07:00 AM");
    expect(host.querySelector("time")).toHaveAttribute("datetime", "2026-11-13T12:00:00.000Z");
    expect(Array.from(host.querySelectorAll("time")).map(t => t.id)).toEqual(ids);
    const items = host.querySelectorAll("li");
    expect(items[0]).toHaveAttribute("aria-describedby", `${ids[0]} ${host.querySelector('[data-testid$="-description"]')!.id}`);
    expect(items[1]).toHaveAttribute("aria-describedby", ids[1]);
    expect(items[2]).not.toHaveAttribute("aria-describedby");
    await act(async () => { root!.unmount(); }); host.remove();
  });
});
