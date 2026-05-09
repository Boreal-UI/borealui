# Public API Reference

This page lists the public API surfaces Boreal UI publishes for consumers and documentation tooling. The generated TypeScript declarations and `package.json` exports remain the source of truth; this guide explains how those APIs are intended to be imported.

## Primary Entry Points

| Entry point | Use |
| --- | --- |
| `boreal-ui` | Root entry. Currently resolves to the core React build. |
| `boreal-ui/core` | Standard React component barrel. |
| `boreal-ui/next` | Next.js component barrel with client-boundary-safe wrappers. |
| `boreal-ui/core/globals.css` | Core global stylesheet. Import once. |
| `boreal-ui/next/globals.css` | Next global stylesheet. Import once. |
| `boreal-ui/core/types` | Shared public type declarations. |
| `boreal-ui/next/types` | Shared public type declarations for Next consumers. |
| `boreal-ui/docs` | Generated component prop metadata. |

Prefer the explicit `core` or `next` entry in application code.

```tsx
import "boreal-ui/core/globals.css";
import { Button, Card, ThemeProvider } from "boreal-ui/core";
```

```tsx
"use client";

import "boreal-ui/next/globals.css";
import { Button, Card, ThemeProvider } from "boreal-ui/next";
```

## Barrel Component Exports

The `core` and `next` barrels export the same component names:

| Category | Exports |
| --- | --- |
| Providers and text | `ThemeProvider`, `Typography` |
| Actions | `Button`, `IconButton`, `ScrollToTop` |
| Forms and inputs | `TextInput`, `TextArea`, `Select`, `ThemeSelect`, `FileUpload`, `TagInput`, `RadioButton`, `RadioGroup`, `Slider`, `Checkbox`, `ColorPicker`, `FormGroup`, `DateTimePicker` |
| Data and content | `DataTable`, `MarkdownRenderer`, `MetricBox`, `Card`, `Avatar` |
| Feedback and status | `Chip`, `ChipGroup`, `Badge`, `Progressbar`, `CircularProgress`, `Rating`, `Skeleton`, `Spinner`, `Tooltip`, `MessagePopup`, `PopOver`, `EmptyState`, `NotificationCenter` |
| Navigation and layout | `Navbar`, `Sidebar`, `Footer`, `Breadcrumbs`, `Tabs`, `Stepper`, `Timeline`, `Accordion`, `Pager`, `Modal`, `Toggle`, `Toolbar`, `Dropdown`, `Divider`, `CommandPalette` |

Some barrel names preserve existing casing for compatibility. The standalone paths below use the casing exposed by the package export map.

## Standalone Component Imports

Use standalone imports when you want a direct component path.

```tsx
import Button from "boreal-ui/core/Button";
import NextButton from "boreal-ui/next/Button";
```

Standalone component paths:

| Component path | Core | Next |
| --- | --- | --- |
| `Accordion` | `boreal-ui/core/Accordion` | `boreal-ui/next/Accordion` |
| `Avatar` | `boreal-ui/core/Avatar` | `boreal-ui/next/Avatar` |
| `Badge` | `boreal-ui/core/Badge` | `boreal-ui/next/Badge` |
| `Breadcrumbs` | `boreal-ui/core/Breadcrumbs` | `boreal-ui/next/Breadcrumbs` |
| `Button` | `boreal-ui/core/Button` | `boreal-ui/next/Button` |
| `Card` | `boreal-ui/core/Card` | `boreal-ui/next/Card` |
| `CheckBox` | `boreal-ui/core/CheckBox` | `boreal-ui/next/CheckBox` |
| `Chip` | `boreal-ui/core/Chip` | `boreal-ui/next/Chip` |
| `CircularProgress` | `boreal-ui/core/CircularProgress` | `boreal-ui/next/CircularProgress` |
| `ColorPicker` | `boreal-ui/core/ColorPicker` | `boreal-ui/next/ColorPicker` |
| `CommandPalette` | `boreal-ui/core/CommandPalette` | `boreal-ui/next/CommandPalette` |
| `DataTable` | `boreal-ui/core/DataTable` | `boreal-ui/next/DataTable` |
| `DateTimePicker` | `boreal-ui/core/DateTimePicker` | `boreal-ui/next/DateTimePicker` |
| `Divider` | `boreal-ui/core/Divider` | `boreal-ui/next/Divider` |
| `Dropdown` | `boreal-ui/core/Dropdown` | `boreal-ui/next/Dropdown` |
| `EmptyState` | `boreal-ui/core/EmptyState` | `boreal-ui/next/EmptyState` |
| `FileUpload` | `boreal-ui/core/FileUpload` | `boreal-ui/next/FileUpload` |
| `Footer` | `boreal-ui/core/Footer` | `boreal-ui/next/Footer` |
| `FormGroup` | `boreal-ui/core/FormGroup` | `boreal-ui/next/FormGroup` |
| `IconButton` | `boreal-ui/core/IconButton` | `boreal-ui/next/IconButton` |
| `MarkdownRenderer` | `boreal-ui/core/MarkdownRenderer` | `boreal-ui/next/MarkdownRenderer` |
| `MessagePopUp` | `boreal-ui/core/MessagePopUp` | `boreal-ui/next/MessagePopUp` |
| `MetricBox` | `boreal-ui/core/MetricBox` | `boreal-ui/next/MetricBox` |
| `Modal` | `boreal-ui/core/Modal` | `boreal-ui/next/Modal` |
| `NavBar` | `boreal-ui/core/NavBar` | `boreal-ui/next/NavBar` |
| `NotificationCenter` | `boreal-ui/core/NotificationCenter` | `boreal-ui/next/NotificationCenter` |
| `Pager` | `boreal-ui/core/Pager` | `boreal-ui/next/Pager` |
| `PopOver` | `boreal-ui/core/PopOver` | `boreal-ui/next/PopOver` |
| `ProgressBar` | `boreal-ui/core/ProgressBar` | `boreal-ui/next/ProgressBar` |
| `RadioButton` | `boreal-ui/core/RadioButton` | `boreal-ui/next/RadioButton` |
| `RadioGroup` | `boreal-ui/core/RadioGroup` | `boreal-ui/next/RadioGroup` |
| `Rating` | `boreal-ui/core/Rating` | `boreal-ui/next/Rating` |
| `ScrollToTop` | `boreal-ui/core/ScrollToTop` | `boreal-ui/next/ScrollToTop` |
| `Select` | `boreal-ui/core/Select` | `boreal-ui/next/Select` |
| `Sidebar` | `boreal-ui/core/Sidebar` | `boreal-ui/next/Sidebar` |
| `Skeleton` | `boreal-ui/core/Skeleton` | `boreal-ui/next/Skeleton` |
| `Slider` | `boreal-ui/core/Slider` | `boreal-ui/next/Slider` |
| `Spinner` | `boreal-ui/core/Spinner` | `boreal-ui/next/Spinner` |
| `Stepper` | `boreal-ui/core/Stepper` | `boreal-ui/next/Stepper` |
| `Tabs` | `boreal-ui/core/Tabs` | `boreal-ui/next/Tabs` |
| `TagInput` | `boreal-ui/core/TagInput` | `boreal-ui/next/TagInput` |
| `TextArea` | `boreal-ui/core/TextArea` | `boreal-ui/next/TextArea` |
| `TextInput` | `boreal-ui/core/TextInput` | `boreal-ui/next/TextInput` |
| `ThemeProvider` | `boreal-ui/core/ThemeProvider` | `boreal-ui/next/ThemeProvider` |
| `Timeline` | `boreal-ui/core/Timeline` | `boreal-ui/next/Timeline` |
| `Toggle` | `boreal-ui/core/Toggle` | `boreal-ui/next/Toggle` |
| `Toolbar` | `boreal-ui/core/Toolbar` | `boreal-ui/next/Toolbar` |
| `Tooltip` | `boreal-ui/core/Tooltip` | `boreal-ui/next/Tooltip` |
| `Typography` | `boreal-ui/core/Typography` | `boreal-ui/next/Typography` |

