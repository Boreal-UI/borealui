import { useCallback, useRef, useState } from "react";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NotificationCenter } from "../../src/index.next";
import type {
  NotificationCenterProps,
  Notification,
} from "../../src/components/NotificationCenter/NotificationCenter.types";

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "info",
    message: "You have a new follower.",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "success",
    message: "Profile updated successfully.",
    timestamp: new Date(),
    duration: 5000,
  },
  {
    id: "3",
    type: "warning",
    message: "Storage space running low.",
    timestamp: new Date(),
  },
  {
    id: "4",
    type: "error",
    message: "Failed to load image.",
    timestamp: new Date(),
  },
];

const meta: Meta<NotificationCenterProps> = {
  title: "Components/NotificationCenter",
  component: NotificationCenter,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<NotificationCenterProps>;

export const Default: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(mockNotifications);

    const handleRemove = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const handleClearAll = () => {
      setNotifications([]);
    };

    return (
      <NotificationCenter
        notifications={notifications}
        setNotifications={setNotifications}
        onRemove={handleRemove}
        onClearAll={handleClearAll}
      />
    );
  },
};

export const WithoutClearAll: Story = {
  render: () => {
    const [notifications, setNotifications] = useState([mockNotifications[0]]);

    const handleRemove = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
      <NotificationCenter
        notifications={notifications}
        setNotifications={setNotifications}
        onRemove={handleRemove}
        showClearAll={false}
      />
    );
  },
};

export const AutoDismissOnly: Story = {
  render: () => {
    const [notifications, setNotifications] = useState([
      {
        id: "auto-1",
        type: "success",
        message: "Auto-dismiss in 3 seconds.",
        duration: 3000,
        timestamp: new Date(),
      } as Notification,
    ]);

    const handleRemove = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
      <NotificationCenter
        notifications={notifications}
        setNotifications={setNotifications}
        onRemove={handleRemove}
        onClearAll={() => {}}
      />
    );
  },
};

export const WithPolling: Story = {
  render: () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const counterRef = useRef(1);

    const handleRemove = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const handleClearAll = () => {
      setNotifications([]);
    };

    const fetchNotifications = useCallback(async (): Promise<
      Notification[]
    > => {
      const newId = `poll-${counterRef.current}`;
      const newNotification: Notification = {
        id: newId,
        type: "info",
        message: `Polled notification #${counterRef.current}`,
        timestamp: new Date(),
      };

      counterRef.current += 1;

      setNotifications((prev) => {
        if (prev.some((n) => n.id === newNotification.id)) return prev;
        return [...prev, newNotification];
      });

      return [newNotification];
    }, []);

    return (
      <NotificationCenter
        notifications={notifications}
        setNotifications={setNotifications}
        onRemove={handleRemove}
        onClearAll={handleClearAll}
        fetchNotifications={fetchNotifications}
        pollInterval={3000}
        maxNotifications={5}
      />
    );
  },
};
