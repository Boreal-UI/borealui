import { RoundingType, ShadowType, StateType, ThemeType } from "@/types/types";
import React, {
  AriaAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
} from "react";
import { ButtonProps } from "../Button/Button.types";
import { FormGroupProps } from "../FormGroup/FormGroup.types";
import { IconButtonProps } from "../IconButton/IconButton.types";
import { ProgressBarProps } from "../ProgressBar/ProgressBar.types";

/**
 * Props for the FileUpload component.
 */
export interface FileUploadProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "onSubmit" | "onChange">,
    Pick<
      AriaAttributes,
      | "aria-label"
      | "aria-labelledby"
      | "aria-describedby"
      | "aria-errormessage"
      | "aria-invalid"
      | "aria-required"
      | "aria-busy"
      | "aria-live"
    > {
  /**
   * Label displayed above the file input.
   *
   * @default "Upload File"
   */
  label?: string;

  /** Optional description text under the label. */
  helperText?: string;

  /** Optional error message. */
  errorMessage?: string;

  /**
   * Whether the file input is required.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Theme for the buttons and progress bar
   * ('primary' | 'secondary' | 'tertiary' | 'quaternary' | 'clear').
   *
   * @default configured default theme (fallback: "primary")
   */
  theme?: ThemeType;
  /**
   * Surface treatment; glassOutline combines glass and outline.
   *
   * @default configured default variant (fallback: "solid")
   */
  variant?: import("@/types/types").VariantType;
  /**
   * The state of the file upload
   * ('success' | 'error' | 'warning' | 'disabled' | '').
   */
  state?: StateType;

  /**
   * Rounding of the control button
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  controlRounding?: RoundingType;

  /**
   * Shadow of the control button
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  controlShadow?: ShadowType;

  /**
   * Rounding of the wrapping element
   * ('none' | 'small' | 'medium' | 'large' | 'full').
   *
   * @default configured default rounding (fallback: "medium")
   */
  outlineRounding?: RoundingType;

  /**
   * Shadow of the wrapping element
   * ('none' | 'light' | 'medium' | 'strong' | 'intense').
   *
   * @default configured default shadow (fallback: "light")
   */
  outlineShadow?: ShadowType;
  /**
   * Allows multiple file selection if true.
   *
   * @default false
   */
  multiple?: boolean;

  /**
   * Whether to disable the file input.
   *
   * @default false
   */
  disabled?: boolean;

  /** Called after upload completes. */
  onSubmit: (files: File[]) => void | Promise<void>;

  /** Called whenever selected files change. */
  onFilesChange?: (files: File[]) => void;

  /** External upload progress value (overrides internal simulation). */
  uploadProgress?: number;

  /** Additional class names for the outer FormGroup wrapper. */
  formGroupClassName?: string;

  /** Additional class names for the FormGroup label. */
  labelClassName?: string;

  /** Additional class names for the FormGroup description. */
  descriptionClassName?: string;

  /** Additional class names for the FormGroup error message. */
  errorMessageClassName?: string;

  /** Additional class names for the dropzone/root wrapper. */
  dropzoneClassName?: string;

  /** Additional class names for the visually hidden native input. */
  inputClassName?: string;

  /** Additional class names for the upload actions wrapper. */
  uploadActionsClassName?: string;

  /** Additional class names for the select-file button. */
  selectButtonClassName?: string;

  /** Additional class names for the rejected files wrapper. */
  rejectedFilesClassName?: string;

  /** Additional class names for the rejected files label. */
  rejectedLabelClassName?: string;

  /** Additional class names for the rejected files list. */
  rejectedListClassName?: string;

  /** Additional class names for each rejected file item. */
  rejectedItemClassName?: string;

  /** Additional class names for each rejected reason. */
  rejectedReasonClassName?: string;

  /** Additional class names for the upload controls wrapper. */
  uploadControlsClassName?: string;

  /** Additional class names for the selected files list. */
  fileListClassName?: string;

  /** Additional class names for each selected file item. */
  fileListItemClassName?: string;

  /** Additional class names for each remove-file button. */
  removeButtonClassName?: string;

  /** Additional class names for the upload progress bar. */
  uploadProgressClassName?: string;

  /** Additional class names for the upload button. */
  uploadButtonClassName?: string;

  /**
   * Optional test ID for testing frameworks.
   *
   * @default dataTestId ?? "file-upload"
   */
  testId?: string;

  /** Backward-compatible alias for test ID attributes. */
  "data-testid"?: string;

  /**
   * Maximum file size in bytes (e.g., 5MB = 5 * 1024 * 1024).
   *
   * @default Infinity
   */
  maxFileSizeBytes?: number;

  /**
   * Allowed file MIME types or file extensions (e.g. ".pdf", "image/png").
   *
   * @default []
   */
  allowedFileTypes?: string[];

  /** Optional custom id for the root/input relationship. */
  id?: string;

  /** Accessible label for the hidden native file input when no visible label is used. */
  inputAriaLabel?: string;

  /** Accessible label for the upload trigger button. */
  selectButtonAriaLabel?: string;

  /** Accessible label for the submit/upload button. */
  uploadButtonAriaLabel?: string;

  /** Accessible label template for remove buttons. */
  removeFileAriaLabel?: (fileName: string, index: number) => string;

  /** Accessible label for the selected files list. */
  fileListAriaLabel?: string;

  /** Accessible label for the rejected files list. */
  rejectedFilesAriaLabel?: string;

  /**
   * Status message announced when upload succeeds.
   *
   * @default "Upload successful."
   */
  successMessage?: string;

  /**
   * Status message announced when upload fails.
   *
   * @default "Upload failed. Please try again."
   */
  failureMessage?: string;

  /** Message announced when files are selected. */
  filesSelectedMessage?: (files: File[]) => string;

  /** Message announced when a file is removed. */
  fileRemovedMessage?: (fileName: string, index: number) => string;

  /** Message announced when rejected files are detected. */
  rejectedFilesMessage?: (files: { name: string; reason: string }[]) => string;

  /**
   * Live region politeness for status updates.
   *
   * @default "polite"
   */
  liveRegionPoliteness?: "polite" | "assertive" | "off";

  /** Optional custom instructions for drag-and-drop users and assistive tech. */
  dropzoneDescription?: string;

  /**
   * Whether the dropzone should expose a button-like role.
   *
   * @default "group"
   */
  dropzoneRole?: "group" | "button" | "region";

  /**
   * Whether drag and drop is enabled.
   *
   * @default true
   */
  enableDragAndDrop?: boolean;

  /** Props passed directly to the native file input. */
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "multiple"
    | "accept"
    | "required"
    | "disabled"
    | "onChange"
    | "aria-label"
    | "aria-labelledby"
    | "aria-describedby"
    | "aria-errormessage"
    | "aria-invalid"
    | "aria-required"
  >;

  /** Props passed directly to the select-file button. */
  selectButtonProps?: Omit<
    ButtonProps,
    | "children"
    | "onClick"
    | "disabled"
    | "theme"
    | "state"
    | "outline"
    | "rounding"
    | "shadow"
    | "icon"
  >;

  /** Props passed directly to the upload button. */
  uploadButtonProps?: Omit<
    ButtonProps,
    "children" | "onClick" | "disabled" | "loading" | "theme" | "state"
  >;

  /** Props passed directly to each remove-file button. */
  removeButtonProps?: Omit<
    IconButtonProps,
    "icon" | "onClick" | "aria-label" | "state"
  >;

  /** Props passed directly to the progress bar. */
  progressBarProps?: Omit<
    ProgressBarProps,
    "value" | "theme" | "indeterminate"
  >;
  invalid?: boolean;
}

export interface BaseFileUploadProps extends FileUploadProps {
  /**
   * Form Group prop for BaseFileUpload.
   */
  FormGroup: React.ComponentType<FormGroupProps>;
  /**
   * Button component dependency injected by the wrapper.
   */
  Button: React.ComponentType<ButtonProps>;
  /**
   * Icon Button component dependency injected by the wrapper.
   */
  IconButton: React.ComponentType<IconButtonProps>;
  /**
   * Progress Bar component dependency injected by the wrapper.
   */
  ProgressBar: React.ComponentType<ProgressBarProps>;
  /**
   * Framework-specific class name map supplied by the core or Next wrapper.
   */
  classMap: Record<string, string>;
}
