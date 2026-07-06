import { expandClassMap } from "@/utils/propAliases";
import { IconButtonProps } from "../../IconButton/IconButton.types";
import FooterBase from "../FooterBase";
import { FooterProps } from "../Footer.types";
import styles from "../next/Footer.module.scss";

export type ServerFooterProps = Omit<FooterProps, "showThemeSelect"> & {
  showThemeSelect?: false;
};

const StaticIconLink = ({
  icon: Icon,
  href,
  disabled,
  "aria-label": ariaLabel,
  title,
  rel,
  target,
  testId,
  "data-testid": dataTestId,
}: IconButtonProps) => {
  const content = Icon ? <Icon aria-hidden focusable={false} /> : null;
  return href && !disabled ? (
    <a
      href={href}
      aria-label={ariaLabel}
      title={title}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      target={target}
      data-testid={testId ?? dataTestId}
    >
      {content}
    </a>
  ) : (
    <span
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      title={title}
      data-testid={testId ?? dataTestId}
    >
      {content}
    </span>
  );
};

const StaticThemeSelect = () => null;

export default function Footer(props: ServerFooterProps) {
  return (
    <FooterBase
      {...props}
      showThemeSelect={false}
      IconButton={StaticIconLink}
      ThemeSelect={StaticThemeSelect}
      ImageComponent="img"
      classMap={expandClassMap(styles)}
    />
  );
}
