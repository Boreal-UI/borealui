/** Common presentation slots. Existing component-specific class props still merge. */
export interface FieldPresentationProps {
  /** Class on the outer field layout, including label and feedback. */
  rootClassName?: string;
  /** Class on the native input, textarea or select. */
  controlClassName?: string;
  /** Class on visible helperText. */
  descriptionClassName?: string;
  /** Class on errorMessage. */
  errorClassName?: string;
  /** Feedback is static by default. Opt into polite/assertive announcements deliberately. */
  errorLive?: "off" | "polite" | "assertive";
  /** Fill the parent through both the layout and control wrappers. */
  fullWidth?: boolean;
}
