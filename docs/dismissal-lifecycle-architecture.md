# Floating surface dismissal lifecycle

Phase 4D audits the non-modal dismissal behavior of `Menu`, `Dropdown`, and
`PopOver`. Modal-layer Escape ownership, focus containment, portal ownership,
and positioning remain outside this architecture.

Baseline revision: `f43aee7c`.

## Behavior matrix

| Capability | Menu | Dropdown | PopOver |
|---|---|---|---|
| Outside pointer dismisses | Yes | Yes | Yes |
| Event used | `mousedown` | `mousedown` | `mousedown` |
| Capture/bubble | Document bubble | Document bubble | Document bubble |
| Escape dismisses | Yes, in the wrapper key handler | Yes, in the wrapper key handler | Yes, in a document key handler |
| Focus-out dismisses | No; `Tab` key closes Menu | No; `Tab` key closes Dropdown | No |
| Trigger considered inside | Yes, through the wrapper | Yes, through the wrapper | Yes, through its trigger ref |
| Panel considered inside | Yes, through the wrapper | Yes, through the wrapper | Yes, through its panel ref |
| Nested surface handling | Inline submenus are inside the wrapper | Inline submenus are inside the wrapper | Inline children are inside; portaled children are outside |
| Portal-aware | No portal rendering and no cross-portal containment | No portal rendering and no cross-portal containment | No portal rendering and no cross-portal containment |
| Consumer `preventDefault` effect | Cancels wrapper Escape and trigger defaults; not document outside dismissal | Cancels wrapper Escape through composed key handling; not document outside dismissal | Cancels an `asChild` trigger default; not document outside/Escape dismissal |
| Controlled mode | Yes; requests `onOpenChange(false)` and remains open until props change | No | No |
| Uncontrolled mode | Yes | Yes | Yes |
| Listener target | `document` for outside pointer; wrapper for keys | `document` for outside pointer; wrapper for keys | `document` for outside pointer and Escape |
| Listener active while closed | No | Yes (baseline defect) | No |
| Cleanup | Effect removes matching listener | Effect removes matching listener | Effects remove matching listeners |
| Strict Mode | Effect cleanup makes replay balanced | Effect cleanup makes replay balanced, but listener remains active while closed | Effect cleanup makes replay balanced |
| SSR | DOM access is effect/event-only | DOM access is effect/event-only | DOM access is effect/event-only; layout effect is isomorphic |
| Nested Menu/submenu | One wrapper contains the full hierarchy; Escape closes the root, ArrowLeft closes one level | One wrapper contains the full hierarchy; Escape closes the root, ArrowLeft closes one level | Not applicable |
| Trigger click interaction | Opens at the trigger; does not toggle closed | Toggles | Toggles |

## Architecture decision

Extraction is justified only for the shared outside-interaction mechanics:

- register one bubble-phase document `mousedown` listener while active;
- treat a configurable set of current elements as inside;
- report an outside event to the component;
- unregister on close, unmount, and Strict Mode effect replay.

Escape remains local because its ownership and cancellation semantics differ.
Open state, focus restoration, selection, trigger behavior, submenu hierarchy,
positioning, animation, and portals also remain local.

The primitive intentionally uses `Node.contains`. The audited surfaces render
their protected trigger, panel, and submenu DOM inline. `composedPath()` would
not make a portaled descendant part of a parent's containment boundary without
an additional ownership policy, and no such policy exists today.

## Baseline coverage

- Menu Jest: 18 tests.
- Dropdown Jest: 41 tests.
- PopOver Jest: 31 tests.
- Shared floating-panel SSR Jest: 3 tests.
- Cypress: 28 specs and 866 tests, including 16 submenu tests, 14 floating-panel
  tests, and 10 event-composition tests.
- Visual regression: `menu-submenu-edge`, `dropdown-submenu-edge`,
  `popover-open`, `popover-edge`, and `overlay-modal-dropdown`.

## Phase 4D outcome

- `useOutsideInteraction` now owns the shared listener lifecycle and accepts
  one or more protected element refs.
- Each surface keeps its existing state, Escape, focus, submenu, trigger, and
  callback policies.
- Dropdown no longer keeps an outside-pointer listener active while closed.
- No public prop, export, DOM structure, styling, portal, positioning, modal,
  or dependency contract changed.

### Listener and bundle impact

| Measurement | Baseline | Phase 4D |
|---|---:|---:|
| Outside-pointer implementations | 3 local | 1 shared primitive + 3 configurations |
| Mounted closed surfaces (pointer listeners) | 1 | 0 |
| All three surfaces open (pointer listeners) | 3 | 3 |
| Relevant production source lines | 1,773 | 1,802 |
| Core combined raw JS | 35,803 bytes | 36,018 bytes |
| Next combined raw JS | 39,793 bytes | 40,008 bytes |

The combined bundle measurement includes the relevant Menu, Dropdown,
PopOver, and shared hook chunks. Each component chunk became smaller; Rollup
coalesced the new helper into a shared chunk, for a net raw increase of 215
bytes in each build.

## Phase 4D verification

- Jest: 112 suites and 2,413 tests passed.
- Cypress: 29 specs and 874 tests passed, including eight new Core/Next
  dismissal lifecycle cases.
- TypeScript, ESLint, style audit, documentation audit, production build,
  package quality, dependency audit, and all nine compatibility lanes passed.
- Core, Next, and visual Storybook static builds passed.
- Chromatic was not run because `CHROMATIC_PROJECT_TOKEN` was unavailable.
