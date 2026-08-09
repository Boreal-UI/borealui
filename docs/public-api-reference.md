# Public API Reference

This page lists the public API surfaces Boreal UI publishes for consumers and documentation tooling. The generated TypeScript declarations and `package.json` exports remain the source of truth; this guide explains how those APIs are intended to be imported.

## Primary Entry Points

| Entry point                    | Use                                                          |
| ------------------------------ | ------------------------------------------------------------ |
| `@boreal-ui/core`              | Standard React component barrel.                             |
| `@boreal-ui/next`              | Next.js component barrel with client-boundary-safe wrappers. |
| `@boreal-ui/next/server`       | Static React Server Component barrel for Next.js.            |
| `@boreal-ui/next/server/Card`  | Standalone Next.js server component path.                    |
| `@boreal-ui/core/globals.css`  | Core global stylesheet. Import once.                         |
| `@boreal-ui/next/globals.css`  | Next global stylesheet. Import once.                         |
| `@boreal-ui/types`             | Shared public declarations. Add directly when importing it.  |
| `@boreal-ui/types/core/Button` | Core component prop declarations.                            |
| `@boreal-ui/types/next/Button` | Next component prop declarations.                            |
| `@boreal-ui/docs`              | Optional generated component prop metadata.                  |

Use the explicit `core` or `next` entry in application code.

```tsx
import "@boreal-ui/core/globals.css";
import { Button, Card, ThemeProvider } from "@boreal-ui/core";
```

```tsx
"use client";

import "@boreal-ui/next/globals.css";
import { Button, Card, ThemeProvider } from "@boreal-ui/next";
```

## Next.js Server Component Exports

Import static server-rendered UI from `@boreal-ui/next/server` or a
per-component server path:

```tsx
import {
  BreadCrumbPageHeader,
  Card,
  MetricBox,
  Timeline,
} from "@boreal-ui/next/server";
import Footer from "@boreal-ui/next/server/Footer";
```

Available server entries:

`Alert`, `Avatar`, `Badge`, `BarChart`, `BreadCrumbPageHeader`, `Breadcrumbs`,
`Button`, `Card`, `CheckBox`, `Divider`, `EmptyState`, `Footer`, `Layout`,
`Legend`, `LineChart`, `MetricBox`, `PageHeader`, `ProgressBar`, `RadioButton`,
`RadioGroup`, `Select`, `Skeleton`, `Sparkline`, `TextArea`, `TextInput`,
`ThemeProvider`, `Timeline`, `Toolbar`, `Typography`, and `ValidationSummary`.

The `Layout` server entry exports `Container`, `Grid`, `Inline`, `Section`,
`Stack`, `BentoBox`, and `BentoBoxItem`. Normally interactive entries expose stripped static APIs without
callbacks. See [Next.js Server Components](./server-components.md) for behavior
and examples.

## Barrel Component Exports

The `core` and `next` barrels export the same component names:

| Category                         | Exports                                                                                                                                                                                                                                                                                                                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Providers and text               | `ThemeProvider`, `ToastProvider`, `useToast`, `Typography`                                                                                                                                                                                                                                                                                                                    |
| Actions                          | `Button`, `IconButton`, `ScrollToTop`                                                                                                                                                                                                                                                                                                                                         |
| Forms and inputs                 | `TextInput`, `TextArea`, `SearchInput`, `NumberInput`, `Select`, `MultiSelect`, `ThemeSelect`, `ComboBox`, `FileUpload`, `TagInput`, `InputGroup`, `FieldSet`, `ValidationSummary`, `RadioButton`, `RadioGroup`, `Slider`, `CheckBox`, `Toggle`, `SegmentedControl`, `ColorPicker`, `FormField`, `FormGroup`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `TimePicker` |
| Data, charts, and content        | `DataTable`, `Sparkline`, `BarChart`, `LineChart`, `DonutChart`, `Legend`, `MarkdownRenderer`, `MetricBox`, `Card`, `Avatar`                                                                                                                                                                                                                                                  |
| Feedback and status              | `Alert`, `Chip`, `ChipGroup`, `Badge`, `ProgressBar`, `CircularProgress`, `Rating`, `Skeleton`, `Spinner`, `Tooltip`, `MessagePopup`, `PopOver`, `EmptyState`, `NotificationCenter`, `ToastProvider`, `useToast`                                                                                                                                                              |
| Navigation, overlays, and layout | `AppShell`, `PageHeader`, `BreadCrumbPageHeader`, `NavBar`, `Sidebar`, `Footer`, `Breadcrumbs`, `TreeView`, `Tabs`, `Stepper`, `Timeline`, `Accordion`, `Pager`, `Modal`, `Drawer`, `Portal`, `SplitPane`, `Toolbar`, `Dropdown`, `Menu`, `Divider`, `CommandPalette`, `Container`, `Grid`, `Inline`, `Section`, `Stack`, `BentoBox`, `BentoBoxItem`                                  |

