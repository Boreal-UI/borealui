import { useEffect, useLayoutEffect, useState } from "react";
import { useThemeScope } from "../context/ThemeScopeContext";
import { applyThemeVariables } from "../context/themeRuntime";

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
  const scope = useThemeScope();
  const scoped = Boolean(scope);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || typeof document === "undefined") {
      setHost(null);
      return;
    }

    const lease = acquirePortalHost(id);
    const target = scoped ? document.createElement("div") : lease.element;
    if (scoped) lease.element.appendChild(target);
    setHost(target);

    return () => {
      setHost((current) => (current === target ? null : current));
      if (scoped) target.remove();
      lease.release();
    };
  }, [active, id, scoped]);

  const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
  useBrowserLayoutEffect(() => {
    if (!host || !scope) return;
    applyThemeVariables(host.style, scope.style);
    host.style.color = "var(--text-color)";
    host.dataset.borealTheme = scope["data-boreal-theme"];
  }, [host, scope]);

  return host;
};
