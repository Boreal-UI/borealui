import { createRoot } from "react-dom/client";
import { ForegroundFixture } from "./foreground.fixture";
import "../../src/styles/globals.scss";

createRoot(document.getElementById("root")!).render(<ForegroundFixture entry={new URLSearchParams(location.search).get("variant") ?? "core"} />);