Standalone paths use the same camel-case component names as the barrels.

## Standalone Component Imports

Use standalone imports when you want a direct component path.

```tsx
import Button from "@boreal-ui/core/Button";
import NextButton from "@boreal-ui/next/Button";
```

Standalone component paths:

| Component path         | Core                                   | Next                                   |
| ---------------------- | -------------------------------------- | -------------------------------------- |
| `Accordion`            | `@boreal-ui/core/Accordion`            | `@boreal-ui/next/Accordion`            |
| `Alert`                | `@boreal-ui/core/Alert`                | `@boreal-ui/next/Alert`                |
| `AppShell`             | `@boreal-ui/core/AppShell`             | `@boreal-ui/next/AppShell`             |
| `Avatar`               | `@boreal-ui/core/Avatar`               | `@boreal-ui/next/Avatar`               |
| `Badge`                | `@boreal-ui/core/Badge`                | `@boreal-ui/next/Badge`                |
| `BarChart`             | `@boreal-ui/core/BarChart`             | `@boreal-ui/next/BarChart`             |
| `BreadCrumbPageHeader` | `@boreal-ui/core/BreadCrumbPageHeader` | `@boreal-ui/next/BreadCrumbPageHeader` |
| `Breadcrumbs`          | `@boreal-ui/core/Breadcrumbs`          | `@boreal-ui/next/Breadcrumbs`          |
| `Button`               | `@boreal-ui/core/Button`               | `@boreal-ui/next/Button`               |
| `Card`                 | `@boreal-ui/core/Card`                 | `@boreal-ui/next/Card`                 |
| `CheckBox`             | `@boreal-ui/core/CheckBox`             | `@boreal-ui/next/CheckBox`             |
| `Chip`                 | `@boreal-ui/core/Chip`                 | `@boreal-ui/next/Chip`                 |
| `ChipGroup`            | `@boreal-ui/core/ChipGroup`            | `@boreal-ui/next/ChipGroup`            |
| `CircularProgress`     | `@boreal-ui/core/CircularProgress`     | `@boreal-ui/next/CircularProgress`     |
| `ColorPicker`          | `@boreal-ui/core/ColorPicker`          | `@boreal-ui/next/ColorPicker`          |
| `ComboBox`             | `@boreal-ui/core/ComboBox`             | `@boreal-ui/next/ComboBox`             |
| `CommandPalette`       | `@boreal-ui/core/CommandPalette`       | `@boreal-ui/next/CommandPalette`       |
| `DataTable`            | `@boreal-ui/core/DataTable`            | `@boreal-ui/next/DataTable`            |
| `DatePicker`           | `@boreal-ui/core/DatePicker`           | `@boreal-ui/next/DatePicker`           |
| `DateRangePicker`      | `@boreal-ui/core/DateRangePicker`      | `@boreal-ui/next/DateRangePicker`      |
| `DateTimePicker`       | `@boreal-ui/core/DateTimePicker`       | `@boreal-ui/next/DateTimePicker`       |
| `Divider`              | `@boreal-ui/core/Divider`              | `@boreal-ui/next/Divider`              |
| `DonutChart`           | `@boreal-ui/core/DonutChart`           | `@boreal-ui/next/DonutChart`           |
| `Drawer`               | `@boreal-ui/core/Drawer`               | `@boreal-ui/next/Drawer`               |
| `Dropdown`             | `@boreal-ui/core/Dropdown`             | `@boreal-ui/next/Dropdown`             |
| `EmptyState`           | `@boreal-ui/core/EmptyState`           | `@boreal-ui/next/EmptyState`           |
| `FieldSet`             | `@boreal-ui/core/FieldSet`             | `@boreal-ui/next/FieldSet`             |
| `FileUpload`           | `@boreal-ui/core/FileUpload`           | `@boreal-ui/next/FileUpload`           |
| `Footer`               | `@boreal-ui/core/Footer`               | `@boreal-ui/next/Footer`               |
| `FormField`            | `@boreal-ui/core/FormField`            | `@boreal-ui/next/FormField`            |
| `FormGroup`            | `@boreal-ui/core/FormGroup`            | `@boreal-ui/next/FormGroup`            |
| `IconButton`           | `@boreal-ui/core/IconButton`           | `@boreal-ui/next/IconButton`           |
| `InputGroup`           | `@boreal-ui/core/InputGroup`           | `@boreal-ui/next/InputGroup`           |
| `Layout`               | `@boreal-ui/core/Layout`               | `@boreal-ui/next/Layout`               |
| `Legend`               | `@boreal-ui/core/Legend`               | `@boreal-ui/next/Legend`               |
| `LineChart`            | `@boreal-ui/core/LineChart`            | `@boreal-ui/next/LineChart`            |
| `MarkdownRenderer`     | `@boreal-ui/core/MarkdownRenderer`     | `@boreal-ui/next/MarkdownRenderer`     |
| `Menu`                 | `@boreal-ui/core/Menu`                 | `@boreal-ui/next/Menu`                 |
| `MessagePopup`         | `@boreal-ui/core/MessagePopup`         | `@boreal-ui/next/MessagePopup`         |
| `MetricBox`            | `@boreal-ui/core/MetricBox`            | `@boreal-ui/next/MetricBox`            |
| `Modal`                | `@boreal-ui/core/Modal`                | `@boreal-ui/next/Modal`                |
| `MultiSelect`          | `@boreal-ui/core/MultiSelect`          | `@boreal-ui/next/MultiSelect`          |
| `NavBar`               | `@boreal-ui/core/NavBar`               | `@boreal-ui/next/NavBar`               |
| `NotificationCenter`   | `@boreal-ui/core/NotificationCenter`   | `@boreal-ui/next/NotificationCenter`   |
| `NumberInput`          | `@boreal-ui/core/NumberInput`          | `@boreal-ui/next/NumberInput`          |
| `PageHeader`           | `@boreal-ui/core/PageHeader`           | `@boreal-ui/next/PageHeader`           |
| `Pager`                | `@boreal-ui/core/Pager`                | `@boreal-ui/next/Pager`                |
| `PopOver`              | `@boreal-ui/core/PopOver`              | `@boreal-ui/next/PopOver`              |
| `Portal`               | `@boreal-ui/core/Portal`               | `@boreal-ui/next/Portal`               |
| `ProgressBar`          | `@boreal-ui/core/ProgressBar`          | `@boreal-ui/next/ProgressBar`          |
| `RadioButton`          | `@boreal-ui/core/RadioButton`          | `@boreal-ui/next/RadioButton`          |
| `RadioGroup`           | `@boreal-ui/core/RadioGroup`           | `@boreal-ui/next/RadioGroup`           |
| `Rating`               | `@boreal-ui/core/Rating`               | `@boreal-ui/next/Rating`               |
| `ScrollToTop`          | `@boreal-ui/core/ScrollToTop`          | `@boreal-ui/next/ScrollToTop`          |
| `SearchInput`          | `@boreal-ui/core/SearchInput`          | `@boreal-ui/next/SearchInput`          |
| `SegmentedControl`     | `@boreal-ui/core/SegmentedControl`     | `@boreal-ui/next/SegmentedControl`     |
| `Select`               | `@boreal-ui/core/Select`               | `@boreal-ui/next/Select`               |
| `Sidebar`              | `@boreal-ui/core/Sidebar`              | `@boreal-ui/next/Sidebar`              |
| `Skeleton`             | `@boreal-ui/core/Skeleton`             | `@boreal-ui/next/Skeleton`             |
| `Slider`               | `@boreal-ui/core/Slider`               | `@boreal-ui/next/Slider`               |
| `Sparkline`            | `@boreal-ui/core/Sparkline`            | `@boreal-ui/next/Sparkline`            |
| `Spinner`              | `@boreal-ui/core/Spinner`              | `@boreal-ui/next/Spinner`              |
| `SplitPane`            | `@boreal-ui/core/SplitPane`            | `@boreal-ui/next/SplitPane`            |
| `Stepper`              | `@boreal-ui/core/Stepper`              | `@boreal-ui/next/Stepper`              |
| `Tabs`                 | `@boreal-ui/core/Tabs`                 | `@boreal-ui/next/Tabs`                 |
| `TagInput`             | `@boreal-ui/core/TagInput`             | `@boreal-ui/next/TagInput`             |
| `TextArea`             | `@boreal-ui/core/TextArea`             | `@boreal-ui/next/TextArea`             |
| `TextInput`            | `@boreal-ui/core/TextInput`            | `@boreal-ui/next/TextInput`            |
| `ThemeProvider`        | `@boreal-ui/core/ThemeProvider`        | `@boreal-ui/next/ThemeProvider`        |
| `ThemeSelect`          | `@boreal-ui/core/ThemeSelect`          | `@boreal-ui/next/ThemeSelect`          |
| `Timeline`             | `@boreal-ui/core/Timeline`             | `@boreal-ui/next/Timeline`             |
| `TimePicker`           | `@boreal-ui/core/TimePicker`           | `@boreal-ui/next/TimePicker`           |
| `Toggle`               | `@boreal-ui/core/Toggle`               | `@boreal-ui/next/Toggle`               |
| `ToastProvider`        | `@boreal-ui/core/ToastProvider`        | `@boreal-ui/next/ToastProvider`        |
| `Toolbar`              | `@boreal-ui/core/Toolbar`              | `@boreal-ui/next/Toolbar`              |
| `Tooltip`              | `@boreal-ui/core/Tooltip`              | `@boreal-ui/next/Tooltip`              |
| `TreeView`             | `@boreal-ui/core/TreeView`             | `@boreal-ui/next/TreeView`             |
| `Typography`           | `@boreal-ui/core/Typography`           | `@boreal-ui/next/Typography`           |
| `ValidationSummary`    | `@boreal-ui/core/ValidationSummary`    | `@boreal-ui/next/ValidationSummary`    |

