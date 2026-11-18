import type { AriaAttributes, ReactNode } from "react";
import type { StateType } from "../types/types";

/** Shared presentation only; validation rules and timing belong to the consumer. */
export function resolveFieldPresentation({
  id,
  helperText,
  errorMessage,
  invalid,
  state,
  ariaInvalid,
  describedBy = [],
}: {
  id: string;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  invalid?: boolean;
  state?: StateType;
  ariaInvalid?: AriaAttributes["aria-invalid"];
  describedBy?: Array<string | undefined>;
}) {
  const helperTextId = helperText ? `${id}-helper-text` : undefined;
  const errorMessageId = errorMessage ? `${id}-error-message` : undefined;
  const isError = Boolean(errorMessage) || Boolean(invalid) || state === "error";
  return {
    helperTextId,
    errorMessageId,
    state: isError ? "error" as const : state,
    ariaInvalid: ariaInvalid ?? (isError || undefined),
    describedBy: [...new Set(
      [...describedBy, helperTextId, errorMessageId]
        .filter((value): value is string => Boolean(value))
        .flatMap((value) => value.split(/\s+/).filter(Boolean)),
    )].join(" ") || undefined,
  };
}
