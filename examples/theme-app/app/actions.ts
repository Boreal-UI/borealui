"use server";

// A deterministic transport demo; replace this branch with application validation
// and persistence. No preferences are persisted by this example.
export async function savePublicationPreferences(data: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const ok = data.get("outcome") === "success";
  return {
    ok,
    message: ok ? "Preferences saved." : "The server could not save these preferences. Your email is retained. Try again or contact the editorial team.",
  };
}
