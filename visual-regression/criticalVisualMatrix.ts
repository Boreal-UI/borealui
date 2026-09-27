export const visualImplementations = ["core", "next"] as const;
export type VisualImplementation = (typeof visualImplementations)[number];

export const visualThemes = {
  light: "Citrus Zest",
  dark: "Eclipse Night",
} as const;

export const visualViewports = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 375, height: 812 },
} as const;

export type CriticalVisualCaseId =
  | "button-states"
  | "button-focus-forced-colors"
  | "card-interaction"
  | "form-feedback"
  | "data-table-interaction"
  | "file-upload-drag-rejected"
  | "line-chart-accessibility"
  | "tree-view-states"
  | "skeleton-reduced-motion"
  | "tabs-focus"
  | "feedback-states"
  | "navigation-narrow"
  | "menu-submenu-edge"
  | "dropdown-submenu-edge"
  | "popover-open"
  | "popover-edge"
  | "overlay-modal"
  | "overlay-modal-stack"
  | "overlay-modal-popup"
  | "overlay-drawer-modal"
  | "overlay-modal-dropdown";

type CriticalVisualCase = {
  id: CriticalVisualCaseId;
  exportName: string;
  category: string;
  components: string[];
  states: string[];
  theme: keyof typeof visualThemes;
  viewports: Array<keyof typeof visualViewports>;
  forcedColors?: true;
  reducedMotion?: true;
  storyIds: Record<VisualImplementation, string>;
};

const storyIds = (slug: string): Record<VisualImplementation, string> => ({
  core: `visual-parity-core--${slug}`,
  next: `visual-parity-next--${slug}`,
});

