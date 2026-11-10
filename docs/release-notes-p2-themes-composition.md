# Unreleased: P2 semantic themes and composition

- Extends the existing semantic roles with subtle/interaction/selected/disabled
  pairs and `ColorScheme.semanticTokens` overrides. Palette-only themes continue
  to work. `getThemeContrastIssues` audits supported opaque combinations.
- ThemeProvider adds document/local scope ownership. Nested providers default to
  local SSR-styled divs. Shared managed portal hosts and Portal wrappers carry
  live resolved Boreal variables without changing global body themes.
- Modal, CommandPalette, MessagePopup and Chip inherit their originating context
  through shared portal infrastructure. Inline Drawer/Dropdown/PopOver/Tooltip
  continue inheriting naturally. Explicit Portal containers remain supported.
- Card adds simple `footer` content and opt-out section padding/layout; direct
  children and legacy renderers remain supported. Modal accepts ReactNode
  siblings/text and padding control, uses its visible title for accessible naming,
  and retains a scrolling body with reachable wrapping footer actions.
- Includes five Core/Next Storybook recipes and a complete Next.js SSR/cookie app,
  plus a built-in contrast gallery and overlay inventory. Scoped placeholder
  selectors fix source CSS Modules compatibility exposed by the Next recipe.
- Follow-up review removes residual disabled-container opacity and conflicting
  disabled hover/outline/glass rules. Native field text and Button loading spinners
  retain the readable disabled foreground. Field placeholders use their control's
  foreground, avoiding page-muted text on a contrasting brand surface.

Compatibility: root provider behavior remains global; nested providers now default
to local scopes. Use `scope="document"` for intentional legacy nested global
behavior. Neutral derived colors and disabled presentation change to enforce the
documented contract; palette identity is retained. Arbitrary ancestor CSS variables
and selectors do not cross portals automatically. Explicit semantic values must
be opaque hex colors; application-specific/translucent contrast remains consumer-owned.

See [the token/API contract, recipes, limitations and migration guide](semantic-themes-overlays-recipes.md).
