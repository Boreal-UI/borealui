import React from "react";
import { renderToString } from "react-dom/server";
import Core from "../../src/core/NotificationCenter";
import Next from "../../src/next/NotificationCenter";
import { notifications } from "./notification.data";
export function render(variant: string) {
  const Center = variant === "next" ? Next : Core;
  return renderToString(<Center notifications={notifications} onRemove={() => {}} locale="en-GB" timeZone="UTC" />);
}
