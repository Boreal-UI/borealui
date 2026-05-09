import React, { useEffect, useMemo, useRef } from "react";
import { CloseIcon } from "../../Icons";
import { BaseNotificationCenterProps } from "./NotificationCenter.types";
import { themeIcons } from "./NotificationCenter.constants";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
} from "../../config/boreal-style-config";

const BaseNotificationCenter: React.FC<BaseNotificationCenterProps> = ({
  notifications,
  onRemove,
  onClearAll,
  fetchNotifications,
  setNotifications,
  maxNotifications = 10,
  clearOldOnOverflow = true,
  pollInterval = 5000,
  showClearAll = true,
  controlRounding = getDefaultRounding(),
  controlShadow = getDefaultShadow(),
  notificationRounding = getDefaultRounding(),
  notificationShadow = getDefaultShadow(),
  "aria-label": ariaLabel = "Notification center",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "list-aria-label": listAriaLabel,
  liveRegionPoliteness = "polite",
  liveRegionRelevant = "additions text",
  liveRegionAtomic = false,
  emptyMessage = "No notifications.",
  dismissButtonLabelPrefix = "Dismiss notification",
  clearAllAriaLabel = "Clear all notifications",
  className = "",
  headerClassName = "",
  clearAllClassName = "",
  bodyClassName = "",
  emptyClassName = "",
  listClassName = "",
  notificationClassName = "",
  iconClassName = "",
  contentClassName = "",
  messageClassName = "",
  timestampClassName = "",
  closeButtonClassName = "",
  Button,
  IconButton,
  classMap,
  "data-testid": dataTestId,
  testId = dataTestId ?? "notification-center",
}) => {
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const prevIds = useRef<Set<string>>(new Set());
  const internalTitleId = `${testId}-title`;
  const resolvedLabelledBy = ariaLabelledBy || internalTitleId;

  useEffect(() => {
    if (
      maxNotifications &&
      notifications.length > maxNotifications &&
      clearOldOnOverflow &&
      setNotifications
    ) {
      const overflow = notifications.length - maxNotifications;
      setNotifications((prev) => prev.slice(overflow));
    }
  }, [notifications, maxNotifications, clearOldOnOverflow, setNotifications]);

  useEffect(() => {
    if (!fetchNotifications) return;
    let alive = true;

    const load = () => {
      fetchNotifications().catch((err) => {
        console.error("Failed to fetch notifications:", err);
      });
    };

    load();
    const id = setInterval(() => alive && load(), pollInterval);

    return () => {
      clearInterval(id);
      alive = false;
    };
  }, [fetchNotifications, pollInterval]);

  useEffect(() => {
    const currentIds = new Set<string>(notifications.map((n) => n.id));

    for (const n of notifications) {
      if (n.duration && !timers.current[n.id]) {
        timers.current[n.id] = setTimeout(() => {
          onRemove(n.id);
          delete timers.current[n.id];
        }, n.duration);
      }
    }

    for (const oldId of prevIds.current) {
      if (!currentIds.has(oldId) && timers.current[oldId]) {
        clearTimeout(timers.current[oldId]);
        delete timers.current[oldId];
      }
    }

    prevIds.current = currentIds;

    return () => {
      if (prevIds.current === currentIds) {
        Object.values(timers.current).forEach(clearTimeout);
        timers.current = {};
      }
    };
  }, [notifications, onRemove]);

  const notificationClass = useMemo(
    () =>
      combineClassNames(
        classMap.notification,
        notificationShadow &&
          classMap[`shadow${capitalize(notificationShadow)}`],
        notificationRounding &&
          classMap[`round${capitalize(notificationRounding)}`],
        notificationClassName,
      ),
    [classMap, notificationShadow, notificationRounding, notificationClassName],
  );

  return (
    <div
      className={combineClassNames(classMap.wrapper, className)}
      role="region"
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={resolvedLabelledBy}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
    >
      <div
        className={combineClassNames(classMap.header, headerClassName)}
        data-testid={`${testId}-header`}
      >
        {!ariaLabelledBy && <h3 id={internalTitleId}>Notifications</h3>}

        {showClearAll && notifications.length > 0 && onClearAll && (
          <Button
            state="error"
            size="small"
            rounding={controlRounding}
            shadow={controlShadow}
            className={combineClassNames(classMap.clearAll, clearAllClassName)}
            onClick={onClearAll}
            aria-label={clearAllAriaLabel}
            data-testid={`${testId}-clear-all`}
            type="button"
          >
            Clear All
          </Button>
        )}
      </div>

      <div
        role="status"
        aria-live={liveRegionPoliteness}
        aria-relevant={liveRegionRelevant}
        aria-atomic={liveRegionAtomic}
        className={combineClassNames(classMap.body, bodyClassName)}
        data-testid={`${testId}-live-region`}
      >
        {notifications.length === 0 ? (
          <p
            className={combineClassNames(classMap.empty, emptyClassName)}
            data-testid={`${testId}-empty`}
          >
            {emptyMessage}
          </p>
        ) : (
          <ul
            className={combineClassNames(classMap.list, listClassName)}
            aria-labelledby={listAriaLabel ? undefined : resolvedLabelledBy}
            aria-label={listAriaLabel}
          >
            {notifications.map((note, index) => {
              const Icon = themeIcons[note.type || "info"];
              const noteTestId = `${testId}-item-${note.id}`;
              const messageId = `${noteTestId}-message`;
              const timestampId = `${noteTestId}-timestamp`;
              const descriptionId = note.ariaDescription
                ? `${noteTestId}-description`
                : undefined;

              const describedByIds = [
                note.timestamp ? timestampId : undefined,
                descriptionId,
              ]
                .filter(Boolean)
                .join(" ");

              const timestampStr = note.timestamp?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <li
                  key={note.id}
                  className={combineClassNames(
                    notificationClass,
                    classMap[note.type || "info"],
                  )}
                  role="listitem"
                  aria-label={note.ariaLabel}
                  aria-labelledby={note.ariaLabel ? undefined : messageId}
                  aria-describedby={describedByIds || undefined}
                  data-testid={noteTestId}
                >
                  <Icon
                    className={combineClassNames(classMap.icon, iconClassName)}
                    aria-hidden="true"
                    focusable={false}
                  />

                  <div
                    className={combineClassNames(
                      classMap.content,
                      contentClassName,
                    )}
                  >
                    <span
                      id={messageId}
                      className={combineClassNames(
                        classMap.message,
                        messageClassName,
                      )}
                      data-testid={`${noteTestId}-message`}
                    >
                      {note.message}
                    </span>

                    {note.timestamp && (
                      <span
                        id={timestampId}
                        className={combineClassNames(
                          classMap.timestamp,
                          timestampClassName,
                        )}
                        data-testid={`${noteTestId}-timestamp`}
                      >
                        {timestampStr}
                      </span>
                    )}

                    {note.ariaDescription && (
                      <span
                        id={descriptionId}
                        className={classMap.srOnly}
                        data-testid={`${noteTestId}-description`}
                      >
                        {note.ariaDescription}
                      </span>
                    )}
                  </div>

                  <IconButton
                    className={combineClassNames(
                      classMap.close,
                      closeButtonClassName,
                    )}
                    state="error"
                    size="small"
                    outline
                    icon={CloseIcon}
                    onClick={() => onRemove(note.id)}
                    aria-label={`${dismissButtonLabelPrefix} ${index + 1}`}
                    title="Dismiss"
                    data-testid={`${noteTestId}-dismiss`}
                    type="button"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

BaseNotificationCenter.displayName = "BaseNotificationCenter";
export default BaseNotificationCenter;
