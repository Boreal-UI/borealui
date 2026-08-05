import { combineClassNames } from "@/utils/classNames";
import { expandClassMap, resolvePropAlias } from "@/utils/propAliases";
import { capitalize } from "@/utils/capitalize";
import {
  getDefaultVariant,
  getDefaultRounding,
  getDefaultTheme,
  getShadowClassName,
} from "@/config/boreal-style-config";
import { RadioButtonProps } from "../RadioButton.types";
import styles from "../next/RadioButton.module.scss";

export type ServerRadioButtonProps = Omit<
  RadioButtonProps,
  "checked" | "onChange"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
};

export default function RadioButton({
  label,
  labelPosition = "left",
  value,
  checked,
  defaultChecked,
  name,
  theme = getDefaultTheme(),
  variant = getDefaultVariant(),
  rounding = getDefaultRounding(),
  shadow,
  state,
  disabled = false,
  className,
  testId,
  "data-testid": dataTestId,
  id,
  ...rest
}: ServerRadioButtonProps) {
  const classMap = expandClassMap(styles);
  const resolvedTestId = testId ?? dataTestId ?? "radio-button";
  const inputId = id ?? `${resolvedTestId}-input`;
  const position = resolvePropAlias(labelPosition);
  return (
    <div
      className={combineClassNames(
        classMap.wrapper,
        classMap[theme],
        state && classMap[state],
        (variant === "glass" || variant === "glassOutline") && classMap.glass,
        disabled && classMap.disabled,
        className,
      )}
      data-testid={`${resolvedTestId}-root`}
    >
      <label className={classMap.labelWrapper} htmlFor={inputId}>
        {label && position === "left" ? (
          <span className={classMap.label}>{label}</span>
        ) : null}
        <input
          {...rest}
          type="radio"
          id={inputId}
          name={name}
          value={value}
          defaultChecked={checked ?? defaultChecked}
          disabled={disabled}
          className={classMap.input}
          data-testid={resolvedTestId}
        />
        <span
          className={combineClassNames(
            classMap.circle,
            (variant === "glass" || variant === "glassOutline") &&
              classMap.glassCircle,
            getShadowClassName(classMap, theme, shadow),
            rounding && classMap[`round${capitalize(rounding)}`],
          )}
          aria-hidden="true"
        />
        {label && position === "right" ? (
          <span className={classMap.label}>{label}</span>
        ) : null}
      </label>
    </div>
  );
}
