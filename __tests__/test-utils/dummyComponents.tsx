import React from "react";
import type { ButtonProps } from "@/components/Button/Button.types";
import type { IconButtonProps } from "@/components/IconButton/IconButton.types";
import type { SkeletonProps } from "@/components/Skeleton/Skeleton.types";
import type { FormGroupProps } from "@/components/FormGroup/FormGroup.types";
import type { ProgressBarProps } from "@/components/ProgressBar/ProgressBar.types";
import type { ThemeSelectProps } from "@/components/Select/Select.types";
import type { ChipBaseProps } from "@/core/Chip";
import type { TextInputProps } from "@/core/TextInput";
import { AvatarProps } from "@/components/Avatar/Avatar.types";

/**
 * Simple SVG icon mock for tests.
 * Useful when a component expects an icon component but the actual icon implementation
 * is not important for the test.
 */
export const DummyIcon = ({
  className = "",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    data-testid="dummy-icon"
    className={className}
    aria-hidden={true}
    {...props}
  />
);

DummyIcon.displayName = "DummyIcon";

/**
 * Minimal anchor wrapper used in tests for components that accept a custom link component.
 * This helps simulate navigation behavior without bringing in framework-specific routing.
 */
export const DummyLinkComponent = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a href={href} {...props}>
    {children}
  </a>
);

/**
 * Basic button mock that forwards refs and preserves children.
 * Intended for components that accept a custom Button implementation.
 */
export const DummyButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps & {
    "data-testid"?: string;
  }
>(
  (
    {
      children,
      "aria-label": ariaLabel,
      disabled,
      href,
      theme,
      outline,
      state,
      rounding,
      shadow,
      size,
      glass,
      loading,
      isExternal,
      onClick,
      ...props
    },
    ref,
  ) => {
    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          data-theme={theme}
          data-outline={outline ? "true" : "false"}
          data-glass={glass ? "true" : "false"}
          href={href}
          aria-label={ariaLabel}
          onClick={(e) => {
            e.preventDefault();
            onClick?.(e as React.MouseEvent<HTMLElement>);
          }}
          tabIndex={disabled ? -1 : undefined}
          aria-disabled={disabled ? "true" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        data-theme={theme}
        data-outline={outline ? "true" : "false"}
        data-glass={glass ? "true" : "false"}
        aria-label={ariaLabel}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);

DummyButton.displayName = "DummyButton";

/**
 * Minimal icon button mock used for tests.
 *
 * Behavior:
 * - Renders an anchor when `href` is provided
 * - Renders a button otherwise
 * - Renders the passed icon component when available
 *
 * This is useful for testing components that accept a custom IconButton implementation
 * without depending on the real styling or framework-specific behavior.
 */
export const DummyIconButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IconButtonProps
>(
  (
    {
      icon: Icon,
      href,
      disabled,
      outline,
      glass,
      theme,
      state,
      rounding,
      shadow,
      size,
      loading,
      isExternal,
      tooltip,
      rel,
      target,
      onClick,
      ...props
    },
    ref,
  ) => {
    const testId = props["data-testid"];

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={disabled ? undefined : href}
          tabIndex={disabled ? -1 : props.tabIndex}
          aria-disabled={disabled || undefined}
          rel={rel}
          data-glass={glass ? "true" : "false"}
          onClick={(e) => {
            e.preventDefault();
            onClick?.(e as React.MouseEvent<HTMLElement>);
          }}
          target={target}
          {...props}
        >
          {Icon ? <Icon data-testid={`${testId}-icon`} /> : null}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        data-glass={glass ? "true" : "false"}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        {...props}
      >
        {Icon ? <Icon data-testid={`${testId}-icon`} /> : null}
      </button>
    );
  },
);

DummyIconButton.displayName = "DummyIconButton";

/**
 * Lightweight skeleton placeholder for testing loading states.
 * Only preserves dimensions and test id, since visual styling is not relevant in unit tests.
 */
export const DummySkeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  "data-testid": testId,
}) => (
  <div
    data-testid={testId ?? "skeleton"}
    style={{ width, height }}
    aria-hidden={true}
  />
);

DummySkeleton.displayName = "DummySkeleton";

/**
 * Props for the dummy image component.
 * Includes an optional `fill` prop to mimic image APIs such as Next.js Image.
 */
type DummyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
};

/**
 * Minimal image mock used for tests.
 * Preserves src, alt, and common image props while exposing whether `fill` was requested.
 */
export const DummyImage: React.FC<DummyImageProps> = ({
  src,
  alt,
  fill = false,
  ...props
}) => (
  <img
    src={src}
    alt={alt}
    data-testid="card-image"
    data-fill={fill ? "true" : "false"}
    {...props}
  />
);

DummyImage.displayName = "DummyImage";

/**
 * Simplified chip/toast-like mock for testing notification or dismissible chip behavior.
 * Exposes message content and a close button when `onClose` is provided.
 */
export const DummyChip: React.FC<ChipBaseProps> = ({
  id,
  message,
  onClose,
  className,
  size,
  position,
  stackIndex,
  "data-testid": testId,
}) => (
  <div
    role="status"
    className={className}
    data-size={size}
    data-position={position}
    data-stack-index={stackIndex}
    data-testid={testId}
  >
    <span>{message}</span>

    {onClose && (
      <button
        type="button"
        aria-label="Close"
        onClick={() => onClose()}
        data-testid={id ? `close-button-${id}` : "close-button"}
      />
    )}
  </div>
);

DummyChip.displayName = "DummyChip";

/**
 * Minimal text input mock that adapts the library's custom `onChange(value, event)`
 * signature to the native DOM input event signature.
 *
 * It also maps:
 * - `ariaLabel` -> `aria-label`
 * - `autocomplete` boolean -> native `autoComplete` string values
 *
 * Component-only props such as theme/state/shadow/rounding are intentionally ignored
 * and not forwarded to the DOM.
 */
export const DummyTextInput = React.forwardRef<
  HTMLInputElement,
  TextInputProps
>(
  (
    {
      "aria-label": ariaLabel,
      "aria-description": ariaDescription,
      autocomplete,
      glass,
      onChange,
      id,
      ...props
    },
    ref,
  ) => {
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (
      event,
    ) => {
      onChange?.(event.target.value, event);
    };

    return (
      <input
        ref={ref}
        id={id}
        aria-label={ariaLabel}
        aria-describedby={
          ariaDescription && id ? `${id}-description` : undefined
        }
        autoComplete={
          typeof autocomplete === "boolean"
            ? autocomplete
              ? "on"
              : "off"
            : props.autoComplete
        }
        onChange={handleChange}
        data-glass={glass ? "true" : "false"}
        {...props}
      />
    );
  },
);

DummyTextInput.displayName = "DummyTextInput";

/**
 * Minimal form group mock for tests that need label, description, error text,
 * and child content grouped together.
 */
export const DummyFormGroup = ({
  children,
  label,
  description,
  error,
  required,
  className,
  labelClassName,
  descriptionClassName,
  errorMessageClassName,
  "data-testid": testId,
}: FormGroupProps) => (
  <div data-testid={testId} className={className}>
    {label && (
      <label className={labelClassName}>
        {label}
        {required ? " *" : ""}
      </label>
    )}

    {description && <div className={descriptionClassName}>{description}</div>}
    {error && <div className={errorMessageClassName}>{error}</div>}
    {children}
  </div>
);

DummyFormGroup.displayName = "DummyFormGroup";

/**
 * Minimal progress bar mock.
 * Displays the numeric progress value so tests can verify rendered output easily.
 */
export const DummyProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
  "data-testid": testId,
}) => (
  <div data-testid={testId ?? "progress-bar"} className={className}>
    {value ?? 0}%
  </div>
);

DummyProgressBar.displayName = "DummyProgressBar";

/**
 * Minimal theme select mock for tests.
 * Provides a simple select element with a couple of options so components can render
 * and interact with it without depending on the real implementation.
 */
export const DummyThemeSelect: React.FC<ThemeSelectProps> = (props) => (
  <select {...props}>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
);

DummyThemeSelect.displayName = "DummyThemeSelect";

export const DummyAvatar: React.FC<AvatarProps> = ({
  name,
  onClick,
  children,
  glass,
  ...props
}) => (
  <button
    type="button"
    onClick={onClick}
    data-glass={glass ? "true" : "false"}
    {...props}
  >
    {children ?? name}
  </button>
);

DummyAvatar.displayName = "DummyAvatar";
