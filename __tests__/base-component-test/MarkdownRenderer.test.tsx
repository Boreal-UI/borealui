import { render, screen, waitFor } from "@testing-library/react";
import BaseMarkdownRenderer from "@/components/MarkdownRenderer/MarkdownRendererBase";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const classNames = {
  wrapper: "markdownWrapper",
  loading: "markdownLoading",
  empty: "markdownEmpty",
  shadowMedium: "shadowMedium",
  roundMedium: "roundMedium",
};

describe("BaseMarkdownRenderer", () => {
  it("renders markdown content properly", async () => {
    render(
      <BaseMarkdownRenderer
        content={"# Cypress Markdown Test\n\n**Bold Text**"}
        classMap={classNames}
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Cypress Markdown Test" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Bold Text").tagName).toBe("STRONG");
    });
  });

  it("renders fallback message on empty content", async () => {
    render(
      <BaseMarkdownRenderer
        content=" "
        classMap={classNames}
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const region = screen.getByRole("region");
      expect(region).toBeInTheDocument();
      expect(region).toHaveTextContent("No content available.");
      expect(region).toHaveClass("markdownEmpty");
    });
  });

  it("sets the correct language attribute", async () => {
    render(
      <BaseMarkdownRenderer
        content="*Bonjour*"
        classMap={classNames}
        language="fr"
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("lang", "fr");
    });
  });

  it("applies wrapper, rounding, shadow, and custom className classes", async () => {
    render(
      <BaseMarkdownRenderer
        content="Styled content"
        classMap={classNames}
        rounding="medium"
        shadow="medium"
        className="customClass"
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const region = screen.getByTestId("markdown-renderer");
      expect(region).toHaveClass("markdownWrapper");
      expect(region).toHaveClass("shadowMedium");
      expect(region).toHaveClass("roundMedium");
      expect(region).toHaveClass("customClass");
    });
  });

  it("renders links with secure external link attributes", async () => {
    render(
      <BaseMarkdownRenderer
        content='[OpenAI](https://openai.com "OpenAI Site")'
        classMap={classNames}
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const link = screen.getByRole("link", { name: "OpenAI" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "https://openai.com");
      expect(link).toHaveAttribute("title", "OpenAI Site");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("renders internal links without external link attributes", async () => {
    render(
      <BaseMarkdownRenderer
        content="[Docs](/docs)"
        classMap={classNames}
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const link = screen.getByRole("link", { name: "Docs" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/docs");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    });
  });

  it("renders images with alt, loading, and decoding attributes", async () => {
    render(
      <BaseMarkdownRenderer
        content="![Sample alt text](https://example.com/image.png)"
        classMap={classNames}
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const image = screen.getByRole("img", { name: "Sample alt text" });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/image.png");
      expect(image).toHaveAttribute("alt", "Sample alt text");
      expect(image).toHaveAttribute("loading", "lazy");
      expect(image).toHaveAttribute("decoding", "async");
    });
  });

  it("applies the default region role", async () => {
    render(
      <BaseMarkdownRenderer
        content="Default region"
        classMap={classNames}
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });

  it("supports custom accessibility attributes", async () => {
    render(
      <>
        <h2 id="markdown-title">Rendered Markdown</h2>
        <p id="markdown-description">This section contains article content.</p>
        <BaseMarkdownRenderer
          content="Accessible markdown content"
          classMap={classNames}
          aria-labelledby="markdown-title"
          aria-describedby="markdown-description"
          data-testid="markdown-renderer"
        />
      </>,
    );

    await waitFor(() => {
      const region = screen.getByRole("region", {
        name: "Rendered Markdown",
      });
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute("aria-labelledby", "markdown-title");
      expect(region).toHaveAttribute(
        "aria-describedby",
        "markdown-description",
      );
    });
  });

  it("supports aria-label when provided", async () => {
    render(
      <BaseMarkdownRenderer
        content="Labeled markdown"
        classMap={classNames}
        aria-label="Markdown content region"
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const region = screen.getByRole("region", {
        name: "Markdown content region",
      });
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute("aria-label", "Markdown content region");
    });
  });

  it("supports custom role and tabIndex", async () => {
    render(
      <BaseMarkdownRenderer
        content="Focusable markdown content"
        classMap={classNames}
        role="article"
        tabIndex={0}
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
      expect(article).toHaveAttribute("tabindex", "0");
    });
  });

  it("uses the provided data-testid", async () => {
    render(
      <BaseMarkdownRenderer
        content="Testing custom test id"
        classMap={classNames}
        data-testid="custom-markdown"
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId("custom-markdown")).toBeInTheDocument();
    });
  });

  it("escapes raw HTML by default", async () => {
    render(
      <BaseMarkdownRenderer
        content={`<script>alert("xss")</script><p onclick="alert('xss')">Safe Text</p>`}
        classMap={classNames}
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const region = screen.getByTestId("markdown-renderer");
      expect(region.querySelector("script")).not.toBeInTheDocument();
      expect(region.querySelector("p")).not.toBeInTheDocument();
      expect(region).toHaveTextContent("<script");
      expect(region).toHaveTextContent("Safe Text");
    });
  });

  it("sanitizes unsafe script tags and inline event handlers when HTML is allowed", async () => {
    render(
      <BaseMarkdownRenderer
        content={`<script>alert("xss")</script><p onclick="alert('xss')">Safe Text</p>`}
        classMap={classNames}
        allowHtml
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const region = screen.getByTestId("markdown-renderer");
      expect(region.querySelector("script")).not.toBeInTheDocument();
      expect(screen.getByText("Safe Text")).not.toHaveAttribute("onclick");
    });
  });

  it("sanitizes javascript: urls from links and images", async () => {
    render(
      <BaseMarkdownRenderer
        content={`<a href="javascript:alert('xss')">Bad Link</a><img src="javascript:alert('xss')" alt="bad" />`}
        classMap={classNames}
        allowHtml
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const link = screen.getByText("Bad Link").closest("a");
      if (!link) throw new Error("Expected sanitized link to render");

      expect(link).not.toHaveAttribute("href");
      const image = screen.queryByRole("img", { name: "bad" });
      if (image) expect(image).not.toHaveAttribute("src");
    });
  });

  it("sanitizes unsafe single-quoted and unquoted attributes without DOMParser", async () => {
    const originalDomParser = window.DOMParser;
    Object.defineProperty(window, "DOMParser", {
      configurable: true,
      value: undefined,
    });

    try {
      render(
        <BaseMarkdownRenderer
          content={`<p onclick='alert(1)' onmouseover=alert(2)>Safe Text</p><a href=javascript:alert(3)>Bad Link</a>`}
          classMap={classNames}
          allowHtml
          data-testid="markdown-renderer"
        />,
      );

      await waitFor(() => {
        const region = screen.getByTestId("markdown-renderer");
        expect(region).toHaveTextContent("Safe Text");
        expect(region).not.toHaveTextContent("onclick");
        expect(region).not.toHaveTextContent("onmouseover");
        expect(region).not.toHaveTextContent("javascript:alert");
      });
    } finally {
      Object.defineProperty(window, "DOMParser", {
        configurable: true,
        value: originalDomParser,
      });
    }
  });

  it("uses custom sanitizeHtml when provided", async () => {
    const sanitizeHtml = jest.fn((html: string) =>
      html.replace("Original", "Sanitized"),
    );

    render(
      <BaseMarkdownRenderer
        content="Original content"
        classMap={classNames}
        sanitizeHtml={sanitizeHtml}
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      const region = screen.getByTestId("markdown-renderer");
      expect(sanitizeHtml).toHaveBeenCalled();
      expect(region).toHaveTextContent("Sanitized");
      expect(region).not.toHaveTextContent("Original");
    });
  });

  it("renders complex markdown structures correctly", async () => {
    render(
      <BaseMarkdownRenderer
        content={`# Title

## Subtitle

- Item 1
- Item 2

> Blockquote

\`inline code\``}
        classMap={classNames}
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Title" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Subtitle" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Item 1").tagName).toBe("LI");
      expect(screen.getByText("Item 2").tagName).toBe("LI");
      expect(screen.getByText("Blockquote").closest("blockquote")).toBeTruthy();
      expect(screen.getByText("inline code").tagName).toBe("CODE");
    });
  });

  it("has no accessibility violations with rendered markdown", async () => {
    const { container } = render(
      <>
        <h2 id="a11y-markdown-title">Accessibility Test</h2>
        <BaseMarkdownRenderer
          content={"# Accessibility Test\n\n**Accessible content**"}
          classMap={classNames}
          aria-labelledby="a11y-markdown-title"
          data-testid="markdown-renderer"
        />
      </>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: "Accessibility Test" }),
      ).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations in empty state", async () => {
    const { container } = render(
      <BaseMarkdownRenderer
        content=" "
        classMap={classNames}
        aria-label="Empty markdown region"
        data-testid="markdown-renderer"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: "Empty markdown region" }),
      ).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
