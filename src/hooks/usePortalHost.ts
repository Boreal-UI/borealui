import { useEffect, useState } from "react";

interface PortalHostLease {
  element: HTMLElement;
  release: () => void;
}

interface ManagedPortalHost {
  element: HTMLElement;
  leases: number;
}

const managedHosts = new Map<string, ManagedPortalHost>();

const acquirePortalHost = (id: string): PortalHostLease => {
  const managedHost = managedHosts.get(id);
  if (
    managedHost &&
    managedHost.element.isConnected &&
    document.getElementById(id) === managedHost.element
  ) {
    managedHost.leases += 1;
    return createLease(id, managedHost);
  }

  if (managedHost) managedHosts.delete(id);

  const existingHost = document.getElementById(id);
  if (existingHost) {
    return { element: existingHost, release: () => undefined };
  }

  const element = document.createElement("div");
  element.id = id;
  document.body.appendChild(element);

  const createdHost = { element, leases: 1 };
  managedHosts.set(id, createdHost);
  return createLease(id, createdHost);
};

const createLease = (id: string, host: ManagedPortalHost): PortalHostLease => {
  let active = true;

  return {
    element: host.element,
    release: () => {
      if (!active) return;
      active = false;
      host.leases -= 1;

      if (host.leases > 0 || managedHosts.get(id) !== host) return;

      managedHosts.delete(id);
      if (
        host.element.isConnected &&
        document.getElementById(id) === host.element
      ) {
        host.element.remove();
      }
    },
  };
};

/**
 * Resolves a body-level portal host while active.
 *
 * Consumer-owned hosts are reused and never removed. Hosts created by Boreal
 * are reference counted and removed after the final user releases them.
 */
export const usePortalHost = (id: string, active = true) => {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || typeof document === "undefined") {
      setHost(null);
      return;
    }

    const lease = acquirePortalHost(id);
    setHost(lease.element);

    return () => {
      setHost((current) => (current === lease.element ? null : current));
      lease.release();
    };
  }, [active, id]);

  return host;
};