`Layout` standalone paths export the layout primitives: `Container`, `Grid`, `Inline`, `Section`, `Stack`, `BentoBox`, and `BentoBoxItem`.

## Theme and Configuration APIs

| API                            | Import                                                                                                                |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `ThemeProvider`                | `@boreal-ui/core` or `@boreal-ui/next`                                                                                |
| `ThemeSelect`                  | `@boreal-ui/core` or `@boreal-ui/next`                                                                                |
| `borealConfig`                 | `@boreal-ui/core` or `@boreal-ui/next`                                                                                |
| `setBorealStyleConfig`         | `@boreal-ui/core` or `@boreal-ui/next`                                                                                |
| `getBorealStyleConfig`         | `@boreal-ui/core` or `@boreal-ui/next`                                                                                |
| `getThemeInitializationScript` | `@boreal-ui/core` or `@boreal-ui/next`                                                                                |
| `defaultColorSchemes`          | `@boreal-ui/core` or `@boreal-ui/next`                                                                                |
| `registerColorScheme`          | `@boreal-ui/core`, `@boreal-ui/next`, `@boreal-ui/core/registerColorScheme`, or `@boreal-ui/next/registerColorScheme` |

## Generated Prop Docs

Generated prop metadata is available from the optional docs package.

```ts
import {
  buttonPropDocs,
  radioGroupPropDocs,
  themeSelectPropDocs,
  type GeneratedComponentDoc,
} from "@boreal-ui/docs";
```

