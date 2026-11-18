import { render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import Card from "@/components/Card/core/Card";
import ServerCard from "@/components/Card/server/Card";
import Modal from "@/components/Modal/core/Modal";

it("supports direct Card children/footer and preserves legacy renderer precedence", () => {
  const view = render(<Card padding="none" bodyClassName="own-body" footer={<button>Save</button>}>Ordinary children</Card>);
  expect(screen.getByTestId("card")).toHaveAttribute("data-padding", "none");
  expect(view.container.querySelector(".own-body")).toHaveTextContent("Ordinary children");
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  expect(view.container.querySelector(".card_header")).toBeNull();
  view.rerender(<Card footer="Simple footer" renderContent={() => "Legacy body"} renderFooter={() => "Legacy footer"}>Unused children</Card>);
  expect(screen.getByText("Legacy body")).toBeInTheDocument();
  expect(screen.getByText("Legacy footer")).toBeInTheDocument();
  expect(screen.queryByText("Unused children")).toBeNull();
  expect(screen.queryByText("Simple footer")).toBeNull();
});

it("server Card exposes the same padding and simple composition contract", () => {
  render(<ServerCard padding="none" footer="Server footer">Server children</ServerCard>);
  expect(screen.getByTestId("card")).toHaveAttribute("data-padding", "none");
  expect(screen.getByText("Server children")).toBeInTheDocument();
  expect(screen.getByText("Server footer")).toBeInTheDocument();
});

it("allows headerless named Modal composition without a placeholder header", async () => {
  render(<Modal open onClose={() => {}} title={null} aria-label="Publication details" padding="none" footer={<button>Done</button>}>
    Text content <p>Paragraph content</p>
  </Modal>);
  const dialog = await screen.findByRole("dialog", { name: "Publication details" });
  await waitFor(() => expect(screen.getByTestId("modal")).toHaveClass("modal_visible"));
  expect(dialog).toHaveAttribute("data-padding", "none");
  expect(screen.queryByTestId("modal-header")).toBeNull();
  expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
  expect(await axe(dialog)).toHaveNoViolations();
});

it("preserves custom title nodes without nesting headings or using a generic hidden name", async () => {
  render(<Modal open onClose={() => {}} title={<h2>Custom publication heading</h2>}><p>Details</p></Modal>);
  await screen.findByRole("dialog", { name: "Custom publication heading" });
  await waitFor(() => expect(screen.getByTestId("modal")).toHaveClass("modal_visible"));
  expect(screen.getAllByRole("heading", { name: "Custom publication heading" })).toHaveLength(1);
});
