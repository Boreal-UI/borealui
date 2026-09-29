# Floating panel architecture

This audit covers `Menu`, `Dropdown`, and `PopOver` in the Core and Next
packages. Core and Next wrappers share each component's base implementation,
so the positioning behavior is common unless styling changes it. The audit did
not find another repository component with equivalent JavaScript floating-panel
geometry, and it did not add a portal or a third-party positioning dependency.

## Behavior matrix

| Capability | Menu | Dropdown | PopOver |
| --- | --- | --- | --- |
| Anchor source | Pointer, target, trigger, or controlled viewport coordinates | Trigger/wrapper containing block | Trigger in a relatively positioned container |
| Floating element | Root plus nested panels | Root plus nested panels | Single panel |
| Portal behavior | Inline; no portal | Inline; no portal | Inline; no portal |
| Position strategy | Fixed root; absolute submenus | Absolute root and submenus | Absolute |
| Preferred placement | Requested viewport point; right submenu | CSS-selected root side; right submenu | Requested top, bottom, left, or right |
| Alignment | Viewport point; submenu top edge | Root start/end prop; submenu top edge | Centered on the cross axis |
| Offset/gap | No root gap; submenu CSS token | Root and submenu CSS tokens | 10px vertical; 8px horizontal |
| Vertical collision | Root clamp; submenu vertical offset | Root CSS max-height; submenu vertical offset | Intended opposite-side flip and translation clamp |
| Horizontal collision | Root clamp; submenu side selection | Root overflow marker; submenu side selection | Intended opposite-side flip and translation clamp |
| Flip behavior | Nested panels only | Nested panels only | Intended opposite side |
| Clamp behavior | Root coordinates and nested vertical offset | Root overflow CSS and nested vertical offset | Intended CSS transform translation |
| Viewport padding | 8px | 8px | 8px |
| Document scroll response | Captured scroll, frame-coalesced | Captured scroll, frame-coalesced | Listener exists; current update is a no-op |
| Scroll-container response | Captured ancestor scroll | Captured ancestor scroll; ignores panel-internal scroll | Captured ancestor scroll listener; current update is a no-op |
| Window resize response | Frame-coalesced remeasure | Frame-coalesced remeasure | Listener exists; current update is a no-op |
| Anchor resize response | None | None | None |
| Panel resize response | None | None | None |
| Initial measurement | Layout effect | Layout effect | Passive effect intended to schedule a frame |
| Hidden-before-measured behavior | Visible at requested coordinates before correction | CSS-positioned before overflow correction | Content is absent until open, then visible before successful measurement |
| Nested panels | Yes; stacked on narrow viewports | Yes; stacked on narrow viewports | No |
| RTL behavior | No explicit logical-direction policy | No explicit logical-direction policy | No explicit logical-direction policy |
| SSR behavior | No DOM reads during render | No DOM reads during render | No DOM reads during render |
| Strict Mode behavior | Listener cleanup and queued-frame cancellation | Listener cleanup and queued-frame cancellation | Listener cleanup; local clamp frame is not explicitly cancelled |
| Focus ownership | Menu | Dropdown | PopOver |
| Dismissal ownership | Menu | Dropdown | PopOver |

## Architecture decision

Menu and Dropdown had the same viewport reading, size limiting, nested-panel
left/right decision, vertical correction, and captured scroll/resize lifecycle.
Those mechanics now live in the internal `floatingPanelGeometry` utility and
`useFloatingPanelSync` hook. Root-panel policies remain in their components:
Menu clamps requested coordinates, while Dropdown preserves CSS alignment and
records horizontal overflow flags.

PopOver remains local because its anchor-relative four-side placement and CSS
transform correction are materially different. Dismissal, focus management,
roving focus, nesting state, and asynchronous behavior also remain component
owned. No public props, exports, class names, package paths, or client/server
boundaries changed.

The duplication classification was:

- **Shared mechanics:** viewport reads, max-size calculation, captured
  scroll/resize subscription, animation-frame coalescing, and cleanup.
- **Shared primitive, different policy:** Menu and Dropdown nested-panel side
  selection and vertical correction use one primitive; their root policies stay
  separate.
- **Component-specific:** hierarchy, keyboard navigation, focus, selection,
  dismissal, hover behavior, and PopOver's four-side placement.
- **Coincidental similarity:** all three components read rectangles, but
  PopOver's anchor-relative transform policy is not the same abstraction as the
  Menu/Dropdown tree geometry.

## PopOver remediation status

Phase 4A identified an initial-mount race in which the positioning effect could
run before the content ref existed and never receive a meaningful retry.
Phase 4A-R resolves that defect locally with a state-backed callback ref and a
layout-timed measurement while preserving PopOver's distinct placement policy.
See [PopOver initial positioning remediation](popover-positioning-remediation.md)
for the lifecycle trace and verification record.

## Cost and lifecycle accounting

Before the extraction, Menu and Dropdown each contained their own copy of the
nested geometry and viewport-listener mechanics. Afterward, the two components
share one implementation while preserving three distinct root placement
policies across Menu, Dropdown, and PopOver.

| Metric | Before | After |
| --- | ---: | ---: |
| Positioning implementations | 3 component implementations | 1 shared Menu/Dropdown primitive plus 3 root policies |
| Resize listeners per open panel | 1 | 1 |
| Scroll listeners per open panel | 1 captured | 1 captured |
| Observers per open panel | 0 | 0 |
| Scheduled frames | At most 1 pending per Menu/Dropdown | At most 1 pending per Menu/Dropdown |
| Base-component nonblank LOC | 1,770 | 1,753 |
| Base components plus shared implementation LOC | 1,770 | 1,886 |

The production chunks now share a 2,587-byte raw geometry/lifecycle chunk.
Against the baseline, the Core Menu and Dropdown chunks decreased by 284 and
346 bytes, and the Next equivalents decreased by 284 and 346 bytes; PopOver is
byte-identical. A consumer importing both Menu and Dropdown loads about 1.95 KB
more raw JavaScript overall, while avoiding two independent future copies of
the mechanics. This is a small but real cost of the internal boundary, not a
bundle-size improvement.

## Verification coverage

Unit coverage exercises normal and edge coordinate clamping, nested right/left
selection, vertical correction, oversized panels, listener policy, frame
coalescing, Strict Mode cleanup, and queued-frame cancellation. Component tests
characterize each affected component before the extraction. Cypress covers
Core and Next Menu root/submenu edges, Dropdown nested edges and viewport
events, normal PopOver alignment, and the known PopOver edge overflow. The
critical visual matrix includes open Menu, Dropdown, and PopOver stories for
both implementations.
