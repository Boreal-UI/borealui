import React, { useMemo } from "react";
import { marked } from "marked";
import { BaseMarkdownRendererProps } from "./MarkdownRenderer.types";
import { combineClassNames } from "../../utils/classNames";
import { capitalize } from "../../utils/capitalize";
import {
  getDefaultRounding,
  getDefaultShadow,
} from "../../config/boreal-style-config";

function safeSanitize(html: string): string {
  const stripUnsafeAttributes = (value: string) =>
    value
      .replace(
        /\s+on[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?/gi,
        "",
      )
      .replace(
        /\s+(?:style|srcdoc)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+)/gi,
        "",
      )
      .replace(
        /\s+(href|src|xlink:href|formaction)\s*=\s*(["']?)\s*(?:javascript|vbscript|data(?!:image\/(?:png|gif|jpeg|jpg|webp|avif))):[^"'\s>]*/gi,
        "",
      );

  try {
    if (
      typeof window !== "undefined" &&
      typeof window.DOMParser === "function"
    ) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      doc
        .querySelectorAll("script, iframe, object, embed, link, meta, base")
        .forEach((el) => el.remove());

      doc.body.querySelectorAll<HTMLElement>("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const name = attr.name.toLowerCase();
          const val = attr.value;
          if (name.startsWith("on")) el.removeAttribute(attr.name);
          if (name === "style" || name === "srcdoc") {
            el.removeAttribute(attr.name);
          }
          if (
            (name === "href" ||
              name === "src" ||
              name === "xlink:href" ||
              name === "formaction") &&
            /^\s*(?:javascript|vbscript|data(?!:image\/(?:png|gif|jpeg|jpg|webp|avif))):/i.test(
              val,
            )
          ) {
            el.removeAttribute(attr.name);
          }
        });
      });

      return doc.body.innerHTML;
    }
  } catch {
    return "";
  }

  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<\s*(script|iframe|object|embed|meta|link|base)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
      "",
    )
    .replace(
      /<\s*\/?\s*(script|iframe|object|embed|meta|link|base)\b[^>]*>/gi,
      "",
    )
    .replace(/<[^>]+>/g, (tag) => stripUnsafeAttributes(tag));
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const safeUrlPattern =
  /^(?:(?:https?|mailto|tel):|\/(?!\/)|#|\?|\.{0,2}\/)/i;

const safeImageUrlPattern =
  /^(?:(?:https?):|\/(?!\/)|\.{0,2}\/|data:image\/(?:png|gif|jpeg|jpg|webp|avif);base64,)/i;

const sanitizeUrl = (url: string, allowImageData = false) => {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const pattern = allowImageData ? safeImageUrlPattern : safeUrlPattern;
  return pattern.test(trimmed) ? trimmed : "";
};

const attributeNameMap: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  colspan: "colSpan",
  rowspan: "rowSpan",
  readonly: "readOnly",
  tabindex: "tabIndex",
};

const allowedHtmlTags = new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "caption",
  "cite",
  "code",
  "dd",
  "del",
  "details",
  "dfn",
  "div",
  "dl",
  "dt",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "ins",
  "kbd",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
  "var",
]);

const voidHtmlTags = new Set(["br", "hr", "img"]);

const getSafeElementProps = (element: Element) => {
  const props: Record<string, string | number | boolean> = {};

  [...element.attributes].forEach((attr) => {
    const name = attr.name.toLowerCase();
    const value = attr.value;

    if (name.startsWith("on") || name === "style" || name === "srcdoc") return;

    if (name === "href" || name === "formaction") {
      const url = sanitizeUrl(value);
      if (url) props[name] = url;
      return;
    }

    if (name === "src") {
      const url = sanitizeUrl(value, true);
      if (url) props.src = url;
      return;
    }

    if (name === "target") {
      props.target = value;
      if (value === "_blank") props.rel = "noopener noreferrer";
      return;
    }

    props[attributeNameMap[name] ?? name] = value;
  });

  return props;
};

const htmlToReactNodes = (
  html: string,
  keyPrefix: string,
): React.ReactNode[] => {
  if (
    typeof window === "undefined" ||
    typeof window.DOMParser !== "function"
  ) {
    return [html];
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  const convertNode = (node: ChildNode, key: string): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const element = node as Element;
    const tagName = element.tagName.toLowerCase();
    const children = [...element.childNodes].map((child, index) =>
      convertNode(child, `${key}-${index}`),
    );

    if (!allowedHtmlTags.has(tagName)) return children;

    if (voidHtmlTags.has(tagName)) {
      return React.createElement(tagName, {
        key,
        ...getSafeElementProps(element),
      });
    }

    return React.createElement(
      tagName,
      { key, ...getSafeElementProps(element) },
      children,
    );
  };

  return [...doc.body.childNodes].map((node, index) =>
    convertNode(node, `${keyPrefix}-${index}`),
  );
};

const BaseMarkdownRenderer: React.FC<BaseMarkdownRendererProps> = ({
  content,
  className,
  language = "en",
  rounding = getDefaultRounding(),
  shadow = getDefaultShadow(),
  role = "region",
  tabIndex,
  allowHtml = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "data-testid": dataTestId,
  testId = dataTestId ?? "markdown-renderer",
  classMap,
  sanitizeHtml,
}) => {
  const renderer = useMemo(() => {
    const r = new marked.Renderer();

    if (!allowHtml) {
      r.html = ({ text }) => escapeHtml(text);
    }

    r.link = ({ href, title, text }) => {
      const url = href ?? "#";
      const isExternal = /^https?:\/\//i.test(url);
      const t = title ? ` title="${escapeHtml(title)}"` : "";
      const target = isExternal ? ` target="_blank"` : "";
      const rel = isExternal ? ` rel="noopener noreferrer"` : "";
      return `<a href="${escapeHtml(url)}"${t}${target}${rel}>${text}</a>`;
    };

    r.image = ({ href, title, text }) => {
      const url = href ?? "";
      const t = title ? ` title="${escapeHtml(title)}"` : "";
      const alt = escapeHtml(text || "");
      return `<img src="${escapeHtml(url)}"${t} alt="${alt}" loading="lazy" decoding="async" />`;
    };

    return r;
  }, [allowHtml]);

  const renderedContent = useMemo(() => {
    const trimmed = (content ?? "").trim();
    if (!trimmed) return null;

    const raw = marked.parse(trimmed, {
      async: false,
      renderer,
    });

    const sanitize = sanitizeHtml ?? safeSanitize;
    return htmlToReactNodes(sanitize(raw), "markdown");
  }, [content, renderer, sanitizeHtml]);

  const wrapperClass = useMemo(
    () =>
      combineClassNames(
        classMap.wrapper,
        shadow && classMap[`shadow${capitalize(shadow)}`],
        rounding && classMap[`round${capitalize(rounding)}`],
        className,
      ),
    [classMap, rounding, shadow, className],
  );

  const accessibilityProps = {
    role,
    lang: language,
    tabIndex,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
  };

  if (!renderedContent) {
    return (
      <div
        className={classMap.empty}
        data-testid={testId}
        {...accessibilityProps}
      >
        <p>No content available.</p>
      </div>
    );
  }

  return (
    <div className={wrapperClass} data-testid={testId} {...accessibilityProps}>
      {renderedContent}
    </div>
  );
};

BaseMarkdownRenderer.displayName = "BaseMarkdownRenderer";
export default BaseMarkdownRenderer;
