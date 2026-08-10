import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUpload } from "../src/index.core";
import type { FileUploadProps } from "../src/components/FileUpload/FileUpload.types";
import {
  roundingOptions,
  shadowOptions,
} from "../shared-story-assets/OptionTypes";
import {
  renderThemeVariants,
  renderStateVariants,
  renderOutlineVariants,
  renderGlassVariants,
  renderGlassOutlineVariants,
  renderStateOutlineVariants,
} from "../shared-story-assets/VisualVariantStories";

const meta: Meta<FileUploadProps> = {
  title: "Components/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  args: {
    label: "Upload your document",
    theme: "primary",
    required: false,
  },
};

export default meta;

type Story = StoryObj<FileUploadProps>;

export const Default: Story = {
  render: (args) => {
    const handleSubmit = (files: File[]) => {
      alert(
        `Uploaded ${files.length} file(s): ${files
          .map((f) => f.name)
          .join(", ")}`,
      );
    };

    return <FileUpload {...args} onSubmit={handleSubmit} />;
  },
};

export const MaxFileSizeLimit: Story = {
  args: {
    label: "Upload a file (max 1MB)",
    maxFileSizeBytes: 1024 * 1024, // 1MB
  },
  render: (args) => {
    const handleSubmit = (files: File[]) => {
      alert(`Submitted: ${files.map((f) => f.name).join(", ")}`);
    };

    return <FileUpload {...args} multiple onSubmit={handleSubmit} />;
  },
};

export const AllowedFileTypes: Story = {
  args: {
    label: "Upload PNG or PDF",
    allowedFileTypes: ["image/png", "application/pdf"],
  },
  render: (args) => {
    const handleSubmit = (files: File[]) => {
      alert(`Accepted: ${files.map((f) => f.name).join(", ")}`);
    };

    return <FileUpload {...args} multiple onSubmit={handleSubmit} />;
  },
};

export const FileTypeAndSizeCombined: Story = {
  args: {
    label: "Upload JPG (max 500KB)",
    allowedFileTypes: ["image/jpeg"],
    maxFileSizeBytes: 500 * 1024,
  },
  render: (args) => {
    const handleSubmit = (files: File[]) => {
      alert(`Valid file(s): ${files.map((f) => f.name).join(", ")}`);
    };

    return <FileUpload {...args} multiple onSubmit={handleSubmit} />;
  },
};

export const MultipleFiles: Story = {
  args: {
    multiple: true,
  },
  render: (args) => {
    return (
      <FileUpload
        {...args}
        onSubmit={(files) => console.log("Files submitted:", files)}
      />
    );
  },
};

export const ExternalProgress: Story = {
  render: (args) => {
    const [progress, setProgress] = useState(0);

    return (
      <>
        <FileUpload
          {...args}
          uploadProgress={progress}
          onSubmit={(files) => {
            console.log("Externally submitted:", files);
          }}
        />
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => setProgress((p) => Math.min(p + 10, 100))}>
            Simulate Upload Progress ({progress}%)
          </button>
        </div>
      </>
    );
  },
};

export const ErrorState: Story = {
  args: {
    errorMessage: "File is required.",
    required: true,
  },
  render: (args) => <FileUpload {...args} onSubmit={() => {}} />,
};

export const WithDescription: Story = {
  args: {
    helperText: "Supported formats: .pdf, .docx, .jpg",
  },
  render: (args) => <FileUpload {...args} onSubmit={() => {}} />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => <FileUpload {...args} onSubmit={() => {}} />,
};

export const OutlineRoundingVariants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {roundingOptions.map((rounding) => (
        <div key={rounding}>
          <h4 style={{ marginBottom: "0.5rem", textTransform: "capitalize" }}>
            {rounding} rounding
          </h4>
          <FileUpload
            {...args}
            outlineRounding={rounding}
            label={`Upload (${rounding})`}
            onSubmit={(files) => console.log(`${rounding}:`, files)}
          />
        </div>
      ))}
    </div>
  ),
};

export const OutlineShadowVariants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {shadowOptions.map((shadow) => (
        <div key={shadow}>
          <h4 style={{ marginBottom: "0.5rem", textTransform: "capitalize" }}>
            {shadow} shadow
          </h4>
          <FileUpload
            {...args}
            outlineShadow={shadow}
            label={`Upload (${shadow})`}
            onSubmit={(files) => console.log(`${shadow}:`, files)}
          />
        </div>
      ))}
    </div>
  ),
};

export const ThemeVariants: Story = {
  render: (args) => renderThemeVariants({ component: FileUpload, args }),
};

export const StateVariants: Story = {
  render: (args) => renderStateVariants({ component: FileUpload, args }),
};

export const OutlineVariants: Story = {
  render: (args) => renderOutlineVariants({ component: FileUpload, args }),
};

export const GlassVariants: Story = {
  render: (args) => renderGlassVariants({ component: FileUpload, args }),
};

export const GlassOutlineVariants: Story = {
  render: (args) => renderGlassOutlineVariants({ component: FileUpload, args }),
};

export const StateOutlineVariants: Story = {
  render: (args) => renderStateOutlineVariants({ component: FileUpload, args }),
};
