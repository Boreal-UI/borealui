import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "@testing-library/react";
import { ForegroundExamples } from "../shared-story-assets/ForegroundExamples";
import * as Core from "../src/index.core";
import * as Next from "../src/index.next";
import Typography from "../src/next/server/Typography";
import Alert from "../src/next/server/Alert";
import Badge from "../src/next/server/Badge";
import MetricBox from "../src/next/server/MetricBox";

it.each([ ["Core", Core], ["Next", Next], ["Server", { Typography, Alert, Badge, MetricBox }] ] as const)("%s renders and hydrates the production compositions", async (_, components) => {
  const element = <ForegroundExamples {...components} />;
  const container = document.createElement("div");
  container.innerHTML = renderToString(element);
  expect(container.textContent).toContain("Essential");
  expect(container.textContent).toContain("Usage review needed");
  expect(container.textContent).toContain("99.98%");
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => { root = hydrateRoot(container, element, { onRecoverableError: error => errors.push(error) }); });
  expect(errors).toEqual([]);
  await act(async () => root.unmount());
});
