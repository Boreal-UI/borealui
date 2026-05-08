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
  try {
    if (typeof window !== "undefined" && "DOMParser" in window) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      doc
        .querySelectorAll("script, iframe, object, embed, link, meta")
        .forEach((el) => el.remove());

      doc.body.querySelectorAll<HTMLElement>("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const name = attr.name.toLowerCase();
          const val = attr.value;
          if (name.startsWith("on")) el.removeAttribute(attr.name);
          if (
            (name === "href" || name === "src") &&
            /^\s*javascript:/i.test(val)
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
    .replace(/<\/?(script|iframe|object|embed|meta|link)[^>]*>/gi, "")
    .replace(/\son[a-z]+="[^"]*"/gi, "")
    .replace(/\s(href|src)\s*=\s*"(?:\s*javascript:[^"]*)"/gi, "");
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
  }, []);

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
