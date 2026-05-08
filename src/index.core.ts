import "./styles/globals.scss";

export * from "./types/index";

export * from "./generated-docs/index";

export { default as ThemeProvider, ThemeContext } from "./context/ThemeContext";
export { getThemeInitializationScript } from "./context/themeRuntime";
export { registerColorScheme } from "./styles/colorSchemeRegistry";
export { defaultColorSchemes } from "./styles/Themes";
export {
  borealConfig,
  getBorealStyleConfig,
  setBorealStyleConfig,
} from "./config/boreal-style-config";
export type { BorealStyleConfig } from "./config/boreal-style-config";

export { default as Typography } from "./components/Typography/core/Typography";

// Buttons
export { default as Button } from "./components/Button/core/Button";
export { default as IconButton } from "./components/IconButton/core/IconButton";
export { default as ScrollToTop } from "./components/ScrollToTop/core/ScrollToTop";

// Inputs & Forms
export { default as TextInput } from "./components/TextInput/core/TextInput";
export { default as TextArea } from "./components/TextArea/core/TextArea";
export { default as Select } from "./components/Select/core/Select";
export { default as ThemeSelect } from "./components/Select/ThemeSelect/core/ThemeSelect";
export { default as FileUpload } from "./components/FileUpload/core/FileUpload";
export { default as TagInput } from "./components/TagInput/core/TagInput";
export { default as RadioButton } from "./components/RadioButton/core/RadioButton";
export { default as RadioGroup } from "./components/RadioButton/core/RadioGroup";
export { default as Slider } from "./components/Slider/core/Slider";
export { default as Checkbox } from "./components/Checkbox/core/Checkbox";
export { default as ColorPicker } from "./components/ColorPicker/core/ColorPicker";
export { default as FormGroup } from "./components/FormGroup/core/FormGroup";
export { default as DataTable } from "./components/DataTable/core/DataTable";
export { default as DateTimePicker } from "./components/DateTimePicker/core/DateTimePicker";
export { default as MarkdownRenderer } from "./components/MarkdownRenderer/core/MarkdownRenderer";

// Feedback & Indicators
export { default as Chip } from "./components/Chip/core/Chip";
export { default as ChipGroup } from "./components/Chip/ChipGroup/core/ChipGroup";
export { default as Badge } from "./components/Badge/core/Badge";
export { default as Progressbar } from "./components/ProgressBar/core/ProgressBar";
export { default as CircularProgress } from "./components/CircularProgress/core/CircularProgress";
export { default as Rating } from "./components/Rating/core/Rating";
export { default as Skeleton } from "./components/Skeleton/core/Skeleton";
export { default as Spinner } from "./components/Spinner/core/Spinner";
export { default as Tooltip } from "./components/Tooltip/core/Tooltip";
export { default as MessagePopup } from "./components/MessagePopup/core/MessagePopup";
export { default as PopOver } from "./components/PopOver/core/PopOver";

// Navigation & Layout
export { default as Navbar } from "./components/NavBar/core/NavBar";
export { default as Footer } from "./components/Footer/core/Footer";
export { default as Breadcrumbs } from "./components/Breadcrumbs/core/Breadcrumbs";
export { default as Tabs } from "./components/Tabs/core/Tabs";
export { default as Stepper } from "./components/Stepper/core/Stepper";
export { default as Timeline } from "./components/Timeline/core/Timeline";
export { default as Accordion } from "./components/Accordion/core/Accordion";
export { default as Pager } from "./components/Pager/core/Pager";
export { default as Modal } from "./components/Modal/core/Modal";
export { default as Toggle } from "./components/Toggle/core/Toggle";
export { default as Toolbar } from "./components/Toolbar/core/Toolbar";
export { default as Dropdown } from "./components/Dropdown/core/Dropdown";
export { default as Divider } from "./components/Divider/core/Divider";
export { default as MetricBox } from "./components/MetricBox/core/MetricBox";
export { default as EmptyState } from "./components/EmptyState/core/EmptyState";
export { default as CommandPalette } from "./components/CommandPalette/core/CommandPalette";
export { default as NotificationCenter } from "./components/NotificationCenter/core/NotificationCenter";
export { default as Sidebar } from "./components/Sidebar/core/Sidebar";

//  Cards & Display Components
export { default as Card } from "./components/Card/core/Card";
export { default as Avatar } from "./components/Avatar/core/Avatar";