Prop-doc exports:

`accordionPropDocs`, `alertPropDocs`, `appShellPropDocs`, `avatarPropDocs`, `badgePropDocs`, `barChartPropDocs`, `bentoBoxPropDocs`, `bentoBoxItemPropDocs`, `breadCrumbPageHeaderPropDocs`, `breadcrumbsPropDocs`, `buttonPropDocs`, `cardPropDocs`, `checkBoxPropDocs`, `chipGroupPropDocs`, `chipPropDocs`, `circularProgressPropDocs`, `colorPickerPropDocs`, `comboBoxPropDocs`, `commandPalettePropDocs`, `containerPropDocs`, `dataTablePropDocs`, `datePickerPropDocs`, `dateRangePickerPropDocs`, `dateTimePickerPropDocs`, `dividerPropDocs`, `donutChartPropDocs`, `drawerPropDocs`, `dropdownPropDocs`, `emptyStatePropDocs`, `fieldSetPropDocs`, `fileUploadPropDocs`, `footerPropDocs`, `formFieldPropDocs`, `formGroupPropDocs`, `gridPropDocs`, `iconButtonPropDocs`, `inlinePropDocs`, `inputGroupPropDocs`, `legendPropDocs`, `lineChartPropDocs`, `markdownRendererPropDocs`, `menuPropDocs`, `messagePopupPropDocs`, `metricBoxPropDocs`, `modalPropDocs`, `multiSelectPropDocs`, `navBarPropDocs`, `notificationCenterPropDocs`, `numberInputPropDocs`, `pageHeaderPropDocs`, `pagerPropDocs`, `popOverPropDocs`, `portalPropDocs`, `progressBarPropDocs`, `radioButtonPropDocs`, `radioGroupPropDocs`, `ratingPropDocs`, `scrollToTopPropDocs`, `searchInputPropDocs`, `sectionPropDocs`, `segmentedControlPropDocs`, `selectPropDocs`, `sidebarPropDocs`, `skeletonPropDocs`, `sliderPropDocs`, `sparklinePropDocs`, `spinnerPropDocs`, `splitPanePropDocs`, `stackPropDocs`, `stepperPropDocs`, `tabsPropDocs`, `tagInputPropDocs`, `textAreaPropDocs`, `textInputPropDocs`, `themeSelectPropDocs`, `timePickerPropDocs`, `timelinePropDocs`, `toastProviderPropDocs`, `togglePropDocs`, `toolbarPropDocs`, `tooltipPropDocs`, `treeViewPropDocs`, `typographyPropDocs`, and `validationSummaryPropDocs`.

Use the generated prop docs for component-specific prop tables. Native HTML passthrough attributes remain documented by the published TypeScript declarations rather than being expanded into the metadata. Use this markdown guide for import paths and usage-level orientation.
