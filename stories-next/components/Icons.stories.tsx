import { Meta } from "@storybook/nextjs-vite";

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
  FolderIcon,
  PlusCircleIcon,
} from "../../src/Icons";

const meta: Meta = {
  title: "Icons/All Icons",
};

export default meta;

const iconList = [
  { name: "File", Component: FileIcon },
  { name: "Trash", Component: TrashIcon },
  { name: "FallbackUser", Component: FallbackUserIcon },
  { name: "Arrow Up", Component: ArrowUpIcon },
  { name: "Close", Component: CloseIcon },
  { name: "Arrow Left", Component: ArrowLeftIcon },
  { name: "Arrow Right", Component: ArrowRightIcon },
  { name: "Star", Component: StarIcon },
  { name: "Arrow Down", Component: ChevronDownIcon },
  { name: "Eye", Component: EyeIcon },
  { name: "Eye Closed", Component: EyeSlashIcon },
  { name: "Folder", Component: FolderIcon },
  { name: "Plus Circle", Component: PlusCircleIcon },
];

export const AllIcons = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, 100px)",
      gap: "20px",
    }}
  >
    {iconList.map(({ name, Component }) => (
      <div key={name} style={{ textAlign: "center" }}>
        <Component width={32} height={32} />
        <div style={{ fontSize: 12, marginTop: 4 }}>{name}</div>
      </div>
    ))}
  </div>
);
