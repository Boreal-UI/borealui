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
      .replace(/\s+on[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?/gi, "")
      .replace(/\s+(?:style|srcdoc)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+)/gi, "")
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
    .replace(/<\s*\/?\s*(script|iframe|object|embed|meta|link|base)\b[^>]*>/gi, "")
    .replace(/<[^>]+>/g, (tag) => stripUnsafeAttributes(tag));
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const BaseMarkdownRenderer: React.FC<BaseMarkdownRendererProps> = ({
  content,
  className = "",
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

  const html = useMemo(() => {
    const trimmed = (content ?? "").trim();
    if (!trimmed) return "";

    const raw = marked.parse(trimmed, {
      async: false,
      renderer,
    });

    const sanitize = sanitizeHtml ?? safeSanitize;
    return sanitize(raw);
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

  if (!html) {
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
    <div
      className={wrapperClass}
      data-testid={testId}
      {...accessibilityProps}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

BaseMarkdownRenderer.displayName = "BaseMarkdownRenderer";
export default BaseMarkdownRenderer;
