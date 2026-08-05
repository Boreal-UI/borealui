import type { IconComponent, NotificationType } from "@/types/types";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
} from "./NotificationCenter.icons";

/**
 * A mapping from notification types to their associated icon components.
 */
export const themeIcons: Record<NotificationType, IconComponent> = {
  general: InfoCircleIcon,
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationCircleIcon,
  info: InfoCircleIcon,
};
