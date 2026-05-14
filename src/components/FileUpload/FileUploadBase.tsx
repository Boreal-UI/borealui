import React, { useMemo, useRef, useState, useEffect, useId } from "react";
import { BaseFileUploadProps } from "./FileUpload.types";
import { FileIcon, TrashIcon } from "../../Icons";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultOutline,
  getDefaultGlass,
  getDefaultRounding,
  getDefaultShadow,
  getDefaultTheme,
} from "../../config/boreal-style-config";

const BaseFileUpload: React.FC<BaseFileUploadProps> = ({
  label = "Upload File",
  description,
  error,
  required = false,
  theme = getDefaultTheme(),
  glass = getDefaultGlass(),
  controlRounding = getDefaultRounding(),
  controlShadow = getDefaultShadow(),
  outline = getDefaultOutline(),
  outlineRounding = getDefaultRounding(),
  outlineShadow = getDefaultShadow(),
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

  className,
  ...rest
}) => {
  const reactId = useId();
  const baseId = id || testId || `file-upload-${reactId.replace(/:/g, "")}`;

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<
    { name: string; reason: string }[]
  >([]);
  const [internalProgress, setInternalProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const fileInput = useRef<HTMLInputElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;
  const dropzoneDescriptionId = `${baseId}-dropzone-description`;
  const liveRegionId = `${baseId}-live-region`;
  const fileListId = `${baseId}-file-list`;
  const rejectedListId = `${baseId}-rejected-list`;
  const inputId = `${baseId}-input`;

  const accept = useMemo(() => {
    if (!allowedFileTypes || allowedFileTypes.length === 0) return undefined;
    return allowedFileTypes.join(",");
  }, [allowedFileTypes]);

  const validateFiles = (newFiles: File[]) => {
    const valid: File[] = [];
    const rejected: { name: string; reason: string }[] = [];

    newFiles.forEach((file) => {
      const isSizeOk = file.size <= maxFileSizeBytes;
      const ext = file.name.includes(".")
        ? "." + file.name.split(".").pop()!.toLowerCase()
        : "";
      const typeAllowed =
        allowedFileTypes.length === 0 ||
        allowedFileTypes.includes(file.type) ||
        (ext && allowedFileTypes.map((t) => t.toLowerCase()).includes(ext));

      if (isSizeOk && typeAllowed) {
        valid.push(file);
      } else {
        rejected.push({
          name: file.name,
          reason: !isSizeOk
            ? `Exceeds size limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`
            : `Invalid type (${file.type || ext || "unknown"})`,
        });
      }
    });

    return { valid, rejected };
  };

  const truncate = (s: string) => (s.length > 30 ? s.slice(0, 27) + "..." : s);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const { valid, rejected } = validateFiles(Array.from(selected));
    const updatedFiles = multiple ? [...files, ...valid] : valid;

    setFiles(updatedFiles);
    setFileNames(updatedFiles.map((f) => truncate(f.name)));
    setRejectedFiles(rejected);
    onFilesChange?.(updatedFiles);

    const selectedMessage =
      valid.length > 0 ? buildSelectedMessage(updatedFiles) : null;
    const rejectedMessage = buildRejectedMessage(rejected);

    announce(
      [selectedMessage, rejectedMessage].filter(Boolean).join(" ") || null,
    );

    if (fileInput.current) fileInput.current.value = "";
  };

  const removeFile = (index: number) => {
    const removedFile = files[index];
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setFileNames(updatedFiles.map((f) => truncate(f.name)));
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
    if (!enableDragAndDrop || disabled) return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    if (!enableDragAndDrop || disabled) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!enableDragAndDrop || disabled) return;
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
    if (!files.length || uploading || disabled) return;

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
      announce(successMessage);
    } catch {
      announce(failureMessage);
    } finally {
      if (intervalRef.current) {
        if (uploadProgress === undefined) setInternalProgress(100);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setTimeout(() => setUploading(false), 300);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const containerClassName = useMemo(
    () =>
      combineClassNames(
        classMap.fileUpload,
        state && classMap[state],
        classMap[theme],
        glass && classMap.glass,
        outlineShadow && classMap[`shadow${capitalize(outlineShadow)}`],
        outlineRounding && classMap[`round${capitalize(outlineRounding)}`],
        error && classMap.error,
        isDragging && classMap.dragging,
        disabled && classMap.disabled,
        dropzoneClassName,
        className,
      ),
    [
      classMap,
      theme,
      state,
      glass,
      outlineShadow,
      outlineRounding,
      error,
      isDragging,
      disabled,
      className,
    ],
  );

  const describedBy =
    [
      description ? descriptionId : undefined,
      error ? errorId : undefined,
      dropzoneDescription ? dropzoneDescriptionId : undefined,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const computedAriaInvalid =
    ariaInvalid !== undefined ? ariaInvalid : error ? true : undefined;

  const computedAriaRequired =
    ariaRequired !== undefined ? ariaRequired : required ? true : undefined;

  return (
    <FormGroup
      label={label}
      description={description}
      error={error}
      required={required}
      className={formGroupClassName}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      errorMessageClassName={errorMessageClassName}
      data-testid={testId}
    >
      <div
        {...rest}
        className={containerClassName}
        onDragOver={enableDragAndDrop ? handleDragOver : undefined}
        onDragLeave={enableDragAndDrop ? handleDragLeave : undefined}
        onDrop={enableDragAndDrop ? handleDrop : undefined}
        role={dropzoneRole}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={describedBy}
        aria-errormessage={error ? ariaErrorMessage || errorId : undefined}
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
          aria-errormessage={error ? ariaErrorMessage || errorId : undefined}
          aria-invalid={computedAriaInvalid}
          aria-required={computedAriaRequired}
          data-testid={`${testId}-input`}
        />

        <div
          className={combineClassNames(
            classMap.uploadActions,
            uploadActionsClassName,
          )}
        >
          <Button
            {...selectButtonProps}
            icon={FileIcon}
            size={selectButtonProps?.size ?? "small"}
            theme={theme}
            glass={glass}
            state={error ? "error" : state}
            className={combineClassNames(
              classMap.fileInput,
              selectButtonClassName,
              selectButtonProps?.className,
            )}
            disabled={uploading || disabled}
            outline={outline}
            rounding={controlRounding}
            shadow={controlShadow}
            onClick={() => {
              fileInput.current?.click();
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
              className={combineClassNames(classMap.fileList, fileListClassName)}
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
                    glass={glass}
                    state="error"
                    size={removeButtonProps?.size ?? "small"}
                    type="button"
                    outline
                    aria-label={
                      removeFileAriaLabel?.(name, index) || `Remove ${name}`
                    }
                    onClick={() => removeFile(index)}
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
                glass={glass}
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

            {!uploading && (
              <Button
                {...uploadButtonProps}
                theme={theme}
                glass={glass}
                state={error ? "error" : state}
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
