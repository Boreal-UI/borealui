import type { SyntheticEvent } from "react";

export type ReactEventHandler<Event extends SyntheticEvent> = (
  event: Event,
) => void;

/**
 * Runs a consumer handler before Boreal's corresponding default interaction.
 * Consumers can cancel the internal behavior with `event.preventDefault()`.
 */
export function composeEventHandlers<Event extends SyntheticEvent>(
  consumerHandler?: ReactEventHandler<Event>,
  internalHandler?: ReactEventHandler<Event>,
): ReactEventHandler<Event> | undefined {
  if (!consumerHandler) return internalHandler;
  if (!internalHandler) return consumerHandler;

  return (event) => {
    consumerHandler(event);
    if (!event.defaultPrevented) internalHandler(event);
  };
}
