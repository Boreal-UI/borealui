"use client";

export * from "./types/index";

import "./styles/globals.scss";

export * from "./generated-docs/index";

///Theme Context and utils
export { default as ThemeProvider } from "./context/NextThemeProvider";
export { getThemeInitializationScript } from "./context/themeRuntime";
export { registerColorScheme } from "./styles/colorSchemeRegistry";
export { defaultColorSchemes } from "./styles/Themes";
export {
  borealConfig,
  getBorealStyleConfig,
  setBorealStyleConfig,
} from "./config/boreal-style-config";
export type { BorealStyleConfig } from "./config/boreal-style-config";

export { default as Typography } from "./components/Typography/next/Typography";

// Buttons
export { default as Button } from "./components/Button/next/Button";
export { default as IconButton } from "./components/IconButton/next/IconButton";
export { default as ScrollToTop } from "./components/ScrollToTop/next/ScrollToTop";

// Inputs & Forms
export { default as TextInput } from "./components/TextInput/next/TextInput";
export { default as TextArea } from "./components/TextArea/next/TextArea";
export { default as Select } from "./components/Select/next/Select";
export { default as ThemeSelect } from "./components/Select/ThemeSelect/next/ThemeSelect";
export { default as FileUpload } from "./components/FileUpload/next/FileUpload";
export { default as TagInput } from "./components/TagInput/next/TagInput";
export { default as RadioButton } from "./components/RadioButton/next/RadioButton";
export { default as RadioGroup } from "./components/RadioButton/next/RadioGroup";
export { default as Slider } from "./components/Slider/next/Slider";
export { default as CheckBox } from "./components/CheckBox/next/CheckBox";
export { default as ColorPicker } from "./components/ColorPicker/next/ColorPicker";
export { default as FormGroup } from "./components/FormGroup/next/FormGroup";
export { default as DataTable } from "./components/DataTable/next/DataTable";
export { default as DateTimePicker } from "./components/DateTimePicker/next/DateTimePicker";
export { default as MarkdownRenderer } from "./components/MarkdownRenderer/next/MarkdownRenderer";

// Feedback & Indicators
export { default as Chip } from "./components/Chip/next/Chip";
export { default as ChipGroup } from "./components/Chip/ChipGroup/next/ChipGroup";
export { default as Badge } from "./components/Badge/next/Badge";
export { default as ProgressBar } from "./components/ProgressBar/next/ProgressBar";
export { default as CircularProgress } from "./components/CircularProgress/next/CircularProgress";
export { default as Rating } from "./components/Rating/next/Rating";
export { default as Skeleton } from "./components/Skeleton/next/Skeleton";
export { default as Spinner } from "./components/Spinner/next/Spinner";
export { default as Tooltip } from "./components/Tooltip/next/Tooltip";
export { default as MessagePopup } from "./components/MessagePopup/next/MessagePopup";
export { default as PopOver } from "./components/PopOver/next/PopOver";

// Navigation & Layout
export { default as NavBar } from "./components/NavBar/next/NavBar";
export { default as Footer } from "./components/Footer/next/Footer";
export { default as Breadcrumbs } from "./components/Breadcrumbs/next/Breadcrumbs";
export { default as Tabs } from "./components/Tabs/next/Tabs";
export { default as Stepper } from "./components/Stepper/next/Stepper";
export { default as Timeline } from "./components/Timeline/next/Timeline";
export { default as Accordion } from "./components/Accordion/next/Accordion";
export { default as Pager } from "./components/Pager/next/Pager";
export { default as Modal } from "./components/Modal/next/Modal";
export { default as Toggle } from "./components/Toggle/next/Toggle";
export { default as Toolbar } from "./components/Toolbar/next/Toolbar";
export { default as Dropdown } from "./components/Dropdown/next/Dropdown";
export { default as Divider } from "./components/Divider/next/Divider";
export { default as MetricBox } from "./components/MetricBox/next/MetricBox";
export { default as EmptyState } from "./components/EmptyState/next/EmptyState";
export { default as CommandPalette } from "./components/CommandPalette/next/CommandPalette";
export { default as NotificationCenter } from "./components/NotificationCenter/next/NotificationCenter";
export { default as Sidebar } from "./components/Sidebar/next/Sidebar";

//  Cards & Display Components
export { default as Card } from "./components/Card/next/Card";
export { default as Avatar } from "./components/Avatar/next/Avatar";