export const criticalVisualMatrix: CriticalVisualCase[] = [
  {
    id: "button-states",
    exportName: "ButtonStates",
    category: "foundation",
    components: ["Button"],
    states: ["default", "outline", "glass", "disabled", "loading"],
    theme: "light",
    viewports: ["desktop"],
    storyIds: storyIds("button-states"),
  },
  {
    id: "button-focus-forced-colors",
    exportName: "ButtonFocusForcedColors",
    category: "accessibility",
    components: ["Button"],
    states: ["focus-visible", "forced-colors"],
    theme: "light",
    viewports: ["desktop"],
    forcedColors: true,
    storyIds: storyIds("button-focus-forced-colors"),
  },
  {
    id: "card-interaction",
    exportName: "CardInteraction",
    category: "foundation",
    components: ["Card"],
    states: ["glass", "shadow", "selected", "disabled", "focus-within"],
    theme: "dark",
    viewports: ["desktop"],
    storyIds: storyIds("card-interaction"),
  },
  {
    id: "form-feedback",
    exportName: "FormFeedback",
    category: "forms",
    components: ["TextInput", "TextArea"],
    states: ["helper", "invalid", "disabled"],
    theme: "light",
    viewports: ["desktop", "mobile"],
    storyIds: storyIds("form-feedback"),
  },
  {
    id: "data-table-interaction",
    exportName: "DataTableInteraction",
    category: "data",
    components: ["DataTable"],
    states: ["editing", "pagination", "selection", "disabled"],
    theme: "light",
    viewports: ["desktop", "mobile"],
    storyIds: storyIds("data-table-interaction"),
  },
  {
    id: "file-upload-drag-rejected",
    exportName: "FileUploadDragRejected",
    category: "forms",
    components: ["FileUpload"],
    states: ["drag-active", "rejected", "error"],
    theme: "light",
    viewports: ["desktop"],
    storyIds: storyIds("file-upload-drag-rejected"),
  },
  {
    id: "line-chart-accessibility",
    exportName: "LineChartAccessibility",
    category: "data visualization",
    components: ["LineChart"],
    states: ["reduced-motion", "forced-colors"],
    theme: "dark",
    viewports: ["desktop"],
    forcedColors: true,
    reducedMotion: true,
    storyIds: storyIds("line-chart-accessibility"),
  },
  {
    id: "tree-view-states",
    exportName: "TreeViewStates",
    category: "complex interaction",
    components: ["TreeView"],
    states: ["expanded", "selected", "disabled", "focus-visible"],
    theme: "light",
    viewports: ["desktop", "mobile"],
    storyIds: storyIds("tree-view-states"),
  },
  {
    id: "skeleton-reduced-motion",
    exportName: "SkeletonReducedMotion",
    category: "feedback",
    components: ["Skeleton"],
    states: ["loading", "animation-disabled"],
    theme: "dark",
    viewports: ["desktop"],
    reducedMotion: true,
    storyIds: storyIds("skeleton-reduced-motion"),
  },
  {
    id: "tabs-focus",
    exportName: "TabsFocus",
    category: "complex interaction",
    components: ["Tabs"],
    states: ["selected", "disabled", "focus-visible"],
    theme: "light",
    viewports: ["desktop", "mobile"],
    storyIds: storyIds("tabs-focus"),
  },
  {
    id: "feedback-states",
    exportName: "FeedbackStates",
    category: "feedback",
    components: ["Alert", "Badge", "ProgressBar"],
    states: ["success", "warning", "error", "loading"],
    theme: "dark",
    viewports: ["desktop"],
    storyIds: storyIds("feedback-states"),
  },
  {
    id: "navigation-narrow",
    exportName: "NavigationNarrow",
    category: "layout/navigation",
    components: ["NavBar", "Footer"],
    states: ["responsive", "active"],
    theme: "dark",
    viewports: ["mobile"],
    storyIds: storyIds("navigation-narrow"),
  },
  {
    id: "menu-submenu-edge",
    exportName: "MenuSubmenuEdge",
    category: "floating panels",
    components: ["Menu"],
    states: ["open", "submenu", "edge-flip"],
    theme: "light",
    viewports: ["desktop"],
    storyIds: storyIds("menu-submenu-edge"),
  },
  {
    id: "dropdown-submenu-edge",
    exportName: "DropdownSubmenuEdge",
    category: "floating panels",
    components: ["Dropdown"],
    states: ["open", "submenu", "edge-flip"],
    theme: "dark",
    viewports: ["desktop"],
    storyIds: storyIds("dropdown-submenu-edge"),
  },
  {
    id: "popover-open",
    exportName: "PopOverOpen",
    category: "floating panels",
    components: ["PopOver"],
    states: ["open", "bottom-placement"],
    theme: "light",
    viewports: ["desktop"],
    storyIds: storyIds("popover-open"),
  },
  {
    id: "popover-edge",
    exportName: "PopOverEdge",
    category: "floating panels",
    components: ["PopOver"],
    states: ["open", "bottom-requested", "top-resolved", "edge-flip"],
    theme: "light",
    viewports: ["desktop"],
    storyIds: storyIds("popover-edge"),
  },
  {
    id: "overlay-modal",
    exportName: "OverlayModal",
    category: "overlay layers",
    components: ["Modal"],
    states: ["open"],
    theme: "light",
    viewports: ["desktop"],
    storyIds: storyIds("overlay-modal"),
  },
  {
    id: "overlay-modal-stack",
    exportName: "OverlayModalStack",
    category: "overlay layers",
    components: ["Modal"],
    states: ["nested", "top-layer"],
    theme: "dark",
    viewports: ["desktop"],
    storyIds: storyIds("overlay-modal-stack"),
  },
  {
    id: "overlay-modal-popup",
    exportName: "OverlayModalPopup",
    category: "overlay layers",
    components: ["Modal", "MessagePopup"],
    states: ["cross-portal", "top-layer"],
    theme: "light",
    viewports: ["desktop"],
    storyIds: storyIds("overlay-modal-popup"),
  },
  {
    id: "overlay-drawer-modal",
    exportName: "OverlayDrawerModal",
    category: "overlay layers",
    components: ["Drawer", "Modal"],
    states: ["inline-base", "portal-top-layer"],
    theme: "dark",
    viewports: ["desktop"],
    storyIds: storyIds("overlay-drawer-modal"),
  },
  {
    id: "overlay-modal-dropdown",
    exportName: "OverlayModalDropdown",
    category: "overlay layers",
    components: ["Modal", "Dropdown"],
    states: ["nested-floating", "open"],
    theme: "light",
    viewports: ["desktop"],
    storyIds: storyIds("overlay-modal-dropdown"),
  },
];

export const getCriticalVisualCase = (id: CriticalVisualCaseId) => {
  const visualCase = criticalVisualMatrix.find((entry) => entry.id === id);
  if (!visualCase) throw new Error(`Unknown critical visual case: ${id}`);
  return visualCase;
};
