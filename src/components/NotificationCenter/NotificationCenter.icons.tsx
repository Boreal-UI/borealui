import type { IconComponent } from "@/types/types";

const commonProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const InfoCircleIcon: IconComponent = (props) => (
  <svg {...commonProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </svg>
);

export const CheckCircleIcon: IconComponent = (props) => (
  <svg {...commonProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>
);

export const ExclamationCircleIcon: IconComponent = (props) => (
  <svg {...commonProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6" />
    <path d="M12 16h.01" />
  </svg>
);
