# PopOver initial positioning remediation

Phase 4A-R fixes the initial-mount positioning race in `PopOver` without
changing its public API or moving its four-sided placement policy into the
Menu/Dropdown geometry abstraction.

## Reproduction before remediation

The Phase 4A characterization was reproduced with a 320 by 240 viewport and
mocked panel geometry, then confirmed in both Core and Next real-browser
mounts. In every case the initial positioning effect ran while the panel was
absent, so no panel geometry was measured and the requested class remained.

| Requested placement | Initial panel | Initial panel measurement | Result before | Viewport result |
| --- | --- | --- | --- | --- |
| bottom near bottom | absent | none | bottom | bottom overflow |
| top near top | absent | none | top | top overflow |
| left near left | absent | none | left | left overflow |
| right near right | absent | none | right | right overflow |

## Root cause and final lifecycle

Previously the lifecycle was:

```text
open becomes true
→ positioning effect runs while rendered is false
→ panel ref is null, so measurement exits
→ rendered effect requests the panel
→ panel mounts and mutates ref.current
→ no dependency changes, so positioning does not rerun
→ resize/scroll requests the existing placement value
→ React discards the equivalent state update
```

`PopOver` now uses a stable callback ref to store the mounted panel element in
state. Ref availability therefore participates in the positioning lifecycle
instead of remaining an invisible mutation. An isomorphic layout effect runs
the existing policy only when `open`, the panel element, and the trigger are
all available. A failed pre-mount attempt remains eligible because mounting
the panel changes the element dependency.

```text
open
→ trigger available
→ panel rendered
→ callback ref publishes panel element
→ layout effect measures trigger and panel
→ requested placement is collision-resolved
→ layout effect verifies the resolved geometry
→ panel displays and resize/scroll synchronization remains active
```

Initial positioning is synchronous with the panel commit, so no fixed delay or
initial hidden state was added. The existing 160 ms close-animation timer is
unchanged.

## Preserved policy

- The supported `top`, `bottom`, `left`, and `right` values are unchanged.
- Existing offsets, CSS placement classes, cross-axis viewport translation,
  focus, Escape, outside-click, and close animation behavior are unchanged.
- The implementation remains local to `PopOver`; it does not use
  `floatingPanelGeometry` or `useFloatingPanelSync`.
- Core and Next continue to share the same base behavior.
- Content size changes are not observed. This was not part of the existing
  contract, and no `ResizeObserver` was introduced.

## Lifecycle and performance accounting

| Cost | Before | After |
| --- | --- | --- |
| Positioning lifecycle | passive effect could exit permanently before mount | callback-ref availability plus one layout effect |
| Normal initial measurement | 0 successful measurements in the failing path | 1 trigger and 1 panel rectangle read |
| Collision flip | 0 successful measurements in the failing path | 2 trigger reads and 1 final panel rectangle read across two bounded layout passes |
| Resize listeners while open | 1 | 1 |
| Scroll listeners while open | 1 | 1 |
| Observers | 0 | 0 |
| Pending synchronization frames | ineffective state no-op | at most 1 coalesced animation frame |
| Fixed positioning timers | 0 | 0 |
| Close-animation timer | 1, 160 ms | unchanged |

The placement state is updated only when the resolved value changes. A normal
placement completes in one layout pass; a flip completes in a bounded second
pass after its CSS class changes, avoiding a measurement/render loop.

The compiled Core PopOver chunk changed from 6,330 to 6,576 raw bytes, and the
Next chunk changed from 7,522 to 7,768 raw bytes: 246 bytes per implementation.
PopOver now imports the existing 670-byte `useAnimationFrameCallback` chunk for
event coalescing. That helper adds no new package module and is already shared
by Menu/Dropdown; for an otherwise standalone PopOver import, the total raw
increment is 916 bytes.

## Verification coverage

- Jest covers all four collision directions, the panel-mount race,
  resize/scroll updates, pending work across close, reopen, Strict Mode listener
  balance, accessibility, and existing component behavior.
- SSR coverage renders the shared PopOver base without browser geometry access.
- Cypress checks actual rectangles for Core and Next at every viewport edge,
  normal placement, viewport events, and close/reopen.
- The visual matrix retains the normal open case and adds a dedicated
  bottom-edge case for intentional Chromatic review.
