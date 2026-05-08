import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import {
  FileIcon,
  TrashIcon,
  FallbackUserIcon,
  ArrowUpIcon,
  CloseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  StarIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusCircleIcon,
  FolderIcon,
  CalendarIcon,
} from "../../src/Icons";

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

interface IconTestCase {
  name: string;
  Icon: IconComponent;
}

const icons: IconTestCase[] = [
  { name: "FileIcon", Icon: FileIcon },
  { name: "TrashIcon", Icon: TrashIcon },
  { name: "FallbackUserIcon", Icon: FallbackUserIcon },
  { name: "ArrowUpIcon", Icon: ArrowUpIcon },
  { name: "CloseIcon", Icon: CloseIcon },
  { name: "ArrowLeftIcon", Icon: ArrowLeftIcon },
  { name: "ArrowRightIcon", Icon: ArrowRightIcon },
  { name: "StarIcon", Icon: StarIcon },
  { name: "ChevronDownIcon", Icon: ChevronDownIcon },
  { name: "EyeIcon", Icon: EyeIcon },
  { name: "EyeSlashIcon", Icon: EyeSlashIcon },
  { name: "PlusCircleIcon", Icon: PlusCircleIcon },
  { name: "FolderIcon", Icon: FolderIcon },
  { name: "CalendarIcon", Icon: CalendarIcon },
];

describe("icon components", () => {
  describe.each(icons)("$name", ({ Icon }) => {
    it("renders an svg element", () => {
      const { container } = render(<Icon data-testid="icon" />);
      const svg = container.querySelector("svg");

      expect(svg).toBeInTheDocument();
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("passes standard svg props through to the root svg", () => {
      render(
        <Icon
          data-testid="icon"
          className="custom-icon"
          aria-hidden="true"
          focusable="false"
        />,
      );

      const svg = screen.getByTestId("icon");

      expect(svg).toHaveClass("custom-icon");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
    });

    it("renders svg content", () => {
      const { container } = render(<Icon data-testid="icon" />);
      const svg = screen.getByTestId("icon");

      expect(svg.children.length).toBeGreaterThan(0);

      const hasShape = container.querySelector(
        "path, circle, rect, line, polyline, polygon, g",
      );
      expect(hasShape).toBeInTheDocument();
    });

    it("accepts an accessible label when provided", () => {
      render(<Icon data-testid="icon" role="img" aria-label="Test icon" />);

      const svg = screen.getByTestId("icon");

      expect(svg).toHaveAttribute("role", "img");
      expect(svg).toHaveAttribute("aria-label", "Test icon");
    });

    it("preserves custom sizing props", () => {
      render(<Icon data-testid="icon" width="32px" height="32px" />);

      const svg = screen.getByTestId("icon");

      expect(svg).toHaveAttribute("width", "32px");
      expect(svg).toHaveAttribute("height", "32px");
    });
  });
});
