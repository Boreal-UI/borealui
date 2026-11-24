import React, { useMemo, useRef, useState, useEffect, useId } from "react";
import { BaseFileUploadProps } from "./FileUpload.types";
import { FileIcon, TrashIcon } from "../../Icons";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import { composeEventHandlers } from "../../utils/eventHandlers";
import {
  getDefaultVariant,
  getDefaultRounding,
  getShadowClassName,
  getDefaultTheme,
} from "../../config/boreal-style-config";
import { validateFiles } from "./fileValidation";

const BaseFileUpload: React.FC<BaseFileUploadProps> = ({
  label = "Upload File",
  helperText,
  errorMessage,
  required = false,
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
  controlRounding = getDefaultRounding(),
  controlShadow,
  outlineRounding = getDefaultRounding(),
  outlineShadow,
  state,
  multiple = false,
  maxFileSizeBytes = Infinity,
  allowedFileTypes = [],
  onSubmit,
  onFilesChange,
  uploadProgress,
  formGroupClassName,
  labelClassName,
  descriptionClassName,
  errorMessageClassName,
  dropzoneClassName,
  inputClassName,
  uploadActionsClassName,
  selectButtonClassName,
  rejectedFilesClassName,
  rejectedLabelClassName,
  rejectedListClassName,
  rejectedItemClassName,
  rejectedReasonClassName,
  uploadControlsClassName,
  fileListClassName,
  fileListItemClassName,
  removeButtonClassName,
  uploadProgressClassName,
  uploadButtonClassName,
  "data-testid": dataTestId,
  testId = dataTestId ?? "file-upload",
  id,
  FormGroup,
  disabled = false,
  Button,
  IconButton,
  ProgressBar,
  classMap,

  // a11y props
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-errormessage": ariaErrorMessage,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  "aria-busy": ariaBusy,
  "aria-live": ariaLive,

  inputAriaLabel,
  selectButtonAriaLabel,
  uploadButtonAriaLabel,
  removeFileAriaLabel,
  fileListAriaLabel,
  rejectedFilesAriaLabel,
  successMessage = "Upload successful.",
  failureMessage = "Upload failed. Please try again.",
  filesSelectedMessage,
  fileRemovedMessage,
  rejectedFilesMessage,
  liveRegionPoliteness = "polite",
  dropzoneDescription,
  dropzoneRole = "group",
  enableDragAndDrop = true,

  inputProps,
  selectButtonProps,
  uploadButtonProps,
  removeButtonProps,
  progressBarProps,

  onDragOver: consumerOnDragOver,
  onDragLeave: consumerOnDragLeave,
  onDrop: consumerOnDrop,
  className,
  ...rest
}) => {
  const reactId = useId();
  const baseId = id ?? `file-upload-${reactId.replace(/:/g, "")}`;

  const [files, setFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<
    { name: string; reason: string }[]
  >([]);
  const [internalProgress, setInternalProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement | null>(null);
  const pickerInput = useRef<HTMLInputElement | null>(null);
  const isEffectivelyDisabled = () => disabled || Boolean(fileInput.current?.matches(":disabled"));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);
  const uploadResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const truncate = (value: string) =>
    value.length > 30 ? `${value.slice(0, 27)}...` : value;

  const descriptionId = `${baseId}-helperText`;
  const errorId = `${baseId}-errorMessage`;
  const dropzoneDescriptionId = `${baseId}-dropzone-helperText`;
  const liveRegionId = `${baseId}-live-region`;
  const fileListId = `${baseId}-file-list`;
  const rejectedListId = `${baseId}-rejected-list`;
  const inputId = `${baseId}-input`;

  const accept = useMemo(() => {
    if (!allowedFileTypes || allowedFileTypes.length === 0) return undefined;
    return allowedFileTypes.join(",");
  }, [allowedFileTypes]);

  const fileNames = useMemo(
    () => files.map((file) => truncate(file.name)),
    [files],
  );

  const announce = (message: string | null) => {
    setUploadMessage(message);
  };

  const buildSelectedMessage = (selectedFiles: File[]) => {
    if (filesSelectedMessage) return filesSelectedMessage(selectedFiles);
    const count = selectedFiles.length;
    return count === 1
      ? `${selectedFiles[0].name} selected.`
      : `${count} files selected.`;
  };

  const buildRejectedMessage = (
    nextRejectedFiles: { name: string; reason: string }[],
  ) => {
    if (nextRejectedFiles.length === 0) return null;
    if (rejectedFilesMessage) return rejectedFilesMessage(nextRejectedFiles);
    return nextRejectedFiles.length === 1
      ? `${nextRejectedFiles[0].name} was rejected: ${nextRejectedFiles[0].reason}.`
      : `${nextRejectedFiles.length} files were rejected.`;
  };

  const syncNativeFiles = (selection: File[]) => {
    const input = fileInput.current;
    if (!input) return;
    if (selection.length === 0) {
      input.value = "";
    } else if (typeof DataTransfer !== "undefined") {
      const transfer = new DataTransfer();
      selection.forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
    }
  };

  useEffect(() => {
    const form = fileInput.current?.form;
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (event.defaultPrevented || !isMountedRef.current) return;
        syncNativeFiles([]);
        setFiles([]);
        setRejectedFiles([]);
        setUploadMessage(null);
        onFilesChange?.([]);
      });
    };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [onFilesChange, inputProps?.form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEffectivelyDisabled() || uploading) return;
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const { valid, rejected } = validateFiles(Array.from(selected), {
      allowedFileTypes,
      maxFileSizeBytes,
    });
    const accepted = multiple ? valid : valid.slice(0, 1);
    if (!multiple) {
      rejected.push(
        ...valid.slice(1).map((file) => ({
          name: file.name,
          reason: "Only one file can be selected",
        })),
      );
    }
    const updatedFiles = multiple ? [...files, ...accepted] : accepted;
    syncNativeFiles(updatedFiles);

    setFiles(updatedFiles);
    setRejectedFiles(rejected);
    onFilesChange?.(updatedFiles);

    const selectedMessage =
      valid.length > 0 ? buildSelectedMessage(updatedFiles) : null;
    const rejectedMessage = buildRejectedMessage(rejected);

    announce(
      [selectedMessage, rejectedMessage].filter(Boolean).join(" ") || null,
    );
  };

  const removeFile = (index: number) => {
    if (isEffectivelyDisabled() || uploading) return;
    const removedFile = files[index];
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    syncNativeFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    if (removedFile) {
      announce(
        fileRemovedMessage
          ? fileRemovedMessage(removedFile.name, index)
          : `${removedFile.name} removed.`,
      );
    }
  };

  const getButtonLabel = () => {
    if (fileNames.length > 0) return multiple ? "Add Files" : "Select New";
    return "Choose File";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!enableDragAndDrop || isEffectivelyDisabled()) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    if (!enableDragAndDrop || isEffectivelyDisabled()) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!enableDragAndDrop || isEffectivelyDisabled()) return;
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileChange({
        target: { files: droppedFiles },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleUpload = async () => {
    if (!files.length || uploading || isEffectivelyDisabled()) return;

    setUploading(true);
    setInternalProgress(0);
    announce(null);

    try {
      if (uploadProgress === undefined) {
        intervalRef.current = setInterval(() => {
          setInternalProgress((prev) => {
            if (prev >= 100) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              return 100;
            }
            return prev + 10;
          });
        }, 100);
      }

      await Promise.resolve(onSubmit?.(files));
      if (isMountedRef.current) announce(successMessage);
    } catch {
      if (isMountedRef.current) announce(failureMessage);
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        if (isMountedRef.current && uploadProgress === undefined) {
          setInternalProgress(100);
        }
      }

      if (isMountedRef.current) {
        if (uploadResetTimerRef.current !== null) {
          clearTimeout(uploadResetTimerRef.current);
        }
        uploadResetTimerRef.current = setTimeout(() => {
          uploadResetTimerRef.current = null;
          setUploading(false);
        }, 300);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (uploadResetTimerRef.current !== null) {
        clearTimeout(uploadResetTimerRef.current);
      }
    };
  }, []);

  const containerClassName = useMemo(
    () =>
      combineClassNames(
        classMap.fileUpload,
        state && classMap[state],
        classMap[theme],
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        getShadowClassName(classMap, theme, outlineShadow),
        outlineRounding && classMap[`round${capitalize(outlineRounding)}`],
        errorMessage && classMap.error,
        isDragging && classMap.dragging,
        disabled && classMap.disabled,
        dropzoneClassName,
        className,
      ),
    [
      classMap,
      theme,
      state,
      variant,
      outlineShadow,
      outlineRounding,
      errorMessage,
      isDragging,
      disabled,
      dropzoneClassName,
      className,
    ],
  );

  const describedBy =
    [
      helperText ? descriptionId : undefined,
      errorMessage ? errorId : undefined,
      dropzoneDescription ? dropzoneDescriptionId : undefined,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const computedAriaInvalid =
    ariaInvalid !== undefined ? ariaInvalid : errorMessage ? true : undefined;

  const computedAriaRequired =
    ariaRequired !== undefined ? ariaRequired : required ? true : undefined;

  return (
    <FormGroup
      label={label}
      helperText={helperText}
      errorMessage={errorMessage}
      required={required}
      className={formGroupClassName}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      errorMessageClassName={errorMessageClassName}
      data-testid={testId}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        {...rest}
        className={containerClassName}
        onDragOver={composeEventHandlers(
          consumerOnDragOver,
          enableDragAndDrop ? handleDragOver : undefined,
        )}
        onDragLeave={composeEventHandlers(
          consumerOnDragLeave,
          enableDragAndDrop ? handleDragLeave : undefined,
        )}
        onDrop={composeEventHandlers(
          consumerOnDrop,
          enableDragAndDrop ? handleDrop : undefined,
        )}
        role={dropzoneRole}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
        aria-errormessage={
          errorMessage ? ariaErrorMessage || errorId : undefined
        }
        aria-invalid={computedAriaInvalid}
        aria-required={computedAriaRequired}
        aria-busy={ariaBusy !== undefined ? ariaBusy : uploading || undefined}
        data-testid={testId ? `${testId}-wrapper` : undefined}
      >
        {dropzoneDescription && (
          <div id={dropzoneDescriptionId} className="sr_only">
            {dropzoneDescription}
          </div>
        )}

        <input
          {...inputProps}
          ref={fileInput}
          id={inputProps?.id || inputId}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          className={combineClassNames(
            classMap.hiddenInput,
            inputClassName,
            inputProps?.className,
          )}
          required={required}
          disabled={disabled}
          aria-label={inputAriaLabel || label || "Choose file"}
          aria-describedby={describedBy}
          aria-errormessage={
            errorMessage ? ariaErrorMessage || errorId : undefined
          }
          aria-invalid={computedAriaInvalid}
          aria-required={computedAriaRequired}
          data-testid={`${testId}-input`}
        />

        {/* An unnamed picker permits reselection without clearing the successful control. */}
        <input
          ref={pickerInput}
          type="file"
          hidden
          tabIndex={-1}
          aria-label="Select files"
          multiple={multiple}
          accept={accept}
          disabled={disabled || uploading}
          onChange={handleFileChange}
        />

        <div
          className={combineClassNames(
            classMap.uploadActions,
            uploadActionsClassName,
          )}
        >
          <Button
            {...selectButtonProps}
            type="button"
            icon={FileIcon}
            size={selectButtonProps?.size ?? "small"}
            theme={theme}
            state={errorMessage ? "error" : state}
            className={combineClassNames(
              classMap.fileInput,
              selectButtonClassName,
              selectButtonProps?.className,
            )}
            disabled={uploading || disabled}
            variant={variant}
            rounding={controlRounding}
            shadow={controlShadow}
            onClick={() => {
              if (isEffectivelyDisabled() || uploading) return;
              if (pickerInput.current) {
                pickerInput.current.value = "";
                pickerInput.current.click();
              }
            }}
            aria-label={
              selectButtonProps?.["aria-label"] ||
              selectButtonAriaLabel ||
              "Choose file"
            }
            aria-describedby={fileNames.length > 0 ? fileListId : undefined}
            data-testid={`${testId}-file-button`}
          >
            {getButtonLabel()}
          </Button>
        </div>

        {rejectedFiles.length > 0 && (
          <div
            className={combineClassNames(
              classMap.rejectedFiles,
              rejectedFilesClassName,
            )}
            aria-label={rejectedFilesAriaLabel}
            data-testid={testId ? `${testId}-rejected-files` : undefined}
          >
            <p
              className={combineClassNames(
                classMap.rejectedLabel,
                rejectedLabelClassName,
              )}
            >
              Rejected Files:
            </p>
            <ul
              id={rejectedListId}
              className={combineClassNames(
                classMap.rejectedList,
                rejectedListClassName,
              )}
              aria-label={rejectedFilesAriaLabel || "Rejected files"}
            >
              {rejectedFiles.map((file, index) => (
                <li
                  key={index}
                  className={combineClassNames(
                    classMap.rejectedItem,
                    rejectedItemClassName,
                  )}
                >
                  <span>{file.name}</span>
                  <span
                    className={combineClassNames(
                      classMap.rejectedReason,
                      rejectedReasonClassName,
                    )}
                  >
                    {" "}
                    – {file.reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {fileNames.length > 0 && (
          <div
            className={combineClassNames(
              classMap.uploadControls,
              uploadControlsClassName,
            )}
            data-testid={testId ? `${testId}-controls` : undefined}
          >
            <ul
              id={fileListId}
              className={combineClassNames(
                classMap.fileList,
                fileListClassName,
              )}
              aria-label={fileListAriaLabel || "Selected files"}
            >
              {fileNames.map((name, index) => (
                <li
                  key={index}
                  className={combineClassNames(
                    classMap.fileListItem,
                    fileListItemClassName,
                  )}
                >
                  <span>{name}</span>
                  <IconButton
                    {...removeButtonProps}
                    icon={TrashIcon}
                    state="error"
                    size={removeButtonProps?.size ?? "small"}
                    type="button"
                    variant="outline"
                    aria-label={
                      removeFileAriaLabel?.(name, index) || `Remove ${name}`
                    }
                    onClick={() => removeFile(index)}
                    disabled={disabled || uploading}
                    className={combineClassNames(
                      classMap.removeButton,
                      removeButtonClassName,
                      removeButtonProps?.className,
                    )}
                    data-testid={`${testId}-remove-${index}`}
                  />
                </li>
              ))}
            </ul>

            {uploading && (
              <ProgressBar
                {...progressBarProps}
                theme={theme}
                variant={variant}
                className={combineClassNames(
                  classMap.uploadProgress,
                  uploadProgressClassName,
                  progressBarProps?.className,
                )}
                value={uploadProgress ?? internalProgress}
                indeterminate={uploadProgress === undefined}
                data-testid={
                  progressBarProps?.["data-testid"] || `${testId}-progress`
                }
              />
            )}

            {!uploading && onSubmit && (
              <Button
                {...uploadButtonProps}
                type="button"
                theme={theme}
                variant={variant}
                state={errorMessage ? "error" : state}
                disabled={disabled || files.length === 0}
                onClick={() => {
                  void handleUpload();
                }}
                loading={uploading}
                size={uploadButtonProps?.size ?? "small"}
                className={combineClassNames(
                  classMap.uploadButton,
                  uploadButtonClassName,
                  uploadButtonProps?.className,
                )}
                aria-label={uploadButtonAriaLabel || "Upload selected files"}
                data-testid={`${testId}-upload-button`}
              >
                Upload
              </Button>
            )}
          </div>
        )}

        <div
          id={liveRegionId}
          className="sr_only"
          aria-live={ariaLive || liveRegionPoliteness}
          aria-atomic="true"
          data-testid={testId ? `${testId}-upload-message` : undefined}
        >
          {uploadMessage}
        </div>
      </div>
    </FormGroup>
  );
};

BaseFileUpload.displayName = "BaseFileUpload";
export default BaseFileUpload;
