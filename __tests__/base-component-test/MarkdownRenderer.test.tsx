import { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import BaseMarkdownRenderer from "@/components/MarkdownRenderer/MarkdownRendererBase";
import CoreMarkdownRenderer from "@/components/MarkdownRenderer/core/MarkdownRenderer";
import NextMarkdownRenderer from "@/components/MarkdownRenderer/next/MarkdownRenderer";
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

  it("removes repeated and malformed event-handler attributes", async () => {
    render(
      <BaseMarkdownRenderer
        content={`<img src="/safe.png" onerror="alert(1)" oonnerror="alert(2)" onfocus=alert(3) alt="safe" />`}
        classMap={classNames}
        allowHtml
        data-testid="markdown-renderer"
      />,
    );

    const image = await screen.findByRole("img", { name: "safe" });
    expect(
      [...image.attributes].filter((attribute) =>
        attribute.name.toLowerCase().startsWith("on"),
      ),
    ).toHaveLength(0);
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

  it.each([
    '<a href="https://example.com" target="_blank" rel="opener">Example</a>',
    '<a href="https://example.com" rel="opener" target="_blank">Example</a>',
    '<a href="https://example.com" target="_BLANK">Example</a>',
  ])("protects raw HTML blank-target links regardless of attribute order or target casing", async (content) => {
    render(
      <BaseMarkdownRenderer
        content={content}
        classMap={classNames}
        allowHtml
        data-testid="markdown-renderer"
      />,
    );

    const link = await screen.findByRole("link", { name: "Example" });
    const relTokens = (link.getAttribute("rel") ?? "")
      .split(/\s+/)
      .map((token) => token.toLowerCase());

    expect(relTokens).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
    expect(relTokens).not.toContain("opener");
  });

  it("preserves legitimate rel tokens while enforcing blank-target protection", async () => {
    render(
      <BaseMarkdownRenderer
        content={'<a href="https://example.com" rel="nofollow opener" target="_blank">Example</a>'}
        classMap={classNames}
        allowHtml
        data-testid="markdown-renderer"
      />,
    );

    const link = await screen.findByRole("link", { name: "Example" });
    const relTokens = (link.getAttribute("rel") ?? "")
      .split(/\s+/)
      .map((token) => token.toLowerCase());

    expect(relTokens).toEqual(
      expect.arrayContaining(["nofollow", "noopener", "noreferrer"]),
    );
    expect(relTokens).not.toContain("opener");
  });

  it.each([
    '<a href="https://example.com" target="docs-window" rel="opener nofollow">Example</a>',
    '<a href="https://example.com" rel="ugc opener sponsored" target="preview">Example</a>',
  ])(
    "protects named raw HTML targets while preserving safe rel tokens",
    async (content) => {
      render(
        <BaseMarkdownRenderer
          content={content}
          classMap={classNames}
          allowHtml
          data-testid="markdown-renderer"
        />,
      );

      const link = await screen.findByRole("link", { name: "Example" });
      const relTokens = (link.getAttribute("rel") ?? "")
        .split(/\s+/)
        .map((token) => token.toLowerCase());

      expect(relTokens).toEqual(
        expect.arrayContaining(["noopener", "noreferrer"]),
      );
      expect(relTokens).not.toContain("opener");
    },
  );

  it.each(["javascript:alert(1)", "data:text/html,unsafe", "vbscript:msgbox(1)"])(
    "removes unsafe raw HTML link destination %s",
    async (href) => {
      render(
        <BaseMarkdownRenderer
          content={`<a href="${href}">Unsafe destination</a>`}
          classMap={classNames}
          allowHtml
          data-testid="markdown-renderer"
        />,
      );

      const link = (await screen.findByText("Unsafe destination")).closest("a");
      expect(link).not.toBeNull();
      expect(link).not.toHaveAttribute("href");
    },
  );

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

  it("server-renders ordinary markdown as semantic elements", () => {
    const html = renderToStaticMarkup(
      <BaseMarkdownRenderer
        content={`# Hello

Paragraph text.

- One
- Two

[Example](https://example.com)

\`inline code\``}
        classMap={classNames}
        data-testid="markdown-renderer"
      />,
    );

    expect(html).toContain("<h1>Hello</h1>");
    expect(html).toContain("<p>Paragraph text.</p>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>One</li>");
    expect(html).toContain('<a href="https://example.com"');
    expect(html).toContain("<code>inline code</code>");
    expect(html).not.toContain("&lt;h1&gt;Hello&lt;/h1&gt;");
  });

  it("keeps raw HTML inert during server rendering by default", () => {
    const html = renderToStaticMarkup(
      <BaseMarkdownRenderer
        content="<strong>Unsafe raw HTML</strong>"
        classMap={classNames}
        data-testid="markdown-renderer"
      />,
    );

    expect(html).not.toContain("<strong>");
    expect(html).toContain("&lt;strong&gt;Unsafe raw HTML&lt;/strong&gt;");
  });

  it("server-renders allowed sanitized raw HTML deterministically", () => {
    const html = renderToStaticMarkup(
      <BaseMarkdownRenderer
        content={'<div><strong>Allowed</strong><script>alert(1)</script></div>'}
        classMap={classNames}
        allowHtml
        data-testid="markdown-renderer"
      />,
    );

    expect(html).toContain("<div><strong>Allowed</strong></div>");
    expect(html).not.toContain("<script");
  });

  it.each([
    ["Core", CoreMarkdownRenderer],
    ["Next", NextMarkdownRenderer],
  ])("server-renders semantic Markdown through the %s wrapper", (_name, Renderer) => {
    const html = renderToStaticMarkup(
      <Renderer content="# Wrapper heading" data-testid="markdown-renderer" />,
    );

    expect(html).toContain("<h1>Wrapper heading</h1>");
  });

  it("hydrates representative markdown without recoverable mismatches", async () => {
    const content = `# Hydration heading

Paragraph text with an [Example](https://example.com) link.

- One
- Two`;
    const element = (
      <BaseMarkdownRenderer
        content={content}
        classMap={classNames}
        data-testid="markdown-renderer"
      />
    );
    const serverHtml = renderToString(element);
    const container = document.createElement("div");
    const recoverableErrors: unknown[] = [];
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    const root = hydrateRoot(container, element, {
      onRecoverableError: (error) => recoverableErrors.push(error),
    });

    await act(async () => undefined);

    expect(recoverableErrors).toHaveLength(0);
    expect(container.querySelector("h1")).toHaveTextContent("Hydration heading");
    expect(container.querySelectorAll("li")).toHaveLength(2);
    expect(container.querySelector("a")).toHaveAttribute(
      "href",
      "https://example.com",
    );

    await act(async () => root.unmount());
    container.remove();
  });

  it("hydrates allowed raw table rows with deterministic browser structure", async () => {
    const element = (
      <BaseMarkdownRenderer
        content="<table><tr><td>Cell</td></tr></table>"
        classMap={classNames}
        allowHtml
        data-testid="markdown-renderer"
      />
    );
    const serverHtml = renderToString(element);
    const container = document.createElement("div");
    const recoverableErrors: unknown[] = [];
    container.innerHTML = serverHtml;
    document.body.appendChild(container);

    expect(serverHtml).toContain(
      "<table><tbody><tr><td>Cell</td></tr></tbody></table>",
    );

    const root = hydrateRoot(container, element, {
      onRecoverableError: (error) => recoverableErrors.push(error),
    });

    await act(async () => undefined);

    expect(recoverableErrors).toHaveLength(0);
    expect(container.querySelector("tbody > tr > td")).toHaveTextContent("Cell");

    await act(async () => root.unmount());
    container.remove();
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
