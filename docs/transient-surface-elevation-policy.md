# Transient surface elevation policy

Phase 4E establishes how non-modal notification and utility surfaces relate to
active modal layers. Modal ownership, focus containment, portals, and floating
panel positioning remain unchanged.

Baseline revision: `6a39627c`.

## Surface semantics

| Component | Purpose | Interactive | Portal | Lifetime | Trigger |
|---|---|---|---|---|---|
| Chip | Dismissible notification | Yes, close control | Optional `#widget-portal` | Transient | User or system |
| ChipGroup | Notification stack | Yes, child close controls | Inline | Transient | User or system |
| ToastProvider | Dismissible/swipeable notification stack | Yes | Inline | Transient | User or system |
| NotificationCenter | Notification history/status panel | Yes | Inline | Persistent application UI | User or system |
| ScrollToTop | Page utility control | Yes | Inline | Persistent while scroll threshold is met | User |

## Elevation matrix

| Surface | Portal/inline | Phase 4E elevation | Above modal? | Interactive during modal? | Rationale |
|---|---|---:|---|---|---|
| Chip | Optional portal | `--z-index-notification` (1100), unless `stackIndex` is explicitly supplied | No by default | No | A dismissible notification is not a modal layer. `stackIndex` remains an explicit consumer override. |
| ChipGroup | Inline | `--z-index-notification` (1100) | No | No | The group and its child notifications share one semantic level. |
| ToastProvider | Inline | `--z-index-notification` (1100) | No | No | Toasts contain dismiss and swipe interactions, so the application-level provider remains isolated with its application subtree. |
| NotificationCenter | Inline | Normal flow (`auto`) | No | No | It is an interactive application panel, not a transient overlay. |
| ScrollToTop | Inline | `--z-index-fixed` (1000 fallback) | No | No | It is persistent page utility UI and must stay below notifications and modal layers. |

Contextual modal surfaces use `--z-index-modal` (9999 by default) plus their
modal-layer index. NavBar and Toolbar remain ordinary application chrome.

## Policy

Boreal uses four relevant categories:

1. Application content and persistent controls remain in normal flow or the
   fixed/sticky application levels.
2. Dismissible notifications share `--z-index-notification`, above ordinary
   application chrome but below modal layers.
3. Local floating UI uses component-local elevation and remains owned by its
   rendering context.
4. Modal surfaces alone participate in the modal layer manager and
   `--z-index-modal` stack.

Visibility does not grant modal ownership. During an active modal, application
notifications and utilities remain unavailable to pointer and keyboard input.
Toast and NotificationCenter live regions are part of the isolated application
subtree, so they are hidden from assistive technology while the modal owns the
accessibility tree. A Chip inserted later into a portal may retain its alert
semantics, but its default paint and pointer level remains below the backdrop.

## Reproduced defect

A Chip inserted into a consumer-owned `#widget-portal` after a Modal opened was
not present during the modal manager's isolation pass. Its former `z-index:
9999` tied the modal base and later DOM order painted the Chip above the
backdrop, leaving its dismiss control pointer-accessible.

Phase 4E resolves the contradiction at the elevation-policy layer. Chip now
uses the notification level and therefore remains below the backdrop without
adding observers, listeners, modal registration, or portal coupling.
