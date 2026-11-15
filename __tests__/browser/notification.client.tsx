import React from "react";
import { hydrateRoot } from "react-dom/client";
import Core from "../../src/core/NotificationCenter";
import Next from "../../src/next/NotificationCenter";
import { notifications } from "./notification.data";
import "../../src/styles/globals.scss";
const errors: string[] = [];
Object.assign(window, { hydrationErrors: errors });
const Center = new URLSearchParams(location.search).get("variant") === "next" ? Next : Core;
// Deliberately use implicit browser defaults against explicit UTC/en-GB server options.
hydrateRoot(document.getElementById("root")!, <Center notifications={notifications} onRemove={() => {}} />, {
  onRecoverableError: error => { errors.push(String(error)); },
});