`ThemeSelect` and `ChipGroup` are barrel exports. Import them from `boreal-ui/core` or `boreal-ui/next`.

## Theme and Configuration APIs

| API | Import |
| --- | --- |
| `ThemeProvider` | `boreal-ui/core` or `boreal-ui/next` |
| `ThemeSelect` | `boreal-ui/core` or `boreal-ui/next` |
| `borealConfig` | `boreal-ui/core` or `boreal-ui/next` |
| `setBorealStyleConfig` | `boreal-ui/core` or `boreal-ui/next` |
| `getBorealStyleConfig` | `boreal-ui/core` or `boreal-ui/next` |
| `getThemeInitializationScript` | `boreal-ui/core` or `boreal-ui/next` |
| `defaultColorSchemes` | `boreal-ui/core` or `boreal-ui/next` |
| `registerColorScheme` | `boreal-ui/core`, `boreal-ui/next`, `boreal-ui/core/registerColorScheme`, or `boreal-ui/next/registerColorScheme` |

The misspelled `registerColorSheme` standalone path remains available for backward compatibility. New code should use `registerColorScheme`.

## Generated Prop Docs

Generated prop metadata is available from `boreal-ui/docs` and from the `core` and `next` barrels.

```ts
import {
  buttonPropDocs,
  radioGroupPropDocs,
  themeSelectPropDocs,
  type GeneratedComponentDoc,
} from "boreal-ui/docs";
```

Prop-doc exports:

`accordionPropDocs`, `avatarPropDocs`, `badgePropDocs`, `breadcrumbsPropDocs`, `buttonPropDocs`, `cardPropDocs`, `checkBoxPropDocs`, `chipPropDocs`, `chipGroupPropDocs`, `circularProgressPropDocs`, `colorPickerPropDocs`, `commandPalettePropDocs`, `dataTablePropDocs`, `dateTimePickerPropDocs`, `dividerPropDocs`, `dropdownPropDocs`, `emptyStatePropDocs`, `fileUploadPropDocs`, `footerPropDocs`, `formGroupPropDocs`, `iconButtonPropDocs`, `markdownRendererPropDocs`, `messagePopupPropDocs`, `metricBoxPropDocs`, `modalPropDocs`, `navBarPropDocs`, `notificationCenterPropDocs`, `pagerPropDocs`, `popoverPropDocs`, `progressBarPropDocs`, `radioButtonPropDocs`, `radioGroupPropDocs`, `ratingPropDocs`, `scrollToTopPropDocs`, `selectPropDocs`, `sidebarPropDocs`, `skeletonPropDocs`, `sliderPropDocs`, `spinnerPropDocs`, `stepperPropDocs`, `tabsPropDocs`, `tagInputPropDocs`, `textAreaPropDocs`, `textInputPropDocs`, `themeSelectPropDocs`, `timelinePropDocs`, `togglePropDocs`, `toolbarPropDocs`, `tooltipPropDocs`, and `typographyPropDocs`.

Use the generated prop docs for exhaustive prop tables. Use this markdown guide for import paths and usage-level orientation.
