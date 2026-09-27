import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CriticalVisualCaseId } from "../visual-regression/criticalVisualMatrix";
import {
  getVisualParameters,
  renderCriticalVisualCase,
  runVisualPlay,
} from "./criticalVisualCases";

const meta = {
  title: "Visual Parity/Core",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const createStory = (id: CriticalVisualCaseId): Story => ({
  render: () => renderCriticalVisualCase("core", id),
  parameters: getVisualParameters(id),
  play: async ({ canvasElement }) => runVisualPlay(canvasElement, id),
});

export const ButtonStates = createStory("button-states");
export const ButtonFocusForcedColors = createStory(
  "button-focus-forced-colors",
);
export const CardInteraction = createStory("card-interaction");
export const FormFeedback = createStory("form-feedback");
export const DataTableInteraction = createStory("data-table-interaction");
export const FileUploadDragRejected = createStory("file-upload-drag-rejected");
export const LineChartAccessibility = createStory("line-chart-accessibility");
export const TreeViewStates = createStory("tree-view-states");
export const SkeletonReducedMotion = createStory("skeleton-reduced-motion");
export const TabsFocus = createStory("tabs-focus");
export const FeedbackStates = createStory("feedback-states");
export const NavigationNarrow = createStory("navigation-narrow");
export const MenuSubmenuEdge = createStory("menu-submenu-edge");
export const DropdownSubmenuEdge = createStory("dropdown-submenu-edge");
export const PopOverOpen = createStory("popover-open");
export const PopOverEdge = createStory("popover-edge");
export const OverlayModal = createStory("overlay-modal");
export const OverlayModalStack = createStory("overlay-modal-stack");
export const OverlayModalPopup = createStory("overlay-modal-popup");
export const OverlayDrawerModal = createStory("overlay-drawer-modal");
export const OverlayModalDropdown = createStory("overlay-modal-dropdown");
